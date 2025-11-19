// Customer Detail Modal
function showCustomerDetail(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    document.getElementById('modal-customer-name').textContent = customer.name;
    document.getElementById('modal-customer-phone').textContent = customer.phone;
    
    const totalDebt = getCustomerTotalDebt(customerId);
    document.getElementById('modal-total-debt').textContent = formatCurrency(totalDebt);

    const customerDebts = debts.filter(d => d.customerId === customerId).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    const customerPayments = payments.filter(p => p.customerId === customerId).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    document.getElementById('modal-debts').innerHTML = customerDebts.length > 0 ? 
        customerDebts.map(debt => `
            <div class="debt-item bg-red-50 p-3 border-3 border-black">
                <div class="flex justify-between">
                    <div class="font-bold">${debt.item}</div>
                    <div class="font-black text-red-600">${formatCurrency(debt.total)}</div>
                </div>
                <div class="text-xs mt-1 text-gray-600">
                    ${formatDate(debt.createdAt)}
                </div>
            </div>
        `).join('') : '<div class="text-center text-gray-500 py-4">အကြွေးယူမှုမရှိသေးပါ</div>';

    document.getElementById('modal-payments').innerHTML = customerPayments.length > 0 ?
        customerPayments.map(payment => `
            <div class="payment-item bg-green-50 p-3 border-3 border-black">
                <div class="flex justify-between">
                    <div class="font-bold">ပြန်ဆပ်ငွေ</div>
                    <div class="font-black text-green-600">${formatCurrency(payment.amount)}</div>
                </div>
                <div class="text-xs mt-1 text-gray-600">${formatDate(payment.createdAt)}</div>
            </div>
        `).join('') : '<div class="text-center text-gray-500 py-4">ပြန်ဆပ်တာမရှိသေးပါ</div>';

    document.getElementById('customer-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('customer-modal').classList.add('hidden');
}

// Edit Customer Functions
let currentCustomerId = null;

function editCustomer() {
    const customerName = document.getElementById('modal-customer-name').textContent;
    const customerPhone = document.getElementById('modal-customer-phone').textContent;
    
    const customer = customers.find(c => c.name === customerName && c.phone === customerPhone);
    if (!customer) return;
    
    currentCustomerId = customer.id;
    document.getElementById('edit-customer-id').value = customer.id;
    document.getElementById('edit-customer-name').value = customer.name;
    document.getElementById('edit-customer-phone').value = customer.phone;
    
    document.getElementById('edit-modal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
    currentCustomerId = null;
}

document.getElementById('edit-customer-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const customerId = document.getElementById('edit-customer-id').value;
    const customerIndex = customers.findIndex(c => c.id === customerId);
    
    if (customerIndex === -1) return;
    
    customers[customerIndex].name = document.getElementById('edit-customer-name').value;
    customers[customerIndex].phone = document.getElementById('edit-customer-phone').value;
    
    saveData();
    closeEditModal();
    
    // Refresh the customer detail modal
    showCustomerDetail(customerId);
    
    // Refresh lists
    renderCustomers();
    populateCustomerSelects();
    updateDashboard();
    
    showToast('ဖောက်သည်အချက်အလက် ပြင်ဆင်ပြီးပါပြီ!', 'success');
});

// Delete Customer Functions
function deleteCustomer() {
    const customerName = document.getElementById('modal-customer-name').textContent;
    const customerPhone = document.getElementById('modal-customer-phone').textContent;
    
    const customer = customers.find(c => c.name === customerName && c.phone === customerPhone);
    if (!customer) return;
    
    // Check if customer has outstanding debt
    const customerDebt = getCustomerTotalDebt(customer.id);
    if (customerDebt > 0) {
        showToast('အကြွေးပေးရန် ကျန်နေသေးတဲ့အတွက် ဖျက်လို့ မရပါ!', 'error', 4000);
        return;
    }
    
    currentCustomerId = customer.id;
    document.getElementById('delete-customer-name').textContent = customer.name;
    document.getElementById('delete-customer-phone').textContent = customer.phone;
    
    document.getElementById('delete-modal').classList.remove('hidden');
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.add('hidden');
    currentCustomerId = null;
}

function confirmDelete() {
    if (!currentCustomerId) return;
    
    // PIN verification for sensitive action
    showPINVerification(() => {
        // Remove customer
        customers = customers.filter(c => c.id !== currentCustomerId);
        
        // Remove all debts for this customer
        debts = debts.filter(d => d.customerId !== currentCustomerId);
        
        // Remove all payments for this customer
        payments = payments.filter(p => p.customerId !== currentCustomerId);
        
        saveData();
        closeDeleteModal();
        closeModal();
        
        // Refresh all displays
        renderCustomers();
        populateCustomerSelects();
        updateDashboard();
        
        showToast('ဖောက်သည်နှင့် သူနဲ့ပတ်သက်သော မှတ်တမ်းများကို ဖျက်ပြီးပါပြီ!', 'info');
        currentCustomerId = null;
    });
}
