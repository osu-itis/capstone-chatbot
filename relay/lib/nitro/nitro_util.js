const axios = require('axios');
const NitroError = require('./nitro_error');
const nitroList = require('./nitro_list');
const nitroListAll = require('./nitro_list_all');

module.exports = {
    //This function runs all the list commands, and returns them
    resourcesListAll: async (baseURL, token) => {
        return await nitroListAll(baseURL, token);
    },
    //This function runs all the list commands, and returns the matching resource
    findResource: async (baseURL, token, target) => {
        resources = await nitroListAll(baseURL, token, true);
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
    vServerListAllNames: async(baseURL, token) => {
        return await nitroList.vServerListAllNames(baseURL,token);
    },
    serviceGroupListAllNames: async(baseURL, token) => {
        return await nitroList.serviceGroupListAllNames(baseURL,token);
    },
    serviceListAllNames: async(baseURL, token) => {
        return await nitroList.serviceListAllNames(baseURL,token);
    },
    serverListAllNames: async(baseURL, token) => {
        return await nitroList.serverListAllNames(baseURL,token);
    },
    listVServerBoundEntities: async(baseURL, token, vServer) => {
        let output = {};
        let url = baseURL+"/nitro/v1/config/lbvserver_binding/"+vServer;
        await axios.get(
            url,
            { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
        }).then(async (res) => {
            //assuming only 1 entry here, since it's a specific search
            sgEntList = res.data.lbvserver_binding[0].lbvserver_servicegroup_binding;
            srvEntList = res.data.lbvserver_binding[0].lbvserver_service_binding;
            output.servicegroups=[];
            output.services=[];
            for(i in sgEntList) {
                output.servicegroups.push({"name": sgEntList[i].servicegroupname});
            }
            for(i in srvEntList) {
                output.services.push({"name": srvEntList[i].servicename});
            }
        }).catch(async(error) => {
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
    },
    listServiceGroupBoundEntities: async(baseURL, token, serviceGroup) => {
        let output = {};
        let url = baseURL+"/nitro/v1/config/servicegroup_binding/"+serviceGroup;
        await axios.get(
            url,
            { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
        }).then(async (res) => {
            //assuming only 1 entry here, since it's a specific search
            entList = res.data.servicegroup_binding[0].servicegroup_servicegroupmember_binding;
            output.servers=[];
            for(i in entList) {
                output.servers.push({"name": entList[i].servername});
            }
        }).catch(async(error) => {
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
    },
    listServiceBoundEntity: async(baseURL, token, service) => {
        let output = {};
        let url = baseURL+"/nitro/v1/config/service/"+service;
        await axios.get(
            url,
            { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
        }).then(async (res) => {
            //assuming only 1 entry here, since it's a specific search
            ent = res.data.service[0];
            output.server=[]
            output.server.push({"name": ent.servername});
        }).catch(async(error) => {
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
    },
    vServerListStats: async (baseURL, token, vServer) => {
        let output = {};
        let url = baseURL+"/nitro/v1/config/lbvserver/"+vServer+"?attrs=name,ipv46,port,curstate,effectivestate,totalservices,activeservices";
        console.log(url);
        await axios.get(
            url, 
            { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
        }).then(async (res) => {
            vs = res.data.lbvserver[0];
            output = {
                "name": vs.name,
                "ip": vs.ipv46,
                "state": vs.curstate,
                "effstate": vs.effectivestate,
                "activeservices": vs.activeservices,
                "totalservices": vs.totalservices
            };
        }).catch(async (error) => {
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
    },
    serviceGroupListStats: async(baseURL, token, serviceGroup) => {
        let output = {};
        let url = baseURL+"/nitro/v1/config/servicegroup/"+serviceGroup+"?attrs=servicegroupname,numofconnections,state";
        console.log(url);
        await axios.get(
            url, 
            { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
        }).then(async (res) => {
            sg = res.data.servicegroup[0];
            output = {
                "name": sg.servicegroupname,
                "connections": sg.numofconnections,
                "state": sg.state
            };
        }).catch(async (error) => {
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
    },
    serviceListStats: async(baseURL, token, service) => {
        let output = {};
        let url = baseURL+"/nitro/v1/config/service/"+service+"?args=internal:false&attrs=name,numofconnections,servername,ipaddress,port,svrstate";
        console.log(url);
        await axios.get(
            url, 
            { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
        }).then(async (res) => {
            svc = res.data.service[0];
            output =  {
                "name": svc.name,
                "connections": svc.numofconnections,
                "servername": svc.servername,
                "ip": svc.ipaddress,
                "port": svc.port,
                "state": svc.svrstate
            };
        }).catch(async (error) => {
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
    },
    serverListStats: async(baseURL, token, server) => {
        let output = {};
        let url = baseURL+"/nitro/v1/config/server/"+server+"?args=internal:false&attrs=name,ipaddress,state";
        console.log(url);
        await axios.get(
            url, 
            { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
        }).then(async (res) => {
            svr = res.data.server[0];
            output = {
                "name": svr.name,
                "ip": svr.ipaddress,
                "state": svr.state
            };
        }).catch(async (error) => {
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
    },
    //POST /nitro/v1/config/servicegroup?action=enable
    // Enables a server, as bound to a vserver
    serviceGroupEnableServer: async (baseURL, token, serviceGroup, server, port) => {
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
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
    },
    //POST /nitro/v1/config/servicegroup?action=enable
    // Disables a server, as bound to a vserver
    serviceGroupDisableServer: async (baseURL, token, serviceGroup, server, port, delay, graceful) => {
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
                    "delay":delay,
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
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
    },
    // POST nitro/v1/config/service?action=enable
    // Enables a service
    serviceEnable: async (baseURL, token, target) => {
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
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
    },
    // POST nitro/v1/config/service?action=disable
    // Disable a service
    serviceDisable: async (baseURL, token, target, delay, graceful) => {
        let output = {};
        let url = baseURL+"/nitro/v1/config/service?action=disable";
        console.log(url);
        await axios.post(
            url, 
            {
                "service":{
                    "name": target,
                    "delay": delay,
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
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
    },
    // POST nitro/v1/config/server?action=enable
    // Enables a server
    serverEnable: async (baseURL, token, target) => {
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
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
    },
    // POST nitro/v1/config/server?action=disable
    // Disable a server
    serverDisable: async (baseURL, token, target, delay, graceful) => {
        let output = {};
        let url = baseURL+"/nitro/v1/config/server?action=disable";
        console.log(url);
        await axios.post(
            url, 
            {
                "server":{
                    "name": target,
                    "delay": delay,
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
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
    },
    // POST nitro/v1/config/vserver?action=enable
    // Enables a vserver
    vServerEnable: async (baseURL, token, target) => {
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
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
    },
    // POST nitro/v1/config/vserver?action=disable
    // Disable a vserver
    vServerDisable: async (baseURL, token, target) => {
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
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
    },
    // POST nitro/v1/config/vserver?action=enable
    // Enables a vserver
    serviceGroupEnable: async (baseURL, token, target) => {
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
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
    },
    // POST nitro/v1/config/vserver?action=disable
    // Disable a vserver
    serviceGroupDisable: async (baseURL, token, target, delay, graceful) => {
        let output = {};
        let url = baseURL+"/nitro/v1/config/servicegroup?action=disable";
        console.log(url);
        await axios.post(
            url, 
            {
                "servicegroup":{
                    "servicegroupname": target,
                    "delay":delay,
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
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
    }
}