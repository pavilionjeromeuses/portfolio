const MATRIX_SIZE = 7;
const NUM_SEQUENCES = 3;
const BUFFER_SIZES = [4, 5, 6];
const HEX_CODES = ['1C', 'E9', 'BD', '55', 'FF', '7A', 'D5', 'E2'];
const BASE_TIME_LIMIT = 90;

let gameState = {
    matrix: [],
    sequences: [],
    buffer: [],
    bufferSize: BUFFER_SIZES[0],
    currentSelection: null,
    timer: BASE_TIME_LIMIT,
    gameStatus: 'inProgress',
    completedSequences: 0,
    timerInterval: null
};

function generateRandomMatrix(size) {
    const matrix = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push(HEX_CODES[Math.floor(Math.random() * HEX_CODES.length)]);
        }
        matrix.push(row);
    }
    return matrix;
}

function generateRandomSequences(numSequences, matrix, bufferSize) {
    const sequences = [];
    for (let i = 0; i < numSequences; i++) {
        const sequenceLength = Math.floor(Math.random() * (bufferSize - 1)) + 2;
        const sequence = [];
        for (let j = 0; j < sequenceLength; j++) {
            if (Math.random() < 0.9) {
                const row = Math.floor(Math.random() * matrix.length);
                const col = Math.floor(Math.random() * matrix[0].length);
                sequence.push(matrix[row][col]);
            } else {
                sequence.push(HEX_CODES[Math.floor(Math.random() * HEX_CODES.length)]);
            }
        }
        sequences.push(sequence);
    }
    return sequences;
}

function initializeGame() {
    gameState.bufferSize = BUFFER_SIZES[Math.floor(Math.random() * BUFFER_SIZES.length)];
    gameState.matrix = generateRandomMatrix(MATRIX_SIZE);
    gameState.sequences = generateRandomSequences(NUM_SEQUENCES, gameState.matrix, gameState.bufferSize);
    gameState.buffer = [];
    gameState.currentSelection = null;
    gameState.timer = BASE_TIME_LIMIT;
    gameState.gameStatus = 'inProgress';
    gameState.completedSequences = 0;

    renderMatrix();
    renderSequences();
    updateUI();
}

function renderMatrix() {
    const matrixContainer = document.getElementById('matrix');
    matrixContainer.style.gridTemplateColumns = `repeat(${MATRIX_SIZE}, minmax(0, 1fr))`;
    matrixContainer.innerHTML = '';

    gameState.matrix.forEach((row, rowIndex) => {
        row.forEach((code, colIndex) => {
            const cell = document.createElement('button');
            cell.className = getCellClass(rowIndex, colIndex);
            cell.textContent = code;
            cell.addEventListener('click', () => handleCellClick(rowIndex, colIndex));
            matrixContainer.appendChild(cell);
        });
    });
}

function getCellClass(row, col) {
    let classes = ['cell'];

    if (gameState.currentSelection?.row === row && gameState.currentSelection?.col === col) {
        classes.push('current-selected');
    } else if (gameState.currentSelection?.isRow && gameState.currentSelection.row === row) {
        classes.push('selected-row');
    } else if (!gameState.currentSelection?.isRow && gameState.currentSelection?.col === col) {
        classes.push('selected-col');
    }

    return classes.join(' ');
}

function handleCellClick(row, col) {
    if (gameState.gameStatus !== 'inProgress') return;

    const selectedCode = gameState.matrix[row][col];

    if (gameState.currentSelection) {
        if (gameState.currentSelection.isRow && gameState.currentSelection.row !== row) return;
        if (!gameState.currentSelection.isRow && gameState.currentSelection.col !== col) return;
    }

    const newBuffer = [...gameState.buffer, selectedCode];
    if (newBuffer.length > gameState.bufferSize) {
        gameState.gameStatus = 'lost';
        updateUI();
        return;
    }

    gameState.buffer = newBuffer;
    gameState.currentSelection = { row, col, isRow: !gameState.currentSelection?.isRow };

    checkSequences();
    checkWinCondition();
    updateUI();
}

function checkSequences() {
    let sequenceCompleted = false;
    const bufferString = gameState.buffer.join('');

    gameState.sequences = gameState.sequences.map(sequence => {
        if (sequence.length === 0) return sequence;
        const sequenceString = sequence.join('');

        if (bufferString.endsWith(sequenceString)) {
            sequenceCompleted = true;
            return [];
        }
        return sequence;
    });

    if (sequenceCompleted) {
        gameState.completedSequences++;
    }
}

function checkWinCondition() {
    if (gameState.sequences.every(seq => seq.length === 0)) {
        gameState.gameStatus = 'won';
    }
}

function updateUI() {
    // Update buffer display
    const bufferItems = document.getElementById('bufferItems');
    bufferItems.innerHTML = gameState.buffer
        .map(code => `<div class="buffer-item">${code}</div>`)
        .join('');

    // Update timer
    document.getElementById('timer').textContent = gameState.timer;

    // Update buffer size
    document.getElementById('bufferSize').textContent = gameState.bufferSize;

    // Update completed sequences
    document.getElementById('completedSequences').textContent = gameState.completedSequences;

    // Update status message
    const statusElement = document.getElementById('status');
    statusElement.className = 'status';
    if (gameState.gameStatus === 'won') {
        statusElement.textContent = 'ACCESS GRANTED';
        statusElement.classList.add('won');
    } else if (gameState.gameStatus === 'lost') {
        statusElement.textContent = 'ACCESS DENIED';
        statusElement.classList.add('lost');
    } else {
        statusElement.textContent = '';
    }

    // Update matrix styling
    renderMatrix();
    renderSequences();
}

function renderSequences() {
    const sequencesList = document.getElementById('sequencesList');
    sequencesList.innerHTML = gameState.sequences
        .filter(seq => seq.length > 0)
        .map(sequence => `
            <div class="sequence">
                ${sequence.map(code => `
                    <div class="sequence-item">${code}</div>
                `).join('')}
            </div>
        `).join('');
}

// Start the game
initializeGame();

// Start the timer interval
const startTimer = () => {
    gameState.timerInterval = setInterval(() => {
        if (gameState.gameStatus !== 'inProgress') {
            clearInterval(gameState.timerInterval);
            return;
        }

        gameState.timer--;
        if (gameState.timer <= 0) {
            gameState.gameStatus = 'lost';
            clearInterval(gameState.timerInterval);
        }
        updateUI();
    }, 1000);
}

startTimer();

// Stop Timer Button
document.getElementById('stopButton').addEventListener('click', () => {
    clearInterval(gameState.timerInterval);
    document.getElementById('stopButton').style.display = 'none';
    document.getElementById('resumeButton').style.display = 'inline-block';
});

// Resume Timer Button
document.getElementById('resumeButton').addEventListener('click', () => {
    startTimer();
    document.getElementById('resumeButton').style.display = 'none';
    document.getElementById('stopButton').style.display = 'inline-block';
});

// Reset Button functionality
document.getElementById('resetButton').addEventListener('click', () => {
    location.reload(); // This will reload the entire page, effectively resetting the game.
});
