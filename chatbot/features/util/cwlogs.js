const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

const cloudWatchLogs = new AWS.CloudWatchLogs();

module.exports = (group, stream) => {
    
    cwLogGroup = group;
    cwLogStream = stream;
    
    return {
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
                    // NOTE: Sometimes this call will fail when using the emulator with an old conversation.
                    // Potentially after pausing the developement virtual machine.
                    // This has only been observed in a local environment
                    console.log("Describe Log Stream Error:\n", err, err.stack);
                } else {
                    console.log(data.logStreams);
                    for(index in data.logStreams){
                        if(data.logStreams[index].logStreamName === cwLogStream){
                            params.sequenceToken = data.logStreams[index].uploadSequenceToken;
                            cloudWatchLogs.putLogEvents(params, (err, data) => {
                                if (err){
                                    console.log("Put LogEvent Error:\n", err, err.stack);
                                } else {
                                    //It worked.
                                }
                            });
                        }
                    }
                }
            });
        },
        /*  This is specialized for our use case, it will generate objects in a standard format.
        */
        make: (request, res) => {
            return {
                user: request.user,
                command: request.command,
                statusCode: res.status,
                statusText: res.statusText,
                responseBody: res.data
            };
        }
    };
}