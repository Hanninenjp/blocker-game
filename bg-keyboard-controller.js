/**
 * Created by ekoodi on 1.4.2017.
 */

function KeyboardController(gameObject){
    this.gameObject = gameObject;
    var self = this;
    this.start = function(){
        document.addEventListener('keydown', function(event){self.keyDownHandler(event)}, false);
        document.addEventListener('keyup', function(event){self.keyUpHandler(event)}, false);
    };
    this.keyDownHandler = function(event){
        console.log("Keydown: " + event.keyCode);
        if(event.keyCode === 39) {
            //right arrow
            this.gameObject.speedX = 1;
        }
        else if(event.keyCode === 37) {
            //left arrow
            this.gameObject.speedX = -1;
        }
        if(event.keyCode === 40) {
            //down arrow
            this.gameObject.speedY = 1;
        }
        else if(event.keyCode === 38) {
            //up arrow
            this.gameObject.speedY = -1;
        }
    };
    this.keyUpHandler = function(event){
        console.log("Keyup: " + event.keyCode);
        if(event.keyCode === 39) {
            //right arrow
            this.gameObject.speedX = 0;
        }
        else if(event.keyCode === 37) {
            //left arrow
            this.gameObject.speedX = 0;
        }
        if(event.keyCode === 40) {
            //down arrow
            this.gameObject.speedY = 0;
        }
        else if(event.keyCode === 38) {
            //up arrow
            this.gameObject.speedY = 0;
        }
    };
}