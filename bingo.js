document.addEventListener('DOMContentLoaded', function () {
    const newGameButton = document.getElementById('new-game');
    const nextBallButton = document.getElementById('next-ball');
    const shuffleCheckbox = document.getElementById('shuffle-effect-enabled');
    let calledNumbers = [];
    let currentIndex = 0;

    function clearBoard() {
        document.getElementById('current-ball').textContent = '';
        for (let i = 1; i <= 75; i++) {
            const cell = document.getElementById(`ball-${i}`);
            cell.textContent = '';
            cell.classList.remove('called');
        }
    }

    function setButtonState(newState) {
        newGameButton.disabled = !newState;
        nextBallButton.disabled = !newState;
    }

    function initializeGame() {
        clearBoard();
        setButtonState(false);
        generateBingo().then(numbers => {
            calledNumbers = numbers;
            currentIndex = 0;
            setButtonState(true);
        }).catch(error => {
            console.error('Error generating bingo numbers:', error);
            newGameButton.disabled = false;
        });
    }

    newGameButton.addEventListener('click', initializeGame);

    function callNextNumber() {
        if (currentIndex < calledNumbers.length) {
            const nextNumber = calledNumbers[currentIndex];
            if (shuffleCheckbox.checked) {
                animateNumberSelection(nextNumber);
            } else {
                displayNumber(nextNumber);
            }
        }
    }

    function animateNumberSelection(finalNumber) {
        let animationCount = 0;
        nextBallButton.disabled = true;

        const animationInterval = setInterval(() => {
            if (animationCount < 16) {
                const randomNum = Math.floor(Math.random() * 75) + 1;
                document.getElementById('current-ball').textContent = randomNum;
                animationCount++;
            } else {
                clearInterval(animationInterval);
                displayNumber(finalNumber);
            }
        }, 100);
    }

    function displayNumber(number) {
        document.getElementById('current-ball').textContent = number;
        const ballCell = document.getElementById(`ball-${number}`);
        ballCell.textContent = number;
        ballCell.classList.add('called');
        currentIndex++;
        if (currentIndex < calledNumbers.length) {
            nextBallButton.disabled = false;
        }
    }

    nextBallButton.addEventListener('click', callNextNumber);

    newGameButton.disabled = false;
    nextBallButton.disabled = true;
});

async function generateBingo() {
    const n = 75;
    const xs = Array.from(Array(n).keys());
    xs[0] = n;
    for (let i = n - 1; i > 0; i--) {
        let r = Math.floor(Math.random() * (i + 1));
        [xs[i], xs[r]] = [xs[r], xs[i]];
    }
    return xs;
}