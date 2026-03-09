import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import bcrypt from 'bcryptjs';

// Fixed salt for frontend hashing to ensure consistent output for the same password
const FRONTEND_SALT = '$2a$10$abcdefghijklmnopqrstuu';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const normalizeRole = (user) => {
        if (!user || !user.role) return user;
        const normalizedRole = user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();
        return { ...user, role: normalizedRole };
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(normalizeRole(JSON.parse(storedUser)));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const hashedPassword = bcrypt.hashSync(password, FRONTEND_SALT);
            const res = await api.post('/auth/login', { email, password: hashedPassword });
            let { token, user } = res.data;
            user = normalizeRole(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            toast.success('Login successful!');
            if (user.role === 'Teacher') {
                navigate('/teacher/dashboard');
            } else {
                navigate('/student/home');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
            throw err;
        }
    };

    const register = async (name, email, password) => {
        try {
            const hashedPassword = bcrypt.hashSync(password, FRONTEND_SALT);
            const res = await api.post('/auth/register', { name, email, password: hashedPassword, role: 'Student' });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            toast.success('Registration successful!');
            if (user.role === 'Teacher') {
                navigate('/teacher/dashboard');
            } else {
                navigate('/student/home');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.info('Logged out');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
