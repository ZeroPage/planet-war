var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var flash = require("flashify");

var app = express();

var sessionStore = new express.session.MemoryStore();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon("public/favicon.png"));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({store: sessionStore}));
  app.use(flash);
  app.use(helper);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post("/login", routes.login);
app.get("/logout", routes.logout);
app.get("/signup", routes.signupForm);
app.post("/signup", routes.signup);
app.post("/code", routes.auth, routes.code.upload);
app.get("/code/:id/:codeName", routes.code.loadRequestedFile);
app.get("/game", routes.game.static);
app.get("/code/primary", routes.auth, routes.setPrimaryCode);
app.get("/code/delete", routes.auth, routes.deleteCode);
app.get("/help", routes.help)
app.get("/match", routes.auth, routes.match)
app.get("/match/random", routes.auth, routes.randomMatch);
app.post("/score", routes.code.score);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

function helper(req, res, next){
  res.locals.user = req.session.user;
  next();
}
