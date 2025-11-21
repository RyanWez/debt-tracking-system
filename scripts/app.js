// Navigation
function showView(viewName) {
    document.querySelectorAll('.view-content').forEach(v => v.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`view-${viewName}`).classList.remove('hidden');
    document.getElementById(`nav-${viewName}`).classList.add('active');

    if (viewName === 'dashboard') updateDashboard();
    if (viewName === 'customers') renderCustomers();
    if (viewName === 'debts') {
        populateCustomerSelects();
        renderRecentDebts();
    }
    if (viewName === 'payments') {
        populateCustomerSelects();
        renderRecentPayments();
    }
    if (viewName === 'settings') updateSettingsView();
    if (viewName === 'lock') updateLockView();
}

// Update Lock View
function updateLockView() {
    const statusDisplay = document.getElementById('lock-status-display');
    const btnSetPin = document.getElementById('btn-set-pin');
    const btnChangePin = document.getElementById('btn-change-pin');
    const btnRemovePin = document.getElementById('btn-remove-pin');
    
    if (hasPIN()) {
        statusDisplay.innerHTML = '🔒 PIN သတ်မှတ်ပြီးပါပြီ';
        statusDisplay.className = 'lock-status-badge locked mx-auto';
        btnSetPin.disabled = true;
        btnSetPin.classList.add('opacity-50', 'cursor-not-allowed');
        btnChangePin.disabled = false;
        btnChangePin.classList.remove('opacity-50', 'cursor-not-allowed');
        btnRemovePin.disabled = false;
        btnRemovePin.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        statusDisplay.innerHTML = '🔓 PIN မသတ်မှတ်ရသေးပါ';
        statusDisplay.className = 'lock-status-badge unlocked mx-auto';
        btnSetPin.disabled = false;
        btnSetPin.classList.remove('opacity-50', 'cursor-not-allowed');
        btnChangePin.disabled = true;
        btnChangePin.classList.add('opacity-50', 'cursor-not-allowed');
        btnRemovePin.disabled = true;
        btnRemovePin.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Initialize PIN system
    initPINSystem();
    
    // Check if app is locked
    if (hasPIN() && isLocked()) {
        showUnlockDialog();
    }
    
    initCustomDropdowns();
    updateDashboard();
    
    // Check for backup reminder
    checkBackupReminder();
});
