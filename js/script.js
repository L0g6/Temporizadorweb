class Timer {
    constructor(container, id) {
        this.id = id;
        this.container = container;
        this.createTimerElement();
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.intervalId = null;
        this.element.__timer = this;
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
            <button class="delete">Borrar</button>
            <span class="time-display">00:00:00</span>
        `;
        this.container.appendChild(this.element);

        this.descriptionInput = this.element.querySelector('.timer-description');
        this.hoursInput = this.element.querySelector('.hours');
        this.minutesInput = this.element.querySelector('.minutes');
        this.secondsInput = this.element.querySelector('.seconds');
        this.startStopButton = this.element.querySelector('.start-stop');
        this.resetButton = this.element.querySelector('.reset');
        this.deleteButton = this.element.querySelector('.delete');
        this.timeDisplay = this.element.querySelector('.time-display');

        this.startStopButton.addEventListener('click', () => this.toggleTimer());
        this.resetButton.addEventListener('click', () => this.resetTimer());
        this.deleteButton.addEventListener('click', () => this.deleteTimer());
    }

    deleteTimer() {
        this.stopTimer();
        this.element.remove();
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
        this.startTime = Date.now();
        this.totalSeconds = this.hours * 3600 + this.minutes * 60 + this.seconds;
        this.intervalId = setInterval(() => this.updateTimer(), 1000);
        this.startStopButton.textContent = 'Parar';
        this.element.style.backgroundColor = '#e6ffe6';
    }
}

stopTimer() {
    if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.startStopButton.textContent = 'Iniciar';
        this.element.style.backgroundColor = 'initial';
    }
}

resetTimer() {
    this.stopTimer();
    this.hours = parseInt(this.hoursInput.value) || 0;
    this.minutes = parseInt(this.minutesInput.value) || 0;
    this.seconds = parseInt(this.secondsInput.value) || 0;
    this.totalSeconds = this.hours * 3600 + this.minutes * 60 + this.seconds;
    this.updateDisplay();
}

updateTimer() {
    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - this.startTime) / 1000);
    const remainingSeconds = Math.max(this.totalSeconds - elapsedSeconds, 0);

    if (remainingSeconds === 0) {
        this.stopTimer();
        this.playAlarm();
    } else {
        this.hours = Math.floor(remainingSeconds / 3600);
        this.minutes = Math.floor((remainingSeconds % 3600) / 60);
        this.seconds = remainingSeconds % 60;
        this.updateDisplay();
    }
}

    updateDisplay() {
        this.timeDisplay.textContent = `${this.padZero(this.hours)}:${this.padZero(this.minutes)}:${this.padZero(this.seconds)}`;
    }

    padZero(num) {
        return num.toString().padStart(2, '0');
    }

    playAlarm() {
        const description = this.descriptionInput.value || 'Temporizador';
        
        // Reproducir sonido de alarma
        const alarmSound = document.getElementById('alarm-sound');
        if (alarmSound) {
            alarmSound.play();
        }
    
        // Mostrar notificación del navegador si está permitido
        if (Notification.permission === "granted") {
            new Notification("¡Tiempo terminado!", {
                body: description,
                icon: "path/to/icon.png" // Opcional: añade un icono a la notificación
            });
        }
    
        // Mostrar alerta (esto bloqueará la ejecución, pero el sonido ya habrá comenzado)
        setTimeout(() => {
            alert(`¡Tiempo terminado! - ${description}`);
        }, 100); // Pequeño retraso para asegurar que el sonido comience
    }

}


const timersContainer = document.getElementById('timers-container');
const addTimerButton = document.getElementById('add-timer');
let timerCount = 0;



// Al inicio del script o cuando se carga la página
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}
addTimerButton.addEventListener('click', () => {
    new Timer(timersContainer, timerCount++);
});

// Iniciar con un temporizador
new Timer(timersContainer, timerCount++);

// Nuevas funciones para la ordenación
function getTotalSeconds(timer) {
    return timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
}

function sortTimers() {
    const timers = Array.from(timersContainer.children);
    
    timers.sort((a, b) => {
        const timerA = a.__timer;
        const timerB = b.__timer;
        return getTotalSeconds(timerA) - getTotalSeconds(timerB);
    });
    
    timers.forEach(timer => timersContainer.appendChild(timer));
}

// Agregar el evento al botón de ordenación
document.getElementById('sort-timers').addEventListener('click', sortTimers);