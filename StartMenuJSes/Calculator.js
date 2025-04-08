// Calculator.js
let currentNumber = '0';
let firstOperand = null;
let operator = null;

function openCalculator() {
    const calcContent = `
        <div class="calculator">
            <div class="display">0</div>
            <div class="buttons">
                <button class="btn btn-sm func" onclick="clearDisplay()">CE</button>
                <button class="btn btn-sm func" onclick="clearAll()">C</button>
                <button class="btn btn-sm func" onclick="backspace()">←</button>
                <button class="btn btn-sm operator" onclick="setOperator('/')">÷</button>
                
                <button class="btn btn-sm" onclick="appendNumber('7')">7</button>
                <button class="btn btn-sm" onclick="appendNumber('8')">8</button>
                <button class="btn btn-sm" onclick="appendNumber('9')">9</button>
                <button class="btn btn-sm operator" onclick="setOperator('*')">×</button>
                
                <button class="btn btn-sm" onclick="appendNumber('4')">4</button>
                <button class="btn btn-sm" onclick="appendNumber('5')">5</button>
                <button class="btn btn-sm" onclick="appendNumber('6')">6</button>
                <button class="btn btn-sm operator" onclick="setOperator('-')">-</button>
                
                <button class="btn btn-sm" onclick="appendNumber('1')">1</button>
                <button class="btn btn-sm" onclick="appendNumber('2')">2</button>
                <button class="btn btn-sm" onclick="appendNumber('3')">3</button>
                <button class="btn btn-sm operator" onclick="setOperator('+')">+</button>
                
                <button class="btn btn-sm" onclick="toggleSign()">±</button>
                <button class="btn btn-sm" onclick="appendNumber('0')">0</button>
                <button class="btn btn-sm" onclick="appendDecimal()">.</button>
                <button class="btn btn-sm operator" onclick="calculate()">=</button>
            </div>
        </div>
    `;

    createWindow('calculator', 'Calculator', calcContent);
    updateDisplay();
}

function appendNumber(num) {
    if (currentNumber === '0') {
        currentNumber = num;
    } else {
        currentNumber += num;
    }
    updateDisplay();
}

function appendDecimal() {
    if (!currentNumber.includes('.')) {
        currentNumber += '.';
    }
    updateDisplay();
}

function clearDisplay() {
    currentNumber = '0';
    updateDisplay();
}

function clearAll() {
    currentNumber = '0';
    firstOperand = null;
    operator = null;
    updateDisplay();
}

function backspace() {
    currentNumber = currentNumber.slice(0, -1);
    if (currentNumber === '') currentNumber = '0';
    updateDisplay();
}

function toggleSign() {
    currentNumber = (parseFloat(currentNumber) * -1).toString();
    updateDisplay();
}

function setOperator(op) {
    operator = op;
    firstOperand = parseFloat(currentNumber);
    currentNumber = '0';
}

function calculate() {
    if (operator === null || firstOperand === null) return;
    
    const secondOperand = parseFloat(currentNumber);
    let result;
    
    switch (operator) {
        case '+':
            result = firstOperand + secondOperand;
            break;
        case '-':
            result = firstOperand - secondOperand;
            break;
        case '*':
            result = firstOperand * secondOperand;
            break;
        case '/':
            result = secondOperand === 0 ? 'Error' : firstOperand / secondOperand;
            break;
    }
    
    currentNumber = result.toString();
    operator = null;
    firstOperand = null;
    updateDisplay();
}

function updateDisplay() {
    const display = document.querySelector('.calculator .display');
    if (display) {
        display.textContent = currentNumber.length > 12 ? 
            parseFloat(currentNumber).toExponential(6) : 
            currentNumber;
    }
}

// Add Calculator styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .calculator {
            background: #c0c0c0;
            padding: 10px;
            border: 3px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
        }
        .display {
            background: #ffffff;
            border: 2px solid #808080;
            padding: 5px;
            margin-bottom: 10px;
            text-align: right;
            font-family: 'Arial', sans-serif;
            font-size: 24px;
            min-height: 36px;
        }
        .buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2px;
        }
        .btn {
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            background: #c0c0c0;
            min-width: 50px;
            padding: 5px;
            font-family: 'Arial', sans-serif;
        }
        .btn:active {
            border-color: #808080 #ffffff #ffffff #808080;
        }
        .operator {
            background: #ffa500;
        }
        .func {
            background: #d3d3d3;
        }
    `;
    document.head.appendChild(style);
});