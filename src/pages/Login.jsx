import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-lg">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4 fw-bold text-primary">Login</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="Enter email"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control form-control-lg border-end-0"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                        />
                                        <span
                                            className="input-group-text bg-white border-start-0"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {showPassword ? <FiEyeOff /> : <FiEye />}
                                        </span>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100 btn-lg mb-3">Login</button>
                            </form>
                            <div className="text-center mt-3">
                                <p className="text-muted">Don't have an account? <Link to="/register" className="text-primary text-decoration-none fw-bold">Register here</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
