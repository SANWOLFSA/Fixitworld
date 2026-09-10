# FixItWorld Backend - Phase 1

## Phase 1: Database & Backend Architecture

This is the foundation for FixItWorld. Phase 1 includes:

- ✅ PostgreSQL database schema
- ✅ Express.js REST API
- ✅ User authentication (JWT)
- ✅ Marketplace scaffolding
- ✅ Tutorial system scaffolding
- ✅ Docker setup
- ✅ Environment configuration

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose (optional)

### Option 1: Local Setup

```bash
# Install dependencies
npm install

# Setup .env
cp .env.example .env
# Edit .env with your database URL

# Run migrations
npm run migrate

# Seed database (optional)
npm run seed

# Start development server
npm run dev
```

Server runs on `http://localhost:5000`

### Option 2: Docker Setup

```bash
# Start services
docker-compose up

# Run migrations inside container
docker-compose exec backend npm run migrate
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

### Marketplace
- `GET /api/marketplace/listings` - List all listings
- `POST /api/marketplace/listings` - Create listing (auth required)

### Tutorials
- `GET /api/tutorials` - List tutorials
- `GET /api/tutorials/:id` - Get tutorial details

### Users
- `GET /api/users/profile` - Get user profile (auth required)

## Database Schema

See `prisma/schema.prisma` for the full schema.

**Core Tables:**
- `User` - User accounts & authentication
- `Listing` - Marketplace listings
- `Order` - Transaction records
- `Review` - Seller reviews
- `Tutorial` - DIY repair guides
- `Admin` - Admin dashboard accounts

## Next Steps (Phase 2)

- [ ] Email verification
- [ ] FICA verification workflow
- [ ] Stripe payment integration
- [ ] Order management
- [ ] Seller ratings system

## Development

```bash
# Run tests
npm test

# Format code
npm run format

# Health check
curl http://localhost:5000/api/health
```
