let timerInterval: NodeJS.Timeout | null = null;
let secondsRemaining = 0;
let totalSeconds =  0;

function stopGame(gameWin: boolean) {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    const endContainer = document.querySelector('.minigame-over') as HTMLElement;
    const h2Elem = endContainer.querySelector('h2') as HTMLHeadingElement;
    const pElem = endContainer.querySelector('p') as HTMLElement;

    if (gameWin) {
        endContainer.style.backgroundColor = 'rgba(84, 255, 164, 0.285)';
        h2Elem.textContent = "Hackeo Realzado!"
        pElem.textContent = "Muy bien mi amor <33"
        h2Elem.style.color = 'rgb(84, 255, 164)';
        h2Elem.style.textShadow = 'rgb(127, 255, 191)';
    } else {
        endContainer.style.backgroundColor = 'rgba(255, 127, 127, 0.285)';
        h2Elem.textContent = "Hackeo Fallido!"
        pElem.textContent = "Más malo hackeando que Archie..."
        h2Elem.style.color = 'rgb(255, 84, 84)';
        h2Elem.style.textShadow = 'rgb(255, 127, 127)';   
    }
    endContainer.style.display = 'flex';
    setTimeout(() => {
        endContainer.style.display = 'none';
        resetGame();
    }, 2000);
    
}

function resetGame() {
    const minigameContainer = document.querySelector('.minigame-container') as HTMLElement;
    const crackButton = document.getElementById('crackButton') as HTMLElement;
    const macInput = document.getElementById('mac-input') as HTMLInputElement | null;
    const ipInput = document.getElementById('ip-input') as HTMLInputElement | null;
    const timerProgress = document.querySelector('.timer-progress-bar-fill') as HTMLElement;

    if (minigameContainer && crackButton) {
        minigameContainer.style.display = 'none';
        crackButton.style.display = 'flex';   
    }

    if (macInput && ipInput) {
        macInput.disabled = false;
        ipInput.disabled = false;
    } else {
        console.log('macInput or ipInput or both fields not found')
    }

    if (timerProgress) {
        timerProgress.style.width = '100%'
    }
}

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomCharacter(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomIdx = Math.floor(Math.random() * chars.length);
    return chars.charAt(randomIdx);
}

function generateRandomChars(length: number): string[] {
    const randomChars: string[] = []
    for (let i = 0; i < length; i++) {
        randomChars.push(getRandomCharacter());
    }
    return randomChars;
}

function generateFeedbackElem(numOfChars: number): void {
    const feedbackContainer = document.querySelector('.feedback-container') as HTMLElement;
    feedbackContainer.innerHTML = '';

    for (let i=0; i<numOfChars; i++) {
        const feedbackCircle = document.createElement('div');
        feedbackCircle.classList.add('feedback-circle');
        feedbackContainer.appendChild(feedbackCircle);

        if (i < numOfChars -1) {//Make sure no extra line at end of circles
            const feedbackLine = document.createElement('div');
            feedbackLine.classList.add('feedback-line');
            feedbackContainer.appendChild(feedbackLine);
        }
    }
    return;
}

function updateFeedback(isCorrect: boolean, currSquareIdx: number): void {
    const feedbackContainer = document.querySelector('.feedback-container') as HTMLElement;
    
    if (currSquareIdx >= feedbackContainer.children.length) {
        console.log('Invalid square index for feedbackCircle');
        return;
    }
    
    const feedbackCircle = feedbackContainer.children[2*currSquareIdx] as HTMLElement;
    const feedbackLine = feedbackContainer.children[2*currSquareIdx-1] as HTMLElement;
    if (isCorrect) {
        const checkIcon = document.createElement('i');
        checkIcon.classList.add('fas','fa-check');
        feedbackCircle.appendChild(checkIcon);
        feedbackCircle.classList.add('check-mark'); //Styling for check-mark

        if (currSquareIdx > 0) { //First circle doesn't have a predeceding line
            feedbackLine.style.backgroundColor = 'rgb(84, 255, 164)';
        }

    } else {
        const xIcon = document.createElement('i');
        xIcon.classList.add('fas', 'fa-times');
        feedbackCircle.appendChild(xIcon);
        feedbackCircle.classList.add('x-mark'); //Styling for x-mark
        
        if (currSquareIdx > 0) {
            feedbackLine.style.backgroundColor = 'rgb(255, 84, 84)';
        }

    }
    return;
}

function initTimer() {
    const timerContainer = document.querySelector('.timer-container') as HTMLElement;
    const letterContainer = document.querySelector('.letter-container') as HTMLElement;

    if (timerContainer && letterContainer) {
        const letterContainerWidth = letterContainer.clientWidth;
        timerContainer.style.width = `${letterContainerWidth}px`;
    }
    updateTimerDisplay();
}

function runTimer() {
    timerInterval = setInterval(() => {
        secondsRemaining--;
        updateTimerDisplay();

        if (secondsRemaining <= 0) {
            stopGame(false);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerProgress = document.querySelector('.timer-progress-bar-fill') as HTMLElement;
    const timerSeconds = document.querySelector('.timer-seconds') as HTMLElement;
   
    if (timerSeconds && timerProgress) {
        const percentageLeft = Math.floor(100*secondsRemaining/totalSeconds)
        timerProgress.style.width = `${percentageLeft}%`
        timerSeconds.textContent = `${secondsRemaining} sec left`
    }
}

function startCracking() {
    const macInput = document.getElementById('mac-input') as HTMLInputElement | null;
    const ipInput = document.getElementById('ip-input') as HTMLInputElement | null;

    if (macInput && ipInput) {
        macInput.disabled = true;
        ipInput.disabled = true;
    } else {
        console.log('macInput or ipInput or both fields not found')
    }
    
    const minigameContainer = document.querySelector('.minigame-container') as HTMLElement;
    const letterContainer = document.querySelector('.letter-container');
    const crackButton = document.getElementById('crackButton');

    if (crackButton && minigameContainer) {
        crackButton.style.display = 'none'; //Remove the crack button

        const numOfChars = getRandomNumber(8,16);
        const randomChars = generateRandomChars(numOfChars);

        if (letterContainer) {
            letterContainer.innerHTML = ''; //Clear the container
            
            generateFeedbackElem(numOfChars);
            randomChars.forEach(char => {
                const letterSquare = document.createElement('div');
                letterSquare.classList.add('letter-square');
                letterSquare.textContent = char;
                letterContainer.appendChild(letterSquare) //Append the letter square to the letter container
            })
            minigameContainer.style.display = 'flex' //Show the minigame
            initTimer();
            runTimer();

            const handleKeyPress = function(event: KeyboardEvent) {
                if (event.key === "Shift" || event.key === "CapsLock") {
                    return
                }
                if (letterContainer && secondsRemaining) {
                    const pressedKey = event.key.toUpperCase();
                    const currentSquare = letterContainer.children[currSquareIdx] as HTMLDivElement;

                    if (pressedKey === randomChars[currSquareIdx]) {
                        currentSquare.style.backgroundColor = 'rgb(84, 255, 164)';
                        updateFeedback(true, currSquareIdx);
                        currSquareIdx++;

                        if (currSquareIdx === randomChars.length) {
                            //All squares ok
                            document.removeEventListener('keydown', handleKeyPress);
                            stopGame(true);
                        }
                    } else {
                        updateFeedback(false, currSquareIdx);
                        document.removeEventListener('keydown', handleKeyPress);
                        currentSquare.style.backgroundColor = 'rgb(215, 73, 73)'
                        stopGame(false);
                    }
                }
            }

            //Event listener for keyboard presses
            document.addEventListener('keydown', handleKeyPress);
            let currSquareIdx = 0;


        } else {
            console.log('Letter container not found!');
        }
    } else {
        console.log('crackButton not found!')
    }
}
