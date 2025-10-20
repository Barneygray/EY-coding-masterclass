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

function calculateScore(hand) {
    let score = 0;
    for (let i = 0; i < hand.length; i++) {
        if (hand[i][0] === 'A') {
            score += 11;
        } else if (['K', 'Q', 'J'].includes(hand[i][0])) {
            score += 10;
        } else {
            score += parseInt(hand[i][0]);
        }
    }
    return score;
};


function play() {
    deck = shuffleDeck(deck);

    let userHand = [deck.pop(), deck.pop()];
    console.log("You have: " + userHand);
    let userScore = CalculateScore(userHand);
    console.log("Your Score Is: " + userScore);

    let dealerHand = [deck.pop(), deck.pop()];
    console.log("Dealer shows: " + dealerHand[0]);
    let dealerScore = CalculateScore(dealerHand);

    while (userScore < 21) {
        globalThis.prompt("Hit or stand? (h/s): ");
        if (Response.toLowerCase() === 'h') {
            userHand.push(deck.pop());
            console.log("You have: " + userHand);
            userScore = CalculateScore(userHand);
            console.log("Your Score Is: " + userScore);

            if (userScore > 21) {
                console.log("Bust! Dealer wins.");
                return;
            } 
        } else {
            break;
        };
    };
    
    while (dealerScore < 17) {
            dealerHand.Hand(deck.pop());
            console.log("Dealer has: " + dealerHand);
            dealerScore = CalculateScore(dealerHand);
            console.log("Dealer's Score: " + dealerScore);
    }

    if (dealerScore > 21 || userScore > dealerScore) {
        console.log("You win!");
    } else {
        console.log("Dealer wins!");
    }
    
}

play();