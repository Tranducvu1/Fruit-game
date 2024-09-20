const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 715;

let gameObjects = [];
let previewBall;
const gravity = 9.8;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
const loseHeight = canvas.height * 0.7;
let ballCount = 0;
let gameState = 'menu';
let Failing = false;
const fruitSizes = [
    { radius: 24, scoreValue: 1, img: './assets/img/circle0.png' },
    { radius: 32, scoreValue: 3, img: './assets/img/circle1.png' },
    { radius: 40, scoreValue: 6, img: './assets/img/circle2.png' },
    { radius: 56, scoreValue: 10, img: './assets/img/circle3.png' },
    { radius: 64, scoreValue: 15, img: './assets/img/circle4.png' },
    { radius: 72, scoreValue: 21, img: './assets/img/circle5.png' },
    { radius: 84, scoreValue: 28, img: './assets/img/circle6.png' },
    { radius: 96, scoreValue: 36, img: './assets/img/circle7.png' },
    { radius: 128, scoreValue: 45, img: './assets/img/circle8.png' },
    { radius: 160, scoreValue: 55, img: './assets/img/circle9.png' },
    { radius: 192, scoreValue: 66, img: './assets/img/circle10.png' }
];

// Load images
const menuBackgroundImg = new Image();
menuBackgroundImg.src = './assets/img/bg-menu.png';
const startButtonImg = new Image();
startButtonImg.src = './assets/img/btn-start.png';

// Load sounds
const sounds = {
    click: new Audio('./assets/click.mp3'),
    pop0: new Audio('./assets/pop0.mp3'),
    pop1: new Audio('./assets/pop1.mp3'),
    pop2: new Audio('./assets/pop2.mp3'),
    pop3: new Audio('./assets/pop3.mp3'),
    pop4: new Audio('./assets/pop4.mp3'),
    pop5: new Audio('./assets/pop5.mp3'),
    pop6: new Audio('./assets/pop6.mp3'),
    pop7: new Audio('./assets/pop7.mp3'),
    pop8: new Audio('./assets/pop8.mp3'),
    pop9: new Audio('./assets/pop9.mp3'),
    pop10: new Audio('./assets/pop10.mp3'),
};


let lastSoundTime = 0;
const soundCooldown = 100; 

function init() {
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('click', handleClick);
    lastTime = performance.now();
    gameLoop();
}

function createPreviewBall() {
  //  if(Failing){
    let size;
    if (ballCount <= 2) {
        size = fruitSizes[0];
    } else if (ballCount >= 3 && ballCount <= 5) {
        size = fruitSizes[1];
    } else if (ballCount >= 6 && ballCount <= 8) {
        size = fruitSizes[2];
    } else {
        size = fruitSizes[Math.floor(Math.random() * 3)];
    }
    previewBall = new GameObject(canvas.width / 2, 32, size.radius, size.img, fruitSizes.indexOf(size));
    ballCount++;
//     Failing = true;
// }
// Failing = false;
}

function handleMouseMove(event) {
    if (gameState === 'playing') {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        if (previewBall) {
            previewBall.x = mouseX;
        }
    }
}

function handleMouseUp() {
    if (gameState === 'playing' && previewBall) {
        if (gameObjects.length === 0 || gameObjects[gameObjects.length - 1].hasReachedBottom) {
        playSound('click');
        previewBall.startFalling();
        gameObjects.push(previewBall);
        createPreviewBall();
    }
}
}

function handleClick(event) {
    if (gameState === 'menu') {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Check if click is on the start button
        if (mouseX > canvas.width / 2 - 256 && mouseX < canvas.width / 2 + 256 &&
            mouseY > canvas.height * 0.75 - 48 && mouseY < canvas.height * 0.75 + 48) {
            playSound('click');
            startGame();
        }
    }
}

function startGame() {
    gameState = 'playing';
    gameObjects = [];
    score = 0;
    ballCount = 0;
    createPreviewBall();
}

function checkCollisions() {
    for (let i = 0; i < gameObjects.length; i++) {
        for (let j = i + 1; j < gameObjects.length; j++) {
            const obj1 = gameObjects[i];
            const obj2 = gameObjects[j];

            const dx = obj2.x - obj1.x;
            const dy = obj2.y - obj1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < obj1.radius + obj2.radius) {
                if (obj1.sizeIndex === obj2.sizeIndex) {
                    mergeFruits(obj1, obj2);
                } else {
                    resolveBounce(obj1, obj2);
                }
            }
        }
    }
}

function mergeFruits(obj1, obj2) {
    const newSizeIndex = obj1.sizeIndex + 1;
    if (newSizeIndex < fruitSizes.length) {
        const newSize = fruitSizes[newSizeIndex];
        const newX = (obj1.x + obj2.x) / 2;
        const newY = (obj1.y + obj2.y) / 2;
        const newFruit = new GameObject(newX, newY, newSize.radius, newSize.img, newSizeIndex);
        newFruit.falling = true;
        gameObjects.push(newFruit);
        
        playSound(`pop${newSizeIndex}`);
    }

    score += fruitSizes[obj1.sizeIndex].scoreValue;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    gameObjects = gameObjects.filter(obj => obj !== obj1 && obj !== obj2);
}

function resolveBounce(obj1, obj2) {
    const dx = obj2.x - obj1.x;
    const dy = obj2.y - obj1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const overlap = (obj1.radius + obj2.radius) - distance;

    if (overlap > 0) {
        const moveX = (dx / distance) * overlap / 2;
       const moveY = (dy / distance) * overlap / 2;

      
      obj2.y += moveY;
        obj1.x -= moveX;
       obj1.y -= moveY;
        obj2.x += moveX;
       obj2.y += moveY;

        obj1.x = Math.max(obj1.radius, Math.min(canvas.width - obj1.radius, obj1.x - moveX));
        obj2.x = Math.max(obj2.radius, Math.min(canvas.width - obj2.radius, obj2.x + moveX));

        // Ensure objects don't sink below the canvas
        obj1.y = Math.min(obj1.y, canvas.height - obj1.radius);
      obj2.y = Math.min(obj2.y, canvas.height - obj2.radius);

        const tempVelocityY = obj1.velocityY;
        obj1.velocityY = obj2.velocityY;
        obj2.velocityY = tempVelocityY;

        playSound('click');
    }
}
function isHorizontalFilled() {
    const filled = new Array(canvas.width).fill(false);

    gameObjects.forEach(obj => {
        const leftBound = Math.max(0, Math.floor(obj.x - obj.radius));
        const rightBound = Math.min(canvas.width - 1, Math.ceil(obj.x + obj.radius));
        for (let i = leftBound; i <= rightBound; i++) {
            filled[i] = true;
        }
    });

    return filled.every(val => val === true);
}

function renderGameOver() {
    c.font = '48px Arial';
    c.fillStyle = 'red';
    c.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);

    c.font = '24px Arial';
    c.fillText('Click to restart', canvas.width / 2 - 100, canvas.height / 2 + 50);

    canvas.addEventListener('click', handleRestart);
}


function checkGameOver() {
    if (isHorizontalFilled()) {
        for (let i = 0; i < gameObjects.length; i++) {
            const obj = gameObjects[i];
            if (obj.y - obj.radius >= loseHeight) {
                gameState = 'gameOver';
                renderGameOver();
                return true;
            }
        }
    }
    return false;
}


function renderGameOver() {
    c.fillStyle = 'rgba(0, 0, 0, 0.5)';
    c.fillRect(0, 0, canvas.width, canvas.height);

    c.font = '48px Arial';
    c.fillStyle = 'red';
    c.textAlign = 'center';
    c.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 50);

    c.font = '24px Arial';
    c.fillStyle = 'white';
    c.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
    c.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 40);

    c.fillText('Click to restart', canvas.width / 2, canvas.height / 2 + 80);

    canvas.addEventListener('click', handleRestart, { once: true });
}

function handleRestart() {
    gameState = 'playing';
    gameObjects = [];
    score = 0;
    ballCount = 0;
    createPreviewBall();
}


function playSound(soundName) {
    // const currentTime = Date.now();
    // if (currentTime - lastSoundTime > soundCooldown) {
        sounds[soundName].play();
    //     lastSoundTime = currentTime;
    // }
}

let lastTime = 0;
function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000; 
    lastTime = currentTime;

    c.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'menu') {
        renderMenu();
    } else if (gameState === 'playing') {
        renderCustomGraphics();

        update(deltaTime);

        gameObjects.forEach(obj => {
            obj.draw();
        });

        if (previewBall) {
            previewBall.draw();
        }

        checkCollisions();
        checkGameOver();

        c.font = '24px Arial';
        c.fillStyle = 'black';
        c.textAlign = 'left';
        c.fillText('Score: ' + score, 10, 30);
        c.fillText('High Score: ' + highScore, 10, 60);
    } else if (gameState === 'gameOver') {
        renderGameOver();
    }

    requestAnimationFrame(gameLoop);
}


init();