class Timer {
    constructor(container, id) {
        this.id = id;
        this.container = container;
        this.createTimerElement();
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.intervalId = null;
    }

    createTimerElement() {
        this.element = document.createElement('div');
        this.element.className = 'timer';
        this.element.innerHTML = `
            <input type="text" class="timer-description" placeholder="Descripción (min. 20 caracteres)" minlength="20">
            <input type="number" class="hours" min="0" max="23" placeholder="HH">
            <input type="number" class="minutes" min="0" max="59" placeholder="MM">
            <input type="number" class="seconds" min="0" max="59" placeholder="SS">
            <button class="start-stop">Iniciar</button>
            <button class="reset">Reiniciar</button>
            <span class="time-display">00:00:00</span>
        `;
        this.container.appendChild(this.element);

        this.descriptionInput = this.element.querySelector('.timer-description');
        this.hoursInput = this.element.querySelector('.hours');
        this.minutesInput = this.element.querySelector('.minutes');
        this.secondsInput = this.element.querySelector('.seconds');
        this.startStopButton = this.element.querySelector('.start-stop');
        this.resetButton = this.element.querySelector('.reset');
        this.timeDisplay = this.element.querySelector('.time-display');

        this.startStopButton.addEventListener('click', () => this.toggleTimer());
        this.resetButton.addEventListener('click', () => this.resetTimer());
    }

    toggleTimer() {
        if (this.intervalId) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        if (!this.intervalId) {
            if (this.hours === 0 && this.minutes === 0 && this.seconds === 0) {
                this.hours = parseInt(this.hoursInput.value) || 0;
                this.minutes = parseInt(this.minutesInput.value) || 0;
                this.seconds = parseInt(this.secondsInput.value) || 0;
            }
            this.intervalId = setInterval(() => this.updateTimer(), 1000);
            this.startStopButton.textContent = 'Parar';
        }
    }

    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.startStopButton.textContent = 'Iniciar';
        }
    }

    resetTimer() {
        this.stopTimer();
        this.hours = parseInt(this.hoursInput.value) || 0;
        this.minutes = parseInt(this.minutesInput.value) || 0;
        this.seconds = parseInt(this.secondsInput.value) || 0;
        this.updateDisplay();
    }

    updateTimer() {
        if (this.hours === 0 && this.minutes === 0 && this.seconds === 0) {
            this.stopTimer();
            this.playAlarm();
        } else if (this.seconds === 0) {
            if (this.minutes === 0) {
                this.hours--;
                this.minutes = 59;
            } else {
                this.minutes--;
            }
            this.seconds = 59;
        } else {
            this.seconds--;
        }
        this.updateDisplay();
    }

    updateDisplay() {
        this.timeDisplay.textContent = `${this.padZero(this.hours)}:${this.padZero(this.minutes)}:${this.padZero(this.seconds)}`;
    }

    padZero(num) {
        return num.toString().padStart(2, '0');
    }

    playAlarm() {
        const description = this.descriptionInput.value || 'Temporizador';
        alert(`¡Tiempo terminado! - ${description}`);
        // Aquí se puede agregar un sonido de alarma
    }
}

const timersContainer = document.getElementById('timers-container');
const addTimerButton = document.getElementById('add-timer');
let timerCount = 0;

addTimerButton.addEventListener('click', () => {
    new Timer(timersContainer, timerCount++);
});

// Iniciar con un temporizador
new Timer(timersContainer, timerCount++);