
# TaskFlow - Task Management Application

A responsive task management application built using React. It connects to a REST API built with Node.js, Express.js and MongoDB.

## Features

- User registration and login
- JWT-based authentication
- Protected routes
- Create new tasks
- View all tasks
- View individual task details
- Edit existing tasks
- Delete tasks
- Task status management
- Loading and error states
- Responsive design

## Technologies Used

### Frontend
- React.js
- JavaScript
- React Router DOM
- HTML
- CSS
- Fetch API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Installation

1. Clone this repository.

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

2. Navigate to the frontend directory.

```bash
cd task-management-frontend
```

3. Install dependencies.

```bash
npm install
```

4. Create a `.env` file in the frontend root directory.

```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server.

```bash
npm run dev
```

6. Open the URL displayed in your terminal.

## Backend Setup

Start the backend separately.

Configure its MongoDB connection and JWT secret in its `.env` file, then run:

```bash
npm install
npm run dev
```

Make sure the backend is running on port 5000.

## Build

To create a production build:

```bash
npm run build
```

## Author

Abdul Aziz
