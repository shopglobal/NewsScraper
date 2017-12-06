const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    title: { 
        type:String,
        unique:true, 
        required:true
    },
    pubDate: Date, 
    url: {
        type:String, 
        unique:true, 
        required:false
    },
    img: String,
    blurb: String, 
    category: String, 
    author: String, 
    comments:[{
        type: Schema.ObjectId,
        ref:'Comment'
    }]
})

module.exports = mongoose.model('Article', ArticleSchema);