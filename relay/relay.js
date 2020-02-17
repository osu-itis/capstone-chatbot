const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const port = process.env.PORT || 3001;

app.use(bodyParser.json());

//currently reflects all json bodies sent to /api endpoint
app.post('/api', (req,res) => {
    if(req.body) {
        const apiCall = JSON.parse(JSON.stringify(req.body));
        console.log(apiCall);
       /* switch(apiCall.command){
            case "status":
                    await axios.post(process.env.RELAY_URL+"api", {
                        name: user_name,
                        id: user_id,
                        command: c_msg.command,
                        target: c_msg.target
                        })
                        .then(async (res) => {
                            //await bot.reply(message, "Body: " + JSON.stringify(res.data));
                        })
                        .catch(async (error) => {
                            //await bot.reply(message, "Error contacting Relay.");
                        })                  
                    break;
                case "remove":
                    await axios.post(process.env.RELAY_URL+"api", {
                        name: user_name,
                        id: user_id,
                        command: c_msg.command,
                        target: c_msg.target
                        })
                        .then(async (res) => {
                            //await bot.reply(message, "Body: " + JSON.stringify(res.data));
                        })
                        .catch(async (error) => {
                            //await bot.reply(message, "Error contacting Relay.");
                        }) 
                    break;
                case "add":
                    await axios.post(process.env.RELAY_URL+"api", {
                        name: user_name,
                        id: user_id,
                        command: c_msg.command,
                        target: c_msg.target
                        })
                        .then(async (res) => {
                            //await bot.reply(message, "Body: " + JSON.stringify(res.data));
                        })
                        .catch(async (error) => {
                            //await bot.reply(message, "Error contacting Relay.");
                        }) 
                    break;
                
        }
        */

        res.status(202).send(apiCall);
    } else {
        res.status(400).send({
            "Error": "Body data not found."
        });
    }
});

app.listen(port, () => console.log(`Relay listening on port ${port}!`));