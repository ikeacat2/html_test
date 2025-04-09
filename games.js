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
/*
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

displayLeaderboard(); */

// === FLAPPY FELIX ===
(function () {
    const canvas = document.getElementById('flappyCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const gravity = 0.5;
    const flapStrength = -8;
    const pipeWidth = 60;
    const gapHeight = 150;
    const pipeSpeed = 2;
    const birdSize = 40;

    let birdY = canvas.height / 2;
    let birdVelocity = 0;
    let birdAngle = 0;
    let pipes = [];
    let score = 0;
    let gameOver = false;

    const birdImg = new Image();
    birdImg.src = 'flappyFelix.jpg';

    function resetGame() {
        birdY = canvas.height / 2;
        birdVelocity = 0;
        pipes = [];
        score = 0;
        gameOver = false;
        spawnPipe();
    }

    function spawnPipe() {
        const top = Math.random() * (canvas.height - gapHeight - 100) + 50;
        pipes.push({ x: canvas.width, top, bottom: top + gapHeight });
    }

    function update() {
        if (gameOver) return;
        birdVelocity += gravity;
        birdY += birdVelocity;
        birdAngle = Math.min((birdVelocity / 10) * 45, 90);

        for (const pipe of pipes) {
            pipe.x -= pipeSpeed;
        }

        if (pipes[pipes.length - 1].x < canvas.width - 200) spawnPipe();
        if (pipes[0].x + pipeWidth < 0) {
            pipes.shift();
            score++;
        }

        for (let pipe of pipes) {
            const withinPipe = pipe.x < 80 && pipe.x + pipeWidth > 40;
            const hitPipe = birdY < pipe.top || birdY + birdSize > pipe.bottom;
            if (withinPipe && hitPipe) {
                gameOver = true;
            }
        }

        if (birdY + birdSize > canvas.height || birdY < 0) gameOver = true;
    }

    function draw() {
        ctx.drawImage(birdImg, -birdSize / 2, -birdSize / 2, birdSize, birdSize);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#2ecc71';
        for (let pipe of pipes) {
            ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
            ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
        }

        ctx.save();
        ctx.translate(60, birdY + birdSize / 2);
        ctx.rotate((birdAngle * Math.PI) / 180);
        ctx.drawImage(birdImg, -birdSize / 2, -birdSize / 2, birdSize, birdSize);
        ctx.restore();

        ctx.fillStyle = '#fff';
        ctx.font = '24px Arial';
        ctx.fillText('Score: ' + score, 10, 30);

        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = '48px Arial';
            ctx.fillText('Game Over', 80, canvas.height / 2);
            ctx.font = '24px Arial';
            ctx.fillText('Click to Restart', 110, canvas.height / 2 + 40);
        }
    }

    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') birdVelocity = flapStrength;
    });

    canvas.addEventListener('click', () => {
        if (gameOver) resetGame();
        else birdVelocity = flapStrength;
    });

    resetGame();
    loop();
})();
