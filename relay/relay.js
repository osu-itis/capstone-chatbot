const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//const fs = require('fs');
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
const lib = require('require-all')(__dirname + '/lib');


app.use(bodyParser.json());
app.use(lib.totp_test_mw(process.env.TOTP_KEY, 1));
//was app.use(totp(process.env.TOTP_KEY, 1));

//currently reflects all json bodies sent to /api endpoint
app.post('/api', validate({body: schema.apiCall }), async (req,res) => {
    var apiCall;
    //console.log(JSON.stringify(req));
    if(req.body) {
        console.log("Body OK");
        apiCall = JSON.parse(JSON.stringify(req.body));
    } else {
        console.log("Body data not found")
        res.status(400).send({
            "Error": "Body data not found."
        });
    }
    if(!apiCall.name || !apiCall.id || !apiCall.command || !apiCall.target) {
        console.log("Field missing from body");
        res.status(400).send({
            "Error": "Field missing from body."
        });
    } else {
        console.log(JSON.stringify(apiCall));
        //console.log(baseURL+loginRoute);
        try{ 
            //console.log(cookie);
            token = await doLogin(apiCall.id);
            //res.status(200).send({"Cookie":cookie});
        } catch(e){ 
            console.log(e);
            res.status(500).send({
                "Error": "Unable to contact server.",
                "Msg": e
            }); 
        }
        
        switch(apiCall.command){
            case "list":
                await axios.get(baseURL+vserverStatusRoute+apiCall.target+vserverStatusQueryParam, {
                    headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
                    })
                    .then(async (response) => {
                        res.status(200).send(JSON.stringify(response.data));
                        //await bot.reply(message, "Body: " + JSON.stringify(res.data));
                    })
                    .catch(async (error) => {
                        console.log(error);
                        //await bot.reply(message, "Error contacting Relay.");
                    })                  
                break;   
            case "status":
                await axios.post(baseURL+"", {
                    headers: {Cookie: cookie}
                    })
                    .then(async (response) => {
                        //await bot.reply(message, "Body: " + JSON.stringify(res.data));
                    })
                    .catch(async (error) => {
                        //await bot.reply(message, "Error contacting Relay.");
                    })                  
                break;
            case "remove":
                await axios.post(baseURL+"", {
                    
                    })
                    .then(async (response) => {
                        //await bot.reply(message, "Body: " + JSON.stringify(res.data));
                    })
                    .catch(async (error) => {
                        //await bot.reply(message, "Error contacting Relay.");
                    }) 
                break;
            case "add":
                await axios.post(baseURL+"", {
                    
                    })
                    .then(async (response) => {
                        //await bot.reply(message, "Body: " + JSON.stringify(res.data));
                    })
                    .catch(async (error) => {
                        //await bot.reply(message, "Error contacting Relay.");
                    }) 
                break;   
        }
    }
    //res.status(202).send(apiCall);
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
})

app.listen(port, () => console.log(`Relay listening on port ${port}!`));

async function doLogin(uid){
    cookie = null;
    token = null;
    await axios.post(baseURL+loginRoute,  {
        "login":{
            "username": username,
            "password": password
        }
    }).then((res) => {
        cookie = res.headers["set-cookie"];
        token = res.data.sessionid;
        //console.log(cookie);
    }) 
    .catch((error) => {
        console.log(error);
        return error;
    })
    //return cookie;
    return token;
}