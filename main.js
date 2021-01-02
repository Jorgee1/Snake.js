class Rect
{
    constructor(x, y, h, w)
    {
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
    }

    toString()
    {
        return {
            x: this.x,
            y: this.y,
            h: this.h,
            w: this.w
        };
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
                (A.x <= B.x) && (A.x + A.w >= B.x)
            ) || (
                (A.x >= B.x) && (B.x + B.w >= A.x)
            )
        ) && (
            (
                (A.y <= B.y) && (A.y + A.h >= B.y)
            ) || (
                (A.y >= B.y) && (B.y + B.h >= A.y)
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
    constructor(x, y, size, color)
    {
        this.padding = 3; // important for colition detection

        this.speed = new Point();
        this.speed_max = new Point(size, size);

        this.tail = [
            new Rect(
                x + this.padding,
                y + this.padding,
                size - this.padding * 2,
                size - this.padding * 2
            )
        ];
        this.color = color;

        this.idle = -1;
        this.up = 0;
        this.down = 1;
        this.left = 2;
        this.right = 3;

        this.state = this.idle;

        this.is_grow_time = false;
        this.is_shrink_time = false;
    }

    get_future_head()
    {
        return new Rect(
            this.tail[0].x + this.speed.x,
            this.tail[0].y + this.speed.y,
            this.tail[0].h,
            this.tail[0].w
        );
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
        if (this.is_grow_time)
        {
            this.tail.push(new Rect());
            this.is_grow_time = false;
        }
        else if (this.is_shrink_time)
        {
            this.tail = [
                new Rect(
                    this.tail[0].x,
                    this.tail[0].y,
                    this.tail[0].h,
                    this.tail[0].w
                )
            ];
            this.is_shrink_time = false;
        }

        for (var i = this.tail.length - 1; i > 0; i--)
        {
            this.tail[i].x = this.tail[i-1].x;
            this.tail[i].y = this.tail[i-1].y;
            this.tail[i].h = this.tail[i-1].h;
            this.tail[i].w = this.tail[i-1].w;
        }

        this.tail[0].x += this.speed.x;
        this.tail[0].y += this.speed.y;

        this.speed.x = 0;
        this.speed.y = 0;
    }

    draw(context)
    {
        context.fillStyle = this.color;

        for (var i = 0; i < this.tail.length; i++)
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

var cell_size = 20;
var screen = new Screen('can', "#000000");
var input = new Input();

var snake = new Snake(20, 200, cell_size, "#FF0000");
var food  = new Food(100, 100, 2 * cell_size, "#FFFF00");

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

    // Colittion detection

    // Collition between food and head
    if (check_rect_colition(snake.tail[0], food.position))
    {
        food.respawn(screen.h, screen.w);
        snake.is_grow_time = true;
    }

    // Collition between head and body
    for (var i = 1; i < snake.tail.length; i++)
    {
        if (check_rect_colition(snake.tail[0], snake.tail[i]))
        {
            snake.is_shrink_time = true;
            break;
        }
    }

    // Colition between head and screen
    var future_head = snake.get_future_head();
    if (future_head.x + future_head.w + snake.padding > screen.w)
    {
        snake.tail[0].x = snake.padding;
    }
    else if (future_head.x - snake.padding < 0)
    {
        snake.tail[0].x = screen.w - (snake.tail[0].w + snake.padding);
    }

    if (future_head.y + future_head.h + snake.padding > screen.h)
    {
        snake.tail[0].y = snake.padding;
    }
    else if (future_head.y - snake.padding < 0)
    {
        snake.tail[0].y = screen.h - (snake.tail[0].h + snake.padding);
    }

    // Update snake
    var frame_delta = current_frame - reference_frame;
    if (frame_delta > frame_skip)
    {
        switch(snake.state){
            case snake.up: snake.move_up(); break;
            case snake.down: snake.move_down(); break;
            case snake.left: snake.move_left(); break;
            case snake.right: snake.move_right(); break;
            case snake.idle: break;
        }
    
        if (input.is_locked)
        {
            input.lock = false;
        }
        snake.update();
        reference_frame = current_frame;
    }



    // Render
    screen.clear();

    snake.draw(screen.context);
    food.draw(screen.context);
}


screen.run_game_loop(loop);