var _map = (function (){
  var base = [
    { x: 100, y : 600 - 100, r : 50, num : 40, team : "red"},
    { x: 800 - 100, y : 100, r : 50, num : 40, team : "blue"}
  ];

  var freeBaseDup = [
    {x : 130, y : 400, r: 10,num : 10, team : "blue"},
    {x : 160, y : 450, r: 10,num : 9, team : "blue"},
    {x : 190, y : 400, r: 10,num : 6, team : "red"},
    {x : 250, y : 360, r: 10,num : 4, team : "red"},
    {x : 300, y : 520, r: 10,num : 2},
    {x : 100, y : 100, r: 40,num : 1},
    {x : 150, y : 130, r: 20,num : 15, team : "blue"},
    {x : 200, y : 180, r: 30,num : 15, team : "red"},
    {x : 240, y : 230, r: 20,num : 15, team : "red"},
    {x : 310, y : 170, r: 10,num : 10}
  ];
  var freeBaseNoDup = [
    {x : 400, y : 300, r: 120,num : 0}
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