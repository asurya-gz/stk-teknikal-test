# Menu Tree System - Fullstack Application

A fullstack hierarchical menu management system with unlimited depth support, built with NestJS, Next.js, PostgreSQL, and Docker.

## Features

### Backend (NestJS)
- RESTful API with full CRUD operations
- Hierarchical data structure with parent-child relationships
- Unlimited menu depth support
- Move and reorder operations
- Input validation and comprehensive error handling
- PostgreSQL database with TypeORM
- Swagger/OpenAPI documentation
- Service layer architecture
- Type-safe with TypeScript

### Frontend (Next.js)
- Modern React UI with TypeScript
- Hierarchical tree view with expand/collapse
- Real-time CRUD operations
- Search and filter functionality
- Responsive design (mobile & desktop)
- State management with Zustand
- Loading states and error handling
- Tailwind CSS styling
- Clean and intuitive interface

### Bonus Features
- **Drag-and-drop** functionality for menu restructuring
- Docker & Docker Compose setup
- Development and production modes
- Hot-reloading in development
- Optimized multi-stage builds
- Environment variable management
- Database persistence with volumes
- Collapsible sidebar with mobile responsiveness
- Advanced search with autocomplete suggestions

## Tech Stack

### Backend
- NestJS 10
- TypeScript 5
- PostgreSQL 16
- TypeORM 0.3
- Swagger/OpenAPI
- Class Validator & Transformer

### Frontend
- Next.js 14
- React 18
- TypeScript 5
- Tailwind CSS 3
- Zustand (State Management)
- Axios
- Lucide Icons

### DevOps
- Docker & Docker Compose
- Multi-stage builds
- PostgreSQL with data persistence

## Project Structure

```
.
├── backend/                  # NestJS Backend
│   ├── src/
│   │   ├── menu/            # Menu module
│   │   │   ├── entities/    # Database entities
│   │   │   ├── dto/         # Data Transfer Objects
│   │   │   ├── menu.controller.ts
│   │   │   ├── menu.service.ts
│   │   │   └── menu.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities & API client
│   │   ├── store/           # Zustand store
│   │   └── types/           # TypeScript types
│   ├── Dockerfile
│   ├── package.json
│   └── tailwind.config.js
│
├── docker-compose.yml        # Development setup
├── docker-compose.prod.yml   # Production setup
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+ (if running without Docker)
- PostgreSQL 16+ (if running without Docker)
- Docker & Docker Compose (for containerized setup)

### Installation & Setup

#### Option 1: Using Docker (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/asurya-gz/stk-teknikal-test.git
cd stk-teknikal-test
```

2. **Run with Docker Compose (Development)**
```bash
# Start all services (PostgreSQL, Backend, Frontend)
docker-compose up

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger Docs: http://localhost:3001/api/docs

3. **Stop services**
```bash
docker-compose down

# Stop and remove volumes (deletes database data)
docker-compose down -v
```

#### Option 2: Running Locally (Without Docker)

1. **Setup PostgreSQL Database**
```bash
# Create database
createdb menu_tree

# Or using psql
psql -U postgres -c "CREATE DATABASE menu_tree;"
```

2. **Backend Setup**
```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and configure your database connection
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=postgres
# DB_DATABASE=menu_tree

# Run in development mode
npm run start:dev
```

Backend will be available at http://localhost:3001
Swagger docs at http://localhost:3001/api/docs

3. **Frontend Setup** (in a new terminal)
```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Run in development mode
npm run dev
```

Frontend will be available at http://localhost:3000

## Running in Production

### With Docker

```bash
# Build and run production containers
docker-compose -f docker-compose.prod.yml up --build

# Or in background
docker-compose -f docker-compose.prod.yml up -d --build
```

### Without Docker

1. **Backend Production Build**
```bash
cd backend

# Build
npm run build

# Run production server
npm run start:prod
```

2. **Frontend Production Build**
```bash
cd frontend

# Build
npm run build

# Start production server
npm start
```

## API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menus` | Get all menu items (tree structure) |
| GET | `/api/menus/:id` | Get single menu item |
| POST | `/api/menus` | Create new menu item |
| PUT | `/api/menus/:id` | Update menu item |
| DELETE | `/api/menus/:id` | Delete menu item (and children) |
| PATCH | `/api/menus/:id/move` | Move menu to different parent |
| PATCH | `/api/menus/:id/reorder` | Reorder menu within same level |

### Example Requests

**Create Menu Item**
```bash
curl -X POST http://localhost:3001/api/menus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dashboard",
    "url": "/dashboard",
    "icon": "dashboard-icon",
    "parentId": null
  }'
```

**Update Menu Item**
```bash
curl -X PUT http://localhost:3001/api/menus/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Dashboard"
  }'
```

**Move Menu Item**
```bash
curl -X PATCH http://localhost:3001/api/menus/1/move \
  -H "Content-Type: application/json" \
  -d '{
    "newParentId": 2
  }'
```

**Full API Documentation**: http://localhost:3001/api/docs (when backend is running)

## Database Schema

```sql
CREATE TABLE menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  url VARCHAR(500),
  icon VARCHAR(100),
  "order" INTEGER DEFAULT 0,
  "parentId" UUID REFERENCES menus(id) ON DELETE CASCADE,
  depth INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=menu_tree
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Architecture Decisions

### Backend Architecture
- **Service Layer Pattern**: Separates business logic from controllers
- **DTO Validation**: Uses class-validator for input validation
- **Cascade Delete**: Automatically deletes children when parent is deleted
- **Depth Calculation**: Automatically maintains depth level for each menu
- **Order Management**: Handles reordering within the same level

### Frontend Architecture
- **Component-Based**: Reusable React components
- **State Management**: Zustand for global state (simpler than Redux)
- **API Layer**: Centralized API client with axios
- **Type Safety**: Full TypeScript coverage
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Database Design
- **Self-Referencing Table**: Parent-child relationship using parentId
- **Cascade Deletion**: Ensures data integrity
- **Depth Tracking**: Performance optimization for tree operations
- **Order Field**: Maintains display order within same level

## Development

### Hot Reloading
Both frontend and backend support hot-reloading in development mode:
- Backend: Changes to `.ts` files automatically restart the server
- Frontend: Changes to components instantly reflect in the browser

### Debugging
```bash
# Backend debug mode
cd backend
npm run start:debug

# View backend logs
docker-compose logs -f backend

# View frontend logs
docker-compose logs -f frontend
```

## Testing

The project structure supports testing (bonus feature):

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :5432  # PostgreSQL

# Kill the process or change ports in .env files
```

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For Docker
docker-compose down
docker-compose up --build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Repository

GitHub: https://github.com/asurya-gz/stk-teknikal-test

## Submission

This project is created as part of the Solusi Teknologi Kreatif (STK) technical test.

For detailed submission information, see [SUBMISSION.md](SUBMISSION.md)

---

**Note**: This project demonstrates fullstack development skills including:
- Clean architecture and best practices
- TypeScript for type safety
- RESTful API design
- Modern React patterns
- Docker containerization
- Database design and optimization
- Responsive UI/UX design
