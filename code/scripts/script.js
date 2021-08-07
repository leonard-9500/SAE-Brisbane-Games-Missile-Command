/* Program: script.js
 * Programmer: Leonard Michel
 * Start Date: 07.08.2021
 * Last Change:
 * End Date: /
 * License: /
 * Version: 0.0.0.0
*/

/**** INITIALIZATION ****/

const SCREEN_WIDTH = 1280;
const SCREEN_HEIGHT = 720;

let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

// Flip the canvas' y-axis.
ctx.scale(1, -1);
// Move the canvas down by SCREEN_HEIGHT as it is currently above the viewport.
ctx.transform(1, 0, 0, 1, 0, -SCREEN_HEIGHT);

let radians = Math.PI / 180;

/* Key Presses */
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

let wPressed = false,
    aPressed = false,
    sPressed = false,
    dPressed = false,
    jPressed = false,
    kPressed = false,
    lPressed = false;

let wPressedBefore = false,
    aPressedBefore = false,
    sPressedBefore = false,
    dPressedBefore = false,
    jPressedBefore = false,
    kPressedBefore = false,
    lPressedBefore = false;

function keyDownHandler(e)
{
    if (e.code == "KeyW") { wPressed = true; }
    if (e.code == "KeyA") { aPressed = true; }
    if (e.code == "KeyS") { sPressed = true; }
    if (e.code == "KeyD") { dPressed = true; }

    if (e.code == "KeyJ") { jPressed = true; }
    if (e.code == "KeyK") { kPressed = true; }
    if (e.code == "KeyL") { lPressed = true; }
}

function keyUpHandler(e)
{
    if (e.code == "KeyW") { wPressed = false; }
    if (e.code == "KeyA") { aPressed = false; }
    if (e.code == "KeyS") { sPressed = false; }
    if (e.code == "KeyD") { dPressed = false; }

    if (e.code == "KeyJ") { jPressed = false; }
    if (e.code == "KeyK") { kPressed = false; }
    if (e.code == "KeyL") { lPressed = false; }
}

/* Class Definitions */
class Bullet
{
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.r = 1;
        this.speed = 5;
        this.velX = 0;
        this.velY = 0;
        this.faceColor = "#ffffff";
        // Has the bullet reached it's target. The player's crosshair location when he fired or the edge of the viewport.
        this.hasHit = false;
        // How long does the explosion last.
        this.explosionLength = 500;
        // The time point at which the explosion starts.
        this.explosionTick = Date.now();
        // How large is the radius of the explosion.
        this.explosionR = 50;
        this.normalR = 1;
        this.isExploding = false;
        this.isActive = true;
    }

    update()
    {
        if (this.isActive)
        {
            this.x += this.velX;
            this.y += this.velY;

            this.collisionDetection();
        }

        if (this.hasHit)
        {
            this.velX = 0;
            this.velY = 0;

            this.explosionTick = Date.now();
            this.hasHit = false;
            this.isExploding = true;
        }

        if (this.isExploding)
        {
            if (tp1 - this.explosionTick < this.explosionLength)
            {
                // Interpolate the radius of the bullet at explosion time linearly.
                // So if 250ms have passed the bullet will have a radius of 50 * 0.5 = 25; This may lead to a smaller bullet than before the explosion
                // if the last game loop cycle was too short though.
                this.r = this.explosionR * (this.explosionLength / (tp1 - this.explosionTick));
            }
            else if (tp1 - this.explosionTick > this.explosionLength)
            {
                this.hasHit = false;
                this.isExploding = false;
                this.isActive = false;
            }
        }
        this.draw();
    }

    collisionDetection()
    {
        if (!this.hasHit)
        {
            // If bullet is at edge of viewport
            if (this.x-this.r < 0 || this.x+this.r > SCREEN_WIDTH || this.y-this.r < 0 || this.y+this.r > SCREEN_HEIGHT)
            {
                this.hasHit = true;
            }
        }
    }

    draw()
    {
        ctx.fillStyle = this.faceColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class Battery
{
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.width = 50;
        this.height = 25;
        this.faceColor = "#bbbbbb";
        this.shootingAngle = 45;
        this.bulletSpeed = 1;
        this.bulletX = 0;
        this.bulletY = 0;
    }

    update()
    {
        this.collisionDetection();
        this.draw()
    }

    collisionDetection()
    {
    }

    draw()
    {
        ctx.fillStyle = this.faceColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Crosshair
{
    constructor()
    {
        this.x = SCREEN_WIDTH / 2;
        this.y = SCREEN_HEIGHT / 2;
        this.velX = 0;
        this.velY = 0;
        this.color = "#ffffff";
    }

    update()
    {
        this.handleInput();
        this.collisionDetection();
        this.draw();
    }

    handleInput()
    {
        if (wPressed) { this.y +=  1; console.log("w pressed\n"); };
        if (aPressed) { this.x += -1; };
        if (sPressed) { this.y += -1; };
        if (dPressed) { this.x +=  1; };
    }

    collisionDetection()
    {
        if (this.x < 0) { this.x = 0 };
        if (this.x > SCREEN_WIDTH) { this.x = SCREEN_WIDTH };
        if (this.y < 0) { this.y = 0 };
        if (this.y > SCREEN_HEIGHT) { this.y = SCREEN_HEIGHT };
    }

    draw()
    {
        let chBarWidth = 2,
            chBarHeight = 5,
            chGap = 2;
        ctx.fillStyle = this.color;
        // Top line
        //ctx.fillRect(this.x - chBarWidth / 2, this.y + chBarHeight, chBarWidth, chBarHeight);
        // Bottom line
        //ctx.fillRect(this.x - chBarWidth / 2, this.y, chBarWidth, chBarHeight);
        // Left line
        //ctx.fillRect(this.x - chBarHeight, this.y + chBarWidth / 2, chBarHeight, chBarWidth);
        // Right line
        //ctx.fillRect(this.x              , this.y + chBarWidth / 2, chBarHeight, chBarWidth);
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 8, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

class Player
{
    constructor()
    {
        this.crosshair = new Crosshair;

        this.leftBattery = new Battery,
        this.midBattery = new Battery,
        this.rightBattery = new Battery;

        this.leftBattery.x = 50;
        this.leftBattery.y = 25;

        this.midBattery.x = SCREEN_WIDTH/2 - this.midBattery.width;
        this.midBattery.y = 25;

        this.rightBattery.x = SCREEN_WIDTH - 100;
        this.rightBattery.y = 25;
    }

    update()
    {
        this.crosshair.update();

        this.leftBattery.update();
        this.midBattery.update();
        this.rightBattery.update();
    }
}

let player = new Player;

// Time variables
let tp1 = Date.now();
let tp2 = Date.now();
let elapsedTime = 0;

// The game loop
window.main = function ()
{
    window.requestAnimationFrame(main);
    // Get elapsed time for last tick.
    tp2 = Date.now();
    elapsedTime = tp2 - tp1;
    //console.log("elapsedTime:" + elapsedTime + "\n");
    tp1 = tp2;

    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Draw background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    player.update();
}

// Start the game loop
main();