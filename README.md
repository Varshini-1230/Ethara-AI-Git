# Team Task Manager

A full-stack team task management application with authentication, role-based access control, and real-time notifications.

## Features

- **Authentication**: JWT-based login/signup
- **Role-Based Access**: Admin and Member roles with different permissions
- **Project Management**: Create, view, and manage projects
- **Task Management**: Create, assign, update, and delete tasks
- **Dashboard**: Overview of tasks, projects, and statistics
- **Team Management**: Invite, manage, and remove team members
- **Notifications**: Real-time notifications for task assignments and updates

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## Project Structure

```
team-task-manager/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   ├── userController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   ├── users.js
│   │   └── notifications.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── team_task_manager_prototype.html
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy the `.env` file and update the values:
   ```
   NODE_ENV=development
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/team_task_manager
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   JWT_EXPIRE=7d
   ```

4. Start MongoDB service (if running locally)

5. Start the backend server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

The backend will be running on `http://localhost:5001` unless you change `PORT` in `.env`

### Frontend Setup

1. Open `team_task_manager_prototype.html` in a web browser

2. The frontend will automatically connect to the backend API on `http://localhost:5001`

3. Optionally, open the app directly from the backend at:
   ```bash
   http://localhost:5001/
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Projects
- `GET /api/projects` - Get all projects (filtered by user access)
- `POST /api/projects` - Create new project (Admin only)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member to project
- `DELETE /api/projects/:id/members/:userId` - Remove member from project

### Tasks
- `GET /api/tasks` - Get tasks (with optional filters)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/dashboard` - Get dashboard statistics

### Users
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)
- `POST /api/users/invite` - Invite new user (Admin only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification

## User Roles & Permissions

### Admin
- Create, update, delete projects
- Add, remove project members
- Create, update, delete tasks
- Manage team members (invite, update roles, delete)
- View all projects and tasks

### Member
- View projects they are members of
- View tasks assigned to them or in their projects
- Update status of their assigned tasks
- View team members

## Database Models

### User
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: String (enum: 'admin', 'member')
- `avatar`: String
- `createdAt`: Date

### Project
- `name`: String (required)
- `description`: String
- `members`: Array of User ObjectIds
- `createdBy`: User ObjectId (required)
- `createdAt`: Date

### Task
- `title`: String (required)
- `status`: String (enum: 'todo', 'in_progress', 'done', 'overdue')
- `priority`: String (enum: 'low', 'medium', 'high')
- `assignedTo`: User ObjectId (required)
- `projectId`: Project ObjectId (required)
- `dueDate`: Date
- `createdBy`: User ObjectId (required)
- `createdAt`: Date
- `updatedAt`: Date

### Notification
- `message`: String (required)
- `userId`: User ObjectId (required)
- `type`: String (enum: task_assigned, task_completed, etc.)
- `read`: Boolean (default: false)
- `relatedId`: ObjectId (ref to Task/Project/User)
- `relatedModel`: String (enum: 'Task', 'Project', 'User')
- `createdAt`: Date

## Deployment to Railway

1. Create a Railway account at https://railway.app

2. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

3. Login to Railway:
   ```bash
   railway login
   ```

4. Initialize Railway project:
   ```bash
   railway init
   ```

5. Set environment variables in Railway dashboard:
   - `NODE_ENV=production`
   - `MONGO_URI` (use MongoDB Atlas for production)
   - `JWT_SECRET` (generate a secure random string)
   - `JWT_EXPIRE=7d`

6. Deploy:
   ```bash
   railway up
   ```

7. The app will be available at the Railway-provided URL

## Development

### Running Tests
```bash
# Backend tests (if implemented)
npm test
```

### Code Formatting
```bash
# Format code (if prettier configured)
npm run format
```

### Linting
```bash
# Lint code (if eslint configured)
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.