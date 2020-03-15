const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');

require('dotenv').config();

//generate random string:
//Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15)

const port = process.env.PORT || 3001;
const baseURL = process.env.NETSCALER_URL;

//json validation setup
var { Validator, ValidationError } = require('express-json-validator-middleware');
var validator = new Validator({allErrors: true});
var validate = validator.validate;

const schema = require('require-all')(__dirname + '/schema');
const totp_test_mw = require('./lib/totp_test_mw');

app.use(bodyParser.json());
app.use(totp_test_mw(process.env.TOTP_KEY, 1));

//currently reflects all json bodies sent to /api endpoint
app.post('/api', validate({body: schema.api_schema }), async (req,res) => {
    var apiCall = JSON.parse(JSON.stringify(req.body))
    console.log(JSON.stringify(apiCall));

    //make a new nitro with every request, this clears the token;
    var nitro = require('./lib/nitro')(baseURL);

    //Login using testing route (admin creds)
    loginRes = await nitro.login();
    if(loginRes.hasOwnProperty("error") && loginRes.error){
        console.log(loginRes);
        res.status(loginRes.status).send({
            "msg": loginRes.msg,
            "data": loginRes.data
        });
    }

    //controls the flow of calls to the netscalers
    switch(apiCall.command) {
        case "list":
            if(apiCall.hasOwnProperty("target")) {
                //This will list servers/service groups for a vserver
                //if vserver exists
                vServers = await nitro.vServerListAll();
                for(i in vServers){
                    if(vServers[i] == apiCall.target) {
                        //Query and return JSON with service groups and servers within service group
                        results = await nitro.vServerBoundEntities(apiCall.target);
                        if(results.hasOwnProperty("error") && results.error){
                            return res.status(results.status).send({
                                "msg": results.msg,
                                "data": results.data
                            });
                        } else {
                            return res.status(200).send(results);
                        }                        
                    }
                }
                //if vserver doesn't exist, return an error
                res.status(404).send({
                    "msg": "vServer not found."
                });
            } else {
                //List all vservers
                results = await nitro.vServerListAll();
                if(results.hasOwnProperty("error") && results.error){
                    res.status(results.status).send({
                        "msg": results.msg,
                        "data": results.data
                    });
                } else {
                    res.status(200).send(results);
                }
            }
            break;
        case "status":
            resources = nitro.resourcesListAll();
            for(i in resources.vservers){
                if(resources.vservers == apiCall.target){
                    //it's a vserver, get all info
                }
            }
            for(i in resources.servicegroups){
                if(resources.servicegroups == apiCall.target){
                    //it's a servicegroup, get all info
                }
            }
            for(i in resources.services){
                if(resources.services == apiCall.target){
                    //it's a service, get all info
                }
            }
            for(i in resources.servers){
                if(resources.servers == apiCall.target){
                    //it's a server, get all info
                }
            }
            //this will take the target, find it within the vservers/servicegroups/servers, and return their status
            //This should match all with the same exact name

            //Query to find all resource names
                //return each matching as an elem of an array, vserver, servicegroup, and service will each have different information connected.
            
            //If no matches, then return an error
            break;
        case "enable":
            //This will enable a specific service within a service group

            //search to find a service that exactly matches the name

            //If no matches, return error
            break;
        case "disable":
            //This will disable a specific service within a service group

            //search to find a service that exactly matches the name

            //If no matches, return error
            break;
        case "disablenow":
            //this will immediately disable a specific service within a service group

            //search to find a service that exactly matches the name

            //If no matches, return error
            break;
        default:
            //input command does not match one of the available options
            //This should be unreachable, as the JSON Schema should not allow anything but...
            //Regardless, place an error message.
    }
    //if I made it this far, something isn't working or isn't implemented
    //So we can pass to next(), which should 404
});

app.use( (err, req, res, next) => {
    let responseData;
    //sends very specific information about validation failure
    //may want to change to a general error message in future for security purposes
    if(err instanceof ValidationError) {
        console.log(err.message); //logs "espress-jsonschema: Invalid data found"
        responseData = {
            statusText: 'Bad Request',
            validations: err.validationErrors
        };
        res.status(400).send(responseData);
    } else next(err); //pass error if not matched
});

app.listen(port, () => console.log(`Relay listening on port ${port}!`));