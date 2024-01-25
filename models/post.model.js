const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    postedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    text : {
        type : String,
        required : true
    },
    img : {
        type : String,
        default : ""
    },
    likes : {
        type : Number,
        default : 0
    },
    replies : [{
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
        },
        userProfilePic : {
            type : String,
        },
        text : {
            type : String,
            required :  true
        },
        username :  {
            type : String,
        }
    }]
})

const Post = mongoose.model('Post', schema)

module.exports = Post;