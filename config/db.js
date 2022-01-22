const mongoose = require("mongoose");
const config = require('./keys');


const connectDB = async ()=>{
  try {
    await mongoose.connect(config.mongoURI,{
      useNewUrlParser:true,
      useUnifiedTopology:true,
    })
    console.log("conection sucess");
  } catch (e) {
    console.log("connection fail");
    process.exit(1)
  } finally {

  }
}

module.exports = connectDB;
