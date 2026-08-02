# Task Manager

A simple full stack task app made with Node.js, Express, MongoDB, React, and Vite.

## Run it

### Backend

```bash
cd backend
npm install
npm run dev
```

Add your MongoDB connection string in `backend/.env` as `MONGO_URI` if you are not using the local default MongoDB address.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend uses the backend at `http://localhost:5000/api/tasks` by default.

## Features

- Add a task
- Edit a task
- Mark a task done or pending
- Delete a task
- Search tasks
