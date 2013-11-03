var fs = require("fs");
var codefs = require("./codefs.node.js");
var user = require("./user.node.js");

var SAVE_PATH = "codes/";

exports.upload = function(req, res){
  var codeFile = req.files.code;

  codefs.makeDir(req.session.user+"/",null);

  codefs.save(req.session.user,codeFile.name,codeFile,function(err){
    console.log(err);
    if(err)
      req.flash("alert", "fail to save code in server");
    else
      req.flash("msg", "Successfully uploaded the code");
    res.redirect("/");
  });
}

exports.loadMySlotList = function(req,callback){
  codefs.makeDir(req.session.user+"/",function(err){
    if(err)
      console.log("Directory already maded");
    codefs.getSlotList(req.session.user,callback);
  });
}

exports.getPrimaryAIPath = function(id){
  var codeName = user.getPrimaryAI(id);
  if(codeName)
    return id + "/" + user.getPrimaryAI(id);
  else
    return null;
}
exports.getAIPath = function(id, codeName) {
  return id + "/" + codeName;
}

exports.loadOtherPrimaryCode = function(req,callback){
  var otherName = req.param("red");
  var codeName = user.getPrimaryAI(otherName);
  if(!codeName){
    callback("No valid components' AI code.");
  } else {
    callback(null,otherName + "/" + codeName);
  }
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