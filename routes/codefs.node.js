var fs = require("fs");

var SAVE_PATH = "codes/"

exports.makeDir = function(dirPath,callback){
  fs.mkdir(SAVE_PATH+dirPath,callback);
}
exports.save = function(id, slot, file, callback){
  fs.rename(file.path, SAVE_PATH + id + "/" + slot, callback);
}

exports.getFilePath = function(id, slot){
  return SAVE_PATH + id + "/" + slot;
}
exports.getSlotList = function(id, callback){
  fs.readdir(SAVE_PATH + id+"/", function(err, files){
    if(err) return callback(err);
    //to detech suffix
    files = files.map(function(item){
      return item.substr(0, item.length - 3)
    });
    callback(null, files);
  });
}