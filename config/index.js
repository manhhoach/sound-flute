const mongoose = require('mongoose');
require('dotenv').config({});


async function connect() {
    const DB = process.env.DATABASE;
    try {
        await mongoose.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('connect successfully');

    }

    catch (error) {
        console.log('connect failed');
    }
}

module.exports = { connect };