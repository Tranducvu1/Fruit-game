function update(deltaTime) {
    if (gameState === 'playing') {
        for (let obj of gameObjects) {
            obj.update(deltaTime);
        }
    }
}
//menu ui choose 
function renderMenu() {
    // Draw menu background
    c.drawImage(menuBackgroundImg, canvas.width / 2 - 256, canvas.height * 0.4 - 256, 512, 512);

    // Draw fruit circles
    fruitSizes.forEach((fruit, index) => {
        const x = (canvas.width / 2) + 192 * Math.cos((Math.PI * 2 * index) / 12);
        const y = (canvas.height * 0.4) + 192 * Math.sin((Math.PI * 2 * index) / 12);
        const r = 64;

        const fruitImg = new Image();
        fruitImg.src = fruit.img;
        c.drawImage(fruitImg, x - r, y - r, r * 2, r * 2);
    });

    // Draw start button
    c.drawImage(startButtonImg, canvas.width / 2 - 256, canvas.height * 0.75 - 48, 512, 96);

    // Draw high score
    c.font = '24px Arial';
    c.fillStyle = 'black';
    c.fillText('High Score: ' + highScore, 10, 30);
}
//ui back ground graphic 
function renderCustomGraphics() {
    // Clear canvas
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = '#FFFFCC';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = '#996600';
    c.fillRect(0, 470, canvas.width, canvas.height);
    c.fillStyle = '#ffb27f';
    c.fillRect(0, 520, canvas.width, canvas.height);
    c.fillStyle = '#996600';
    c.fillRect(0, 650, canvas.width, canvas.height);

    const stripeWidth = 20;
    const spacing = 20;
    for (let x = 0; x < canvas.width; x += stripeWidth + spacing) {
        c.fillStyle = '#FF6600';
        c.fillRect(x, 550, stripeWidth, canvas.height - 650);
    }

    c.beginPath();
    c.moveTo(0,200);
    c.lineTo(20, 150);
    c.lineTo(canvas.width - 20, 150);
    c.lineTo(canvas.width, 200);
    c.closePath();
    c.strokeStyle = '#FF6600';
    c.lineWidth = 2;
    c.stroke();

    c.beginPath();
    c.strokeStyle = 'black';
    c.moveTo(0, 660);
    c.lineTo(1024,660);
    c.stroke();

    c.beginPath();
    c.strokeStyle = 'black';
    c.moveTo(0, 690);
    c.lineTo(1024,690);
    c.stroke();

    c.beginPath();
    c.strokeStyle = '#66FF33';
    c.fillRect(400,700,canvas.width,canvas.height);

    drawRoundedRect(0, 200, canvas.width, 430, 20);

}

function drawRoundedRect(x, y, width, height, radius) {
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + width, y);
    c.lineTo(x + width, y + height - radius);
    c.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    c.lineTo(x + radius, y + height);
    c.arcTo(x, y + height, x, y + height - radius, radius);
    c.lineTo(x, y);
    c.closePath();
    c.fillStyle = '#FFFFCC';
    c.globalAlpha = 0.5;
    c.fill();
    c.globalAlpha = 1.0;
    c.strokeStyle = '#CC6600';
    c.lineWidth = 2;
    c.stroke();
}
