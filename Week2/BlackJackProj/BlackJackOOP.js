class Card {
    constructor(suit, rank, value) {
        this.suit = suit;
        this.rank = rank;
        this.value = value;
    }

    toString() {
        return `${this.rank} of ${this.suit}`;
    }

    getvalue() {
        return this.value;
    }
}

class Deck {
    constructor() {
        this.cards = [];
        this.initializeDeck();
    }

    initializeDeck() {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const ranks = [
            { rank: 'A', value: 11 },
            { rank: '2', value: 2 },
            { rank: '3', value: 3 },
            { rank: '4', value: 4 },
            { rank: '5', value: 5 },
            { rank: '6', value: 6 },
            { rank: '7', value: 7 },
            { rank: '8', value: 8 },
            { rank: '9', value: 9 },
            { rank: '10', value: 10 },
            { rank: 'J', value: 10 },
            { rank: 'Q', value: 10 },
            { rank: 'K', value: 10 }
        ];

        for (let suit of suits) {
            for (let {rank, value} of ranks) {
                this.cards.push(new Card(suit, rank, value));
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    drawCard() {
        return this.cards.pop()
    }

    resetDeck() {
        this.cards = [];
        this.initializeDeck();
    }
}

class Hand {
    constructor() {
        this.cards = [];
    }

    addCard(card) {
        this.cards.push(card)
    }

    getTotal() {
        let t = 0;
        for (let card of this.cards) {
            t += card.getvalue
        };
        return t;
    }

    isBust() {
        if (this.getTotal > 21) {
            return true;
        } else {
            return false;
        }
    }

    reset() {
        this.cards = [];
    }

    toString() {
        for (let card of this.cards) {
            str += card.toString + " ";
        }
    }

}

function play() {
    const deck = new Deck()
    deck.shuffle

    let userHand = new Hand()
    userHand.addCard()
    userHand.addCard()

    console.log("You have: " + userHand.toString)
    console.log("Value: " + userHand.getTotal)

    let dealerHand = new Hand()
    dealerHand.addCard
    console.log("Dealer Shows: " + dealerHand.toString)
    dealerHand.addCard

    while (!userHand.isBust) {
        let response = globalThis.prompt("Hit or stand? (h/s): ");
            if (response && response.toLowerCase() === 'h' && !userHand.isBust) {
                userHand.addCard
                console.log("You have: " + userHand.toString)
                console.log("Value: " + userHand.getTotal)
            } else {
                break;
            }
        }

    console.log("Dealer flips: " + dealerHand.toString);
    console.log("Dealer's score: " + dealerHand.getTotal);

    while (dealerHand.getTotal < 17) {
        dealerHand.addCard;
        console.log("Dealer has: " + dealerHand.toString);
        console.log("Dealer's score: " + dealerHand.getTotal);
    }

    if (dealerHand.getTotal > 21 || userHand.getTotal > dealerHand.getTotal) {
        console.log("You win!");
    } else {
        console.log("Dealer wins!");
    }
}