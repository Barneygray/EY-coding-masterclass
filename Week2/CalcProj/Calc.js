const number = document.querySelectorAll(".number-button")

const clearButton = document.querySelector(".C-button");
const arrowButton = document.querySelector(".arrow-button");
const plusButton = document.querySelector(".plus-button");
const minusButton = document.querySelector(".minus-button");
const divButton = document.querySelector(".div-button");
const xButton = document.querySelector(".x-button");
const equalsButton = document.querySelector(".equals-button");

const display = document.querySelector(".input-screen");

let numStore = [];
let numShow = [];
let operations = [];

number.forEach(button => {
    button.addEventListener("click", function() {
        console.log(button.innerText);
        numShow.push(button.innerText);
        display.innerText = numShow.join("");
        console.log(numStore)
    });
});


clearButton.addEventListener("click", function() {
    numStore = [];
    operations = [];
    numShow = [];
    display.innerText = "0";
});

arrowButton.addEventListener("click", function() {
    numShow.pop();
    display.innerText = numShow.join("");
    display.innerText = numShow.length > 0 ? numShow.join("") : "0";
});

plusButton.addEventListener("click", function() {
    numStore.push(Number(numShow.join("")));
    numShow = [];
    operations.push("+")
    console.log(numStore);
});

minusButton.addEventListener("click", function() {
    numStore.push(Number(numShow.join("")));
    console.log(numStore[-1]);
    numShow = [];
    operations.push("-")
});

divButton.addEventListener("click", function() {
    numStore.push(Number(numShow.join("")));
    numShow = [];
    operations.push("/")
});

xButton.addEventListener("click", function() {
    numStore.push(Number(numShow.join("")));
    numShow = [];
    operations.push("*");
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
    console.log(result);
})