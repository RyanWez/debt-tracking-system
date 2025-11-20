# 🧾 Debt Tracking System

<div align="center">

![Debt Tracking System](https://img.shields.io/badge/Version-1.0.0-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**ကြွေးစာရင်း မှတ်တမ်း စီမံခန့်ခွဲမှု စနစ်**

[Live Demo](https://ryanwez.github.io/debt-tracking-system) • [Report Bug](https://github.com/RyanWezLive/debt-tracking-system/issues) • [Request Feature](https://github.com/RyanWezLive/debt-tracking-system/issues)

</div>

---

## 📖 About The Project

Debt Tracking System သည် အရောင်းဆိုင်များ၊ ဆိုင်ငယ်များအတွက် ဖောက်သည်များ၏ ကြွေးစာရင်းများကို လွယ်ကူစွာ မှတ်တမ်းတင်ပြီး စီမံခန့်ခွဲနိုင်ရန် ဖန်တီးထားသော Web Application တစ်ခုဖြစ်ပါတယ်။ Neo-Brutalist Design Style ဖြင့် ဒီဇိုင်းထုတ်ထားပြီး Mobile-First Responsive ဖြစ်ပါတယ်။

### ✨ Key Features

- 👥 **ဖောက်သည် စီမံခန့်ခွဲမှု** - ဖောက်သည်များကို ထည့်သွင်း၊ ပြင်ဆင်၊ ဖျက်ပစ်နိုင်ပါတယ်
- 📝 **ကြွေးမှတ်တမ်း** - ကြွေးယူမှုများကို အသေးစိတ် မှတ်တမ်းတင်နိုင်ပါတယ်
- 💰 **ငွေရှင်းစာရင်း** - ငွေပေးချေမှုများကို လွယ်ကူစွာ မှတ်သားနိုင်ပါတယ်
- 📊 **Dashboard** - အကြွေးစုစုပေါင်း၊ ဒီနေ့ရငွေ၊ လစဉ်အကြွေး စသည့် Metrics များ
- 🔐 **PIN Security** - App ကို PIN နံပါတ်ဖြင့် လုံခြုံစွာ ပိတ်ထားနိုင်ပါတယ်
- 💾 **Backup & Restore** - ဒေတာများကို JSON ဖိုင်အဖြစ် သိမ်းဆည်းပြီး ပြန်လည်ရယူနိုင်ပါတယ်
- 📱 **Mobile Responsive** - မိုဘိုင်းဖုန်းများတွင် အသုံးပြုရန် အထူးပြုလုပ်ထားပါတယ်
- ⚡ **PWA Capable** - အင်တာနက်မရှိဘဲ အသုံးပြုနိုင်ပြီး ဖုန်းတွင် Install လုပ်နိုင်ပါတယ်
- 🎨 **Neo-Brutalist Design** - ခေတ်မီပြီး အသုံးပြုရလွယ်ကူသော UI/UX
- 💾 **LocalStorage** - Browser တွင် ဒေတာများကို သိမ်းဆည်းထားပါတယ် (Server မလိုပါ)
- 🔍 **Search & Filter** - ဖောက်သည်များ၊ ကြွေးစာရင်းများကို လွယ်ကူစွာ ရှာဖွေနိုင်ပါတယ်

---

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation required!

### Installation

#### PWA Installation
Browser ၏ menu မှ "Add to Home Screen" သို့မဟုတ် "Install App" ကို နှိပ်ပြီး ဖုန်းတွင် Application တစ်ခုကဲ့သို့ အသုံးပြုနိုင်ပါသည်။

#### Local Development

1. Clone the repository
```bash
git clone https://github.com/RyanWezLive/debt-tracking-system.git
```

2. Navigate to the project directory
```bash
cd debt-tracking-system
```

3. Open `index.html` in your browser
```bash
# Or simply double-click index.html
```

### Usage

1. **ဖောက်သည်များ ထည့်ရန်** - "ဖောက်သည်များ" tab သို့သွားပြီး အသစ်ထည့်ပါ
2. **ကြွေးမှတ်ရန်** - "ကြွေးမှတ်ရန်" tab တွင် ဖောက်သည်ရွေးပြီး ကြွေးအသေးစိတ်ထည့်ပါ
3. **ငွေရှင်းရန်** - "ငွေရှင်းရန်" tab တွင် ဖောက်သည်ရွေးပြီး ပေးချေမှုမှတ်ပါ
4. **Dashboard ကြည့်ရန်** - "ပင်မစာမျက်နှာ" တွင် အကြွေးစာရင်းများကို အနှစ်ချုပ်ကြည့်ပါ
5. **Backup လုပ်ရန်** - "Settings" tab တွင် Backup လုပ်နိုင်ပါတယ်

---

## 📁 Project Structure

```
debt-tracking-system/
├── index.html              # Main HTML file
├── sw.js                  # Service Worker (PWA)
├── site.webmanifest       # PWA Manifest
├── styles/                 # CSS files
│   ├── fonts.css          # Typography
│   ├── animations.css     # Animations
│   ├── brutalist.css      # Neo-brutalist styles
│   ├── gradients.css      # Color gradients
│   ├── scrollbar.css      # Custom scrollbar
│   ├── toast.css          # Toast notifications
│   ├── dropdown.css       # Dropdown components
│   ├── datepicker.css     # Date picker styles
│   ├── pin.css            # PIN lock styles
│   └── responsive.css     # Mobile responsive
├── scripts/               # JavaScript files
│   ├── utils.js          # Utility functions
│   ├── storage.js        # Data management
│   ├── customers.js      # Customer operations
│   ├── debts.js          # Debt tracking
│   ├── payments.js       # Payment handling
│   ├── dashboard.js      # Dashboard metrics
│   ├── modals.js         # Modal dialogs
│   ├── dropdown.js       # Dropdown logic
│   ├── settings.js       # Backup/restore
│   ├── pin.js            # PIN logic
│   ├── pin-ui.js         # PIN UI handling
│   └── app.js            # Main app
├── LICENSE               # MIT License
└── README.md            # This file
```

---

## 🛠️ Built With

- **HTML5** - Markup structure
- **CSS3** - Styling and animations
- **JavaScript (Vanilla)** - Application logic
- **TailwindCSS CDN** - Utility-first CSS framework
- **LocalStorage API** - Client-side data storage
- **Service Worker** - Offline functionality
- **Flatpickr** - Date picker component

---

## 🎨 Design Philosophy

ဒီ project သည် **Neo-Brutalism Design** style ကို အသုံးပြုထားပါတယ်:

- ✅ Bold borders and shadows
- ✅ Vibrant color gradients
- ✅ Clear typography
- ✅ Smooth animations
- ✅ Intuitive user interactions

---

## 📱 Details

### Dashboard View
မျက်နှာပြင် ပင်မတွင် အကြွေးစုစုပေါင်း၊ ဒီနေ့ရငွေ၊ ဖောက်သည်ဦးရေ၊ လစဉ်အကြွေး စသည့် အချက်အလက်များကို တွေ့ရမှာဖြစ်ပါတယ်။

### Customer Management
ဖောက်သည်များကို ထည့်သွင်း၊ ပြင်ဆင်၊ ဖျက်ပစ်နိုင်ပြီး တစ်ဦးချင်းစီ၏ ကြွေးစာရင်းအသေးစိတ်ကို ကြည့်ရှုနိုင်ပါတယ်။

### Debt & Payment Tracking
ကြွေးယူမှုများနှင့် ငွေပေးချေမှုများကို အချိန်နှင့်တစ်ပြေးညီ မှတ်တမ်းတင်နိုင်ပါတယ်။

### Security
PIN Lock စနစ်ပါဝင်သောကြောင့် သင့်ဒေတာများကို လုံခြုံစွာ သိမ်းဆည်းထားနိုင်ပါတယ်။

---

## 🤝 Contributing

Contributions are what make the open source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` file for more information.

---

## 👤 Author

**Ryan Wez**

- GitHub: [@RyanWez](https://github.com/RyanWez)
- Website: [ryanwez.github.io/debt-tracking-system](https://ryanwez.github.io/debt-tracking-system)

---

## 🙏 Acknowledgments

- [TailwindCSS](https://tailwindcss.com/) - For the utility-first CSS framework
- [Google Fonts](https://fonts.google.com/) - For the Inter font family
- Myanmar Unicode community - For Myanmar language support

---

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

<div align="center">

**Made with ❤️ by Ryan Wez**

⭐ Star this repo if you find it helpful!

</div>
