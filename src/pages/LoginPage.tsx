import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { AdminService } from '../services/admin';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const LoginPage: React.FC = () => {
    const { login, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && user) {
            navigate('/', { replace: true });
        }
    }, [user, authLoading, navigate]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Firebase Login
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            // 2. Sync with Backend and Verify Admin Role
            const response = await AdminService.syncAuth(idToken);

            if (response.user.role !== 'admin') {
                await auth.signOut();
                throw new Error('Access denied. Admin privileges required.');
            }

            // 3. Set Auth Context
            login(idToken, response.user);
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container dot-grid">
            <div className="login-card card">
                <div className="login-header">
                    <div className="login-logo">
                        <img src="/logo-square.png" alt="FixIt" />
                    </div>
                    <h1>FIXIT <span>ADMIN</span></h1>
                    <p>Please enter your credentials to access the portal</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="login-error">{error}</div>}

                    <div className="input-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={20} className="input-icon" />
                            <input
                                type="email"
                                placeholder="admin@fixit.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row">
                            <label>Password</label>
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>
                        <div className="input-wrapper">
                            <Lock size={20} className="input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="remember-me">
                        <label>
                            <input type="checkbox" />
                            <span>Remember this device</span>
                        </label>
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Signing in...' : (
                            <>
                                Sign In <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    <div className="login-support">
                        Need help? <a href="#">Contact Support</a>
                    </div>
                </form>
            </div>

            <footer className="login-footer">
                <p>&copy; 2026 FIXIT Systems Inc. All rights reserved.</p>
                <div className="footer-links">
                    <a href="#">Security</a>
                    <span>•</span>
                    <a href="#">Privacy</a>
                    <span>•</span>
                    <a href="#">Terms</a>
                </div>
            </footer>
        </div>
    );
};

export default LoginPage;
