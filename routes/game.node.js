var user = require("./user.node.js");

exports.static = function(req, res){
  var blueName = req.param("blueName");
  var blueCode = req.param("blueCode") || user.getPrimaryAI(blueName);

  var redName = req.param("redName");
  var redCode = req.param("redCode") || user.getPrimaryAI(redName);

  if(!blueCode || !redCode){
    req.flash("alert", "can't load code!");
  } 
  res.render("game", {
    title : "Game",
    blue : blueName + "/" + blueCode,
    red : redName + "/" + redCode,
    map : req.param("map")
  });

}
exports.score = function(req, res){
  if(!req.session.user){
	res.send(200);
  }
  user.addScore(req.param("winner"), req.param("loser"), function(){
	res.send("ok");
    res.send(200);
  }, req.param("draw"));
}
