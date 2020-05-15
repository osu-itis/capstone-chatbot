auth = require('./auth');

//This file is used at a middleware by express in relay.js
// Internally, this relies on auth.js (which in turn can use whatever method to retrieve credentials)
module.exports = async (req, res, next) => {
    body = JSON.parse(JSON.stringify(req.body));
    //Need to check that id is of the exactly format with a regex.
    //Otherwise return an error.
    var idRegex = /^[a-f0-9]{8}\-([a-f0-9]{4}\-){3}[a-f0-9]{12}$/g;
    if(body.hasOwnProperty("user") && body.user.hasOwnProperty("id") && idRegex.test(body.user.id)){
        id = body.user.id;
        var creds;
        try{
            creds = await auth.getCreds(id);
            //add fields to req object and pass to our routes
            //new fields are: url, username, password
            req.auth = creds;
            next();
        } catch (e) {
            return res.status(401).send({
                error: e
            });
        }
    } else {
        //If the initial request is malformed, we'll immediately send a response to the frontend
        res.status(400).send({
            error: {
                status: 400,
                msg: "Bad Request",
                data: "user.id field missing or invalid format."
            }
        });
    }
}