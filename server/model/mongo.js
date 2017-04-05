const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const db = mongoose.connect('mongodb://localhost/blog');

db.connection.on('error', (error) => {
    console.log(error);
});

db.connection.on("open", () => { 
    console.log("——数据库连接成功！——"); 
});

let post = new Schema({
    title: String,
    pathName: { type: String },
    createdAt: { type: String, default: '' },
    updatedAt: { type: String, default: '' },
    markdownContent: { type: String },
    content: { type: String },
    markdownToc: { type: String, default: '' },
    tags: Array
});

let tag = new Schema({
    name: String,
    createdAt: String
});

post = mongoose.model('post', post);
tag = mongoose.model('tag', tag);

module.exports = {
    post,
    tag
}