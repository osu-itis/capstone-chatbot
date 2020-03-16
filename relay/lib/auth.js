csvparser = require('./csv_auth');

module.exports = {
    getCreds: async(uuid) => {
        return await csvparser(uuid);
    }
}