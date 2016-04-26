var fs = require("fs");
var codefs = require("./codefs.node.js");
var user = require("./user.node.js");

var SAVE_PATH = "codes/";

exports.upload = function(req, res){
  var codeFile = req.files.code;
  
  if(codeFile.name==null||codeFile.name==""){
    req.flash("alert", "Fail to save code. Please select your code file before upload.");
    res.redirect("/");
    return;
  }
  codefs.makeDir(req.session.user + "/",function(err){
	  codefs.save(req.session.user,codeFile.name,codeFile,function(err){
      console.log(err);
      if(err) {
	    req.flash("alert", "Fail to save code in server");
	  } else {
        req.flash("msg", "Successfully uploaded the code");
        res.redirect("/");
	  }
    });
  });
}

exports.loadMySlotList = function(userName, callback){
  codefs.makeDir(userName +"/",function(err){
    if(err)
      console.log("Directory already maded");
    codefs.getSlotList(userName,callback);
  });
}

exports.loadRequestedFile = function(req, res){
  var id = req.param("id");
  var codeName = req.param("codeName");
  res.sendfile(SAVE_PATH + id +"/"+codeName+".js");
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
