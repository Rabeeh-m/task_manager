# Task Manager

This is a full-stack Task Management Application built with a **Django REST Framework** backend and a **React** frontend. The application supports user authentication, role-based access control (SuperAdmin, Admin, User), task management, and task completion reports. Users can view and mark tasks as completed, while Admins and SuperAdmins can manage tasks and users through an Admin panel.

## Features
- **User Authentication**: Secure JWT-based authentication for login and registration.
- **Role-Based Access**:
  - **SuperAdmin**: Manage users (create, update, delete, assign roles) and all tasks.
  - **Admin**: Create and manage tasks for assigned users, view completion reports.
  - **User**: View assigned tasks, mark tasks as completed with a completion report and worked hours.
- **Task Management**:
  - Users can view their tasks and mark them as completed via a modal.
  - Admins/SuperAdmins can create, assign, and manage tasks.
  - Completion reports and worked  worked hours are saved for completed tasks.
- **Admin Panel**: Web interface for Admins and SuperAdmins to manage tasks and users.
- **API-Driven**: RESTful APIs for task and user management.

## Tech Stack
- **Backend**:
  - Django 5.2
  - Django REST Framework
  - Django Simple JWT for authentication
  - Django CORS Headers
  - SQLite database
- **Frontend**:
  - React 18
  - React Router DOM
  - Axios for API requests
  - Tailwind CSS for styling

## Setup Instructions
### Prerequisites
- Python 3.8+
- Node.js 18+
- Git

### Backend Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/task-management-app.git
   cd task_manager/backend+
   ```
   
2. **Create a Virtual Environment:**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies:**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Apply Migrations:**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a SuperAdmin User:**:
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the Backend:**:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to the Frontend Directory:**:
   ```bash
   cd ../frontend
   ```
   
2. **Install Dependencies:**:
   ```bash
   npm install
   ```

3. **Install Dependencies:**:
   ```bash
   npm run dev
   ```

# API Endpoints

## Authentication

- `POST /api/register/`  
  Register a new user.

- `POST /api/token/`  
  Obtain JWT tokens (access and refresh) for login.

---

## User Management (SuperAdmin Only)

- `GET /api/users/`  
  List all users.

- `POST /api/users/`  
  Create a new user.

- `GET /api/users/{id}/`  
  Retrieve user details.

- `PUT /api/users/{id}/`  
  Update user details (e.g., role).

- `DELETE /api/users/{id}/`  
  Delete a user.

- `GET /api/profile/`  
  Get logged-in user's profile.

---

## Task Management

- `GET /api/tasks/`  
  - **Users**: List tasks assigned to them.  
  - **Admins**: List tasks they assigned.  
  - **SuperAdmins**: List all tasks.

- `POST /api/tasks/`  
  Create a new task (**Admins/SuperAdmins only**).

- `PUT /api/tasks/{id}/`  
  Update task status, completion report, and worked hours.  
  - **Users**: For their tasks.  
  - **Admins/SuperAdmins**: For any task.

- `GET /api/tasks/{id}/report/`  
  View completion report and worked hours for a completed task (**Admins/SuperAdmins only**).

## Roles and Permissions

### SuperAdmin
- Full access to user and task management.
- Can create/delete users.
- Can assign roles.
-  Can manage all tasks.

### Admin
- Can create and manage tasks for assigned users.
- Can view task completion reports.
- Cannot manage users.

### User
- Can view and update their assigned tasks.
- Must provide a completion report.
- Must log worked hours when marking tasks as completed.

## Contributing

To contribute to this project, follow these steps:

1. **Fork** the repository.

2. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Make changes and commit**:
   ```bash
   git commit -m "Add your feature"
   ```

4. **Push to the branch**:
   ```bash
   git push origin feature/your-feature
   ```

5. Open a **Pull Request**.
