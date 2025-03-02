const images = [
    "felix1.jpg", "felix2.jpg", "felix3.jpg", "felix4.jpg",
    "felix1.jpg", "felix2.jpg", "felix3.jpg", "felix4.jpg"
];

let shuffledImages = images.sort(() => Math.random() - 0.5); // Shuffle images
let selectedCards = [];
let matchedCards = [];
let startTime;
let timerInterval;

const gameBoard = document.getElementById("gameBoard");
const timerDisplay = document.getElementById("timer");

// 🛠 Create cards dynamically
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

// 🕒 Start timer when the first card is flipped
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = elapsed;
    }, 1000);
}

// ⏹ Stop timer when game ends
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
            document.getElementById("nameInput").style.display = "block"; // Show name input
        }, 500);
    }
}

// 💾 Save score to leaderboard
function saveScore() {
    const name = document.getElementById("playerName").value || "Anonymous";
    const time = parseInt(timerDisplay.textContent);

    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name, time });

    // Sort by fastest time and keep top 5
    leaderboard.sort((a, b) => a.time - b.time);
    leaderboard = leaderboard.slice(0, 5);

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    
    updateLeaderboard();
    document.getElementById("nameInput").style.display = "none"; // Hide input
}

// 📜 Update leaderboard display
function updateLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    const leaderboardElement = document.getElementById("leaderboard");
    leaderboardElement.innerHTML = ""; // Clear old list

    leaderboard.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `${entry.name} - ${entry.time} sec`;
        leaderboardElement.appendChild(li);
    });
}

// 🎮 Start game function (reset everything)
function startGame() {
    matchedCards = [];
    selectedCards = [];
    timerDisplay.textContent = "0";
    document.getElementById("nameInput").style.display = "none";

    gameBoard.innerHTML = ""; // Clear board
    shuffledImages = images.sort(() => Math.random() - 0.5); // Shuffle images

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

// Call leaderboard update when page loads
updateLeaderboard();
