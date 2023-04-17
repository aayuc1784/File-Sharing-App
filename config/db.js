require("dotenv").config();
const mongoose = require("mongoose");

function connectDB(){
    // Database connection 
    mongoose.connect(process.env.MONGO_CONNECTION_URL, {useNewUrlParser: true});

    const connection = mongoose.connection;

    connection.once("open", function () {
      console.log("Database Connected!");
    }).on('error', function (err) {
      console.log(err);
    });
};

module.exports = connectDB;

// module.exports={
//     uri: "mongodb+srv://aayuc1784:Aayush100@@cluster0.q7kuwpt.mongodb.net/file-sharing?retryWrites=true&w=majority"
// }