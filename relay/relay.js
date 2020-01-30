const express = require('express');
const app = express();
const expressip = require('express-ip');
require('dotenv').config();


const port = process.env.PORT;
const chatbot_ip = process.env.CHATBOT_IP;

app.use(expressip().getIpInfoMiddleware);

app.get('/', (req,res) => {
    console.log(req.ipInfo);
    if(req.ip == chatbot_ip){
        console.log(`${req.ip} and ${chatbot_ip} Match. Everything OK.`);
        res.status(200);
        res.send("OK");
    } else {
        console.log(`${req.ip} Not recognized.`)
        res.status(404);
        res.send("Nothing here, go away!");
    }
});

app.listen(port, () => console.log(`Relay listening on port ${port}!\nAccepting requests from: ${chatbot_ip} only.`));