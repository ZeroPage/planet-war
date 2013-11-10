var globalStartTime = Date.now();
var resource = {
  earth : [],
  mars : [],
  moon : [],
  settle : [],
  otherPlanet : []
}

//earth와 관련된 모든 리소스를 담고, 순서대로 출력
for(var i =0; i < 17; i++){
  	resource.earth[i] = new Image();
  	resource.earth[i].src = "/images/planet/blue/"+(i+1)+".png";
}

for(var i = 0; i < 18; i++){
  	resource.mars[i] = new Image();
  	resource.mars[i].src = "/images/planet/red/"+(i+1)+".png";
}

for(var i = 0; i< 10; i++){
	resource.moon[i] = new Image();
	resource.moon[i].src = "/images/planet/gray/"+(i+1)+".png";
}

for(var i = 0; i< 4; i++){
	resource.settle[i] = new Image();
	resource.settle[i].src = "/images/settles/settle_"+(i+1)+".png";
}

for(var i = 0;i < 3;i++){
	resource.otherPlanet[i] = new Image();
	resource.otherPlanet[i].src = "/images/planet/other/"+(i+1)+".png";
}

function Game(blue, red){
  var canvas = document.getElementsByTagName('canvas')[0];
  var ctx = canvas.getContext("2d");
  var blueWorker = new Worker("/code/" + blue);
  var redWorker = new Worker("/code/" + red);
  
  this.redId = red.substr(0, red.indexOf("/"));;
  this.blueId = blue.substr(0, blue.indexOf("/"));;
  
  var PlanetframNum = 1;

  var that = this;

  //map
  this.node = _map.map(function(item, index){
    var node = new Node(item, index);
    return node;
  });

  //just for Army
  this.army = [];

  //listener
  blueWorker.onmessage = function(msg){
    if(msg.data.debug)
      console.log(msg.data.debug);
    else
      that.command("blue", msg.data);
  }
  redWorker.onmessage = function(msg){
    that.command("red", msg.data);
  }

  var dt = 0;
  var curTime = Date.now();
  function loop(){
    var oldTime = curTime;
    curTime = Date.now();
    dt = curTime - oldTime;
   
    blueWorker.postMessage(that.makeInfo("blue"));
    redWorker.postMessage(that.makeInfo("red"));

    that.draw(ctx, dt);

    if (!that.run(dt))
      setTimeout(loop, 0);
  }
  setTimeout(loop, 0);
  this.initScore();
}
Game.prototype.draw = function(ctx, dt){
  var that = this;
  //clear all
  ctx.clearRect(0,0,800,600);

  //draw map
  this.node.forEach(function(node){
    node.draw(ctx, dt);
  });
  //draw army
  this.army.forEach(function(army){
    army.draw(ctx);
  });
}
Game.prototype.run = function(dt){
  //calc regen to map
  this.node.forEach(function(node){
    node.run(dt)
  });
  
  //move Army
  this.army = this.army.filter(function(army){
    return army.run(dt);
  });
  var red = 0;
  var blue = 0;
  
  //calc score
  this.node.forEach(function(ele){
    if(ele.team === "red"){
      red += ele.num;
    } else if(ele.team === "blue"){
      blue += ele.num;
    }
  });
  this.army.forEach(function(ele){
    if(ele.team === "red"){
      red += ele.num;
    } else if(ele.team === "blue"){
      blue += ele.num;
    }
  });
  this.updateScore(red, blue);
  return this.matchResultCheck(red, blue, dt);
}
Game.prototype.command = function(team, data){
  if(data.from == data.to)
    return; 
  data.send = parseInt(data.send);
  if(data.send <= 0 )
    return;

  var from = this.node[data.from];
  if(team != from.team){
    return;
  }
  if(from.num < data.send){
    return;
  }
  if(from.cooldown[data.to] < 1000){
	return;
  }
  from.cooldown[data.to] = 0;
  
  var to = this.node[data.to];
  this.army.push(new Army(from, to, data.send, team));
}
Game.prototype.makeInfo = function(team){

  return { 
    map : this.node.map(function(node){
      return node.info();
    }),
    army : this.army.map(function(army){
      return army.info();
    }),
    team : team
  };
}
Game.prototype.initScore = function(){
  this.redScore = document.getElementById("redScore");
  this.blueScore = document.getElementById("blueScore");
}
Game.prototype.updateScore = function(red, blue){
  this.redScore.innerText = red;
  this.blueScore.innerText = blue;
};
Game.prototype.matchResultCheck = function(red, blue, dt){
  if(globalStartTime+5*60*1000<Date.now()){
    console.log("Time over, draw");
    //Draw
	end(this.redId, this.blueId, true);
    return "draw";
  }
  var redPlanetNum = 0;
  var bluePlanetNum = 0;
  this.node.forEach(function(item){
    if(item.team == "red"){
      redPlanetNum++;
    }else if(item.team == "blue"){
      bluePlanetNum++;
    }
  });
  if(redPlanetNum==0&&red==0){
    console.log("Blue Wins!");
	end(this.blueId, this.redId);
    return "blue";
  }else if(bluePlanetNum==0&&blue==0){
    console.log("Red Wins!");
	end(this.redId, this.blueId);
    return "red";
  }//자기 행성이 없으면서 스코어도 없으면 GG
};

function Node(self, id, numOfNode){
  this.x = self.x;
  this.y = self.y;
  this.r = self.r;
  this.num = self.num || 0;
  this.team = self.team;
  this.id = id;
  this.regenCount = 0;

  this.index1 = parseInt(Math.random()*10)%3; 
  
  //for cooldown
  this.cooldown = [];
  for(var i = 0; i < numOfNode; i++){
	this.cooldown[i] = 1000;
  }

  //for animation
  var pick = Math.random();
  if(pick < 0.5){
  	this.type = "mars";
  }else {
  	this.type = "earth";
  }

  if(this.r <= 15){
  	this.type = "other";
  }

  if(this.r>15 && this.r<30){
  	this.type = "moon";
  }
  //this.type = pick < 0.6 ? pick < 0.3 ? "mars": "moon": "earth" : "other";
  this.animateTime  = 0;
  //rotationPeriod 4000ms ~ 8000ms
  this.rotationPeriod = parseInt(Math.random()*4000) + 4000;
}

Node.prototype.run = function(dt){
  this.regenCount += dt * this.r;
  if(this.regenCount > 50000){
    this.regenCount = 0;

    if(!this.team){
      return;
    } 
    if(this.r > this.num){
      this.num += 1;
    } else if(this.r < this.num){
      this.num -= 1;
    }
  }
  
  for(var i =0; i < this.cooldown.length; i++){
	this.cooldown[i] += dt ;
	if(this.cooldown[i] > 1000) this.cooldown[i] = 1000;
  }
}
Node.prototype.draw = function(ctx, dt){
  ctx.save();
  
  //for number
  if(this.team == "red") ctx.fillStyle = "rgba(255,0,0,0.8)";
  if(this.team == "blue") ctx.fillStyle = "rgba(0,0,255,0.8)";
  if(!this.team) ctx.fillStyle = "rgba(200, 200,200,0.6)";
  
  ctx.beginPath();
  var start = -Math.PI/2;
  var end = (this.num > this.r ? 1 : this.num/this.r) * (Math.PI*3/2)//(Math.PI*2-0.6);
  
  var space = this.r * 1.1 > this.r + 5 ? this.r * 1.1 : this.r + 5;
  ctx.arc(this.x, this.y, space, start, start+end, false);
  ctx.arc(this.x, this.y, space + 5, start+end, start, true);
  ctx.closePath();
  ctx.fill();

  //over
  if(this.num > this.r){
    ctx.beginPath();
    ctx.arc(this.x, this.y, space +5, -(Math.PI), -(Math.PI/2), false);
    ctx.arc(this.x, this.y, space+10, -(Math.PI/2), -(Math.PI), true);
    ctx.closePath();
    ctx.fillStyle = "green";
    ctx.fill();
  }

  //for cooldown
  ctx.beginPath();
  var start = -Math.PI/2;
  var end = this.cooldown.reduce(min, 1000)/1000 * Math.PI * 2;
  
  ctx.arc(this.x, this.y, space+5, start, start+end, false);
  ctx.arc(this.x, this.y, space+10, start+end, start, true);
  ctx.closePath();
  ctx.fillStyle = "rgba(128,128,128,0.4)";
  ctx.fill();
  
  //text
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.fillText("" + this.num + "/" + this.r, this.x, this.y + this.r + 10);

  switch(this.type){
    case "earth" :
	var index = parseInt(this.animateTime/(this.rotationPeriod/resource.earth.length)) || 0;
	var img = resource.earth[index];
	ctx.drawImage(img, this.x - this.r, this.y-this.r, this.r*2, this.r*2);
	break;
    case "mars":
    	var index = parseInt(this.animateTime/(this.rotationPeriod/resource.mars.length)) || 0;
    	var img = resource.mars[index];
      	ctx.drawImage(img, this.x - this.r, this.y-this.r, this.r*2, this.r*2);
      	break;
    case "moon":
    	var index = parseInt(this.animateTime/(this.rotationPeriod/resource.moon.length)) || 0;
    	var img = resource.moon[index];
      	ctx.drawImage(img, this.x - this.r, this.y-this.r, this.r*2, this.r*2);
      	break;
    case "other":
    	ctx.drawImage(resource.otherPlanet[this.index1], this.x-(this.r/2+5), this.y-(this.r/2+5), this.r+10, this.r+10);
    break;
  }
  this.animateTime += dt;
  this.animateTime = this.animateTime % this.rotationPeriod;

  ctx.restore();
}
Node.prototype.add = function(army){
  if(this.team == army.team){
    this.num += army.num;
  } else {
    this.num -= army.num;
    if(this.num < 0){
      this.num = -this.num;
      this.team = army.team;
    }
  }
}
Node.prototype.info = function(){
  return {
    x : this.x,
    y : this.y,
    team : this.team,
    num : this.num,
    size : this.r,
    id : this.id
  }
}


var ARMY_SPEED = 1;

function Army(from, to, num, team){
  this.x = from.x;
  this.y = from.y;

  var dx = from.x - to.x;
  var dy = from.y - to.y;
  
  var len = Math.sqrt(dx * dx + dy * dy);

  this.vx = -dx/len * ARMY_SPEED;
  this.vy = -dy/len * ARMY_SPEED;

  this.team = team;

  this.num = num;
  from.num -= num;

  this.to = to;

  var f = dx < 0; 
  this._check = function(){
    var f2 = this.x - to.x < 0;
    return !((f && f2) ||(!f && !f2));
  }
  
  if(this.num == 42){
	  this.animateTime = 0;
  }
  
}
Army.prototype.run  = function(dt){
  if(this.num == 42){
	this.animateTime += dt;
	if(this.animateTime > 4000)
		this.animateTime %= 4000;
  }
  
  this.x += this.vx * dt / 10;
  this.y += this.vy * dt / 10;

  if(this.check()){
    this.to.add(this);
    return false;
  }
  return true;
}
Army.prototype.draw  = function(ctx){
  ctx.save();
  
  ctx.beginPath();
  if(this.num < 5)
    ctx.arc(this.x, this.y, this.num + 10, 0, Math.PI*2,true);
  else if(this.num < 10)
    ctx.arc(this.x, this.y, this.num + 15, 0, Math.PI*2,true);
  else if(this.num == 42)
    ctx.arc(this.x, this.y, 100, 0, Math.PI*2,true);
  else
    ctx.arc(this.x, this.y, this.num + 20, 0, Math.PI*2,true);
  ctx.closePath();
  //ctx.strokeStyle = this.team;
  //ctx.stroke();
  if(this.team == "red") ctx.fillStyle = "rgba(255,0,0,0.2)";
  if(this.team == "blue") ctx.fillStyle = "rgba(0,0,255,0.4)";
  if(!this.team) ctx.fillStyle = "rgba(200, 200,200,0.2)";
  ctx.fill();
  
  ctx.save();
  
  ctx.translate(this.x, this.y);
  //TODO 적절하게 앵글 조절할것
  var angle;
  if(this.num == 42){
	angle = this.animateTime/4000 * Math.PI * 2;
  } else { 
    angle = Math.atan(this.vx/-this.vy) + (this.vy <= 0 ? 0 : Math.PI);
  }
  
  
  ctx.rotate(angle);
  ctx.translate(-this.x, -this.y);
  
  var size = this.num + 20;
  if(this.num < 5)
	ctx.drawImage(resource.settle[0], this.x - size/2, this.y - size/2, size, size)
  else if(this.num < 10)
    ctx.drawImage(resource.settle[1], this.x - (size+10)/2, this.y - (size+10)/2, size+10, size+10);
  else if(this.num == 42)
    ctx.drawImage(resource.settle[3], this.x - (150)/2, this.y - (150)/2, 150, 150);
  else
    ctx.drawImage(resource.settle[2], this.x - (size+20)/2, this.y - (size+20)/2, size+20, size+20);
  ctx.restore();

  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(this.num, this.x, this.y + this.num + 20);

  ctx.restore();
}
Army.prototype.info = function(){
  return {
    x : this.x,
    y : this.y,
    num : this.num,
    to : this.to.id,
    team : this.team
  }
}
Army.prototype.check = function(){
  return ((this.to.x - this.x) * this.vx <= 0 && (this.to.y - this.y) * this.vy <= 0);
}

function ajax(winnerId, loserId, callback, isDraw){
  var $ajax = new XMLHttpRequest();
  $ajax.open("post", "/score", true);
  $ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var data = "winner="+ winnerId + "&loser=" + loserId + (isDraw ? "&draw=true" : "");
  $ajax.send(data);
  $ajax.addEventListener("readystatechange", function(){
	console.log("saving..", $ajax.readyState);
  	if ($ajax.readyState == 4){
	  console.log("saved");
	  callback && callback();
	}
  });
}

function end(winner, loser, isDraw){
	var $endScreen = document.getElementById("endScreen");
	var $saveProgress = document.getElementById("saveProgress");
	var $backBtn = $endScreen.getElementsByTagName("a")[0];
	var $result = document.getElementById("result");
	if(isDraw)
		$result.innerHTML = "Draw!";
	else
	    $result.innerHTML = winner + " Win!";
	
	$endScreen.style.visibility = "visible";
	ajax(winner, loser, function(){
		$saveProgress.innerHTML = "saved!";
		$backBtn.style.visibility = "visible";
	}, isDraw);
}
function min(prev, curr){
	return prev < curr ? prev : curr;
}
