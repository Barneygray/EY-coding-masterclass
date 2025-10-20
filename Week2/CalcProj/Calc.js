const number = document.querySelector(".grey-buttons")

const clearButton = document.querySelector(".C-button");
const arrowButton = document.querySelector(".arrow-button");
const plusButton = document.querySelector(".plus-button");
const minusButton = document.querySelector(".minus-button");
const divButton = document.querySelector(".div-button");
const xButton = document.querySelector(".x-button");
const equalsButton = document.querySelector(".equals-button");

const display = document.querySelector(".input-screen")

let numStore = [];
let numShow = [];
let operations = [];

display.innerText = numShow.join("");

number.addEventListener("click", function() {
    numStore.push(parseInt(number.innerText));
    numShow.push(number.innerText);
});

clearButton.addEventListener("click", function() {
    numStore = [];
    numShow = [];
});

arrowButton.addEventListener("click", function() {
    numStore.pop();
    numShow.pop();
});

plusButton.addEventListener("click", function() {
    numShow = [];
    operations.push("+")
});

minusButton.addEventListener("click", function() {
    numShow = [];
    operations.push("-")
});

divButton.addEventListener("click", function() {
    numShow = [];
    operations.push("/")
});

xButton.addEventListener("click", function() {
    numShow = [];
    operations.push("*")
});

equalsButton.addEventListener("click", function() {
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
            numStore[0] = numStore[0] - numStore[1];
            numStore.splice(1,1);
        }
    }
    result = numStore[0];
    numShow = [result];
})