var AWS = require('aws-sdk');
var region = "us-west-2";
var client = new AWS.SecretsManager({
    region: region
});

module.exports = async (id) => {
    secretName = id;
    var secret;
    await client.getSecretValue({SecretId: secretName}, async (err, data) => {
        if (err) {
            //Can't decrypt the protected secret text
            if(err.code === 'DecryptionFailureException') throw "Internal Error";
            //AWS Server-Side Error
            else if(err.code === 'InternalServiceErrorException') throw "Internal Error";
            //Invalid value for Param
            else if(err.code === 'InvalidParameterException') throw "Internal Error";
            //Param value not valid for current state of resource
            else if(err.code === 'InvalidRequestException') throw "Internal Error";
            //id isn't a valid name (i.e. user not authorized)
            else if(err.code === 'ResourceNotFoundException') throw "Unauthorized"
        } else {
            if('SecretString' in data) {
                secret = data.SecretString;
            } else {
                let buff = new Buffer(data.SecretBinary, 'base64');
                decodedBinarySecret = buff.toString('ascii');
            }
        }
    }).promise(); //transforms AWS.Request into a promise so we can use await
    return JSON.parse(secret);
}