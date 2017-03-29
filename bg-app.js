/**
 * Created by ekoodi on 29.3.2017.
 */

//var blockerGameApp = (function(){

    window.addEventListener("load", startGame);

    var gameBlock;
    var gameObstacles = [];

    function startGame() {
        myGameArea.start();
        gameBlock = new component(30, 30, "blue", 10, 120);
    }

    var myGameArea = {
        start : function() {
            this.canvas = document.getElementById("bg-canvas");
            this.context = this.canvas.getContext("2d");
            this.frameCount = 0;
            this.interval = setInterval(updateGameArea, 20);
            window.addEventListener('keydown', function(e){
                myGameArea.key = e.keyCode;
            });
            window.addEventListener('keyup', function(e){
                myGameArea.key = false;
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



    function component(width, height, color, x, y){
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        var ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.update = function() {
            ctx = myGameArea.context;
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        };
        this.newPos = function(){
            this.x += this.speedX;
            this.y += this.speedY;
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
        var x, y;
        for (var i = 0; i < gameObstacles.length; i += 1) {
            if (gameBlock.collideWith(gameObstacles[i])) {
                myGameArea.stop();
                return;
            }
        }
        myGameArea.clear();
        myGameArea.frameCount += 1;
        if (myGameArea.frameCount === 1 || everyInterval(150)) {
            x = myGameArea.canvas.width;
            y = myGameArea.canvas.height - 200;
            gameObstacles.push(new component(10, 200, "green", x, y));
        }
        for (i = 0; i < gameObstacles.length; i += 1) {
            gameObstacles[i].x += -1;
            gameObstacles[i].update();
        }
        gameBlock.speedY = 0;
        gameBlock.speedX = 0;
        if (myGameArea.key && myGameArea.key == 37) {gameBlock.speedX = -1; }
        if (myGameArea.key && myGameArea.key == 39) {gameBlock.speedX = 1; }
        if (myGameArea.key && myGameArea.key == 38) {gameBlock.speedY = -1; }
        if (myGameArea.key && myGameArea.key == 40) {gameBlock.speedY = 1; }
        //gameBlock.x += 1;
        gameBlock.newPos();
        gameBlock.update();
    }

    function moveUp(){
        gameBlock.speedY -= 1;
    }

    function moveDown(){
        gameBlock.speedX += 1;
    }

    function stopMove() {
        gameBlock.speedX = 0;
        gameBlock.speedY = 0;
    }

//    return{};

//})();
