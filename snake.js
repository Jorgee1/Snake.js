var Snake = {
    x    :  0,
    y    :  0,
    w    :  0,
    h    :  0,

    velx :  0,
    vely :  0,
    vel  : 10,
    state:  0,

    tail :  1,
    posx : [],
    posy : [],

    color: "#FF0000",
    
    init : function(x,y,dim,vel,color){
        this.x  =   x;
        this.y  =   y;
        this.h  = dim;
        this.w  = dim;
        this.vel= vel;
        this.colot=color;
        return this;
    },
    draw : function(contex){
        contex.fillStyle = this.color;
        for(var i=0;i<this.tail;i++){
            contex.fillRect(this.posx[i],this.posy[i],this.h,this.w);
        }
    },
    update: function(){
        this.x+=this.velx;
        this.y+=this.vely;

        for(var i=0;i<this.tail-1;i++){
            this.posx[i] = this.posx[i+1];
            this.posy[i] = this.posy[i+1];
        }
        this.posx[this.tail-1] = this.x;
        this.posy[this.tail-1] = this.y;
        //console.log(this.posx+ " " +this.posy);
    },
    moveUp: function(){
        this.vely=-this.vel;
        this.velx=0;
        this.state=1;
    },
    moveDown: function(){
        this.vely=+this.vel;
        this.velx=0;
        this.state=2;
    },
    moveLeft: function(){
        this.velx=-this.vel;
        this.vely=0
        this.state=3;
    },
    moveRight: function(){
        this.velx=+this.vel;
        this.vely=0;
        this.state=4;
    },
    moveState: function(){
        switch(this.state){
            case 0:break;
            case 1:this.moveUp()   ;break;
            case 2:this.moveDown() ;break;
            case 3:this.moveLeft() ;break;
            case 4:this.moveRight();break;
        }
    },
    grow: function(){
        this.tail++;
        console.log(this.posx+" "+this.posy);
    },
    shrink: function(){
        var tempx = this.posx[this.tail-1];
        var tempy = this.posy[this.tail-1];
        this.posx    = [];
        this.posy    = [];
        this.posx[0] = tempx;
        this.posy[0] = tempy;
        this.tail=1;
    },
    Colition: function(){
        for(var i=0;i<this.tail-1;i++){
            //console.log(this.posx[i]+" "+this.posy[i]);
            if(this.boxColition(this.tail-1,i)){
                return true;
            }
        }
        return false;
    },
    boxColition: function(id1,id2){
        var A = {x:this.posx[id1],y:this.posy[id1],h:this.h,w:this.w};
        var B = {x:this.posx[id2],y:this.posy[id2],h:this.h,w:this.w};
        if( (   ((A.x<=B.x)&&(A.x+A.h>=B.x)) || ((A.x>=B.x)&&(B.x+B.h>=A.x))   ) &&  (   ((A.y<=B.y)&&(A.y+A.w>=B.y)) || ((A.y>=B.y)&&(B.y+B.w>=A.y))   ) ){
            return true;
        }
        return false;
    }
};
