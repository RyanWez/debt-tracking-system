// Settings View Functions
function updateSettingsView() {
    document.getElementById('settings-customers-count').textContent = customers.length;
    document.getElementById('settings-debts-count').textContent = debts.length;
    document.getElementById('settings-payments-count').textContent = payments.length;
}

// Backup Data Function
function backupData() {
    // Check if there's any data to backup
    if (customers.length === 0 && debts.length === 0 && payments.length === 0) {
        showToast('Backup လုပ်ဖို့ Data တစ်ခုမှ မရှိသေးပါ! အရင်ဆုံး Data ထည့်ပါ။', 'error', 4000);
        return;
    }

    try {
        const backupData = {
            customers: customers,
            debts: debts,
            payments: payments,
            backupDate: new Date().toISOString(),
            version: '1.0'
        };

        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        link.download = `bakery-backup-${year}-${month}-${day}-${hours}-${minutes}.json`;
        
        // Force download
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
        
        showToast('Backup ဖိုင် ဒေါင်းလုဒ် လုပ်ပြီးပါပြီ!', 'success');
    } catch (error) {
        showToast('Backup လုပ်တဲ့အခါ အမှားတစ်ခု ဖြစ်ပါတယ်!', 'error');
        console.error('Backup error:', error);
    }
}

// Restore Data Function
let pendingRestoreData = null;

document.getElementById('restore-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is JSON
    if (!file.name.endsWith('.json')) {
        showToast('JSON ဖိုင်သာ ရွေးချယ်ပါ!', 'error');
        e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            
            // Validate the backup data structure
            if (!data.customers || !data.debts || !data.payments) {
                showToast('မှားယွင်းနေတဲ့ Backup ဖိုင် ဖြစ်ပါတယ်!', 'error');
                e.target.value = '';
                return;
            }

            // Validate that they are arrays
            if (!Array.isArray(data.customers) || !Array.isArray(data.debts) || !Array.isArray(data.payments)) {
                showToast('Backup ဖိုင်ထဲက ဒေတာပုံစံ မမှန်ပါ!', 'error');
                e.target.value = '';
                return;
            }

            // Store the data temporarily
            pendingRestoreData = data;

            // Show custom restore modal with backup info
            showRestoreModal(data);
            
        } catch (error) {
            showToast('Backup ဖိုင်ကို ဖတ်လို့ မရပါ! JSON ပုံစံ မမှန်ပါ။', 'error');
            console.error('Restore error:', error);
        }
    };
    
    reader.onerror = () => {
        showToast('ဖိုင်ဖတ်တဲ့အခါ အမှားတစ်ခု ဖြစ်ပါတယ်!', 'error');
    };
    
    reader.readAsText(file);
    e.target.value = ''; // Reset input
});

// Show Restore Modal
function showRestoreModal(data) {
    // Format backup date
    const backupDate = data.backupDate ? 
        new Date(data.backupDate).toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }) : 'Unknown';

    // Update modal content
    document.getElementById('restore-backup-date').textContent = backupDate;
    document.getElementById('restore-customers-count').textContent = data.customers.length;
    document.getElementById('restore-debts-count').textContent = data.debts.length;
    document.getElementById('restore-payments-count').textContent = data.payments.length;

    // Show modal
    document.getElementById('restore-modal').classList.remove('hidden');
}

// Close Restore Modal
function closeRestoreModal() {
    document.getElementById('restore-modal').classList.add('hidden');
    pendingRestoreData = null;
}

// Confirm Restore
function confirmRestore() {
    if (!pendingRestoreData) return;

    try {
        customers = pendingRestoreData.customers;
        debts = pendingRestoreData.debts;
        payments = pendingRestoreData.payments;
        
        saveData();
        updateSettingsView();
        updateDashboard();
        
        closeRestoreModal();
        
        showToast('Restore လုပ်ပြီးပါပြီ! ဒေတာများ ပြန်လည်ရယူပြီးပါပြီ။', 'success');
        
        // Refresh current view
        const activeNav = document.querySelector('.nav-btn.active');
        if (activeNav) {
            const viewName = activeNav.id.replace('nav-', '');
            if (viewName !== 'settings') {
                showView(viewName);
            }
        }
    } catch (error) {
        showToast('Restore လုပ်တဲ့အခါ အမှားတစ်ခု ဖြစ်ပါတယ်!', 'error');
        console.error('Restore error:', error);
    }
}
