# Garage Management System

## Overview

The Garage Management System is a comprehensive application designed to streamline the operations of a garage. It provides tools for managing customers, employees, vehicles, orders, and services. The system is built with a modern tech stack, featuring a backend API and a frontend user interface.

## Features

- **Customer Management**: Add, edit, and view customer details.
- **Employee Management**: Manage employee records and roles.
- **Order Management**: Create and track service orders.
- **Service Management**: Define and manage services offered by the garage.
- **Dashboard**: View key performance indicators and trends.
- **Authentication**: Secure login and role-based access control.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Next.js, React, Tailwind CSS
- **Database**: MongoDB

## Folder Structure

### Backend

- `app.js`: Entry point for the backend server.
- `config/`: Database configuration.
- `controllers/`: Handles business logic for various entities.
- `middlewares/`: Authentication and other middleware.
- `routes/`: API endpoints.
- `Services/`: Service layer for database operations.

### Frontend

- `src/app/`: Contains pages and layouts for the application.
- `src/components/`: Reusable UI components.
- `src/features/`: Redux slices for state management.
- `src/store/`: Redux store configuration.
- `src/types/`: TypeScript type definitions.
- `public/images/`: Static assets like images.

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/naolaboma/Garage-Management-System.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Garage-Management-System
   ```

#### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the database in `config/db.config.js`.
4. Start the backend server:
   ```bash
   npm start
   ```

#### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open the frontend in your browser at `http://localhost:3000`.
2. Use the dashboard to manage customers, employees, orders, and services.

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any inquiries or support, please contact [naolaboma](https://github.com/naolaboma).
