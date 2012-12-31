var fs = require("fs");

var SAVE_PATH = "codes/"

exports.upload = function(req, res){
  var codeFile = req.files.code;

  fs.rename(codeFile.path, SAVE_PATH + req.session.user + ".js", function(err){
    if(err)
      req.flash("alert", "fail to save code in server");
    else
      req.flash("msg", "save File succese");
    res.redirect("/");
  });
}

exports.uploadForm = function(req, res){
  res.render("uploadCode", {title : "code"});
}

exports.load = function(req, res){
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