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

function check_rect_colition(A, B){
    if(
        (
            (
                (A.x < B.x) && (A.x + A.w > B.x)
            ) || (
                (A.x > B.x) && (B.x + B.w > A.x)
            )
        ) && (
            (
                (A.y < B.y) && (A.y + A.h > B.y)
            ) || (
                (A.y > B.y) && (B.y + B.h > A.y)
            )
        )
    ){
        return true;
    }
    return false;
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
        this.frame = 0;
    }

    clear()
    {
        this.context.fillStyle = this.color;
        this.context.fillRect(0, 0, this.w, this.h);
    }

    run_game_loop(callback)
    {
        callback(this.frame);

        this.frame += 1;
        window.requestAnimationFrame(() => {
            this.run_game_loop(callback);
        });
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

        this.keys = {};

        this.lock = false;

        this.keys[this.left]  = this.off;
        this.keys[this.right] = this.off;
        this.keys[this.up]    = this.off;
        this.keys[this.down]  = this.off;

        document.onkeydown = this.key_on.bind(this);
        document.onkeyup   = this.key_off.bind(this);
    }

    is_locked()
    {
        return this.lock;
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
    constructor(x, y, size, color)
    {
        this.position = new Rect(x, y, size, size);
        this.color = color
    }

    respawn(screen_h, screen_w)
    {
        this.position.x = Math.random() * (screen_w - this.position.w);
        this.position.y = Math.random() * (screen_h - this.position.h);
    }

    draw(context)
    {
        context.fillStyle = this.color;
        context.fillRect(
            this.position.x,
            this.position.y,
            this.position.h,
            this.position.w
        );
    }
}

class Snake
{
    constructor(x, y, size, tail_size, color)
    {
        var padding = 1;

        this.position = new Rect(
            x + padding,
            y + padding,
            size - padding,
            size - padding
        );
        this.speed = new Point();
        this.speed_max = new Point(size, size);
        this.tail_size = tail_size;
        this.tail = [
            new Rect(
                x + padding,
                y + padding,
                size - padding,
                size - padding
            )
        ];
        this.color = color;

        this.state = -1;

        this.up = 0;
        this.down = 1;
        this.left = 2;
        this.right = 3;

        this.direction = 0;
    }

    face_up()
    {
        if (this.state != this.down)
        {
            this.state = this.up;
        }
    }
    face_down()
    {
        if (this.state != this.up)
        {
            this.state = this.down;
        }
    }
    face_left()
    {
        if (this.state != this.right)
        {
            this.state = this.left;
        }

    }
    face_right()
    {
        if (this.state != this.left)
        {
            this.state = this.right;
        }
    }

    move_up()
    {
        this.speed.x = 0;
        this.speed.y = -this.speed_max.y;
    }
    move_down()
    {
        this.speed.x = 0;
        this.speed.y = this.speed_max.y;
    }
    move_left()
    {
        this.speed.x = -this.speed_max.x;
        this.speed.y = 0;
    }
    move_right()
    {
        this.speed.x = this.speed_max.x;
        this.speed.y = 0;
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

    draw(context)
    {
        context.fillStyle = this.color;

        for (var i = 0; i < this.tail_size; i++)
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
var cell_size = 10;
var screen = new Screen('can', "#000000");
var input = new Input();
var snake = new Snake(
    30, 200, cell_size,
    1, "#FF0000"
);
var food = new Food(
    100, 100, 2 * cell_size,
    "#FFFF00"
);

var reference_frame = 0;
var frame_skip = 3;

food.respawn(screen.h, screen.w);

function loop(current_frame)
{
    // Check Input

    if (!input.is_locked())
    {
        if (input.keys[input.left])
        {
            snake.face_left();
            input.lock = true;
        }
        else if (input.keys[input.right])
        {
            snake.face_right();
            input.lock = true;
        }
        else if (input.keys[input.up])
        {
            snake.face_up();
            input.lock = true;
        }
        else if (input.keys[input.down]) 
        {
            snake.face_down();
            input.lock = true;
        }
    }


    switch(snake.state){
        case 0: snake.move_up();    break;
        case 1: snake.move_down();  break;
        case 2: snake.move_left();  break;
        case 3: snake.move_right(); break;
        case -1: break;
    }


    // Colittion detection

    if (check_rect_colition(snake.position, food.position))
    {
        //snake.grow(); TODO: FIX
        food.respawn(screen.h, screen.w);
    }

    // Update objects
    var frame_delta = current_frame - reference_frame;
    if (frame_delta > frame_skip)
    {
        snake.update();
        if (input.is_locked)
        {
            input.lock = false;
        }
        reference_frame = current_frame;
    }


    // Render
    screen.clear();

    snake.draw(screen.context);
    food.draw(screen.context);
}


screen.run_game_loop(loop);