# Task Management Frontend

A modern, responsive React frontend for the Task Management System that provides an intuitive user interface for organizing, tracking, and managing tasks with calendar integration and priority-based organization.

## Features

### User Interface
- **Modern Design**: Clean, responsive UI built with React and modern CSS
- **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices

### Authentication UI
- **Registration Form**: User-friendly signup with email verification
- **Login Interface**: Secure login with JWT token management
- **Profile Management**: Update user information and preferences

### Task Management Interface
- **Task Creation**: Intuitive forms for adding tasks with date picker and priority selection
- **Task Lists**: Organized display of tasks with filtering and sorting options
- **Task Cards**: Visual task representation with status indicators
- **Priority Indicators**: Color-coded priority levels (High, Medium, Low)
- **Status Management**: Easy status updates (Pending, In Progress, Completed)

### Calendar Dashboard
- **Calendar-Based Dashboard**: Main dashboard displays tasks in calendar format
- **Date-Based Task View**: Tasks organized by scheduled dates in calendar columns
- **Status-Based Organization**: Tasks displayed with status indicators (Pending, In Progress, Completed)
- **Task Scheduling**: Visual representation of tasks scheduled for specific dates

### User Experience
- **Real-time Updates**: Instant UI updates on task operations
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: User-friendly error messages and validation
- **Notifications**: Success and error notifications for user actions

## Technology Stack

### Frontend Framework
- **React**: 18.x with functional components and hooks
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing and navigation

### State Management
- **Redux Toolkit**: Modern Redux with simplified syntax
- **React Redux**: React bindings for Redux
- **Redux Persist**: Persist Redux state across sessions
- **React Hooks**: Local state management (useState, useEffect)

### UI Components & Styling
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Responsive Design**: Mobile-first approach with Tailwind utilities
- **Component Styling**: Utility classes for consistent design system

### HTTP Client & API
- **Axios**: HTTP client for API communication
- **JWT Management**: Token storage and authentication handling
- **Redux Integration**: API calls integrated with Redux state management

### Form Management & Validation
- **Formik**: Form state management and validation
- **Yup**: Schema validation for forms
- **React Toastify**: Toast notifications for user feedback

### Icons & UI Elements
- **Lucide React**: Icon library for UI elements

### Development Tools
- **ESLint**: Code linting with React-specific rules
- **Vite**: Fast build tool with SWC plugin
- **React DevTools**: Development debugging

## Installation

### Prerequisites

```- Node.js 16.x or higher
- npm or yarn package manager
```

### Setup Instructions

1. **Clone the repository**
   ```
   - git clone <repository-url>
   - cd task-management-frontend

   ```

2. **Install dependencies**
   ```
   - npm install
     # or
   - yarn install

   ```

   **Main dependencies installed:**
   ```
      - `@reduxjs/toolkit` - Redux state management
      - `react-redux` - React Redux bindings
      - `redux-persist` - Redux state persistence
      - `react-router-dom` - Client-side routing
      - `axios` - HTTP client
      - `formik` - Form management
      - `yup` - Schema validation
      - `react-toastify` - Toast notifications
      - `lucide-react` - Icons
      - `tailwindcss` - Styling framework
      
   ```

3. **Environment Configuration**
   - Create a `.env` file in the project root:
      ```env
      VITE_API_BASE_URL= your_base_url
      
      ```

3. **Tailwind CSS Setup**
   ```
   - Tailwind CSS is included via CDN in the index.html file.
   - No build-time configuration is required.
   ```
    

4. **Start Development Server**
   ```
   - npm run dev
     # or
   - yarn dev

   ```


