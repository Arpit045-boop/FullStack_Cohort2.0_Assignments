// Middleware for handling auth
const jwt = require('jsonwebtoken');
const jwtPassword = process.env.JWT_SECRET
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    // Header are converted into lowercase  
    // Saves the DB Call...Browser memories the JWT and every time send the jwt.
    const AuthHeaders = req.headers["authorization"];
    console.log(AuthHeaders);
    const token = AuthHeaders.split(" ")[1];
    const verified = jwt.verify(token,jwtPassword)
    if(verified.username){
        next();
    }
    else{
        res.status(404).json({
            message:"Something wrong"
        })
    }
}

module.exports = adminMiddleware;