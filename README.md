# GiveEasy - Donation & Fundraising Platform 🎯

A full-stack MERN (MongoDB, Express, React, Node.js) donation platform designed for NGOs and social causes. GiveEasy enables transparent fundraising, secure donations, and real-time impact tracking.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)

---

## 🌟 Features

### For Donors
- ✅ Browse verified campaigns by category
- ✅ Secure donation processing with transaction tracking
- ✅ Personal dashboard with donation history
- ✅ Real-time campaign progress tracking
- ✅ Support with optional messages

### For NGOs
- ✅ Create and manage fundraising campaigns
- ✅ Campaign verification system
- ✅ Track donations and progress
- ✅ View donor support and messages

### Admin Features
- ✅ Campaign verification and approval
- ✅ Role-based access control
- ✅ Platform moderation

---

## 🏗️ Project Structure

```
GiveEasy/
├── backend/                # Node.js Express Server
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── models/        # Mongoose models (User, Campaign, Donation)
│   │   ├── controllers/   # Route controllers
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth & error handling
│   │   └── server.js      # Express app entry point
│   ├── .env               # Environment variables
│   └── package.json
│
└── frontend/              # React Frontend
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── pages/         # Page components
    │   ├── context/       # React Context (Auth)
    │   ├── services/      # API service layer
    │   ├── lib/           # Utilities
    │   ├── App.jsx        # Main app component
    │   └── main.jsx       # Entry point
    ├── .env               # Frontend environment
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
cd GiveEasy
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your MongoDB URI and JWT secret
```

**backend/.env**:
```env
MONGODB_URI=mongodb://localhost:27017/giveeasy
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

```bash
# Start the server
npm run dev
```

The backend will run on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file if needed
```

**frontend/.env**:
```env
VITE_API_URL=http://localhost:5000
```

```bash
# Start the development server
npm run dev
```

The frontend will run on **http://localhost:5174** (or next available port)

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Campaigns
- `GET /api/campaigns` - Get all campaigns (with filters)
- `GET /api/campaigns/:id` - Get campaign by ID
- `POST /api/campaigns` - Create campaign (Protected)
- `PUT /api/campaigns/:id` - Update campaign (Protected)
- `DELETE /api/campaigns/:id` - Delete campaign (Protected)
- `PATCH /api/campaigns/:id/verify` - Verify campaign (Admin only)

### Donations
- `POST /api/donations` - Create donation (Protected)
- `GET /api/donations/user` - Get user donations (Protected)
- `GET /api/donations/campaign/:id` - Get campaign donations
- `GET /api/donations/stats` - Get donation statistics (Protected)

---

## 🗄️ Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  createdAt: Date
}
```

### Campaign
```javascript
{
  title: String,
  description: String,
  ngo: String,
  goalAmount: Number,
  currentAmount: Number,
  image: String,
  category: String (education/healthcare/environment/poverty/disaster-relief/other),
  verified: Boolean,
  status: String (active/completed/pending),
  createdBy: ObjectId (ref: User),
  createdAt: Date
}
```

### Donation
```javascript
{
  user: ObjectId (ref: User),
  campaign: ObjectId (ref: Campaign),
  amount: Number,
  transactionId: String (auto-generated),
  status: String (pending/completed/failed),
  message: String,
  createdAt: Date
}
```

---

## 🎨 Design Theme

- **Primary Color**: Wheat (#f5deb3)
- **Background**: White
- **Accents**: Darker wheat tones (#d4a574)
- **Typography**: Modern, clean fonts
- **Style**: Minimal, trust-focused design

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected API routes
- ✅ Role-based access control (User/Admin)
- ✅ Request validation
- ✅ Secure environment variables

---

## 🧪 Testing the Application

### 1. Register a User
- Go to http://localhost:5174/register
- Create an account

### 2. Browse Campaigns
- View featured campaigns on home page
- Filter campaigns by category

### 3. Make a Donation
- Click on a campaign
- Click "Donate Now"
- Enter amount and optional message
- Submit donation

### 4. View Dashboard
- Navigate to Dashboard
- See donation history
- View campaign stats

### 5. Admin Features (Optional)
- Create admin user in MongoDB:
  ```javascript
  db.users.updateOne(
    { email: "admin@example.com" },
    { $set: { role: "admin" } }
  )
  ```
- Login as admin
- Access campaign verification

---

## 📦 Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Authentication
- **cors** - Cross-origin requests
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

---

## 🎯 Future Enhancements

- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Email notifications
- [ ] Automated tax receipts
- [ ] Recurring donations
- [ ] Campaign analytics dashboard
- [ ] Social sharing features
- [ ] Image upload functionality
- [ ] Search functionality
- [ ] Donation certificates

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Contact

For questions or support, please contact: **support@giveeasy.com**

---

**Made with ❤️ for NGOs and Social Causes**
