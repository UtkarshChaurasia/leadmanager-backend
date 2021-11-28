const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectToMongo = () => {
    mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;