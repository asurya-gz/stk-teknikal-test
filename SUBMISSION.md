# STK Technical Test Submission

## Candidate Information
- **Test**: Fullstack Menu Tree System
- **Submission Date**: December 1, 2025

## Project Overview

This is a complete fullstack application implementing a hierarchical menu tree system with unlimited depth, CRUD operations, and modern UI following the provided Figma design.

## Technology Stack

### Backend
- **Framework**: NestJS 10 with TypeScript
- **Database**: PostgreSQL 16
- **ORM**: TypeORM 0.3
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator, class-transformer
- **Architecture**: Clean architecture with service layer pattern

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Features**: Responsive design, search/filter, expand/collapse tree

### DevOps
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose
- **Environment**: Development and Production modes

## Features Implemented

### Core Features (Required) ✅
- [x] RESTful API with full CRUD operations
- [x] Hierarchical data structure with unlimited depth
- [x] PostgreSQL database integration with TypeORM
- [x] Swagger/OpenAPI documentation
- [x] Input validation and comprehensive error handling
- [x] Service layer architecture with best practices
- [x] Tree view display with expand/collapse
- [x] Add/Edit/Delete menu items
- [x] Delete confirmation dialog
- [x] Search/filter functionality
- [x] Responsive design (mobile & desktop)
- [x] Loading states and error handling
- [x] UI matching Figma design

### Bonus Features ✅
- [x] Drag-and-drop functionality for restructuring menu items
- [x] Docker & Docker Compose setup
- [x] Development mode with hot-reloading
- [x] Production mode with optimized builds
- [x] Multi-stage Docker builds
- [x] Environment variable management
- [x] Move menu items between parents (API endpoint)
- [x] Reorder menu items within same level (API endpoint)
- [x] State management with Zustand
- [x] Database persistence with Docker volumes
- [x] Collapsible sidebar with mobile responsiveness
- [x] Advanced search with autocomplete suggestions

## Quick Start

### Option 1: Using Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/asurya-gz/stk-teknikal-test.git
cd stk-teknikal-test

# Start all services
docker-compose up

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# Swagger: http://localhost:3001/api/docs
```

### Option 2: Local Development

```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run start:dev

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## API Documentation

Complete API documentation available at: **http://localhost:3001/api/docs**

### Key Endpoints:
- `GET /api/menus` - Get all menus (tree structure)
- `POST /api/menus` - Create new menu
- `PUT /api/menus/:id` - Update menu
- `DELETE /api/menus/:id` - Delete menu (cascade)
- `PATCH /api/menus/:id/move` - Move to different parent
- `PATCH /api/menus/:id/reorder` - Reorder within level

## Architecture Decisions

### Backend Architecture
1. **Service Layer Pattern**: Separates business logic from controllers for better testability
2. **DTO Validation**: Ensures data integrity at API boundaries
3. **Cascade Delete**: Automatically maintains data integrity when deleting parent menus
4. **Depth Calculation**: Automatically tracks menu hierarchy depth for performance
5. **Error Handling**: Comprehensive error messages with proper HTTP status codes

### Frontend Architecture
1. **Component-Based**: Reusable React components for maintainability
2. **State Management**: Zustand for simpler, more performant state management than Redux
3. **API Layer**: Centralized axios client for consistent error handling
4. **TypeScript**: Full type safety across the application
5. **Responsive Design**: Mobile-first approach with Tailwind CSS

### Database Design
1. **Self-Referencing**: Parent-child relationship using single table
2. **Cascade Deletion**: Ensures referential integrity
3. **Order Field**: Maintains consistent display order
4. **Depth Tracking**: Optimizes tree traversal operations

## Project Structure

```
menu-tree-system/
├── backend/              # NestJS Backend
│   ├── src/
│   │   ├── menu/        # Menu module (entity, service, controller, DTOs)
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/             # Next.js Frontend
│   ├── src/
│   │   ├── app/         # Pages and layouts
│   │   ├── components/  # React components
│   │   ├── lib/         # API client
│   │   ├── store/       # Zustand store
│   │   └── types/       # TypeScript types
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

## Testing Instructions

1. **Start the Application**
   ```bash
   docker-compose up
   ```

2. **Test CRUD Operations**
   - Click "Add Menu" to create root menu
   - Click menu item to view/edit details
   - Use expand/collapse buttons to navigate tree
   - Use search to filter menus
   - Delete menu with confirmation dialog

3. **Test API Directly**
   - Visit http://localhost:3001/api/docs
   - Use Swagger UI to test all endpoints
   - Try creating nested menus
   - Test move and reorder operations

## Screenshots

[Add screenshots of your running application]

## Deliverables Checklist

- [x] Complete source code with clear folder structure
- [x] README.md with comprehensive documentation
- [x] Database schema with TypeORM entities
- [x] Environment variable templates (.env.example)
- [x] Docker configuration files
- [x] API documentation (Swagger)
- [x] Clean, maintainable code following best practices
- [x] TypeScript for type safety
- [x] Responsive UI matching Figma design
- [x] Error handling and validation

## Notes

- All required features have been implemented
- All bonus features have been implemented
- Code follows clean architecture principles
- UI closely matches the provided Figma design
- Application is production-ready with Docker support
- Complete documentation provided

## Repository

GitHub Repository: https://github.com/asurya-gz/stk-teknikal-test

## Additional Features

Beyond the requirements, the following enhancements have been added:
- **Optimized UI/UX**: Smooth animations and transitions
- **Advanced Tree Navigation**: Breadcrumb-style connection lines
- **Smart Search**: Real-time filtering with autocomplete suggestions
- **Mobile-First Design**: Fully responsive with collapsible sidebar
- **Error Recovery**: User-friendly error messages and retry mechanisms
- **Performance**: Optimized rendering for large menu trees

---

Thank you for reviewing my submission!
