fs = require('fs');

module.exports = async (uuid) => {
    try {
        contents = fs.readFileSync('.auth', 'utf8');
        lines = contents.split('\n');
        for(i in lines){
            fields = lines[i].split(',');
            if(fields[0] == uuid){
                return {
                    "url": fields[1],
                    "username": fields[2],
                    "password": fields[3],
                }
            }
        }
        return false;
    } catch(e) {
        console.log("Unable to read or parse .auth.csv");
        console.log(e);
        return false;
    }
}