var mongoose = require("mongoose")
var Schema = mongoose.Schema

var imageSchema = new mongoose.Schema({
    name: String,
    old: String,
});

module.exports = new mongoose.model('datas', imageSchema);