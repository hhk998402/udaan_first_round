var mongoose = require("mongoose");

var taskSchema = new mongoose.Schema({
    name : {type:String,required:true},
    skillset : {type:String,lowercase: true,required:true}
});
var taskData = mongoose.model("tasks",taskSchema);

module.exports = taskData;