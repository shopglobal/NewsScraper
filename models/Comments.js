const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CommentSchema = new Schema({
    user: { 
        type:String,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    }, 
    body: {
        type:String,  
        required:true
    }
})

module.exports = mongoose.model('Comment', CommentSchema);