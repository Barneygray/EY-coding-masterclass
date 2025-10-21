const number = document.querySelectorAll(".number-button")

const clearButton = document.querySelector(".C-button");
const arrowButton = document.querySelector(".arrow-button");
const plusButton = document.querySelector(".plus-button");
const minusButton = document.querySelector(".minus-button");
const divButton = document.querySelector(".div-button");
const xButton = document.querySelector(".x-button");
const equalsButton = document.querySelector(".equals-button");

const calc = document.querySelector(".calc-screen")
const display = document.querySelector(".result-screen");

function autoResizeText() {
  const container = document.getElementById('screen');
  const text = document.getElementById('result-text');
  let fontSize = 40; // starting font size

  text.style.fontSize = fontSize + 'px';

  while (text.scrollWidth > container.offsetWidth && fontSize > 10) {
    fontSize--;
    text.style.fontSize = fontSize + 'px';
  }
}

function autoResizeText2() {
  const container = document.getElementById('screen');
  const text = document.getElementById('calc-text');
  let fontSize = 25; // starting font size

  text.style.fontSize = fontSize + 'px';

  while (text.scrollWidth > container.offsetWidth && fontSize > 10) {
    fontSize--;
    text.style.fontSize = fontSize + 'px';
  }
}

let calculation = [];
let numStore = [];
let numShow = [];
let operations = [];

number.forEach(button => {
    button.addEventListener("click", function() {
        numShow.push(button.innerText);
        calculation.push(button.innerText);
        display.innerText = numShow.join("");
        calc.innerText = calculation.join("");
        autoResizeText();
        autoResizeText2();
    });
});


clearButton.addEventListener("click", function() {
    numStore = [];
    operations = [];
    numShow = [];
    calculation = [];
    display.innerText = "0";
    calc.innerText = "null"
    autoResizeText();
    autoResizeText2();
});

arrowButton.addEventListener("click", function() {
    numShow.pop();
    calculation.pop();
    display.innerText = numShow.join("");
    calc.innerText = calculation.join("");
    calc.innerText = calculation.length > 0 ? calculation.join("") : "0";
    display.innerText = numShow.length > 0 ? numShow.join("") : "0";
    autoResizeText();
    autoResizeText2();
});

plusButton.addEventListener("click", function() {
    numStore.push(Number(numShow.join("")));
    numShow = [];
    operations.push("+")
    calculation.push("+")
    calc.innerText = calculation.join("");
    autoResizeText2();
});

minusButton.addEventListener("click", function() {
    numStore.push(Number(numShow.join("")));
    numShow = [];
    operations.push("-");
    calculation.push("-");
    calc.innerText = calculation.join("");
    autoResizeText2();
});

divButton.addEventListener("click", function() {
    numStore.push(Number(numShow.join("")));
    numShow = [];
    operations.push("/");
    calculation.push("÷");
    calc.innerText = calculation.join("");
    autoResizeText2();
});

xButton.addEventListener("click", function() {
    numStore.push(Number(numShow.join("")));
    numShow = [];
    operations.push("*");
    calculation.push("x");
    calc.innerText = calculation.join("");
    autoResizeText2();
});

equalsButton.addEventListener("click", function() {
    numStore.push(Number(numShow.join("")))
    console.log(numStore);
    let result = 0;
    for (let i = 0; i < operations.length; i++) {
        if (operations[i] === "+") {
            numStore[0] = numStore[0] + numStore[1];
            numStore.splice(1,1);
        } else if (operations[i] === "-") {
            numStore[0] = numStore[0] - numStore[1];
            numStore.splice(1,1);
        } else if (operations[i] === "/") {
            numStore[0] = numStore[0] / numStore[1];
            numStore.splice(1,1);
        } else if (operations[i] === "*") {
            numStore[0] = numStore[0] * numStore[1];
            numStore.splice(1,1);
        }
    }
    result = numStore[0];
    numShow = [result.toString()];
    numStore = [];
    operations = [];
    display.innerText = result;
    autoResizeText();
})


