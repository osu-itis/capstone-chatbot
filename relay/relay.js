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

        //This will list all vservers if no target
        //Otherwise it will list all bound entites to a vserver
        case "list":
            if(apiCall.hasOwnProperty("target")) {
                vsList = await nitro.vServerListAllNames();
                for(i in vsList.vserver){
                    if(vsList.vserver[i].name == apiCall.target) {
                        results = await nitro.vServerBoundEntitiesNames(apiCall.target);
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
                results = await nitro.vServerListAllNames();
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

        case "listall":
            results = await nitro.resourcesListAll();
            if(results.hasOwnProperty("error") && results.error){
                return res.status(results.status).send({
                    "msg": results.msg,
                    "data": results.data
                });
            } else {
                res.status(200).send(results);
            }
            break;
        //This will list the status of a resource by name
        case "status":
            search = await nitro.findResource(apiCall.target);
            console.log(search);
            if(search){
                switch(search.type){
                    case "vserver":
                        results = await nitro.vServerListAllStats();
                        if(results.hasOwnProperty("error") && results.error){
                            return res.status(results.status).send({
                                "msg": results.msg,
                                "data": results.data
                            });
                        } else {
                            for( i in results.vserver ){
                                if(apiCall.target == results.vserver[i].name){
                                    return res.status(200).send(results.vserver[i]);
                                }
                            }
                        } 
                        break;
                    case "servicegroup":
                        results = await nitro.serviceGroupListAllStats();
                        if(results.hasOwnProperty("error") && results.error){
                            return res.status(results.status).send({
                                "msg": results.msg,
                                "data": results.data
                            });
                        } else {
                            for( i in results.servicegroup ){
                                if(apiCall.target == results.servicegroup[i].name){
                                    return res.status(200).send(results.servicegroup[i]);
                                }
                            }
                        } 
                        break;
                    case "service":
                        results = await nitro.serviceListAllStats();
                        console.log(results);
                        if(results.hasOwnProperty("error") && results.error){
                            return res.status(results.status).send({
                                "msg": results.msg,
                                "data": results.data
                            });
                        } else {
                            for( i in results.service ){
                                if(apiCall.target == results.service[i].name){
                                    return res.status(200).send(results.service[i]);
                                }
                            }
                        } 
                        break;
                    case "server":
                        results = await nitro.serverListAllStats();
                        if(results.hasOwnProperty("error") && results.error){
                            return res.status(results.status).send({
                                "msg": results.msg,
                                "data": results.data
                            });
                        } else {
                            for( i in results.server ){
                                if(apiCall.target == results.server[i].name){
                                    return res.status(200).send(results.server[i]);
                                }
                            }
                        } 
                        break;
                    default:
                        //this should never be reachable
                        //If search is not false, then it must contain one of thee values
                }
            } else {
                return res.status(404).send({
                    "msg": "Unable to locate resource",
                    "data": apiCall.target + " not found among available resources."
                });
            }
            break;

        //This will enable a resource by name 
        //If no matches, return error
        case "enable":
            search = await nitro.findResource(apiCall.target);
            if(search){
                switch(search.type){
                    case "vserver":
                        result = await nitro.vServerEnable(apiCall.target);
                        break;
                    case "servicegroup":
                        result = await nitro.serviceGroupEnable(apiCall.target);
                        break;
                    case "service":
                        result = await nitro.serviceEnable(apiCall.target);
                        break;
                    case "server":
                        result = await nitro.serverEnable(apiCall.target);
                        break;
                    default:
                        result = {
                            "error": true,
                            "status": 500,
                            "msg": "Internal Server Error",
                            "data": apiCall.target + "unmatched within resource list."
                        };
                }
                if(result.hasOwnProperty("error") && result.error){
                    return res.status(result.status).send({
                        "msg": result.msg,
                        "data": result.data
                    });
                } else {
                    return res.status(200).send(result);
                }
            } else {
                return res.status(404).send({
                    "msg": "Unabled to locate resource",
                    "data": apiCall.target + " not found among available resources."
                });
            }
            break;

        //This will disable a resource by name
        //If no matches, return error
        case "disable":
            search = await nitro.findResource(apiCall.target);
            console.log(search);
            if(search){
                switch(search.type){
                    case "vserver":
                        result = await nitro.vServerDisable(apiCall.target);
                        break;
                    case "servicegroup":
                        result = await nitro.serviceGroupDisable(apiCall.target, true);
                        break;
                    case "service":
                        result = await nitro.serviceDisable(apiCall.target, true);
                        break;
                    case "server":
                        result = await nitro.serverDisable(apiCall.target, true);
                        break;
                    default:
                        result = {
                            "error": true,
                            "status": 500,
                            "msg": "Internal Server Error",
                            "data": apiCall.target + "unmatched within resource list."
                        };
                }
                if(result.hasOwnProperty("error") && result.error){
                    return res.status(result.status).send({
                        "msg": result.msg,
                        "data": result.data
                    });
                } else {
                    return res.status(200).send(result);
                }
            } else {
                return res.status(404).send({
                    "msg": "Unabled to locate resource",
                    "data": apiCall.target + " not found among available resources."
                });
            }
            break;

        //This will immediately (non-gracefully) disable a resource by name
        //If no matches, return error
        case "disablenow":
            search = await nitro.findResource(apiCall.target);
            if(search){
                switch(search.type){
                    case "vserver":
                        result = await nitro.vServerDisable(apiCall.target);
                        break;
                    case "servicegroup":
                        result = await nitro.serviceGroupDisable(apiCall.target, false);
                        break;
                    case "service":
                        result = await nitro.serviceDisable(apiCall.target, false);
                        break;
                    case "server":
                        result = await nitro.serverDisable(apiCall.target, false);
                        break;
                    default:
                        result = {
                            "error": true,
                            "status": 500,
                            "msg": "Internal Server Error",
                            "data": apiCall.target + "unmatched within resource list."
                        };
                }
                if(result.hasOwnProperty("error") && result.error){
                    return res.status(result.status).send({
                        "msg": result.msg,
                        "data": result.data
                    });
                } else {
                    return res.status(200).send(results);
                }
            } else {
                return res.status(404).send({
                    "msg": "Unabled to locate resource",
                    "data": apiCall.target + " not found among available resources."
                });
            }
            break;

        default:
            //input command does not match one of the available options
            //This should be unreachable, as the JSON Schema disallows alternatives
    }
});

app.use( (err, req, res, next) => {
    let responseData;
    //sends very specific information about validation failure
    //may want to change to a more general error message in future for security purposes
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