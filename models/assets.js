var mongoose = require("mongoose");

var assetSchema = new mongoose.Schema({
    name : {type:String,required:true},
    location : {type:String,required:true}
});
var assetData = mongoose.model("assets",assetSchema);

module.exports = assetData;