var fs = require("fs");

var SAVE_PATH = "public/maps/"

exports.listMap = function(callback){
  fs.readdir(SAVE_PATH, function(err, files){
    if(err) callback(err);
    files = files.map(function(item){
      return item.substr(0, item.length - 3);
    });
    callback(null, files);
  });
}