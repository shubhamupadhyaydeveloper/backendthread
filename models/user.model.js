const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    } ,
    username : {
        type : String,
        unique : true,
        required : true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        minLength : 6 ,
        required : true
    },
    profilePic : {
        type : String,
        default : ""
    },
    followers : {
        type : [String],
        default : []
    },
    following : {
        type : [String],
        default : []
    },
    bio : {
        type : String,
        default : ''
    }
})

const User = mongoose.model('User', schema)

module.exports = User;