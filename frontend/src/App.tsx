import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Success from './pages/Success';
import AdminDashboard from './pages/Admin/Dashboard';
import Orders from './pages/Orders';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Inventory from './pages/Admin/Inventory';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-chocolate-50 font-sans text-chocolate-900">
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#3e2723',
          color: '#fff',
        },
      }} />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/success" element={<Success />} />
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/inventory" element={<Inventory />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          {/* We will add more routes later */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
