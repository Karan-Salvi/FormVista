# Backend - Modern Node.js/TypeScript Backend

A scalable, maintainable backend built with Express, TypeScript, Prisma, and industry best practices.

## Architecture

```
src/
├── config/          # Configuration management (env validation, app config)
├── core/           # Core application components
│   ├── errors/     # Custom error classes
│   ├── middlewares/# Global middlewares (auth, validation, error handling)
│   └── utils/      # Core utilities (logger, response helpers)
├── modules/        # Feature modules (domain-driven design)
│   ├── auth/       # Authentication module
│   ├── school/     # School management module
│   ├── administrator/ # Administrator management module
│   ├── document-requirements/ # Document requirements module
│   └── admission/  # Admission management module
├── shared/         # Shared resources (constants, types, interfaces)
├── database/       # Database layer (Prisma + external tables)
├── routes/         # Route aggregator
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

## Features

- **Type-Safe Configuration**: Zod validates environment variables at startup
- **Structured Logging**: Winston logging with different levels and transports
- **Error Handling**: Custom error classes with proper HTTP status codes
- **Request Validation**: Zod schemas validate requests automatically
- **Path Aliases**: Clean imports using `@config`, `@core`, `@modules`, etc.
- **Modular Architecture**: Feature-based module organization
- **Database Layer**: Prisma ORM + raw SQL for external tables

## Quick Start

### Prerequisites

- Node.js 18+
- MySQL/MariaDB database
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env

# Run database migrations (if needed)
npx prisma migrate dev

# Build the project
npm run build

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

See `.env.example` for all required variables:

```env
# Required
NODE_ENV=development
PORT=5000
DATABASE_URL=mysql://user:pass@host:3306/db
JWT_SECRET=your_secret_here
AD_SUPER_SECRET=your_admin_secret_here

# Digital Ocean Spaces (Required for document uploads)
DO_SPACES_ENDPOINT=https://blr1.digitaloceanspaces.com
DO_SPACES_REGION=blr1
DO_SPACES_ACCESS_KEY_ID=your_access_key
DO_SPACES_SECRET_ACCESS_KEY=your_secret_key
DO_SPACES_BUCKET_NAME=bmc-space

# Optional
CORS_ORIGIN=*
LOG_LEVEL=info
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server
npm run type-check   # Check TypeScript types
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
```

### Project Structure Explained

#### Config Layer (`src/config/`)

- Environment validation using Zod
- Centralized configuration
- Type-safe config access

#### Core Layer (`src/core/`)

- **errors/**: Custom error classes (AppError, ValidationError, etc.)
- **middlewares/**: Global middlewares (auth, error handling, validation)
- **utils/**: Logger, response utilities, password hashing

#### Modules (`src/modules/`)

Each module contains:

- `*.controller.ts` - Request handlers
- `*.service.ts` - Business logic
- `*.routes.ts` - Route definitions
- `*.validators.ts` - Zod validation schemas
- `*.types.ts` - TypeScript types
- `index.ts` - Module exports

#### Shared Resources (`src/shared/`)

- **constants/**: Role constants, HTTP codes, status codes
- **interfaces/**: Common TypeScript interfaces
- **types/**: Type definitions and Express extensions

#### Database Layer (`src/database/`)

- Prisma client configuration
- External tables service for non-Prisma tables
- Database types and interfaces

## API Documentation

API documentation is available in `docs/API_DOCUMENTATION.md`

### Example: Login Endpoint

```bash
POST /api/auth/login
Content-Type: application/json

{
  "emailOrMobile": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role_id": 4
    }
  }
}
```

# Authentication & Authorization

### User Roles

- **Service Provider** (role_id: 4)
- **Principal/Director** (role_id: 1)
- **Administrator** (role_id: 5)

### Password Hashing

- HMAC-SHA256 with `AD_SUPER_SECRET`
- All users in `service_providers_admin_user` table

### JWT Tokens

- Configurable expiration
- Includes user ID, role, school ID, email
- Bearer token authentication

##q Adding a New Module

1. Create module directory:

```bash
mkdir -p src/modules/your-module
```

2. Create module files:

```typescript
// your-module.types.ts
export interface YourData {
  id: number;
  name: string;
}

// your-module.validators.ts
import { z } from 'zod';
export const yourSchema = z.object({
  name: z.string().min(1),
});

// your-module.service.ts
export class YourService {
  static async getData() {
    // Business logic
  }
}

// your-module.controller.ts
export class YourController {
  static async getAll(req, res, next) {
    try {
      const data = await YourService.getData();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }
}

// your-module.routes.ts
import { Router } from 'express';
const router = Router();
router.get('/', YourController.getAll);
export default router;

// index.ts
export * from './your-module.types';
export * from './your-module.service';
export * from './your-module.controller';
export { default as yourModuleRoutes } from './your-module.routes';
```

3. Add to route aggregator:

```typescript
// src/routes/index.ts
import { yourModuleRoutes } from '@modules/your-module';
router.use('/your-module', yourModuleRoutes);
```

## 📊 Logging

Winston logger with multiple transports:

```typescript
import { logger } from '@core/utils/logger.util';

logger.info('Information message');
logger.warn('Warning message');
logger.error('Error message', error);
logger.debug('Debug message', { metadata });
```

## 🐛 Error Handling

Custom error classes:

```typescript
import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from '@core/errors';

// Throw custom errors
throw new AuthenticationError('Invalid credentials');
throw new NotFoundError('Resource not found');

// Global error handler catches all
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run specific test
npm test -- auth.test.ts
```

## 🚢 Deployment

```bash
# Build for production
npm run build

# Set environment
export NODE_ENV=production

# Start server
npm start
```

## 📖 Additional Documentation

- [API Documentation](docs/API_DOCUMENTATION.md)
- [Migration Guide](docs/MIGRATION_GUIDE.md)
- [Setup Guide](docs/SETUP.md)
- [Prisma Setup](docs/PRISMA_SETUP.md)
- [Refactoring Progress](REFACTORING_COMPLETE.md)

## 🤝 Contributing

1. Follow the established module structure
2. Use path aliases (`@config`, `@core`, etc.)
3. Add validators for all endpoints
4. Use logger instead of console.log
5. Use custom error classes
6. Write tests for new features

## 📄 License

ISC

## 🔗 Related Projects

- Frontend: `../frontend/`
- Prisma Schema: `prisma/schema.prisma`

---

**Current Status**: Core infrastructure complete, auth module migrated and tested. Other modules pending migration.
