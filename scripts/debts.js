// Initialize Flatpickr for debt date
let debtDatePicker = null;
let editDebtDatePicker = null;

document.addEventListener('DOMContentLoaded', () => {
    // Add Debt Date Picker
    debtDatePicker = flatpickr("#debt-date", {
        dateFormat: "d/m/Y",
        defaultDate: null,
        allowInput: true,
        locale: {
            firstDayOfWeek: 1
        }
    });

    // Edit Debt Date Picker
    editDebtDatePicker = flatpickr("#edit-debt-date", {
        dateFormat: "d/m/Y",
        allowInput: true,
        locale: {
            firstDayOfWeek: 1
        }
    });
});

// Debt Functions
document.getElementById('add-debt-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const customerId = document.getElementById('debt-customer').value;
    const item = document.getElementById('debt-item').value.trim();
    const amountValue = document.getElementById('debt-amount').value;
    const amount = parseInt(amountValue, 10);
    const dateInput = document.getElementById('debt-date').value;

    if (!customerId) {
        showToast('ဖောက်သည်ကို အရင်ရွေးပါ၊ ပြီးမှ အကြွေးမှတ်နိုင်ပါတယ်။', 'warning');
        return;
    }

    if (!item) {
        showToast('ဘာပစ္စည်း အကြွေးထားတယ်ဆိုတာ မှတ်စုထည့်ပါ။', 'warning');
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        showToast('ပမာဏကို မှန်ကန်အောင် ထည့်ပေးပါ။', 'warning');
        return;
    }
    
    // Determine date: use selected date or default to today
    let debtDate;
    if (dateInput) {
        // Parse the date from flatpickr (format: dd/mm/yyyy)
        const parts = dateInput.split('/');
        debtDate = new Date(parts[2], parts[1] - 1, parts[0]);
    } else {
        // Default to today
        debtDate = new Date();
    }
    
    const debt = {
        id: generateId(),
        customerId,
        item,
        total: amount,
        createdAt: debtDate.toISOString()
    };

    debts.push(debt);
    saveData();
    
    e.target.reset();
    if (debtDatePicker) debtDatePicker.clear();
    resetCustomDropdowns();
    renderRecentDebts(document.getElementById('debt-search') ? document.getElementById('debt-search').value : '');
    updateDashboard();
    showToast('အကြွေးစာရင်း သိမ်းပြီးပါပြီ!', 'success');
});

document.getElementById('debt-search').addEventListener('input', (e) => {
    renderRecentDebts(e.target.value);
});

let currentDebtId = null;

function openDebtEditModal(debtId) {
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;

    currentDebtId = debtId;
    const customer = customers.find(c => c.id === debt.customerId);
    document.getElementById('edit-debt-id').value = debt.id;
    document.getElementById('edit-debt-customer-name').textContent = customer ? customer.name : 'Unknown';
    document.getElementById('edit-debt-item').value = debt.item;
    document.getElementById('edit-debt-amount').value = debt.total;

    // Set the date in flatpickr
    if (editDebtDatePicker && debt.createdAt) {
        const debtDate = new Date(debt.createdAt);
        editDebtDatePicker.setDate(debtDate, true);
    }

    document.getElementById('edit-debt-modal').classList.remove('hidden');
}

function closeEditDebtModal() {
    document.getElementById('edit-debt-modal').classList.add('hidden');
    currentDebtId = null;
}

document.getElementById('edit-debt-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const debtId = document.getElementById('edit-debt-id').value;
    const index = debts.findIndex(d => d.id === debtId);
    if (index === -1) return;

    const dateInput = document.getElementById('edit-debt-date').value;
    
    debts[index].item = document.getElementById('edit-debt-item').value;
    debts[index].total = parseInt(document.getElementById('edit-debt-amount').value) || 0;
    
    // Update date if changed
    if (dateInput) {
        const parts = dateInput.split('/');
        const debtDate = new Date(parts[2], parts[1] - 1, parts[0]);
        debts[index].createdAt = debtDate.toISOString();
    }

    saveData();
    closeEditDebtModal();
    renderRecentDebts(document.getElementById('debt-search').value || '');
    updateDashboard();
    showToast('အကြွေးစာရင်း ပြင်ဆင်ပြီးပါပြီ!', 'success');
});

function openDebtDeleteModal(debtId) {
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;

    currentDebtId = debtId;
    const customer = customers.find(c => c.id === debt.customerId);
    const summaryEl = document.getElementById('delete-debt-summary');
    summaryEl.innerHTML = `
        <div class="font-black mb-1">${customer ? customer.name : 'Unknown'}</div>
        <div class="font-bold text-sm mb-1">${debt.item}</div>
        <div class="font-black text-red-600 mb-1">${formatCurrency(debt.total)}</div>
        <div class="text-xs text-gray-600">${formatDate(debt.createdAt)}</div>
    `;

    document.getElementById('delete-debt-modal').classList.remove('hidden');
}

function closeDeleteDebtModal() {
    document.getElementById('delete-debt-modal').classList.add('hidden');
    currentDebtId = null;
}

function confirmDeleteDebt() {
    if (!currentDebtId) return;
    debts = debts.filter(d => d.id !== currentDebtId);
    saveData();
    closeDeleteDebtModal();
    renderRecentDebts(document.getElementById('debt-search').value || '');
    updateDashboard();
    showToast('အကြွေးမှတ်တမ်း ဖျက်ပြီးပါပြီ!', 'info');
    currentDebtId = null;
}

function renderRecentDebts(searchTerm = '') {
    const list = document.getElementById('recent-debts');

    let filteredDebts = debts.slice().sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    if (searchTerm) {
        filteredDebts = filteredDebts.filter(debt => {
            const customer = customers.find(c => c.id === debt.customerId);
            const name = customer ? customer.name.toLowerCase() : '';
            return name.includes(searchTerm.toLowerCase());
        });
    }

    if (filteredDebts.length === 0) {
        list.innerHTML = '<div class="text-center p-8 text-gray-500 font-bold">စာရင်းမရှိသေးပါ</div>';
        return;
    }

    list.innerHTML = filteredDebts.map(debt => {
        const customer = customers.find(c => c.id === debt.customerId);
        return `
            <div class="debt-item bg-red-50 p-4 border-3 border-black">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <div class="font-black">${customer ? customer.name : 'Unknown'}</div>
                        <div class="text-xs text-gray-600 mt-1">${formatDate(debt.createdAt)}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-xl font-black text-red-600">${formatCurrency(debt.total)}</div>
                    </div>
                </div>
                <div class="font-bold text-sm mb-2">${debt.item}</div>
                <div class="flex justify-end gap-2 text-xs font-bold">
                    <button class="brutalist-btn bg-blue-500 text-white px-3 py-1" onclick="openDebtEditModal('${debt.id}')">Edit</button>
                    <button class="brutalist-btn bg-red-500 text-white px-3 py-1" onclick="openDebtDeleteModal('${debt.id}')">Del</button>
                </div>
            </div>
        `;
    }).join('');
}
