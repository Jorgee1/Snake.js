
/*global Food:true, Snake:true, keys:true, Left:true, Rigth:true, Up:true, Down:true*/

var screen = Object.create(Screen).init("can","#000000");
var snake  = Object.create(Snake).init(50,50,9,10,"#FF0000");
var food   = Object.create(Food).init(screen,10,"#FFFF00");

var frame = 0;
var frameskip = 5;

main();


function main(){
    setTimeout(function(){
        screen.clear();
        camColition();
        snake.draw(screen.contex);
        food.draw(screen.contex);

        if(frame>=frameskip){
            snake.update();
            eventKey();
            frame=0;
        }
        frame++;

        if(boxColition()){
            snake.grow();
            food.respawn(screen);
        }

        if(snake.Colition()){
            snake.shrink();
        }
        main();
    },1000/60);
}


function camColition(){
    if(snake.x<0){
        snake.x=screen.width-snake.w;
    }else if(snake.x+snake.w>screen.width){
        snake.x=0;
    }

    if(snake.y<0){
        snake.y=screen.height-snake.h;
    }else if(snake.y+snake.h>screen.height){
        snake.y=0;
    }

}
function boxColition(){
    var A = {x:snake.x,y:snake.y,h:snake.h,w:snake.w};
    var B = {x:food.x,y:food.y,h:food.h,w:food.w};
    if( (   ((A.x<B.x)&&(A.x+A.h>B.x)) || ((A.x>B.x)&&(B.x+B.h>A.x))   ) &&  (   ((A.y<B.y)&&(A.y+A.w>B.y)) || ((A.y>B.y)&&(B.y+B.w>A.y))   ) ){
        return true;
    }
    return false;
}
function eventKey(){
    if((keys[Left])  && (snake.state!=4)) {  snake.moveLeft(); }else
    if((keys[Rigth]) && (snake.state!=3)) {  snake.moveRight();}else
    if((keys[Up])    && (snake.state!=2)) {  snake.moveUp();   }else
    if((keys[Down])  && (snake.state!=1)) {  snake.moveDown(); }

    if((!keys[Up]&&!keys[Down])&&(!keys[Left]&&!keys[Rigth])){
        snake.moveState();
    }

}
