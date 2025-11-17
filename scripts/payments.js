// Initialize Flatpickr for payment date
let paymentDatePicker = null;
let editPaymentDatePicker = null;

document.addEventListener('DOMContentLoaded', () => {
    // Add Payment Date Picker
    paymentDatePicker = flatpickr("#payment-date", {
        dateFormat: "d/m/Y",
        defaultDate: null,
        allowInput: true,
        locale: {
            firstDayOfWeek: 1
        },
        // Force English numbers
        formatDate: (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },
        onReady: function(selectedDates, dateStr, instance) {
            // Force Arial font on all calendar elements after creation
            const calendar = instance.calendarContainer;
            if (calendar) {
                calendar.style.fontFamily = 'Arial, sans-serif';
                const allElements = calendar.querySelectorAll('*');
                allElements.forEach(el => {
                    el.style.fontFamily = 'Arial, sans-serif';
                });
            }
        },
        onOpen: function(selectedDates, dateStr, instance) {
            // Force Arial font when calendar opens
            const calendar = instance.calendarContainer;
            if (calendar) {
                const yearInput = calendar.querySelector('.cur-year');
                if (yearInput) {
                    yearInput.style.fontFamily = 'Arial, sans-serif';
                }
            }
        }
    });

    // Edit Payment Date Picker
    editPaymentDatePicker = flatpickr("#edit-payment-date", {
        dateFormat: "d/m/Y",
        allowInput: true,
        locale: {
            firstDayOfWeek: 1
        },
        // Force English numbers
        formatDate: (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },
        onReady: function(selectedDates, dateStr, instance) {
            // Force Arial font on all calendar elements after creation
            const calendar = instance.calendarContainer;
            if (calendar) {
                calendar.style.fontFamily = 'Arial, sans-serif';
                const allElements = calendar.querySelectorAll('*');
                allElements.forEach(el => {
                    el.style.fontFamily = 'Arial, sans-serif';
                });
            }
        },
        onOpen: function(selectedDates, dateStr, instance) {
            // Force Arial font when calendar opens
            const calendar = instance.calendarContainer;
            if (calendar) {
                const yearInput = calendar.querySelector('.cur-year');
                if (yearInput) {
                    yearInput.style.fontFamily = 'Arial, sans-serif';
                }
            }
        }
    });
});

// Payment Functions
document.getElementById('payment-customer').addEventListener('change', (e) => {
    const customerId = e.target.value;
    if (customerId) {
        const debt = getCustomerTotalDebt(customerId);
        document.getElementById('remaining-debt').textContent = formatCurrency(debt);
        document.getElementById('customer-debt-info').classList.remove('hidden');
    } else {
        document.getElementById('customer-debt-info').classList.add('hidden');
    }
});

document.getElementById('add-payment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const customerId = document.getElementById('payment-customer').value;
    const amountValue = document.getElementById('payment-amount').value;
    const amount = parseInt(amountValue, 10);
    const dateInput = document.getElementById('payment-date').value;

    if (!customerId) {
        showToast('ဖောက်သည်ကို အရင်ရွေးပြီးမှ ငွေရှင်းမှတ်ပါ။', 'warning');
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        showToast('ပေးမယ့်ပမာဏကို မှန်ကန်အောင် ထည့်ပေးပါ။', 'warning');
        return;
    }

    const remainingDebt = getCustomerTotalDebt(customerId);

    if (remainingDebt <= 0) {
        showToast('ဒီဖောက်သည်မှာ ပေးရန်ကြွေး မရှိတော့ပါ!', 'info');
        return;
    }

    if (amount > remainingDebt) {
        showToast('ရှင်းတဲ့ငွေက ကြွေးကျန်ထက်များနေပါတယ်!', 'warning');
        return;
    }

    // Determine date: use selected date or default to today
    let paymentDate;
    if (dateInput) {
        // Parse the date from flatpickr (format: dd/mm/yyyy)
        const parts = dateInput.split('/');
        paymentDate = new Date(parts[2], parts[1] - 1, parts[0]);
    } else {
        // Default to today
        paymentDate = new Date();
    }

    const payment = {
        id: generateId(),
        customerId,
        amount,
        createdAt: paymentDate.toISOString()
    };

    payments.push(payment);
    saveData();
    
    e.target.reset();
    if (paymentDatePicker) paymentDatePicker.clear();
    document.getElementById('customer-debt-info').classList.add('hidden');
    renderRecentPayments(document.getElementById('payment-search') ? document.getElementById('payment-search').value : '');
    updateDashboard();
    showToast('ငွေရှင်းတာ သိမ်းပြီးပါပြီ!', 'success');
});

document.getElementById('payment-search').addEventListener('input', (e) => {
    renderRecentPayments(e.target.value);
});

let currentPaymentId = null;

function openPaymentEditModal(paymentId) {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    currentPaymentId = paymentId;
    const customer = customers.find(c => c.id === payment.customerId);
    document.getElementById('edit-payment-id').value = payment.id;
    document.getElementById('edit-payment-customer-name').textContent = customer ? customer.name : 'Unknown';
    document.getElementById('edit-payment-amount').value = payment.amount;

    // Set the date in flatpickr
    if (editPaymentDatePicker && payment.createdAt) {
        const paymentDate = new Date(payment.createdAt);
        editPaymentDatePicker.setDate(paymentDate, true);
    }

    document.getElementById('edit-payment-modal').classList.remove('hidden');
}

function closeEditPaymentModal() {
    document.getElementById('edit-payment-modal').classList.add('hidden');
    currentPaymentId = null;
}

document.getElementById('edit-payment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const paymentId = document.getElementById('edit-payment-id').value;
    const index = payments.findIndex(p => p.id === paymentId);
    if (index === -1) return;

    const newAmount = parseInt(document.getElementById('edit-payment-amount').value) || 0;
    const dateInput = document.getElementById('edit-payment-date').value;
    
    payments[index].amount = newAmount;
    
    // Update date if changed
    if (dateInput) {
        const parts = dateInput.split('/');
        const paymentDate = new Date(parts[2], parts[1] - 1, parts[0]);
        payments[index].createdAt = paymentDate.toISOString();
    }

    saveData();
    closeEditPaymentModal();
    renderRecentPayments(document.getElementById('payment-search').value || '');
    updateDashboard();
    showToast('ပြန်ဆပ်ငွေမှတ်တမ်း ပြင်ဆင်ပြီးပါပြီ!', 'success');
});

function openPaymentDeleteModal(paymentId) {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    currentPaymentId = paymentId;
    const customer = customers.find(c => c.id === payment.customerId);
    const summaryEl = document.getElementById('delete-payment-summary');
    summaryEl.innerHTML = `
        <div class="font-black mb-1">${customer ? customer.name : 'Unknown'}</div>
        <div class="font-black text-green-600 mb-1">${formatCurrency(payment.amount)}</div>
        <div class="text-xs text-gray-600">${formatDate(payment.createdAt)}</div>
    `;

    document.getElementById('delete-payment-modal').classList.remove('hidden');
}

function closeDeletePaymentModal() {
    document.getElementById('delete-payment-modal').classList.add('hidden');
    currentPaymentId = null;
}

function confirmDeletePayment() {
    if (!currentPaymentId) return;
    payments = payments.filter(p => p.id !== currentPaymentId);
    saveData();
    closeDeletePaymentModal();
    renderRecentPayments(document.getElementById('payment-search').value || '');
    updateDashboard();
    showToast('ပြန်ဆပ်ငွေမှတ်တမ်း ဖျက်ပြီးပါပြီ!', 'info');
    currentPaymentId = null;
}

function renderRecentPayments(searchTerm = '') {
    const list = document.getElementById('recent-payments');
    let recentPayments = payments.slice().sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    if (searchTerm) {
        recentPayments = recentPayments.filter(payment => {
            const customer = customers.find(c => c.id === payment.customerId);
            const name = customer ? customer.name.toLowerCase() : '';
            return name.includes(searchTerm.toLowerCase());
        });
    }

    if (recentPayments.length === 0) {
        list.innerHTML = '<div class="text-center p-8 text-gray-500 font-bold">စာရင်းမရှိသေးပါ</div>';
        return;
    }

    list.innerHTML = recentPayments.map(payment => {
        const customer = customers.find(c => c.id === payment.customerId);
        return `
            <div class="payment-item bg-green-50 p-4 border-3 border-black">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <div class="font-black">${customer ? customer.name : 'Unknown'}</div>
                        <div class="text-xs text-gray-600 mt-1">${formatDate(payment.createdAt)}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-xl font-black text-green-600">${formatCurrency(payment.amount)}</div>
                    </div>
                </div>
                <div class="flex justify-end gap-2 text-xs font-bold">
                    <button class="brutalist-btn bg-blue-500 text-white px-3 py-1" onclick="openPaymentEditModal('${payment.id}')">Edit</button>
                    <button class="brutalist-btn bg-red-500 text-white px-3 py-1" onclick="openPaymentDeleteModal('${payment.id}')">Del</button>
                </div>
            </div>
        `;
    }).join('');
}
