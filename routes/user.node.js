
/*
 * GET users listing.
 */
var fs = require("fs");
var crypto = require("crypto");

var users = {};
fs.readFile("user.json", "utf8", function(err, data){
  if(err){
    throw err;
  } else {
    users = JSON.parse(data);
  }
});

exports.check = function(id, password){
  return users[id] == hash(password);
};
exports.add = function(id, password, callback){
  if(users[id] || id == ""){
    return false;
  } else {
    users[id] = hash(password);
    fs.writeFile("user.json", JSON.stringify(users), "utf8", callback);
    return true;
  }
}
function hash(data){
  var hash = crypto.createHash("sha512");
  hash.update(data, "utf8");
  return hash.digest("base64");
}
