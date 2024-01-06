// Middleware for handling auth
const jwt = require('jsonwebtoken');
const jwtPassword = process.env.JWT_SECRET
function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const AuthHeaders = req.headers["authorization"];
    console.log(AuthHeaders);
    const token = AuthHeaders.split(" ")[1];
    const verified = jwt.verify(token,jwtPassword)
    if(verified.username){
        req.username = verified.username
        next();
    }
    else{
        res.status(404).json({
            message:"Something wrong"
        })
    }
}

module.exports = userMiddleware;