const mongoose = require('mongoose');
const dotenv=require('dotenv').config({});


async function connect(){
    const DB=process.env.DATABASE;
    const DB_LOCAL=process.env.DATABASE_LOCAL;
    
    try{
        await mongoose.connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex:true
      });
      console.log('connection successful');

    }

    catch(error){
        console.log('connection failed');
    }  
}

module.exports = {connect};