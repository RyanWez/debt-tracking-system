# Bakery Debt Tracker - Project Structure

## 📁 File Organization

### Main Files
- **index.html** - Main HTML file with all the markup and structure

### 📂 styles/ - CSS Files
- **fonts.css** - Font imports and typography
- **animations.css** - All animation keyframes and classes
- **brutalist.css** - Neo-brutalist design system styles
- **gradients.css** - Color gradient definitions
- **scrollbar.css** - Custom scrollbar styling
- **toast.css** - Toast notification styles
- **dropdown.css** - Custom dropdown component styles
- **responsive.css** - Mobile responsive breakpoints

### 📂 scripts/ - JavaScript Files
- **utils.js** - Utility functions (formatCurrency, formatDate, showToast, etc.)
- **storage.js** - LocalStorage management and data operations
- **customers.js** - Customer CRUD operations
- **debts.js** - Debt management functions
- **payments.js** - Payment tracking functions
- **dashboard.js** - Dashboard metrics and display
- **modals.js** - Modal dialogs (view, edit, delete)
- **dropdown.js** - Custom dropdown functionality
- **settings.js** - Backup/restore and settings
- **app.js** - Main app initialization and navigation

## 🚀 How to Use

1. Open `index.html` in a web browser
2. All CSS and JavaScript files are automatically loaded
3. Data is stored in browser's localStorage

## 📝 Features

- ✅ Customer management
- ✅ Debt tracking
- ✅ Payment recording
- ✅ Dashboard with metrics
- ✅ Backup & restore functionality
- ✅ Mobile responsive design
- ✅ Neo-brutalist UI design

## 🔧 Development

The project is now modular and easy to maintain:
- CSS is organized by functionality
- JavaScript is split by feature/component
- Easy to add new features or modify existing ones
