var team;
function debug(str){
  postMessage({debug : str});
}

onmessage = function(msg){
  var info = msg.data;

  team = info.team;

  var bases = info.map.filter(ourTeam);
  var aval = bases.reduce(countAll, -20)/2;
  var enemyBase = info.map.filter(enemy);
  for(var i = 0; i < enemyBase.length; i++){
    if(enemyBase[i].num * 1.1 < aval){
      bases.forEach(sendHalf(enemyBase[i]));
      //break;
    }
  }
}
function ourTeam(node){
  if(node.team == team)
    return true;
  else
    return false;
}
function enemy(node){
  return !ourTeam(node);
}
function countAll(sum, node){
  return sum + node.num;
}
function sendHalf(to){
  return function(node){
    node.num = node.num/2;
    postMessage({send : node.num / 2, from : node.id, to : to.id});
  }
}