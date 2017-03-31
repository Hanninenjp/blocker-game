/**
 * Created by ekoodi on 29.3.2017.
 */

window.addEventListener("load", startGame);

var gameCharacter;
var gameBackground;
var gameObstacles = [];
var gameScore;

function startGame() {
    gameArea.start();
    gameCharacter = new CharacterComponent(34, 30, "./images/c-frame-?.png", 4, 5, 120, gameArea.context);
    gameBackground = new BackgroundComponent(540, 270, "./images/beach-background.png", gameArea.context);
    gameScore = new TextComponent("30px", "Consolas", "black", gameArea.context, 280, 30);
}

var gameArea = {
    start: function () {
        this.canvas = document.getElementById("bg-canvas");
        this.context = this.canvas.getContext("2d");
        this.frameCount = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            gameArea.keys = (gameArea.keys || []);
            gameArea.keys[e.keyCode] = (e.type === "keydown");
        });
        window.addEventListener('keyup', function (e) {
            gameArea.keys[e.keyCode] = (e.type === "keydown");
        });
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
};

function updateGameArea() {

    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (var i = 0; i < gameObstacles.length; i += 1) {
        if (gameCharacter.collideWith(gameObstacles[i])) {
            gameArea.stop();
            return;
        }
    }
    gameArea.clear();
    gameArea.frameCount += 1;
    gameBackground.move(-1, 0);
    gameBackground.update();
    if (gameArea.frameCount === 1 || (gameArea.frameCount % 150) === 0) {
        x = gameArea.canvas.width;
        minHeight = 20;
        maxHeight = 160;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 50;
        maxGap = 70;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        //Obstacles are currently never removed from the array, even after they leave the canvas
        gameObstacles.push(new ObstacleComponent(20, height, "green", gameArea.context, x, 0));
        gameObstacles.push(new ObstacleComponent(20, x - height - gap, "green", gameArea.context, x, height + gap));
    }
    for (i = 0; i < gameObstacles.length; i += 1) {
        gameObstacles[i].move(-1, 0);
        gameObstacles[i].update();
    }
    gameScore.update("SCORE: " + gameArea.frameCount);
    //Controlling character movement needs further attention!!!
    var speedX=0, speedY=0;
    if (gameArea.keys && gameArea.keys[37]) {
        speedX = -1;
    }
    if (gameArea.keys && gameArea.keys[39]) {
        speedX = 1;
    }
    if (gameArea.keys && gameArea.keys[38]) {
        speedY = -1;
    }
    if (gameArea.keys && gameArea.keys[40]) {
        speedY = 1;
    }
    gameCharacter.move(speedX, speedY);
    gameCharacter.update();
}

function ObstacleComponent(width, height, color, ctx, x, y){
    this.width = width;
    this.height = height;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.move = function (speedX, speedY) {
        this.x += speedX;
        this.y += speedY;
    };
    this.update = function () {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}

function TextComponent(fontSize, fontFamily, fontColor, ctx, x, y) {
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.fontColor = fontColor;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.text = "";
    this.update = function (text) {
        this.text = text;
        this.ctx.font = this.fontSize + " " + this.fontFamily;
        this.ctx.fillStyle = this.fontColor;
        this.ctx.fillText(this.text, this.x, this.y);
    };
}

function BackgroundComponent(width, height, source, ctx) {
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.image = new Image();
    this.image.src = source;
    this.ctx = ctx;
    this.move = function(speedX, speedY){
        this.x += speedX;
        this.y += speedY;
        if (this.x === -(this.width)) {
            this.x = 0;
        }
    };
    this.update = function () {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    };
}

function CharacterComponent(width, height, source, frames, x, y, ctx) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.source = source;
    this.frames = frames;
    this.frame = 1;
    this.image = new Image();
    this.image.src = this.source.replace("?", this.frame);
    this.ctx = ctx;
    this.move = function(speedX, speedY){
        this.x += speedX;
        this.y += speedY;
        if (this.x < 0) {
            this.x = 0;
        }
        //Add similar checks for other canvas dimensions!!!
    };
    this.update = function () {
        //This part needs some reconsideration!!!
        //Character  image frame handling can potentially be improved!
        if (gameArea.frameCount !== 0 && (gameArea.frameCount % 10) === 0) {
            this.frame = this.frame < this.frames ? this.frame + 1 : 1;
        }
        this.image.src = this.source.replace("?", this.frame);
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    this.collideWith = function (gameObject) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = gameObject.x;
        var otherright = gameObject.x + (gameObject.width);
        var othertop = gameObject.y;
        var otherbottom = gameObject.y + (gameObject.height);
        var collide = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            collide = false;
        }
        return collide;
    };
}
