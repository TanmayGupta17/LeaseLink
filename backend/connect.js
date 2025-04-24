const mongoose = require('mongoose');
mongoose.set("strictQuery",true);

async function connectDB(url){
    return mongoose.connect(url);
}

module.exports = {
    connectDB
}