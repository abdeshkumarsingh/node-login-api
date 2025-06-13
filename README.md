# Node.js RESTful API

A robust RESTful API built with Node.js and Express, following SOLID principles and best practices. This API provides user management functionality with authentication and authorization.

## Features

- RESTful API design
- User authentication with JWT
- Input validation using Joi
- Error handling middleware
- MongoDB integration with fallback to in-memory storage
- Environment-based configuration
- CORS enabled
- Request logging with Morgan
- Health check endpoint
- Pagination support
- Role-based access control

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (optional, can run without it)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd node-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
MONGODB_URI=your-mongodb-uri
SKIP_MONGODB=false
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Production Mode with PM2
```bash
npm run start-prod
```

## API Documentation

### Base URL
```
http://localhost:3000/v1
```

### Authentication
Most endpoints require authentication using a JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```

### Endpoints

#### Health Check
```
GET /v1/health
```
Response:
```json
{
  "status": "success",
  "message": "API is running"
}
```

#### User Management

##### Create User
```
POST /v1/users
```
Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```
Response:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
}
```

##### Login
```
POST /v1/users/login
```
Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Response:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt-token"
  }
}
```

##### Get All Users (Protected)
```
GET /v1/users?page=1&limit=10
```
Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

##### Get User by ID (Protected)
```
GET /v1/users/:id
```

##### Update User (Protected)
```
PATCH /v1/users/:id
```
Request Body:
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "password": "newpassword"
}
```

##### Delete User (Protected)
```
DELETE /v1/users/:id
```

### Error Responses

The API uses standard HTTP status codes and returns errors in the following format:
```json
{
  "status": "error",
  "message": "Error message",
  "errors": [
    {
      "field": "field-name",
      "message": "validation error message"
    }
  ]
}
```

## Validation Rules

### User Creation/Update
- Name: 2-50 characters
- Email: Valid email format
- Password: Minimum 8 characters
- Role: Either "user" or "admin"

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- CORS enabled
- Input validation
- Rate limiting (if configured)
- Security headers

## Development

### Project Structure
```
src/
├── v1/
│   ├── config/
│   ├── controllers/
│   ├── interfaces/
│   ├── middlewares/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   └── validation/
├── index.js
└── server.js
```

### Adding New Features
1. Create necessary interfaces
2. Implement repository layer
3. Add service layer logic
4. Create controller
5. Define routes
6. Add validation if needed

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 