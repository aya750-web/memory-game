const board = document.getElementById("board");

const movesElement = document.getElementById("moves");
const timeElement = document.getElementById("time");
const matchesElement = document.getElementById("matches");

const progressElement = document.getElementById("progress");
const progressText = document.getElementById("progress-text");

const messageElement = document.getElementById("message");

const restartButton = document.getElementById("restart");

const winScreen = document.getElementById("win-screen");

const finalMovesElement =
    document.getElementById("final-moves");

const finalTimeElement =
    document.getElementById("final-time");

const playAgainButton =
    document.getElementById("play-again");


/*
CARD DATA
*/
const symbols = [
    "🌙",
    "⭐",
    "🍀",
    "🚀",
    "🎧",
    "🍕",
    "🌸",
    "🔥"
];


/*
GAME VARIABLES
*/

let firstCard = null;

let secondCard = null;

let lockBoard = false;

let moves = 0;

let matches = 0;

let seconds = 0;

let timer = null;

let gameStarted = false;


/*
SHUFFLE
*/

function shuffle(array) {

    const shuffledArray = [...array];

    for (
        let i = shuffledArray.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            shuffledArray[i],
            shuffledArray[randomIndex]
        ] =
            [
                shuffledArray[randomIndex],
                shuffledArray[i]
            ];

    }

    return shuffledArray;
}


/*
================================
FORMAT TIME
================================
*/

function formatTime(totalSeconds) {

    const minutes =
        Math.floor(totalSeconds / 60)
            .toString()
            .padStart(2, "0");


    const seconds =
        (totalSeconds % 60)
            .toString()
            .padStart(2, "0");


    return `${minutes}:${seconds}`;
}


/*
================================
START TIMER
================================
*/

function startTimer() {

    if (timer !== null) {
        return;
    }


    timer = setInterval(() => {

        seconds++;

        timeElement.textContent =
            formatTime(seconds);

    }, 1000);

}


/*
================================
STOP TIMER
================================
*/

function stopTimer() {

    clearInterval(timer);

    timer = null;

}


/*
================================
CREATE CARD
================================
*/

function createCard(symbol) {

    // Main button
    const card =
        document.createElement("button");


    card.type = "button";

    card.classList.add("card");


    // Store the symbol
    card.dataset.symbol = symbol;


    card.setAttribute(
        "aria-label",
        "Hidden memory card"
    );


    /*
    ----------------------------
    Inner
    ----------------------------
    */

    const cardInner =
        document.createElement("div");

    cardInner.classList.add("card-inner");


    /*
    ----------------------------
    Back
    ----------------------------
    */

    const cardBack =
        document.createElement("div");

    cardBack.classList.add(
        "card-face",
        "card-back"
    );


    /*
    ----------------------------
    Front
    ----------------------------
    */

    const cardFront =
        document.createElement("div");

    cardFront.classList.add(
        "card-face",
        "card-front"
    );


    /*
    Put the symbol
    */

    cardFront.textContent = symbol;


    /*
    Build the card
    */

    cardInner.appendChild(cardBack);

    cardInner.appendChild(cardFront);

    card.appendChild(cardInner);


    /*
    Click event
    */

    card.addEventListener(
        "click",
        function () {

            flipCard(card);

        }
    );


    return card;
}


/*
================================
UPDATE UI
================================
*/

function updateUI() {

    movesElement.textContent = moves;


    matchesElement.textContent =
        `${matches}/${symbols.length}`;


    const percentage =
        (matches / symbols.length) * 100;


    progressElement.style.width =
        `${percentage}%`;


    progressText.textContent =
        `${matches} of ${symbols.length} pairs`;

}


/*
================================
FLIP CARD
================================
*/

function flipCard(card) {

    /*
    Don't allow clicks
    while checking cards
    */

    if (lockBoard) {
        return;
    }


    /*
    Don't click the same card twice
    */

    if (card === firstCard) {
        return;
    }


    /*
    Don't click matched cards
    */

    if (card.classList.contains("matched")) {
        return;
    }


    /*
    Start timer
    */

    if (!gameStarted) {

        gameStarted = true;

        startTimer();

        messageElement.textContent =
            "Find every pair.";

    }


    /*
    Flip card
    */

    card.classList.add("flipped");


    /*
    First card
    */

    if (firstCard === null) {

        firstCard = card;

        return;
    }


    /*
    Second card
    */

    secondCard = card;


    moves++;


    updateUI();


    /*
    Lock the board
    */

    lockBoard = true;


    /*
    Compare cards
    */

    if (
        firstCard.dataset.symbol ===
        secondCard.dataset.symbol
    ) {

        cardsMatch();

    } else {

        cardsDoNotMatch();

    }

}


/*
================================
MATCH
================================
*/

function cardsMatch() {

    /*
    Mark cards as matched
    */

    firstCard.classList.add("matched");

    secondCard.classList.add("matched");


    /*
    Increase matches
    */

    matches++;


    updateUI();


    messageElement.textContent =
        "Nice match!";


    /*
    Reset selected cards
    */

    firstCard = null;

    secondCard = null;

    lockBoard = false;


    /*
    Check if game finished
    */

    if (matches === symbols.length) {

        finishGame();

    }

}


/*
================================
NOT MATCH
================================
*/

function cardsDoNotMatch() {

    messageElement.textContent =
        "Not a match...";


    setTimeout(() => {

        /*
        Flip cards back
        */

        firstCard.classList.remove("flipped");

        secondCard.classList.remove("flipped");


        /*
        Reset selection
        */

        firstCard = null;

        secondCard = null;

        lockBoard = false;


        messageElement.textContent =
            "Try again.";

    }, 800);

}


/*
================================
FINISH GAME
================================
*/

function finishGame() {

    stopTimer();


    messageElement.textContent =
        "You found all pairs!";

    messageElement.classList.add("success");


    finalMovesElement.textContent =
        moves;


    finalTimeElement.textContent =
        formatTime(seconds);


    /*
    Show win screen
    */

    setTimeout(() => {

        winScreen.classList.add("show");

    }, 600);

}


/*
================================
START / RESET GAME
================================
*/

function startGame() {

    /*
    Reset variables
    */

    firstCard = null;

    secondCard = null;

    lockBoard = false;

    moves = 0;

    matches = 0;

    seconds = 0;

    gameStarted = false;


    /*
    Stop old timer
    */

    stopTimer();


    /*
    Reset UI
    */

    movesElement.textContent = "0";

    timeElement.textContent = "00:00";

    matchesElement.textContent = "0/8";

    progressElement.style.width = "0%";

    progressText.textContent =
        "0 of 8 pairs";


    messageElement.textContent =
        "Choose a card to begin.";

    messageElement.classList.remove("success");


    winScreen.classList.remove("show");


    /*
    Create pairs
    */

    const deck = shuffle([
        ...symbols,
        ...symbols
    ]);


    /*
    Clear board
    */

    board.innerHTML = "";


    /*
    Create cards
    */

    deck.forEach((symbol) => {

        const card =
            createCard(symbol);


        board.appendChild(card);

    });

}


/*
================================
BUTTONS
================================
*/

restartButton.addEventListener(
    "click",
    startGame
);


playAgainButton.addEventListener(
    "click",
    startGame
);


/*
================================
START
================================
*/

startGame();