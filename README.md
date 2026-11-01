# Backora — Backend-as-a-Service Platform

**Backora** is a full-stack Backend-as-a-Service (BaaS) platform that simplifies backend management by allowing users to create projects, manage collections, configure schemas, and generate API keys through an interactive dashboard.

🔗 **Live Demo:** https://baas-project.vercel.app/

🔗 **GitHub Repository:** https://github.com/Naveen-Negi721700/Baas_project

---

## ✨ Features

- **User Authentication** — Secure signup and login with JWT-based authentication, protected routes, and session management.
- **Project Management** — Create and manage backend projects from a unified dashboard.
- **Collection Management** — Create and manage collections with configurable schemas.
- **API Key Management** — Generate and validate project-specific API keys.
- **AI Assistant** — Get guidance on Backora features and backend setup through an integrated AI assistant.
- **Image Uploads** — Cloudinary integration for image storage.
- **Email Notifications** — Email notifications for registration and login.
- **Caching and Rate Limiting** — Redis integration for caching and rate-limiting operations.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js, React, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Caching and Rate Limiting | Redis |
| Authentication | JWT, HTTP-only cookies |
| Image Storage | Cloudinary |
| AI Integration | Gemini API |
| Email | Nodemailer |
| Containerization | Docker, Docker Compose |
| Deployment | Vercel, Render |

## 🏗️ Architecture

Backora uses a Next.js frontend to communicate with an Express.js REST API. The backend handles authentication, project and collection management, API key operations, and integrations with external services.

Docker containers package the frontend and backend applications, while Redis provides supporting services.

## 🐳 Docker Hub Images

Backora provides pre-built Docker images so developers can pull and run the frontend and backend without building the images themselves.

| Service | Docker Hub Image |
|---|---|
| Backend | `naveen72170/backora-backend:latest` |
| Frontend | `naveen72170/backora-frontend:latest` |

### Pull Docker Images

Make sure Docker Desktop or Docker Engine is installed and running.

Pull the backend image:

```bash
docker pull naveen72170/backora-backend:latest
```

Pull the frontend image:

```bash
docker pull naveen72170/backora-frontend:latest
```

### Docker Hub Repositories

- **Backend:** https://hub.docker.com/r/naveen72170/backora-backend
- **Frontend:** https://hub.docker.com/r/naveen72170/backora-frontend

### Run with Docker Compose

For running the complete application, use the Docker Compose configuration provided in the GitHub repository.

```bash
git clone https://github.com/Naveen-Negi721700/Baas_project.git

cd Baas_project
```

Configure the required backend environment variables before starting the containers. These include your MongoDB connection, JWT secrets, Redis configuration, Cloudinary credentials, and optional email and Gemini credentials.

Then, use the image-based Docker Compose configuration:

```bash
docker compose pull
docker compose up -d
```

Open the application at:

- Frontend: http://localhost:3000
- Backend: http://localhost:8000

**Important:** The image-based Compose configuration must reference the two Docker Hub images above. The backend also needs its environment variables and access to the required external services. Configure the frontend API URL to point to the backend address accessible from your browser.

## 🚀 Getting Started Without Docker

### Prerequisites

- Node.js and npm
- MongoDB connection
- Redis connection
- Cloudinary account
- Email and AI provider credentials, if using those features

### 1. Clone the repository

```bash
git clone https://github.com/Naveen-Negi721700/Baas_project.git

cd Baas_project
```

### 2. Set up the backend

```bash
cd Backend
npm install
```

Create a `.env` file in the backend directory and configure the environment variables required by your backend, including your port, MongoDB connection, Redis connection, JWT secrets, Cloudinary credentials, email configuration, and AI provider credentials.

Start the backend:

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

> **Note:** Environment variable names and start commands may differ in your configuration. Check your existing `.env.example` files and `package.json` scripts before running the application.

## 🔐 Security

- Protected routes for authenticated users.
- JWT-based authentication and session handling.
- Project-specific API key validation.
- Environment variables for sensitive configuration.
- Never commit `.env` files, passwords, API keys, or JWT secrets.

## 🌐 Live Project

**Try Backora:** https://baas-project.vercel.app/

## 👨‍💻 Developer

Developed as a full-stack project to explore Backend-as-a-Service architecture, REST API development, authentication, data management, Docker containerization, and AI-assisted workflows.