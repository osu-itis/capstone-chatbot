var AWS = require('aws-sdk');
var region = "us-west-2";
var client = new AWS.SecretsManager({
    region: region
});

//This file uses the AWS SDK to query secrets manager for the stored keyvalue pairs that correspond to the user ID.
//If the id doesn't exist, the string "Unauthorized" is thrown, eventually caught and sent to the user.

module.exports = async (id) => {
    //The secrets are stored by unique user ID
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
                //This sets the secret variable as the value we retrieved from SecretsManager
                secret = data.SecretString;
            } else {
                //This won't trigger with our current setup, but it is part of the SDK template given by AWS
                let buff = new Buffer(data.SecretBinary, 'base64');
                decodedBinarySecret = buff.toString('ascii');
            }
        }
    }).promise(); //transforms AWS.Request into a promise so we can use await
    
    //Return the secret, making sure it's parsed into a JSON object.
    return JSON.parse(secret);
}