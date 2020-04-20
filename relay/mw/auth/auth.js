csvparser = require('./auth_csv');
sm = require('./auth_aws_sm');

//Any module used here must return an object with this format:
//{
//  username: string
//  password: string
//  url: string
//}

//OR it will throw a string describing the error
module.exports = {
    getCreds: async(id) => {
        return await csvparser(id);
        //return await sm(id);
    }
}