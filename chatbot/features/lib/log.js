const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

const cloudWatchLogs = new AWS.CloudWatchLogs();
const cwLogGroup = process.env.AWS_CWLOG_GROUPNAME;
const cwLogStream = process.env.AWS_CWLOG_STREAMNAME;

module.exports = {
    /* This function sends the log event to the Log Group and Log Stream specified in env variables.
        To do this, it must retrieve the correct sequence token, and then send the log.
        This is why 2 calls are chained within callbacks.
        No value is returned currently.
    */
    send: (msg) => {
        var params = {
            logEvents: [
                {
                    "message": JSON.stringify(msg),
                    "timestamp": Date.now()
                }
            ],
            logGroupName: cwLogGroup,
            logStreamName: cwLogStream
        };
        cloudWatchLogs.describeLogStreams({logGroupName: cwLogGroup}, (err,data) => {
            if (err){
                console.log(err, err.stack);
            } else {
                console.log(data.logStreams);
                for(index in data.logStreams){
                    if(data.logStreams[index].logStreamName === cwLogStream){
                        params.sequenceToken = data.logStreams[index].uploadSequenceToken;
                        cloudWatchLogs.putLogEvents(params, (err, data) => {
                            if (err){
                                console.log(err, err.stack);
                            } else {
                                //console.log(data);
                                //Everything worked, log event created
                            }
                        });
                    }
                }
            }
        });
    },
    /*  This is specialized for our use case, it will generate objects in a standard format.
    */
    make: (fulltext, req, res) => {
        return {
            userName: req.name,
            userId: req.id,
            userCommand: fulltext,
            statusCode: res.status,
            statusText: res.statusText,
            responseBody: res.data
        };
    }
}