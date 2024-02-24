const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: "player-cards",
        playerBOX: document.querySelector("#player-cards"),
        player2: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    button: document.getElementById("next-duel"),
}

const imagePath = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${imagePath}dragon.png`,
        WinsOn: [1],
        LosesFor: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${imagePath}magician.png`,
        WinsOn: [2],
        LosesFor: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${imagePath}exodia.png`,
        WinsOn: [0],
        LosesFor: [1],
    },
]



async function getRandomCardId() {
    console.log("get random card id");
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}




async function drawSelectedCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = `Attribute : ${cardData[index].type}`;
};



async function createCardImage(cardId, fieldSide) {
    console.log("create card image");
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "120px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");

    cardImage.setAttribute("data-id", cardId);
    cardImage.classList.add("card");

    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        })
    }

    cardImage.addEventListener("mouseover", () => {
        drawSelectedCard(cardId);
    })

    return cardImage;
}


async function removeAllCardsImages() {
    let cards = state.playerSides.computerBOX;
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    cards = state.playerSides.playerBOX;
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}


async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinsOn.includes(computerCardId)) {
        duelResults = "Ganhou"
        state.score.playerScore++;
        await playAudio("win");
    }

    if (playerCard.LosesFor.includes(computerCardId)) {
        duelResults = "Perdeu"
        state.score.computerScore++;
        await playAudio("lose");
    }

    return duelResults;
};

async function drawButton(text) {
    state.button.innerText = text;
    state.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}


async function drawCards(cardsNumber, fieldSide) {
    console.log("draw cards");
    for (let i = 0; i < cardsNumber; i++) {
        const randomCardId = await getRandomCardId();
        const cardImage = await createCardImage(randomCardId, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}


async function playAudio(status) {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}


async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.button.style.display = "none";

    state.fieldCards.player.display = "none";
    state.fieldCards.computer.display = "none";

    init();
}


function init() {
    console.log("hey!!!");

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.player2);

    const bgm = document.getElementById("bgm");
    bgm.play();
};

init();