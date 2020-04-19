const axios = require('axios');
var totpGen = require('./totp_gen_mod');

const logGroup = 'NitroChatbot';
const logStream = 'UserLogs'
const log_lib = require('./cwlogs')(logGroup, logStream);

//This export expects a baseURL, and a valid totpKey (BASE32) when created.
//When using it, it expects a path, along with a user and command object for the relay to use.
//The standard form for these objects are created with get_user.js and make_cmd_obj.js

//Each call returns an object formatted in this way:
/*
    {
        error: bool,
        status: http status code,
        statusText: info about the returned result,
        data: internal object with additional data, dependant on status code (more below)
    }

    504 error, data contains 'request' property with the full request sent
    500 error, data contains 'error' with an error message

    //NOTE: may conflict with error codes from relay (504 and 500 are generated locally)
*/
module.exports = (baseURL, totpKey) => {
    
    totpGen.setKey(totpKey);

    axios.defaults.baseURL = baseURL;

    return async (path, usr, cmd) => {
        //create standardized request format
        //the result looks like this:
        /*
        {
            user: {
                name: string
                id: string, xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
            },
            command: {
                command: string [list|listall|listbound|status|enable|disable]
                target: string (if command == [listbound|status|enable|disable] )
                delay: number (if command == disable)
            },
            totp: number, 6-digits
        }
        */
        request = {
            user: usr,
            command: cmd,
            totp: totpGen.getToken()
        };

        console.log(path);
        console.log(JSON.stringify(request));

        //makes post call to relay
        await axios.post(path, request)
            .then(async (response) => {
                //if successful, we log the message to cloudwatchlogs
                log_lib.send(log_lib.make(request, response));
                //and return the response
                return {
                    error: false,
                    status: res.status,
                    statusText: res.statusText,
                    data: res.data
                };
            })
            .catch(async (error) => {
                if(error.response){
                    //we reach this block if the relay gives us a bad status code.
                    //we want to log this, and return the reponse
                    log_lib.send(log_lib.make(request, error.response));
                    return {
                        error: true,
                        status: error.response.status,
                        statusText: error.response.statusText,
                        data: error.response.data
                    };
                } else if (error.request) {
                    //request was made, but no reponse received.
                    //no log here
                    return {
                        error: true,
                        status: 504,
                        statusText: "No response from relay",
                        data: {
                            request: error.request
                        }
                    };
                } else {
                    //something else happened (some internal error):
                    //again, no log
                    return {
                        error: true,
                        status: 500,
                        statusText: "Unexpected error sending request",
                        data: {
                            error: error.message
                        }
                    };
                }
            });
    }
}