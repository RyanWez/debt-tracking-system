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
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initCustomDropdowns();
    updateDashboard();
});
