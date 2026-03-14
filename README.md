# 🎓 Alumni-Student Mentorship Platform

A **full-stack MERN web application** that bridges the gap between **alumni** and **current students** through structured mentorship, real-time messaging, job referrals, skill-based training, and a gamified **coin economy**. Built with React 19, Express, and MongoDB.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Why This Platform?](#why-this-platform)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Design System](#design-system)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Running Both Together](#running-both-together)
  - [Docker Setup](#docker-setup)
- [Environment Variables](#environment-variables)
- [Page-by-Page UI Guide](#page-by-page-ui-guide)
- [Authentication Flow](#authentication-flow)
- [Coin Economy & Gamification](#coin-economy--gamification)
- [API Reference](#api-reference)
  - [Health Check](#health-check)
  - [Student Endpoints](#student-endpoints)
  - [Alumni Endpoints](#alumni-endpoints)
  - [Mentorship Request Endpoints](#mentorship-request-endpoints)
  - [Messaging Endpoints](#messaging-endpoints)
  - [Job Endpoints](#job-endpoints)
  - [Training Endpoints](#training-endpoints)
- [Database Schema](#database-schema)
  - [Student Model](#student-model)
  - [Alumni Model](#alumni-model)
  - [Request Model](#request-model)
  - [Message Model](#message-model)
  - [Job Model](#job-model)
  - [Training Model](#training-model)
  - [Entity Relationship Overview](#entity-relationship-overview)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Security Considerations](#security-considerations)
- [License](#license)

---

## Overview

The **Alumni-Student Mentorship Platform** is designed for colleges and universities that want to create lasting connections between their students and graduates. Instead of relying on scattered LinkedIn messages or informal introductions, this platform provides a single, dedicated space where:

- **Students** discover and connect with alumni mentors who share their interests and career goals
- **Alumni** give back by offering guidance, posting job referrals, and conducting skill-based training sessions
- **Everyone** is incentivized through a built-in **coin economy** that rewards participation and shows up on a public **leaderboard**

The result is a self-sustaining ecosystem where mentorship, career opportunities, and skill development happen organically — all within a modern, polished web experience.

---

## Why This Platform?

| Problem | Solution |
|---------|----------|
| Students struggle to find relevant mentors | Searchable alumni directory with filters by company, skills, and experience |
| Alumni don't know how to contribute | Multiple contribution paths: mentoring, job referrals, skill training |
| No incentive for alumni to stay active | Coin economy rewards every action; leaderboard creates healthy competition |
| Communication is fragmented across tools | Built-in real-time messaging between connected users |
| Job referrals get lost in email chains | Dedicated job board with referral emails and one-click applications |
| Skill gaps are hard to address | Training marketplace where students request skills and alumni deliver |

---

## Features

### 🔐 Authentication & Registration

The platform supports **role-based registration** for two user types — Students and Alumni — each with a tailored two-phase registration form.

**Phase 1 — Personal Information:**
- Full name, roll number (used as the unique login identifier), year of study/graduation
- Social links (LinkedIn, GitHub), phone number
- Password with confirmation (minimum 6 characters, hashed with bcrypt at 12 salt rounds)

**Phase 2 — Profile Details:**
- About section (bio/summary)
- Skills (entered as comma-separated values, stored as an array)
- Resume upload (file upload via drag-and-drop or click, stored on the server)
- *Alumni-specific:* Current job description and years of experience

**Login:** Roll-number + password authentication returns a JWT token valid for 7 days. Token and user data are stored in `localStorage` for session persistence.

---

### 🤝 Mentorship System

The mentorship system is the core of the platform. It allows students to discover alumni and establish mentor-mentee relationships.

**How it works:**

1. **Browse Alumni** — View all registered alumni in a responsive card grid. Each card shows name, job title, experience, and skill chips.
2. **Filter & Search** — Narrow results by company name, skill keywords, or experience level using the inline filter bar.
3. **Send Request** — Click "Request Guidance" on any alumni card to open a modal where you write a personal message explaining why you'd like mentorship.
4. **Accept / Reject** — Alumni receive requests on their dashboard and can accept or decline with one click.
5. **Connected** — Once accepted, both users can message each other and the mentor appears in the mentee's sidebar.
6. **Remove Mentor** — Either party can end the mentorship by providing a reason; the request status reverts to rejected.

---

### 💬 Real-Time Messaging

Once a mentorship request is accepted, both users can communicate through the built-in messaging system.

**Key details:**
- **Two-panel layout** — A left sidebar (320px) lists all conversations; the right panel shows the active chat
- **Message alignment** — Sent messages appear right-aligned with the primary color background; received messages appear left-aligned in a dark card
- **Auto-refresh** — The conversation view polls the server every **3 seconds** for new messages (no manual refresh needed)
- **Enter to send** — Press Enter or click the Send button to dispatch a message
- **Scoped conversations** — Only users with an accepted mentorship connection can message each other

---

### 💼 Job Referral Board

Alumni can give back by posting job and internship opportunities for the student community.

**For alumni:**
- Click "Post Opportunity" to open a form with fields for company name, role, job description, application link, and referral email
- **Earn +100 coins** for every job posted — this incentivizes regular contributions

**For all users:**
- Browse all posted opportunities in a card grid sorted by newest first
- Each card displays company, role, who posted it, a truncated description, and a highlighted referral email
- Click "Apply Now" to visit the application link

---

### 📚 Training Marketplace

A unique feature that creates a micro-economy around skill-based learning.

**For students (requesting training):**
1. Click "Request Training" and fill out the skill you need help with
2. Set a **coin range** (min and max) — this is your budget for the training
3. Your request appears on the marketplace for all alumni to see

**For alumni (accepting training):**
1. Browse open training requests on the Training tab
2. Click "Accept" on any request you're qualified to teach
3. After completing the training, the student submits feedback

**Feedback & coin transfer:**
| Feedback | Coins Transferred | From | To |
|----------|-------------------|------|-----|
| ✅ Satisfied | **maxCoins** | Student | Alumni |
| ❌ Dissatisfied | **minCoins** | Student | Alumni |

This creates a built-in quality assurance mechanism — alumni are rewarded more for higher-quality training.

---

### 🏆 Leaderboard

The leaderboard highlights the most active and helpful alumni on the platform.

- Displays the **top 100 alumni** ranked by total coins earned
- Each row shows: rank, name, current role/title, coin count, and a quick action button
- **Top 3 positions** are highlighted in gold with a 🏆 trophy icon
- The leaderboard updates in real time as alumni earn coins through jobs, training, and donations
- Serves as public recognition, encouraging sustained participation

---

### 🪙 Coin Economy

The coin system is the gamification engine that powers engagement across the entire platform.

#### Starting Balances

| Role    | Starting Coins | Purpose |
|---------|---------------|---------|
| Student | **500** | Budget for training requests and donations |
| Alumni  | **0**   | Must earn coins through contributions |

#### How Coins Are Earned & Spent

| Action | Coins | Who | Direction |
|--------|-------|-----|-----------|
| Post a job referral | +100 | Alumni | Earn |
| Training completed (satisfied feedback) | +maxCoins | Alumni | Earn |
| Training completed (dissatisfied feedback) | +minCoins | Alumni | Earn |
| Receive a donation from a student | +1 to +50 | Alumni | Earn |
| Donate to an alumni | −1 to −50 | Student | Spend |
| Training completed (any feedback) | −minCoins or −maxCoins | Student | Spend |

#### Donation Rules
- Each student can donate **only once** across their entire account lifetime
- Maximum donation amount: **50 coins**
- Minimum: **1 coin**
- Once donated, the student's `donated` flag is set to `true` permanently

---

### 📊 Dashboard

The dashboard is the central hub of the platform, combining all features into a single, organized view.

**Layout:**
- **Fixed navbar** at the top with the AlumniConnect brand, navigation tabs, and a sign-out button
- **Left sidebar** (280px) showing user profile card, coin balance, and quick actions
- **Main content area** that dynamically loads the selected tab's component

**Six tabs:**

| Tab | Component | Description |
|-----|-----------|-------------|
| Overview | Built-in | Hero banner, recent activity, pending requests, your mentors |
| Mentoring | `<Mentoring />` | Browse and connect with alumni |
| Training | `<TrainingPage />` | Request or accept skill training |
| Job Board | `<Interview />` | Browse and post job referrals |
| Chat | `<Chat />` | Message connected users |
| Leaderboard | `<Leaderboard />` | Top 100 alumni rankings |

**Additional features:**
- Profile viewer modal for inspecting user details (skills, social links, bio)
- Responsive layout that collapses to single-column on smaller screens
- Protected route — redirects to the landing page if no user session exists

---

## Architecture

The platform follows a classic **client-server architecture** with a REST API.

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (React)                     │
│                                                         │
│  Landing Page ──► Registration ──► Dashboard            │
│                                     │                   │
│                    ┌────────────────┼────────────────┐  │
│                    │  Mentoring  Training  Jobs       │  │
│                    │  Chat       Leaderboard          │  │
│                    └────────────────┼────────────────┘  │
│                                     │                   │
│  Axios HTTP ◄──────────────────────►│                   │
└──────────────────────┬──────────────────────────────────┘
                       │  REST API (JSON)
                       │  /api/*
┌──────────────────────▼──────────────────────────────────┐
│                     SERVER (Express)                     │
│                                                         │
│  Middleware: CORS │ JSON Parser │ Static Files           │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │                  Route Handlers                  │    │
│  │  studentRoutes │ alumniRoutes │ requestRoutes    │    │
│  │  messageRoutes │ jobRoutes    │ trainingRoutes   │    │
│  └────────────────────────┬────────────────────────┘    │
│                           │                              │
│  ┌────────────────────────▼────────────────────────┐    │
│  │             Mongoose ODM (Models)               │    │
│  │  Student │ Alumni │ Request │ Message │ Job │ Training│
│  └────────────────────────┬────────────────────────┘    │
└──────────────────────────┬──────────────────────────────┘
                           │
                 ┌─────────▼─────────┐
                 │     MongoDB       │
                 │  alumni_platform  │
                 └───────────────────┘
```

**Data flow:**
1. The React client makes HTTP requests via **Axios** to the Express API
2. In development, Vite's dev server **proxies** `/api/*` and `/uploads/*` requests to `http://localhost:5123`
3. Express routes handle business logic (validation, coin calculations, status transitions)
4. Mongoose models interact with the MongoDB database
5. Responses flow back as JSON; the client updates its React state accordingly
6. Uploaded resumes are stored on the server filesystem in the `/uploads` directory and served as static files

---

## Tech Stack

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| [React](https://react.dev) | 19.2.0 | UI component library |
| [React DOM](https://react.dev) | 19.2.0 | DOM rendering for React |
| [React Router DOM](https://reactrouter.com) | 7.13.0 | Client-side routing and navigation |
| [Vite](https://vite.dev) | 7.3.1 | Build tool, dev server, and HMR |
| [Tailwind CSS](https://tailwindcss.com) | 4.1.18 | Utility-first CSS framework |
| [@tailwindcss/vite](https://tailwindcss.com) | 4.1.18 | Vite plugin for Tailwind CSS |
| [Axios](https://axios-http.com) | 1.13.5 | HTTP client for API requests |
| [ESLint](https://eslint.org) | 9.39.1 | Code linting and style enforcement |

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| [Express](https://expressjs.com) | 4.21.2 | HTTP server framework |
| [Mongoose](https://mongoosejs.com) | 8.9.5 | MongoDB object data modeling (ODM) |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | 9.0.2 | JWT creation and verification |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 2.4.3 | Password hashing (12 salt rounds) |
| [Multer](https://github.com/expressjs/multer) | 1.4.5-lts.1 | Multipart form data / file uploads |
| [cors](https://github.com/expressjs/cors) | 2.8.5 | Cross-Origin Resource Sharing middleware |
| [dotenv](https://github.com/motdotla/dotenv) | 16.4.7 | Environment variable management |

### Infrastructure

| Tool | Purpose |
|------|---------|
| [Docker](https://www.docker.com) | Container for the server (Node 18 Alpine image) |
| [MongoDB](https://www.mongodb.com) | NoSQL document database |

---

## Design System

The frontend uses a carefully crafted **glass-morphism dark theme** designed for a modern, college-focused audience.

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#6366f1` (Indigo 500) | Buttons, active states, links, brand accent |
| Secondary | `#06b6d4` (Cyan 500) | Secondary accents, floating orbs |
| Success | `#10b981` (Emerald 500) | Success states, online indicators |
| Warning | `#fbbf24` (Amber 400) | Coins, rewards, highlights |
| Background | `#0f172a` (Slate 950) | Page background |
| Surface | `rgba(30, 41, 59, 0.5)` | Card backgrounds with blur |
| Text Primary | `#f1f5f9` (Slate 100) | Headings, body text |
| Text Muted | `#94a3b8` (Slate 400) | Labels, secondary text |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Headings | Plus Jakarta Sans | 1.75rem | 700 (Bold) |
| Body | Inter | 0.875rem | 400 (Regular) |
| Labels | Inter | 0.8125rem | 500 (Medium) |
| Buttons | Inter | 0.875rem | 600 (Semi-bold) |

### UI Components

| Component | Description |
|-----------|-------------|
| **Glass Card** | Semi-transparent card with `backdrop-filter: blur(16px)`, gradient border, and subtle shadow. Darkens on hover. |
| **Primary Button** | Indigo gradient with a shimmer animation on hover. Disabled state reduces opacity. |
| **Secondary Button** | Transparent with a border; tints to primary color on hover. |
| **Form Input** | Dark background (`slate-800/50`), rounded corners, indigo focus ring with glow effect. |
| **Toast Notification** | Fixed top-right notification that slides in from the right. Green for success, red for errors. Auto-dismisses after 4 seconds. |
| **Spinner** | Rotating circular loader with a transparent top segment. Used during API calls. |
| **Phase Stepper** | Visual progress indicator for multi-step forms — shows active, completed, and pending phases. |
| **Mentor Card** | Gradient card that lifts 4px on hover with enhanced shadow. Displays avatar, name, skills as chips. |
| **Message Bubble** | Sent messages are right-aligned (primary bg, white text); received messages are left-aligned (dark bg). |

### Animations

| Name | Duration | Purpose |
|------|----------|---------|
| `float1` | 25s (infinite) | Indigo background orb that oscillates position and scale |
| `float2` | 20s (infinite) | Cyan background orb that oscillates position and scale |
| `spin` | 0.55s (infinite) | Loading spinner rotation |
| `toastIn` | 0.35s | Toast notification slide-in from the right |

### Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| > 1024px | Full layout: sidebar + main content side by side |
| ≤ 1024px | Sidebar collapses; dashboard switches to single-column layout |
| ≤ 640px | Form rows stack vertically; phase stepper labels are hidden |

---

## Project Structure

```
Alumini/
│
├── client/                           # ── FRONTEND (React + Vite) ──
│   ├── public/
│   │   └── vite.svg                  # Vite favicon
│   ├── src/
│   │   ├── assets/
│   │   │   └── react.svg            # React logo asset
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page — role selection (Student / Alumni)
│   │   │   ├── StudentRegister.jsx  # 2-phase student registration with file upload
│   │   │   ├── AlumniRegister.jsx   # 2-phase alumni registration with file upload
│   │   │   ├── StudentLogin.jsx     # Student login (roll number + password)
│   │   │   ├── AlumniLogin.jsx      # Alumni login (roll number + password)
│   │   │   ├── Dashboard.jsx        # Main dashboard — navbar, sidebar, tabbed content
│   │   │   ├── Mentoring.jsx        # Alumni browsing, filtering, and request sending
│   │   │   ├── Chat.jsx             # Two-panel messaging interface
│   │   │   ├── Interview.jsx        # Job referral board with posting modal
│   │   │   ├── TrainingPage.jsx     # Training request/acceptance/feedback system
│   │   │   └── Leaderboard.jsx      # Top 100 alumni ranked by coins
│   │   ├── App.jsx                  # Root component — defines all routes
│   │   ├── App.css                  # App-level styles
│   │   ├── main.jsx                 # React entry point — Axios base URL config
│   │   └── index.css                # Global design system — variables, components, animations
│   ├── .env.example                 # Example environment variables for the client
│   ├── .gitignore                   # Client-specific git ignore rules
│   ├── eslint.config.js             # ESLint configuration (React hooks + refresh plugins)
│   ├── index.html                   # HTML template (loads main.jsx)
│   ├── package.json                 # Client dependencies and scripts
│   └── vite.config.js               # Vite config — React plugin, Tailwind, proxy rules
│
├── server/                           # ── BACKEND (Express + MongoDB) ──
│   ├── models/
│   │   ├── Student.js               # Student schema — profile, coins (500), donated flag
│   │   ├── Alumni.js                # Alumni schema — profile, job info, coins (0)
│   │   ├── Request.js               # Mentorship request — polymorphic sender/recipient
│   │   ├── Message.js               # Chat message — polymorphic sender/recipient
│   │   ├── Job.js                   # Job posting — company, role, referral email
│   │   └── Training.js              # Training request — skill, coin range, feedback status
│   ├── routes/
│   │   ├── studentRoutes.js         # POST register, login, donate
│   │   ├── alumniRoutes.js          # POST register, login, give-coins; GET all, search, leaderboard
│   │   ├── requestRoutes.js         # POST send, action, remove-mentor; GET user/:userId
│   │   ├── messageRoutes.js         # POST send; GET /:userId1/:userId2
│   │   ├── jobRoutes.js             # POST add; GET all
│   │   └── trainingRoutes.js        # POST create, accept, feedback; GET all
│   ├── uploads/                     # Resume file storage (served as static files)
│   │   └── .gitkeep                 # Keeps the empty directory in version control
│   ├── .dockerignore                # Docker build ignore rules
│   ├── Dockerfile                   # Docker image definition (Node 18 Alpine)
│   ├── index.js                     # Server entry — Express app, middleware, MongoDB connection
│   ├── package.json                 # Server dependencies and scripts
│   └── package-lock.json            # Locked dependency tree for reproducible installs
│
├── .gitignore                       # Root git ignore (node_modules, .env, dist, uploads/*)
└── README.md                        # This file
```

---

## Getting Started

### Prerequisites

| Requirement | Minimum Version | Notes |
|-------------|----------------|-------|
| **Node.js** | 18.x | Required for both client and server |
| **npm** | 9.x | Comes with Node.js |
| **MongoDB** | 6.x | Local install, Docker, or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) |
| **Git** | 2.x | To clone the repository |

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/Rishi5377/Alumini.git
cd Alumini

# 2. Navigate to the server directory
cd server

# 3. Install dependencies
npm install

# 4. Create environment file
cat > .env << EOF
PORT=5123
MONGO_URI=mongodb://localhost:27017/alumni_platform
JWT_SECRET=your_super_secret_key_change_this
FRONTEND_URL=http://localhost:5173
EOF

# 5. Make sure MongoDB is running, then start the server
npm start
```

You should see:
```
MongoDB connected
Server running on port 5123
```

The API is now available at **http://localhost:5123**. Verify it with:
```bash
curl http://localhost:5123/api/health
# → {"status":"ok"}
```

### Frontend Setup

Open a **new terminal** (keep the server running):

```bash
# 1. Navigate to the client directory
cd Alumini/client

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env if your API server is on a different URL

# 4. Start the development server
npm run dev
```

The frontend is now available at **http://localhost:5173**. The Vite dev server automatically proxies all `/api/*` and `/uploads/*` requests to the backend.

### Running Both Together

For everyday development, you'll need **two terminal windows**:

| Terminal | Directory | Command | URL |
|----------|-----------|---------|-----|
| Terminal 1 | `server/` | `npm start` | http://localhost:5123 |
| Terminal 2 | `client/` | `npm run dev` | http://localhost:5173 |

### Available Scripts

#### Server Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Express server (`node index.js`) |
| `npm run dev` | Start the Express server (same as `start`) |

#### Client Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server on port **5173** with HMR |
| `npm run dev:student` | Start the Vite dev server on port **5174** (for multi-window testing) |
| `npm run build` | Create a production-optimized build in `dist/` |
| `npm run preview` | Serve the production build locally for verification |
| `npm run lint` | Run ESLint to check for code style issues |

### Docker Setup

A Dockerfile is provided for containerizing the backend server.

```bash
cd server

# Build the Docker image
docker build -t alumni-platform-server .

# Run the container
docker run -p 5123:5123 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/alumni_platform \
  -e JWT_SECRET=your_super_secret_key_change_this \
  -e FRONTEND_URL=http://localhost:5173 \
  alumni-platform-server
```

**Dockerfile details:**
- **Base image:** `node:18-alpine` (lightweight, ~50 MB)
- **Working directory:** `/app`
- **Exposed port:** `5123`
- **Startup command:** `npm start`

> **Tip:** If your MongoDB is also in Docker, use `docker network create` to put both containers on the same network and reference MongoDB by its container name instead of `host.docker.internal`.

---

## Environment Variables

### Server (`server/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5123` | Port the API server listens on |
| `MONGO_URI` | No | `mongodb://localhost:27017/alumni_platform` | MongoDB connection string. Supports local, Docker, and Atlas URIs. |
| `JWT_SECRET` | **Yes** | — | Secret key used to sign and verify JWT tokens. Use a long, random string. |
| `FRONTEND_URL` | No | `http://localhost:5173` | Allowed CORS origin. Set to your frontend's production URL when deploying. |

### Client (`client/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | No | `http://localhost:5123` | Base URL of the API server. Used by Axios for requests outside the dev proxy. |

> **Note:** All client environment variables must be prefixed with `VITE_` to be accessible in the browser bundle. See [Vite Env Variables](https://vite.dev/guide/env-and-mode.html).

---

## Page-by-Page UI Guide

### 🏠 Home Page (`/`)

The landing page welcomes visitors with the platform's branding and a role selection interface.

- **Brand header** with 🎓 emoji and "Alumni Connect" title
- **Two role cards** — "Student" and "Alumni" — each with an icon, a short description, and a hover animation (gradient bar scales in)
- **Continue button** that routes to the appropriate registration page
- **Footer links** to login pages for returning users
- Styled as a centered glass card (max width 580px) over an animated gradient background

### 📝 Registration Pages (`/student/register`, `/alumni/register`)

Both registration pages use a **two-phase stepper** form with a visual progress indicator at the top.

**Phase 1 — Personal Info:**
- Name, Roll Number, Year (dropdown), LinkedIn URL, GitHub URL, Phone, Password, Confirm Password
- Alumni also enter: Job Description and Experience
- Validation: required fields, minimum 6-character password, password confirmation match

**Phase 2 — Profile:**
- About / Bio (textarea)
- Skills (comma-separated input that converts to an array on submit)
- Resume upload with drag-and-drop area
- Submit button with loading spinner

**UX details:**
- Phase navigation with back/next buttons
- Toast notifications for errors and success (slide in from right, auto-dismiss in 4s)
- On successful registration: JWT stored in `localStorage` → redirect to Dashboard

### 🔑 Login Pages (`/student/login`, `/alumni/login`)

Minimalist glass card (max width 420px) centered on the page.

- Role-specific emoji header (🎓 for student, 💼 for alumni)
- Roll Number + Password fields
- Submit button shows a spinner with "Signing in…" text while loading
- Link to registration page for new users
- On success: JWT + user data stored in `localStorage` → redirect to Dashboard

### 📊 Dashboard (`/dashboard`)

The main application shell with a **fixed navbar**, **sidebar**, and **dynamic content area**.

- **Navbar:** Brand logo "🎓 AlumniConnect" + 6 navigation tabs + Sign Out button
- **Sidebar (280px):** User avatar (emoji-based), name, role badge, coin balance (🪙), and quick action buttons
- **Content:** Renders the selected tab's full-page component
- **Overview tab:** Hero banner, 2-column grid showing recent activity and pending requests or connected mentors
- **Protected route:** Automatically redirects to `/` if no user is found in `localStorage`

---

## Authentication Flow

### Registration

```
User selects role (Student/Alumni)
        │
        ▼
Phase 1: Personal info form
        │
        ▼
Phase 2: Profile + resume upload
        │
        ▼
POST /api/{students|alumni}/register  (multipart/form-data)
        │
        ▼
Server: Validate fields → Hash password (bcrypt, 12 rounds) → Save to MongoDB
        │
        ▼
Server: Generate JWT { id, role } with 7-day expiry → Return token + user object
        │
        ▼
Client: Store token and user in localStorage → Redirect to /dashboard
```

### Login

```
User enters Roll Number + Password
        │
        ▼
POST /api/{students|alumni}/login
        │
        ▼
Server: Find user by rollNumber → bcrypt.compare(password, hash)
        │
        ▼
Server: If valid → Generate JWT → Return token + user (with coins)
        │
        ▼
Client: Store in localStorage → Redirect to /dashboard
```

### Session Persistence

- The JWT token is stored in `localStorage` as `"token"`
- User data (id, name, role, coins) is stored in `localStorage` as `"user"` (JSON string)
- On page load, the Dashboard checks `localStorage` for a user object; if absent, it redirects to the home page
- **Logout** clears `localStorage` and redirects to `/`

### JWT Token Structure

```json
{
  "id": "665f1a2b3c4d5e6f7a8b9c0d",
  "role": "student",
  "iat": 1717430000,
  "exp": 1718034800
}
```

- **Algorithm:** HS256
- **Expiry:** 7 days
- **Signed with:** `JWT_SECRET` environment variable

---

## Coin Economy & Gamification

The coin economy is central to the platform's engagement model. It creates a measurable way to recognize alumni contributions and incentivize high-quality mentorship.

### Economy Rules

```
┌────────────────────────────────────────────────────────┐
│                    COIN FLOW DIAGRAM                   │
│                                                        │
│   STUDENT (starts with 500 coins)                      │
│   ├── Donate to alumni ──────► ALUMNI (+1 to +50)      │
│   └── Training fee ──────────► ALUMNI (+min or +max)   │
│                                                        │
│   ALUMNI (starts with 0 coins)                         │
│   ├── Post job referral ─────► +100 coins              │
│   ├── Training (satisfied) ──► +maxCoins from student  │
│   ├── Training (dissatisfied)► +minCoins from student  │
│   └── Receive donation ─────► +1 to +50 from student  │
│                                                        │
│   LEADERBOARD                                          │
│   └── Top 100 alumni ranked by total coins earned      │
│       └── Top 3 highlighted with 🏆 gold styling       │
└────────────────────────────────────────────────────────┘
```

### Detailed Breakdown

| Event | Student Effect | Alumni Effect | Condition |
|-------|---------------|---------------|-----------|
| Student registers | +500 coins | — | Automatic |
| Alumni registers | — | 0 coins | Automatic |
| Student donates to alumni | −amount | +amount | One-time only; max 50 coins |
| Alumni posts a job | — | +100 | Per job posting |
| Training completed (satisfied) | −maxCoins | +maxCoins | Student marks as satisfied |
| Training completed (dissatisfied) | −minCoins | +minCoins | Student marks as dissatisfied |

### Leaderboard Mechanics

- Sorted by `coins` field in descending order
- Limited to top 100 alumni
- Updates whenever coins change (job posting, training feedback, donation)
- Top 3 positions get special gold styling with trophy emoji
- Displays: rank, alumni name, job description, skill list, coin count

---

## API Reference

**Base URL:** `http://localhost:5123`

All endpoints return JSON. Multipart endpoints (register) accept `multipart/form-data`.

---

### Health Check

#### `GET /api/health`

Check if the server is running.

**Response:**
```json
{
  "status": "ok"
}
```

---

### Student Endpoints

#### `POST /api/students/register`

Register a new student. Accepts `multipart/form-data` for resume upload.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Full name |
| `rollNumber` | string | Yes | Unique roll number (used as login ID) |
| `presentYear` | string | Yes | Current year of study |
| `linkedinUrl` | string | No | LinkedIn profile URL |
| `githubUrl` | string | No | GitHub profile URL |
| `phoneNumber` | string | No | Contact number |
| `password` | string | Yes | Min 6 characters; hashed server-side |
| `about` | string | No | Short bio / about section |
| `skills` | string | No | Comma-separated skills (parsed to array) |
| `resume` | file | No | Resume file (PDF, DOC, etc.) |

**Response** `200 OK`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "665f1a2b3c4d5e6f7a8b9c0d",
    "name": "Jane Doe",
    "rollNumber": "CS2024001",
    "role": "student"
  }
}
```

---

#### `POST /api/students/login`

Authenticate an existing student.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rollNumber` | string | Yes | Registered roll number |
| `password` | string | Yes | Account password |

**Response** `200 OK`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "665f1a2b3c4d5e6f7a8b9c0d",
    "name": "Jane Doe",
    "rollNumber": "CS2024001",
    "role": "student",
    "coins": 500
  }
}
```

**Error** `400`:
```json
{
  "message": "Invalid credentials"
}
```

---

#### `POST /api/students/donate`

Donate coins from a student to an alumni. One-time only, max 50 coins.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `studentId` | string | Yes | Student's MongoDB ObjectId |
| `alumniId` | string | Yes | Alumni's MongoDB ObjectId |
| `amount` | number | Yes | Coins to donate (1–50) |

**Response** `200 OK`:
```json
{
  "message": "Donation successful"
}
```

**Error** `400`:
```json
{
  "message": "Already donated"
}
```

---

### Alumni Endpoints

#### `POST /api/alumni/register`

Register a new alumni. Accepts `multipart/form-data` for resume upload.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Full name |
| `rollNumber` | string | Yes | Unique roll number |
| `passedYear` | string | Yes | Graduation year |
| `linkedinUrl` | string | No | LinkedIn profile URL |
| `githubUrl` | string | No | GitHub profile URL |
| `phoneNumber` | string | No | Contact number |
| `password` | string | Yes | Min 6 characters |
| `about` | string | No | Short bio |
| `jobDescription` | string | No | Current job title / description |
| `experience` | string | No | Years / details of experience |
| `skills` | string | No | Comma-separated skills |
| `resume` | file | No | Resume file |

**Response** `200 OK`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "665f2b3c4d5e6f7a8b9c0e1",
    "name": "John Smith",
    "rollNumber": "CS2020042",
    "role": "alumni"
  }
}
```

---

#### `POST /api/alumni/login`

Authenticate an existing alumni.

**Request Body:**

| Field | Type | Required |
|-------|------|----------|
| `rollNumber` | string | Yes |
| `password` | string | Yes |

**Response:** Same structure as student login, with `role: "alumni"`.

---

#### `GET /api/alumni/all`

Retrieve all registered alumni. Passwords are excluded from the response.

**Response** `200 OK`:
```json
[
  {
    "_id": "665f2b3c4d5e6f7a8b9c0e1",
    "name": "John Smith",
    "rollNumber": "CS2020042",
    "passedYear": "2020",
    "jobDescription": "Software Engineer at Google",
    "experience": "4 years",
    "skills": ["JavaScript", "React", "Node.js"],
    "coins": 350,
    "linkedinUrl": "https://linkedin.com/in/johnsmith",
    "createdAt": "2024-06-01T10:00:00.000Z"
  }
]
```

---

#### `GET /api/alumni/search`

Search alumni by company, skills, or experience.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `company` | string | Filter by company name (matches against `jobDescription`) |
| `skills` | string | Filter by skill keyword |
| `experience` | string | Filter by experience |

**Example:** `GET /api/alumni/search?company=Google&skills=React`

**Response:** Filtered array of alumni objects (same structure as `/api/alumni/all`).

---

#### `GET /api/alumni/leaderboard`

Get the top 100 alumni sorted by coins in descending order.

**Response** `200 OK`:
```json
[
  {
    "_id": "665f...",
    "name": "Top Alumni",
    "jobDescription": "Senior Engineer",
    "skills": ["Python", "ML"],
    "coins": 850
  }
]
```

---

#### `POST /api/alumni/give-coins`

Award coins to an alumni (used internally by the system).

**Request Body:**

| Field | Type | Required |
|-------|------|----------|
| `alumniId` | string | Yes |
| `amount` | number | Yes |

---

### Mentorship Request Endpoints

#### `POST /api/requests/send`

Send a mentorship request from one user to another.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `senderId` | string | Yes | Sender's MongoDB ObjectId |
| `senderModel` | string | Yes | `"Student"` or `"Alumni"` |
| `recipientId` | string | Yes | Recipient's MongoDB ObjectId |
| `recipientModel` | string | Yes | `"Student"` or `"Alumni"` |
| `message` | string | No | Personal message to the recipient |

**Response** `201 Created`:
```json
{
  "message": "Request sent",
  "request": {
    "_id": "665f...",
    "sender": "665f1a...",
    "recipient": "665f2b...",
    "status": "pending",
    "message": "I'd love to learn from your experience at Google!"
  }
}
```

---

#### `GET /api/requests/user/:userId`

Get all mentorship requests (sent and received) for a user.

**Response** `200 OK`:
```json
[
  {
    "_id": "665f...",
    "sender": { "_id": "...", "name": "Jane Doe", "rollNumber": "CS2024001" },
    "senderModel": "Student",
    "recipient": { "_id": "...", "name": "John Smith", "rollNumber": "CS2020042" },
    "recipientModel": "Alumni",
    "status": "pending",
    "message": "Would love to connect!",
    "createdAt": "2024-06-01T10:00:00.000Z"
  }
]
```

---

#### `POST /api/requests/action`

Accept or reject a mentorship request.

**Request Body:**

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `requestId` | string | Yes | MongoDB ObjectId of the request |
| `action` | string | Yes | `"accepted"` or `"rejected"` |

---

#### `POST /api/requests/remove-mentor`

Remove an existing mentor/mentee connection.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `requestId` | string | Yes | The request to revoke |
| `reason` | string | No | Reason for removal |

---

### Messaging Endpoints

#### `POST /api/messages/send`

Send a message to another user (requires an accepted mentorship connection).

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `senderId` | string | Yes | Sender's ObjectId |
| `senderModel` | string | Yes | `"Student"` or `"Alumni"` |
| `recipientId` | string | Yes | Recipient's ObjectId |
| `recipientModel` | string | Yes | `"Student"` or `"Alumni"` |
| `text` | string | Yes | Message content |

**Response** `201 Created`:
```json
{
  "message": "Message sent",
  "data": {
    "_id": "665f...",
    "sender": "665f1a...",
    "recipient": "665f2b...",
    "text": "Hi! Thanks for accepting my request.",
    "read": false,
    "createdAt": "2024-06-01T12:30:00.000Z"
  }
}
```

---

#### `GET /api/messages/:userId1/:userId2`

Get the full conversation between two users. Returns messages in both directions sorted by creation time.

**Response** `200 OK`:
```json
[
  {
    "_id": "665f...",
    "sender": "665f1a...",
    "senderModel": "Student",
    "recipient": "665f2b...",
    "recipientModel": "Alumni",
    "text": "Hi! Thanks for the mentorship.",
    "read": false,
    "createdAt": "2024-06-01T12:30:00.000Z"
  },
  {
    "_id": "665g...",
    "sender": "665f2b...",
    "senderModel": "Alumni",
    "recipient": "665f1a...",
    "recipientModel": "Student",
    "text": "Happy to help! What questions do you have?",
    "read": false,
    "createdAt": "2024-06-01T12:31:00.000Z"
  }
]
```

---

### Job Endpoints

#### `POST /api/jobs/add`

Post a new job opportunity. Awards +100 coins to the posting alumni.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `postedBy` | string | Yes | Alumni's MongoDB ObjectId |
| `company` | string | Yes | Company name |
| `role` | string | Yes | Job role / title |
| `description` | string | Yes | Job description |
| `link` | string | Yes | Application link / URL |
| `referralEmail` | string | Yes | Referral contact email |

**Response** `201 Created`:
```json
{
  "message": "Job posted successfully",
  "job": {
    "_id": "665f...",
    "postedBy": "665f2b...",
    "company": "Google",
    "role": "Frontend Engineer",
    "description": "Join our team to build the next generation of web experiences.",
    "link": "https://careers.google.com/...",
    "referralEmail": "john.smith@google.com",
    "createdAt": "2024-06-01T14:00:00.000Z"
  }
}
```

---

#### `GET /api/jobs/all`

Get all job postings, sorted by newest first. Populates the `postedBy` field with alumni details.

**Response** `200 OK`:
```json
[
  {
    "_id": "665f...",
    "postedBy": {
      "_id": "665f2b...",
      "name": "John Smith",
      "rollNumber": "CS2020042"
    },
    "company": "Google",
    "role": "Frontend Engineer",
    "description": "Join our team...",
    "link": "https://careers.google.com/...",
    "referralEmail": "john.smith@google.com",
    "createdAt": "2024-06-01T14:00:00.000Z"
  }
]
```

---

### Training Endpoints

#### `POST /api/training/create`

Create a new training request (students only).

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `studentId` | string | Yes | Student's MongoDB ObjectId |
| `skill` | string | Yes | Skill the student wants to learn |
| `minCoins` | number | Yes | Minimum coin reward for the trainer |
| `maxCoins` | number | Yes | Maximum coin reward for the trainer |

**Response** `201 Created`:
```json
{
  "message": "Training request created",
  "training": {
    "_id": "665f...",
    "student": "665f1a...",
    "skill": "Machine Learning",
    "minCoins": 20,
    "maxCoins": 80,
    "status": "pending"
  }
}
```

---

#### `GET /api/training/all`

Get all training requests. Populates student and alumni references.

---

#### `POST /api/training/accept`

Alumni accepts a training request.

**Request Body:**

| Field | Type | Required |
|-------|------|----------|
| `trainingId` | string | Yes |
| `alumniId` | string | Yes |

Sets the training's `alumni` field and changes `status` to `"accepted"`.

---

#### `POST /api/training/feedback`

Student submits feedback after training. Triggers coin transfer.

**Request Body:**

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `trainingId` | string | Yes | MongoDB ObjectId |
| `feedback` | string | Yes | `"satisfied"` or `"dissatisfied"` |

**Business logic:**
- If `"satisfied"` → Transfer **maxCoins** from student to alumni; status = `"satisfied"`
- If `"dissatisfied"` → Transfer **minCoins** from student to alumni; status = `"dissatisfied"`

---

## Database Schema

The platform uses **MongoDB** with **Mongoose** as the ODM. All models include automatic `createdAt` and `updatedAt` timestamps.

### Student Model

**Collection:** `students`

| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `name` | String | ✅ | | | Full name |
| `rollNumber` | String | ✅ | ✅ | | Unique login identifier |
| `presentYear` | String | ✅ | | | Current year of study |
| `linkedinUrl` | String | | | | LinkedIn profile URL |
| `githubUrl` | String | | | | GitHub profile URL |
| `phoneNumber` | String | | | | Contact phone number |
| `password` | String | ✅ | | | Hashed with bcrypt (12 rounds) |
| `about` | String | | | | Bio / about section |
| `skills` | [String] | | | `[]` | Array of skill keywords |
| `resume` | String | | | | Filename of uploaded resume |
| `coins` | Number | | | `500` | Current coin balance |
| `donated` | Boolean | | | `false` | Whether student has donated |

**Pre-save hook:** Hashes the `password` field using `bcryptjs` with 12 salt rounds before saving to the database.

---

### Alumni Model

**Collection:** `alumnis`

| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `name` | String | ✅ | | | Full name |
| `rollNumber` | String | ✅ | ✅ | | Unique login identifier |
| `passedYear` | String | ✅ | | | Graduation year |
| `linkedinUrl` | String | | | | LinkedIn profile URL |
| `githubUrl` | String | | | | GitHub profile URL |
| `phoneNumber` | String | | | | Contact phone number |
| `password` | String | ✅ | | | Hashed with bcrypt (12 rounds) |
| `about` | String | | | | Bio / about section |
| `jobDescription` | String | | | | Current role / company |
| `experience` | String | | | | Years or details of experience |
| `skills` | [String] | | | `[]` | Array of skill keywords |
| `coins` | Number | | | `0` | Current coin balance |
| `resume` | String | | | | Filename of uploaded resume |

---

### Request Model

**Collection:** `requests`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `sender` | ObjectId | ✅ | | Reference (polymorphic via `senderModel`) |
| `senderModel` | String | ✅ | | `"Student"` or `"Alumni"` |
| `recipient` | ObjectId | ✅ | | Reference (polymorphic via `recipientModel`) |
| `recipientModel` | String | ✅ | | `"Student"` or `"Alumni"` |
| `status` | String | | `"pending"` | One of: `"pending"`, `"accepted"`, `"rejected"` |
| `message` | String | | | Personal message from sender |
| `removalReason` | String | | | Reason if mentor was removed |

**Polymorphic references:** Uses Mongoose `refPath` so both Student and Alumni documents can be referenced in the same field.

---

### Message Model

**Collection:** `messages`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `sender` | ObjectId | ✅ | | Reference (polymorphic) |
| `senderModel` | String | ✅ | | `"Student"` or `"Alumni"` |
| `recipient` | ObjectId | ✅ | | Reference (polymorphic) |
| `recipientModel` | String | ✅ | | `"Student"` or `"Alumni"` |
| `text` | String | ✅ | | Message content |
| `read` | Boolean | | `false` | Read receipt flag |

---

### Job Model

**Collection:** `jobs`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `postedBy` | ObjectId | ✅ | Reference to Alumni |
| `company` | String | ✅ | Company name |
| `role` | String | ✅ | Job title |
| `description` | String | ✅ | Job description |
| `link` | String | ✅ | Application URL |
| `referralEmail` | String | ✅ | Contact email for referral |

---

### Training Model

**Collection:** `trainings`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `student` | ObjectId | ✅ | | Reference to Student |
| `alumni` | ObjectId | | `null` | Reference to Alumni (set on accept) |
| `skill` | String | ✅ | | Skill to be taught |
| `minCoins` | Number | ✅ | | Minimum coin reward |
| `maxCoins` | Number | ✅ | | Maximum coin reward |
| `status` | String | | `"pending"` | One of: `"pending"`, `"accepted"`, `"satisfied"`, `"dissatisfied"` |

**Status transitions:**
```
pending ──► accepted ──► satisfied
                    └──► dissatisfied
```

---

### Entity Relationship Overview

```
┌──────────┐         ┌──────────┐
│ Student  │◄───────►│  Alumni  │
└────┬─────┘         └────┬─────┘
     │                     │
     │  ┌──────────────┐   │
     ├─►│   Request    │◄──┤   (polymorphic sender/recipient)
     │  └──────────────┘   │
     │                     │
     │  ┌──────────────┐   │
     ├─►│   Message    │◄──┤   (polymorphic sender/recipient)
     │  └──────────────┘   │
     │                     │
     │  ┌──────────────┐   │
     └─►│  Training    │◄──┘   (student creates, alumni accepts)
        └──────────────┘
                │
        ┌───────┘
        │
     ┌──▼───────────┐
     │     Job      │◄──── Alumni (postedBy)
     └──────────────┘
```

- **Student ↔ Alumni:** Connected via Request (mentorship) and Message (chat)
- **Student → Training:** Student creates training requests
- **Alumni → Training:** Alumni accepts and fulfills training
- **Alumni → Job:** Alumni posts job referrals
- **Polymorphic refs:** Request and Message use `refPath` to reference either Student or Alumni collections

---

## Deployment

### Option 1: Deploy on a VPS (DigitalOcean, AWS EC2, etc.)

```bash
# 1. SSH into your server and clone the repo
git clone https://github.com/Rishi5377/Alumini.git
cd Alumini

# 2. Set up the backend
cd server
npm install --production
cp .env.example .env  # Create and configure your .env
# Set MONGO_URI to your production MongoDB (e.g., Atlas)
# Set JWT_SECRET to a secure random string
# Set FRONTEND_URL to your frontend's domain

# 3. Start the server (use pm2 for production)
npm install -g pm2
pm2 start index.js --name alumni-server

# 4. Set up the frontend
cd ../client
npm install
echo "VITE_API_BASE_URL=https://your-api-domain.com" > .env
npm run build

# 5. Serve the built frontend with nginx or similar
# Copy dist/ to your web server's root directory
```

### Option 2: Docker Deployment

```bash
# Build and run the server container
cd server
docker build -t alumni-server .
docker run -d \
  --name alumni-server \
  -p 5123:5123 \
  -e MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/alumni_platform \
  -e JWT_SECRET=your_production_secret \
  -e FRONTEND_URL=https://your-frontend-domain.com \
  alumni-server

# Build the frontend (static files)
cd ../client
npm install && npm run build
# Deploy dist/ to a CDN or static hosting (Vercel, Netlify, S3, etc.)
```

### Option 3: MongoDB Atlas (Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free cluster
2. Create a database user and whitelist your server's IP (or use `0.0.0.0/0` for development)
3. Copy the connection string and set it as `MONGO_URI` in your server's `.env`
4. The connection string looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/alumni_platform`

---

## Troubleshooting

### Common Issues

<details>
<summary><strong>MongoDB connection failed</strong></summary>

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check your `MONGO_URI` in the `.env` file
- For Atlas: verify IP whitelist and credentials
- For Docker: use `host.docker.internal` instead of `localhost`
</details>

<details>
<summary><strong>CORS errors in the browser</strong></summary>

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solutions:**
- Ensure `FRONTEND_URL` in server `.env` matches your client's origin exactly (including port)
- In development, Vite's proxy should handle this — check `vite.config.js`
- Clear browser cache and restart the dev server
</details>

<details>
<summary><strong>File upload fails</strong></summary>

**Error:** `LIMIT_UNEXPECTED_FILE` or upload returns 500

**Solutions:**
- Ensure the `uploads/` directory exists in the server folder
- Check that the form field name for the file matches what Multer expects (`resume`)
- Verify file size is within limits
</details>

<details>
<summary><strong>JWT token errors</strong></summary>

**Error:** `JsonWebTokenError: invalid signature`

**Solutions:**
- Ensure `JWT_SECRET` is the same value that was used to create the token
- Clear `localStorage` in the browser and log in again
- Check that the token hasn't expired (7-day validity)
</details>

<details>
<summary><strong>Port already in use</strong></summary>

**Error:** `EADDRINUSE: address already in use :::5123`

**Solutions:**
- Kill the existing process: `lsof -i :5123` then `kill -9 <PID>`
- Change the `PORT` in the `.env` file
- For the client: use `npm run dev:student` to run on port 5174 instead
</details>

<details>
<summary><strong>Vite proxy not working</strong></summary>

**Error:** API requests return 404 or the HTML page instead of JSON

**Solutions:**
- Ensure the backend server is running on port 5123
- Check `vite.config.js` proxy target matches your server URL
- Restart the Vite dev server after making config changes
</details>

---

## Roadmap

The platform has a solid foundation. Here are potential enhancements organized by priority:

### 🔴 High Priority

- [ ] **JWT middleware** — Add token verification middleware to protect API routes
- [ ] **Input validation** — Add server-side validation with Zod or Joi for all endpoints
- [ ] **Rate limiting** — Prevent brute-force attacks on login endpoints
- [ ] **Error handling middleware** — Centralized Express error handler with consistent error responses

### 🟡 Medium Priority

- [ ] **WebSocket messaging** — Replace polling with Socket.IO for instant message delivery
- [ ] **Email notifications** — Notify users of new mentorship requests, messages, and job postings
- [ ] **Password reset** — "Forgot password" flow with email verification
- [ ] **Profile editing** — Allow users to update their profiles after registration
- [ ] **Admin panel** — Dashboard for platform administrators to manage users, content, and analytics

### 🟢 Nice to Have

- [ ] **Unit & integration tests** — Jest/Vitest for frontend, Mocha/Jest for backend API
- [ ] **CI/CD pipeline** — GitHub Actions for automated testing, linting, and deployment
- [ ] **Dark/light theme toggle** — User-selectable theme preference
- [ ] **File type validation** — Restrict resume uploads to PDF/DOC formats
- [ ] **Pagination** — Add pagination to alumni list, job board, and training marketplace
- [ ] **Search improvements** — Full-text search with MongoDB text indexes
- [ ] **Analytics dashboard** — Track platform usage metrics (active users, messages sent, jobs posted)
- [ ] **Mobile app** — React Native companion app

---

## Contributing

Contributions are welcome and appreciated! Whether it's fixing a bug, adding a feature, improving documentation, or suggesting an idea — every contribution helps.

### Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/your-username/Alumini.git
   cd Alumini
   ```
3. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make** your changes following the coding conventions below
5. **Test** your changes locally (both backend and frontend)
6. **Commit** with a descriptive message:
   ```bash
   git commit -m "feat: add email notifications for mentorship requests"
   ```
7. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open** a Pull Request against the `main` branch

### Coding Conventions

- **Frontend:** Functional React components with hooks; Tailwind CSS for styling; Axios for API calls
- **Backend:** Express route handlers; Mongoose for database operations; async/await pattern
- **Naming:** camelCase for variables and functions; PascalCase for React components and Mongoose models
- **Files:** One component per file; route files named `{resource}Routes.js`; models named in singular PascalCase

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

| Prefix | Usage |
|--------|-------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Formatting, missing semicolons, etc. |
| `refactor:` | Code restructuring without feature changes |
| `test:` | Adding or updating tests |
| `chore:` | Build process, dependency updates |

### Ideas for Contribution

Looking for something to work on? Here are some beginner-friendly and advanced ideas:

**Beginner:**
- Improve error messages in API responses
- Add loading skeletons to page components
- Add input character limits and validation feedback
- Improve mobile responsiveness

**Intermediate:**
- Implement JWT verification middleware for protected routes
- Add pagination to the alumni list and job board
- Create a profile editing page
- Add file type validation for resume uploads

**Advanced:**
- Replace message polling with Socket.IO for real-time chat
- Build an admin panel with user management
- Set up a CI/CD pipeline with GitHub Actions
- Add end-to-end tests with Playwright or Cypress

---

## Security Considerations

This project is a **learning/portfolio application**. Before deploying to production, consider addressing the following:

| Area | Current State | Recommended Improvement |
|------|--------------|------------------------|
| **Route protection** | API routes do not verify JWT tokens | Add `auth` middleware that validates tokens on every protected route |
| **Input validation** | Minimal server-side validation | Use Zod or Joi to validate all request bodies |
| **Rate limiting** | No rate limiting | Add `express-rate-limit` to prevent brute-force attacks |
| **Password policy** | Minimum 6 characters | Enforce stronger passwords (uppercase, numbers, special characters) |
| **File uploads** | Accepts any file type | Restrict to PDF/DOC; validate file content, not just extension |
| **CORS** | Allows multiple hardcoded origins | Tighten to a single production origin when deploying |
| **Token storage** | JWT stored in `localStorage` | Consider `httpOnly` cookies for better XSS protection |
| **Error messages** | Some errors expose internal details | Sanitize error responses in production |
| **Dependencies** | All up-to-date as of initial release | Run `npm audit` regularly and update as needed |

---

## License

This project is open source and available under the [MIT License](LICENSE).
