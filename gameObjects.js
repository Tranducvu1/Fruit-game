class GameObject {
    constructor(x, y, vx, vy, radius, img, sizeIndex, mass) {
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
        this.groundRestitution = 0.2;
        this.wallRestitution = 0.6;
        this.canClick = true; 
    }

    startFalling() {
        this.falling = true;
        this.canClick = false; 
    }
    
    update(secondsPassed) {
        this.vy += gravity;
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
        this.detectEdgeCollisions();

       
        if (Math.abs(this.vy) < 1 && Math.abs(this.vx) < 1) {
            this.canClick = true; 
            this.falling = false;
        }
    }

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

    draw() {
        c.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }

   
    isClickable() {
        return this.canClick;
    }
}