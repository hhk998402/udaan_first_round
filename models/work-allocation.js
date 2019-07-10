var mongoose = require("mongoose");

var workAllocationSchema = new mongoose.Schema({
    assetID : {type:String,required:true},
    taskID : {type:String,required:true},
    workerID : {type:String,required:true},
    timeOfAllocation : {type:Date,default:Date.now,required:true},
    taskToBePerformedBy : {type:Date,required:true}
});
var workAllocationData = mongoose.model("workAllocation",workAllocationSchema);

module.exports = workAllocationData;