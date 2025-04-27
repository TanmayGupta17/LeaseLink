const {getUser} = require('../services/auth');

const checkforAuthentication = (req, res, next) => {
    const token = req.headers.authorization?.split("Bearer ")[1]; 
    console.log("token recieved: "+ token);
    if(!token){
        return res.status(401).json({message: "Unauthorized"});
    }
    const user = getUser(token);
    if(!user){
        return res.status(401).json({message: "Invalid or token expired"});
    }
    req.user = user;
    next();
}

const restrictTo = (roles = []) => {
    return function(req,res,next){
        console.log("User in restrictTo middleware:", req.user); // Debugging: Log the user object
        if (!req.user || !roles.includes(req.user.role)) {
            console.log(`Access denied for role: ${req.user?.role}`); // Debugging: Log the denied role
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    }
}

module.exports = {
    checkforAuthentication,
    restrictTo
}