# 🛠️ PaperCode Bangladesh - Backend, Database & API Setup Guide

This document contains all instructions, environment variables, API endpoints, and database schemas to run PaperCode with live backend services, server-side Judge0 sandboxes, PostgreSQL, and Google Gemini 2.0 Flash OCR.

---

## 📋 Table of Contents
1. [Architecture Overview & Endpoints](#1-architecture-overview--endpoints)
2. [Environment Variables & Keys (.env)](#2-environment-variables--keys-env)
3. [Database Setup (PostgreSQL / Supabase / Neon / Local)](#3-database-setup)
4. [Google Gemini API Setup (Handwritten OCR Engine)](#4-google-gemini-api-setup)
5. [Server-Side Judge0 Sandbox Setup (Docker / Cloud)](#5-server-side-judge0-sandbox-setup)
6. [Google OAuth 2.0 Setup](#6-google-oauth-20-setup)
7. [Running the Application](#7-running-the-application)

---

## 1. Architecture Overview & Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/ocr/extract` | **Gemini 2.0 Flash OCR**: Transcribes handwritten code from image to clean executable text. |
| `POST` | `/api/sandbox/run` | **Judge0 Sandbox Runner**: Compiles & executes code server-side with stdout/stderr & test cases. |
| `GET` | `/api/sandbox/languages` | Returns list of supported language compilers (Python 3, C++, C, JavaScript). |
| `POST` | `/api/auth/signup` | Open registration for students, teachers, and independent learners. |
| `POST` | `/api/auth/login` | User authentication & JWT token generation. |
| `POST` | `/api/auth/google` | Google OAuth 2.0 token verification & user login. |
| `GET` | `/api/courses` | Retrieves all curriculum tracks (Class 9-10 ICT, BdOI Olympiad, HSC Chapter 5). |
| `GET` | `/api/classrooms` | Lists teacher classrooms, join codes, and student rosters. |
| `POST` | `/api/classrooms/join` | Enrolls a student into a classroom via class code (e.g. `HAOR99`). |
| `POST` | `/api/submissions` | Records student exercise submissions & test results. |
| `GET` | `/api/blogs` | Retrieves community & editorial articles. |
| `POST` | `/api/blogs/:id/clap` | Increments applaud / clap counter on an article. |

---

## 2. Environment Variables & Keys (`.env`)

Create a `.env` file in the project root based on `.env.example`:

```ini
# 1. Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# 2. Database Connection (PostgreSQL / Supabase / Neon)
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/papercode_db?sslmode=disable

# 3. Google Gemini API Key (For Handwritten Notebook OCR Engine)
# Get free key from: https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash

# 4. Server-Side Judge0 Cloud / Self-Hosted Sandbox Runner
# If self-hosting on your server: http://localhost:2358
# If using RapidAPI: https://judge0-ce.p.rapidapi.com
JUDGE0_API_URL=http://localhost:2358
JUDGE0_API_KEY=your_judge0_api_key_if_using_rapidapi
JUDGE0_AUTH_TOKEN=your_judge0_auth_token_if_self_hosted

# 5. Authentication Security (JWT & Google OAuth)
JWT_SECRET=super_secret_jwt_key_papercode_bangladesh_2026
JWT_EXPIRES_IN=7d

# Google OAuth 2.0 Client Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 3. Database Setup

### Option A: Direct PostgreSQL / Supabase / Neon SQL DDL
Run the provided SQL file `server/db/schema.sql` in your SQL client:

```bash
# On local PostgreSQL:
psql -U postgres -d papercode_db -f server/db/schema.sql
```

---

## 4. Google Gemini API Setup (Handwritten OCR Engine)

1. Go to **[Google AI Studio](https://aistudio.google.com/)**.
2. Click **"Get API key"** and create a new API key.
3. Paste the key into your `.env` file:
   ```ini
   GEMINI_API_KEY=AIzaSy...
   GEMINI_MODEL=gemini-2.0-flash
   ```
4. The server route `/api/ocr/extract` will automatically utilize Gemini 2.0 Flash multimodal vision to parse handwritten code from photos and rectify syntax.

---

## 5. Server-Side Judge0 Sandbox Setup

### Option A: Self-Hosting Judge0 via Docker on Your Server (Recommended for Production)
Run Judge0 on your VPS/server:

```bash
# 1. Download official docker-compose
wget https://github.com/judge0/judge0/releases/download/v1.13.1/docker-compose.yml

# 2. Start services (Compiler sandbox, Redis, Postgres)
docker-compose up -d

# 3. Set in your .env:
JUDGE0_API_URL=http://localhost:2358
```

### Option B: Using RapidAPI Judge0 CE
1. Sign up on [RapidAPI Judge0 CE](https://rapidapi.com/hermanzdosilovic/api/judge0-ce).
2. Set in your `.env`:
   ```ini
   JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
   JUDGE0_API_KEY=your_rapidapi_key
   ```

---

## 6. Google OAuth 2.0 Setup

1. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (Web application).
3. Add Authorized JavaScript origins: `http://localhost:3000` and `https://yourdomain.com`.
4. Copy the **Client ID** and paste into `GOOGLE_CLIENT_ID` in your `.env`.

---

## 7. Running the Application

### Start the Backend Server (Port 5000):
```bash
cmd /c "npm run server"
```

### Start the Frontend Dev Server (Port 3000):
```bash
cmd /c "npm run dev"
```

The frontend Vite server automatically proxies all `/api/*` requests to `http://localhost:5000` with zero CORS friction.
