# AI Task Dashboard

## Overview
The AI Task Dashboard is a full-stack web application designed to enhance productivity by leveraging AI-driven task management features. It provides real-time collaboration, automated task recommendations, and advanced user authentication with role-based access control.

## Tech Stack
### Backend:
- **Node.js** with **Express.js** - Server-side API development
- **PostgreSQL** with **Sequelize ORM** - Database management
- **JWT Authentication** - Secure user authentication
- **Bcrypt.js** - Password hashing
- **Passport.js** - Authentication middleware

### Frontend (Planned):
- **React.js** with **Next.js** - Frontend framework
- **Tailwind CSS** - Styling
- **Axios** - API communication
- **Redux Toolkit** (Optional) - State management

## Features
### Authentication & Authorization:
- User **registration and login** with JWT-based authentication
- Secure **password hashing** using bcrypt
- Role-Based Access Control (**RBAC**) to restrict actions for regular users and admins

### User Management:
- Ability to **update user profiles**
- Admin dashboard for **managing users** (planned)

### Task Management (Future Scope):
- AI-based **task recommendation system**
- **Drag-and-drop task management** using Kanban board
- **Real-time collaboration** (WebSocket integration)

## Completed Tasks
- **Backend Setup**:
  - Express.js configured with PostgreSQL
  - Sequelize ORM for database operations
  - Environment variables for sensitive data
- **User Authentication**:
  - JWT token generation and verification
  - User registration and login API
  - Password hashing with bcrypt.js
- **JWT Middleware**:
  - Token-based route protection
  - Restricting access to authenticated users
- **Role-Based Access Control (RBAC)**:
  - Restrict admin routes
  - Allow admins to manage users  

## Upcoming Tasks
- **Frontend Development**:
  - Build the UI with React.js and Tailwind CSS
  - Integrate frontend with backend API
- **Task Management Features**:
  - Create and assign tasks
  - AI-based suggestions
  - Real-time task updates


