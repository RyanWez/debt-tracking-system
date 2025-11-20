// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US').format(amount) + ' Ks';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'ဒီနေ့ ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'မနေ့က';
    } else {
        return date.toLocaleDateString('en-GB');
    }
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Toast Notification System
function showToast(message, type = 'success', duration = 2000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-message">${message}</div>
        <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, duration);
}

async function syncVersionFromSW() {
    try {
        const response = await fetch('./sw.js?t=' + new Date().getTime());
        const text = await response.text();
        const match = text.match(/const CACHE_NAME = 'debt-tracker-v(\d+\.\d+\.\d+)';/);

        if (match && match[1]) {
            const version = match[1];
            const sidebarVersion = document.getElementById('sidebar-version');
            const modalVersion = document.getElementById('modal-version-text');

            if (sidebarVersion) {
                sidebarVersion.textContent = `App Version: v${version}`;
            }

            if (modalVersion) {
                modalVersion.textContent = `Version v${version} is available.`;
            }
        }
    } catch (error) {
        console.error('Failed to sync version from SW:', error);
    }
}

document.addEventListener('DOMContentLoaded', syncVersionFromSW);
