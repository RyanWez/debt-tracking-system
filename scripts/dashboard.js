// Dashboard Functions
function updateDashboard() {
    // Total Outstanding Debt
    const totalDebt = customers.reduce((sum, customer) => 
        sum + getCustomerTotalDebt(customer.id), 0
    );
    document.getElementById('total-debt').textContent = formatCurrency(totalDebt);

    // Total Customers
    document.getElementById('total-customers').textContent = customers.length;

    // Today's Payments
    const today = new Date().toDateString();
    const todayPayments = payments.filter(p => 
        new Date(p.createdAt).toDateString() === today
    );
    const todayTotal = todayPayments.reduce((sum, p) => sum + p.amount, 0);
    document.getElementById('today-payment').textContent = formatCurrency(todayTotal);

    // This Month's Debt
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const monthDebts = debts.filter(d => {
        const date = new Date(d.createdAt);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });
    const monthTotal = monthDebts.reduce((sum, d) => sum + d.total, 0);
    document.getElementById('month-debt').textContent = formatCurrency(monthTotal);

    // Top Debtors
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

    // Today's Transactions
    const transactionsList = document.getElementById('today-transactions');
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
}
