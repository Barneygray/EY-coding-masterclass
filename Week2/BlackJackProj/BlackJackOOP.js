//TODO Create Game class

class Card {
    value;
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
        this.value = this.calculateValue();
    }

    toString() {
        return `${this.rank} of ${this.suit}`;
    }

    getvalue() {
        return this.value;
    }

    calculateValue() {
        const values = {
            'A' : 11,
            '2' : 2,
            '3' : 3,
            '4' : 4,
            '5' : 5,
            '6' : 6,
            '7' : 7,
            '8' : 8,
            '9' : 9,
            '10' : 10,
            'J' : 10,
            'Q' : 10,
            'K' : 10
        }
        return values[this.rank]
    }
}

class Deck {
    constructor() {
        this.cards = [];
        this.initializeDeck();
    }

    initializeDeck() {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        //TODO:reduce array methods
        suits.forEach(suit => {
            ranks.forEach(rank => {
                this.cards.push(new Card(suit, rank))
            })
        })
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

}


class Hand {
    constructor() {
        this.cards = [];
    }

    addCard(card) {
        this.cards.push(card)
    }

    getPlayerTotal() {
        let t = 0;
        let a = 0;

        for (let card of this.cards) {
            t += card.getvalue();
            if (card.rank === 'A') {
                a++;
            }
        };

        while (t > 21 && a > 0) {
            t -= 10;
            a--;
        }
        return t;
    }

    getDealerTotal() {
        let t = 0;
        let a = 0;

        for (let card of this.cards) {
            t += card.getvalue();
            if (card.rank === 'A') {
                a++;
            }
        };

        while (t > 17 && a > 0) {
            t -= 10;
            a--;
        }
        return t;
    }


    isBust() {
        return(this.getPlayerTotal() > 21)
    }

    toString() {
        let str = ""
        for (let card of this.cards) {
            str += card.toString() + ", ";
        }
        return str
    }

}

class Bank {
    constructor() {
        this.moneyLeft = 1000;
    }

    win(bet) {
        this.moneyLeft += bet;
    }

    lose(bet) {
        this.moneyLeft -= bet;
    }

    left() {
        console.log("Balance: £" + String(this.moneyLeft));
    }
}

class Game {
    deck;
    userHand;
    dealerHand;
    bet;
    userHandSplit1;
    userHandSplit2;
    split;
    constructor() {
        this.playerScore = 0;
        this.dealerScore = 0;
        this.balance = new Bank();
        this.bet;
        this.split = false;
    }

    gameSetup() {
        console.log("Player Score: " + String(this.playerScore) + " Dealer Score: " + String(this.dealerScore));
        this.deck = new Deck();
        this.deck.shuffle();
    }

    betting() {
        this.balance.left();
        let response = globalThis.prompt("Input bet: ");
        if (!isNaN(Number(response)) && response > 0 && response <= this.balance.moneyLeft) {
            this.bet = parseInt(response)
        } else {
            console.log("Bet must be a number between 0 and " + String(this.balance.moneyLeft))
            this.betting();
        }
    }

    replay() {
        let playAgain = globalThis.prompt("Play Again? (y/n): ");
        if (playAgain && playAgain.toLowerCase() === 'y') {
            this.play();
        } else {
            console.log("Player Score: " + String(this.playerScore) + " Dealer Score: " + String(this.dealerScore));
            console.log("Final " + this.balance.left())
            return false;
        }
    }

    playerWin() {
        console.log("You Win!");
        this.playerScore++;
        this.balance.win(this.bet);
        if (this.split) {
            return;
        }
        if (this.replay()) {
            this.play();
        } else {
            return;
        }
    }

    playerLose() {
        console.log("Dealer Wins!");
        this.dealerScore++;
        this.balance.lose(this.bet)
        if (this.split) {
            return;
        }
        if (this.replay()) {
            this.play();
        } else {
            return;
        }
    }

    playerDeal() {
        this.userHand = new Hand();
        this.userHand.addCard(this.deck.drawCard());
        this.userHand.addCard(this.deck.drawCard());
        
        console.log("You have: " + this.userHand.toString());
        console.log("Value: " + this.userHand.getPlayerTotal());
    
        // this.dealerDeal()
    }

    splitPair() {
        this.userHand2 = new Hand(this.userHand.removeOne())

        this.userHandSplit1 = new Hand();
        this.userHandSplit2 = new Hand();

        this.userHandSplit1.addCard(this.userHand.cards[0]);
        this.userHandSplit2.addCard(this.userHand.cards[1]);

        console.log("Playing Hand One: ")
        this.userHand = this.userHandSplit1
        console.log(this.userHand)
        this.playerTurn()

        this.split = false;

        console.log("Playing Hand 2: ")
        this.userHand = this.userHandSplit2
        this.playerTurn()
    }

    doubleDown() {
        let response = globalThis.prompt("Double Down? (y/n): ");
        if (response && response.toLowerCase() === 'y' && this.bet*2 <= this.balance.moneyLeft) {
            this.bet *= 2
        }
    }

    dealerDeal() {
        this.dealerHand = new Hand()
        this.dealerHand.addCard(this.deck.drawCard())
        console.log("Dealer Shows: " + this.dealerHand.toString())
        this.dealerHand.addCard(this.deck.drawCard())

        
    }

    userChoice() {
        this.split = false;
        if (this.isSplittableHand) {
            let response = globalThis.prompt("Split Pair? (y/n):")
            if (response && response.toLowerCase() === 'y') {
                this.split = true;
                this.splitPair();
            }
        }

        if ([9, 10, 11].includes(this.userHand.getPlayerTotal())) {
            this.doubleDown();
        }

        this.playerTurn()
    }

    isSplittableHand() {
        return this.userHand.cards[0].rank === this.userHand.cards[1].rank
    }

    playerTurn() {
        while (!this.userHand.isBust()) {
            let response = globalThis.prompt("Hit or stand? (h/s): ");
            if (response && response.toLowerCase() === 'h' && !this.userHand.isBust()) {
                this.userHand.addCard(this.deck.drawCard())
                console.log("You have: " + this.userHand.toString())
                console.log("Value: " + this.userHand.getPlayerTotal())
            } else {
                break;
            }
        }
        if (this.userHand.isBust()) {
            console.log("Bust!");
            this.playerLose();
        } else {
            this.dealerTurn()
        }
    }

    dealerTurn() {
        console.log("Dealer flips: " + this.dealerHand.toString());
        console.log("Dealer's score: " + this.dealerHand.getDealerTotal());

        while (this.dealerHand.getDealerTotal() < 17 && this.dealerHand.getDealerTotal() < this.userHand.getPlayerTotal()) {
            this.dealerHand.addCard(this.deck.drawCard());
            console.log("Dealer has: " + this.dealerHand.toString());
            console.log("Dealer's score: " + this.dealerHand.getDealerTotal());
        }

        this.whoWins()
        
    }

    whoWins() {
        if (this.dealerHand.getDealerTotal() > 21 || this.userHand.getPlayerTotal() > this.dealerHand.getDealerTotal() && !this.userHand.isBust()) {
            this.playerWin();
        } else if (!this.userHand.isBust()){
            this.playerLose();
        }
    }

    play() {
        this.gameSetup()
        this.betting()

        this.playerDeal()
        this.dealerDeal()
        this.userChoice()

        //this.playerTurn()
        //this.dealerTurn()

        //this.whoWins()
    }
}

const game = new Game()
game.play()