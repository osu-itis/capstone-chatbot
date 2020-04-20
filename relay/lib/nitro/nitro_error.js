//This function defines the object each function will return if it encounters an error
// .error is always set to true for testing from the calling program
// .status is the http status code, 503 if the load balancer does not reply, and 500 if a program error occurs
// .msg contains some text about the error
// .data may contain additional data or a message (503 has no attached data)

module.exports = (error) => {
    if(error.response){
        return {
            "error": true,
            "status": error.response.status,
            "msg": error.response.statustext,
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