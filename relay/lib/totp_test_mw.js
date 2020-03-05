totpTest = require('./totp_test');

module.exports = (totpKey, offset) => {
    return (req, res, next) => {
        body = JSON.parse(JSON.stringify(req.body));
        otp = req.body.totp;
        totpTest.setAllowedOffset(offset);
        if(totpTest.testToken(totpKey, otp)){
            next();
        } else {
            res.status(401).send({
                error: "Not authorized to send requests to this server."
            });
        }
    }
};