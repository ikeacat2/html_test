const images = [
    "felix1.jpg", "felix2.jpg", "felix3.jpg", "felix4.jpg",
    "felix1.jpg", "felix2.jpg", "felix3.jpg", "felix4.jpg"
];

let shuffledImages = images.sort(() => Math.random() - 0.5);
let selectedCards = [];
let matchedCards = [];
let startTime;
let timerInterval;

const gameBoard = document.getElementById("gameBoard");
const leaderboardElement = document.getElementById("leaderboard");
const nameInputContainer = document.getElementById("nameInput");
const playerNameInput = document.getElementById("playerName");

// 🛠 Create game board
function createCards() {
    gameBoard.innerHTML = ""; // Clear previous cards
    shuffledImages = images.sort(() => Math.random() - 0.5);

    shuffledImages.forEach((imgSrc) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.image = imgSrc;

        const img = document.createElement("img");
        img.src = imgSrc;

        card.appendChild(img);
        card.addEventListener("click", () => flipCard(card));

        gameBoard.appendChild(card);
    });
}

createCards(); // Initialize game board

// 🕒 Start Timer on first flip
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        document.title = `Time: ${elapsed}s - Felix Visgilio Fanpage`; // Display time in title
    }, 1000);
}

// ⏹ Stop timer
function stopTimer() {
    clearInterval(timerInterval);
}

// 🎮 Flip card logic
function flipCard(card) {
    if (selectedCards.length < 2 && !card.classList.contains("flipped") && !matchedCards.includes(card)) {
        card.classList.add("flipped");
        selectedCards.push(card);

        if (matchedCards.length === 0 && selectedCards.length === 1) {
            startTimer(); // Start timer on first flip
        }
    }

    if (selectedCards.length === 2) {
        setTimeout(checkMatch, 700);
    }
}

// ✅ Check for a match
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
        stopTimer();
        setTimeout(() => {
            nameInputContainer.style.display = "block"; // Show name input
        }, 500);
    }
}

// 💾 Save score to leaderboard
function saveScore() {
    const name = playerNameInput.value.trim() || "Anonymous";
    const time = Math.floor((Date.now() - startTime) / 1000);

    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name, time });

    leaderboard.sort((a, b) => a.time - b.time);
    leaderboard = leaderboard.slice(0, 5);

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    updateLeaderboard();
    nameInputContainer.style.display = "none"; // Hide input
}

// 📜 Update leaderboard display
function updateLeaderboard() {
    leaderboardElement.innerHTML = "";
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    leaderboard.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `${entry.name} - ${entry.time} sec`;
        leaderboardElement.appendChild(li);
    });
}

// 🎮 Restart game
function startGame() {
    matchedCards = [];
    selectedCards = [];
    nameInputContainer.style.display = "none";
    playerNameInput.value = "";
    createCards();
}

// 🏆 Load leaderboard on page load
updateLeaderboard();