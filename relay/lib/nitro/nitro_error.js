//This class defines a standard object to hold errors if our nitro interface encounters an error
// All outputs can be tested for errors by testing if it is an instanceof this class
// .status is the http status code, 503 if the load balancer does not reply, and 500 if a program error occurs
// .msg contains some text about the error
// .data may contain additional data or a message (503 has no attached data)

module.exports = class {
    constructor (error) {
        if(error.response){
            this.status = error.response.status;
            this.msg = error.response.statustext;
            this.data = error.data;
        } else if (error.request) {
            this.status = 503;
            this.msg = "Unable to contact load balancer";
        } else {
            this.status = 500;
            this.msg = "Internal error: Try again or contact administrator",
            this.data = error.message;
        }
    }
}