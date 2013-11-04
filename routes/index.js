exports.code = require("./code.node.js");
exports.game = require("./game.node.js");

var code = require("./code.node.js");
var user = require("./user.node.js");
var map = require("./map.node.js");

exports.index = function(req, res){
  if(req.session.user){
    code.loadMySlotList(req.session.user, function(err, myCodes){
      res.render('lobby', {title : "Lobby", myCodes : myCodes});    
    });
  } else {
    res.render('index', { title: 'League of Planets' });  
  }
};

exports.auth = function(req, res, next){
  if(!req.session.user){
    res.redirect("/?redirect=" + encodeURIComponent(req.url));
  } else {
    next();
  }
}

exports.login = function(req, res){
  var id = req.param("id");
  var password = req.param("password");

  if(user.checkPassword(id, password)){
    req.session.user = id;
  } else {
    req.flash("alert", "Wrong ID or PASSWORD");
  }
  res.redirect("/");

}

exports.logout = function(req, res){
  delete req.session.user;
  req.flash("msg", "succesefully logout");
  res.redirect("/");
}

exports.signupForm = function(req, res){
  res.render("signup", {title : "signup"});
}
exports.signup = function(req, res){
  var id = req.param("id");
  var password = req.param("password");

  if(!id || !password){
    req.flash("alert", "Put ID and Password what you want.");
    res.redirect("/");
    return;
  }
  user.register(id, password, function(err){
    if(err) {
      if(err == "already exist id"){
        req.flash("alert", "already exist ID");
      }else if(err){
        console.log(err);
        req.flash("alert", "write error! please try again.");
      }
      res.redirect("/");

      return;
    }
    req.session.user = id;
    res.redirect("/");
    return;
  });
}
exports.match = function(req, res){
  code.loadMySlotList(req.session.user,function(err, myCodes){
    if(err){
      req.flash("alert", "can't load my code list.");
      req.redirect("/match");
      return;
    }
    map.listMap(function(err, maps){
      if(err){
        req.flash("alert", "can't load map list.");
        req.redirect("/match");
        return;
      }
      user.getOthersAI(function(err, other){
        res.render("match", {
          title : "match",
          myCodes : myCodes,
          other: other,
          maps: maps
        });
      });
    });
  });
}
exports.help = function(req, res){
  res.render("help", {title : "help"});
}
exports.setPrimaryCode = function(req,res){
  var codeName = req.param("codeName");
  user.setPrimaryCode(req.session.user, codeName, function(err){
    if(err)
      req.flash("alert", "error" + err);
    else    
      req.flash("msg", "Set primary code as \""+codeName+"\"");
    res.redirect("/");
  });
}