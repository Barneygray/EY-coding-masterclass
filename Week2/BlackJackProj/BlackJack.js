const suits = ['H', 'D', 'C', 'S'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let deck = [];

for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < values.length; j++) {
        deck.push(values[j] + suits[i]);
    }
};

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck [i]];
    }
    return deck;
}

function calculatePlayerScore(hand) {
    let score1 = 0;
    let score2 = 0;
    for (let i = 0; i < hand.length; i++) {
        if (hand[i][0] === 'A') {
            score1 += 1;
            score2 += 11;
        } else if (['K', 'Q', 'J'].includes(hand[i][0])) {
            score1 += 10;
            score2 += 10;
        } else {
            score1 += parseInt(hand[i].match(/\d+/g));
            score2 += parseInt(hand[i].match(/\d+/g));
        }
    }
    return [score1, score2];
};

function calculateDealerScore(hand) {
    let score = 0;
    for (let i = 0; i < hand.length; i++) {
        if (hand[i][0] === 'A') {
            score += 11;
        } else if (['T', 'K', 'Q', 'J'].includes(hand[i][0])) {
            score += 10;
        } else {
            score += parseInt(hand[i].match(/\d+/g));
        }
    }
    return score;
};


function play() {
    deck = shuffleDeck(deck);

    let userHand = [deck.pop(), deck.pop()];
    console.log("You have: " + userHand);
    let userScore = calculatePlayerScore(userHand);
    if (userScore[0] === userScore[1] || userScore[1] > 21) {
        console.log("Your Score Is: " + userScore[0]);
    } else {
        console.log("Your Score Is: " + userScore[0] + " or " + userScore[1]);
    };

    let dealerHand = [deck.pop(), deck.pop()];
    console.log("Dealer shows: " + dealerHand[0]);
    let dealerScore = calculateDealerScore(dealerHand);

    while (userScore[0] < 21) {
        let response = globalThis.prompt("Hit or stand? (h/s): ");
        if (response && response.toLowerCase() === 'h') {
            userHand.push(deck.pop());
            console.log("You have: " + userHand);
            userScore = calculatePlayerScore(userHand);
            if (userScore[0] === userScore[1] || userScore[1] > 21) {
                console.log("Your Score Is: " + userScore[0]);
            } else if (userScore[0] > 21) {
                console.log("Your Score Is: " + userScore[0]);
            } else if (userScore[1] === 21) {
                console.log("your Score Is: " + userScore[1]);
            } else{
                console.log("Your Score Is: " + userScore[0] + " or " + userScore[1]);
            };

            if (userScore[0] > 21) {
                console.log("Bust! Dealer wins.");
                return;
            }; 
        } else {
            if (userScore[1] <= 21) {
                userScore = userScore[1];
            } else {
                userScore = userScore[0];
            };
            console.log("Dealer flips: " + dealerHand);
            console.log("Dealer's Score: " + dealerScore)
            break;
        };
    };
    
    while (dealerScore < 17) {
        dealerHand.push(deck.pop());
        console.log("Dealer has: " + dealerHand);
        dealerScore = calculateDealerScore(dealerHand);
        console.log("Dealer's Score: " + dealerScore);
    };

    if (dealerScore > 21 || userScore > dealerScore) {
        console.log("You win!");
    } else {
        console.log("Dealer wins!");
    }
    
};

play();