const axios = require('axios');
const NitroError = require('./nitro_error');

module.exports = {

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
            output.vservers = [];
            for (i in vsList.lbvserver){
                output.vservers.push({
                    "name": vsList.lbvserver[i].name
                });
            }
        }).catch(async (error) => {
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
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
            output.servicegroups = [];
            for (i in sgList.servicegroup){
                output.servicegroups.push({
                    "name": sgList.servicegroup[i].servicegroupname
                });
            }
        }).catch(async (error) => {
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
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
            output.servers = [];
            for (i in svrList.server){
                output.servers.push({
                    "name": svrList.server[i].name
                });
            }
        }).catch(async (error) => {
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
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
            output.services = [];
            for (i in svcList.service){
                output.services.push({
                    "name": svcList.service[i].name
                });
            }
        }).catch(async (error) => {
            output = new NitroError(error);
        });
        if(output instanceof NitroError) throw output;
        else return output;
    }
}