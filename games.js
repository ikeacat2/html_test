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
const timerDisplay = document.createElement("p");
timerDisplay.innerHTML = "Time: <span id='timer'>0</span> seconds";
document.body.insertBefore(timerDisplay, gameBoard);

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
    if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }

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
        clearInterval(timerInterval);
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        setTimeout(() => {
            alert(`You won! Time: ${timeTaken} seconds`);
            document.getElementById("nameInput").style.display = "block";
            saveScorePrompt(timeTaken);
        }, 500);
    }
}

function updateTimer() {
    document.getElementById("timer").textContent = Math.floor((Date.now() - startTime) / 1000);
}

function saveScorePrompt(time) {
    document.getElementById("nameInput").style.display = "block";
    document.getElementById("playerName").onkeypress = function(event) {
        if (event.key === "Enter") {
            saveScore(time);
        }
    };
}

function saveScore(time) {
    const playerName = document.getElementById("playerName").value.trim();
    if (!playerName) return;
    
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name: playerName, time: time });
    leaderboard.sort((a, b) => a.time - b.time);
    leaderboard = leaderboard.slice(0, 3); // Keep top 3
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    
    displayLeaderboard();
    document.getElementById("nameInput").style.display = "none";
}

function displayLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    const leaderboardElement = document.getElementById("leaderboard");
    leaderboardElement.innerHTML = leaderboard.map(entry => `<li>${entry.name}: ${entry.time} seconds</li>`).join("");
}

displayLeaderboard();