# 🎓 Alumni-Student Mentorship Platform

A full-stack web application that bridges the gap between **alumni** and **current students** through structured mentorship, real-time messaging, job referrals, skill-based training, and a gamified coin economy.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Docker Setup](#docker-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The **Alumni-Student Mentorship Platform** is designed for colleges and universities to foster meaningful connections between students and alumni. Students can find mentors, request guidance, chat in real time, browse job referrals, and request skill-based training — all within a single platform. A built-in **coin economy** and **leaderboard** gamify the experience, rewarding alumni who actively contribute to the community.

---

## Features

### 🔐 Authentication & Registration
- Separate registration flows for **Students** and **Alumni** with a two-phase form (personal info → profile details)
- JWT-based authentication with secure password hashing (bcrypt, 12 salt rounds)
- Roll-number-based login as a unique identifier
- Resume upload support during registration

### 🤝 Mentorship System
- Browse all registered alumni with filters by **company**, **skills**, and **experience**
- Send mentorship requests with a custom message
- Accept or reject incoming requests
- Remove a mentor with a reason

### 💬 Real-Time Messaging
- Direct messaging between connected mentors and mentees
- Auto-refreshing conversation view (polling every 3 seconds)
- Conversations scoped to accepted mentorship connections only

### 💼 Job Referral Board
- Alumni can post job opportunities with company, role, description, and referral email
- All users can browse the job board
- Alumni earn **+100 coins** for every job posted

### 📚 Training Marketplace
- Students can request training for specific skills and set a coin range (min/max)
- Alumni can accept training requests
- After training, a feedback loop determines coin transfer:
  - **Satisfied** → alumni receive the max coin amount
  - **Dissatisfied** → alumni receive the min coin amount

### 🏆 Leaderboard
- Top 100 alumni ranked by coins earned
- Displays name, roll number, job description, skills, and coin count
- Encourages active participation and community contribution

### 🪙 Coin Economy
| Role    | Starting Coins | Earning Methods                          |
|---------|---------------|------------------------------------------|
| Student | 500           | —                                        |
| Alumni  | 0             | Job postings (+100), training, donations |

- Students can make a **one-time donation** of up to 50 coins to an alumni
- Coins transfer dynamically based on training feedback

### 📊 Dashboard
- Centralized hub with tabbed navigation: **Mentoring · Chat · Interview · Training · Leaderboard**
- Manage requests, view connections, and access all features from one place

---

## Tech Stack

| Layer        | Technology                                                     |
|--------------|----------------------------------------------------------------|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, React Router DOM 7, Axios   |
| **Backend**  | Node.js, Express 4, Mongoose 8 (MongoDB ODM)                  |
| **Database** | MongoDB                                                        |
| **Auth**     | JSON Web Tokens (jsonwebtoken), bcryptjs                       |
| **Uploads**  | Multer (resume file handling)                                  |
| **Infra**    | Docker (server Dockerfile included)                            |

---

## Project Structure

```
Alumini/
├── client/                        # React frontend
│   ├── src/
│   │   ├── App.jsx                # Root component with routing
│   │   ├── main.jsx               # Entry point with Axios defaults
│   │   ├── index.css              # Global styles & CSS variables
│   │   └── pages/
│   │       ├── Home.jsx           # Landing page with role selection
│   │       ├── StudentRegister.jsx
│   │       ├── AlumniRegister.jsx
│   │       ├── StudentLogin.jsx
│   │       ├── AlumniLogin.jsx
│   │       ├── Dashboard.jsx      # Main dashboard with tabs
│   │       ├── Mentoring.jsx      # Alumni browser & request system
│   │       ├── Chat.jsx           # Real-time messaging
│   │       ├── Interview.jsx      # Job posting & browsing
│   │       ├── TrainingPage.jsx   # Training request & acceptance
│   │       └── Leaderboard.jsx    # Top alumni by coins
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── server/                        # Express backend
│   ├── index.js                   # Server entry point
│   ├── models/
│   │   ├── Student.js
│   │   ├── Alumni.js
│   │   ├── Request.js
│   │   ├── Message.js
│   │   ├── Job.js
│   │   └── Training.js
│   ├── routes/
│   │   ├── studentRoutes.js
│   │   ├── alumniRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── jobRoutes.js
│   │   └── trainingRoutes.js
│   ├── uploads/                   # Resume file storage
│   ├── Dockerfile
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **MongoDB** (local instance or a hosted service such as MongoDB Atlas)
- **npm** (comes with Node.js)

### Backend Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file (see Environment Variables section below)

# Start the server
npm start
```

The API server will be available at `http://localhost:5123`.

### Frontend Setup

```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Copy the example environment file and edit as needed
cp .env.example .env

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`. The Vite dev server proxies `/api` requests to the backend automatically.

**Additional client scripts:**

| Command              | Description                         |
|----------------------|-------------------------------------|
| `npm run dev`        | Start dev server on port 5173       |
| `npm run dev:student`| Start dev server on port 5174       |
| `npm run build`      | Create production build             |
| `npm run preview`    | Preview the production build        |
| `npm run lint`       | Run ESLint                          |

### Docker Setup

A Dockerfile is provided for the server:

```bash
cd server

# Build the image
docker build -t alumni-platform-server .

# Run the container
docker run -p 5123:5123 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/alumni_platform \
  -e JWT_SECRET=your_secret_key \
  alumni-platform-server
```

---

## Environment Variables

### Server (`server/.env`)

| Variable       | Description                        | Default                                         |
|----------------|------------------------------------|-------------------------------------------------|
| `PORT`         | Port the API server listens on     | `5123`                                          |
| `MONGO_URI`    | MongoDB connection string          | `mongodb://localhost:27017/alumni_platform`      |
| `JWT_SECRET`   | Secret key for signing JWT tokens  | *(required — set your own)*                     |
| `FRONTEND_URL` | Allowed CORS origin for frontend   | `http://localhost:5173`                         |

### Client (`client/.env`)

| Variable             | Description                  | Default                    |
|----------------------|------------------------------|----------------------------|
| `VITE_API_BASE_URL`  | Base URL of the API server   | `http://localhost:5123`    |

---

## API Reference

### Health

| Method | Endpoint       | Description         |
|--------|----------------|---------------------|
| GET    | `/api/health`  | Server health check |

### Authentication

| Method | Endpoint                  | Description                          |
|--------|---------------------------|--------------------------------------|
| POST   | `/api/students/register`  | Register a new student (multipart)   |
| POST   | `/api/students/login`     | Student login                        |
| POST   | `/api/alumni/register`    | Register a new alumni (multipart)    |
| POST   | `/api/alumni/login`       | Alumni login                         |

### Alumni

| Method | Endpoint                  | Description                                  |
|--------|---------------------------|----------------------------------------------|
| GET    | `/api/alumni/all`         | List all alumni (password excluded)          |
| GET    | `/api/alumni/search`      | Search alumni by company, skills, experience |
| GET    | `/api/alumni/leaderboard` | Top 100 alumni ranked by coins               |
| POST   | `/api/alumni/give-coins`  | Give coins to an alumni                      |

### Mentorship Requests

| Method | Endpoint                      | Description                    |
|--------|-------------------------------|--------------------------------|
| POST   | `/api/requests/send`          | Send a mentorship request      |
| GET    | `/api/requests/user/:userId`  | Get all requests for a user    |
| POST   | `/api/requests/action`        | Accept or reject a request     |
| POST   | `/api/requests/remove-mentor` | Remove a mentor (with reason)  |

### Messaging

| Method | Endpoint                             | Description                        |
|--------|--------------------------------------|------------------------------------|
| POST   | `/api/messages/send`                 | Send a message                     |
| GET    | `/api/messages/:userId1/:userId2`    | Get conversation between two users |

### Jobs

| Method | Endpoint         | Description                              |
|--------|------------------|------------------------------------------|
| POST   | `/api/jobs/add`  | Post a job opportunity (+100 coins)      |
| GET    | `/api/jobs/all`  | List all job postings                    |

### Training

| Method | Endpoint                   | Description                              |
|--------|----------------------------|------------------------------------------|
| POST   | `/api/training/create`     | Create a training request                |
| GET    | `/api/training/all`        | List all training requests               |
| POST   | `/api/training/accept`     | Accept a training request                |
| POST   | `/api/training/feedback`   | Submit feedback and transfer coins       |

### Coin Donations

| Method | Endpoint                 | Description                              |
|--------|--------------------------|------------------------------------------|
| POST   | `/api/students/donate`   | Student donates coins to alumni (once)   |

---

## Database Schema

The platform uses **MongoDB** with six Mongoose models:

| Model      | Key Fields                                                                 |
|------------|---------------------------------------------------------------------------|
| **Student**   | `name`, `rollNumber` (unique), `presentYear`, `skills`, `coins` (default 500), `resume` |
| **Alumni**    | `name`, `rollNumber` (unique), `passedYear`, `jobDescription`, `experience`, `skills`, `coins` (default 0), `resume` |
| **Request**   | `sender`, `recipient` (polymorphic refs to Student/Alumni), `status` (pending/accepted/rejected), `message` |
| **Message**   | `sender`, `recipient` (polymorphic refs), `text`, `read`                  |
| **Job**       | `postedBy` (ref Alumni), `company`, `role`, `description`, `link`, `referralEmail` |
| **Training**  | `student` (ref Student), `alumni` (ref Alumni), `skill`, `minCoins`, `maxCoins`, `status` |

All models include automatic `createdAt` and `updatedAt` timestamps.

---

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Ideas for Contribution

- Add real-time messaging with WebSockets (Socket.IO)
- Implement JWT verification middleware for protected routes
- Add input validation with a library like Zod or Joi
- Write unit and integration tests
- Add email notifications for mentorship requests
- Create an admin panel for platform management
- Add rate limiting and request throttling
- Set up CI/CD with GitHub Actions

---

## License

This project is open source and available under the [MIT License](LICENSE).
