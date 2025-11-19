// PIN Lock System - UI Components

// Global variables
window.currentPINInput = '';
window.pinDialogCallback = null;
window.pinDialogMode = 'set'; // 'set', 'verify', 'change', 'remove', 'unlock'
window.tempPIN = '';
window.tempOldPIN = '';

let currentPINInput = '';
let pinDialogCallback = null;
let pinDialogMode = 'set';
let tempPIN = '';
let tempOldPIN = '';

// Create Number Pad HTML
function createNumberPad() {
    return `
        <div class="pin-number-pad">
            <button class="pin-number-btn brutalist-btn" onclick="window.handlePINInput('1')">1</button>
            <button class="pin-number-btn brutalist-btn" onclick="window.handlePINInput('2')">2</button>
            <button class="pin-number-btn brutalist-btn" onclick="window.handlePINInput('3')">3</button>
            <button class="pin-number-btn brutalist-btn" onclick="window.handlePINInput('4')">4</button>
            <button class="pin-number-btn brutalist-btn" onclick="window.handlePINInput('5')">5</button>
            <button class="pin-number-btn brutalist-btn" onclick="window.handlePINInput('6')">6</button>
            <button class="pin-number-btn brutalist-btn" onclick="window.handlePINInput('7')">7</button>
            <button class="pin-number-btn brutalist-btn" onclick="window.handlePINInput('8')">8</button>
            <button class="pin-number-btn brutalist-btn" onclick="window.handlePINInput('9')">9</button>
            <button class="pin-number-btn brutalist-btn backspace" onclick="window.handlePINBackspace()">←</button>
            <button class="pin-number-btn brutalist-btn" onclick="window.handlePINInput('0')">0</button>
            <button class="pin-number-btn brutalist-btn confirm" onclick="window.handlePINConfirm()">✓</button>
        </div>
    `;
}

// Create PIN Dots HTML
function createPINDots(length = 0) {
    let dots = '';
    for (let i = 0; i < 4; i++) {
        dots += `<div class="pin-dot ${i < length ? 'filled' : ''}"></div>`;
    }
    return `<div class="pin-dots-container">${dots}</div>`;
}

// Update PIN Dots
function updatePINDots() {
    const container = document.querySelector('.pin-dots-container');
    if (container) {
        container.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const dot = document.createElement('div');
            dot.className = `pin-dot ${i < currentPINInput.length ? 'filled' : ''}`;
            container.appendChild(dot);
        }
    }
}

// Handle PIN Input - Make it global
window.handlePINInput = function(num) {
    if (currentPINInput.length < 4) {
        currentPINInput += num;
        window.currentPINInput = currentPINInput;
        updatePINDots();
        
        // Vibrate on mobile
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    }
}

// Handle Backspace - Make it global
window.handlePINBackspace = function() {
    if (currentPINInput.length > 0) {
        currentPINInput = currentPINInput.slice(0, -1);
        window.currentPINInput = currentPINInput;
        updatePINDots();
    }
}

// Handle Confirm - Make it global
window.handlePINConfirm = function() {
    if (currentPINInput.length !== 4) {
        showPINError('PIN 4 လုံး ထည့်ပါ');
        return;
    }
    
    processPINInput();
}

// Process PIN Input based on mode
function processPINInput() {
    // Sync from window
    currentPINInput = window.currentPINInput || currentPINInput;
    pinDialogMode = window.pinDialogMode || pinDialogMode;
    tempPIN = window.tempPIN || tempPIN;
    tempOldPIN = window.tempOldPIN || tempOldPIN;
    pinDialogCallback = window.pinDialogCallback || pinDialogCallback;
    
    const dialog = document.getElementById('pin-dialog-overlay');
    
    switch (pinDialogMode) {
        case 'set':
        case 'confirm':  // Handle confirmation step
            handleSetPIN();
            break;
        case 'verify':
            handleVerifyPIN();
            break;
        case 'change':
        case 'change-new':
        case 'change-confirm':
            handleChangePIN();
            break;
        case 'remove':
            handleRemovePIN();
            break;
        case 'unlock':
            handleUnlockPIN();
            break;
    }
}

// Set PIN Flow
function handleSetPIN() {
    if (!tempPIN) {
        // First input - store and ask for confirmation
        tempPIN = currentPINInput;
        window.tempPIN = currentPINInput;
        currentPINInput = '';
        window.currentPINInput = '';
        showPINDialog('confirm', 'PIN အတည်ပြုရန်', 'PIN ထပ်ထည့်ပါ (အတည်ပြုရန်)');
    } else {
        // Second input - verify match
        if (tempPIN === currentPINInput) {
            setPIN(tempPIN);
            window.closePINDialog();
            showToast('PIN သတ်မှတ်ပြီးပါပြီ! 🔒', 'success');
            updateLockView();
            tempPIN = '';
            window.tempPIN = '';
        } else {
            showPINError('PIN နှစ်ခု မတူပါ');
            shakePINDialog();
            tempPIN = '';
            window.tempPIN = '';
            currentPINInput = '';
            window.currentPINInput = '';
            setTimeout(() => {
                window.showSetPINDialog();
            }, 1500);
        }
    }
}

// Verify PIN (for sensitive actions)
function handleVerifyPIN() {
    if (verifyPIN(currentPINInput)) {
        window.closePINDialog();
        if (pinDialogCallback) {
            pinDialogCallback();
            pinDialogCallback = null;
            window.pinDialogCallback = null;
        }
    } else {
        const result = handleFailedAttempt();
        if (result.blocked) {
            showPINTimeout(result.timeout);
        } else {
            showPINError(result.message);
            shakePINDialog();
        }
        currentPINInput = '';
        window.currentPINInput = '';
        updatePINDots();
    }
}

// Change PIN Flow
function handleChangePIN() {
    if (!tempOldPIN) {
        // Step 1: Verify old PIN
        if (verifyPIN(currentPINInput)) {
            tempOldPIN = currentPINInput;
            window.tempOldPIN = currentPINInput;
            currentPINInput = '';
            window.currentPINInput = '';
            showPINDialog('change-new', 'PIN အသစ်', 'PIN အသစ် ထည့်ပါ (4 လုံး)');
        } else {
            showPINError('လက်ရှိ PIN မှားနေပါတယ်');
            shakePINDialog();
            currentPINInput = '';
            window.currentPINInput = '';
            updatePINDots();
        }
    } else if (!tempPIN) {
        // Step 2: Enter new PIN
        tempPIN = currentPINInput;
        window.tempPIN = currentPINInput;
        currentPINInput = '';
        window.currentPINInput = '';
        showPINDialog('change-confirm', 'PIN အတည်ပြုရန်', 'PIN အသစ် ထပ်ထည့်ပါ');
    } else {
        // Step 3: Confirm new PIN
        if (tempPIN === currentPINInput) {
            setPIN(tempPIN);
            window.closePINDialog();
            showToast('PIN ပြောင်းပြီးပါပြီ! 🔄', 'success');
            tempOldPIN = '';
            tempPIN = '';
            window.tempOldPIN = '';
            window.tempPIN = '';
        } else {
            showPINError('PIN နှစ်ခု မတူပါ');
            shakePINDialog();
            tempPIN = '';
            window.tempPIN = '';
            currentPINInput = '';
            window.currentPINInput = '';
            setTimeout(() => {
                showPINDialog('change-new', 'PIN အသစ်', 'PIN အသစ် ထည့်ပါ (4 လုံး)');
            }, 1500);
        }
    }
}

// Remove PIN
function handleRemovePIN() {
    const result = removePIN(currentPINInput);
    if (result.success) {
        window.closePINDialog();
        showToast('PIN ဖျက်ပြီးပါပြီ! 🔓', 'info');
        updateLockView();
    } else {
        showPINError(result.error);
        shakePINDialog();
        currentPINInput = '';
        window.currentPINInput = '';
        updatePINDots();
    }
}

// Unlock App
function handleUnlockPIN() {
    // Check timeout first
    const timeoutSeconds = isInTimeout();
    if (timeoutSeconds) {
        showPINTimeout(timeoutSeconds);
        currentPINInput = '';
        window.currentPINInput = '';
        return;
    }
    
    if (verifyPIN(currentPINInput)) {
        unlockApp();
        window.closePINDialog();
        showToast('ဝင်ရောက်ခွင့်ရပါပြီ! ✅', 'success');
    } else {
        const result = handleFailedAttempt();
        if (result.blocked) {
            showPINTimeout(result.timeout);
        } else {
            showPINError(result.message);
            shakePINDialog();
        }
        currentPINInput = '';
        window.currentPINInput = '';
        updatePINDots();
    }
}

// Show PIN Dialog
function showPINDialog(mode, title, subtitle) {
    // Remove existing dialog first
    const existingOverlay = document.getElementById('pin-dialog-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // Reset PIN input
    pinDialogMode = mode;
    currentPINInput = '';
    window.pinDialogMode = mode;
    window.currentPINInput = '';
    
    const overlay = document.createElement('div');
    overlay.id = 'pin-dialog-overlay';
    overlay.className = 'pin-dialog-overlay';
    
    overlay.innerHTML = `
        <div class="pin-dialog" id="pin-dialog">
            <div class="pin-dialog-header">
                <div class="pin-dialog-title">🔒 ${title}</div>
                <div class="pin-dialog-subtitle">${subtitle}</div>
            </div>
            <div class="pin-dialog-body">
                <div id="pin-message-area"></div>
                ${createPINDots(0)}
                ${createNumberPad()}
            </div>
            ${mode !== 'unlock' ? '<button onclick="window.closePINDialog()" class="brutalist-btn bg-gray-400 text-white w-full py-3">❌ မလုပ်တော့ဘူး</button>' : ''}
        </div>
    `;
    
    document.body.appendChild(overlay);
}

// Show Set PIN Dialog - Make it global
window.showSetPINDialog = function() {
    tempPIN = '';
    window.tempPIN = '';
    showPINDialog('set', 'PIN သတ်မှတ်ရန်', 'PIN ထည့်ပါ (4 လုံး)');
}

// Show Change PIN Dialog - Make it global
window.showChangePINDialog = function() {
    if (!hasPIN()) {
        showToast('PIN မသတ်မှတ်ရသေးပါ', 'warning');
        return;
    }
    tempOldPIN = '';
    tempPIN = '';
    window.tempOldPIN = '';
    window.tempPIN = '';
    showPINDialog('change', 'PIN ပြောင်းရန်', 'လက်ရှိ PIN ထည့်ပါ');
}

// Show Remove PIN Dialog - Make it global
window.showRemovePINDialog = function() {
    if (!hasPIN()) {
        showToast('PIN မသတ်မှတ်ရသေးပါ', 'warning');
        return;
    }
    showPINDialog('remove', 'PIN ဖျက်မလား?', 'လက်ရှိ PIN ထည့်ပါ');
}

// Show Unlock Dialog - Make it global
window.showUnlockDialog = function() {
    showPINDialog('unlock', 'Debt Tracking System', 'PIN ထည့်ပါ');
}

// Show PIN Verification (for sensitive actions) - Make it global
window.showPINVerification = function(callback) {
    if (!hasPIN()) {
        callback();
        return;
    }
    pinDialogCallback = callback;
    window.pinDialogCallback = callback;
    showPINDialog('verify', 'PIN အတည်ပြုရန်', 'PIN ထည့်ပါ');
}

// Close PIN Dialog - Make it global
window.closePINDialog = function() {
    const overlay = document.getElementById('pin-dialog-overlay');
    if (overlay) {
        overlay.remove();
    }
    currentPINInput = '';
    tempPIN = '';
    tempOldPIN = '';
    pinDialogCallback = null;
    window.currentPINInput = '';
    window.tempPIN = '';
    window.tempOldPIN = '';
    window.pinDialogCallback = null;
}

// Show PIN Error
function showPINError(message) {
    const messageArea = document.getElementById('pin-message-area');
    if (messageArea) {
        messageArea.innerHTML = `<div class="pin-error-message">❌ ${message}</div>`;
        setTimeout(() => {
            messageArea.innerHTML = '';
        }, 2000);
    }
}

// Show PIN Timeout
function showPINTimeout(seconds) {
    const messageArea = document.getElementById('pin-message-area');
    if (messageArea) {
        let remaining = seconds;
        messageArea.innerHTML = `
            <div class="pin-error-message">
                ⚠️ ${seconds >= 60 ? Math.ceil(seconds/60) + ' မိနစ်' : seconds + ' စက္ကန့်'} စောင့်ပါ
            </div>
            <div class="pin-timeout-display" id="timeout-counter">${remaining}</div>
        `;
        
        const interval = setInterval(() => {
            remaining--;
            const counter = document.getElementById('timeout-counter');
            if (counter) {
                counter.textContent = remaining;
            }
            
            if (remaining <= 0) {
                clearInterval(interval);
                resetAttempts();
                window.closePINDialog();
                if (pinDialogMode === 'unlock' || window.pinDialogMode === 'unlock') {
                    window.showUnlockDialog();
                }
            }
        }, 1000);
    }
}

// Shake PIN Dialog
function shakePINDialog() {
    const dialog = document.getElementById('pin-dialog');
    if (dialog) {
        dialog.classList.add('shake');
        setTimeout(() => {
            dialog.classList.remove('shake');
        }, 500);
    }
    
    // Vibrate on mobile
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
}
