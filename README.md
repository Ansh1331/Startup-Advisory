# 🚀 Startup Advisory

**Startup Advisory** is a full-stack web platform that connects startup founders with expert advisors for one-on-one consultations. It supports role-based access for Founders, Advisors, and Admins, with robust features for appointment booking, subscription plans, video calls, and earnings management.

---

## 📸 Project Preview

<p align="center">
  <img src="https://i.ibb.co/jvY7Zd4F/Screenshot-2025-06-25-005845.png" alt="Startup Advisory" width="100%" />
</p>

---

## ✨ Features

### 👤 Authentication & Roles
- Role-based signup via [Clerk](https://clerk.dev/) (Founder / Advisor / Admin)
- Secure access control for different dashboards and features

### 🔍 Advisor Discovery
- Browse advisors by specialty (e.g., Marketing, Fundraising, Tech)
- View advisor profile, availability, and consultation slots

### 🛒 Subscription Plans
- Founders can activate monthly subscription plans (simulated, no real payment)
- Plans unlock booking and video consultation access

### 📅 Appointment Management
- Founders can:
  - Book available slots with advisors
  - Cancel scheduled appointments
  - Join live video consultations
- Advisors can:
  - Set their weekly availability
  - Manage upcoming sessions

### 🎥 Video Consultations (Vonage)
- Real-time video calling between founders and advisors
- Mute/unmute microphone
- Hang up functionality

### 💼 Advisor Dashboard
- Manage availability
- Track earnings from consultations
- Request withdrawals

### 🛠️ Admin Panel
- Approve or reject advisor applications
- View advisor background info
- Process withdrawal requests

---

## 🧑‍💻 Tech Stack

| Category              | Technology                    |
|-----------------------|-------------------------------|
| Frontend              | React, Next.js                |
| UI Library            | ShadCN UI, Tailwind CSS       |
| Authentication        | Clerk                         |
| Database              | Prisma + PostgreSQL           |
| Video Calling         | Vonage (OpenTok)              |
| Styling               | Tailwind CSS                  |
| Deployment            | Vercel (recommended)          |

---

## 📂 Project Structure (High-Level)

```
/app               → App directory (Next.js routing)
/components        → Reusable UI components
/lib               → Utility functions (e.g. checkAuth, db)
 /db               → Prisma client and helpers
/middleware.ts     → Clerk middleware for route protection
/pages/api         → API routes for booking, dashboard, etc.
/styles            → Tailwind base styling
```

---

## 🔧 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/startup-advisory.git
cd startup-advisory
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and add:

```env
DATABASE_URL=postgresql://your-db-url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
CLERK_SECRET_KEY=your-clerk-secret
VONAGE_API_KEY=your-vonage-api-key
VONAGE_API_SECRET=your-vonage-secret
VONAGE_SESSION_ID=session-id
VONAGE_TOKEN=token
```

> Replace the keys with your actual credentials.

---

### 4. Run Prisma Migrations

```bash
npx prisma db push
```

(Optional: Use `npx prisma studio` to explore the DB.)

---

### 5. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deployment

This app is ready for deployment on **Vercel**. Just connect your GitHub repository and set the required environment variables in the Vercel dashboard.

---

## 🧠 Future Improvements

- Stripe or Razorpay integration for real payments
- Notification system (email/SMS reminders)
- Advisor ratings and reviews
- Enhanced video features (screen sharing, recording)

---

## 🤝 Contributing

Contributions are welcome! If you find a bug or want to suggest a feature, feel free to open an issue or pull request.

---

## 🧑‍💼 Author

Made with ❤️ by **Ansh Singhal**

