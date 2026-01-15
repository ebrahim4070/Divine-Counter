// App State
const state = {
    mode: 'tasbih', // 'tasbih' or 'mantra'
    count: 0,
    cycleCount: 0,
    completedCycles: 0,
    beadsPerCycle: 100,
    goalCycles: 10,
    vibrationEnabled: true
};

// DOM Elements
const tasbihModeBtn = document.getElementById('tasbihMode');
const mantraModeBtn = document.getElementById('mantraMode');
const counterValue = document.getElementById('counterValue');
const counterLabel = document.getElementById('counterLabel');
const cycleProgress = document.getElementById('cycleProgress');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const countBtn = document.getElementById('countBtn');
const decrementBtn = document.getElementById('decrementBtn');
const resetBtn = document.getElementById('resetBtn');
const resetCycleBtn = document.getElementById('resetCycleBtn');
const goalAchievement = document.getElementById('goalAchievement');
const completedCyclesSpan = document.getElementById('completedCycles');
const beadsPerCycleInput = document.getElementById('beadsPerCycle');
const goalCyclesInput = document.getElementById('goalCycles');
const vibrationInput = document.getElementById('vibration');
const currentYearSpan = document.getElementById('currentYear');

// Initialize the app
function init() {
    // Set current year in footer
    currentYearSpan.textContent = new Date().getFullYear();
    
    loadFromLocalStorage();
    updateUI();
    setupEventListeners();
}

// Load saved data from localStorage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('divineCounterData');
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.assign(state, data);
        
        // Update input values to match loaded state
        beadsPerCycleInput.value = state.beadsPerCycle;
        goalCyclesInput.value = state.goalCycles;
        vibrationInput.checked = state.vibrationEnabled;
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('divineCounterData', JSON.stringify(state));
}

// Set up event listeners
function setupEventListeners() {
    // Mode selection
    tasbihModeBtn.addEventListener('click', () => switchMode('tasbih'));
    mantraModeBtn.addEventListener('click', () => switchMode('mantra'));
    
    // Counting
    countBtn.addEventListener('click', incrementCount);
    decrementBtn.addEventListener('click', decrementCount);
    
    // Reset buttons
    resetBtn.addEventListener('click', resetCount);
    resetCycleBtn.addEventListener('click', resetCycle);
    
    // Customization
    beadsPerCycleInput.addEventListener('change', updateBeadsPerCycle);
    goalCyclesInput.addEventListener('change', updateGoalCycles);
    vibrationInput.addEventListener('change', updateVibration);
    
    // Keyboard support
    document.addEventListener('keydown', handleKeyPress);
    
    // Touch/click vibration feedback
    countBtn.addEventListener('mousedown', () => {
        if (state.vibrationEnabled && navigator.vibrate) {
            navigator.vibrate(10);
        }
    });
    
    // Touch/click vibration feedback for count button on touch devices
    countBtn.addEventListener('touchstart', () => {
        if (state.vibrationEnabled && navigator.vibrate) {
            navigator.vibrate(10);
        }
    });

    // Vibration feedback for decrement button
    decrementBtn.addEventListener('mousedown', () => {
        if (state.vibrationEnabled && navigator.vibrate) {
            navigator.vibrate(10);
        }
    });

    // Vibration feedback for decrement button on touch devices
    decrementBtn.addEventListener('touchstart', () => {
        if (state.vibrationEnabled && navigator.vibrate) {
            navigator.vibrate(10);
        }
    });
}

// Handle keyboard input
function handleKeyPress(e) {
    // Prevent spacebar from scrolling page
    if (e.code === 'Space') {
        e.preventDefault();
    }
    
    if (e.code === 'Space' || e.code === 'Enter') {
        incrementCount();
    } else if (e.code === 'Escape') {
        resetCount();
    } else if (e.code === 'KeyR' && e.ctrlKey) {
        resetCycle();
    }
}

// Switch between Tasbih and Mantra modes
function switchMode(newMode) {
    state.mode = newMode;
    
    // Update active button
    tasbihModeBtn.classList.toggle('active', newMode === 'tasbih');
    mantraModeBtn.classList.toggle('active', newMode === 'mantra');
    
    // Update label based on mode
    counterLabel.textContent = newMode === 'tasbih' 
        ? 'Tasbih Count' 
        : 'Mantra Count';
    
    saveToLocalStorage();
    updateUI();
}

// Increment the count
function incrementCount() {
    state.count++;
    state.cycleCount++;
    
    // Check if a cycle is completed
    if (state.cycleCount >= state.beadsPerCycle) {
        completeCycle();
    }
    
    // Animation feedback
    counterValue.classList.add('pulse');
    setTimeout(() => {
        counterValue.classList.remove('pulse');
    }, 500);
    
    // Vibration feedback
    if (state.vibrationEnabled && navigator.vibrate) {
        navigator.vibrate(20);
    }
    
    saveToLocalStorage();
    updateUI();
}

// Decrement the count
function decrementCount() {
    if (state.count > 0) {
        state.count--;
        state.cycleCount--;
        
        // Ensure cycle count doesn't go below 0
        if (state.cycleCount < 0) {
            state.cycleCount = 0;
            
            // If we had completed cycles, go back one
            if (state.completedCycles > 0) {
                state.completedCycles--;
                state.cycleCount = state.beadsPerCycle - 1;
            }
        }
        
        // Animation feedback
        counterValue.classList.add('pulse');
        setTimeout(() => {
            counterValue.classList.remove('pulse');
        }, 500);
        
        // Vibration feedback
        if (state.vibrationEnabled && navigator.vibrate) {
            navigator.vibrate(20);
        }
        
        saveToLocalStorage();
        updateUI();
    }
}

// Complete a cycle
function completeCycle() {
    state.completedCycles++;
    state.cycleCount = 0;
    
    // Show achievement message
    showAchievement();
    
    // Check if spiritual goal is reached
    if (state.completedCycles >= state.goalCycles) {
        showSpiritualGoalAchieved();
    }
}

// Show cycle completion achievement
function showAchievement() {
    const achievementText = state.mode === 'tasbih'
        ? `One Tasbih completed! You've said ${state.beadsPerCycle} prayers.`
        : `One Mantra cycle completed! You've chanted ${state.beadsPerCycle} times.`;
    
    // Temporarily update cycle progress text
    const originalText = cycleProgress.textContent;
    cycleProgress.textContent = achievementText;
    cycleProgress.style.color = '#d4af37';
    
    setTimeout(() => {
        cycleProgress.textContent = originalText;
        cycleProgress.style.color = '#8bc34a';
    }, 3000);
}

// Show spiritual goal achieved
function showSpiritualGoalAchieved() {
    completedCyclesSpan.textContent = state.completedCycles;
    goalAchievement.classList.add('show');
    
    setTimeout(() => {
        goalAchievement.classList.remove('show');
    }, 5000);
}

// Reset the entire count
function resetCount() {
    if (confirm("Are you sure you want to reset all counts? This will reset your current count, cycles, and completed cycles.")) {
        state.count = 0;
        state.cycleCount = 0;
        state.completedCycles = 0;
        
        saveToLocalStorage();
        updateUI();
    }
}

// Reset only the current cycle
function resetCycle() {
    if (confirm("Reset just the current cycle? Your total count and completed cycles will remain.")) {
        state.cycleCount = 0;
        
        saveToLocalStorage();
        updateUI();
    }
}

// Update beads per cycle setting
function updateBeadsPerCycle() {
    const value = parseInt(beadsPerCycleInput.value);
    if (value >= 10 && value <= 1000) {
        state.beadsPerCycle = value;
        
        // Adjust cycle count if it exceeds new beads per cycle
        if (state.cycleCount > state.beadsPerCycle) {
            state.cycleCount = state.beadsPerCycle;
        }
        
        saveToLocalStorage();
        updateUI();
    } else {
        alert("Please enter a value between 10 and 1000");
        beadsPerCycleInput.value = state.beadsPerCycle;
    }
}

// Update goal cycles setting
function updateGoalCycles() {
    const value = parseInt(goalCyclesInput.value);
    if (value >= 1 && value <= 100) {
        state.goalCycles = value;
        saveToLocalStorage();
        updateUI();
    } else {
        alert("Please enter a value between 1 and 100");
        goalCyclesInput.value = state.goalCycles;
    }
}

// Update vibration setting
function updateVibration() {
    state.vibrationEnabled = vibrationInput.checked;
    saveToLocalStorage();
}

// Update the UI
function updateUI() {
    // Update counter value
    counterValue.textContent = state.count;
    
    // Update cycle progress
    const progressPercentage = Math.min(100, (state.cycleCount / state.beadsPerCycle) * 100);
    progressFill.style.width = `${progressPercentage}%`;
    progressPercent.textContent = `${Math.round(progressPercentage)}%`;
    
    // Update cycle progress text
    const remaining = state.beadsPerCycle - state.cycleCount;
    const cycleLabel = state.mode === 'tasbih' ? 'beads' : 'chants';
    cycleProgress.textContent = `${state.cycleCount}/${state.beadsPerCycle} ${cycleLabel} in this cycle • ${remaining} remaining`;
    
    // Update title based on mode
    document.title = state.mode === 'tasbih'
        ? `Divine Counter (Tasbih: ${state.count})`
        : `Divine Counter (Mantra: ${state.count})`;
    
    // Update completed cycles display
    completedCyclesSpan.textContent = state.completedCycles;
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', init);