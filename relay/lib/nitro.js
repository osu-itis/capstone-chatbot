const axios = require('axios');
const nitroUtil = require('./nitro_util');
const nitroError = require('./nitro_error');
const nitroList = require('./nitro_list');
const nitroListAll = require('./nitro_list_all');

//const fs = require('fs');
//const defaultUsername = process.env.NETSCALER_USERNAME;
//let defaultPassword;
// fs.readFile('.password', 'utf8', (err, contents) => {
//     defaultPassword = contents;
// });

module.exports = (baseURL) => {

    //This should be used for testing purposes only
    //with different functionality implemented later
    //using the loginWithCreds function instead
    const defaultUsername = process.env.NETSCALER_USERNAME;
    const defaultPassword = process.env.NETSCALER_PASSWORD;

    let token = null;

    //If version differences are found:
    //    Add version param to export and uncomment below
    // if (version != "13.0" && version != "12.0"){
    //     throw "Invalid NITRO version selected, choose 12.0 or 13.0";
    // } else {
    //     //No differences to account for currently
    // }

    return {
        //POST /nitro/v1/config/login
        //logs in with given credentials, token is stored and true is returned.
        loginWithCreds: async (username, password) => {
            let output;
            let url = baseURL+"/nitro/v1/config/login";
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
                output = nitroError(error);
            });
            if (output) return output;
            else return true;
        },
        //POST /nitro/v1/config/login
        //logs in with default credentials
        //using this implementation in production is insecure.
        //true is returned if successful
        login: async () => {
            let output;
            let url=baseURL+"/nitro/v1/config/login";
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
                output = nitroError(error);
            });
            if (output) return output;
            else return true;
        },
        //This function runs all the list commands, and returns them
        resourcesListAll: async () => {
            return await nitroListAll(baseURL, token);
        },
        //This function runs all the list commands, and returns them
        findResource: async (target) => {
            resources = nitroUtil.flattenResAll(await nitroListAll(baseURL, token));
            for(i in resources){
                if(target == resources[i].name){
                    return {
                        "name": resources[i].name,
                        "type": resources[i].type
                    };
                }
            }
            return false;
        },

        vServerListAllStats: async() => {
            return await nitroList.vServerListAllStats(baseURL,token);
        },

        vServerListAllNames: async() => {
            return await nitroList.vServerListAllNames(baseURL,token);
        },

        serviceGroupListAllStats: async() => {
            return await nitroList.serviceGroupListAllStats(baseURL,token);
        },

        serviceGroupListAllNames: async() => {
            return await nitroList.serviceGroupListAllNames(baseURL,token);
        },

        serviceListAllStats: async() => {
            return await nitroList.serviceListAllStats(baseURL,token);
        },

        serviceListAllNames: async() => {
            return await nitroList.serviceListAllNames(baseURL,token);
        },

        serverListAllStats: async() => {
            return await nitroList.serverListAllStats(baseURL,token);
        },

        serverListAllNames: async() => {
            return await nitroList.serverListAllNames(baseURL,token);
        },
        
        // GET /nitro/v1/stat/lbvserver/TARGET?statbindings=yes&attrs=servicegroupname,primaryipaddress,primaryport,state,curclntconnections,cursrvrconnections,svrestablishedconn,name
        //returns all information for all bound entites for a given vserver
        vServerBoundEntities: async (target) => {
            let output = {};
            let entList = null;
            let url = baseURL+"/nitro/v1/stat/lbvserver/"+target+"?statbindings=yes&attrs="+
                "servicegroupname,primaryipaddress,primaryport,state,"+
                "curclntconnections,cursrvrconnections,svrestablishedconn,name";
            console.log(url);
            await axios.get(
                url, 
                { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
            }).then(async (res) => {
                //assuming only 1 entry here, since it's a specific search
                entList = res.data.lbvserver[0];
                output.name=entList.name;
                output.ip=entList.primaryipaddress;
                output.port=entList.primaryport;
                output.state=entList.state;
                output.clientconnections=entList.curclntconnections;
                output.sgmem = [];
                for (i in entList.servicegroupmember){
                    name = entList.servicegroupmember[i].servicegroupname.split("?");
                    output.sgmem.push({
                        "servicegroup": name[0],
                        "servername": name[1],
                        "ip": entList.servicegroupmember[i].primaryipaddress,
                        "port": entList.servicegroupmember[i].primaryport,
                        "state": entList.servicegroupmember[i].state,
                        "clientconnections": entList.servicegroupmember[i].curclntconnections,
                        "serverconnections": entList.servicegroupmember[i].cursrvrconnections,
                        "serverestablishedconnections": entList.servicegroupmember[i].svrestablishedconn
                    });
                }
                output.service = [];
                for (i in entList.service){
                    output.service.push({
                        "name": entList.service[i].name,
                        "ip": entList.service[i].primaryipaddress,
                        "port": entList.service[i].primaryport,
                        "state": entList.service[i].state,
                        "clientconnections": entList.service[i].curclntconnections,
                        "serverconnections": entList.service[i].cursrvrconnections,
                        "serverestablishconnections": entList.service[i].svrestablishedconn
                    });
                }
            }).catch(async (error) => {
                output = nitroError(error);
            });
            return output;
        },
        // GET /nitro/v1/stat/lbvserver/TARGET?statbindings=yes&attrs=servicegroupname,name
        //returns all information for all bound entites for a given vserver
        vServerBoundEntitiesNames: async (target) => {
            let output = {};
            let entList = null;
            let url = baseURL+"/nitro/v1/stat/lbvserver/"+target+"?statbindings=yes&attrs=servicegroupname,name";
            console.log(url);
            await axios.get(
                url, 
                { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
            }).then(async (res) => {
                //assuming only 1 entry here, since it's a specific search
                entList = res.data.lbvserver[0];
                output.name=entList.name;
                output.sgmem = [];
                for (i in entList.servicegroupmember){
                    name = entList.servicegroupmember[i].servicegroupname.split("?");
                    output.sgmem.push({
                        "servicegroup": name[0],
                        "servername": name[1]
                    });
                }
                output.service = [];
                for (i in entList.service){
                    output.service.push({
                        "name": entList.service[i].name
                    });
                }
            }).catch(async (error) => {
                output = nitroError(error);
            });
            return output;
        },
        //POST /nitro/v1/config/servicegroup?action=enable
        // Enables a server, as bound to a vserver
        serviceGroupEnableServer: async (serviceGroup, server, port) => {
            let output = {};
            let url = baseURL+"/nitro/v1/config/servicegroup?action=enable";
            console.log(url);
            await axios.post(
                url, 
                {
                    "servicegroup":{
                        "servicegroupname": serviceGroup,
                        "servername":server,
                        "port":port
                    }
                },
                {headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}}
            ).then(async (res) => {
                output = {
                    "status": res.status,
                    "msg": res.statustext
                };
            }).catch(async (error) => {
                output = nitroError(error);
            });
            return output;
        },
        //POST /nitro/v1/config/servicegroup?action=enable
        // Disables a server, as bound to a vserver
        serviceGroupDisableServer: async (serviceGroup, server, port, graceful) => {
            let output = {};
            let url = baseURL+"/nitro/v1/config/servicegroup?action=disable";
            console.log(url);
            await axios.post(
                url, 
                {
                    "servicegroup":{
                        "servicegroupname": serviceGroup,
                        "servername":server,
                        "port":port,
                        "delay":0,
                        "graceful":(graceful ? "yes" : "no")
                    }
                },
                {headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}}
            ).then(async (res) => {
                output = {
                    "status": res.status,
                    "msg": res.statustext
                };
            }).catch(async (error) => {
                output = nitroError(error);
            });
            return output;
        },
        // POST nitro/v1/config/service?action=enable
        // Enables a service
        serviceEnable: async (target) => {
            let output = {};
            let url = baseURL+"/nitro/v1/config/service?action=enable";
            console.log(url);
            await axios.post(
                url, 
                {
                    "service":{
                        "name": target
                    }
                },
                {headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}}
            ).then(async (res) => {
                output = {
                    "status": res.status,
                    "msg": res.statustext
                };
            }).catch(async (error) => {
                output = nitroError(error);
            });
            return output;
        },
        // POST nitro/v1/config/service?action=disable
        // Disable a service
        serviceDisable: async (target, graceful) => {
            let output = {};
            let url = baseURL+"/nitro/v1/config/service?action=disable";
            console.log(url);
            await axios.post(
                url, 
                {
                    "service":{
                        "name": target,
                        "delay":0,
                        "graceful":(graceful ? "yes" : "no")
                    }
                },
                {headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}}
            ).then(async (res) => {
                output = {
                    "status": res.status,
                    "msg": res.statustext
                };
            }).catch(async (error) => {
                output = nitroError(error);
            });
            return output;
        },
        // POST nitro/v1/config/server?action=enable
        // Enables a server
        serverEnable: async (target) => {
            let output = {};
            let url = baseURL+"/nitro/v1/config/server?action=enable";
            console.log(url);
            await axios.post(
                url, 
                {
                    "server":{
                        "name": target
                    }
                },
                {headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}}
            ).then(async (res) => {
                output = {
                    "status": res.status,
                    "msg": res.statustext
                };
            }).catch(async (error) => {
                output = nitroError(error);
            });
            return output;
        },
        // POST nitro/v1/config/server?action=disable
        // Disable a server
        serverDisable: async (target, graceful) => {
            let output = {};
            let url = baseURL+"/nitro/v1/config/server?action=disable";
            console.log(url);
            await axios.post(
                url, 
                {
                    "server":{
                        "name": target,
                        "delay":0,
                        "graceful":(graceful ? "yes" : "no")
                    }
                },
                {headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}}
            ).then(async (res) => {
                output = {
                    "status": res.status,
                    "msg": res.statustext
                };
            }).catch(async (error) => {
                output = nitroError(error);
            });
            return output;
        },
        // POST nitro/v1/config/vserver?action=enable
        // Enables a vserver
        vServerEnable: async (target) => {
            let output = {};
            let url = baseURL+"/nitro/v1/config/vserver?action=enable";
            console.log(url);
            await axios.post(
                url, 
                {
                    "vserver":{
                        "name": target
                    }
                },
                {headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}}
            ).then(async (res) => {
                output = {
                    "status": res.status,
                    "msg": res.statustext
                };
            }).catch(async (error) => {
                output = nitroError(error);
            });
            return output;
        },
        // POST nitro/v1/config/vserver?action=disable
        // Disable a vserver
        vServerDisable: async (target) => {
            let output = {};
            let url = baseURL+"/nitro/v1/config/vserver?action=disable";
            console.log(url);
            await axios.post(
                url, 
                {
                    "vserver":{
                        "name": target,
                    }
                },
                {headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}}
            ).then(async (res) => {
                output = {
                    "status": res.status,
                    "msg": res.statustext
                };
            }).catch(async (error) => {
                output = nitroError(error);
            });
            return output;
        },
        // POST nitro/v1/config/vserver?action=enable
        // Enables a vserver
        serviceGroupEnable: async (target) => {
            let output = {};
            let url = baseURL+"/nitro/v1/config/servicegroup?action=enable";
            console.log(url);
            await axios.post(
                url, 
                {
                    "servicegroup":{
                        "servicegroupname": target
                    }
                },
                {headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}}
            ).then(async (res) => {
                output = {
                    "status": res.status,
                    "msg": res.statustext
                };
            }).catch(async (error) => {
                output = nitroError(error);
            });
            return output;
        },
        // POST nitro/v1/config/vserver?action=disable
        // Disable a vserver
        serviceGroupDisable: async (target, graceful) => {
            let output = {};
            let url = baseURL+"/nitro/v1/config/servicegroup?action=disable";
            console.log(url);
            await axios.post(
                url, 
                {
                    "servicegroup":{
                        "servicegroupname": target,
                        "delay":0,
                        "graceful":(graceful ? "yes" : "no")
                    }
                },
                {headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}}
            ).then(async (res) => {
                output = {
                    "status": res.status,
                    "msg": res.statustext
                };
            }).catch(async (error) => {
                output = nitroError(error);
            });
            return output;
        }
    }
}