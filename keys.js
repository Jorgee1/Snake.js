var keys = {
    37:0,
    38:0,
    39:0,
    40:0
};

var Left  = 37;
var Rigth = 39;
var Up    = 38;
var Down  = 40;

document.onkeydown = document.onkeyup = function(event){
    if(event.type=="keydown"){
        switch(event.keyCode){
            case 37: keys[event.keyCode] = 1; break;
            case 38: keys[event.keyCode] = 1; break;
            case 39: keys[event.keyCode] = 1; break;
            case 40: keys[event.keyCode] = 1; break;
        }
    }else if(event.type=="keyup"){
        switch(event.keyCode){
            case 37: keys[event.keyCode] = 0; break;
            case 38: keys[event.keyCode] = 0; break;
            case 39: keys[event.keyCode] = 0; break;
            case 40: keys[event.keyCode] = 0; break;
        }
    }
};
