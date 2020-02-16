const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 3001;

app.use(bodyParser.json());

//currently reflects all json bodies sent to /api endpoint
app.post('/api', (req,res) => {
    if(req.body) {
        const apiCall = JSON.parse(JSON.stringify(req.body));
        console.log(apiCall);
        res.status(202).send(apiCall);
    } else {
        res.status(400).send({
            "Error": "Body data not found."
        });
    }
});

app.listen(port, () => console.log(`Relay listening on port ${port}!`));