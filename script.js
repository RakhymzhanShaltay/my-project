document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.querySelector(".grid-container");
  const gridSize = 4;
  let grid = [];
  let score = 0;

  const scoreElement = document.getElementById("score");
  const bestScoreElement = document.getElementById("best-score");
  const restartButton = document.getElementById("restart-button");

  let bestScore = localStorage.getItem("bestScore") || 0;
  bestScoreElement.textContent = bestScore;

  function updateScore(newScore) {
    score += newScore;
    scoreElement.textContent = score;

    if (score > bestScore) {
      bestScore = score;
      bestScoreElement.textContent = bestScore;
      localStorage.setItem("bestScore", bestScore);
    }
  }

  function resetGame() {
    grid = Array(gridSize * gridSize).fill(0);
    score = 0;
    scoreElement.textContent = score;
    gridContainer.innerHTML = "";
    createGrid();
  }

  restartButton.addEventListener("click", resetGame);

  function createGrid() {
    for (let i = 0; i < gridSize * gridSize; i++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      gridContainer.appendChild(tile);
      grid.push(0);
    }
    generateTile();
    generateTile();
    updateGrid();
  }

  function generateTile() {
    const emptyTiles = grid
      .map((value, index) => (value === 0 ? index : null))
      .filter((index) => index !== null);
    if (emptyTiles.length > 0) {
      const randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      grid[randomIndex] = Math.random() > 0.9 ? 4 : 2;
    }
  }

  function updateGrid() {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach((tile, index) => {
      const value = grid[index];
      tile.textContent = value === 0 ? "" : value;
      tile.setAttribute("data-value", value);
    });
  }

  function move(direction) {
    const newGrid = Array(gridSize * gridSize).fill(0);

    for (let i = 0; i < gridSize; i++) {
      let row = [];

      for (let j = 0; j < gridSize; j++) {
        const index =
          direction === "left" || direction === "right"
            ? i * gridSize + j
            : j * gridSize + i;

        row.push(grid[index]);
      }

      if (direction === "right" || direction === "down") row.reverse();

      for (let k = 0; k < row.length - 1; k++) {
        if (row[k] !== 0 && row[k] === row[k + 1]) {
          row[k] *= 2;
          row[k + 1] = 0;
          updateScore(row[k]);
        }
      }

      row = row.filter((value) => value !== 0);
      while (row.length < gridSize) row.push(0);
      if (direction === "right" || direction === "down") row.reverse();

      row.forEach((value, j) => {
        const index =
          direction === "left" || direction === "right"
            ? i * gridSize + j
            : j * gridSize + i;

        newGrid[index] = value;
      });
    }

    grid = newGrid;
    generateTile();
    updateGrid();
  }

  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        move("up");
        break;
      case "ArrowDown":
        move("down");
        break;
      case "ArrowLeft":
        move("left");
        break;
      case "ArrowRight":
        move("right");
        break;
    }
  });

  createGrid();
});


