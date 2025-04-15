# MarkIt

<div align ="center">

<!-- ![Banner Image](./frontend/public/MarkItBannerImg.png) -->

_A modern platform for knowledge sharing and discovery._

[Demo](http://ec2-13-61-7-254.eu-north-1.compute.amazonaws.com:8080/) · [Report Bug](https://github.com/gauravChaurasiya18/MarkItFrontend/issues) · [Request Feature](https://github.com/gauravChaurasiya18/MarkItFrontend/issues)

</div>

## Overview

MarkIt is a content platform that enables users to share their expertise through beautifully crafted articles. Built with modern web technologies, it offers a seamless writing and reading experience with features like real-time article updates, user authentication, and social interactions.

## Key Features

- **Secure Authentication System**
    - JWT-based authentication
    - Protected routes
    - Secure password hashing
    - Session management

- **Article Management**
    - Create/Edit/Delete articles
    - Upvoting system
    - Search functionality based on titles (Will be updated to include tags and content)

- **User Features**
    - Custom profiles
    - Article portfolios
    - Bio management

- **Modern UI/UX**
    - Responsive design
    - Intuitive navigation
    - Loading states

## Tech Stack

### Frontend

- [React](https://reactjs.org/) - UI library
- [React Router](https://reactrouter.com/) - Navigation
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build tool

### Backend

- [Node.js](https://nodejs.org/) - Runtime environment
- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [JWT](https://jwt.io/) - Authentication
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Password hashing


## Prerequisites

```json
{
  "node": ">=14.x",
  "npm": ">=6.x",
  "mongodb": ">=4.x" // can be local or cloud-based.
}
```

## Quick Start

1. **Clone and Install**

```bash
# Clone the repository
git clone https://github.com/gauravChaurasiya18/MarkItFrontend.git

# Install dependencies
cd MarkIt
npm install
```

2. **Environment Setup**

```bash
# Backend (.env)
PORT=8081
DB_CONNECTION_STRING=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Frontend (.env)
VITE_API_URL=http://localhost:8081
```

3. **Development**

```bash
# Terminal 1 - Backend
cd backend
node index.js

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173` to see the app in action.

## Project Structure

```
MarkIt/
├── backend/                # Backend source code
│   ├── middleware/        # Authentication middleware
│   ├── models/           # Database models
│   └── routes/           # API routes
└── frontend/             # Frontend source code
    ├── public/           # Static assets
    └── src/
        ├── components/   # Reusable components
        ├── pages/        # Page components
        └── routes/       # Route definitions
```

## Application Flow

1. **Authentication**

   - User registration with email verification
   - JWT-based authentication
   - Protected route handling

2. **Content Management**

   - Article creation
   - Image upload and management
   - Search Functionality based on Titles (Will be updated to include tags and content)

3. **User Interactions**
   - Article upvoting system

## Acknowledgments

- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [MongoDB Documentation](https://docs.mongodb.com)

---

<div align ="center">
Made with ❤️ by <a href="https://www.linkedin.com/in/gaurav-chaurasiya-822056266/">Gaurav Chaurasiya</a>
</div>
