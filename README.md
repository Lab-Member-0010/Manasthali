<div align="center">

<img src="frontend/public/Manasthali.png" alt="Manasthali Logo" width="120" />

# Manasthali

**The place of mind — a mental wellness social platform**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io&logoColor=white)](https://socket.io)

</div>

---

## Overview

Manasthali connects people based on their **MBTI personality type**, replacing passive scrolling with genuine interaction — community groups, daily challenges, real-time chat, and an AI-powered mental coach.

---

## Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Register, email OTP verification, sign-in, forgot/reset password, Google OAuth |
| 🧠 **Personality Quiz** | 35-question MBTI quiz assigns one of 16 personality types |
| 👥 **Communities** | Each personality type has its own community and groups |
| 💬 **Real-time Chat** | 1-to-1 DM and group chat powered by Socket.IO |
| 📸 **Stories** | Upload and view short-lived stories |
| 📝 **Posts & Feed** | Create posts with media, view community posts, add comments |
| 🔔 **Notifications** | In-app notification feed |
| 🎯 **Daily Challenges** | Personality-matched daily challenges with badge rewards |
| 🤝 **Find Friends** | Discover and follow people from your community |
| 🧘 **Mental Coach** | AI-assisted mental wellness advisor |
| 🛡️ **Admin Panel** | Manage communities, groups, and users |

---

## Tech Stack

### Frontend

| Tool | Purpose |
|---|---|
| [Vite 6](https://vitejs.dev) | Build tool with instant HMR (replaces CRA) |
| [React 19](https://react.dev) + TypeScript | Component framework |
| Inline `.styles.ts` objects | All styling via `React.CSSProperties` — zero `.css` files |
| [Redux Toolkit](https://redux-toolkit.js.org) | Global auth state |
| [MUI (Material UI)](https://mui.com) | Icon library |
| [React Router DOM v7](https://reactrouter.com) | Client-side routing |
| [Socket.IO Client](https://socket.io) | Real-time messaging |
| [Axios](https://axios-http.com) | HTTP client |
| [Bootstrap 5](https://getbootstrap.com) | Utility classes (CDN) |
| [React Toastify](https://fkhadra.github.io/react-toastify) | Toast notifications |

### Backend

| Tool | Purpose |
|---|---|
| [Node.js](https://nodejs.org) + [Express](https://expressjs.com) | REST API server |
| [MongoDB](https://www.mongodb.com) + [Mongoose](https://mongoosejs.com) | Database + ODM |
| [Socket.IO](https://socket.io) | Real-time bi-directional communication |
| [JWT](https://jwt.io) | Stateless authentication |
| [Cloudinary](https://cloudinary.com) | Media storage for posts, profiles, stories |
| [Nodemailer](https://nodemailer.com) | Email OTP delivery |
| [Passport.js](https://www.passportjs.org) | Google OAuth 2.0 |
| [Multer](https://github.com/expressjs/multer) | Multipart file uploads |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |

---

## Project Structure

```
Manasthali/
├── backend/
│   ├── controller/           # Route handler logic
│   ├── model/                # Mongoose schemas
│   ├── routes/               # Express routers
│   ├── middleware/           # Auth, Cloudinary, Socket.IO, Google OAuth
│   ├── mailer/               # Nodemailer OTP emails
│   ├── scripts/              # Seed scripts (challenges)
│   ├── app.js                # Server entry point
│   ├── .env                  # Environment variables (see .env.example)
│   └── .env.example
│
└── frontend/
    ├── public/               # Static assets (logo, manifest)
    ├── src/
    │   ├── apis/
    │   │   └── Api.js        # Centralised API endpoints (reads VITE_API_URL)
    │   ├── components/
    │   │   ├── Admin/        # Admin panel (communities, groups)
    │   │   ├── Authentication/  # Signup, Signin, OTP, Reset Password
    │   │   ├── Authorization/   # Route guard component
    │   │   ├── Feed/         # Main app shell + all feed sub-views
    │   │   │   ├── challenge/
    │   │   │   ├── chat/         # 1-to-1 DM
    │   │   │   ├── community/
    │   │   │   ├── Find-friend/
    │   │   │   ├── group/
    │   │   │   ├── group-chat/
    │   │   │   ├── home/
    │   │   │   ├── Mental-Coach/
    │   │   │   ├── notification/
    │   │   │   ├── post/
    │   │   │   ├── profile/
    │   │   │   └── story/
    │   │   ├── Home/         # Landing page
    │   │   └── Quiz/         # Personality quiz + result page
    │   ├── images/           # Local image assets
    │   ├── redux-config/     # Redux store + UserSlice
    │   ├── utils/
    │   │   └── styleUtils.ts # useHover hook, mergeStyles, injectGlobalStyles
    │   ├── App.js            # Route definitions
    │   ├── main.tsx          # Vite entry point + global style injection
    │   └── vite-env.d.ts     # Vite environment type declarations
    ├── index.html            # Vite root HTML
    ├── vite.config.ts
    ├── tsconfig.json
    ├── package.json
    ├── .env                  # VITE_API_URL (see .env.example)
    └── .env.example
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally or a [MongoDB Atlas](https://www.mongodb.com/atlas) URI
- A **Cloudinary** account (free tier is enough)
- A **Gmail** account with an [App Password](https://support.google.com/accounts/answer/185833) for SMTP

---

### 1 — Clone the repository

```bash
git clone https://github.com/your-username/manasthali.git
cd manasthali
```

---

### 2 — Set up environment variables

**Backend:**

```bash
cp backend/.env.example backend/.env
# Then open backend/.env and fill in your values
```

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
DB_URI=mongodb://localhost:27017/manasthali

JWT_SECRET=your_jwt_secret_here

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

MAIL_HOST=gmail
MAIL_PORT=465
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password
```

**Frontend:**

```bash
cp frontend/.env.example frontend/.env
# Then open frontend/.env and fill in your values
```

```env
VITE_API_URL=http://localhost:3001
```

---

### 3 — Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

---

### 4 — Run the application

Open **two terminals** side by side:

**Terminal 1 — Backend**

```bash
cd backend
npm start
# ✔  Server starts at http://localhost:3001
```

**Terminal 2 — Frontend**

```bash
cd frontend
npm run dev
# ✔  App opens at http://localhost:3000
```

---

## Frontend Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with instant HMR |
| `npm run build` | Type-check + build for production → `frontend/dist/` |
| `npm run preview` | Serve the production build locally |

## Backend Commands

| Command | Description |
|---|---|
| `npm start` | Start the Express server (`node app.js`) |

---

## API Reference

All endpoints are served from `VITE_API_URL` (default `http://localhost:3001`).

| Resource | Base path |
|---|---|
| Users & Auth | `/users` |
| Quiz | `/quiz` |
| Posts | `/posts` |
| Comments | `/comments` |
| Stories | `/story` |
| Communities | `/communities` |
| Groups | `/groups` |
| Group Chat | `/groupchat` |
| Direct Messages | `/message` |
| Notifications | `/notifications` |
| Challenges | `/challenge` |
| Badges | `/badges` |
| Mental Coach | `/mental-coach` |
| Admin | `/admin` |
| Google OAuth | `/auth/google` |

---

## Architecture Notes

**Styling** — There are zero `.css` files in the project. Every component has a sibling `.styles.ts` file that exports typed `React.CSSProperties` objects. Hover states use the `useHover` hook from `src/utils/styleUtils.ts`. Global resets and `@keyframes` animations are injected once at startup via `injectGlobalStyles()` in `main.tsx`.

**Environment isolation** — No backend URLs appear in source code. The frontend reads a single `VITE_API_URL` env var; switching from local to production only requires changing `.env`.

**Real-time** — Socket.IO handles both 1-to-1 DM (`send-message` / `receive-message`) and group chat (`send-message-group` / `receive-message-group`). The backend CORS origin is driven by `FRONTEND_URL`.

**Auth flow** — Register → email OTP verification → sign in → JWT stored in Redux. Protected routes use the `Authorization/Auth.js` guard, which redirects unauthenticated users to `/signin`.

**Media uploads** — Multer handles multipart form data server-side; Cloudinary stores the actual files. The local `uploads/` directory acts only as a temporary buffer.

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

<div align="center">
  Built with ❤️ by the Manasthali team
</div>
