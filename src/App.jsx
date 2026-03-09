import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherAnalytics from './pages/TeacherAnalytics';
import CreateArticle from './pages/CreateArticle';
import StudentHome from './pages/StudentHome';
import StudentDashboard from './pages/StudentDashboard';
import ArticleView from './pages/ArticleView';
import { ToastContainer } from 'react-toastify';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Routes>
        {/* Public Routes - Redirect if already logged in */}
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />

        {/* Home Redirect */}
        <Route path="/" element={
          user ? (
            user.role === 'Teacher' ? <Navigate to="/teacher/dashboard" replace /> : <Navigate to="/student/home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        {/* Teacher Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Teacher']} />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/create-article" element={<CreateArticle />} />
          <Route path="/teacher/edit-article/:id" element={<CreateArticle />} />
          <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
          <Route path="/student/home" element={<StudentHome />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/article/:id" element={<ArticleView />} />
        </Route>

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
