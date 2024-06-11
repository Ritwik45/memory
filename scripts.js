document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.querySelector('.game-board');
    const timerElement = document.getElementById('timer');
    const restartButton = document.getElementById('restart-button');
    const streakElement = document.getElementById('streak');
    const highScoreElement = document.getElementById('high-score');
    const mascotElement = document.querySelector('.hello-kitty-mascot');

    // Add sound elements
    const clickSound = document.getElementById('click-sound');
    const pairMatchSound = document.getElementById('pair-match-sound');

    // Define an array of URLs for the images
    const imageUrls = [
        './cutie.png',
        './egg.png',
        './frog.png',
        './hitler.png',
        './kitty.png',
        './kuromi.png',
        './omen.png',
        './penguin.png',
        './roll.png',
        './sheep.png',
        './simpson.png',
        './tux.png'
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    let shuffledImageUrls;
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let timer;
    let time = 120; // 2 minutes
    let streak = 0;
    let highScore = localStorage.getItem('highScore') || 0;

    highScoreElement.innerText = `High Score: ${highScore}`;

    const messages = [
        "Good job! Yay!",
        "You're doing great!",
        "Keep it up!",
        "Almost there!",
        "You're getting closer!",
        "You're close to winning!",
        "You can do it!",
        "Don't give up!",
        "Great work!",
        "Nice moves!",
        "You're on fire!",
        "Fantastic!",
        "You're unstoppable!",
        "Amazing!",
        "You're a memory master!",
        "You're awesome!"
    ];

    restartButton.addEventListener('click', resetGame);

    function startGame() {
        resetBoard();
        shuffledImageUrls = shuffle([...imageUrls, ...imageUrls]);
        gameBoard.innerHTML = '';
        shuffledImageUrls.forEach((imageUrl, index) => {
            const card = createCard(index, imageUrl);
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
        startTimer();
        showMascotMessage(getRandomMessage());
        mascotElement.style.display = 'block';
    }

    function createCard(index, imageUrl) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.imageUrl = imageUrl;

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.innerText = '?'; // Display a question mark as text

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.style.backgroundImage = `url('${imageUrl}')`; // Set background image URL for the flipped side of the card
        cardBack.style.backgroundColor = '#fff'; // Set background color to white

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        return card;
    }

    function startTimer() {
        timer = setInterval(() => {
            time--;
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            timerElement.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (time > 60) {
                timerElement.style.color = 'green';
            } else if (time > 30) {
                timerElement.style.color = 'yellow';
            } else {
                timerElement.style.color = 'red';
            }

            if (time === 0) {
                clearInterval(timer);
                gameOver();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function flipCard() {
        if (lockBoard) return;
        if (this.classList.contains('flipped')) return;

        this.classList.add('flipped');
        playSound(clickSound);

        if (!firstCard) {
            firstCard = this;
        } else {
            secondCard = this;
            lockBoard = true; // Lock the board to prevent further clicks
            checkForMatch();
        }
    }

    function checkForMatch() {
        const firstImage = firstCard.querySelector('.card-back').style.backgroundImage;
        const secondImage = secondCard.querySelector('.card-back').style.backgroundImage;

        if (firstImage === secondImage) {
            removeCards();
        } else {
            unflipCards();
        }
    }

    function removeCards() {
        setTimeout(() => {
            playSound(pairMatchSound);
            firstCard.style.visibility = 'hidden';
            secondCard.style.visibility = 'hidden';
            resetBoard();
            checkWin();
            showMascotMessage(getRandomMessage());
        }, 500);
    }

    function unflipCards() {
        setTimeout(() => {
            firstCard.querySelector('.card-front').innerText = '';
            secondCard.querySelector('.card-front').innerText = '';
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
            lockBoard = false; // Unlock the board after unflipping cards
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    function checkWin() {
        if (document.querySelectorAll('.card:not([style*="visibility: hidden"])').length === 0) {
            streak++;
            streakElement.innerText = `Streak: ${streak}`;
            if (streak > highScore) {
                highScore = streak;
                highScoreElement.innerText = `High Score: ${highScore}`;
                localStorage.setItem('highScore', highScore);
            }
            showMascotMessage("You win! Yay, a new level!");
            restartButton.style.display = 'block';
            setTimeout(() => {
                resetGame();
            }, 2000); // Automatically reset the game after 2 seconds
        }
    }

    function showMascotMessage(text) {
        if (mascotElement && mascotElement.querySelector('p')) {
            mascotElement.querySelector('p').innerText = text;
        }
    }

    function gameOver() {
        gameBoard.innerHTML = '';
        showMascotMessage("Uh oh, you lost! Wanna retry?");
        restartButton.style.display = 'block';
    }

    function resetGame() {
        time = 120;
        streak = 0;
        streakElement.innerText = `Streak: ${streak}`;
        startGame();
        restartButton.style.display = 'none';
    }

    function playSound(sound) {
        sound.currentTime = 0;
        sound.play();
    }

    function getRandomMessage() {
        return messages[Math.floor(Math.random() * messages.length)];
    }

    // Start the game when the page loads
    startGame();
});
