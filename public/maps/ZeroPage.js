var _map = (function (){
  var base = [
    { x: 100, y : 100, r : 50, num : 30, team : "red"},
    { x: 800 - 100, y : 600 - 100, r : 50, num :30, team : "blue"}
  ];

  var freeBase = [
    { x : 300, y : 300, num : 10, r : 15},
    { x : 701, y : 100, num : 5, r : 30},
    { x : 350, y : 250, num : 5, r : 20},
    { x : 400, y : 50, num : 30, r : 45},
    { x : 250, y : 400, num : 20, r : 30}
  ];
  return freeBase.concat(freeBase.map(dup)).concat(base);


  function dup(node){
    return {x : 800 - node.x, y : 600 - node.y, num : node.num, r : node.r};
  }
})();
