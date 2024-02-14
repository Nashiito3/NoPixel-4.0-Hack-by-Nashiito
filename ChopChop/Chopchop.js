const characters = ['Q', 'W', 'E', 'A', 'S', 'D'];

function getRandomCharacter(previousCharacter) {
  let randomCharacter = characters[Math.floor(Math.random() * characters.length)];
  
  if (previousCharacter && previousCharacter === randomCharacter && Math.random() < 0.5) {
    return getRandomCharacter(previousCharacter);
  }
  
  return randomCharacter;
}

function generateRowWithSquares(numSquares, parentElement, isCentered = false) {
  const row = document.createElement('div');
  row.classList.add('row');
  if (isCentered) {
    row.classList.add('centered-row');
  }
  for (let i = 0; i < numSquares; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.textContent = '?';
    row.appendChild(square);
  }
  parentElement.appendChild(row);
}

function generateGameBoard(generateRandomCharacters = false) {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';

  for (let i = 0; i < 2; i++) {
    generateRowWithSquares(6, gameBoard);
  }
  generateRowWithSquares(3, gameBoard, true);

  if (generateRandomCharacters) {
    const squares = gameBoard.querySelectorAll('.square');
    let previousCharacter = null;
    squares.forEach(square => {
      const randomCharacter = getRandomCharacter(previousCharacter);
      square.textContent = randomCharacter;
      previousCharacter = randomCharacter;
    });
  }
}

function checkInput(event) {
    const pressedKey = event.key.toUpperCase();
    const squares = document.querySelectorAll('.square');
    const currentSquareIndex = [...squares].findIndex(square => !square.classList.contains('correct') && !square.classList.contains('incorrect'));
  
    if (currentSquareIndex === -1) return; // No more squares to check
  
    const currentSquare = squares[currentSquareIndex];
    const currentSquareCharacter = currentSquare.textContent.toUpperCase();
  
    if (pressedKey === currentSquareCharacter) {
      currentSquare.classList.add('correct');
      const nextSquare = squares[currentSquareIndex + 1];
      if (!nextSquare) {
        endGame(true);
        return;
      }
    } else {
      currentSquare.classList.add('incorrect');
      endGame(false);
      return;
    }
  }
  

function endGame(isWin, isTimeout = false) {
  const squares = document.querySelectorAll('.square');
  const messageEl = document.getElementById('message');

  squares.forEach(square => {
    if (!square.classList.contains('correct')) {
      square.classList.add('incorrect');
    }
  });

  messageEl.textContent = isWin ? 'Success!' : (isTimeout ? 'Failed!' : 'Failed!');
  clearInterval(timer);
  document.removeEventListener('keydown', checkInput);
  document.getElementById('start-button').disabled = false;
}

let timer;

function startGame() {
  generateGameBoard(true);
  document.addEventListener('keydown', checkInput);
  document.getElementById('start-button').disabled = true;

  const messageEl = document.getElementById('message');
  let timeLeft = 5;
  messageEl.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    messageEl.textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timer);
      endGame(false, true);
    }
  }, 1000);
}

function initializeGame() {
  generateGameBoard();
  const startButton = document.getElementById('start-button');
  startButton.addEventListener('click', startGame);
  document.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !startButton.disabled) {
      startGame();
    }
  });
}

window.onload = initializeGame;
