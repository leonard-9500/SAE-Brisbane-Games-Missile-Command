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

ctx.save();
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
class EnemyMissile
{
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.r = 5;
        this.velX = 0;
        this.velY = 0;
        this.spawnX = 0;
        this.spawnY = 0;
        this.destX = 0;
        this.destY = 0;
        this.angle = 0;
        this.speed = 0.1;
        this.colMissile = "#bb4444";
        this.colTrail = "#c2c2c2";
    }

    update()
    {
        this.x -= this.velX;
        this.y -= this.velY;
        //this.collisionDetection();
        this.draw();
    }

    collisionDetection()
    {
        // If enemy missile it out of bounds which very rarely happens by a few pixels even though the random numbers are chosen within the SCREEN_WIDTH
        if (this.x < 0) { this.x = 0 };
        if (this.x > SCREEN_WIDTH) { this.x = SCREEN_WIDTH };
        if (this.y < 0) { this.y = 0 };
        if (this.y > SCREEN_HEIGHT) { this.y = SCREEN_HEIGHT };
    }

    draw()
    {
        // Draw trail
        ctx.strokeStyle = this.colTrail;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.spawnX, this.spawnY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        // Draw missile
        ctx.fillStyle = this.colMissile;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class EnemySpawner
{
    constructor()
    {
        this.enemies = [];
        this.enemiesCount = 0;
        // How often is a new enemy missile spawned
        this.spawnInterval = 1500;
        this.spawnTick = Date.now();
    }

    update()
    {
        if (tp1 - this.spawnTick >= this.spawnInterval)
        {
            this.spawnTick = Date.now();
            this.spawnEnemy();
        }

        this.collisionDetection();
        if (this.enemiesCount > 0)
        {
            for (let i = 0; i < this.enemies.length; i++)
            {
                this.enemies[i].update();
            }
        }
    }

    collisionDetection()
    {
        // An array of all indices of dead enemies
        let deadEnemies = [];
        let deadEnemiesCount = 0;
        // Check for missiles out of bounds
        for (let i = 0; i < this.enemies.length; i++)
        {
            let isOut = false;
            if (this.x < 0) { isOut = true; };
            if (this.x > SCREEN_WIDTH) { isOut = true; };
            if (this.y < 0) { isOut = true; };
            if (this.y > SCREEN_HEIGHT) { this.y = SCREEN_HEIGHT };
            if (this.enemies[i].x < 0 || this.enemies[i].x > SCREEN_WIDTH || this.enemies[i].y < 0 || this.enemies[i].y > SCREEN_HEIGHT)
            {
                deadEnemies[deadEnemiesCount] = i;
                deadEnemiesCount += 1;
            }
        }
        // Delete all dead enemies
        for (let i = 0; i < deadEnemies.length; i++)
        {
            this.enemies.splice(deadEnemies[i], 1);
            this.enemiesCount -= 1;
        }

        deadEnemies = [];
        deadEnemiesCount = 0;
        // Check for enemies that are hit by bullets
        if (player.leftBattery.bullet.isExploding)
        {
            for (let i = 0; i < this.enemies.length; i++)
            {
                let w = player.leftBattery.bullet.x-this.enemies[i].x,
                    h = player.leftBattery.bullet.y-this.enemies[i].y;
                if (Math.sqrt((w*w)+(h*h)) < player.leftBattery.bullet.r+this.enemies[i].r)
                {
                    deadEnemies[deadEnemiesCount] = i;
                    deadEnemiesCount += 1;
                }
            }
        }
        player.killedEnemyMissiles += deadEnemiesCount;
        // Delete all dead enemies
        for (let i = 0; i < deadEnemies.length; i++)
        {
            this.enemies.splice(deadEnemies[i], 1);
            this.enemiesCount -= 1;
        }
        
        deadEnemies = [];
        deadEnemiesCount = 0;
        if (player.midBattery.bullet.isExploding)
        {
            for (let i = 0; i < this.enemies.length; i++)
            {
                let w = player.midBattery.bullet.x-this.enemies[i].x,
                    h = player.midBattery.bullet.y-this.enemies[i].y;
                if (Math.sqrt((w*w)+(h*h)) < player.midBattery.bullet.r+this.enemies[i].r)
                {
                    deadEnemies[deadEnemiesCount] = i;
                    deadEnemiesCount += 1;
                }
            }
        }
        player.killedEnemyMissiles += deadEnemiesCount;
        // Delete all dead enemies
        for (let i = 0; i < deadEnemies.length; i++)
        {
            this.enemies.splice(deadEnemies[i], 1);
            this.enemiesCount -= 1;
        }

        deadEnemies = [];
        deadEnemiesCount = 0;
        if (player.rightBattery.bullet.isExploding)
        {
            for (let i = 0; i < this.enemies.length; i++)
            {
                let w = player.rightBattery.bullet.x-this.enemies[i].x,
                    h = player.rightBattery.bullet.y-this.enemies[i].y;
                if (Math.sqrt((w*w)+(h*h)) < player.rightBattery.bullet.r+this.enemies[i].r)
                {
                    deadEnemies[deadEnemiesCount] = i;
                    deadEnemiesCount += 1;
                }
            }
        }
        player.killedEnemyMissiles += deadEnemiesCount;
        // Delete all dead enemies
        for (let i = 0; i < deadEnemies.length; i++)
        {
            this.enemies.splice(deadEnemies[i], 1);
            this.enemiesCount -= 1;
        }
    }

    spawnEnemy()
    {
        // Add new enemy to array
        this.enemies[this.enemiesCount] = new EnemyMissile;

        // Assign coordinates for start and end position
        this.enemies[this.enemiesCount].spawnX = getRandomIntInclusive(0, SCREEN_WIDTH);
        this.enemies[this.enemiesCount].spawnY = SCREEN_HEIGHT;

        this.enemies[this.enemiesCount].destX = getRandomIntInclusive(0, SCREEN_WIDTH);
        this.enemies[this.enemiesCount].destY = 25;

        // Move enemy missile to spawn coordinates
        this.enemies[this.enemiesCount].x = this.enemies[this.enemiesCount].spawnX;
        this.enemies[this.enemiesCount].y = this.enemies[this.enemiesCount].spawnY;

        // Get width and height difference of enemy missile start and end points
        let diffX = this.enemies[this.enemiesCount].destX-this.enemies[this.enemiesCount].spawnX;
        let diffY = this.enemies[this.enemiesCount].destY-this.enemies[this.enemiesCount].spawnY;

        // Set angle according to path points
        this.enemies[this.enemiesCount].angle = Math.atan(diffX/diffY) * 180/Math.PI;

        // Get velocity from angle
        this.enemies[this.enemiesCount].velX = Math.sin(this.enemies[this.enemiesCount].angle * Math.PI / 180)*this.enemies[this.enemiesCount].speed*elapsedTime;
        this.enemies[this.enemiesCount].velY = Math.cos(this.enemies[this.enemiesCount].angle * Math.PI / 180)*this.enemies[this.enemiesCount].speed*elapsedTime;

        this.enemiesCount += 1;
        console.log("Spawned new enemy missile.\n");
    }
}

class Bullet
{
    constructor()
    {
        // This prevents unspawned bullets from exploding right away because of being at the egde of the viewport.
        this.x = SCREEN_WIDTH/2;
        this.y = SCREEN_HEIGHT/2;
        this.r = 2;
        this.speed = 1;
        this.velX = 0;
        this.velY = 0;
        // The start point of the bullet
        this.p0X = 0;
        this.p0Y = 0;
        // The end point of the bullet
        this.p1X = 0;
        this.p1Y = 0;
        this.angle = 0;
        this.faceColor = "#ffffff";
        // Has the bullet reached it's target. The player's crosshair location when he fired or the edge of the viewport.
        this.hasHit = false;
        // How long does the explosion last. in ms
        this.explosionLength = 500;
        // The time point at which the explosion starts.
        this.explosionTick = Date.now();
        // How large is the radius of the explosion.
        this.explosionR = 50;
        this.normalR = 2;
        this.isExploding = false;
        // This is true when the bullet is spawned.
        this.isActive = false;
        // When hitting a target, this is false.
        this.isMoving = false;
    }

    update()
    {
        if (this.isActive)
        {
            if (this.hasHit)
            {
                this.velX = 0;
                this.velY = 0;

                this.explosionTick = Date.now();
                this.hasHit = false;
                this.isMoving = false;
                this.isExploding = true;
            }

            if (this.isMoving)
            {
                this.x += this.velX;
                this.y += this.velY;
            }

            if (this.isExploding)
            {
                if (tp1 - this.explosionTick <= this.explosionLength)
                {
                    // Interpolate the radius of the bullet at explosion time linearly.
                    // So if 250ms have passed the bullet will have a radius of 50 * 0.5 = 25; This may lead to a smaller bullet than before the explosion
                    // if the last game loop cycle was too short though.
                    // This did lead to radii of -0.1 so I added a 1 in front, so it will always be greater than 0.
                    this.r = 1 + this.explosionR * ((tp1 - this.explosionTick) / this.explosionLength);
                    //this.r += 1;
                }
                // If the explosion has finished, despawn the bullet.
                else if (tp1 - this.explosionTick > this.explosionLength)
                {
                    this.isExploding = false;
                    this.r = 2;
                    this.isActive = false;
                }
            }

            this.collisionDetection();
            this.draw();
        }
    }

    collisionDetection()
    {
        if (!this.hasHit)
        {
            if (!this.isExploding)
            {
                // If bullet is at edge of viewport
                if (this.x-this.r < 0 || this.x+this.r > SCREEN_WIDTH || this.y-this.r < 0 || this.y+this.r > SCREEN_HEIGHT)
                {
                    this.hasHit = true;
                }
                
                // If bullet is at the location the player's crosshair was when he started firing.
                let w = this.p1X-this.x,
                    h = this.p1Y-this.y;
                /*
                if (Math.sqrt((w*w)+(h*h)) < this.r)//this.p1X-this.x < this.r && this.p1Y-this.y < this.r)
                {
                    this.hasHit = true;
                }
                */

                // If the bullet has travelled a longer path than from start point to end point. So if it has overshot it's target.
                let bw = this.x-this.p0X, // bulletpath width
                    bh = this.y-this.p0Y, // bulletpath height
                    pw = this.p1X-this.p0X, // spawnlocation-to-crosshair-location-path width
                    ph = this.p1Y-this.p0Y; //spawnlocation-to-crosshair-location-path height

                if (Math.sqrt((bw*bw)+(bh*bh)) > Math.sqrt((pw*pw)+(ph*ph)))
                {
                    this.x = this.p1X;
                    this.y = this.p1Y;
                    this.hasHit = true;
                }
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
        this.bullet = new Bullet;
    }

    update()
    {
        this.bullet.update();
        this.collisionDetection();
        this.draw()
    }

    collisionDetection()
    {
    }

    spawnBullet()
    {
        if (!this.bullet.isActive)
        {
            this.bullet.isActive = true;
            this.bullet.isMoving = true;

            // Get start and end point of bullet path
            this.bullet.p0X = this.x + this.width/2;
            this.bullet.p0Y = this.y + this.height/2;
            this.bullet.p1X = player.crosshair.x;
            this.bullet.p1Y = player.crosshair.y;

            // Put bullet at start of path
            this.bullet.x = this.bullet.p0X;
            this.bullet.y = this.bullet.p0Y;

            // Get width and height difference of bullet start and end points
            let diffX = this.bullet.p1X - this.bullet.p0X;
            let diffY = this.bullet.p1Y - this.bullet.p0Y;

            // Set angle according to path points
            this.bullet.angle = Math.atan(diffX/diffY) * 180/Math.PI;

            this.bullet.velX = Math.sin(this.bullet.angle * Math.PI / 180)*this.bullet.speed*elapsedTime;
            this.bullet.velY = Math.cos(this.bullet.angle * Math.PI / 180)*this.bullet.speed*elapsedTime;
        }
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
        this.speed = 0.5;
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
        if (wPressed) { this.y +=  this.speed * elapsedTime; };
        if (aPressed) { this.x += -this.speed * elapsedTime; };
        if (sPressed) { this.y += -this.speed * elapsedTime; };
        if (dPressed) { this.x +=  this.speed * elapsedTime; };
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
        // Draw cross
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

        // Draw circle
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
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

        this.midBattery.x = SCREEN_WIDTH/2 - this.midBattery.width/2;
        this.midBattery.y = 25;
        this.midBattery.speed *= 2;

        this.rightBattery.x = SCREEN_WIDTH - 100;
        this.rightBattery.y = 25;

        this.killedEnemyMissiles = 0;
        this.pointsPerEnemyMissile = 10;
        this.score = 0;
        this.colText = "#ffffff";
        this.textSize = 24;
    }

    update()
    {
        this.handleInput();

        this.crosshair.update();

        this.leftBattery.update();
        this.midBattery.update();
        this.rightBattery.update();

        this.score = this.killedEnemyMissiles * this.pointsPerEnemyMissile;
        this.draw();
    }

    handleInput()
    {
        if (jPressed) { this.leftBattery.spawnBullet();  };
        if (kPressed) { this.midBattery.spawnBullet();   };
        if (lPressed) { this.rightBattery.spawnBullet(); };
    }

    draw()
    {
        // Draw score
        ctx.textAlign = "center";
        ctx.font = this.textSize + "px sans-serif";
        ctx.fillStyle = this.colText;

        //ctx.restore();
        // This draws the text flipped as the ctx has been flipped horizontally.
        //ctx.save();
        // This can draw the text correctly, but results in very poor performance.
        ctx.scale(1, 1);
        ctx.transform(1, 0, 0, 1, 0, SCREEN_HEIGHT);
        ctx.fillText(this.score, SCREEN_WIDTH/2, SCREEN_HEIGHT-50);

        ctx.scale(1, -1);
        ctx.transform(1, 0, 0, 1, 0, -SCREEN_HEIGHT);
    }
}

/* Function definitions */
function getRandomIntInclusive(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum and minimum are inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let player = new Player;
let enemySpawner = new EnemySpawner;

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

    enemySpawner.update();
    player.update();
}

// Start the game loop
main();