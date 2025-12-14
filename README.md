# Sweet Shop Management System

A full-stack web application for managing a premium Sweet Shop. This system includes an Admin Dashboard for inventory management and a Customer interface for browsing and purchasing sweets.

The Application is built using test driven development (TDD) approach
and clean code practices by committing to the best practices of software development.

## Features

-   **User Authentication**: Secure Login and Registration for Customers and Admins.
-   **Role-Based Access Control**: Protected Admin routes and dashboard.
-   **sweet Management**: Admins can view, edit, delete, and restock sweets.
-   **User Interface**: Customers can browse sweets with filtering and search capabilities.
-   **Shopping Cart**: Add items to cart and manage quantities.
-   **Payment Integration**: Secure payment processing using Stripe.
-   **Responsive Design**: A beautiful, responsive UI built with Tailwind CSS.

## Tech Stack

-   **Frontend**: React, TypeScript, Vite, Tailwind CSS
-   **Backend**: Node.js, Express, TypeScript, MongoDB
-   **State Management**: React Context API
-   **Authentication**: JWT (JSON Web Tokens)

## Setup Instructions

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB (Running locally or Compass/Atlas connection string)

### 1. Verification

Clone the repository to your local machine.

### 2. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory with the following variables:
    Use the below drive link for backend .env file (To view the file use the link):
    
    **link: https://drive.google.com/file/d/1nSi9NG8jG2fgKs1cjVfiqEAfVbYb2aoG/view?usp=sharing**
4.  (Optional) Seed the database with initial data:
    ```bash
    npm run seed
    ```
5.  Start the backend server:
    ```bash
    npm run dev
    ```
    The server should start on `http://localhost:5000`.

### 3. Frontend Setup

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `frontend` directory:
    Use the below drive link for frontend .env file (To view the file use the link):
    
    **link: https://drive.google.com/file/d/1VlvjzLw7bjMhAJ25Y04Jyox5cDaPqOEu/view?usp=sharing**
4.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173`.

## Usage
    
-   **Admin Account**: Register a new account with admin role
    *   Use my Account for Admin Login:
    *   **email: admin@example.com**
    *   **password: password123**

-   **Customer Account**: Sign up normally through the "Sign Up" page.
    *   Use my Account for Customer Login:
    *   **email: customer@example.com**
    *   **password: password123**

## My Test reports:
    use this link to view the test reports:
    **link:https://docs.google.com/document/d/1yuCL1ug_SP6zcpjl5CNbjxUA86zlAJIJosik73OBY9s/edit?usp=sharing**

## My AI Usage
Artificial Intelligence was used as a development assistant to accelerate and improve productivity during this project. The core design decisions, business logic, and feature implementation were done manually, while AI was used for support in the following areas:

*   **Project Scaffolding**: Assisted in generating the initial folder structure and configuration for the Vite + React frontend and the Express + TypeScript backend.
*   **UI/UX Design Support**: Helped design responsive Navbar and Footer, and complex layouts such as the Hero section and dashboard tables.
*   **Reusable Component Structure**: Provided syntax and structural guidance for reusable components like ProductCard, Modal, and the AuthContext provider, which were then customized and integrated manually.
*   **Debugging Assistance**: Helped identify and resolve issues related to relative import paths, API integration, and TypeScript type mismatches.
*   **Feature Implementation Support**: Assisted with logic suggestions for pagination on the Shop page and inventory restock handling on the backend, while validation and integration were completed manually.
*   **Refactoring and Code Cleanup**: Helped convert plain CSS into Tailwind CSS utility classes and identify unused or redundant code.

AI was used strictly as a support tool, similar to documentation or Stack Overflow, enabling rapid prototyping and efficient implementation of features such as role-based authentication and dynamic data fetching, while ensuring full understanding and control over the final codebase.