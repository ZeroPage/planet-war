var _map = (function (){
  var base = [
    { x: 50, y : 50, r : 10, num : 5, team : "red"},
    { x: 800 - 50, y : 600 - 50, r : 10, num :5, team : "blue"}
  ];

  var freeBase = [
    { x : 130, y : 130, num : 10, r : 30},
    { x : 50, y : 170, num : 10, r : 30},
    { x : 180, y : 50, num : 10, r : 30},
    { x : 380, y : 200, num : 30, r : 50},
    { x : 250, y : 320, num : 30, r : 50},
    { x : 700, y : 70, num : 20, r : 40}
  ];
  return freeBase.concat(freeBase.map(dup)).concat(base);


  function dup(node){
    return {x : 800 - node.x, y : 600 - node.y, num : node.num, r : node.r};
  }
})();
