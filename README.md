# RentHub – Equipment Rental Management Platform (MERN Stack)

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://react.dev)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-green.svg)](https://cloud.mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**RentHub** is a production-style, full-stack **Equipment Rental Management Marketplace** developed using Node.js, Express.js, React.js (Vite + Tailwind CSS), and MongoDB Atlas cloud database.

---

## 🚀 Key Features

### 1. Public Marketplace
- **Hero & Search Engine:** Instant keyword search across cameras, laptops, drones, audio, gaming consoles, projectors and electronics.
- **Dynamic Category Explorer:** Filter gear by category with real-time stock counters.
- **Featured Equipment:** Highlights popular, highly-rated rental inventory.
- **Complete Information Architecture:** Dedicated Home, Catalog, Details, About Us, and Contact Us pages with interactive FAQ accordions.

### 2. Double-Booking Prevention & Date Scheduling
- **Atomic Conflict Detection:** Prevents any two approved or active bookings from overlapping for the same piece of hardware.
- **Real-Time Duration & Price Calculator:** Calculates rental duration in days, daily rent totals, and refundable security deposit transparently.
- **Handover Options:** Choice between Store Pickup and Verified Home Delivery with address capture.

### 3. Customer User Dashboard
- **Rental Status Tracking:** Categorized views for **Pending**, **Approved**, **Active Rentals**, **Completed**, and **Cancelled** bookings.
- **Sandboxed Online Payment:** Simulate UPI, Credit/Debit card, and Netbanking payments for approved bookings.
- **Self-Service Cancellation:** Cancel eligible pending/approved bookings before the rental begins.
- **Verified Reviews & Ratings:** Rate equipment (1 to 5 stars) and publish comments upon rental completion.
- **Activity Notifications:** Unread notification badges with real-time status updates from the admin.
- **Profile & Security:** Manage personal info, delivery address, and change passwords.

### 4. Administrator Control Portal
- **KPI Metrics Dashboard:** Real-time metrics for Total Revenue, Refundable Deposits Held, Total Users, Active Rentals, Available Equipment, and Pending Approvals.
- **Inventory Management:** Full CRUD operations (Add, Edit, Delete, Toggle Availability) with multi-image URLs or direct image uploads via Multer.
- **Booking Approvals & Workflow:** One-click approval/rejection with double-booking re-validation, handover to active rental, and check-in return verification.
- **User Directory:** View customer booking counts, joined dates, and suspend/activate accounts.
- **Financial Analytics & Reports:** Ranking of most rented equipment, category distribution breakdown, and monthly revenue analytics.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React Icons |
| **Backend** | Node.js, Express.js, RESTful Architecture |
| **Cloud Database** | **MongoDB Atlas** (Mongoose ODM) |
| **Authentication** | JSON Web Tokens (JWT), bcrypt.js password hashing, Rate Limiting |
| **File Storage** | Multer disk storage for equipment image uploads |

---

## 📦 Project Structure

```
EquipmentRental/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── api/                # Axios instance with JWT interceptors
│   │   ├── components/         # Reusable UI (Navbar, Footer, EquipmentCard, Modals)
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── pages/              # Public & Dashboards
│   │   │   ├── user/           # User Dashboard, PaymentModal
│   │   │   ├── admin/          # Admin Dashboard, EquipmentFormModal
│   │   │   ├── HomePage.jsx
│   │   │   ├── EquipmentListingPage.jsx
│   │   │   ├── EquipmentDetailsPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── routes/             # ProtectedRoute, AdminRoute
│   │   ├── App.jsx             # Main Router
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Express.js REST API Backend
│   ├── config/                 # db.js (MongoDB Atlas Mongoose connection)
│   ├── controllers/            # auth, equipment, booking, review, notification, admin
│   ├── middleware/             # authMiddleware, errorMiddleware, uploadMiddleware
│   ├── models/                 # User, Equipment, Booking, Payment, Review, Notification
│   ├── routes/                 # REST endpoints
│   ├── utils/                  # generateToken, availabilityHelper (overlap prevention)
│   ├── uploads/                # Dynamic equipment media uploads
│   ├── seed.js                 # Sample database seeder
│   ├── server.js               # Application entrypoint
│   ├── .env.example            # Environment template
│   ├── .env                    # Active environment variables
│   └── package.json
│
├── package.json                # Root workspace scripts
└── README.md
```

---

## ⚙️ Setup & Installation Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- A free **MongoDB Atlas** account ([cloud.mongodb.com](https://cloud.mongodb.com))

---

### Step 1: Configure MongoDB Atlas Database

1. Sign in to your [MongoDB Atlas](https://cloud.mongodb.com) account.
2. Under **Security -> Network Access**, click **Add IP Address** and select **Allow Access from Anywhere (`0.0.0.0/0`)**.
3. Under **Security -> Database Access**, create a database user (e.g., `renthub_user` with a secure password).
4. Go to **Database Deployments -> Connect -> Drivers (Node.js)** and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/renthub?retryWrites=true&w=majority
   ```
5. Open `server/.env` and replace `MONGO_URI` with your connection string:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@your-cluster.mongodb.net/renthub?retryWrites=true&w=majority
   JWT_SECRET=renthub_super_secret_jwt_key_2026_secure
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:5173
   ```

---

### Step 2: Seed the Database with Realistic Gear

Once your `MONGO_URI` is in place, populate the catalog with verified gear, demo accounts, and sample rental workflows:

```bash
cd server
npm run seed
```

This will automatically create:
- **14+ realistic electronics** (MacBook Pro M3 Max, Sony A7 IV, DJI Mini 4 Pro, PS5, Bose PA System, BenQ 4K Projector, etc.)
- **Preconfigured demo accounts**
- Sample active, pending, and completed bookings

---

### Step 3: Run the Application

Open two terminal windows:

#### Terminal 1: Backend Server
```bash
cd server
npm run dev
```
*Backend runs on: `http://localhost:5000/api`*

#### Terminal 2: Frontend Client
```bash
cd client
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

Or run both from the root folder:
```bash
npm run server   # starts backend
npm run client   # starts frontend
```

---

## 🔑 Default Credentials

For quick testing and grading evaluation:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@renthub.com` | `admin123` | Full Admin Portal & Inventory Controls |
| **Customer User** | `user@renthub.com` | `user123` | User Dashboard, Booking & Reviews |
| **Customer User 2**| `priya@renthub.com` | `user123` | Secondary Renter Account |

*Tip: The Login Page also features 1-click **Demo Login** buttons to auto-fill credentials instantly.*

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/auth/health` | Public | Server uptime & MongoDB Atlas cloud status |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Login with email & password, returns JWT |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated profile |
| `PUT` | `/api/auth/profile` | Private | Update user details & address |
| `PUT` | `/api/auth/change-password` | Private | Change account password |

### Equipment Catalog (`/api/equipment`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/equipment` | Public | Search, category filter, price filter, sorting & pagination |
| `GET` | `/api/equipment/:id` | Public | Get equipment specs, reviews, and booked dates |
| `GET` | `/api/equipment/:id/availability` | Public | Atomic date conflict validation |
| `GET` | `/api/equipment/categories` | Public | List categories with stock counts |
| `POST` | `/api/equipment` | Admin | Create new equipment item |
| `PUT` | `/api/equipment/:id` | Admin | Update equipment details |
| `DELETE` | `/api/equipment/:id` | Admin | Delete equipment (safe check for active rentals) |

### Rental Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/bookings` | Private | Request a booking with automatic overlap prevention |
| `GET` | `/api/bookings/my` | Private | Fetch logged-in user's rental history |
| `GET` | `/api/bookings` | Admin | Fetch all bookings across users |
| `GET` | `/api/bookings/:id` | Private | Fetch booking details by ID |
| `PUT` | `/api/bookings/:id/status`| Admin | Transition status: `approved`, `rejected`, `active`, `completed` |
| `DELETE` | `/api/bookings/:id` | Private | Cancel user's eligible booking |
| `POST` | `/api/bookings/:id/pay` | Private | Simulate sandboxed payment completion |

### Reviews & Notifications
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/reviews` | Private | Submit 1-5 star review for rented equipment |
| `GET` | `/api/reviews/:equipmentId`| Public | Fetch all reviews for an equipment item |
| `GET` | `/api/notifications` | Private | Fetch user activity notifications |
| `PUT` | `/api/notifications/read-all`| Private| Mark all notifications as read |

### Administration (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Admin | Get high-level KPI revenue and booking numbers |
| `GET` | `/api/admin/users` | Admin | List all users with booking aggregates |
| `PUT` | `/api/admin/users/:id/toggle-block` | Admin | Block or unblock user account |
| `GET` | `/api/admin/reports` | Admin | Top equipment, category split & monthly revenue |

---

## 🧪 Testing Verification Checklist

- [x] **User Registration:** Test validation, password mismatch alert, and automatic token assignment.
- [x] **User Login:** Test valid login and invalid credentials rejection.
- [x] **Double Booking Prevention:** Book an item for Oct 10–15, approve it in Admin, then try booking Oct 12–14 on another account. The server returns a 409 Conflict.
- [x] **Admin Approval Workflow:** Go to Admin -> Bookings -> click "Approve" -> notification generated for user.
- [x] **Handover to Active:** Admin clicks "Dispatch / Active" when user collects the gear.
- [x] **Return & Deposit:** Admin marks "Mark Returned" when returned, unlocking customer review eligibility.
- [x] **Customer Review Submission:** Customer submits 5-star rating; average rating updates immediately.
- [x] **Inventory Management:** Admin adds new equipment with images and specs; verify instant listing in catalog.
- [x] **Responsive Layout:** Tested across desktop (1920px), tablet (768px), and mobile (375px).

---

## 🎓 Capstone Project Declaration
Developed for demonstration as an Academic CSE Capstone Project highlighting full-stack engineering, secure cloud architecture, concurrency handling, and enterprise UI/UX design.

