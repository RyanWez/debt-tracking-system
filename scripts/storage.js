// Data Store
let customers = JSON.parse(localStorage.getItem('bakery_customers') || '[]');
let debts = JSON.parse(localStorage.getItem('bakery_debts') || '[]');
let payments = JSON.parse(localStorage.getItem('bakery_payments') || '[]');

// Save data to localStorage
function saveData() {
    localStorage.setItem('bakery_customers', JSON.stringify(customers));
    localStorage.setItem('bakery_debts', JSON.stringify(debts));
    localStorage.setItem('bakery_payments', JSON.stringify(payments));
}

// Get customer total debt
function getCustomerTotalDebt(customerId) {
    const customerDebts = debts.filter(d => d.customerId === customerId);
    const customerPayments = payments.filter(p => p.customerId === customerId);
    
    const totalDebt = customerDebts.reduce((sum, d) => sum + d.total, 0);
    const totalPaid = customerPayments.reduce((sum, p) => sum + p.amount, 0);
    
    return totalDebt - totalPaid;
}
