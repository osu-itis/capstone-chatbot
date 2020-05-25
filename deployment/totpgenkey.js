function randomKey (length, alphabet) {
    var randBytes = require('crypto').randomBytes(length);
    var res = new Array(length);
    var cursor = 0;
    for(var i = 0; i < length; i++) {
        cursor += randBytes[i];
        res[i] = alphabet[cursor % alphabet.length];
    }
    return res.join('');
}
exports.handler = (event, context) => {
    var key = randomKey(32, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567');
    var responseData = {'Value': key};
    response.send(event, context, response.SUCCESS, key);
}
console.log(randomKey(32, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'));

//ex: 35MPKV3DN3ZJSRBGXKOG444VCNEMH4AC