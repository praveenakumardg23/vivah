# 💍 Vivah — Wedding Hall Booking Platform

A full-stack MEAN application for discovering, booking, and managing marriage halls with role-based access control.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 21, Angular Material, SCSS |
| Backend | Node.js, Express 5, MongoDB (Mongoose) |
| Auth | JWT (access + refresh tokens), Twilio Verify (SMS OTP) |
| Email | Nodemailer (Gmail SMTP) |
| OTP SMS | Twilio Verify API |

---

## Roles & Permissions

| Role | Permissions |
|------|------------|
| **USER** | Browse halls, book halls, view/cancel own bookings |
| **OWNER** | All USER perms + confirm/reject bookings + add offline bookings + block dates on own halls |
| **AGENT** | All OWNER perms + create/edit/delete halls + register owners by phone |
| **ADMIN** | All AGENT perms + register agents + manage all user roles |

**Login flows:**
- USER → OTP on phone (auto-registered if new)
- OWNER → OTP on phone (registered by Agent when creating hall)
- AGENT → OTP on phone (registered by Admin) OR email + password
- ADMIN → email + password (seeded manually in DB)

---

## Project Structure

```
vivah/
├── vivah-backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── hall.controller.js
│   │   │   ├── booking.controller.js
│   │   │   └── admin.controller.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── hall.model.js
│   │   │   └── booking.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── hall.routes.js
│   │   │   ├── booking.routes.js
│   │   │   └── admin.routes.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── role.middleware.js
│   │   ├── services/
│   │   │   └── sms.service.js
│   │   ├── utils/
│   │   │   └── generateTokens.js
│   │   ├── constants/
│   │   │   └── roles.js
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── vivah-frontend/
    └── src/app/
        ├── core/
        │   ├── constants/api-endpoints.ts
        │   ├── guards/auth.guard.ts
        │   ├── interceptors/auth.interceptor.ts
        │   └── services/
        │       ├── api.service.ts
        │       ├── auth.service.ts
        │       ├── token.service.ts
        │       ├── user.service.ts
        │       ├── hall.service.ts
        │       ├── booking.service.ts
        │       └── admin.service.ts
        ├── shared/
        │   ├── models/
        │   │   ├── user.model.ts
        │   │   ├── hall.model.ts
        │   │   └── booking.model.ts
        │   └── components/hall-card/
        ├── layouts/navbar/
        └── features/
            ├── auth/pages/
            │   ├── otp-login/         ← OTP + password login dialog
            │   └── profile/           ← Edit name, verify email
            ├── home/pages/home/       ← Browse + search halls
            ├── halls/pages/
            │   ├── hall-list/         ← All halls with filters
            │   └── hall-detail/       ← Hall info + booking form
            ├── booking/pages/
            │   ├── booking-form/      ← Reusable booking form
            │   └── booking-history/   ← User's booking list
            ├── owner/pages/
            │   └── owner-dashboard/   ← Bookings, blocked dates, offline
            ├── agent/pages/
            │   └── agent-dashboard/   ← Hall CRUD, owner registration
            └── admin/pages/
                └── admin-dashboard/   ← User management, agent registration
```

---

## Backend Setup

```bash
cd vivah-backend
npm install
cp .env.example .env
# Fill in your .env values
npm start
```

### Required .env values

```env
PORT=5000
MONGO_URI=mongodb+srv://...
ACCESS_TOKEN_SECRET=<random_string>
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=<random_string>
REFRESH_TOKEN_EXPIRY=30d
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_VERIFY_SID=VA...
MAIL_USER=youremail@gmail.com
MAIL_PASS=your_gmail_app_password
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords. Generate one for "Mail".

### Seed an Admin user

Run this once in MongoDB shell or Compass:

```js
db.users.insertOne({
  name: "Admin",
  phone: "9999999999",
  email: "admin@vivah.com",
  password: "<bcrypt_hash_of_password>",
  role: "ADMIN",
  isEmailVerified: true,
  profileCompleted: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Generate bcrypt hash (Node.js):
```js
import bcrypt from 'bcryptjs';
console.log(await bcrypt.hash('YourPassword123', 10));
```

---

## Frontend Setup

```bash
cd vivah-frontend
npm install
ng serve
```

App runs at `http://localhost:4200`.

### Environment

`src/environments/environment.ts`:
```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5000/api'
};
```

---

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/send-otp` | Public |
| POST | `/api/auth/verify-otp` | Public |
| POST | `/api/auth/login` | Public (Agent/Owner/Admin) |
| POST | `/api/auth/refresh` | Public |
| POST | `/api/auth/logout` | Authenticated |

### Halls
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/halls` | Public |
| GET | `/api/halls/:id` | Public |
| GET | `/api/halls/my/agent` | AGENT, ADMIN |
| GET | `/api/halls/my/owner` | OWNER, ADMIN |
| POST | `/api/halls` | AGENT, ADMIN |
| PUT | `/api/halls/:id` | AGENT, ADMIN |
| DELETE | `/api/halls/:id` | AGENT, ADMIN |
| PUT | `/api/halls/:id/blocked-dates` | OWNER, AGENT, ADMIN |

### Bookings
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/bookings` | Authenticated |
| GET | `/api/bookings/my` | Authenticated |
| GET | `/api/bookings/hall-bookings` | OWNER, AGENT, ADMIN |
| PUT | `/api/bookings/:id/status` | OWNER, AGENT, ADMIN |
| PUT | `/api/bookings/:id/cancel` | Authenticated |
| POST | `/api/bookings/offline` | OWNER, AGENT, ADMIN |

### Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/admin/users` | ADMIN |
| POST | `/api/admin/register-agent` | ADMIN |
| PUT | `/api/admin/users/:id/role` | ADMIN |
| GET | `/api/admin/agents` | ADMIN |
| GET | `/api/admin/owners` | ADMIN, AGENT |

---

## Key Features

- **OTP Login** via Twilio Verify — auto-registers new users as USER
- **Role-based dashboards** — each role sees only relevant UI
- **JWT with refresh tokens** — auto-refresh on 401 via interceptor
- **Email verification** — via Nodemailer OTP
- **Offline bookings** — owners can manually block dates or add walk-in bookings
- **Hall availability** — dates blocked when confirmed; filter by date on search
- **Lazy-loaded routes** — each dashboard loads only when needed
- **Auth guard** — protects routes by role; redirects unauthenticated users