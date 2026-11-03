# Task Management API

A RESTful Task Management API built using Node.js, Express.js and MongoDB.

## Features

- User registration and login
- Password hashing using bcrypt
- JWT authentication
- Create, read, update and delete tasks
- User-specific task management
- Input validation
- Proper HTTP status codes

## Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- bcryptjs
- JSON Web Token

## Installation

1. Clone the repository.
2. Install dependencies:

   `npm install`

3. Create a `.env` file:

   `PORT=5000`

   `MONGODB_URI=your_mongodb_connection_string`

   `JWT_SECRET=your_secret_key`

   `JWT_EXPIRES_IN=1d`

4. Start the application:

   `npm run dev`

## API Endpoints

### Authentication

| Method | Endpoint |
|---|---|
| POST | /api/auth/register |
| POST | /api/auth/login |

### Tasks (JWT required)

| Method | Endpoint |
|---|---|
| POST | /api/tasks |
| GET | /api/tasks |
| GET | /api/tasks/:id |
| PUT | /api/tasks/:id |
| DELETE | /api/tasks/:id |

## Authentication

For protected routes, include:

`Authorization: Bearer YOUR_JWT_TOKEN`

## License

ISC