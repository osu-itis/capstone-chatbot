const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');

require('dotenv').config();


const port = process.env.PORT || 3001;
const baseURL = process.env.NETSCALER_URL;
const username = process.env.NETSCALER_USERNAME;

fs.readFile('.password', 'utf8', (err, contents) => {
    password = contents;
});

const loginRoute= "nitro/v1/config/login";

//GET
const vserverRoute="nitro/v1/config/lbvserver";
const vserverQueryParams="?attrs=name,totalservices,activeservices";

//GET
const vserverStatusRoute="nitro/v1/stat/lbvserver/";//add vserver name after /
const vserverStatusQueryParam="?statbindings=yes";
//to get statistics of the bound entities, use statbindings=yes

//POST
const serviceGroupDisableRoute="nitro/v1/config/servicegroup?action=disable";
/*
request payload {"servicegroup":{
    "servicegroupname":<string_value>,
    "servername":<string_value>,
    "port":<integer_value>,
    "delay":<Double_value>,
    "graceful":<String_value>
}}
*/

app.use(bodyParser.json());

//currently reflects all json bodies sent to /api endpoint
app.post('/api', async (req,res) => {
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