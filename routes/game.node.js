exports.static = function(req, res){
  res.render("game", {
    title : "game",
    blue : req.param("blue"),
    red : req.param("red"),
    map : req.param("map")
  });
}