class GameOfLife {
  constructor(
    canvasId = "gameCanvas",
    cellSize = 10,
    width = 1000,
    height = 1000
  ) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    this.cellSize = cellSize;
    this.width = width;
    this.height = height;
    this.canvas.width = this.width * this.cellSize;
    this.canvas.height = this.height * this.cellSize;
    this.grid = this.createGrid();

    this.isRunning = false;

    /** @remark field redraws only when cells changed */
    this.changedCells = new Set();

    this.drawGrid();

    // Mouse click event to toggle cells
    this.canvas.addEventListener("click", (event) => this.toggleCell(event));
  }

  // create initial field
  /** @private */
  createGrid() {
    return Array(this.height)
      .fill(null)
      .map(() => Array(this.width).fill(0));
  }

  /**
   * Clears the canvas and draws the grid with cell borders and filled cells.
   */
  /** @private */
  drawGrid() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const drawParams = [
          col * this.cellSize,
          row * this.cellSize,
          this.cellSize,
          this.cellSize,
        ];
    
        this.ctx.strokeStyle = "#ccc";
        this.ctx.strokeRect(...drawParams);

        if (this.grid[row][col]) {
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(...drawParams);
        }

      }
    }
  }

  /**
   * Draws changed cells on the canvas.
   *
   * Clears the canvas where the changed cell is, draws a border around the cell,
   * and fills the cell with black color if it is alive.
   *
   * @remark After drawing the changed cells, the changedCells set is cleared.
   * @private
   */
  drawChangedCells() {
    this.changedCells.forEach((cell) => {
      const [row, col] = cell.split(",").map(Number);
      const drawProps = [
        col * this.cellSize,
        row * this.cellSize,
        this.cellSize,
        this.cellSize,
      ];

      this.ctx.clearRect(...drawProps);
      this.ctx.strokeStyle = "#ccc";
      this.ctx.strokeRect(...drawProps);

      if (this.grid[row][col]) {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(...drawProps);
      }
    });
    this.changedCells.clear();
  }

  /** @private */
  nextGeneration() {
    const nextGrid = this.createGrid();

    for (let row = 0; row < this.height; row += 1) {
      for (let col = 0; col < this.width; col += 1) {
        const aliveNeighbors = this.countAliveNeighbors(row, col);
        const cell = this.grid[row][col];

        if (cell === 1 && (aliveNeighbors < 2 || aliveNeighbors > 3)) {
          nextGrid[row][col] = 0; // cell dies
          this.changedCells.add(`${row},${col}`); // add changed cell
        } else if (cell === 0 && aliveNeighbors === 3) {
          nextGrid[row][col] = 1; // cell borns
          this.changedCells.add(`${row},${col}`); // add changed cell
        } else {
          nextGrid[row][col] = cell; // keep cell in same state
        }
      }
    }

    this.grid = nextGrid;
  }

  /** @private */
  countAliveNeighbors(row, col) {
    let count = 0;
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;

      if (
        newRow >= 0 &&
        newRow < this.height &&
        newCol >= 0 &&
        newCol < this.width
      ) {
        count += this.grid[newRow][newCol];
      }
    }

    return count;
  }

  /**
   * Starts the game loop.
   *
   * If the game is not running, sets isRunning to true and starts the game loop.
   * The game loop calls nextGeneration() and drawChangedCells() on each iteration.
   * The loop is delayed using requestAnimationFrame() to utilize the GPU instead of CPU.
   * @public
   */
  start() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    const step = () => {
      if (!this.isRunning) {
        return;
      }
      this.nextGeneration();
      this.drawChangedCells();
      // use GPU instead CPU
      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  /** @public */
  stop() {
    this.isRunning = false;
  }

  /** @public */
  clear() {
    this.grid = this.createGrid();
    this.changedCells.clear();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Calc clicked cell
  /** @private */
  toggleCell(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const row = Math.floor(y / this.cellSize);
    const col = Math.floor(x / this.cellSize);

    this.grid[row][col] = this.grid[row][col] ? 0 : 1;
    // key of changed cell
    this.changedCells.add(`${row},${col}`);
    this.drawChangedCells();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const game = new GameOfLife();

  // game control buttons handlers
  document
    .getElementById("startButton")
    .addEventListener("click", () => game.start());
  document
    .getElementById("stopButton")
    .addEventListener("click", () => game.stop());
  document
    .getElementById("clearButton")
    .addEventListener("click", () => game.clear());
});
