//Because auth_mw runs before this, we know the creds are at: 
//  req.auth.url, req.auth.username, req.auth.pw

nitroLogin = require("./nitro_login");

//This middleware uses the nitro_login file, which returns an instance of nitro, which has been logged into the server.
// This internally maintains the token needed for further requests, However the object is destroyed after a response is sent to the user.
// This is to avoid saving any credentials locally, also removeing the need to handle credentials at the top level.
module.exports = async (req, res, next) => {
    var url = req.auth.url;
    var username = req.auth.username;
    var password = req.auth.password;
    try{
        var nitro = await nitroLogin(url, username, password);
    } catch (e) {
        res.status(e.status).send({
            error: e
        });
    }
    req.nitro = nitro;
    next();
}