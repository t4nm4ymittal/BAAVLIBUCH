const mongoose = require('mongoose')

const db_link = "mongodb+srv://2020ucp1795:vX5Ze40VxzDTMykq@cluster0.r6ygflx.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(db_link)
.then(function(db){
  //console.log(db)
  console.log("connection db connected")
})
.catch(function(err){
  console.log(err)
})


const connectionlogSchema = new mongoose.Schema({
   count:{
    type:Number,
    default:0,
   },
   
});

const connectionlogModel = mongoose.model('connectionlogModel', connectionlogSchema);

module.exports = connectionlogModel;