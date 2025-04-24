const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = "T@nm@yGUpt@1706$@";

function setUser(user){
    const token = jwt.sign({
        _id : user._id,
        name: user.name,
        email: user.email,
        role: user.role
    },
    secret,
    {
        expiresIn: "1h"
    });
    return token;
}

function getUser(token){
    try {
        const decoded = jwt.verify(token, secret);
        console.log(decoded);
        return decoded;
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
}

module.exports = {
    setUser,
    getUser
}