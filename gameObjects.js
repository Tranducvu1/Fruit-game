class GameObject {
    constructor(x, y, radius, img, sizeIndex) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.img = new Image();
        this.img.src = img;
        this.sizeIndex = sizeIndex;
        this.velocityY = 0;
        this.falling = false;
        this.lastCollisionTime = 0;
        this.hasReachedBottom = false;
    }

    startFalling() {
        this.falling = true;
    }

    update(deltaTime) {
        if (this.falling) {
            this.velocityY += gravity;
            this.y += this.velocityY * deltaTime;
            this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
            if (this.y + this.radius > canvas.height) {
                this.y = canvas.height - this.radius;
                this.velocityY = 0;
                this.falling = false;
                this.hasReachedBottom = true;
            }
        }
    }

    draw() {
        c.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
}