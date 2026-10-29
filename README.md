# Backora — Backend-as-a-Service Platform

**Backora** is a full-stack Backend-as-a-Service (BaaS) platform that simplifies backend management by allowing users to create projects, manage collections, configure schemas, and generate API keys through an interactive dashboard.

🔗 **Live Demo:** https://baas-project.vercel.app/

---

## ✨ Features

- **User Authentication** — Secure signup and login with JWT-based authentication, protected routes, and session management.
- **Project Management** — Create and manage backend projects from a unified dashboard.
- **Collection Management** — Create and manage collections with configurable schemas.
- **API Key Management** — Generate and validate project-specific API keys.
- **AI Assistant** — Get guidance on Backora features and backend setup through an integrated AI assistant.
- **Image Uploads** — Cloudinary integration for image storage.
- **Email Notifications** — Email notifications for registration and login.
- **Caching** — Redis integration for caching and session-related operations.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js, React, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Caching | Redis |
| Authentication | JWT, HTTP-only cookies |
| Image Storage | Cloudinary |
| AI Integration | Gemini API |
| Email | Nodemailer |
| Deployment | Vercel, Render |

## 🏗️ Architecture

Backora uses a Next.js frontend to communicate with an Express.js REST API. The backend handles authentication, project and collection management, API key operations, and integrations with external services.

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- MongoDB connection
- Redis connection
- Cloudinary account
- Email and AI provider credentials, if using those features

### 1. Clone the repository

```bash
git clone https://github.com/Naveen-Negi721700/Baas_project
cd Bass_project
```

Replace `https://github.com/Naveen-Negi721700/Baas_project` with your actual repository URL.

### 2. Set up the backend

```bash
cd Backend
npm install
```

Create a `.env` file in the backend directory and configure the environment variables required by your backend, including your port, MongoDB connection, Redis connection, JWT secrets, Cloudinary credentials, email configuration, and AI provider credentials.

Start the backend using the script defined in `Backend/package.json`, for example:

```bash
npm run dev
```

### 3. Set up the frontend

Open a second terminal:

```bash
cd Frontend/backora
npm install
```

Create `.env.local` and configure `NEXT_PUBLIC_FETCH_URI` with your backend API URL, using the format expected by your Axios configuration.

Start the frontend:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

> **Note:** Environment variable names and start commands may differ in your configuration. Check your existing `.env.example` files and `package.json` scripts before running the application. Never commit `.env` files, passwords, API keys, or JWT secrets.

## 🔐 Security

- Protected routes for authenticated users.
- JWT-based authentication and session handling.
- Project-specific API key validation.
- Environment variables for sensitive configuration.

## 🌐 Live Project

**Try Backora:** https://baas-project.vercel.app/

## 👨‍💻 Developer

Developed as a full-stack project to explore backend-as-a-service architecture, REST API development, authentication, data management, and AI-assisted workflows.