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

## Windows MongoDB Setup

If `mongod` is not installed, use the MongoDB Community Server for Windows:

1. Download the MSI installer from the official MongoDB Community Server page.
2. Run the installer and choose the Complete setup type.
3. Make sure the option to install MongoDB as a Windows Service is enabled.
4. Finish the install, then open PowerShell and verify it with:

```powershell
where mongod
sc query MongoDB
```

5. Start the service with:

```powershell
net start MongoDB
```

If you installed MongoDB without the service option, start it manually with a data directory instead:

```powershell
mkdir C:\data\db
"C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe" --dbpath C:\data\db
```

Replace `<version>` with your installed MongoDB version folder.

## Environment Variables

Copy `.env.example` to `.env` in the backend folder and update the values:

| Variable    | Description              | Default                              |
|-------------|--------------------------|--------------------------------------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/todoapp` |
| `PORT`      | Backend server port       | `5000`                              |

### MongoDB Atlas Alternative

If you do not want to run MongoDB locally:

1. Create a free MongoDB Atlas account.
2. Create a new M0 cluster.
3. Add your current IP address to the Network Access list.
4. Create a database user with a username and password.
5. Click **Connect** and copy the connection string.
6. Put that string in `backend/.env` as `MONGO_URI`.

Example format:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/todoapp?retryWrites=true&w=majority
```

Make sure to replace `<username>`, `<password>`, and `<cluster-name>` with your Atlas values.

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
