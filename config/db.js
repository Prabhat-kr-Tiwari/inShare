require('dotenv').config()
//import mongoose
const mongoose=require('mongoose')



function connectDB(){
    //datanase connection
    //mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify : true });
    mongoose.connect(process.env.MONGO_CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      
    const connection = mongoose.connection;

    connection.once('open',()=>{
        console.log('Database connected')
    })
    // .catch(error=>{
    //     console.log('connection failed')
    // })
}
module.exports=connectDB