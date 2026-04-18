const words = ["APPLE", "GRAPE", "BRICK", "PLANT", "SWEET", "CRANE", "BOOST", "CRUST"];

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

let game;

function initGame() {
  game = {
    targetWord: words[Math.floor(Math.random() * words.length)],
    currentRow: 0,
    currentCol: 0,
    guesses: Array(6).fill("").map(() => []),
    feedback: Array(6).fill(null),
    state: "playing"
  };

  createBoard();
  render();
}

function createBoard() {
  boardEl.innerHTML = "";

  for (let r = 0; r < 6; r++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let c = 0; c < 5; c++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      row.appendChild(tile);
    }

    boardEl.appendChild(row);
  }
}

document.addEventListener("keydown", (e) => {
  if (game.state !== "playing") return;

  const key = e.key;

  if (/^[a-zA-Z]$/.test(key)) {
    addLetter(key.toUpperCase());
  } else if (key === "Backspace") {
    removeLetter();
  } else if (key === "Enter") {
    submitGuess();
  }

  render();
});

function addLetter(letter) {
  if (game.currentCol >= 5) return;

  game.guesses[game.currentRow].push(letter);
  game.currentCol++;
}

function removeLetter() {
  if (game.currentCol === 0) return;

  game.guesses[game.currentRow].pop();
  game.currentCol--;
}

function submitGuess() {
  if (game.currentCol < 5) {
    statusEl.textContent = "Not enough letters";
    return;
  }

  const guess = game.guesses[game.currentRow].join("");
  const feedback = evaluateGuess(guess, game.targetWord);
  game.feedback[game.currentRow] = feedback;

  if (guess === game.targetWord) {
    game.state = "win";
    statusEl.textContent = "You win!";
    return;
  }

  if (game.currentRow === 5) {
    game.state = "lose";
    statusEl.textContent = `You lose! Word was ${game.targetWord}`;
    return;
  }

  game.currentRow++;
  game.currentCol = 0;
  statusEl.textContent = "";
}

function evaluateGuess(guess, target) {
  const result = Array(5).fill("absent");
  const targetArr = target.split("");

  // First pass: correct letters
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) {
      result[i] = "correct";
      targetArr[i] = null;
    }
  }

  // Second pass: present letters
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;

    const index = targetArr.indexOf(guess[i]);
    if (index !== -1) {
      result[i] = "present";
      targetArr[index] = null;
    }
  }

  return result;
}

function render() {
  const rows = document.querySelectorAll(".row");

  rows.forEach((rowEl, r) => {
    const tiles = rowEl.children;

    for (let c = 0; c < 5; c++) {
      const tile = tiles[c];
      const letter = game.guesses[r][c] || "";

      tile.textContent = letter;

      tile.classList.remove("correct", "present", "absent", "bounce", "current");

      if (letter && r === game.currentRow && c === game.currentCol - 1) {
        tile.classList.add("bounce");
      }

	  if (game.state === "playing" && r === game.currentRow && c === game.currentCol) {
		tile.classList.add("current");
	  }

      if (game.feedback[r]) {
        tile.classList.add(game.feedback[r][c]);
      }
    }
  });
}

restartBtn.addEventListener("click", () => {
  initGame();
  restartBtn.blur();
});

initGame();