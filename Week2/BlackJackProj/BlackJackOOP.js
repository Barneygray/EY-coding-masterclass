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

class Player {
    constructor() {
        this.name;
        this.moneyLeft = 1000;
        this.bet;
        this.stillActive = true;
        this.hand;
        this.bet;
    }

    askName() {
        this.name = globalThis.prompt("Player Name: ")
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
    dealerHand;
    bet;
    userHandSplit1;
    userHandSplit2;
    split;
    highestScore;
    whosTurn;
    constructor() {
        this.balance = new Bank();
        this.split = false;
        this.numPlayers;
        this.players = [];
    }

    playerSetup() {
        this.numPlayers = globalThis.prompt("How Many Players? (1-4): ");
        if (!isNaN(Number(this.numPlayers)) && this.numPlayers >= 1 && this.numPlayers <= 4) {
            for (let i = 0; i < this.numPlayers; i++) {
                let p = new Player()
                p.askName()
                this.players.push(p)
            }
        } else {
            this.playerSetup()
        }
    }

    gameSetup() {
        this.deck = new Deck();
        this.deck.shuffle();
        this.highestScore = 0;
        this.whosTurn = 0;
    }

    betting(player) {
        player.left();
        let response = globalThis.prompt("Input bet: ");
        if (!isNaN(Number(response)) && response > 0 && response <= player.moneyLeft) {
            player.bet = parseInt(response)
        } else {
            console.log("Bet must be a number between 0 and " + String(player.moneyLeft))
            this.betting();
        }
    }

    replay() {
        let playAgain = globalThis.prompt("Play Again? (y/n): ");
        if (playAgain && playAgain.toLowerCase() === 'y') {
            this.play();
        } else {
            this.endGame()
        }
    }

    endGame() {
        console.log("Final Balance: ")
            for (let i = 0; i < this.numPlayers; i++) {
                console.log(this.players[i].name + " £" + this.players[i].moneyLeft)
            }
            return false;
    }

    playerWin(player) {
        console.log(String(player.name) + " beat the dealer!");
        player.win(player.bet);
        if (this.split) {
            return;
        }
    }

    playerLose(player) {
        console.log("The dealer beat " + String(player.name) + "!");
        player.lose(player.bet)
        if (this.split) {
            return;
        }
        if (player.moneyLeft === 0) {
            console.log("Out of Money - Game Over!")
            player.stillActive = false;
        } else {
            return;
        }
    }

    draw(player) {
        console.log("Player and Dealer BlackJack - Tie!")
        if (this.split) {
            return;
        }
    }

    playerDeal(player) {
        player.hand = new Hand();
        player.hand.addCard(this.deck.drawCard());
        player.hand.addCard(this.deck.drawCard());
    }

    splitPair(player) {
        this.userHandSplit1 = new Hand();
        this.userHandSplit2 = new Hand();

        this.userHandSplit1.addCard(player.hand.cards[0]);
        this.userHandSplit2.addCard(player.hand.cards[1]);

        console.log("Playing Hand One: ")
        player.hand = this.userHandSplit1
        console.log(this.userHand)
        this.playerTurn(player)

        this.split = false;

        console.log("Playing Hand 2: ")
        player.hand = this.userHandSplit2
        this.playerTurn(player)
    }

    doubleDown(player) {
        let response = globalThis.prompt("Double Down? (y/n): ");
        if (response && response.toLowerCase() === 'y' && player.bet*2 <= player.moneyLeft) {
            player.bet *= 2
        }
    }

    dealerDeal() {
        this.dealerHand = new Hand()
        this.dealerHand.addCard(this.deck.drawCard())
        console.log("Dealer Shows: " + this.dealerHand.toString())
        this.dealerHand.addCard(this.deck.drawCard())
    }

    checkBlackJack(player) {
        if (player.hand.getPlayerTotal() === 21 && this.dealerHand.addCard(this.deck.drawCard()) !== 21 && player.hand.length === this.dealerHand.length === 2) {
            console.log("BlackJack!");
            this.playerWin(player);
        } else if (player.hand.getPlayerTotal () === 21 && this.dealerHand.addCard(this.deck.drawCard()) === 21 && player.hand.length === this.dealerHand.length === 2) {
            this.draw(player)
        }
    }

    userChoice(player) {
        console.log("You have: " + player.hand.toString());
        console.log("Value: " + player.hand.getPlayerTotal());

        this.split = false;
        if (this.isSplittableHand(player)) {
            let response = globalThis.prompt("Split Pair? (y/n):")
            if (response && response.toLowerCase() === 'y') {
                this.split = true;
                this.splitPair(player);
            }
        }

        if ([9, 10, 11].includes(player.hand.getPlayerTotal())) {
            this.doubleDown(player);
        }

        this.playerTurn(player)
    }

    isSplittableHand(player) {
        return player.hand.cards[0].rank === player.hand.cards[1].rank
    }

    playerTurn(player) {
        while (!player.hand.isBust()) {
            let response = globalThis.prompt("Hit or stand? (h/s): ");
            if (response && response.toLowerCase() === 'h' && !player.hand.isBust()) {
                player.hand.addCard(this.deck.drawCard())
                console.log("You have: " + player.hand.toString())
                console.log("Value: " + player.hand.getPlayerTotal())
            } else {
                break;
            }
        }

        this.calcBestHand(player)
        
        this.whosTurn++;

        if (player.hand.isBust()) {
            console.log("Bust!");
        }
    }

    calcBestHand(player) {
        if (player.hand.getPlayerTotal() > this.highestScore && player.hand.getPlayerTotal() <= 21) {
            this.highestScore = player.hand.getPlayerTotal()
        }

    }

    dealerTurn() {
        console.log("Dealer flips: " + this.dealerHand.toString());
        console.log("Dealer's score: " + this.dealerHand.getDealerTotal());

        while (this.dealerHand.getDealerTotal() < 17 && this.dealerHand.getDealerTotal() < this.highestScore) {
            this.dealerHand.addCard(this.deck.drawCard());
            console.log("Dealer has: " + this.dealerHand.toString());
            console.log("Dealer's score: " + this.dealerHand.getDealerTotal());
        }
    }

    whoWins(player) {
        if (this.dealerHand.getDealerTotal() > 21 || player.hand.getPlayerTotal() > this.dealerHand.getDealerTotal() && !player.hand.isBust()) {
            this.playerWin(player);
        } else {
            this.playerLose(player);
        }
    }

    play() {
        this.gameSetup()
        for (let i in this.players) {
            let player = this.players[i];
            if (player.stillActive) {
                console.log(String(player.name) + "'s turn:")
                this.betting(player)
                this.playerDeal(player)
            }
        }
        this.dealerDeal()

        for (let i in this.players) {
            let player = this.players[i];
            if (player.stillActive) {
                console.log(String(player.name) + "'s turn:")
                this.userChoice(player)
            }
        }

        this.dealerTurn()
        for (let i in this.players) {
            let player = this.players[i]
            if (player.stillActive) {
                this.whoWins(player);
            }
        }


        
        this.replay()
    }
}

const game = new Game();
game.playerSetup();
game.play()