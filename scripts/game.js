// 游戏常量
const BOARD_SIZE = 20;
const INITIAL_SNAKE_LENGTH = 3;
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

// 游戏状态
let board = [];
let snake = [];
let direction = null;
let food = { x: 0, y: 0 };
let score = 0;
let isPlaying = false;
let isPaused = false;
let intervalId = null;
let speed = 150; // 初始速度

// DOM元素
const gameBoard = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const status = document.getElementById("status");

// 初始化游戏
function initGame() {
  board = createBoard();
  snake = initSnake();
  direction = DIRECTIONS.RIGHT;
  spawnFood();
  score = 0;
  speed = 150; // 重置速度
  scoreDisplay.textContent = score;
  renderBoard();
  status.classList.remove('visible');
  startBtn.textContent = '重新开始';
  pauseBtn.textContent = '暂停';
  isPaused = false;
}

// 创建游戏板
function createBoard() {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(null)
  );
}

// 初始化蛇
function initSnake() {
  const center = Math.floor(BOARD_SIZE / 2);
  return Array.from({ length: INITIAL_SNAKE_LENGTH }, (_, i) => ({
    x: center - i,
    y: center,
  }));
}

// 生成食物
function spawnFood() {
  let x, y;
  do {
    x = Math.floor(Math.random() * BOARD_SIZE);
    y = Math.floor(Math.random() * BOARD_SIZE);
  } while (board[y][x] === "snake" || isNearSnake(x, y));
  food = { x, y };
}

// 检查食物是否生成在蛇附近
function isNearSnake(x, y) {
  return snake.some(segment => Math.abs(segment.x - x) <= 1 && Math.abs(segment.y - y) <= 1);
}

// 渲染游戏板
function renderBoard() {
  gameBoard.innerHTML = '';
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (board[y][x] === "snake") cell.classList.add("snake");
      if (x === food.x && y === food.y) cell.classList.add("food");
      gameBoard.appendChild(cell);
    }
  }
}

// 移动逻辑
function moveSnake() {
  if (isPaused) return;

  const head = { ...snake[0] };
  head.x += direction.x;
  head.y += direction.y;

  if (
    head.x < 0 || head.x >= BOARD_SIZE ||
    head.y < 0 || head.y >= BOARD_SIZE ||
    board[head.y][head.x] === "snake"
  ) return gameOver();

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreDisplay.textContent = score;
    spawnFood();
    increaseSpeed();
  } else {
    snake.pop();
  }

  // 更新游戏板
  board = createBoard();
  snake.forEach(segment => board[segment.y][segment.x] = "snake");
  board[food.y][food.x] = "food";
  renderBoard();
}

// 增加游戏速度
function increaseSpeed() {
  if (speed > 50) {
    speed -= 5;
    clearInterval(intervalId);
    intervalId = setInterval(moveSnake, speed);
  }
}

// 游戏结束
// 修改 gameOver 函数
function gameOver() {
    isPlaying = false;
    isPaused = false; // 确保暂停状态重置
    clearInterval(intervalId);
    status.textContent = `得分: ${score} | 点击重新开始`;
    status.classList.add('visible');
    pauseBtn.disabled = true; // 禁用暂停按钮
  }
  
  // 修改 togglePause 函数
  function togglePause() {
    if (!isPlaying) return; // 游戏未进行时不能暂停
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '继续' : '暂停';
    
    // 新增暂停状态显示
    if (isPaused) {
      status.textContent = "暂停中";
      status.classList.add('visible', 'paused');
    } else {
      status.classList.remove('visible', 'paused');
    }
  }
  
  // 修改 startGame 函数
  function startGame() {
    if (isPlaying) return;
    isPlaying = true;
    isPaused = false; // 重置暂停状态
    initGame();
    intervalId = setInterval(moveSnake, speed);
    pauseBtn.disabled = false; // 启用暂停按钮
    pauseBtn.textContent = '暂停'; // 重置按钮文本
  }

// 键盘控制
// 修改键盘控制逻辑
function handleKeyDown(e) {
    if (!isPlaying) {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
        startGame();
      }
      return;
    }
  
    switch(e.key) {
      case 'ArrowUp': 
        if (direction !== DIRECTIONS.DOWN) direction = DIRECTIONS.UP;
        break;
      case 'ArrowDown':
        if (direction !== DIRECTIONS.UP) direction = DIRECTIONS.DOWN;
        break;
      case 'ArrowLeft':
        if (direction !== DIRECTIONS.RIGHT) direction = DIRECTIONS.LEFT;
        break;
      case 'ArrowRight':
        if (direction !== DIRECTIONS.LEFT) direction = DIRECTIONS.RIGHT;
        break;
      case ' ': // 空格键暂停
      case 'Escape': // Esc键暂停
        togglePause();
        break;
    }
  }

// 开始游戏
function startGame() {
  if (isPlaying) return;
  isPlaying = true;
  initGame();
  intervalId = setInterval(moveSnake, speed);
}

// 事件监听
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
window.addEventListener('keydown', handleKeyDown);