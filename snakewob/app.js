const gridSize = 20;
const canvasSize =1000;
const snakeColor = "black";
const foodColor = "red";
let restart_btn = document.getElementById("restart-btn")
let start_btn = document.getElementById("start-btn")


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // remeber that the context should be the canvas

let snake = [
  { x: 14, y: 10 }, // head
  { x: 13, y: 10 }, // segment 1
  { x: 12, y: 10 }, // segment 2
  { x: 11, y: 10 }, // segment 3
  { x: 10, y: 10 }, // segment 4
];

let food = { x: 15, y: 10 };
let dx = 0;
let dy = 0;
let score = 0;
let text1 = "Game Over"
let text2 = `Score: ${score}`

let gameloop = false;


function handlekeyPress(e) {
  if (gameloop === false) {
    if(!restart_btn.hasAttribute("hidden")){
      restart_btn.setAttribute("hidden", "hidden");
    }
    if(!start_btn.hasAttribute("hidden")){
      start_btn.setAttribute("hidden", "hidden");
    }
    snake = [
      { x: 14, y: 10 }, // head
      { x: 13, y: 10 }, // segment 1
      { x: 12, y: 10 }, // segment 2
      { x: 11, y: 10 }, // segment 3
      { x: 10, y: 10 }, // segment 4
    ];
    food = { x: 15, y: 10 };
    dx = 0;
    dy = 0;
    score = 0;
    gameloop = setInterval(updateGame, 100);
}

  const key = e.key;
  if (key === "ArrowUp" && dy !== 1) {
    dx = 0;
    dy = -1;
  } else if (key === "ArrowDown" && dy !== -1) {
    dx = 0;
    dy = 1;
  } else if (key === "ArrowLeft" && dx !== 1) {
    dx = -1;
    dy = 0;
  } else if (key === "ArrowRight" && dx !== -1) {
    dx = 1;
    dy = 0;
  }
}

function gameOver() {
  clearInterval(gameloop);
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  text2 = `Score: ${score}`
  ctx.fillText(text1, 120, 130);
  ctx.fillText(text2, 135, 170);
  restart_btn.removeAttribute("hidden");
  return;
}

function updateGame() {
  if(!restart_btn.hasAttribute("hidden")){
    restart_btn.setAttribute("hidden", "hidden");
  }
  if(!start_btn.hasAttribute("hidden")){
    start_btn.setAttribute("hidden", "hidden");
  }
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Wrap around the canvas
  if (head.x < 0) {
    head.x = canvasSize / gridSize - 1;
  } else if (head.x >= canvasSize / gridSize) {
    head.x = 0;
  } else if (head.y < 0) {
    head.y = canvasSize / gridSize - 1;
  } else if (head.y >= canvasSize / gridSize) {
    head.y = 0;
  }

  // check if the snake touches its own body
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameOver();
      return;
    }
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 1;
    generateFood();
  } else {
    snake.pop();
  }

  ctx.clearRect(0, 0, canvasSize, canvasSize);
  drawSnake();
  drawFood();
}

function drawSnake() {
  snake.forEach((segment, index) => {
    if (index === 0) {
      ctx.fillStyle = "purple";
    } else {
      ctx.fillStyle = snakeColor;
    }
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * (canvasSize / gridSize)),
    y: Math.floor(Math.random() * (canvasSize / gridSize)),
  };
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

generateFood();

document.addEventListener("keydown", handlekeyPress);
start_btn.addEventListener('click', start);
restart_btn.addEventListener('click', restart);

function start(){
  if(!start_btn.hasAttribute("hidden")){
    start_btn.setAttribute("hidden", "hidden");
  }
  snake = [
    { x: 14, y: 10 }, // head
    { x: 13, y: 10 }, // segment 1
    { x: 12, y: 10 }, // segment 2
    { x: 11, y: 10 }, // segment 3
    { x: 10, y: 10 }, // segment 4
  ];
  food = { x: 15, y: 10 };
  dx = 0;
  dy = -1;
  score = 0;
  gameloop = setInterval(updateGame, 100);
  return;

}

function restart(){
  text2 = `Score: ${score}`
  ctx.clearRect(120, 100, ctx.measureText(text1).width, 30);
  ctx.clearRect(135, 140, ctx.measureText(text2).width, 30);
  snake = [
    { x: 14, y: 10 }, // head
    { x: 13, y: 10 }, // segment 1
    { x: 12, y: 10 }, // segment 2
    { x: 11, y: 10 }, // segment 3
    { x: 10, y: 10 }, // segment 4
  ];
  food = { x: 15, y: 10 };
  dx = 0;
  dy = -1;
  score = 0;
  gameloop = setInterval(updateGame, 100);
  return;
}
