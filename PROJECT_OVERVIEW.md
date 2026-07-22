# Student Management System

A full-stack student management app built with FastAPI, SQLAlchemy, PostgreSQL, and React.

## What it does

- User authentication with JWT login
- Role-based access control for `admin` and `student`
- Student CRUD operations
- Attendance tracking
- Marks management
- Dashboard with summary stats

## Tech Stack

- Backend: FastAPI, SQLAlchemy, Pydantic, bcrypt, JWT
- Database: PostgreSQL
- Frontend: React, React Router, Axios, Vite, Tailwind CSS

## Why it is resume-friendly

- Clear separation between backend and frontend
- Role-based authorization already implemented
- Real-world admin workflows: students, attendance, marks, dashboard
- Good foundation for deployment, testing, and CI later

## Suggested cleanup completed

- Moved config to environment variables with sensible dev defaults
- Added a proper ignore list for virtualenv, node_modules, build artifacts, and local secrets
- Fixed a small UI text encoding issue in the dashboard
- Added a concise overview file you can reference on your resume or GitHub profile

## Run locally

Backend:

```bash
cd backend
python -m uvicorn app.main:app --reload --port 8001
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Admin login

The backend now seeds a demo admin user on startup if one does not already exist.

Default demo credentials:

- Email: `admin@school.com`
- Password: `Admin@12345`

You can override them with `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your environment.
