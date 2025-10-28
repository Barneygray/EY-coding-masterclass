const grid = document.querySelector('.grid-layout')
const guessRows = grid.querySelectorAll('.first-guess, .second-guess, .third-guess, .fourth-guess, .fifth-guess, .sixth-guess');



const wordOfDayUrl = "https://words.dev-apis.com/word-of-the-day?random=1"

const checkWordUrl = "https://words.dev-apis.com/validate-word"

async function retrieveWord() {
    const promise = await fetch(wordOfDayUrl);
    const processedResponse = await promise.json()
    
    return processedResponse.word.toUpperCase()
}

async function checkRealWord(userWord) {
    try {
    const response = await fetch(checkWordUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "word" : userWord })
    });

    const result = await response.json();
    console.log('POST result:', result)
    return result.validWord;
 } catch (error)  {
        console.error('Error posting data:', error)
        return null
    }
}


function checkWord(userWord) {
let attemptColours = [];
let splitWord = word.split('')
let usedIndices = []

for (let i = 0; i < splitWord.length; i++) {
    if (userWord[i] === splitWord[i]) {
        attemptColours.push('darkgreen')
        usedIndices.push(i)
    } else {
        attemptColours.push(null)
    }
}

for (let i =0; i < splitWord.length; i++) {
    if (attemptColours[i] === null) {
        const letter = userWord[i];
        let foundIndex = splitWord.findIndex((char, idx) => char === letter && !usedIndices.includes(idx));
        if (foundIndex !== -1) {
            attemptColours[i] = 'goldenrod';
            usedIndices.push(foundIndex);
        } else {
            attemptColours[i] = '#888';
        }
    }
}

return attemptColours
}

function changeColours(rowIndex, colourArray) {
    for (let i = 1; i < 6; i++) {
        const letterBox = document.getElementById('l' + String(i + rowIndex*5));
        letterBox.style.color = "white";
        setTimeout(() => {
            letterBox.style.color = "white";
            letterBox.style.backgroundColor = colourArray[i-1];
    }, i*500);}
}

function moveUpDown(item) {
    item.style.transition = 'top 0.3s ease-in-out';
    item.style.top = `-10px`;
    setTimeout(() => {
        item.style.top = '0px';
    }, 300);
}

function rowShake(rowIndex) {
    guessRows[rowIndex].classList.add('shake');
    guessRows[rowIndex].addEventListener('animationend', () => {
        Element.classList.remove('shake');
    }, {once:true})
}

function correctGuess(rowIndex) {
    for (let i = 1; i < 6; i++) {
        const letterBox = document.getElementById('l' + String(i + rowIndex*5));
        moveUpDown(letterBox);
    }
}

async function initGame() {
    word = await retrieveWord()

    let indexCount = 1;
    let currentRow = 0;
    let userWord = []

    const maxRows = 6
    const lettersPerRow = 5

    document.addEventListener('keydown', async (event) => {
    const key = event.key;
        if (/^[a-zA-Z]$/.test(key) && indexCount < lettersPerRow+1) {
            console.log('l' + String(indexCount + currentRow*5))
            const letterBox = document.getElementById('l' + String(indexCount + currentRow*5))
            letterBox.textContent = key.toUpperCase();
            userWord.push(key.toUpperCase())
            indexCount++;
        }


        if (key === 'Backspace' && indexCount > 1) {
            indexCount--;
            const letterBox = document.getElementById('l' + String(indexCount + currentRow*5))
            letterBox.textContent = '';
            userWord.pop()
        }

        if (key === 'Enter' && indexCount === lettersPerRow+1) {
            let joinedWord = userWord.join('')
            validWord = await checkRealWord(joinedWord)
            console.log(validWord)
            if (validWord) {
                const rowColours = checkWord(userWord);
                changeColours(currentRow, rowColours)
                if (userWord.join('') === word) {
                    setTimeout(() => {
                        correctGuess(currentRow);
                    }, 2500);
                    return;
                }
                userWord = []
                indexCount = 1;
                currentRow++
            } else {
                rowShake(currentRow)
            }
        }
    })
}

initGame()

