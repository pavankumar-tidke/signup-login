const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/test', {useNewUrlParser: true, useUnifiedTopology: true}).then((result)=>{
    console.log('Mongoose Connected...!');
}).catch((error)=>console.error('Mongoose Connection Failed...'))

const ajaxSchema = {
    email: String,
    username: String,
    password: String
}


module.exports =  mongoose.model('ajax', ajaxSchema); 
