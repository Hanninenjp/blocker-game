/**
 * Created by ekoodi on 29.3.2017.
 */

    window.addEventListener("load", startGame);

    var gameCharacter;
    var gameBackground;
    var gameObstacles = [];
    var gameScore;

    function startGame() {
        myGameArea.start();
        gameCharacter = new characterImageComponent(34, 30, "./images/c-frame-1.png", 5, 120);
        gameBackground = new backgroundImageComponent(540, 270, "./images/beach-background.png");
        gameScore = new component("30px", "Consolas", "black", 280, 40, "text");
    }

    var myGameArea = {
        start : function() {
            this.canvas = document.getElementById("bg-canvas");
            this.context = this.canvas.getContext("2d");
            this.frameCount = 0;
            this.interval = setInterval(updateGameArea, 20);
            window.addEventListener('keydown', function(e){
                myGameArea.keys = (myGameArea.keys || []);
                myGameArea.keys[e.keyCode] = (e.type === "keydown");
            });
            window.addEventListener('keyup', function(e){
                myGameArea.keys[e.keyCode] = (e.type === "keydown");
            });
        },
        clear : function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        stop: function(){
            clearInterval(this.interval);
        }
    };

    function everyInterval(n){
        if((myGameArea.frameCount / n) % 1 === 0){
            return true;
        }
        return false;
    }

    function component(width, height, color, x, y, type){
        this.type = type;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.update = function() {
            var ctx = myGameArea.context;
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

    function backgroundImageComponent(width, height, source){
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = 0;
        this.y = 0;
        this.image = new Image();
        this.image.src = source;
        this.update = function(){
            var ctx = myGameArea.context;
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

    function characterImageComponent(width, height, source, x, y){
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = source;
        this.update = function(){
            var ctx = myGameArea.context;
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
                myGameArea.stop();
                return;
            }
        }
        myGameArea.clear();
        myGameArea.frameCount += 1;
        gameBackground.speedX = -1;
        gameBackground.newPos();
        gameBackground.update();
        if (myGameArea.frameCount === 1 || everyInterval(150)) {
            x = myGameArea.canvas.width;
            minHeight = 20;
            maxHeight = 135;
            height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
            minGap = 50;
            maxGap = 80;
            gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
            gameObstacles.push(new component(10, height, "green", x, 0));
            gameObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
        }
        for (i = 0; i < gameObstacles.length; i += 1) {
            gameObstacles[i].x += -1;
            gameObstacles[i].update();
        }
        gameScore.text = "SCORE: " + myGameArea.frameCount;
        gameScore.update();
        gameCharacter.speedY = 0;
        gameCharacter.speedX = 0;
        if (myGameArea.keys && myGameArea.keys[37]) {gameCharacter.speedX = -1; }
        if (myGameArea.keys && myGameArea.keys[39]) {gameCharacter.speedX = 1; }
        if (myGameArea.keys && myGameArea.keys[38]) {gameCharacter.speedY = -1; }
        if (myGameArea.keys && myGameArea.keys[40]) {gameCharacter.speedY = 1; }
        gameCharacter.newPos();
        gameCharacter.update();

    }
