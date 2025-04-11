class PomodoroTimer {
    constructor() {
        this.timeLeft = 30 * 60; // 30 minutes in seconds
        this.timerId = null;
        this.isRunning = false;
        this.completedPomodoros = 0;
        this.currentMode = 'pomodoro';
        
        // Timer durations in minutes
        this.durations = {
            pomodoro: 30,
            shortBreak: 5,
            longBreak: 15
        };

        // DOM elements
        this.timerDisplay = document.getElementById('timer');
        this.startButton = document.getElementById('start');
        this.pauseButton = document.getElementById('pause');
        this.resetButton = document.getElementById('reset');
        this.modeButtons = {
            pomodoro: document.getElementById('pomodoro'),
            shortBreak: document.getElementById('shortBreak'),
            longBreak: document.getElementById('longBreak')
        };
        this.completedDisplay = document.getElementById('completed');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.startButton.addEventListener('click', () => this.start());
        this.pauseButton.addEventListener('click', () => this.pause());
        this.resetButton.addEventListener('click', () => this.reset());

        // Mode switch buttons
        Object.keys(this.modeButtons).forEach(mode => {
            this.modeButtons[mode].addEventListener('click', () => this.switchMode(mode));
        });
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerId = setInterval(() => this.updateTimer(), 1000);
            this.startButton.disabled = true;
            this.pauseButton.disabled = false;
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.timerId);
            this.startButton.disabled = false;
            this.pauseButton.disabled = true;
        }
    }

    reset() {
        this.pause();
        this.timeLeft = this.durations[this.currentMode] * 60;
        this.updateDisplay();
        this.startButton.disabled = false;
        this.pauseButton.disabled = true;
    }

    switchMode(mode) {
        this.currentMode = mode;
        this.pause();
        this.timeLeft = this.durations[mode] * 60;
        this.updateDisplay();

        // Update active button
        Object.keys(this.modeButtons).forEach(key => {
            this.modeButtons[key].classList.remove('active');
        });
        this.modeButtons[mode].classList.add('active');
    }

    updateTimer() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateDisplay();
        } else {
            this.handleTimerComplete();
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    handleTimerComplete() {
        this.pause();
        this.playNotificationSound();
        
        if (this.currentMode === 'pomodoro') {
            this.completedPomodoros++;
            this.completedDisplay.textContent = this.completedPomodoros;
            
            // After 4 pomodoros, suggest a long break
            if (this.completedPomodoros % 4 === 0) {
                this.switchMode('longBreak');
            } else {
                this.switchMode('shortBreak');
            }
        } else {
            this.switchMode('pomodoro');
        }
    }

    playNotificationSound() {
        // Create and play a simple notification sound
        const audio = new Audio('data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9RzE8ICADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5ieEBA');
        audio.play();
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const timer = new PomodoroTimer();
}); 