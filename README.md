# Help2Fly - Travel Planning Application

A full-stack application for planning and managing trips, built with Next.js and .NET.

## Project Structure

The project consists of two main services:

1. **AuthService** (.NET 8.0)
   - Handles user authentication and authorization
   - JWT-based authentication
   - User registration and login

2. **App Backend** (Next.js)
   - Trip management functionality
   - User-specific trip operations
   - RESTful API endpoints

## Prerequisites

- Node.js 18+ and npm
- .NET 8.0 SDK
- PostgreSQL database
- Docker (optional)

## Getting Started

### 1. AuthService Setup

```bash
cd AuthService
dotnet restore
dotnet build
dotnet run
```

The AuthService will run on `https://localhost:5001`

### 2. App Backend Setup

```bash
cd app-backend
npm install
npm run dev
```

The Next.js application will run on `http://localhost:3000`

## Environment Configuration

### AuthService
Create `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "Default": "Your PostgreSQL connection string"
  },
  "Jwt": {
    "Key": "Your JWT secret key"
  }
}
```

### App Backend
Create `.env` file:
```
DATABASE_URL="Your PostgreSQL connection string"
```

## API Endpoints

### Authentication (AuthService)
- **POST** `/auth/register`
  - Register a new user
  - Body: `{ "username": string, "email": string, "password": string }`

- **POST** `/auth/login`
  - Login and get JWT token
  - Body: `{ "username": string, "password": string }`

- **GET** `/auth/me`
  - Get current user info
  - Requires JWT token

### Trip Management (App Backend)
- **GET** `/api/trips`
  - Get all trips with filtering and pagination
  - Query parameters:
    - `from`: Filter by origin (case-insensitive)
    - `to`: Filter by destination (case-insensitive)
    - `role`: Filter by role (ACTIVE/PASSIVE)
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 10)
  - Returns paginated response with metadata
  - Requires authentication

- **POST** `/api/trips`
  - Create a new trip
  - Body: `{ "from": string, "to": string, "dateStart": string, "dateEnd": string, "role": "ACTIVE" | "PASSIVE" }`
  - Requires authentication

- **PATCH** `/api/trips`
  - Update an existing trip
  - Body: `{ "id": string, "from": string, "to": string, "dateStart": string, "dateEnd": string, "role": "ACTIVE" | "PASSIVE" }`
  - Requires authentication and trip ownership

- **DELETE** `/api/trips?id={tripId}`
  - Delete a trip and its associated matches
  - Query parameter: `id` (trip ID)
  - Requires authentication and trip ownership

- **GET** `/api/mytrips`
  - Get user's trips
  - Requires authentication

### Matchmaking (App Backend)
- **GET** `/api/matchmaking`
  - Find potential travel matches for user's trips
  - Returns matching trips based on:
    - Same destination
    - Complementary roles (ACTIVE/PASSIVE)
    - Overlapping dates
  - Requires authentication

### Matches (App Backend)
- **POST** `/api/matches`
  - Create a new match between two trips
  - Body: `{ "fromTripId": string, "toTripId": string }`
  - Requires authentication

## Testing the Application

1. **Register a User**
```bash
curl -X POST http://localhost:5001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

2. **Login**
```bash
curl -X POST http://localhost:5001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

3. **Create a Trip**
```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"from":"New York","to":"London","dateStart":"2024-05-01","dateEnd":"2024-05-10"}'
```

4. **Get User's Trips**
```bash
curl -X GET http://localhost:3000/api/mytrips \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Development

### Database Migrations

For AuthService:
```bash
cd AuthService
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

For App Backend:
```bash
cd app-backend
npx prisma migrate dev
```

## Security Features

- JWT-based authentication
- Password hashing with BCrypt
- Protected API endpoints
- Secure database connections

## Dependencies

### AuthService
- BCrypt.Net-Next (4.0.3)
- Microsoft.AspNetCore.Authentication.JwtBearer (8.0.4)
- Microsoft.EntityFrameworkCore (8.0.4)
- Npgsql.EntityFrameworkCore.PostgreSQL (8.0.3)

### App Backend
- Next.js 15.3.0
- React 19
- Prisma 6.6.0
- jsonwebtoken 9.0.2

## License

This project is licensed under the MIT License. 