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

  users[id] = {password : sha512(password), score :{ win : 0, lose : 0, draw : 0}};
  fs.writeFile("./users.json", JSON.stringify(users, null, 4), {encode : "utf8"}, callback);
}
exports.checkPassword = function(id, password){
  var users = readUsers();
  if(users[id] && sha512(password) == users[id].password){
    return true;
  }
  return false;
}
exports.getUsersName = function(){
  var users = readUsers();
  var names = []
  for(var name in users){
    names.push(name);
  }
  return names;
}

exports.getOthersAI = function(callback){
  var users = readUsers();
  var names = [];
  for(var name in users){
    if(!!users[name].primaryCode){
      names.push({name: name, score : users[name].score});
    }
  }
  callback(null, names);
}
exports.getPrimaryAI = function(id){
  var users = readUsers();
  return users[id].primaryCode;
}

exports.setPrimaryCode = function(userName, codeName, callback){
  var users = readUsers();
  users[userName].primaryCode = codeName;
  fs.writeFile("./users.json", JSON.stringify(users, null, 4), {encode : "utf8"}, callback);
}
exports.deleteCode = function(userName,codeName,callback){
  var users = readUsers();
  if(users[userName].primaryCode == codeName){
    delete users[userName].primaryCode;
    //priCode도 삭제해야함.
  }
  fs.writeFile("./users.json", JSON.stringify(users, null, 4), {encode : "utf8"}, function(err){
    fs.unlink("./codes/"+userName+"/"+codeName+".js",callback);
  });
}

exports.addScore = function(winnerId, loserId, callback, isDraw){
  if(winnerId == loserId) return callback();
  var users = readUsers();
  if(isDraw){
    users[winnerId].score.draw++;
    users[loserId].score.draw++;
  } else {
    users[winnerId].score.win++;
    users[loserId].score.lose++;
  }
  fs.writeFile("./users.json", JSON.stringify(users, null, 4), {encode : "utf8"}, callback);
}
exports.getScore = function(id){
	var users = readUsers();
	return users[id].score;
}
exports.getRank = function(){
	var users = readUsers();
	var arr = [];
	for(var user in users){
		arr.push({name : user, score : users[user].score});
	}
	arr.sort(function(left, right){
		if(left.score.win !=  right.score.win){
			return left.score.win < right.score.win;
		}
		if(left.score.lose != right.score.lose){
			return left.score.lose > right.score.lose;
		}
		if(left.score.draw != right.score.draw) {
			return left.score.draw > right.score.draw;
		}
		return true;
	});
	return arr;
}
