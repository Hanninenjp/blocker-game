/**
 * Created by ekoodi on 29.3.2017.
 */

window.addEventListener("load", startGame);

var gameCharacter;
var gameBackground;
var obstacleGroup;
var gameScore;

function startGame() {
    gameArea.start();
    gameCharacter = new CharacterComponent(34, 30, "./images/c-frame-?.png", 4, 5, 120, gameArea.context);
    gameBackground = new BackgroundComponent(540, 270, "./images/beach-background.png", gameArea.context);
    obstacleGroup = new ObstacleGroup();
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

    if(obstacleGroup.isCollision(gameCharacter)){
        gameArea.stop();
        return;
    }
    gameArea.clear();
    gameArea.frameCount += 1;
    //Background
    gameBackground.move(-1, 0);
    gameBackground.update();
    //Obstacles
    if (gameArea.frameCount === 1 || (gameArea.frameCount % 150) === 0) {
        obstacleGroup.addGate(20, gameArea.canvas.height, "green", gameArea.context, gameArea.canvas.width, 0);
    }
    obstacleGroup.moveObstacles(-1, 0);
    obstacleGroup.updateObstacles();
    //Score
    gameScore.update("SCORE: " + gameArea.frameCount);
    //Character
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

function ObstacleGroup(){
    this.obstacles = [];
    this.addGate = function(width, height, color, ctx, x, y){
        this.obstacles.push(new ObstacleGate(width, height, color, ctx, x, y));
    };
    this.moveObstacles = function(speedX, speedY){
        for(var i = 0; i < this.obstacles.length; i++){
            if(!this.obstacles[i].move(speedX, speedY)){
                this.obstacles.splice(i, 1);
            }
        }
    };
    this.updateObstacles = function(){
        for(var i = 0; i < this.obstacles.length; i++){
            this.obstacles[i].update();
        }
    };
    this.isCollision = function(gameObject){
        for(var i = 0; i < this.obstacles.length; i++){
            if(this.obstacles[i].isCollision(gameObject)){
                return true;
            }
        }
        return false;
    }
}

function ObstacleGate(width, height, color, ctx, x, y){

    this.components = [];
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    var minGap = 50;
    var maxGap = 70;
    var gateGap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    var minHeight = Math.floor(minGap / 2);
    var maxHeight = this.height - minHeight - gateGap;
    var gateHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    this.components.push(new ObstacleComponent(this.width, gateHeight, this.color, this.ctx, this.x, this.y));
    this.components.push(new ObstacleComponent(this.width, this.height - gateHeight - gateGap, this.color, this.ctx, this.x, gateHeight + gateGap));
    this.move = function(speedX, speedY){
        this.x += speedX;
        this.y += speedY;
        for(var i = 0; i < this.components.length; i++){
            if(!this.components[i].move(speedX, speedY)){
                return false;
            }
        }
        return true;
    };
    this.update = function(){
        for(var i = 0; i < this.components.length; i++){
            this.components[i].update();
        }
    };
    this.isCollision = function(gameObject){
        for(var i = 0; i < this.components.length; i++){
            if(this.components[i].isCollision(gameObject)){
                return true;
            }
        }
        return false;
    };
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
        if(this.x === -(this.width)){
            return false;
        }
        return true;
    };
    this.update = function (){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    this.isCollision = function(gameObject){
        var componentLeft = this.x;
        var componentRight = this.x + this.width;
        var componentTop = this.y;
        var componentBottom = this.y + this.height;
        var objectLeft = gameObject.x;
        var objectRight = gameObject.x + gameObject.width;
        var objectTop = gameObject.y;
        var objectBottom = gameObject.y + gameObject.height;
        if((objectBottom < componentTop ||
            objectLeft > componentRight ||
            objectTop > componentBottom ||
            objectRight < componentLeft )){
            return false;
        }
        return true;
    }
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
        //Alternatively, game over, when character moves to the border
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
}
