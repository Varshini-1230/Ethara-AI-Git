# Team Task Manager - Frontend

This is the frontend application for the Team Task Manager, a full-stack web application designed for managing team projects, tasks, and workflows. Built with React and Tailwind CSS, it offers a premium, modern, and responsive user interface with glassmorphism design elements.

## Features

- **Authentication & Authorization**: Secure login and signup with JWT token handling.
- **Role-Based Access Control**: Different views and capabilities for Admin and Member roles.
- **Dynamic Dashboard**: Visual statistics and progress charts using `Chart.js`.
- **Project Management**: Create and view projects with member and due date details.
- **Task Management**: Create tasks, assign them to team members, and update statuses (Pending, In Progress, Completed).
- **Modern UI/UX**: Premium styling utilizing Tailwind CSS, Lucide React icons, and custom glassmorphism components.

## Technology Stack

- **React** (Functional Components & Hooks)
- **Vite** (Build Tool)
- **React Router DOM** (Routing)
- **Axios** (API Client)
- **Tailwind CSS v3** (Styling)
- **Chart.js & React-Chartjs-2** (Data Visualization)
- **Lucide React** (Icons)

## Folder Structure

```
src/
├── components/       # Reusable UI components (Navbar, Sidebar, Layouts)
├── context/          # React Context API (AuthContext)
├── pages/            # Page components (Dashboard, Login, Projects, Tasks)
├── services/         # API integration layer (Axios instance)
├── App.jsx           # Main application routing
├── main.jsx          # Application entry point
└── index.css         # Global styles and Tailwind directives
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Variables:
   If your backend is running on a different port, update the `baseURL` in `src/services/api.js`. The default is `http://localhost:5000/api`.

### Running the Application Locally

Start the Vite development server:

```bash
npm run dev
```

The application will typically run on `http://localhost:5173`. Open this URL in your browser.

## API Integration

The frontend expects a backend exposing REST APIs at `http://localhost:5000/api` (configured in `src/services/api.js`). Ensure your backend is running and properly CORS-configured to accept requests from the Vite dev server.

### Expected Endpoints:
- `POST /auth/login` - Authenticate and return JWT token
- `POST /auth/register` - Create a new user
- `GET /projects` - Fetch all projects
- `POST /projects` - Create a new project
- `GET /tasks` - Fetch all tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update task status

*(Note: Currently, the frontend uses simulated data fetches in `useEffect` blocks to ensure the UI works even if the backend is not fully connected. To integrate the real backend, simply uncomment the `api` calls in the respective page components.)*
