
//ordered according their operation precendece
const ORDERED_OPERATORS_LIST = [["^", ""], ["/", "*"], ["+", "-"]];
const INPUT_DISPLAY_ELEMENT = document.getElementById("entry");

function processInput(input) {

    if (input !== "()") {

        if ("0123456789".includes(input)) { //IT'S A NUMBER

            if (INPUT_DISPLAY_ELEMENT.value.length === 1 && INPUT_DISPLAY_ELEMENT.value === "0") {

                INPUT_DISPLAY_ELEMENT.value = "";
            }

            INPUT_DISPLAY_ELEMENT.value += input;
            calculate(INPUT_DISPLAY_ELEMENT.value);

        } else {//IT'S AN OPERATOR

            if (INPUT_DISPLAY_ELEMENT.value.length > 0 && !("^/*+-()".includes(INPUT_DISPLAY_ELEMENT.value.charAt(INPUT_DISPLAY_ELEMENT.value.length - 1)))) {

                INPUT_DISPLAY_ELEMENT.value += input;
                calculate(INPUT_DISPLAY_ELEMENT.value);
            }

        }
    }
}

function computeResult(e) {

    const input = (e.target.nodeName.toLowerCase() === "button") ? e.target.value : e.target.parentNode.value;
    processInput(input);
}

function clearScreen() {
    const resultTextBox = document.querySelector(".screen .result");

    INPUT_DISPLAY_ELEMENT.value = "0";
    resultTextBox.value = "";
}

function backSpace() {

    let long = INPUT_DISPLAY_ELEMENT.value.length;

    if (long > 0) {

        INPUT_DISPLAY_ELEMENT.value = INPUT_DISPLAY_ELEMENT.value.slice(0, long - 1);

        long = long - 1;

        if (long === 0) {

            clearScreen();

        } else {

            const lastChar = INPUT_DISPLAY_ELEMENT.value.charAt(long - 1);
            INPUT_DISPLAY_ELEMENT.value = INPUT_DISPLAY_ELEMENT.value.slice(0, long - 1);

            processInput(lastChar);
        }
    }

}

function equalResult() {

    const long = INPUT_DISPLAY_ELEMENT.value.length;
    const lastChar = INPUT_DISPLAY_ELEMENT.value.charAt(long - 1);

    if (!("^/*+-()".includes(lastChar))) {

        const resultTextBox = document.querySelector(".screen .result");
        INPUT_DISPLAY_ELEMENT.value = resultTextBox.value;

    }

}

function turnOn(calcSwitch) {

    const screenTxt = document.getElementById("entry");
    const led = document.getElementById('smLedBord');
    const screenResult = document.querySelector(".screen .result");

    calcSwitch.classList.remove('calc-off');
    calcSwitch.classList.add('calc-on');

    screenTxt.classList.remove('entryOff');
    screenTxt.classList.add('entryOn');

    screenResult.classList.remove('entryOff');
    screenResult.classList.add('entryOn');

    led.classList.remove('ledOff');
    led.classList.add('ledOn');

    const btnNumbersAndOperators = document.querySelectorAll(".number, .operator");
    btnNumbersAndOperators.forEach(key => key.addEventListener("click", computeResult));

    const btnAC = document.querySelector(".clear.key");
    btnAC.addEventListener("click", clearScreen);

    const btnErase = document.querySelector(".controls .erase");
    btnErase.addEventListener("click", backSpace);

    const btnEquals = document.querySelector(".controls .equal");
    btnEquals.addEventListener("click", equalResult);

    screenResult.value = "";

    INPUT_DISPLAY_ELEMENT.value = "0";

}

function turnOff(calcSwitch) {

    const screenTxt = document.getElementById("entry");
    const led = document.getElementById('smLedBord');
    const screenResult = document.querySelector(".screen .result");

    calcSwitch.classList.remove('calc-on');
    calcSwitch.classList.add('calc-off');

    screenTxt.classList.remove('entryOn');
    screenTxt.classList.add('entryOff');

    screenResult.classList.remove('entryOn');
    screenResult.classList.add('entryOff');

    led.classList.remove('ledOn');
    led.classList.add('ledOff');

    const btnNumbersAndOperators = document.querySelectorAll(".number, .operator");
    btnNumbersAndOperators.forEach(key => key.removeEventListener("click", computeResult));

    const btnAC = document.querySelector(".clear.key");
    btnAC.removeEventListener("click", clearScreen);

    const btnErase = document.querySelector(".controls .erase");
    btnErase.removeEventListener("click", backSpace);

    const btnEquals = document.querySelector(".controls .equal");
    btnEquals.removeEventListener("click", equalResult);



    //INPUT_DISPLAY_ELEMENT.value = "";

}

function switchOnOff(e) {

    const swi = e.target;

    if (swi.classList.contains("calc-off")) {

        turnOn(swi);

    } else if (swi.classList.contains("calc-on")) {

        turnOff(swi);
    }
}

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

function processFormula(arrFormula = [], operatorIndex, operator) {

    const firstOperand = Number(arrFormula[operatorIndex - 1]);
    const secondOperand = Number(arrFormula[operatorIndex + 1]);

    const result = getResult(firstOperand, operator, secondOperand);

    //removing the previous calculation just finished
    arrFormula.splice(operatorIndex - 1, 3);

    //Adding the last result found
    arrFormula.splice(operatorIndex - 1, 0, result);

}
function calculateOperation(arrFormula = [], operators = []) {

    let hasOperations = true;

    while (hasOperations) {

        const operatorIndex0 = arrFormula.indexOf(operators[0]);
        const operatorIndex1 = arrFormula.indexOf(operators[1]);

        if (!(operatorIndex0 > 0 || operatorIndex1 > 0)) {

            hasOperations = false;
        } else if (operatorIndex0 > 0 && operatorIndex1 <= 0) {

            processFormula(arrFormula, operatorIndex0, operators[0]);
        } else if (operatorIndex0 <= 0 && operatorIndex1 > 0) {

            processFormula(arrFormula, operatorIndex1, operators[1]);
        } else {

            const index = (operatorIndex0 < operatorIndex1) ? operatorIndex0 : operatorIndex1;
            const operator = (operatorIndex0 < operatorIndex1) ? operators[0] : operators[1];

            processFormula(arrFormula, index, operator);
        }
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

    for (const operators of ORDERED_OPERATORS_LIST) {

        if ((arrFormula.length % 2 !== 0) && (arrFormula.length >= 3)) {
            arrFormula = calculateOperation(arrFormula, operators);
        }

    }

    return Number(arrFormula[0]);
}

function calculate(userInput) {

    //const userInput = "" + e.target.value;    

    if (userInput.length > 0) {

        let arrFormula = getArrayFormula(userInput);

        if ((arrFormula.length % 2 !== 0) && (arrFormula.length >= 3)) {

            const result = evaluateFormula(arrFormula);

            const paraResult = document.querySelector(".result");
            paraResult.value = "" + result;
        }
    }

}

function entryKey(e) {
    INPUT_DISPLAY_ELEMENT.value += e.value;
}

function start() {

    //INPUT_DISPLAY_ELEMENT.addEventListener("input", calculate);

    const swi = document.getElementById("turningOn");
    swi.addEventListener("click", switchOnOff);



}

start();