# AuthService

A secure authentication service built with .NET 8.0 that provides user registration, login, and token-based authentication functionality.

## Features

- User registration with username, email, and password
- Secure login with JWT token generation
- Password hashing using BCrypt
- Protected endpoints with JWT authentication
- PostgreSQL database integration
- Entity Framework Core for data access

## Prerequisites

- .NET 8.0 SDK
- PostgreSQL database
- Docker (optional, for containerized deployment)

## Configuration

The service requires the following configuration in `appsettings.json`:

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

## API Endpoints

### Register
- **POST** `/auth/register`
- Creates a new user account
- Request body:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```

### Login
- **POST** `/auth/login`
- Authenticates a user and returns a JWT token
- Request body:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

### Get Current User
- **GET** `/auth/me`
- Returns the current authenticated user's information
- Requires JWT authentication

## Running the Service

1. Clone the repository
2. Navigate to the AuthService directory
3. Update the connection string in `appsettings.json`
4. Run the following commands:

```bash
dotnet restore
dotnet build
dotnet run
```

The service will start on `https://localhost:5001` by default.

## Development

To add new migrations:

```bash
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

## Security Features

- Password hashing using BCrypt
- JWT-based authentication
- Secure token validation
- Protection against common security vulnerabilities

## Dependencies

- BCrypt.Net-Next (4.0.3)
- Microsoft.AspNetCore.Authentication.JwtBearer (8.0.4)
- Microsoft.EntityFrameworkCore (8.0.4)
- Npgsql.EntityFrameworkCore.PostgreSQL (8.0.3)
- System.IdentityModel.Tokens.Jwt (8.8.0)

## License

This project is licensed under the MIT License. 