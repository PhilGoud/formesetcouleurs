// DOM Elements
const instructionEl = document.getElementById('instruction');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restart');
const goBtn = document.getElementById('go');
const gameContainer = document.getElementById('game-container');
const timerEl = document.getElementById('timer');
const shapes = document.querySelectorAll('.shape');
const controls = document.getElementById('controls');
const highScoreEl = document.getElementById('high-score');

// Constants
const shapeTypes = ['circle', 'square', 'triangle'];
const colors = ['red', 'yellow', 'blue'];
let score = 0;
let target, startTime, timerInterval;
let highScore = parseInt(localStorage.getItem('highScore3')) || 0;
let touchStartX = 0, touchEndX = 0;



// Update high score
highScoreEl.textContent = `High Score: ${highScore}`;

// Traduction des instructions
const instructionsTranslations = {
  circle: 'Cercle',
  square: 'Carré',
  triangle: 'Triangle',
  red: 'Rouge',
  yellow: 'Jaune',
  blue: 'Bleu'
};

// Initialize Game
function initGame() {
  score = 0;
  scoreEl.textContent = `Score: ${score}`;
  timerEl.textContent = `Temps: 30s`;
  clearInterval(timerInterval);
  goBtn.style.display = 'block';
  shapes.forEach(shape => shape.style.display = 'none'); // Hide shapes
  controls.style.display = 'none';
  restartBtn.disabled = true;
}

// Start Game
function startGame() {
  generateInstruction();
  generateShapes();
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
  goBtn.style.display = 'none';
  restartBtn.disabled = false;
  shapes.forEach(shape => shape.style.display = 'block'); // Show shapes
  controls.style.display = 'flex';
}

// Generate random instruction
function generateInstruction() {
  const isColor = Math.random() > 0.5;
  target = isColor
    ? colors[Math.floor(Math.random() * colors.length)]
    : shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    instructionEl.textContent = `Instruction: ${instructionsTranslations[target]}`; // Instruction remains in English but translated for the user
  }

// Generate random shapes
function generateShapes() {
  shapes.forEach(shape => {
    const randomShape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    shape.className = `shape ${randomShape}`;
    shape.style.backgroundColor = randomShape === 'triangle' ? 'transparent' : randomColor;
    shape.style.borderBottomColor = randomShape === 'triangle' ? randomColor : '';
    shape.dataset.shape = randomShape;
    shape.dataset.color = randomColor;
  });
}

// Handle user action (keyboard, swipe, or button click)
function handleAction(action) {
  const isCorrect = Array.from(shapes).some(shape =>
    (action === 'correct' && (shape.dataset.shape === target || shape.dataset.color === target)) ||
    (action === 'wrong' && shape.dataset.shape !== target && shape.dataset.color !== target)
  );

  gameContainer.className = isCorrect ? 'correct' : 'wrong';
  setTimeout(() => (gameContainer.className = ''), 200);

  if (isCorrect) {
    score += 2;
    scoreEl.textContent = `Score: ${score}`;
    generateShapes();
  }
}

// Update timer
function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const remainingTime = 30 - elapsed;
  timerEl.textContent = `Temps: ${remainingTime}s`;

  if (remainingTime <= 0) endGame();
}

// End Game
function endGame() {
  clearInterval(timerInterval);
  shapes.forEach(shape => shape.style.display = 'none');
  goBtn.style.display = 'block';
  controls.style.display = 'none';

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore3', highScore);
  }

  highScoreEl.textContent = `High Score: ${highScore}`;
  alert(`Jeu terminé! Votre score est ${score}`);
}

// Event Listeners
goBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', initGame);

// Keyboard event listeners
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') handleAction('correct');
  if (e.key === 'ArrowLeft') handleAction('wrong');
});

// Touch event listeners
document.addEventListener('touchstart', (e) => (touchStartX = e.changedTouches[0].clientX));
document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].clientX;
  if (touchStartX - touchEndX > 50) handleAction('wrong'); // Swipe left
  if (touchEndX - touchStartX > 50) handleAction('correct'); // Swipe right
});

// Button event listeners
document.getElementById('wrong').addEventListener('click', () => handleAction('wrong'));
document.getElementById('correct').addEventListener('click', () => handleAction('correct'));

// Initialize Game
initGame();
