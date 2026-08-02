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

## Backend Structure

The backend is split into small files so the flow is easier to follow:

- `backend/server.js` starts the server and connects to MongoDB
- `backend/app.js` sets up Express and mounts the routes
- `backend/controllers/taskController.js` handles request and response logic
- `backend/services/taskService.js` talks to MongoDB through the model
- `backend/routes/taskRoutes.js` defines the task API routes

## Postman Testing

The API requests are documented in [backend/postman/Task Manager.postman_collection.json](backend/postman/Task%20Manager.postman_collection.json). Import it into Postman to test:

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `PATCH /api/tasks/:id/status`
- `DELETE /api/tasks/:id`

Set `baseUrl` to `http://localhost:5000` if you are running the backend locally.

## Features

- Add a task
- Edit a task
- Mark a task done or pending
- Delete a task
- Search tasks
