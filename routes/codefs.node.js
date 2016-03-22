var fs = require("fs");

var SAVE_PATH = "codes/"

exports.makeDir = function(dirPath,callback){
  fs.mkdir(SAVE_PATH+dirPath,callback);
}
exports.save = function(id, slot, file, callback){
  var is = fs.createReadStream(file.path);
  var os = fs.createWriteStream(SAVE_PATH + id + "/" + slot);
  is.pipe(os);
  is.on('end', function(){
  	fs.unlinkSync(file.path);
  	callback(null);
  });
  is.on("error", callback);
}

exports.getFilePath = function(id, slot){
  return SAVE_PATH + id + "/" + slot;
}
exports.getSlotList = function(id, callback){
  fs.readdir(SAVE_PATH + id+"/", function(err, files){
    if(err) {
      console.log("여기 진입");
    	return callback(err, {});
    }
    //to detech suffix
    files = files.map(function(item){
      return item.substr(0, item.length - 3)
    });
    callback(null, files);
  });
}