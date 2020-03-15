const axios = require('axios');


//const fs = require('fs');
//const defaultUsername = process.env.NETSCALER_USERNAME;
//let defaultPassword;
// fs.readFile('.password', 'utf8', (err, contents) => {
//     defaultPassword = contents;
// });


//This function defines the object each function will return if it encounters an error
// .error is always to to true for testing from the calling program
// .status is the http status code, 503 if the load balancer does not reply, and 500 if a program error occurs
// .msg contains some text about the error
// .data may contain additional data or a message (503 has no attached data)
function procError(error){
    if(error.response){
        return {
            "error": true,
            "status": error.status,
            "msg": error.statustext,
            "data": error.data
        }
    } else if (error.request) {
        return {
            "error": true,
            "status": 503,
            "msg": "Unable to contact load balancer"
        }
    } else {
        return {
            "error": true,
            "status": 500,
            "msg": "Internal error: Try again or contact administrator",
            "data": error.message
        }
    }
}
//baseURL+serviceGroupRoute+vserverSGBind+target+serviceGroupDisable;
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
                output = procError(error);
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
                output = procError(error);
            });
            if (output) return output;
            else return true;
        },
        resourcesListAll: async () => {
            vservers = await nitro.vServerListAll();
            servicegroups = await nitro.serviceGroupListAll();
            services = await nitro.serviceListAll();
            servers = await nitro.serversListAll();
            output = {
                vservers:[],
                servicegroups:[],
                services:[],
                servers:[]
            };
            for (i in vservers){
                output.vservers.push(vservers[i].name);
            }
            for (i in servicegroups){
                output.servicegroups.push(servicegroups[i].name);
            }
            for (i in services){
                output.services.push(services[i].name);
            }
            for (i in servers){
                output.servers.push(servers[i].name);
            }
            return output;
        },

        //GET /nitro/v1/config/lbvserver?attrs=name
        //returns a list of all vservers
        vServerListAll: async () => {
            let output = {};
            let vsList = null;
            let url = baseURL+"/nitro/v1/config/lbvserver?attrs=name";
            console.log(url);
            await axios.get(
                url, 
                { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
            }).then(async (res) => {
                vsList = res.data;
                output.vserver = [];
                for (i in vsList.lbvserver){
                    output.vserver.push("name": vsList.lbvserver[i].name);
                }
            }).catch(async (error) => {
                output = procError(error);
            });
            return output;
        },
        // GET /nitro/v1/config/servicegroup?attrs=name,numofconnections,servicetype
        // returns a list of all service groups and the number of connections
        serviceGroupListAll: async () => {
            let output = {};
            let sgList = null;
            let url = baseURL+"/nitro/v1/config/servicegroup?attrs=name,numofconnections";
            console.log(url);
            await axios.get(
                url, 
                { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
            }).then(async (res) => {
                sgList = res.data;
                output.servicegroup = [];
                for (i in sgList.servicegroup){
                    output.servicegroup.push({
                        "name": vsList.servicegroup[i].name,
                        "connections": vsList.servicegroup[i].numofconnections
                    });
                }
            }).catch(async (error) => {
                output = procError(error);
            });
            return output;
        },
        // GET /nitro/v1/config/server?args=internal:false&attrs=name,ipaddress,state
        // returns a list of all servers, their ip address, and their current state
        serverListAll: async () => {
            let output = {};
            let svrList = null;
            let url = baseURL+"/nitro/v1/config/server?args=internal:false&attrs=name,ipaddress,state";
            console.log(url);
            await axios.get(
                url, 
                { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
            }).then(async (res) => {
                svrList = res.data;
                output.server = [];
                for (i in svrList.server){
                    output.server.push({
                        "name": svrList.server[i].name,
                        "ip": svrList.server[i].ipaddress,
                        "state": svrList.server[i].state
                    });
                }
            }).catch(async (error) => {
                output = procError(error);
            });
            return output;
        },
        // GET /nitro/v1/config/service?args=internal:false&attrs=name,numofconnections,servername,ipaddress,port,svrstate
        // returns a list of all services, the number of connections, their associated server name, ip, port and the server state
        serviceListAll: async () => {
            let output = {};
            let svcList = null;
            let url = baseURL+"/nitro/v1/config/service?args=internal:false&attrs=name,numofconnections,servername,ipaddress,port,svrstate";
            console.log(url);
            await axios.get(
                url, 
                { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
            }).then(async (res) => {
                svcList = res.data;
                output.service = [];
                for (i in svcList.server){
                    output.service.push({
                        "name": svcList.server[i].name,
                        "connections": svcList.server[i].numofconnections,
                        "servername": svcList.server[i].servername,
                        "ip": svcList.server[i].ipaddress,
                        "port": svcList.server[i].port,
                        "state": svcList.server[i].svrstate
                    });
                }
            }).catch(async (error) => {
                output = procError(error);
            });
            return output;
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
                output.name=entList.name;
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
                output = procError(error);
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
                    headers: {"Cookie": "NITRO_AUTH_TOKEN="+token},
                    "servicegroup":{
                        "servicegroupname": serviceGroup,
                        "servername":server,
                        "port":port
                    }
                }
            ).then(async (res) => {
                output = {
                    "status": res.status,
                    "msg": res.statustext
                };
            }).catch(async (error) => {
                output = procError(error);
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
                    headers: {"Cookie": "NITRO_AUTH_TOKEN="+token},
                    "servicegroup":{
                        "servicegroupname": serviceGroup,
                        "servername":server,
                        "port":port,
                        "delay":0,
                        "graceful":(graceful ? "yes" : "no")
                    }
                }
            ).then(async (res) => {
                output = {
                    "status": res.status,
                    "msg": res.statustext
                };
            }).catch(async (error) => {
                output = procError(error);
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
                    headers: {"Cookie": "NITRO_AUTH_TOKEN="+token},
                    "service":{
                        "name": target
                    }
                }
            ).then(async (res) => {
                output = {
                    "status": res.status,
                    "msg": res.statustext
                };
            }).catch(async (error) => {
                output = procError(error);
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
                    headers: {"Cookie": "NITRO_AUTH_TOKEN="+token},
                    "service":{
                        "name": target,
                        "delay":0,
                        "graceful":(graceful ? "yes" : "no")
                    }
                }
            ).then(async (res) => {
                output = {
                    "status": res.status,
                    "msg": res.statustext
                };
            }).catch(async (error) => {
                output = procError(error);
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
                    headers: {"Cookie": "NITRO_AUTH_TOKEN="+token},
                    "server":{
                        "name": target
                    }
                }
            ).then(async (res) => {
                output = {
                    "status": res.status,
                    "msg": res.statustext
                };
            }).catch(async (error) => {
                output = procError(error);
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
                    headers: {"Cookie": "NITRO_AUTH_TOKEN="+token},
                    "server":{
                        "name": target,
                        "delay":0,
                        "graceful":(graceful ? "yes" : "no")
                    }
                }
            ).then(async (res) => {
                output = {
                    "status": res.status,
                    "msg": res.statustext
                };
            }).catch(async (error) => {
                output = procError(error);
            });
            return output;
        }
    }
}