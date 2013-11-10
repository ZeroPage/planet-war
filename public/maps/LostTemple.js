var _map = (function (){
  var base = [
    { x: 100, y : 600 - 300, r : 50, num : 30, team : "red"},
    { x: 800 - 100, y : 300, r : 50, num : 30, team : "blue"}
  ];

  var freeBaseDup = [
    {x : 400, y : 80, r: 40,num : 30},
    {x : 130, y : 230, r: 10,num : 2},
    {x : 120, y : 500, r: 40,num : 20}
  ];
  var freeBaseNoDup = [
    {x : 400, y : 300, r: 80,num : 50}
  ];
  freeBaseDup.push({
    x : Math.random() * 700 + 50, 
    y : Math.random() * 500 + 50, 
    num : parseInt(Math.random() * 20 + 5), 
    r : parseInt(Math.random() * 20 + 10)
  });

  return freeBaseDup.concat(freeBaseDup.map(dup)).concat(base).concat(freeBaseNoDup);

  function dup(node){
    return {x : 800 - node.x, y : 600 - node.y, num : node.num, r : node.r};
  }
})();