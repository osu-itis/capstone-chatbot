auth = require('./auth');

module.exports = (req, res, next) => {
    body = JSON.parse(JSON.stringify(req.body));
    id = body.user.id;
    var creds;
    try{
        creds = auth.getCreds(id);
    } catch (e) {
        res.status(401).send({
            error: e
        });
    }
    
    req.auth.url = creds.url;
    req.auth.username = creds.username;
    req.auth.password = creds.password;
    next();
}