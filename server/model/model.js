const mongoose = require('mongoose')

var schema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    cpf:{
        type:Number,
        required: true,
        unique: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    tel:{
        type:Number,
        required: true
    }
})

const Userdb = mongoose.model('userdb',schema)

module.exports = Userdb;