const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');

require('dotenv').config();

//generate random string:
//Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15)

//const totp = require('./lib/totp_test_mw')

const port = process.env.PORT || 3001;
const baseURL = process.env.NETSCALER_URL;

//json validation setup
var { Validator, ValidationError } = require('express-json-validator-middleware');
var validator = new Validator({allErrors: true});
var validate = validator.validate;

const schema = require('require-all')(__dirname + '/schema');
const totp_test_mw = require('./lib/totp_test_mw');

var nitro = require('./lib/nitro')(baseURL, "13.0");

app.use(bodyParser.json());
app.use(totp_test_mw(process.env.TOTP_KEY, 1));
//was app.use(totp(process.env.TOTP_KEY, 1));

//currently reflects all json bodies sent to /api endpoint
app.post('/api', validate({body: schema.api_schema }), async (req,res) => {
    var apiCall = JSON.parse(JSON.stringify(req.body))
    console.log(JSON.stringify(apiCall));
    try{
        token = await nitro.loginUID(apiCall.id);
    } catch(e){ 
        console.log(e);
        res.status(500).send({
            "Error": "Unable to contact server.",
            "Msg": e
        }); 
    }
    
    switch(apiCall.command){
        case "listvservers":
            output = await nitro.vServerListAll(token);
            if(output != null){
                res.status(200).send(output);
            } else {
                res.status(400).send(output);
            }
            break;
        case "listservices":
            output = await nitro.vServerListServices(token, apiCall.target);
            if(output != null){
                res.status(200).send(output);
            } else {
                res.status(400).send(output);
            }
            break;
        case "countvservers":
            output = await nitro.vServerCount(token);
            if(output != null){
                res.status(200).send(String(output));
            } else {
                res.status(400).send(String(output));
            }
            break;
        case "listservicegroups":
            output = await nitro.vServerListServiceGroups(token, apiCall.target);
            if(output != null){
                res.status(200).send(output);
            } else {
                res.status(400).send(output);
            }
            break;
        case "enable":
            output = await nitro.vServerEnableServer(token, apiCall.target);
            if(output != null){
                res.status(200).send(output);
            } else {
                res.status(400).send(output);
            }
            break;
        case "disable":
            output = await nitro.vServerDisableServerGraceful(token, apiCall.target);
            if(output != null){
                res.status(200).send(output);
            } else {
                res.status(400).send(output);
            }
            break;
        case "disablenow":
            output = await nitro.vServerDisableServer(token, apiCall.target);
            if(output != null){
                res.status(200).send(output);
            } else {
                res.status(400).send(output);
            }
            break; 
        }
    }
);

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
})

app.listen(port, () => console.log(`Relay listening on port ${port}!`));