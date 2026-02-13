import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Hammer,
    CalendarCheck,
    Wallet,
    Settings,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar: React.FC = () => {
    const { logout, user } = useAuth();

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
        { icon: <Users size={20} />, label: 'Users', path: '/users' },
        { icon: <Hammer size={20} />, label: 'Artisans', path: '/users?tab=artisan' },
        { icon: <CalendarCheck size={20} />, label: 'Bookings', path: '/bookings' },
        { icon: <Wallet size={20} />, label: 'Finances', path: '/finances' },
    ];

    const bottomItems = [
        { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-icon">
                    <img src="/logo-square.png" alt="FixIt" />
                </div>
                <h2>FIXIT <span>Admin</span></h2>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="nav-section nav-bottom">
                    {bottomItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                    <button onClick={logout} className="nav-item logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            <div className="sidebar-user">
                <img
                    src={user?.profile?.avatar || "https://ui-avatars.com/api/?name=" + (user?.profile?.name || "Admin") + "&background=004832&color=fff"}
                    alt="Profile"
                    className="user-avatar"
                />
                <div className="user-info">
                    <span className="user-name">{user?.profile?.name || 'Admin'}</span>
                    <span className="user-role">Super Admin</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
