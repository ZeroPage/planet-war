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

exports.loadMySelectedCode = function(req,callback){
  var codeName = req.param("blue");
  callback(null,req.session.user+"/"+codeName);
}

exports.loadOtherPriCode = function(req,callback){
  var otherPriAIPath = user.getOthersPriAI(req);
  if(otherPriAIPath==null){
    req.flash("alert", "No valid components' AI code.");
  }
  callback(null,otherPriAIPath);
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