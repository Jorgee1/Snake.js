var Food = {
    x: 0,
    y: 0,
    h: 0,
    w: 0,
    color: "#FF0000",
    init: function(screen,dim,color){
        this.respawn(screen);
        this.h     = dim;
        this.w     = dim;
        this.color = color;
        return this;
    },
    respawn: function(screen){
        this.x=Math.random()*(screen.width-this.w);
        this.y=Math.random()*(screen.height-this.h);
    },
    draw: function(contex){
        contex.fillStyle = this.color;
        contex.fillRect(this.x,this.y,this.h,this.w);
    }
};
