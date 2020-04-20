totpTest = require('./totp_test');

module.exports = (totpKey, offset) => {
    return (req, res, next) => {
        body = JSON.parse(JSON.stringify(req.body));
        //Since this runs before our schema check, we need to be sure the totp was included
        if(req.body.hasOwnProperty(totp)) {
            otp = req.body.totp;
            totpTest.setAllowedOffset(offset);
            if(totpTest.testToken(totpKey, otp)){
                next();
            } else {
                res.status(401).send({
                    error: "Not authorized to send requests to this server."
                });
            }
        } else {
            //no totp included
            res.status(400).send({
                error: ""
            })
        }
        
    }
};