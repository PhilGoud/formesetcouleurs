// DOM Elements
const instructionEl = document.getElementById('instruction');
const scoreEl = document.getElementById('score');
const currentShapeEl = document.getElementById('current-shape');
const restartBtn = document.getElementById('restart');
const goBtn = document.getElementById('go');
const gameContainer = document.getElementById('game-container');
const timerEl = document.getElementById('timer');
const controls = document.getElementById('controls');
const highScoreEl = document.getElementById('high-score');

// Constants
const shapes = ['circle', 'square', 'triangle'];
const colors = ['red', 'yellow', 'blue'];
let score = 0;
let target, startTime, timerInterval, scoreInterval;
let touchStartX = 0, touchEndX = 0;

// High score management
let highScore = localStorage.getItem('highScore1') || 0; // Retrieve high score or initialize to 0
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
  timerEl.textContent = `Temps: 30s`; // "Time" displayed in French
  clearInterval(timerInterval);
  clearInterval(scoreInterval);
  currentShapeEl.style.display = 'none';
  controls.style.display = 'none'; // Hide controls
  goBtn.style.display = 'block';
  restartBtn.disabled = true;
}

// Start Game
function startGame() {
  generateShape();
  generateInstruction();
  startTime = Date.now();
  restartBtn.disabled = false;
  goBtn.style.display = 'none';
  controls.style.display = 'flex'; // Show controls
  currentShapeEl.style.display = 'block';

  // Start timers
  timerInterval = setInterval(updateTimer, 1000);
  scoreInterval = setInterval(decreaseScore, 1000);
}

// Generate random instruction
function generateInstruction() {
  const isColor = Math.random() > 0.5;
  target = isColor
    ? colors[Math.floor(Math.random() * colors.length)]
    : shapes[Math.floor(Math.random() * shapes.length)];
  instructionEl.textContent = `Instruction: ${instructionsTranslations[target]}`; // Instruction remains in English but translated for the user
}

// Generate random shape with color
function generateShape() {
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  currentShapeEl.className = `shape ${randomShape}`;
  currentShapeEl.style.backgroundColor = randomShape === 'triangle' ? 'transparent' : randomColor;
  currentShapeEl.style.borderBottomColor = randomShape === 'triangle' ? randomColor : '';
  currentShapeEl.dataset.shape = randomShape;
  currentShapeEl.dataset.color = randomColor;
}

// Decrease score every second
function decreaseScore() {
  if (score > 0) {
    score -= 1;
    scoreEl.textContent = `Score: ${score}`;
  }
}

// Handle swipe or keyboard
function handleAction(direction) {
  const { shape, color } = currentShapeEl.dataset;
  const isCorrect = 
    (target === shape && direction === 'correct') ||
    (target === color && direction === 'correct') ||
    (target !== shape && target !== color && direction === 'wrong');

  gameContainer.className = isCorrect ? 'correct' : 'wrong';

  setTimeout(() => gameContainer.className = '', 200);

  if (isCorrect) {
    score += 2;
    scoreEl.textContent = `Score: ${score}`;
    generateShape();
  } 
}

// Update Game Timer
function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const remainingTime = 30 - elapsed;
  timerEl.textContent = `Temps: ${remainingTime}s`; // "Time" displayed in French

  if (remainingTime <= 0) {
    endGame();
  }
}

// End Game
function endGame() {
  clearInterval(timerInterval);
  clearInterval(scoreInterval);
  currentShapeEl.style.display = 'none';
  controls.style.display = 'none'; // Hide controls
  goBtn.style.display = 'block';
  restartBtn.disabled = true;

  // Save the current score to localStorage and update the high score if needed
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore1', highScore);
  }

  // Display the updated high score
  highScoreEl.textContent = `High Score: ${highScore}`;

  // Display final score
  alert(`Jeu terminé! Votre score est ${score}`);
}

// Event Listeners
goBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', initGame);

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') handleAction('correct');
  if (e.key === 'ArrowLeft') handleAction('wrong');
});

document.addEventListener('touchstart', (e) => (touchStartX = e.changedTouches[0].clientX));
document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].clientX;
  if (touchStartX - touchEndX > 50) handleAction('wrong'); // Swipe left
  if (touchEndX - touchStartX > 50) handleAction('correct'); // Swipe right
});

// Add click event listeners for control buttons
document.getElementById('wrong').addEventListener('click', () => handleAction('wrong'));
document.getElementById('correct').addEventListener('click', () => handleAction('correct'));

// Initialize Instruction Display
initGame();
