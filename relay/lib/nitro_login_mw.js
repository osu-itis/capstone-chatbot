//Because auth_mw runs before this, we know the creds are at: 
//  req.auth.url, req.auth.username, req.auth.pw

nitroLogin = require("./nitro_login");

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