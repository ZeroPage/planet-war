function blue(do){
  return function(info, send){
    send(30).from(1).to(2);
  }
}