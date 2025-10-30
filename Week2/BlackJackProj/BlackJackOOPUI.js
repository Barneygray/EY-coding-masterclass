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
        return `${this.rank}${this.suit}`;
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
        const suits = ['❤', '♦', '♣', '♠'];
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
        setTimeout(() => {
            const newCardDiv = document.createElement('div')
            if (['♣', '♠'].includes(card.suit)) {
                newCardDiv.classList.add('black-card')
            } else {
                newCardDiv.classList.add('red-card')
            }
            newCardDiv.id = card.toString()

            const cardText1 = document.createElement('p')
            cardText1.textContent = card.toString()
            cardText1.className = "top-left"
            newCardDiv.appendChild(cardText1)
            
            const cardText2 = document.createElement('p')
            cardText2.textContent = card.toString()
            cardText2.className = "bottom-right"
            newCardDiv.appendChild(cardText2)

            const cardImg = document.createElement('img')
            cardImg.src = 'Ernst-Young-Logo.png'
            cardImg.className = 'card-image'
            newCardDiv.appendChild(cardImg)

            if (playerID !== "dealers-hand" && playerID !== "dealers-hand-back") {
                const playerHandDiv = document.getElementById(playerID + "-hand-" + String(hand))
                playerHandDiv.appendChild(newCardDiv)
            } else if (playerID !== "dealers-hand") {
                const cardBack = document.createElement('div')
                cardBack.classList.add('card-back')
                cardBack.id = "dealer-card-back"
                dealerHandDiv.appendChild(newCardDiv)
                newCardDiv.appendChild(cardBack)
            } else {
                dealerHandDiv.appendChild(newCardDiv)
            }
        }, 750)
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

    async createPromptNumResponse(prompt) {
        const promptText = document.createElement('p')
        promptText.textContent = prompt
        promptText.className = "prompt-text"

        const inputBox = document.createElement('input')
        inputBox.className = "input-box"
        inputBox.type = "text"

        actionPromptBox.innerHTML = ""
        actionPromptBox.appendChild(promptText)
        actionPromptBox.appendChild(inputBox)

        return new Promise((resolve) => {
            inputBox.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    const input = e.target.value;
                    const i = e.target;
                    const value = i.value.trim();

                    if (/^\d+$/.test(value)) {
                        resolve(input)
                    } else {
                        actionPromptBox.classList.add("shake")
                        setTimeout(() => {
                            actionPromptBox.classList.remove("shake")
                        }, 300)
                    }
                }
            })
        })
    } 

    async createPromptTextResponse(prompt) {
        const promptText = document.createElement('p')
        promptText.textContent = prompt
        promptText.className = "prompt-text"

        const inputBox = document.createElement('input')
        inputBox.className = "input-box"
        inputBox.type = "text"

        actionPromptBox.innerHTML = ""
        actionPromptBox.appendChild(promptText)
        actionPromptBox.appendChild(inputBox)

        return new Promise((resolve) => {
            inputBox.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    const input = e.target.value;
                    const i = e.target;
                    const value = i.value.trim();

                    if (value !== "") {
                        resolve(input)
                    } else {
                        actionPromptBox.classList.add("shake")
                        setTimeout(() => {
                            actionPromptBox.classList.remove("shake")
                        }, 300)
                    }
                }
            })
        })
    } 

    async createPromptButtonResponse(prompt, input1, input2) {
        const promptText = document.createElement('p')
        promptText.textContent = prompt
        promptText.className = "prompt-text"

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
        promptText.className = "prompt-text"

        actionPromptBox.innerHTML = ""
        actionPromptBox.appendChild(promptText)
    }

    async playerSetup() {
        this.players = [];
        const numPlayers = await this.createPromptNumResponse("How many players? (1-4):")
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

                const playerBalance = document.createElement('p')
                playerBalance.textContent = p.name + ': £' + p.moneyLeft
                playerBalance.id = String(p.name + 'balance')
                playerBalance.className = "player-balance"
                newPlayerDiv.appendChild(playerBalance)

                playersDiv.appendChild(newPlayerDiv)

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
        const response = await this.createPromptNumResponse(player.name + ", input bet:")
    
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
            this.restartGame()
        }
    }

    endGame() {
        let string = "Final Balance: "
        this.players.forEach(player => {
            string += player.name + ": £" + player.moneyLeft + " ";
        });
        this.displayText(string)
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
        this.displayText("The dealer beat " + String(player.name) + "!")
        this.delay(500)
        player.lose(player.bet)
        this.updateScoreBoard(player)

        if (this.isSplit) {
            return;
        }
        if (player.moneyLeft === 0) {
            this.displayText("Out of Money - Game Over!")
            this.delay(500)
            player.isStillActive = false;
        } else {
            return;
        }
    }

    draw(player) {
        this.displayText(String(player.name) + " and the Dealer got BlackJack - Tie!")
        this.delay(500)
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
        setTimeout(() => {
            player.hand.addCard(this.deck.drawCard(), player.name, 1);
        }, 500)

        if (this.isBlackJack(player)) {
            this.displayText('BlackJack!')
            this.delay(500)
        }
    }

    async splitPair(player) {
        this.userHandSplit1 = new Hand();
        this.userHandSplit2 = new Hand();

        const handDiv = document.createElement('div')
        handDiv.id = String(player.name) + "-hand-2"
        handDiv.className = "hand"
        document.getElementById(String(player.name)).appendChild(handDiv)

        this.userHandSplit1.addCard(player.hand.cards[0], player.name, 1);
        this.userHandSplit2.addCard(player.hand.cards[1], player.name, 2);

        const lastChild = document.getElementById(String(player.name) + "-hand-1").lastElementChild
        document.getElementById(String(player.name) + "-hand-1").removeChild(lastChild)

        const lastChild2 = document.getElementById(String(player.name) + "-hand-1").lastElementChild
        document.getElementById(String(player.name) + "-hand-1").removeChild(lastChild2)

        this.displayText("Playing Hand 1:")
        player.hand = this.userHandSplit1
        await this.playerTurn(player)

        this.isSplit = false;

        this.displayText("Playing Hand 2: ")
        player.hand = this.userHandSplit2
        await this.playerTurn(player, 2)
    }

    async doubleDown(player) {
        const choice = await this.createPromptButtonResponse(String(player.name) + ", Double Down?", "Yes", "No")
        if (choice === "Yes") {
            player.bet*=2;
            player.hand.addCard(this.deck.drawCard(), player.name, 1)
            return true
        } 
    }

    dealerDeal() {
        this.dealerHand = new Hand()
        setTimeout(() => {
            this.dealerHand.addCard(this.deck.drawCard(), "dealers-hand");
            setTimeout(() => {
                this.dealerHand.addCard(this.deck.drawCard(), "dealers-hand-back")
            }, 500);
        }, 500);
    }

    isBlackJack(player) {
        return (player.hand.getPlayerTotal() === 21)
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async userChoice(player) {
        await this.delay(500)

        if (this.isSplittableHand(player) && player.moneyLeft >= player.bet*2) {
            const choice = await this.createPromptButtonResponse(String(player.name) + ", Split?", "Yes", "No")
            if (choice === "Yes") {
                this.isSplit = true;
                await this.splitPair(player)
            }
        } else if ([9, 10, 11].includes(player.hand.getPlayerTotal()) && player.moneyLeft >= player.bet*2) {
            const dd = await this.doubleDown(player)
            if (dd) {
                this.delay(500);
                return Promise.resolve();
            }
        } 
        
        await this.playerTurn(player)
    }

    isSplittableHand(player) {
        setTimeout(() => {
            return (player.hand.cards[0].rank === player.hand.cards[1].rank)
        }, 500)
    }

    async playerTurn(player, hand=1) {
        while (!player.hand.isBust() && !this.isBlackJack(player)) {
        const choice = await this.createPromptButtonResponse(String(player.name) +", Hit or Stand?", "Hit", "Stand");

            if (choice === "Hit") {
                player.hand.addCard(this.deck.drawCard(), player.name, hand)
            } else if (choice === "Stand") {
                break;
            }
        }

        if (player.hand.isBust) {
            this.displayText("Bust!")
            this.delay(500)
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
        const cardBack = document.getElementById("dealer-card-back");
        cardBack.remove();
        while (this.dealerHand.getDealerTotal() < 17 && this.dealerHand.getDealerTotal() < this.highestScore) {
            this.dealerHand.addCard(this.deck.drawCard(), "dealers-hand");
        }
    }

    whoWins(player) {
        if (this.dealerHand.getDealerTotal() > 21 || player.hand.getPlayerTotal() > this.dealerHand.getDealerTotal() && !player.hand.isBust()) {
            this.playerWin(player);
        } else if (this.isBlackJack(player) && this.dealerHand.getDealerTotal() === 21 && this.dealerHand.cards.length == 2) {
            this.draw(player)
        } else if (this.isBlackJack(player) && this.dealerHand.getDealerTotal() === 21 && this.dealerHand.cards.length > 2) {
            this.playerWin(player)
        }
        else {
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

    async restartGame() {
        const restart = await this.createPromptButtonResponse("Restart?", "Yes", "No")

        if (restart === "Yes") {
            document.getElementById("dealers-hand").innerHTML = ""
            document.getElementById("players-hands").innerHTML = ""
            this.start()
        } else {
            this.endGame()
        }
    }


    async play() {
        this.gameSetup()

        for (let i in this.players){
            let player = this.players[i];
            document.getElementById(player.name).innerHTML = ""
            const playerBalance = document.createElement('p')
            playerBalance.textContent = player.name + ': £' + player.moneyLeft
            playerBalance.id = String(player.name + 'balance')
            playerBalance.className = "player-balance"
            document.getElementById(player.name).appendChild(playerBalance)
        }
        for (let i in this.players) {
            let player = this.players[i];
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
            this.displayText("All players out of money! Game over")
        }
    }
}

const game = new Game();
game.start()