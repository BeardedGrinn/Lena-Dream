const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
const player = { x: 50, y: 300, width: 30, height: 30, dy: 0, jumpHeight: -10, gravity: 0.3 };
const obstacles = [];
let gameSpeed = 2.5;
let score = 0;
let gameOver = false;

// Obstacle timing
let lastObstacleTime = 0; // Time since last obstacle creation
let nextObstacleInterval = getRandomInterval(250, 1000); // Random interval between obstacles (ms)

// Function to generate a random interval
function getRandomInterval(min, max) {
  return Math.random() * (max - min) + min;
}

// Handle player jumping
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && player.y === canvas.height - player.height) {
    player.dy = player.jumpHeight;
  }
});

// Main game loop
function gameLoop(timestamp) {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = "red";
  player.y += player.dy;
  player.dy += player.gravity;
  if (player.y > canvas.height - player.height) player.y = canvas.height - player.height;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Create obstacles with random interval
  if (timestamp - lastObstacleTime > nextObstacleInterval) {
    obstacles.push({ x: canvas.width, y: canvas.height - 30, width: 30, height: 30 });
    lastObstacleTime = timestamp; // Update the time of the last obstacle
    nextObstacleInterval = getRandomInterval(200, 1000); // Generate a new random interval
  }

  // Draw and move obstacles
  obstacles.forEach((obstacle, index) => {
    obstacle.x -= gameSpeed;
    ctx.fillStyle = "black";
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    // Check for collision
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      gameOver = true;
      alert("Game Over! Your score: " + score);
    }

    // Remove off-screen obstacles
    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
    }
  });

  // Update score
  score++;
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);

  // Call the next frame
  requestAnimationFrame(gameLoop);
}

// Utility function to get random interval
function getRandomInterval(min, max) {
  return Math.random() * (max - min) + min; // Random value between min and max
}

// Start the game
requestAnimationFrame(gameLoop);
