var fs = require("fs");
var crypto = require("crypto");

function readUsers(){
  try{
    return require("../users.json");
  } catch (e){

    return {};
  }
}
function sha512(str){
  var hash = crypto.createHash("sha512");
  //salt
  hash.update(str + "zeropage", "utf8");
  return hash.digest("base64");
}
exports.register = function(id, password, callback){
  if(!id || !password || id == "" || password == "") return callback("empty id");
  
  var users = readUsers();
  if(!!users[id]) return callback("already exist id");

  users[id] = {password : sha512(password)};
  fs.writeFile("./users.json", JSON.stringify(users, null, 4), {encode : "utf8"}, callback);
}
exports.checkPassword = function(id, password){
  var users = readUsers();
  if(users[id] && sha512(password) == users[id].password){
    return true;
  }
  return false;
}
exports.getUsersName = function(callback){
  var users = readUsers();
  var names = []
  for(var name in users){
    names.push(name);
  }
  return names;
}