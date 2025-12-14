# Sweet Shop Management System

A full-stack web application for managing a premium Sweet Shop. This system includes an Admin Dashboard for inventory management and a Customer interface for browsing and purchasing sweets.

The Application is built using test driven development (TDD) approach
and clean code practices by committing to the best practices of software development.

## Features

-   **User Authentication**: Secure Login and Registration for Customers and Admins.
-   **Role-Based Access Control**: Protected Admin routes and dashboard.
-   **sweet Management**: Admins can view, edit, delete, and restock sweets.
-  **admin analytics**: Admins can view analytics of the shop.
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
4.  (Optional) Seed the database with initial data:(If the mongouri changes then run this command)
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

## Application WorkFlow Screenshots:

### 1. Landing Page
![Landing Page](frontend/public/workflow%20Screenshot/1.Landing%20Page.png)
The landing page serves as the entry point, featuring a captivating hero section and highlighting premium sweets to attract customers.

### 2. Full Home Page
![Full Home Page](frontend/public/workflow%20Screenshot/2.Full%20Home%20Page.png)
A complete overview of the home page, showcasing the brand identity and navigation options.

### 3. Shop Page
![Shop Page](frontend/public/workflow%20Screenshot/3.Shop%20Page.png)
The main shopping area where customers can browse the full catalog, filter by category, and search for specific sweets.

### 4. Sign Up Page
![Sign Up Page](frontend/public/workflow%20Screenshot/4.SIgnUp%20Page.png)
Registration page for new users to create an account and access personalized features.

### 5. Login Page
![Login Page](frontend/public/workflow%20Screenshot/5.Login%20Page.png)
Secure login interface for existing customers and administrators to access their accounts.

### 6. Admin Analytics Dashboard
![Admin Analytics Dashboard](frontend/public/workflow%20Screenshot/6.Admin%20Analytics%20Dashboard.png)
A comprehensive dashboard for admins to view real-time statistics, revenue metrics, and inventory insights.

### 7. Admin Manage Sweets
![Admin Manage Sweets](frontend/public/workflow%20Screenshot/8.Admin%20Manage%20Sweet.png)
Inventory management interface allowing admins to view, edit, and delete sweet listings.

### 8. Add New Sweet
![Add New Sweet](frontend/public/workflow%20Screenshot/9.Add%20New%20Sweet.png)
Form for admins to add new products to the inventory with details like image, price, and category.

### 9. Admin Profile Page
![Admin Profile Page](frontend/public/workflow%20Screenshot/10.Admin%20Profile%20Page.png)
Profile management section for administrators to update their personal information.

### 10. User Shopping Experience
![User Shopping Page](frontend/public/workflow%20Screenshot/11.Users%20Shopping%20Page.png)
Demonstration of the user interaction flow while browsing and selecting sweets.

### 11. Cart Checkout Page
![Cart Checkout Page](frontend/public/workflow%20Screenshot/12.Cart%20Checkout%20Page.png)
The shopping cart view where users can review items, adjust quantities, and proceed to checkout.

### 12. Stripe Payment Gateway
![Stripe Payment Gateway](frontend/public/workflow%20Screenshot/13.Stripe%20Payment%20Gateway.png)
Secure payment processing interface integrated with Stripe for safe transactions.

### 13. Payment Success Page
![Payment Success Page](frontend/public/workflow%20Screenshot/14.Payment%20Success%20Page.png)
Confirmation screen displayed after a successful transaction, providing order assurance.

### 14. View Orders Page
![View Orders Page](frontend/public/workflow%20Screenshot/15.View%20Orders%20Page.png)
Order history section for users to track their past purchases and status.

### 15. User Profile Page
![User Profile Page](frontend/public/workflow%20Screenshot/16,User%20Profile%20Page.png)
Personal profile area for customers to manage their account details and settings.

## My AI Usage
Artificial Intelligence was used as a development assistant to accelerate and improve productivity during this project. The core design decisions, business logic, and feature implementation were done manually, while AI was used for support in the following areas:

*   **Project Scaffolding**: Assisted in generating the initial folder structure and configuration for the Vite + React frontend and the Express + TypeScript backend.
*   **UI/UX Design Support**: Helped design responsive Navbar and Footer, and complex layouts such as the Hero section and dashboard tables.
*   **Reusable Component Structure**: Provided syntax and structural guidance for reusable components like ProductCard, Modal, and the AuthContext provider, which were then customized and integrated manually.
*   **Debugging Assistance**: Helped identify and resolve issues related to relative import paths, API integration, and TypeScript type mismatches.
*   **Feature Implementation Support**: Assisted with logic suggestions for pagination on the Shop page and inventory restock handling on the backend, while validation and integration were completed manually.
*   **Refactoring and Code Cleanup**: Helped convert plain CSS into Tailwind CSS utility classes and identify unused or redundant code.

AI was used strictly as a support tool, similar to documentation or Stack Overflow, enabling rapid prototyping and efficient implementation of features such as role-based authentication and dynamic data fetching, while ensuring full understanding and control over the final codebase.