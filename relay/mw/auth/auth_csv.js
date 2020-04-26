fs = require('fs');

module.exports = async (id) => {
    var lines = [];
    try {
        contents = fs.readFileSync('.auth', 'utf8');
        lines = contents.split('\n');
    } catch(e) {
        console.log("Unable to read or parse .auth");
        console.log(e);
        return false;
    }

    for(i in lines){
        fields = lines[i].split(',');
        if(fields[0] == id){
            return {
                "url": fields[1],
                "username": fields[2],
                "password": fields[3],
            }
        }
    }

    //if id is not matched, then execution will reach here, throw an exception to be caught
    throw "Unauthorized";
}