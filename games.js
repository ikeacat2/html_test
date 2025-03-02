const images = [
    "felix1.jpg", "felix2.jpg", "felix3.jpg", "felix4.jpg",
    "felix1.jpg", "felix2.jpg", "felix3.jpg", "felix4.jpg"
];

let shuffledImages = images.sort(() => Math.random() - 0.5); // Shuffle images
let selectedCards = [];
let matchedCards = [];

const gameBoard = document.getElementById("gameBoard");

// Create cards dynamically
shuffledImages.forEach((imgSrc, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = imgSrc;

    const img = document.createElement("img");
    img.src = imgSrc;

    card.appendChild(img);
    card.addEventListener("click", () => flipCard(card));

    gameBoard.appendChild(card);
});

function flipCard(card) {
    if (selectedCards.length < 2 && !card.classList.contains("flipped")) {
        card.classList.add("flipped");
        selectedCards.push(card);
    }

    if (selectedCards.length === 2) {
        setTimeout(checkMatch, 700);
    }
}

function checkMatch() {
    const [card1, card2] = selectedCards;

    if (card1.dataset.image === card2.dataset.image) {
        matchedCards.push(card1, card2);
    } else {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
    }

    selectedCards = [];

    if (matchedCards.length === images.length) {
        setTimeout(() => alert("You won!"), 500);
    }
}
