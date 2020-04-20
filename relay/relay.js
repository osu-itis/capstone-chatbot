const express = require('express');
const app = express();
const bodyParser = require('body-parser');


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

//Custom express middlewares written
//Test the totp
const totp_test_mw = require('./lib/totp_test_mw');

//Then retrieve credentials
const auth_mw = require('./mw/auth/auth_mw.js');

//Then login to nitro, this leaves the nitro instance at req.nitro
const nitro_login_mw = require('./mw/nitro_login');

app.use(bodyParser.json());

//auth_mw places 3 properties in req.auth: url, username, password
app.use(auth_mw);
app.use(totp_test_mw(process.env.TOTP_KEY, 1));
app.use(nitro_login_mw);


//POST /api/list
app.post('/api/list', validate({body: schema.api_list}), async (req,res) => {

    var body = JSON.parse(JSON.stringify(req.body));
    console.log(JSON.stringify(body));
    nitro = req.nitro;

    results = await nitro.vServerListAllNames();
    if(results.hasOwnProperty("error") && results.error){
        res.status(results.status).send({
            "msg": results.msg,
            "data": results.data
        });
    } else {
        res.status(200).send(results);
    }


});
//POST /api/listall
app.post('/api/listall', validate({body: schema.api_listall}), async (req,res) => {
    var body = JSON.parse(JSON.stringify(req.body));
    console.log(JSON.stringify(body));
    nitro = req.nitro;

    results = await nitro.resourcesListAll();
    if(results.hasOwnProperty("error") && results.error){
        return res.status(results.status).send({
            "msg": results.msg,
            "data": results.data
        });
    } else {
        res.status(200).send(results);
    }


});
//POST /api/listbound
app.post('/api/listbound', validate({body: schema.api_listbound}), async (req,res) => {
    var body = JSON.parse(JSON.stringify(req.body));
    console.log(JSON.stringify(body));
    nitro = req.nitro;
});
//POST /api/status
app.post('/api/status', validate({body: schema.api_status}), async (req,res) => {
    var body = JSON.parse(JSON.stringify(req.body));
    console.log(JSON.stringify(body));
    nitro = req.nitro;

    search = await nitro.findResource(apiCall.target);
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
                            results.vserver[i].type = "vserver";
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
                            results.servicegroup[i].type = "servicegroup";
                            return res.status(200).send(results.servicegroup[i]);
                        }
                    }
                } 
                break;
            case "service":
                results = await nitro.serviceListAllStats();
                if(results.hasOwnProperty("error") && results.error){
                    return res.status(results.status).send({
                        "msg": results.msg,
                        "data": results.data
                    });
                } else {
                    for( i in results.service ){
                        if(apiCall.target == results.service[i].name){
                            results.service[i].type = "service";
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
                            results.server[i].type = "server";
                            return res.status(200).send(results.server[i]);
                        }
                    }
                }
                break;
        }
    }
});
//POST /api/enable
app.post('/api/enable', validate({body: schema.api_enable}), async (req,res) => {
    var body = JSON.parse(JSON.stringify(req.body));
    console.log(JSON.stringify(body));
    nitro = req.nitro;

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
});
//POST /api/disable
app.post('/api/disable', validate({body: schema.api_disable}), async (req,res) => {
    var body = JSON.parse(JSON.stringify(req.body));
    console.log(JSON.stringify(body));
    nitro = req.nitro;

    search = await nitro.findResource(apiCall.target);
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
});

app.use( (err, req, res, next) => {
    let responseData;
    //sends a generic error message if validation fails
    //could send specific information about validation failure by uncommenting line in responseData assignment
    if(err instanceof ValidationError) {
        //console.log(err.message); //logs "espress-jsonschema: Invalid data found"
        responseData = {
            error: 'Bad Request'
            //, validations: err.validationErrors
        };
        res.status(400).send(responseData);
    } else next(err); //pass error if not matched
});

app.listen(port, () => console.log(`Relay listening on port ${port}!`));