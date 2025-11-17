// Customer Functions
document.getElementById('add-customer-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newName = document.getElementById('customer-name').value.trim();
    const newPhone = document.getElementById('customer-phone').value.trim();
    
    // Check for duplicate name
    const existingCustomer = customers.find(c => c.name.toLowerCase() === newName.toLowerCase());
    if (existingCustomer) {
        showToast('ရှိပြီးသားပါ! ဒီဖောက်သည်ကို အရင်က ထည့်ထားပြီးပါပြီ', 'warning');
        return;
    }
    
    const customer = {
        id: generateId(),
        name: newName,
        phone: newPhone,
        createdAt: new Date().toISOString()
    };

    customers.push(customer);
    saveData();
    
    e.target.reset();
    renderCustomers();
    populateCustomerSelects();
    showToast('ဖောက်သည်အသစ် ထည့်ပြီးပါပြီ!', 'success');
});

function renderCustomers(searchTerm = '') {
    const list = document.getElementById('customer-list');
    let filteredCustomers = customers;

    if (searchTerm) {
        filteredCustomers = customers.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.phone.includes(searchTerm)
        );
    }

    if (filteredCustomers.length === 0) {
        list.innerHTML = '<div class="text-center p-8 text-gray-500 font-bold">စာရင်းမရှိသေးပါ</div>';
        return;
    }

    list.innerHTML = filteredCustomers.map(customer => {
        const debt = getCustomerTotalDebt(customer.id);
        const bgColor = debt > 0 ? 'bg-red-100' : 'bg-green-100';
        
        return `
            <div class="brutalist-card ${bgColor} p-4 cursor-pointer"
                 onclick="showCustomerDetail('${customer.id}')">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <div class="font-black text-lg">${customer.name}</div>
                        <div class="font-bold text-sm text-gray-700">📞 ${customer.phone}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs font-bold">ကြွေးကျန်</div>
                        <div class="text-lg font-black ${debt > 0 ? 'text-red-600' : 'text-green-600'}">
                            ${formatCurrency(debt)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

document.getElementById('customer-search').addEventListener('input', (e) => {
    renderCustomers(e.target.value);
});

function populateCustomerSelects() {
    // Dropdowns are now populated dynamically on click
    // This function is kept for compatibility
}
