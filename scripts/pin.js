// PIN Lock System - Core Logic

// PIN Storage Keys
const PIN_STORAGE_KEY = 'app_pin_hash';
const PIN_ATTEMPTS_KEY = 'pin_attempts';
const PIN_TIMEOUT_KEY = 'pin_timeout';
const APP_LOCKED_KEY = 'app_locked';

// Simple hash function (SHA-256 alternative for simplicity)
function hashPIN(pin) {
    let hash = 0;
    const str = pin + 'debt_tracker_salt_2024';
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

// Check if PIN is set
function hasPIN() {
    return localStorage.getItem(PIN_STORAGE_KEY) !== null;
}

// Set new PIN
function setPIN(pin) {
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        return false;
    }
    const hashedPIN = hashPIN(pin);
    localStorage.setItem(PIN_STORAGE_KEY, hashedPIN);
    resetAttempts();
    return true;
}

// Verify PIN
function verifyPIN(pin) {
    const storedHash = localStorage.getItem(PIN_STORAGE_KEY);
    if (!storedHash) return false;

    const inputHash = hashPIN(pin);
    return inputHash === storedHash;
}

// Change PIN
function changePIN(oldPin, newPin) {
    if (!verifyPIN(oldPin)) {
        return { success: false, error: 'လက်ရှိ PIN မှားနေပါတယ်' };
    }

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
        return { success: false, error: 'PIN က 4 လုံး ဖြစ်ရပါမယ်' };
    }

    setPIN(newPin);
    return { success: true };
}

// Remove PIN
function removePIN(pin) {
    if (!verifyPIN(pin)) {
        return { success: false, error: 'PIN မှားနေပါတယ်' };
    }

    localStorage.removeItem(PIN_STORAGE_KEY);
    resetAttempts();
    unlockApp();
    return { success: true };
}

// Lock/Unlock App
function lockApp() {
    localStorage.setItem(APP_LOCKED_KEY, 'true');
}

function unlockApp() {
    localStorage.setItem(APP_LOCKED_KEY, 'false');
    resetAttempts();
}

function isLocked() {
    return localStorage.getItem(APP_LOCKED_KEY) === 'true';
}

// Attempts Management
function getAttempts() {
    return parseInt(localStorage.getItem(PIN_ATTEMPTS_KEY) || '0');
}

function incrementAttempts() {
    const attempts = getAttempts() + 1;
    localStorage.setItem(PIN_ATTEMPTS_KEY, attempts.toString());
    return attempts;
}

function resetAttempts() {
    localStorage.removeItem(PIN_ATTEMPTS_KEY);
    localStorage.removeItem(PIN_TIMEOUT_KEY);
}

function isInTimeout() {
    const timeout = localStorage.getItem(PIN_TIMEOUT_KEY);
    if (!timeout) return false;

    const timeoutEnd = parseInt(timeout);
    const now = Date.now();

    if (now < timeoutEnd) {
        return Math.ceil((timeoutEnd - now) / 1000);
    }

    resetAttempts();
    return false;
}

function setPinTimeout(seconds) {
    const timeoutEnd = Date.now() + (seconds * 1000);
    localStorage.setItem(PIN_TIMEOUT_KEY, timeoutEnd.toString());
}

// Handle failed attempt
function handleFailedAttempt() {
    const attempts = incrementAttempts();

    if (attempts >= 3) {
        setPinTimeout(30);
        return {
            blocked: true,
            message: '3 ကြိမ် မှားပါပြီ',
            timeout: 30
        };
    }

    return {
        blocked: false,
        message: `PIN မှားနေပါတယ် (${attempts}/3)`,
        attemptsLeft: 3 - attempts
    };
}

// Initialize PIN system on app load
function initPINSystem() {
    // Lock app on load if PIN is set
    if (hasPIN()) {
        lockApp();
    }
}
