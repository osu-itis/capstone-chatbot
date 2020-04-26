const axios = require('axios');
const nitroError = require('./nitro/nitro_error');

//This module will return an instance of nitro with the token set.
//If there's an error, it will throw a standardized error object.

module.exports = async (baseURL, username, password) => {
    axios.defaults.baseURL = baseURL;
    var nErr, nitro;
    await axios.post("/nitro/v1/config/login",  {
        "login":{
            "username": username,
            "password": password
        }
    }).then((res) => {
        nitro = require('./nitro/nitro')(baseURL, res.data.sessionid);
    }) 
    .catch((error) => {
        nErr = nitroError(error);
    });
    if (nitro) return nitro;
    else throw nErr;
}
