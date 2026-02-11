# Mind AI Forge - Full Stack Application

## Overview
This is a full-stack application for the Mind AI Forge hackathon, featuring a multi-step registration flow, user dashboard, and admin panel.

## Tech Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express, PostgreSQL
- **tools**: React Query, Axios, Zod, React Hook Form, PDFKit, Multer

## Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+) running on port 5432

## Setup Instructions

### 1. Database Setup
Ensure PostgreSQL is running. Create a database named `mind_ai_forge`.
```bash
createdb mind_ai_forge
```

Run the initialization script to create tables:
```bash
cd Backend
npm install
node init-db.js
```
*Note: If `node init-db.js` fails due to connection issues, verify your PostgreSQL service is running and credentials in `Backend/.env` are correct.*

### 2. Backend Setup
Navigate to the Backend directory and start the server:
```bash
cd Backend
npm run dev
```
The server will start on port **5001**.
Configuration is in `Backend/.env`.

### 3. Frontend Setup
Navigate to the root directory and start the frontend:
```bash
npm install
npm run dev
```
The application will run on `http://localhost:5173`.

## Features
- **Registration**: 5-step wizard with validation.
- **Login**: JWT-based authentication.
- **Dashboard**: User profile, countdown timer, PDF idea submission.
- **Admin**: View all users, export user data to PDF.

## Project Structure
- `src/`: Frontend source code
  - `pages/`: Route components (Home, Register, Login, Dashboard, Admin)
  - `components/`: Reusable UI components
  - `context/`: Auth state management
  - `lib/`: Utilities (Axios, etc.)
- `Backend/`: Backend source code
  - `routes/`: API endpoints
  - `db/`: Database schema
  - `uploads/`: File storage
