var code = require("./code.node.js");
exports.static = function(req, res){
  if(req.session.user){
    code.loadMySelectedCode(req,function(err, myCode){
      code.loadOtherPriCode(req,function(err, otherCode){
    	res.render("game", {
   	title : "game",
 	blue : myCode,
    	red : otherCode,
    	map : req.param("map")
        });
      });
    });
  }
}