const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const NitroError = require('./lib/nitro/nitro_error');

require('dotenv').config();

const port = process.env.PORT || 3001;

//json validation setup
var { Validator, ValidationError } = require('express-json-validator-middleware');
var validator = new Validator({allErrors: true});
var validate = validator.validate;

const schema = require('require-all')(__dirname + '/schema');

//Custom express middlewares written
//Test the totp
const totp_test_mw = require('./mw/totp/totp_test_mw');

//Then retrieve credentials
const auth_mw = require('./mw/auth/auth_mw.js');

//Then login to nitro, this leaves the nitro instance at req.nitro
const nitro_login_mw = require('./lib/nitro_login_mw');

app.use(bodyParser.json());

//auth_mw places 3 properties in req.auth: url, username, password
app.use(auth_mw);
app.use(totp_test_mw(process.env.TOTP_KEY, 1));
app.use(nitro_login_mw);

//POST /api/listall
app.post('/api/listall', validate({body: schema.api_listall_schema}), async (req, res, next) => {
    var body = JSON.parse(JSON.stringify(req.body));
    console.log(JSON.stringify(body));
    try {
        var results = await req.nitro.listAllResources();
    } catch (e) {
        next(e);
    }
    res.status(200).send(results);
});
//POST /api/listbound
app.post('/api/listbound', validate({body: schema.api_listbound_schema}), async (req, res, next) => {
    var body = JSON.parse(JSON.stringify(req.body));
    console.log(JSON.stringify(body));
    try {
        var results = await req.nitro.listBoundResourcesByName(body.command.target);
    } catch (e) {
        next(e);
    }
    res.status(200).send(results);
});
//POST /api/list
app.post('/api/list', validate({body: schema.api_list_schema}), async (req, res, next) => {
    var body = JSON.parse(JSON.stringify(req.body));
    console.log(JSON.stringify(body));
    try {
        var results = await req.nitro.listVServers();
    } catch (e) {
        next(e);
    }
    res.status(200).send(results);
});
//POST /api/status
app.post('/api/status', validate({body: schema.api_status_schema}), async (req, res, next) => {
    var body = JSON.parse(JSON.stringify(req.body));
    console.log(JSON.stringify(body));
    
    try {
        var results = await req.nitro.getResourceStatusByName(body.command.target);
    } catch (e) {
        next(e);
    }
    res.status(200).send(results);
});
//POST /api/enable
app.post('/api/enable', validate({body: schema.api_enable_schema}), async (req, res, next) => {
    var body = JSON.parse(JSON.stringify(req.body));
    console.log(JSON.stringify(body));

    try {
        var results = await req.nitro.enableResourceByName(body.command.target);
    } catch (e) {
        next(e);
    }
    res.status(200).send(results);
});
//POST /api/disable
app.post('/api/disable', validate({body: schema.api_disable_schema}), async (req, res, next) => {
    var body = JSON.parse(JSON.stringify(req.body));
    console.log(JSON.stringify(body));

    try {
        var results = await req.nitro.disableResourceByName(body.command.target, body.command.delay, true);
    } catch (e) {
        next(e);
    }
    res.status(200).send(results);
});
//POST /api/disablenow
app.post('/api/disablenow', validate({body: schema.api_disablenow_schema}), async (req, res, next) => {
    var body = JSON.parse(JSON.stringify(req.body));
    console.log(JSON.stringify(body));

    try {
        var results = await req.nitro.disableResourceByName(body.command.target, body.command.delay, false);
    } catch (e) {
        next(e);
    }
    res.status(200).send(results);
});
app.use( (err, req, res, next) => {
    let responseData;
    //sends a generic error message if validation fails
    //could send specific information about validation failure by uncommenting line in responseData assignment
    if(err instanceof ValidationError) {
        responseData = {
            error: {
                "status": 400,
                "msg": "Bad Request",
                "data": err.validationErrors
            }
        };
        res.status(400).send(responseData);
    } else if (err instanceof NitroError) {
        res.status(err.status).send({"error":err})
    } else {
        next(err); //pass error if not matched
    }
});
//This is the 404 route. For invalid requests, this reponse is returned.
app.use('*', (req, res) => {
    res.send(404).send({
        "error": {
            "status": 404,
            "msg": "Resource or Method Invalid"
        }
    });
});
app.listen(port, () => console.log(`Relay listening on port ${port}!`));