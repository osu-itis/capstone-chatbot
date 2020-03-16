const axios = require('axios');
const nitroError = require('./nitro_error');

module.exports = {
    //GET /nitro/v1/config/lbvserver?attrs=name,ipv46,port,curstate,effectivestate,totalservices,activeservices
    //returns a list of all vservers, their ip, port, state, total/active services
    vServerListAllStats: async(baseURL, token) => {
        let output = {};
        let vsList = null;
        let url = baseURL+"/nitro/v1/config/lbvserver?attrs=name,ipv46,port,curstate,effectivestate,totalservices,activeservices";
        console.log(url);
        await axios.get(
            url, 
            { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
        }).then(async (res) => {
            vsList = res.data;
            output.vserver = [];
            for (i in vsList.lbvserver){
                output.vserver.push({
                    "name": vsList.lbvserver[i].name,
                    "ip": vsList.lbvserver[i].ipv46,
                    "state": vsList.lbvserver[i].curstate,
                    "effstate": vsList.lbvserver[i].effectivestate,
                    "activeservices": vsList.lbvserver[i].activeservices,
                    "totalservices": vsList.lbvserver[i].totalservices
                });
            }
        }).catch(async (error) => {
            output = nitroError(error);
        });
        return output;
    },

    //GET /nitro/v1/config/lbvserver?attrs=name
    //returns a list of all vservers
    vServerListAllNames: async (baseURL, token) => {
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
                output.vserver.push({
                    "name": vsList.lbvserver[i].name
                });
            }
        }).catch(async (error) => {
            output = nitroError(error);
        });
        return output;
    },

    // GET /nitro/v1/config/servicegroup?attrs=name,numofconnections,servicetype
    // returns a list of all service groups and the number of connections
    serviceGroupListAllStats: async (baseURL, token) => {
        let output = {};
        let sgList = null;
        let url = baseURL+"/nitro/v1/config/servicegroup?attrs=servicegroupname,numofconnections,state";
        console.log(url);
        await axios.get(
            url, 
            { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
        }).then(async (res) => {
            sgList = res.data;
            output.servicegroup = [];
            for (i in sgList.servicegroup){
                output.servicegroup.push({
                    "name": sgList.servicegroup[i].servicegroupname,
                    "connections": sgList.servicegroup[i].numofconnections,
                    "state": sgList.servicegroup[i].state
                });
            }
        }).catch(async (error) => {
            output = nitroError(error);
        });
        return output;
    },

    // GET /nitro/v1/config/servicegroup?attrs=name
    // returns a list of all service groups
    serviceGroupListAllNames: async (baseURL, token) => {
        let output = {};
        let sgList = null;
        let url = baseURL+"/nitro/v1/config/servicegroup?attrs=servicegroupname";
        console.log(url);
        await axios.get(
            url, 
            { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
        }).then(async (res) => {
            sgList = res.data;
            output.servicegroup = [];
            for (i in sgList.servicegroup){
                output.servicegroup.push({
                    "name": sgList.servicegroup[i].servicegroupname
                });
            }
        }).catch(async (error) => {
            output = nitroError(error);
        });
        return output;
    },

    // GET /nitro/v1/config/server?args=internal:false&attrs=name,ipaddress,state
    // returns a list of all servers, their ip address, and their current state
    serverListAllStats: async (baseURL, token) => {
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
            output = nitroError(error);
        });
        return output;
    },

    // GET /nitro/v1/config/server?args=internal:false&attrs=name
    // returns a list of all servers
    serverListAllNames: async (baseURL, token) => {
        let output = {};
        let svrList = null;
        let url = baseURL+"/nitro/v1/config/server?args=internal:false&attrs=name";
        console.log(url);
        await axios.get(
            url, 
            { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
        }).then(async (res) => {
            svrList = res.data;
            output.server = [];
            for (i in svrList.server){
                output.server.push({
                    "name": svrList.server[i].name
                });
            }
        }).catch(async (error) => {
            output = nitroError(error);
        });
        return output;
    },

    // GET /nitro/v1/config/service?args=internal:false&attrs=name,numofconnections,servername,ipaddress,port,svrstate
    // returns a list of all services, the number of connections, their associated server name, ip, port and the server state
    serviceListAllStats: async (baseURL, token) => {
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
            for (i in svcList.service){
                output.service.push({
                    "name": svcList.service[i].name,
                    "connections": svcList.service[i].numofconnections,
                    "servername": svcList.service[i].servername,
                    "ip": svcList.service[i].ipaddress,
                    "port": svcList.service[i].port,
                    "state": svcList.service[i].svrstate
                });
            }
        }).catch(async (error) => {
            output = nitroError(error);
        });
        return output;
    },

    // GET /nitro/v1/config/service?args=internal:false&attrs=name
    // returns a list of all services
    serviceListAllNames: async (baseURL, token) => {
        let output = {};
        let svcList = null;
        let url = baseURL+"/nitro/v1/config/service?args=internal:false&attrs=name";
        console.log(url);
        await axios.get(
            url, 
            { headers: {"Cookie": "NITRO_AUTH_TOKEN="+token}
        }).then(async (res) => {
            svcList = res.data;
            output.service = [];
            for (i in svcList.service){
                output.service.push({
                    "name": svcList.service[i].name,
                    "connections": svcList.service[i].numofconnections,
                    "servername": svcList.service[i].servername,
                    "ip": svcList.service[i].ipaddress,
                    "port": svcList.service[i].port,
                    "state": svcList.service[i].svrstate
                });
            }
        }).catch(async (error) => {
            output = nitroError(error);
        });
        return output;
    },
}