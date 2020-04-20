//At this point, we know the creds are at: 
//  req.auth.url, req.auth.username, req.auth.pw

module.exports = async (req, res, next) => {
    var url = req.auth.url;
    var username = req.auth.username;
    var password = req.auth.password;
    var nitro = require('../../lib/nitro')(url);
    try{
        loginRes = await nitro.login(username, password);
    } catch (e) {
        res.status(e.status).send({
            error: e
        });
    }
    req.nitro = nitro;
    next();
}