var resource = {
  earth : [],
  mars : [],
  moon : []
}
//earth와 관련된 모든 리소스를 담고, 순서대로 출력
for(var i =0; i < 7; i++){
  resource.earth[i] = new Image();
  resource.earth[i].src = "/images/planet/blue/"+(i+1)+".png";
}

for(var i = 0; i < 1; i++){
  resource.mars[i] = new Image();
  resource.mars[i].src = "/images/planet/red/"+(i+1)+".png";
}

resource.moon[0] = new Image();
resource.moon[0].src = "/images/planet/gray/1.png";

function Game(blue, red){
  var canvas = document.getElementsByTagName('canvas')[0];
  var ctx = canvas.getContext("2d");
  var blueWorker = new Worker("/code/" + blue);
  var redWorker = new Worker("/code/" + red);
  
  var PlanetframNum = 1;
  this.spaceShip = new Image();
  this.spaceShip.src = 'images/settle_1.png';

  var that = this;

  //map
  this.node = _map.map(function(item, index){
    var node = new Node(item.x, item.y, item.r, item.num, index);
    node.team = item.team;
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
  var ct = Date.now();
  function loop(){
    var oldt = ct;
    ct = Date.now();
    dt = ct - oldt;
   
    blueWorker.postMessage(that.makeInfo("blue"));
    redWorker.postMessage(that.makeInfo("red"));

    that.draw(ctx, dt);

    that.run(dt);

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
    army.draw(ctx, that.spaceShip);
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
Game.prototype.matchResultCheck = function(red, blue){
//need to be implemented
};

function Node(x, y, r, num, id){
  this.x = x;
  this.y = y;
  this.r = r;
  this.num = num || 0;
  this.id = id;
  this.regenCount = 0;
  
  //for animation
  var pick = Math.random();
  this.type = pick < 0.6 ? pick < 0.3? "mars": "moon": "earth";
  this.animateTime  = 0;
  //rotationPeriod 1000ms ~ 5000ms
  this.rotationPeriod = parseInt(Math.random()*4000) + 1000;
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
}
Node.prototype.draw = function(ctx, dt){
  ctx.save();
  
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r*1, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.strokeStyle = "white";
  ctx.stroke();
  
  if(this.team == "red") ctx.fillStyle = "rgba(255,0,0,0.8)";
  if(this.team == "blue") ctx.fillStyle = "rgba(0,0,255,0.8)";
  if(!this.team) ctx.fillStyle = "rgba(200, 200,200,0.6)"
  
  ctx.beginPath();
  var start = -Math.PI/2 + 0.3;
  var end = (this.num/this.r) * (Math.PI*2-0.3);
  var space = this.r * 1.1 > this.r + 5 ? this.r * 1.1 : this.r + 5;
  ctx.arc(this.x, this.y, space, start, start+end, false);
  ctx.arc(this.x, this.y, space + 5, start+end, start, true);
  ctx.closePath();
  ctx.fill();
  
  

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
      ctx.drawImage(resource.mars[0], this.x - this.r, this.y-this.r, this.r*2, this.r*2);
      break;
    case "moon":
      ctx.drawImage(resource.moon[0], this.x - this.r, this.y-this.r, this.r*2, this.r*2);
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
}
Army.prototype.run  = function(dt){
  this.x += this.vx * dt / 10;
  this.y += this.vy * dt / 10;

  if(this.check()){
    this.to.add(this);
    return false;
  }
  return true;
}
Army.prototype.draw  = function(ctx, img){
  ctx.save();
  
  ctx.save();
  
  ctx.translate(this.x, this.y);
  //TODO 적절하게 앵글 조절할것
  var angle = Math.atan(this.vx/-this.vy) + (this.vy <= 0 ? 0 : Math.PI);
  ctx.rotate(angle);
  ctx.translate(-this.x, -this.y);
  
  var size = this.num + 10;
  ctx.drawImage(img, this.x - size/2, this.y - size/2, size, size);
  
  ctx.restore();

  ctx.beginPath();
  ctx.arc(this.x, this.y, this.num + 10, 0, Math.PI*2,true);
  ctx.closePath();
  ctx.strokeStyle = this.team;

  ctx.stroke();

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
//gittest