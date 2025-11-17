// Dashboard Date Filter State
let dashboardDateFilter = {
    type: 'all', // 'all', 'today', 'yesterday', 'week', 'month', 'custom'
    startDate: null,
    endDate: null
};

let dashboardStartDatePicker = null;
let dashboardEndDatePicker = null;

// Initialize Dashboard Date Pickers
document.addEventListener('DOMContentLoaded', () => {
    dashboardStartDatePicker = flatpickr("#dashboard-start-date", {
        dateFormat: "d/m/Y",
        allowInput: true,
        locale: { firstDayOfWeek: 1 },
        formatDate: (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },
        onReady: function(selectedDates, dateStr, instance) {
            const calendar = instance.calendarContainer;
            if (calendar) {
                calendar.style.fontFamily = 'Arial, sans-serif';
                const allElements = calendar.querySelectorAll('*');
                allElements.forEach(el => { el.style.fontFamily = 'Arial, sans-serif'; });
            }
        }
    });

    dashboardEndDatePicker = flatpickr("#dashboard-end-date", {
        dateFormat: "d/m/Y",
        allowInput: true,
        locale: { firstDayOfWeek: 1 },
        formatDate: (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },
        onReady: function(selectedDates, dateStr, instance) {
            const calendar = instance.calendarContainer;
            if (calendar) {
                calendar.style.fontFamily = 'Arial, sans-serif';
                const allElements = calendar.querySelectorAll('*');
                allElements.forEach(el => { el.style.fontFamily = 'Arial, sans-serif'; });
            }
        }
    });
});

// Apply Dashboard Filter
function applyDashboardFilter(filterType) {
    dashboardDateFilter.type = filterType;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let filterText = '';
    
    if (filterType === 'today') {
        dashboardDateFilter.startDate = new Date(today);
        dashboardDateFilter.endDate = new Date(today);
        dashboardDateFilter.endDate.setHours(23, 59, 59, 999);
        filterText = 'ဒီနေ့';
    } else if (filterType === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        dashboardDateFilter.startDate = new Date(yesterday);
        dashboardDateFilter.endDate = new Date(yesterday);
        dashboardDateFilter.endDate.setHours(23, 59, 59, 999);
        filterText = 'မနေ့က';
    } else if (filterType === 'week') {
        const startOfWeek = new Date(today);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        dashboardDateFilter.startDate = new Date(startOfWeek);
        dashboardDateFilter.endDate = new Date(today);
        dashboardDateFilter.endDate.setHours(23, 59, 59, 999);
        filterText = 'ဒီအပတ်';
    } else if (filterType === 'month') {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        dashboardDateFilter.startDate = new Date(startOfMonth);
        dashboardDateFilter.endDate = new Date(today);
        dashboardDateFilter.endDate.setHours(23, 59, 59, 999);
        filterText = 'ဒီလ';
    } else if (filterType === 'custom') {
        const startInput = document.getElementById('dashboard-start-date').value;
        const endInput = document.getElementById('dashboard-end-date').value;
        
        if (!startInput || !endInput) {
            showToast('စတဲ့ရက်နဲ့ ဆုံးရက် နှစ်ခုလုံး ရွေးပါ!', 'warning');
            return;
        }
        
        const startParts = startInput.split('/');
        const endParts = endInput.split('/');
        dashboardDateFilter.startDate = new Date(startParts[2], startParts[1] - 1, startParts[0]);
        dashboardDateFilter.endDate = new Date(endParts[2], endParts[1] - 1, endParts[0]);
        dashboardDateFilter.endDate.setHours(23, 59, 59, 999);
        filterText = `${startInput} မှ ${endInput}`;
    }
    
    // Show filter status
    document.getElementById('dashboard-filter-status').classList.remove('hidden');
    document.getElementById('dashboard-filter-text').textContent = filterText;
    document.getElementById('clear-dashboard-filter').classList.remove('hidden');
    
    updateDashboard();
}

// Clear Dashboard Filter
function clearDashboardFilter() {
    dashboardDateFilter.type = 'all';
    dashboardDateFilter.startDate = null;
    dashboardDateFilter.endDate = null;
    
    document.getElementById('dashboard-filter-status').classList.add('hidden');
    document.getElementById('clear-dashboard-filter').classList.add('hidden');
    
    if (dashboardStartDatePicker) dashboardStartDatePicker.clear();
    if (dashboardEndDatePicker) dashboardEndDatePicker.clear();
    
    updateDashboard();
}

// Check if date is in filter range
function isDateInDashboardFilter(dateStr) {
    if (dashboardDateFilter.type === 'all') return true;
    
    const date = new Date(dateStr);
    return date >= dashboardDateFilter.startDate && date <= dashboardDateFilter.endDate;
}

// Dashboard Functions
function updateDashboard() {
    // Filter debts and payments based on date filter
    const filteredDebts = dashboardDateFilter.type === 'all' 
        ? debts 
        : debts.filter(d => isDateInDashboardFilter(d.createdAt));
    
    const filteredPayments = dashboardDateFilter.type === 'all'
        ? payments
        : payments.filter(p => isDateInDashboardFilter(p.createdAt));
    
    // Total Outstanding Debt (always show all)
    const totalDebt = customers.reduce((sum, customer) => 
        sum + getCustomerTotalDebt(customer.id), 0
    );
    document.getElementById('total-debt').textContent = formatCurrency(totalDebt);

    // Total Customers (always show all)
    document.getElementById('total-customers').textContent = customers.length;

    // Filtered Payments Total
    const paymentsTotal = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    document.getElementById('today-payment').textContent = formatCurrency(paymentsTotal);

    // Filtered Debts Total
    const debtsTotal = filteredDebts.reduce((sum, d) => sum + d.total, 0);
    document.getElementById('month-debt').textContent = formatCurrency(debtsTotal);

    // Update metric labels based on filter
    const paymentLabel = document.querySelector('#today-payment').previousElementSibling;
    const debtLabel = document.querySelector('#month-debt').previousElementSibling;
    
    if (dashboardDateFilter.type === 'all') {
        paymentLabel.textContent = '💵 ဒီနေ့ရငွေ';
        debtLabel.textContent = '📅 လစဉ်အကြွေး';
        
        // Reset to today's payments
        const today = new Date().toDateString();
        const todayPayments = payments.filter(p => 
            new Date(p.createdAt).toDateString() === today
        );
        const todayTotal = todayPayments.reduce((sum, p) => sum + p.amount, 0);
        document.getElementById('today-payment').textContent = formatCurrency(todayTotal);
        
        // Reset to this month's debts
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        const monthDebts = debts.filter(d => {
            const date = new Date(d.createdAt);
            return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
        });
        const monthTotal = monthDebts.reduce((sum, d) => sum + d.total, 0);
        document.getElementById('month-debt').textContent = formatCurrency(monthTotal);
    } else {
        paymentLabel.textContent = '💵 ရငွေ';
        debtLabel.textContent = '📅 အကြွေး';
    }

    // Top Debtors (always show all)
    const debtors = customers.map(c => ({
        ...c,
        debt: getCustomerTotalDebt(c.id)
    })).filter(c => c.debt > 0)
      .sort((a, b) => b.debt - a.debt)
      .slice(0, 5);

    const debtorsList = document.getElementById('top-debtors');
    if (debtors.length === 0) {
        debtorsList.innerHTML = '<div class="text-center text-gray-500 py-4">စာရင်းမရှိသေးပါ</div>';
    } else {
        debtorsList.innerHTML = debtors.map((debtor, index) => `
            <div class="flex items-center justify-between p-3 bg-white border-3 border-black cursor-pointer hover:bg-yellow-50"
                 onclick="showCustomerDetail('${debtor.id}')">
                <div class="flex items-center gap-3">
                    <div class="font-black text-xl w-8">${index + 1}.</div>
                    <div>
                        <div class="font-bold">${debtor.name}</div>
                        <div class="text-xs text-gray-600">${debtor.phone}</div>
                    </div>
                </div>
                <div class="font-black text-red-600">${formatCurrency(debtor.debt)}</div>
            </div>
        `).join('');
    }

    // Filtered Transactions
    const transactionsList = document.getElementById('today-transactions');
    const transactionsTitle = document.getElementById('transactions-title');
    
    if (dashboardDateFilter.type === 'all') {
        transactionsTitle.textContent = '🕐 ဒီနေ့ငွေရှင်းစာရင်း';
        const today = new Date().toDateString();
        const todayPayments = payments.filter(p => 
            new Date(p.createdAt).toDateString() === today
        );
        
        if (todayPayments.length === 0) {
            transactionsList.innerHTML = '<div class="text-center text-gray-500 py-4">စာရင်းမရှိသေးပါ</div>';
        } else {
            transactionsList.innerHTML = todayPayments.map(payment => {
                const customer = customers.find(c => c.id === payment.customerId);
                return `
                    <div class="payment-item bg-green-50 p-3 border-3 border-black">
                        <div class="flex justify-between">
                            <div class="font-bold">${customer ? customer.name : 'Unknown'}</div>
                            <div class="font-black text-green-600">${formatCurrency(payment.amount)}</div>
                        </div>
                        <div class="text-xs text-gray-600 mt-1">
                            ${new Date(payment.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                `;
            }).join('');
        }
    } else {
        transactionsTitle.textContent = '💰 ငွေရှင်းစာရင်း';
        
        if (filteredPayments.length === 0) {
            transactionsList.innerHTML = '<div class="text-center text-gray-500 py-4">စာရင်းမရှိသေးပါ</div>';
        } else {
            transactionsList.innerHTML = filteredPayments.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            ).map(payment => {
                const customer = customers.find(c => c.id === payment.customerId);
                return `
                    <div class="payment-item bg-green-50 p-3 border-3 border-black">
                        <div class="flex justify-between">
                            <div class="font-bold">${customer ? customer.name : 'Unknown'}</div>
                            <div class="font-black text-green-600">${formatCurrency(payment.amount)}</div>
                        </div>
                        <div class="text-xs text-gray-600 mt-1">
                            ${formatDate(payment.createdAt)}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}
