const axios = require('axios');

const username = process.env.NETSCALER_USERNAME;

let password;

fs.readFile('.password', 'utf8', (err, contents) => {
    password = contents;
});

const loginRoute= "nitro/v1/config/login";

//GET
const vserverRoute="nitro/v1/config/lbvserver";
const vserverQueryParams="?attrs=name,totalservices,activeservices";

//GET
const vserverStatusRoute="nitro/v1/stat/lbvserver/";//add vserver name after /
const vserverStatusQueryParam="?statbindings=yes";
//to get statistics of the bound entities, use statbindings=yes

//POST
const serviceGroupDisableRoute="nitro/v1/config/servicegroup?action=disable";
/*
request payload {"servicegroup":{
    "servicegroupname":<string_value>,
    "servername":<string_value>,
    "port":<integer_value>,
    "delay":<Double_value>,
    "graceful":<String_value>
}}
*/