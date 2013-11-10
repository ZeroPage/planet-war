var _map = (function (){
  var base = [
    { x: 100, y : 600 - 100, r : 50, num : 40, team : "red"},
    { x: 800 - 100, y : 100, r : 50, num : 40, team : "blue"}
  ];

  var freeBaseDup = [
    {x : 130, y : 470, r: 10,num : 30},
    {x : 160, y : 450, r: 10,num : 30},
    {x : 190, y : 400, r: 10,num : 30},
    {x : 250, y : 360, r: 10,num : 30},
    {x : 300, y : 320, r: 10,num : 30},
    {x : 100, y : 500, r: 10,num : 30},
    {x : 100, y : 500, r: 40,num : 30},
    {x : 100, y : 500, r: 40,num : 30},
    {x : 100, y : 500, r: 40,num : 30},
    {x : 100, y : 500, r: 40,num : 30}
  ];
  var freeBaseNoDup = [
    {x : 400, y : 300, r: 80,num : 1}
  ];

  return freeBaseDup.concat(freeBaseDup.map(dup)).concat(base).concat(freeBaseNoDup);

  function dup(node){
    return {x : 800 - node.x, y : 600 - node.y, num : node.num, r : node.r};
  }
})();