import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }
        try {
            await register(name, email, password);
        } catch (err) {
            // Error is handled in context
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4 fw-bold text-primary">Join BLearner</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted text-uppercase">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg bg-light border-0"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted text-uppercase">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg bg-light border-0"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted text-uppercase">Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control form-control-lg bg-light border-0 border-end-0"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                        />
                                        <span
                                            className="input-group-text bg-light border-0 border-start-0 cursor-pointer text-muted"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {showPassword ? <FiEyeOff /> : <FiEye />}
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-bold small text-muted text-uppercase">Confirm Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="form-control form-control-lg bg-light border-0 border-end-0"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                        />
                                        <span
                                            className="input-group-text bg-light border-0 border-start-0 cursor-pointer text-muted"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                        </span>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100 btn-lg mb-3 fw-bold shadow-sm">Create Account</button>
                            </form>
                            <div className="text-center mt-3">
                                <p className="text-muted">Already have an account? <Link to="/login" className="text-primary text-decoration-none fw-bold">Login here</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
