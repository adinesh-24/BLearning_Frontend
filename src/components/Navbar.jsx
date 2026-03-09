import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Hide navbar on login and register pages
    const hideOnPaths = ['/login', '/register'];
    if (hideOnPaths.includes(location.pathname)) return null;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold" to={user ? (user.role === 'Teacher' ? '/teacher/dashboard' : '/student/home') : '/'}>
                    BLearner
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link me-3">Welcome, <strong>{user.name}</strong></span>
                                </li>
                                {user.role === 'Teacher' && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/teacher/dashboard">Dashboard</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/teacher/create-article">Create Articles</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/teacher/analytics">Track student Analytics</Link>
                                        </li>
                                    </>
                                )}
                                {user.role === 'Student' && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/student/home">Home</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/student/dashboard">Analytics</Link>
                                        </li>
                                    </>
                                )}
                                <li className="nav-item">
                                    <button className="btn btn-light btn-sm ms-2 fw-bold text-primary" onClick={logout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-light btn-sm ms-2 fw-bold text-primary" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
