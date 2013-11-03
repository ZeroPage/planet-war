var fs = require("fs");
var codefs = require("./codefs.node.js");

var SAVE_PATH = "codes/";

exports.upload = function(req, res){
  var codeFile = req.files.code;

  codefs.makeDir(req.session.user+"/",null);

  codefs.save(req.session.user,codeFile.name,codeFile,function(err){
    if(err)
      req.flash("alert", "fail to save code in server");
    else
      req.flash("msg", "Successfully uploaded the code");
    res.redirect("/");
  });
}

exports.loadMySlotList = function(req,callback){
  codefs.makeDir(req.session.user+"/",null); 
  codefs.getSlotList(req.session.user,callback);
}

exports.load2 = function(req, res){
  var id = req.param("id");
  res.sendfile(SAVE_PATH + id +".js");
}
exports.listCode = function(callback){
  fs.readdir(SAVE_PATH, function(err, files){
    if(err) callback(err);
    files = files.map(function(item){
      return item.substr(0, item.length - 3);
    });
    callback(null, files);
  });
}