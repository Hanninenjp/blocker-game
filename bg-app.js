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
        gameCharacter = new CharacterImageComponent(34, 30, "./images/c-frame-?.png", 4, 5, 120);
        gameBackground = new BackgroundImageComponent(540, 270, "./images/beach-background.png");
        gameScore = new Component("30px", "Consolas", "black", 280, 40, "text");
    }

    var gameArea = {
        start : function() {
            this.canvas = document.getElementById("bg-canvas");
            this.context = this.canvas.getContext("2d");
            this.frameCount = 0;
            this.interval = setInterval(updateGameArea, 20);
            window.addEventListener('keydown', function(e){
                gameArea.keys = (gameArea.keys || []);
                gameArea.keys[e.keyCode] = (e.type === "keydown");
            });
            window.addEventListener('keyup', function(e){
                gameArea.keys[e.keyCode] = (e.type === "keydown");
            });
        },
        clear : function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        stop: function(){
            clearInterval(this.interval);
        }
    };

    function Component(width, height, color, x, y, type){
        this.type = type;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.update = function() {
            var ctx = gameArea.context;
            if (this.type === "text"){
                ctx.font = this.width + " " + this.height;
                ctx.fillStyle = color;
                ctx.fillText(this.text, this.x, this.y);
            }
            else{
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        };
        this.newPos = function(){
            this.x += this.speedX;
            this.y += this.speedY;
        };
    }

    function BackgroundImageComponent(width, height, source){
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = 0;
        this.y = 0;
        this.image = new Image();
        this.image.src = source;
        this.update = function(){
            var ctx = gameArea.context;
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        };
        this.newPos = function(){
            this.x += this.speedX;
            this.y += this.speedY;
            if(this.x === -(this.width)){
                this.x = 0;
            }
        };
    }

    function CharacterImageComponent(width, height, source, frames, x, y){
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.source = source;
        this.frames = frames;
        this.frame = 1;
        this.image = new Image();
        this.image.src =  this.source.replace("?", this.frame);
        this.update = function(){
            var ctx = gameArea.context;
            if(gameArea.frameCount !== 0 && (gameArea.frameCount % 10) === 0){
                this.frame = this.frame < this.frames ? this.frame + 1 : 1;
            }
            this.image.src =  this.source.replace("?", this.frame);
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        };
        this.newPos = function(){
            this.x += this.speedX;
            this.y += this.speedY;
            if(this.x < 0){
                this.x = 0;
            }
        };
        this.collideWith = function(gameObject){
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
        gameBackground.speedX = -1;
        gameBackground.newPos();
        gameBackground.update();
        if (gameArea.frameCount === 1 || (gameArea.frameCount % 150) === 0) {
            x = gameArea.canvas.width;
            minHeight = 20;
            maxHeight = 160;
            height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
            minGap = 50;
            maxGap = 80;
            gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
            //Obstacles are currently never removed from the array, even after they leave the canvas
            gameObstacles.push(new Component(10, height, "green", x, 0));
            gameObstacles.push(new Component(10, x - height - gap, "green", x, height + gap));
        }
        for (i = 0; i < gameObstacles.length; i += 1) {
            gameObstacles[i].x += -1;
            gameObstacles[i].update();
        }
        gameScore.text = "SCORE: " + gameArea.frameCount;
        gameScore.update();
        gameCharacter.speedY = 0;
        gameCharacter.speedX = 0;
        if (gameArea.keys && gameArea.keys[37]) {gameCharacter.speedX = -1; }
        if (gameArea.keys && gameArea.keys[39]) {gameCharacter.speedX = 1; }
        if (gameArea.keys && gameArea.keys[38]) {gameCharacter.speedY = -1; }
        if (gameArea.keys && gameArea.keys[40]) {gameCharacter.speedY = 1; }
        gameCharacter.newPos();
        gameCharacter.update();
    }
