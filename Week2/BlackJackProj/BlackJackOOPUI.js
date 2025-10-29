const dealerHandDiv = document.querySelector('.dealers-hand')
const playersDiv = document.querySelector('.players-hands')
const hitButton = document.querySelector('.hit-button')
const standButton = document.querySelector('.stand-button')
const doubleDownButton = document.querySelector('.double-down-button')
const splitButton = document.querySelector('.split-button')
const balanceBox = document.querySelector('.balance-box')
const actionPromptBox = document.querySelector('.action-prompt-box')

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

    addCard(card, playerID, hand) {
        this.cards.push(card)

        const newCardDiv = document.createElement('div')
        newCardDiv.classList.add('card')
        newCardDiv.id = card.toString()

        const cardText = document.createElement('p')
        cardText.textContent = card.toString()
        newCardDiv.appendChild(cardText)

        if (playerID !== "dealers-hand") {
            const playerHandDiv = document.getElementById(playerID + "-hand-" + String(hand))
            playerHandDiv.appendChild(newCardDiv)
        } else {
            dealerHandDiv.appendChild(newCardDiv)
        }
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
        const promptText = document.createElement('p')
        promptText.textContent = "Bust! You Lose"

        actionPromptBox.innerHTML = ""
        actionPromptBox.appendChild(promptText)
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

class Player {
    name;
    bet;
    hand;
    constructor() {
        this.moneyLeft = 1000;
        this.isStillActive = true;
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
    userHandSplit1;
    userHandSplit2;
    highestScore;
    whosTurn;
    constructor() {
        this.isSplit = false;
        this.numPlayers;
        this.players = [];
    }

    async start() {
        await this.playerSetup();
        this.play()
    }

    async createPromptTextResponse(prompt) {
        const promptText = document.createElement('p')
        promptText.textContent = prompt

        const inputBox = document.createElement('input')
        inputBox.className = "input-box"
        inputBox.type = "text"

        actionPromptBox.innerHTML = ""
        actionPromptBox.appendChild(promptText)
        actionPromptBox.appendChild(inputBox)

        return new Promise((resolve) => {
            inputBox.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    const input = e.target.value
                    resolve(input)
                }
            })
        })
    } 

    async createPromptButtonResponse(prompt, input1, input2) {
        const promptText = document.createElement('p')
        promptText.textContent = prompt

        const button1 = document.createElement('button')
        button1.className = "first-button"
        button1.textContent = input1

        const button2 = document.createElement('button')
        button2.className = "second-button"
        button2.textContent = input2

        actionPromptBox.innerHTML = ""
        actionPromptBox.appendChild(promptText)
        actionPromptBox.appendChild(button1)
        actionPromptBox.appendChild(button2)

        return new Promise((resolve) => {
            button1.addEventListener("click", () => {
                resolve(input1)
            })
            button2.addEventListener("click", () => {
                resolve(input2)
            })
        })

    }

    displayText(prompt) {
        const promptText = document.createElement('p')
        promptText.textContent = prompt

        actionPromptBox.innerHTML = ""
        actionPromptBox.appendChild(promptText)
    }

    async playerSetup() {
        const numPlayers = await this.createPromptTextResponse("How many players? (1-4):")
        this.numPlayers = parseInt(numPlayers)

        if (!isNaN(Number(this.numPlayers)) && this.numPlayers >= 1 && this.numPlayers <= 4) {
            for (let i = 0; i < this.numPlayers; i++) {
                let p = new Player()
                const playerName = await this.createPromptTextResponse("Player " + String(i+1) + " name:")
                p.name = playerName
                this.players.push(p)
                const newPlayerDiv = document.createElement('div')
                newPlayerDiv.classList.add('player')
                newPlayerDiv.id = p.name
                playersDiv.appendChild(newPlayerDiv)

                const playerBalance = document.createElement('p')
                playerBalance.textContent = p.name + ': £' + p.moneyLeft
                playerBalance.id = String(p.name + 'balance')
                balanceBox.appendChild(playerBalance)

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
        dealerHandDiv.innerHTML = "";
    }

    async betting(player) {
        player.left();
        const response = await this.createPromptTextResponse(player.name + ", input bet:")
    
        if (!isNaN(Number(response)) && response > 0 && response <= player.moneyLeft) {
            player.bet = parseInt(response)
        } else {
            this.promptText("Bet must be a number between 0 and " + String(player.moneyLeft))
            await this.betting(player);
        }
    }

    async replay() {
        let playAgain = await this.createPromptButtonResponse("Play Again?", "Yes", "No")
        
        if (playAgain === "Yes") {
            await this.play();
        } else {
            this.endGame()
        }
    }

    endGame() {
        console.log("Final Balance: ")
        this.players.forEach(player => {
            console.log(player.name + " £" + player.moneyLeft);
        });
        return false;
    }

    updateScoreBoard(player) {
        let id = String(player.name) + 'balance'
        const playerBalanceP = document.getElementById(id)
        playerBalanceP.textContent = String(player.name) + ': £' + String(player.moneyLeft)
    }

    playerWin(player) {
        console.log(String(player.name) + " beat the dealer!");
        player.win(player.bet);
        this.updateScoreBoard(player)

        if (this.isSplit) {
            return;
        }
    }

    playerLose(player) {
        console.log("The dealer beat " + String(player.name) + "!");
        player.lose(player.bet)
        this.updateScoreBoard(player)

        if (this.isSplit) {
            return;
        }
        if (player.moneyLeft === 0) {
            console.log("Out of Money - Game Over!")
            player.isStillActive = false;
        } else {
            return;
        }
    }

    draw(player) {
        console.log("Player and Dealer BlackJack - Tie!")
        if (this.isSplit) {
            return;
        }
    }

    playerDeal(player) {
        player.hand = new Hand();

        const handDiv = document.createElement('div')
        handDiv.id = String(player.name) + "-hand-1"
        handDiv.className = "hand"
        document.getElementById(player.name).appendChild(handDiv)

        player.hand.addCard(this.deck.drawCard(), player.name, 1);
        player.hand.addCard(this.deck.drawCard(), player.name, 1);
    }

    async splitPair(player) {
        this.userHandSplit1 = new Hand();
        this.userHandSplit2 = new Hand();

        const handDiv = document.createElement('div')
        handDiv.id = String(player.name) + "-hand-2"
        handDiv.className = "hand"
        playersDiv.addChild(handDiv)

        this.userHandSplit1.addCard(player.hand.cards[0], player.name, 1);
        this.userHandSplit2.addCard(player.hand.cards[1], player.name, 2);

        this.promptText("Playing Hand 1:")
        player.hand = this.userHandSplit1
        await this.playerTurn(player)

        this.isSplit = false;

        this.promptText("Playing Hand 2: ")
        player.hand = this.userHandSplit2
        await this.playerTurn(player, 2)
    }

    async doubleDown(player) {
        const choice = await this.createPromptButtonResponse(String(player.name) + ", Double Down?", "Yes", "No")
        if (choice === "Yes") {
            player.bet*2
        }
    }

    dealerDeal() {
        this.dealerHand = new Hand()
        this.dealerHand.addCard(this.deck.drawCard(), "dealers-hand")
    }

    isBlackJack(player) {
        if (player.hand.getPlayerTotal() === 21 && this.dealerHand.addCard(this.deck.drawCard(), "dealers-hand") !== 21 && player.hand.cards.length === this.dealerHand.length === 2) {
            console.log("BlackJack!");
            return true;
        } else if (player.hand.getPlayerTotal () === 21 && this.dealerHand.addCard(this.deck.drawCard(), "dealers-hand") === 21 && player.hand.cards.length === this.dealerHand.length === 2) {
            return false;
        }
    }

    async userChoice(player) {
        if (this.isSplittableHand(player) && player.moneyLeft >= player.bet*2) {
            const choice = await this.createPromptButtonResponse(String(player.name) + ", Split?", "Yes", "No")
            if (choice === "Yes") {
                this.isSplit = true;
                await this.splitPair(player)
            }
        } else if ([9, 10, 11].includes(player.hand.getPlayerTotal()) && player.moneyLeft >= player.bet*2) {
            await this.doubleDown(player)
        } 
        
        await this.playerTurn(player)
    }

    isSplittableHand(player) {
        return player.hand.cards[0].rank === player.hand.cards[1].rank
    }

    async playerTurn(player, hand=1) {
        let isStanding = false;

        while (!player.hand.isBust() && !this.isBlackJack(player) && !isStanding) {
        const choice = await this.createPromptButtonResponse(String(player.name) +", Hit or Stand?", "Hit", "Stand");

            if (choice === "Hit") {
                player.hand.addCard(this.deck.drawCard(), player.name, hand)
                console.log("You have: " + player.hand.toString())
                console.log("Value: " + player.hand.getPlayerTotal())
            } else if (choice === "Stand") {
                isStanding = true
                break;
            }
        }

        this.calcBestHand(player)
        
        this.whosTurn++;
    }

    calcBestHand(player) {
        if (player.hand.getPlayerTotal() > this.highestScore && player.hand.getPlayerTotal() <= 21) {
            this.highestScore = player.hand.getPlayerTotal()
        }

    }

    dealerTurn() {
        this.dealerHand.addCard(this.deck.drawCard(), "dealers-hand")

        console.log(" ")
        console.log("Dealer flips: " + this.dealerHand.toString());
        console.log("Dealer's score: " + this.dealerHand.getDealerTotal());

        while (this.dealerHand.getDealerTotal() < 17 && this.dealerHand.getDealerTotal() < this.highestScore) {
            this.dealerHand.addCard(this.deck.drawCard(), "dealers-hand");
            console.log(" ")
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

    checkActivePlayer() {
        let totalBalance = 0;
         for (let i in this.players) {
            totalBalance += this.players[i].moneyLeft
        }
        if (totalBalance > 0) {
            return true;
        } else {
            return false;
        }
    }


    async play() {
        this.gameSetup()
        for (let i in this.players) {
            let player = this.players[i];
            document.getElementById(player.name).innerHTML = ""
            if (player.isStillActive) {
                await this.betting(player);
                this.playerDeal(player);
            }
        }
        this.dealerDeal()

        for (let i in this.players) {
            let player = this.players[i];
            if (player.isStillActive) {
                console.log(" ")
                console.log(String(player.name) + "'s turn:")
                await this.userChoice(player)
            }
        }

        this.dealerTurn()

        for (let i in this.players) {
            let player = this.players[i]
            if (player.isStillActive) {
                this.whoWins(player);
            }
        }
        
        if (this.checkActivePlayer()) {
            await this.replay();
        } else {
            this.promptText("All players out of money! Game over")
        }
    }
}

const game = new Game();
game.start()