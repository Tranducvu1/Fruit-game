class GameObject {
    //constrcutor ball location, velocity,radius,masss
    constructor(x, y, vx, vy, radius, img, sizeIndex, mass,easing = Tween.easeLinear) {
        this.x = x;
        this.y = y;
        this.vx = vx; 
        this.vy = vy; 
        this.mass = mass;
        this.radius = radius;
        this.img = new Image();
        this.img.src = img;
        this.isColliding = false;
        this.sizeIndex = sizeIndex;
        this.falling = false;
        this.hasReachedBottom = false;
        this.groundRestitution = 0.15;
        this.wallRestitution = 0.6;
        this.canClick = true; 
        this.easing = easing;
    }

    
    //starting faling
    startFalling() {
        this.falling = true;
        this.canClick = false; 
    }
    //update balll after secondpassed
    update(secondsPassed) {

        this.vy += gravity;
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
        this.detectEdgeCollisions();

       //Check whether it touches the ground or not
        if (Math.abs(this.vy) < 1 && Math.abs(this.vx) < 1) {
            this.canClick = true; 
            this.falling = false;
        }
    }
    ///dêtctcollision ball walls
    detectEdgeCollisions() {
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx = Math.abs(this.vx) * this.wallRestitution;
        } else if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
            this.vx = -Math.abs(this.vx) * this.wallRestitution;
        }

        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vy = Math.abs(this.vy) * this.wallRestitution;
        } else if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.vy = -Math.abs(this.vy) * this.groundRestitution;
            this.hasReachedBottom = true;
        }
    }
    //draw ball
    draw() {
        c.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
    //check click if ball faling
    isClickable() {
        return this.canClick;
    }
}