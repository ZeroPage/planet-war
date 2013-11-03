var code = require("./code.node.js");

exports.static = function(req, res){
  if(req.session.user){

    var codeName = req.param("blue");
    var myCodePath = code.getAIPath(req.session.user, codeName);

    var otherName = req.param("red");
    
    var otherCodePath = code.getPrimaryAIPath(otherName);

    res.render("game", {
      title : "game",
      blue : myCodePath,
      red : otherCodePath,
      map : req.param("map")
    });
  }
}