const User = require("../models/user");
const { setUser } = require("../services/auth");
const LogActivity = require("../models/Logactivity");

const handleUserSignup = async(req,res) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if(existingUser){
        console.log("User Already Exist");
        res.send("login page");
    }
    await User.create({name,email,password});
    return res.status(201).json({message:"User Created Successfully"});
}

const handleUserLogin = async(req,res) =>{
    const {email,password} = req.body;
    const existingUser = await User.findOne({ email,password });
    if(!existingUser){
        return res.status(401).json({message: "User Not found"});
    }
    
    const token = setUser(existingUser);
    res.cookie("uuid",token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    });
    const logActivity = await LogActivity.create({
        userId: existingUser._id,
        activityType: "login",
        action: "User logged in",
        details: { email },
    });

    if (!logActivity) {
        console.error("Error logging activity");
        return res.status(500).json({ message: "Error logging activity" });
    }

    const updateUser = await User.findByIdAndUpdate(existingUser._id, {
        lastActivity: new Date(),
    }, { new: true });
    return res.status(200).json({message: "User Logged in Successfully ",token});
}   

module.exports = {
    handleUserSignup,
    handleUserLogin
}