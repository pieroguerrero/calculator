
//ordered according their operation precendece
const ORDERED_OPERATORS_LIST = ["^", "/", "*", "+", "-"];

function getResult(num1, op, num2) {
    let result;

    switch (op) {
        case "^":
            result = num1 ** num2;
            break;
        case "/":
            result = num1 / num2;
            break;
        case "*":
            result = num1 * num2;
            break;
        case "+":
            result = num1 + num2;
            break;
        case "-":
            result = num1 - num2;
            break;
        default:
            result = "ERROR";
            break;
    }

    return result;
}

function calculateOperation(arrFormula = [], operator = "") {

    let hasOperations = true;

    while (hasOperations) {
        const operatiorIndex = arrFormula.indexOf(operator);

        if (operatiorIndex >= 0) {
            const firstOperand = Number(arrFormula[operatiorIndex - 1]);
            const secondOperand = Number(arrFormula[operatiorIndex + 1]);

            const result = getResult(firstOperand, operator, secondOperand);

            //removing the previous calculation just finished
            arrFormula.splice(operatiorIndex - 1, 3);

            //Adding the last result found
            arrFormula.splice(operatiorIndex - 1, 0, result);
        } else hasOperations = false;
    }

    return arrFormula;
}

//split the initial formula in operands and operators and store them in an array
function getArrayFormula(userInput) {
    let m;
    const arrFormula = [];
    const rex = /(^|[(^\/*+-])(-(?:\d*\.)?\d+)|[()^\/*+-]|(?:\d*\.)?\d+/g;

    while (m = rex.exec(userInput)) {
        if (m[1]) {
            arrFormula.push(m[1], m[2]);
        } else {
            arrFormula.push(m[0]);
        }
    }

    return arrFormula;
}

function evaluateFormula(arrFormula = []) {

    for (const operator of ORDERED_OPERATORS_LIST) {

        if ((arrFormula.length % 2 !== 0) && (arrFormula.length > 3)) {
            arrFormula = calculateOperation(arrFormula, operator);
            console.table(arrFormula);
        }

    }

    return Number(arrFormula[0]);
}

function calculate(e) {

    const userInput = "" + e.target.value;

    if (userInput.length > 0) {

        let arrFormula = getArrayFormula(userInput);

        if ((arrFormula.length % 2 !== 0) && (arrFormula.length > 3)) {

            const result = evaluateFormula(arrFormula);

            const paraResult = document.querySelector(".result");
            paraResult.textContent = "" + result;
        }
    }

}

function start() {
    const btnInputPanel = document.querySelector(".input-panel");
    btnInputPanel.addEventListener("input", calculate);
}

start();