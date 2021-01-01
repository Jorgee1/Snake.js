class Rect
{
    constructor(x, y, h, w)
    {
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
    }
}

class Point
{
    constructor(x=0, y=0)
    {
        this.x = x;
        this.y = y;
    }
}



class Screen
{
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


class Input
{
    constructor()
    {
        this.left  = 65;
        this.right = 68;
        this.up    = 87;
        this.down  = 83;

        this.on  = true;
        this.off = false;

        this.keys = {}

        this.keys[this.left]  = this.off;
        this.keys[this.right] = this.off;
        this.keys[this.up]    = this.off;
        this.keys[this.down]  = this.off;

        document.onkeydown = this.key_on.bind(this);
        document.onkeyup   = this.key_off.bind(this);
    }

    key_on(event)
    {
        var key = event.keyCode;
        var keys = Object.keys(this.keys)

        if (keys.includes(key.toString()))
        {
            this.keys[key] = this.on;
        }
    }

    key_off(event)
    {
        var key = event.keyCode;
        var keys = Object.keys(this.keys)

        if (keys.includes(key.toString()))
        {
            this.keys[key] = this.off;
        }
    }
}

class Food
{
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

    draw(context)
    {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.h, this.w);
    }
}

class Snake
{
    constructor(x, y, h, w, speed, tail_size, color)
    {
        this.position = new Rect(x, y, h, w);
        this.speed = new Point();
        this.max_speed = new Point(speed, speed);
        this.tail_size = tail_size;
        this.tail = [new Rect(x, y, h, w)];
        this.color = color;

        this.direction = 0;
    }

    update()
    {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        for (var i = 0; i < this.tail_size - 1; i++)
        {
            this.tail[i] = this.tail[i+1];
        }
        this.tail[this.tail_size - 1] = this.position;

        this.speed.x = 0;
        this.speed.y = 0;
    }

    grow()
    {
        this.tail_size += 1;
    }

    draw()
    {
        context.fillStyle = this.color;
        for (var i = 0; i < this.tail; i++)
        {
            context.fillRect(
                this.tail[i].x,
                this.tail[i].y,
                this.tail[i].h,
                this.tail[i].w
            );
        }
    }
}