var fs = require("fs");

var SAVE_PATH = "codes/"

exports.save = function(id, slot, file, callback){
  fs.rename(file.path, SAVE_PATH + id + "/" + slot + ".js", callback);
}
exports.getFilePath = function(id, slot){
  return SAVE_PATH + id + "/" + slot + ".js";
}
exports.getSlotList = function(id, callback){
  fs.readdir(SAVE_PATH + "/" + id, function(err, files){
    if(err) return callback(err);
    //to detech suffix
    files = files.map(function(item){return item.substr(0, item.length - 3)});
    callback(null, files);
  });
}