var mongoose = require("mongoose");

var workerSchema = new mongoose.Schema({
    name : {type:String,required:true},
    skillset : {type:String,lowercase: true,required:true}
});
var workerData = mongoose.model("workers",workerSchema);

module.exports = workerData;