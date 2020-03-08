const axios = require('axios');

const fs = require('fs');

//const defaultUsername = process.env.NETSCALER_USERNAME;
//let defaultPassword;

// fs.readFile('.password', 'utf8', (err, contents) => {
//     defaultPassword = contents;
// });

module.exports = (baseURL, version) => {

    const defaultUsername = process.env.NETSCALER_USERNAME;
    let defaultPassword;

    fs.readFile('.password', 'utf8', (err, contents) => {
        defaultPassword = contents;
    });
    let loginRoute, vserverRoute, vserverSGBind, vserverAttrQuery, nameValue, countQueryValue, vserverQueryParams,
        vserverStatusRoute, vserverServicesQuery, vserverStatusQueryParam, serviceGroupRoute,serviceGroupEnable, serviceGroupDisable;
    if (version == "13.0" || version == "12.0"){
        loginRoute= "nitro/v1/config/login";
        vserverRoute="nitro/v1/config/lbvserver";//GET
        vserverSGBind="_servicegroup_binding/" //add to vserverRoute
        vserverAttrQuery="?attrs=";
        nameValue="name";
        countQueryValue="?count=yes";
        vserverQueryParams="?attrs=name,totalservices,activeservices";
        vserverStatusRoute="nitro/v1/stat/lbvserver/";//GET add vserver name after /
        vserverServicesQuery="attrs=servicegroupname,curclntconnections"
        vserverStatusQueryParam="?statbindings=yes"; //to get statistics of the bound entities, use statbindings=yes
        serviceGroupRoute="nitro/v1/config/servicegroup";
        serviceGroupEnable="?action=enable"
        serviceGroupDisable="?action=disable"
    } else {
        throw "Invalid NITRO version selected, choose 12.0 or 13.0"
    }
    return {
        login: async (username, password) => {
            let token = null;
            let url = baseURL+loginRoute;
            console.log(url);
            await axios.post(url,  {
                "login":{
                    "username": username,
                    "password": password
                }
            }).then((res) => {
                token = res.data.sessionid;
            }) 
            .catch((error) => {
                console.log(error);
            })
            return token;
        },
        loginUID: async (UID) => {
            let token = null;
            let url=baseURL+loginRoute;
            console.log(url);
            await axios.post(url,  {
                "login":{
                    "username": defaultUsername,
                    "password": defaultPassword
                }
            }).then((res) => {
                token = res.data.sessionid;
            }) 
            .catch((error) => {
                console.log(error);
            })
            return token;
        },
        vServerListAll: async (token) => {
            let vsList = null;
            let url = baseURL+vserverRoute+vserverAttrQuery+nameValue;
            console.log(url);
            await axios.get(
                url, 
                { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
            }).then(async (res) => {
                vsList = res.data;
            }).catch(async (error) => {
                console.log(error);
            })
            let output = [];
            for (i in vsList.lbvserver){
                output[i] = vsList.lbvserver[i].name;
            }
            return output;
        },
        vServerListServices: async (token, target) => {
            let serviceList = null;
            let url = baseURL+vserverStatusRoute+target+vserverStatusQueryParam+"&"+vserverServicesQuery;
            console.log(url);
            await axios.get(
                url, 
                { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
            }).then(async (res) => {
                serviceList = res.data.lbvserver[0].servicegroupmember;
            }).catch(async (error) => {
                console.log(error);
            })
            console.log(serviceList);
            let output = [];
            for (i in serviceList){
                name = serviceList[i].servicegroupname.split("?");
                conns = serviceList[i].curclntconnections;
                output.push({
                    "name":name[1],
                    "group":name[0],
                    "port":name[2],
                    "connections":conns
                });
            }
            return output;
        },
        vServerCount: async (token) => {
            let vsCount = null;
            let url = baseURL+vserverRoute+countQueryValue;
            console.log(url);
            await axios.get(
                url, 
                { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
            }).then(async (res) => {
                vsCount = res.data;
            }).catch(async (error) => {
                console.log(error);
            })
            return vsCount.lbvserver[0].__count;
        },
        vServerListServiceGroups: async (token, target) => {
            let serviceGroupList;
            let url = baseURL+vserverRoute+vserverSGBind+target;
            console.log(url);
            await axios.get(
                url, 
                { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
            }).then(async (res) => {
                serviceGroupList = res.data;
            }).catch(async (error) => {
                console.log(error);
            })
            return serviceGroupList.lbvserver_servicegroup_binding;
        },
        vServerEnableServer: async (token, serviceGroup, server, port) => {
            let statusCode;
            let url = baseURL+serviceGroupRoute+vserverSGBind+target+serviceGroupEnable;
            console.log(url);
            await axios.post(
                url, 
                { 
                    headers: {"Cookie": "NITRO_AUTH_TOKEN="+token},
                    "servicegroup":{
                        "servicegroupname": serviceGroup,
                        "servername":server,
                        "port":port
                    }
                }
            ).then(async (res) => {
                statusCode = res.status;
            }).catch(async (error) => {
                console.log(error);
            })
            return statusCode;
        },
        vServerDisableServerGraceful: async (token, serviceGroup, server, port) => {
            let statusCode;
            let url = baseURL+serviceGroupRoute+vserverSGBind+target+serviceGroupDisable;
            console.log(url);
            await axios.post(
                url, 
                { 
                    headers: {"Cookie": "NITRO_AUTH_TOKEN="+token},
                    "servicegroup":{
                        "servicegroupname": serviceGroup,
                        "servername":server,
                        "port":port,
                        "delay":0,
                        "graceful":"yes"
                    }
                }
            ).then(async (res) => {
                statusCode = res.status;
            }).catch(async (error) => {
                console.log(error);
            })
            return statusCodeg;
        },
        vServerDisableServer: async (token, serviceGroup, server, port) => {
            let statusCode;
            let url = baseURL+serviceGroupRoute+vserverSGBind+targetserviceGroupDisable;
            console.log(url);
            await axios.post(
                url, 
                { 
                    headers: {"Cookie": "NITRO_AUTH_TOKEN="+token},
                    "servicegroup":{
                        "servicegroupname": serviceGroup,
                        "servername":server,
                        "port":port,
                        "delay":0,
                        "graceful":"no"
                    }
                }
            ).then(async (res) => {
                statusCode = res.status;
            }).catch(async (error) => {
                console.log(error);
            })
            return statusCode;
        }

    }
}