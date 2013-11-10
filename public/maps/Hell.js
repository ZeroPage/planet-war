var _map = (function (){
  var base = [
    { x: 100, y : 600 - 100, r : 100, num : 80, team : "red"},
    { x: 800 - 100, y : 100, r : 100, num : 80, team : "blue"}
  ];

  var freeBaseDup = [
    {x : 190, y : 400, r: 10,num : 6},
    {x : 300, y : 520, r: 10,num : 2},
    {x : 100, y : 100, r: 40,num : 1},
    {x : 240, y : 200, r: 20,num : 15},
  ];
  var freeBaseNoDup = [
    {x : 400, y : 300, r: 120,num : 110}
  ];

  return freeBaseDup.concat(freeBaseDup.map(dup)).concat(base).concat(freeBaseNoDup);

  function dup(node){
    if(node.team =="red"){
      return {x : 800 - node.x, y : 600 - node.y, num : node.num, r : node.r, team : "blue"}; 
    }else if(node.team =="blue"){
      return {x : 800 - node.x, y : 600 - node.y, num : node.num, r : node.r, team : "red"}; 
    }else{
      return {x : 800 - node.x, y : 600 - node.y, num : node.num, r : node.r}; 
    }
  }
})();