const CEll_SIZE = 20;

const canvas = document.querySelector('canvas');
let numberOfCellsX = Math.floor(canvas.width / CEll_SIZE);
let numberOfCellsY = Math.floor(canvas.height / CEll_SIZE);

const ctx = canvas.getContext('2d');
ctx.fillStyle = "rgb(100, 100, 100)";
ctx.strokeStyle = "rgb(255, 255, 255)";

const lineWidth = 0.5;
ctx.lineWidth = lineWidth;

let board = null;

const isAlive = (x, y) => board?.[x]?.[y] ?? false;

const drawBoard = () => {
    for (let x = 0; x < numberOfCellsX; x += 1) {
        for (let y = 0; y < numberOfCellsY; y += 1) {
            if (!isAlive(x, y)) {
                continue;
            }
            ctx.fillRect(
                x * CEll_SIZE,
                y * CEll_SIZE,
                CEll_SIZE,
                CEll_SIZE,
            )
        }
    }
}

const renderCells = () => { 
    
    for (let x = 0; x < numberOfCellsX; x += 1) {
        ctx.beginPath();
        ctx.moveTo(x * CEll_SIZE - lineWidth, 0);
        ctx.lineTo(x * CEll_SIZE - lineWidth, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y < numberOfCellsY; y += 1) {
        ctx.beginPath();
        ctx.moveTo(0, y * CEll_SIZE - lineWidth);
        ctx.lineTo(canvas.width, y * CEll_SIZE - lineWidth);
        ctx.stroke();
    }

    drawBoard();
}

const renderBoard = () => {
    const board = [];

    for (let x = 0; x < numberOfCellsX; x += 1) {
        const row = [];
        for (let y = 0; y < numberOfCellsY; y += 1) {
            row.push(false);
        }
        board.push(row);
    }

    board[10][10] = true;

    return board;
}

const getNeighborsCount = (x, y) => {
    const moves = [-1, 0, 1];
    let neighborsCount = 0;
    
    for (const moveX of moves) {
        for (const moveY of moves) {
            if (!(moveX === 0 && moveY === 0)) {
                neighborsCount += Number(isAlive(x + moveX, y + moveY));
            }
        }
    }
    return neighborsCount;
}

const setCanvas = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;
    numberOfCellsX = Math.floor(width / CEll_SIZE);
    numberOfCellsY = Math.floor(height / CEll_SIZE);

    board = renderBoard();
    renderCells();
}

window.addEventListener('resize', setCanvas);
document.addEventListener('DOMContentLoaded', setCanvas);

