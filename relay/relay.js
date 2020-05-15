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

//This middleware tests our totp password (generated from the shared symmetric key).
//If the totp password is invalid or missing, the request is immeditaely responded to and it will never hit the routes below
app.use(totp_test_mw(process.env.TOTP_KEY, 1));

//If the request makes it this far, it will attempt to log into Nitro.
//This middleware will leave a Nitro object in the request at req.nitro
app.use(nitro_login_mw);

//Each of the express routes below follows the same pattern:
// gather the body as a JSON
// Use the nitro object to make the matching request
// If it throws an error, pass the error to the error handler
// Otherwise send the result as the response body with 200 (OK) at the status

//Note: All request logic is contained within the Nitro object library,
//  This is to keep the file clean and readable.
//  See /lib/nitro/nitro.js to view individual route logic (Also this is where to add more nitro commands for future expansion)

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
    //If the error is an instance of Nitro Error, we know the error came from our nitro object
    //  As such, it has these specific fields to populate the status code and response body
    } else if (err instanceof NitroError) {
        res.status(err.status).send({"error":err})
    //Otherwise something else happened, shouldn't be hitting this block, but it's here anyways
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
//Start the relay
app.listen(port, () => console.log(`Relay listening on port ${port}!`));