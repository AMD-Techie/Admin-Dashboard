import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Root redirect to /products */}
          <Route path="/" element={<Navigate to="/products" replace />} />

          {/* Login page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Product pages */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <ProductDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
