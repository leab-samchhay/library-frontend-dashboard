# 📚 BBU Library Management System — Frontend Dashboard

<p align="center">
  <img src="src/assets/logolibrary.png" alt="Library Logo" width="120" style="border-radius: 12px; margin-bottom: 12px;" />
</p>

<p align="center">
  <strong>An enterprise-grade, ultra-responsive web dashboard for modern university and institutional libraries.</strong><br>
  Built with <strong>React 19</strong>, <strong>Vite</strong>, <strong>Tailwind CSS v4</strong>, <strong>Redux Toolkit</strong>, and <strong>Bakong KHQR</strong>.
</p>

<p align="center">
  <a href="#-key-features"><img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="#-key-features"><img src="https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="#-key-features"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="#-key-features"><img src="https://img.shields.io/badge/Redux_Toolkit-2.12-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Toolkit" /></a>
  <a href="#-key-features"><img src="https://img.shields.io/badge/Payment-Bakong_KHQR-E31837?style=for-the-badge&logo=cashapp&logoColor=white" alt="Bakong KHQR" /></a>
  <a href="#-key-features"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License" /></a>
</p>

---

## 📑 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
  - [1. Express Circulation Desk (POS-Style)](#1-express-circulation-desk-pos-style)
  - [2. Bakong KHQR Cashless Fines Payment](#2-bakong-khqr-cashless-fines-payment)
  - [3. Interactive Analytics & Executive Reports](#3-interactive-analytics--executive-reports)
  - [4. Book & Multi-Copy Inventory Management](#4-book--multi-copy-inventory-management)
  - [5. Role-Based Access Control (RBAC)](#5-role-based-access-control-rbac)
  - [6. Patron & Member Management](#6-patron--member-management)
- [System Architecture & Tech Stack](#-system-architecture--tech-stack)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Development Server](#development-server)
  - [Production Build](#production-build)
- [Usage & Operational Workflow](#-usage--operational-workflow)
- [Default Demo Credentials](#-default-demo-credentials)
- [License & Acknowledgments](#-license--acknowledgments)

---

## 🌟 Overview

The **BBU Library Management System** is a next-generation web application tailored for higher education libraries, public archives, and resource centers. It delivers an intuitive, fast, and feature-rich interface for librarians and administrators to manage cataloging, multi-copy barcode tracking, student borrowing, returns, fines, and granular user permissions with seamless ease.

Designed with modern aesthetics and ergonomics in mind, it provides dual-theme support (Dark/Light mode), dynamic search and pagination, live barcode scanner input, and instant digital payments through **Bakong KHQR (ABA)**.

---

## ✨ Key Features

### 1. Express Circulation Desk (POS-Style)
*Path: `/loansReturn`*
- **Barcode Scanner Compatible**: Instant lookup by scanning physical barcodes on book copies or typing directly.
- **Cart-Style Multi-Checkout**: Queue multiple books into a live tray before confirming the loan transaction.
- **Automated Return Auditing**: Fast book return processing with auto-calculated overdue days and fine charges.
- **Condition Grading**: Flag copies as *Good*, *Damaged*, or *Lost* upon return to trigger replacement or repair fees.
- **Quick Member Switcher**: Seamlessly select or register new patrons on the fly without leaving the circulation desk.

### 2. Bakong KHQR Cashless Fines Payment
*Component: `KhqrPaymentModal` & `/loansReturn/paymentLate`*
- **Dynamic KHQR QR Generation**: Automatically creates standardized Bakong / ABA KHQR codes for late return fees and damages.
- **On-Screen Live QR Display**: Patrons scan directly with any Cambodian banking app (ABA Mobile, Bakong, Wing, ACLEDA, etc.).
- **Transaction Verification**: Supports live verification and simulation for automated fine clearance.
- **Dual Payment Options**: Supports both digital KHQR payments and traditional cash receipts.

### 3. Interactive Analytics & Executive Reports
*Path: `/home`*
- **High-Impact Metric Cards**: Real-time stats on total books, active borrowers, overdue books, and cumulative fines collected.
- **ApexCharts Visualizations**: Dynamic Sunburst, Treemap, and Bar charts illustrating reading trends and top categories (Novels, Technology, History, Philosophy, etc.).
- **Live Transaction Logs**: Paginated recent loan activities with fast status filtering (*Borrowed*, *Returned*).

### 4. Book & Multi-Copy Inventory Management
- **Catalog Management (`/books`)**: Store master records including Book Title, ISBN, Cover Image, Edition, and Year.
- **Physical Copy Inventory (`/bookcopy`)**: Track individual physical copies with unique barcodes, rack/shelf locations, purchase dates, prices, and conditions.
- **Authors & Co-Authors (`/authors`, `/authorBooks`)**: Manage comprehensive author profiles and associate multi-author collaborations.
- **Publishers & Categories (`/publishers`, `/category`)**: Classify materials under hierarchical genres and publishing houses.

### 5. Role-Based Access Control (RBAC)
*Path: `/user`, `/user/permission/:id`*
- **Granular Permission Matrix**: Over 15+ configurable permission scopes:
  - `dashboard.view`
  - `books.view`, `books.create`, `books.edit`, `books.delete`
  - `book_copies.*`, `category.*`, `authors.*`, `publishers.*`
  - `loans_return.view`, `loans.*`, `loans_detail.*`, `book_return.*`
  - `users.view`, `users.create`, `users.edit`
  - `fines.view`, `fine_payments.view`
- **Dynamic UI Navigation**: Menus and action buttons automatically hide or show according to the authenticated user's privileges.
- **Route Guards**: Secure route protection with automatic redirection to the user's first allowed landing page.

### 6. Patron & Member Management
*Path: `/member`*
- Complete patron directories with student/staff IDs, phone numbers, addresses, and registration dates.
- Direct drill-down into historical loans, active borrowings, and outstanding fee balance.

---

## 🛠️ System Architecture & Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Core Framework** | **React 19** | High-performance component-based frontend framework |
| **Build Tool** | **Vite 8** | Next-generation frontend tooling with lightning-fast HMR |
| **Styling & CSS** | **Tailwind CSS v4** | Modern utility-first CSS engine with `@tailwindcss/vite` |
| **State Management** | **Redux Toolkit** | Centralized auth, user state, and permission storage |
| **Routing** | **React Router v7** | Declarative client-side routing with protected routes |
| **Charts & Data** | **React ApexCharts** | Rich interactive visual analytics (Sunburst, Area, Bar) |
| **Animations** | **Framer Motion** | Fluid transitions, modal entries, and UI feedback |
| **QR & Payments** | **qrcode.react** | Dynamic Bakong KHQR string generation & rendering |
| **HTTP Client** | **Axios** | Interceptor-configured REST API communication with Bearer JWT |
| **Icons** | **Lucide & React Icons** | Modern, clean vector icon libraries |
| **Code Quality** | **Oxlint** | High-performance Rust-based JavaScript linter |

---

## 📂 Folder Structure

```text
Frontend_Dashboard/
├── public/                 # Static assets & favicon
├── src/
│   ├── assets/             # Branding logos, hero banners, and vector assets
│   ├── components/         # Reusable UI widgets & functional components
│   │   ├── ui/             # Core UI elements (Button, Input, Table, Select, Modal, Toast, etc.)
│   │   ├── HasPermission.jsx    # Conditional permission wrapper
│   │   ├── KhqrPaymentModal.jsx # Bakong KHQR dynamic modal generator
│   │   └── ProtectedRoute.jsx   # Route guard checking active permissions
│   ├── globleContext/      # Global application context (theme toggle, global handlers)
│   ├── layout/             # Master app shells (Sidebar, Navbar, Theme toggles)
│   │   └── MainLayout.jsx
│   ├── lib/                # Permission matrix and utility helper functions
│   ├── pages/              # View pages mapped to application routes
│   │   ├── Auth/           # User authentication & login view
│   │   ├── AuthorBook/     # Author-to-Book relationship management
│   │   ├── authors/        # Author profiles & directory
│   │   ├── bookcopy/       # Individual book copy & barcode inventory
│   │   ├── books/          # Master books catalog
│   │   ├── category/       # Category classification
│   │   ├── fines/          # Outstanding fines & penalties list
│   │   ├── finesPayment/   # Payment receipts & settlement ledger
│   │   ├── loans/          # High-level loan transactions
│   │   ├── loansAndReturn/ # Point-of-Sale circulation desk (Loans, Return, KHQR Fines)
│   │   ├── loansDetail/    # Granular per-book loan line items
│   │   ├── member/         # Patron and student membership
│   │   ├── publishers/     # Book publishers directory
│   │   ├── return/         # Book return registries
│   │   └── users/          # Staff users, roles, and permission editor
│   ├── service/            # Axios API instances & authentication service layer
│   ├── store/              # Redux Toolkit store and slices (authSlice)
│   ├── App.jsx             # Master route definitions
│   ├── index.css           # Global Tailwind CSS configurations & themes
│   └── main.jsx            # Application entry point
├── .env                    # Environment variables (Backend API base URL)
├── package.json            # Project dependencies and script declarations
├── vite.config.js          # Vite build pipeline and path alias plugins
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9+), **pnpm**, or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Frontend_Dashboard.git
   cd Frontend_Dashboard
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

### Environment Configuration

Create or verify the `.env` file in the root directory:

```env
# Point to your running backend API server
VITE_API_URL=https://library-system.duckdns.org/api
# Or local development API:
# VITE_API_URL=http://127.0.0.1:8000/api
```

### Development Server

Start the local Vite development server:
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173
```

### Production Build

Compile the optimized production bundle:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 📖 Usage & Operational Workflow

### 1. Authentication & Role Sign-In
- Access `/login` and provide your authorized credentials.
- The system checks your granted permissions and navigates to the first accessible dashboard view.

### 2. Cataloging & Printing Barcodes
1. Navigate to **Book Management > Books** to create the book's master profile.
2. Go to **Book Copies** to generate physical items with unique barcodes, rack numbers, and initial condition status.

### 3. POS Circulation (Check Out Books)
1. Go to **Transaction > Loans & Return** (`/loansReturn`).
2. Select or search for the borrowing **Member**.
3. Scan or select the book copies into the checkout list.
4. Set the **Due Date** and click **Submit Loan**.

### 4. Returning Books & Automated Late Fees
1. Switch to **Return Books** tab in the circulation workspace.
2. Scan the returning book copy barcode or select the patron.
3. If overdue, the system automatically calculates the late days and prompts a fine settlement modal.
4. Choose **Bakong KHQR** to generate a live QR code on screen for the patron to pay instantly with their mobile banking app.

### 5. Managing Staff Permissions
- Head to **People > Users** and click the **Permissions** key icon on any staff member.
- Toggle specific modules (Create, Read, Update, Delete) to tailor access rights precisely.

---

## 🔑 Default Demo Credentials

For testing and demonstration purposes:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Administrator** | `admin@gmail.com` | `123` |

> *Note: It is strongly recommended to change default passwords in production through the User Management panel.*

---

## 💡 Keyboard & Barcode Scanner Tip

The POS Circulation Desk is optimized for hardware barcode scanners configured in **keyboard wedge mode** (terminating with an `Enter` keystroke). Simply focus the search field and scan the book's barcode label for rapid item selection.

---

## 🤝 Contributing

Contributions, feature suggestions, and bug reports are warmly welcome!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<p align="center">
  Crafted with ❤️ for <strong>Build Bright University (BBU) Library</strong>
</p>
