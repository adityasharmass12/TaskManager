# Task Manager - Full Stack To-Do App

A full-stack task management application with a Node.js/Express/MongoDB backend and a React frontend.

## Project Structure

```
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── taskController.js
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   └── taskRoutes.js
│   ├── services/
│   │   └── taskService.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── taskApi.js
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   └── TaskList.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Prerequisites

- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas connection string

## Environment Variables

Copy `.env.example` to `.env` in the backend folder and update the values:

| Variable    | Description              | Default                              |
|-------------|--------------------------|--------------------------------------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/todoapp` |
| `PORT`      | Backend server port       | `5000`                              |

## Setup & Run

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on `http://localhost:5000` by default.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

## API Endpoints

| Method | Endpoint                 | Description           |
|--------|--------------------------|-----------------------|
| GET    | `/api/tasks`             | Get all tasks (supports `?search=` query) |
| GET    | `/api/tasks/:id`         | Get a single task     |
| POST   | `/api/tasks`             | Create a new task     |
| PUT    | `/api/tasks/:id`         | Update task details   |
| PATCH  | `/api/tasks/:id/status`  | Toggle task status    |
| DELETE | `/api/tasks/:id`         | Delete a task         |
