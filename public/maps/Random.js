var _map = (function (){
  var base = [
    { x: 100, y : 100, r : 50, num : 30, team : "red"},
    { x: 800 - 100, y : 600 - 100, r : 50, num :30, team : "blue"}
  ];

  var freeBase = [
  ];
  for(var i =0 ; i < 10; i++)
    freeBase.push({
      x : Math.random() * 700 + 50, 
      y : Math.random() * 500 + 50, 
      num : parseInt(Math.random() * 20 + 5), 
      r : parseInt(Math.random() * 20 + 10)
    });
  
  return freeBase.concat(freeBase.map(dup)).concat(base);

  function dup(node){
    return {x : 800 - node.x, y : 600 - node.y, num : node.num, r : node.r};
  }
})();