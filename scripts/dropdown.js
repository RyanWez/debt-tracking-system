// Custom Dropdown Functions
function initCustomDropdowns() {
    // Debt Customer Dropdown
    const debtBtn = document.getElementById('debt-customer-btn');
    const debtPanel = document.getElementById('debt-customer-panel');
    const debtSearch = document.getElementById('debt-customer-search');
    const debtList = document.getElementById('debt-customer-list');
    const debtInput = document.getElementById('debt-customer');
    const debtText = document.getElementById('debt-customer-text');
    const debtArrow = debtBtn.querySelector('.dropdown-arrow');

    // Payment Customer Dropdown
    const paymentBtn = document.getElementById('payment-customer-btn');
    const paymentPanel = document.getElementById('payment-customer-panel');
    const paymentSearch = document.getElementById('payment-customer-search');
    const paymentList = document.getElementById('payment-customer-list');
    const paymentInput = document.getElementById('payment-customer');
    const paymentText = document.getElementById('payment-customer-text');
    const paymentArrow = paymentBtn.querySelector('.dropdown-arrow');

    // Toggle Debt Dropdown
    debtBtn.addEventListener('click', () => {
        const isOpen = debtPanel.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) {
            debtBtn.classList.add('open');
            debtPanel.classList.add('open');
            debtArrow.classList.add('open');
            renderCustomerDropdown('debt');
            setTimeout(() => debtSearch.focus(), 100);
        }
    });

    // Toggle Payment Dropdown
    paymentBtn.addEventListener('click', () => {
        const isOpen = paymentPanel.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) {
            paymentBtn.classList.add('open');
            paymentPanel.classList.add('open');
            paymentArrow.classList.add('open');
            renderCustomerDropdown('payment');
            setTimeout(() => paymentSearch.focus(), 100);
        }
    });

    // Search functionality for debt
    debtSearch.addEventListener('input', () => {
        renderCustomerDropdown('debt', debtSearch.value);
    });

    // Search functionality for payment
    paymentSearch.addEventListener('input', () => {
        renderCustomerDropdown('payment', paymentSearch.value);
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-dropdown')) {
            closeAllDropdowns();
        }
    });
}

function closeAllDropdowns() {
    document.querySelectorAll('.custom-dropdown-button').forEach(btn => {
        btn.classList.remove('open');
    });
    document.querySelectorAll('.custom-dropdown-panel').forEach(panel => {
        panel.classList.remove('open');
    });
    document.querySelectorAll('.dropdown-arrow').forEach(arrow => {
        arrow.classList.remove('open');
    });
}

function renderCustomerDropdown(type, searchTerm = '') {
    const listEl = type === 'debt' ? 
        document.getElementById('debt-customer-list') : 
        document.getElementById('payment-customer-list');

    let filteredCustomers = customers;
    
    if (searchTerm) {
        filteredCustomers = customers.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.phone.includes(searchTerm)
        );
    }

    if (filteredCustomers.length === 0) {
        listEl.innerHTML = '<div class="p-4 text-center text-gray-500 font-bold">မတွေ့ပါ</div>';
        return;
    }

    const currentValue = type === 'debt' ? 
        document.getElementById('debt-customer').value : 
        document.getElementById('payment-customer').value;

    listEl.innerHTML = filteredCustomers.map(customer => `
        <div class="custom-dropdown-item ${customer.id === currentValue ? 'selected' : ''}" 
             data-id="${customer.id}" 
             data-name="${customer.name}"
             data-type="${type}">
            <div class="font-bold">${customer.name}</div>
            <div class="text-xs text-gray-600">📞 ${customer.phone}</div>
        </div>
    `).join('');

    // Add click listeners
    listEl.querySelectorAll('.custom-dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            selectCustomer(
                item.dataset.type,
                item.dataset.id,
                item.dataset.name
            );
        });
    });
}

function selectCustomer(type, customerId, customerName) {
    if (type === 'debt') {
        document.getElementById('debt-customer').value = customerId;
        document.getElementById('debt-customer-text').textContent = customerName;
        document.getElementById('debt-customer-btn').classList.remove('empty');
        document.getElementById('debt-customer-search').value = '';
    } else {
        document.getElementById('payment-customer').value = customerId;
        document.getElementById('payment-customer-text').textContent = customerName;
        document.getElementById('payment-customer-btn').classList.remove('empty');
        document.getElementById('payment-customer-search').value = '';
        
        // Trigger debt info update
        const debt = getCustomerTotalDebt(customerId);
        document.getElementById('remaining-debt').textContent = formatCurrency(debt);
        document.getElementById('customer-debt-info').classList.remove('hidden');
    }
    
    closeAllDropdowns();
}

function resetCustomDropdowns() {
    // Reset debt dropdown
    document.getElementById('debt-customer').value = '';
    document.getElementById('debt-customer-text').textContent = 'ဖောက်သည်ရွေးပါ';
    document.getElementById('debt-customer-btn').classList.add('empty');
    document.getElementById('debt-customer-search').value = '';
    
    // Reset payment dropdown
    document.getElementById('payment-customer').value = '';
    document.getElementById('payment-customer-text').textContent = 'ဖောက်သည်ရွေးပါ';
    document.getElementById('payment-customer-btn').classList.add('empty');
    document.getElementById('payment-customer-search').value = '';
}

// Update form reset handlers
document.getElementById('add-debt-form').addEventListener('reset', resetCustomDropdowns);
document.getElementById('add-payment-form').addEventListener('reset', resetCustomDropdowns);
