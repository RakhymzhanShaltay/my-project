const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startButton");
const menu = document.getElementById("menu");
const highScoreDisplay = document.getElementById("highScore");

let player = { x: canvas.width / 2 - 25, y: canvas.height - 50, width: 50, height: 20, speed: 7 };
let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;
let keys = {};
let difficulty = 1;
let lives = 3;
let bestScore = localStorage.getItem('bestScore') || 0;


function updateHighScore() {
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
    }
    highScoreDisplay.textContent = `Лучший результат: ${bestScore}`;
}


function createEnemy() {
    const x = Math.random() * (canvas.width - 50);
    const speed = 2 + Math.random() * 2 * difficulty;
    enemies.push({ x, y: 0, width: 40, height: 40, speed });
}


function drawPlayer() {
    ctx.fillStyle = "green";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}


function drawBullets() {
    ctx.fillStyle = "red";
    bullets.forEach((bullet, index) => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullets.splice(index, 1);
    });
}


function drawEnemies() {
    ctx.fillStyle = "blue";
    enemies.forEach((enemy, index) => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) {
            lives -= 1;
            enemies.splice(index, 1);
            if (lives === 0) {
                gameOver = true;
            }
        }
    });
}


function handleCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score += 10;
                if (score % 100 === 0) {
                    difficulty += 0.5; // Увеличиваем сложность каждый раз, когда очки делятся на 100
                }
            }
        });
    });
}


function updatePlayer() {
    if (keys["ArrowLeft"] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys["ArrowRight"] && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}


function shoot() {
    bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10, speed: 7 });
}


function gameLoop() {
    if (gameOver) {
        updateHighScore();
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText(`Game Over! Score: ${score}`, canvas.width / 2 - 150, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawBullets();
    drawEnemies();
    handleCollisions();
    updatePlayer();

    requestAnimationFrame(gameLoop);
}


document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key === " ") shoot();
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function startGame() {
    score = 0;
    gameOver = false;
    lives = 3;
    difficulty = 1;
    enemies = [];
    bullets = [];
    player.x = canvas.width / 2 - 25;

    canvas.style.display = "block";
    menu.style.display = "none";

    setInterval(createEnemy, 1000);
    gameLoop();
}

startButton.addEventListener("click", startGame);

function showMenu() {
    canvas.style.display = "none";
    menu.style.display = "flex";
    updateHighScore();
}

showMenu();
