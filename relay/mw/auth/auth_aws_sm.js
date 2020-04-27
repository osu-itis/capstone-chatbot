var AWS = require('aws-sdk');
var region = "us-west-2";
var client = new AWS.SecretsManager({
    region: region
});

module.exports = async (id) => {
    secretName = id;
    console.log(id);
    var secret;
    await client.getSecretValue({SecretId: secretName}, async (err, data) => {
        if (err) {
            if(err.code === 'DecryptionFailureException') throw err;
            else if(err.code === 'InternalServiceErrorException') throw err;
            else if(err.code === 'InvalidParameterException') throw err;
            else if(err.code === 'InvalidRequestException') throw err;
            else if(err.code === 'ResourceNotFoundException'){
                //user does not exist in secret's manager
                throw err;
            } 
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