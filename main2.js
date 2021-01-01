class Rect{
    constructor(x, y, h, w){
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
    }
}

class Point{
    constructor(x=0, y=0)
    {
        this.x = x;
        this.y = y;
    }
}



class Screen{
    constructor(id, color)
    {
        this.canvas = document.getElementById(id);
        this.context = this.canvas.getContext("2d");
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        this.color = color;
    }

    clear()
    {
        this.context.fillStyle = this.color;
        this.context.fillRect(0, 0, this.w, this.h);
    }
}

class Food{
    constructor(x, y, h, w, color)
    {
        this.position = new Rect(x, y, h, w);
        this.color = color
    }

    respawn(screen_h, screen_w)
    {
        this.position.x = Math.random() * (screen_w - this.w);
        this.position.y = Math.random() * (screen_h - this.h);
    }

    draw(context){
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.h, this.w);
    }
}