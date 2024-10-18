// Tab functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');

// Add event listeners to tab buttons for switching tabs
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove 'active' class from all buttons and panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add 'active' class to the clicked button and corresponding pane
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

// Stopwatch and Lap Timer functionality
let time = 0; // Time in milliseconds
let interval;
let isRunning = false; // To track if the timer is running
let laps = []; // Array to store lap times

// Format time in HH:MM:SS.ms
function formatTime(ms) {
    const hours = String(Math.floor(ms / 3600000)).padStart(2, '0');
    const minutes = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
    const milliseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

// Update the timer display
function updateDisplay(timerId) {
    document.querySelector(`#${timerId} .time-display`).textContent = formatTime(time);
}

// Start/Stop functionality for the timer
function startStop(timerId) {
    const button = document.querySelector(`#${timerId}-startstop`);
    if (isRunning) {
        clearInterval(interval); // Stop the timer
        button.textContent = 'Start'; // Change button text
    } else {
        interval = setInterval(() => {
            time += 10; // Increment time by 10 milliseconds
            updateDisplay(timerId); // Update the display
        }, 10);
        button.textContent = 'Stop'; // Change button text
    }
    isRunning = !isRunning; // Toggle running state
}

// Reset functionality for the timer
function reset(timerId) {
    clearInterval(interval); // Clear the interval
    time = 0; // Reset time to 0
    isRunning = false; // Set running state to false
    updateDisplay(timerId); // Update display
    document.querySelector(`#${timerId}-startstop`).textContent = 'Start'; // Reset button text
    if (timerId === 'laptimer') {
        laps = []; // Clear laps array
        document.getElementById('lap-list').innerHTML = ''; // Clear lap list
    }
}

// Stopwatch controls
document.getElementById('stopwatch-startstop').addEventListener('click', () => startStop('stopwatch'));
document.getElementById('stopwatch-reset').addEventListener('click', () => reset('stopwatch'));

// Lap Timer controls
document.getElementById('laptimer-startstop').addEventListener('click', () => startStop('laptimer'));
document.getElementById('laptimer-reset').addEventListener('click', () => reset('laptimer'));
document.getElementById('laptimer-lap').addEventListener('click', () => {
    if (isRunning) {
        laps.push(time); // Add the current time to laps
        const lapItem = document.createElement('div'); // Create a new lap item
        lapItem.classList.add('lap-item');
        lapItem.innerHTML = `<span>Lap ${laps.length}</span><span>${formatTime(time)}</span>`;
        document.getElementById('lap-list').prepend(lapItem); // Add lap item to the lap list
    }
});

// Alarm functionality
let alarmTime = null; // To store the alarm time
let alarmTimeout; // To store the timeout for the alarm
const alarmSound = document.getElementById('alarm-sound'); // Get the audio element for the alarm sound

// Function to play the alarm sound
function playAlarmSound() {
    alarmSound.play();
}

// Function to stop the alarm sound
function stopAlarmSound() {
    alarmSound.pause();
    alarmSound.currentTime = 0; // Reset the sound to the beginning
}

// Set the alarm
document.getElementById('alarm-set').addEventListener('click', () => {
    const input = document.getElementById('alarm-time'); // Get the time input element
    const alarmButton = document.getElementById('alarm-set'); // Get the button for setting the alarm

    if (alarmButton.textContent === 'Set Alarm') {
        const now = new Date();
        const [hours, minutes] = input.value.split(':'); // Split the input value into hours and minutes
        const alarmDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

        // If the alarm time is in the past, set it for the next day
        if (alarmDate <= now) {
            alarmDate.setDate(alarmDate.getDate() + 1);
        }
        
        const timeDiff = alarmDate - now; // Calculate the time difference until the alarm
        clearTimeout(alarmTimeout); // Clear any existing alarm timeout
        alarmTimeout = setTimeout(() => {
            document.getElementById('alarm-display').textContent = 'ALARM!'; // Show alarm message
            document.getElementById('alarm-display').classList.add('alarm-ringing'); // Add ringing class
            playAlarmSound(); // Play alarm sound
        }, timeDiff);
        
        alarmTime = input.value; // Store the alarm time
        document.getElementById('alarm-display').textContent = `Alarm set for ${alarmTime}`; // Display set alarm message
        alarmButton.textContent = 'Cancel Alarm'; // Change button text to 'Cancel Alarm'
    } else {
        clearTimeout(alarmTimeout); // Clear the timeout for the alarm
        stopAlarmSound(); // Stop the alarm sound
        document.getElementById('alarm-display').textContent = ''; // Clear alarm message
        document.getElementById('alarm-display').classList.remove('alarm-ringing'); // Remove ringing class
        alarmButton.textContent = 'Set Alarm'; // Reset button text
        alarmTime = null; // Clear alarm time
    }
});

// Update clock every second
setInterval(() => {
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0]; // Get the current time in HH:MM:SS format
    if (alarmTime && currentTime.startsWith(alarmTime)) { // Check if current time matches alarm time
        document.getElementById('alarm-display').textContent = 'ALARM!'; // Show alarm message
        document.getElementById('alarm-display').classList.add('alarm-ringing'); // Add ringing class
        playAlarmSound(); // Play alarm sound
    }
}, 1000);
