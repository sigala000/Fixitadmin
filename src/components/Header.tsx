import React from 'react';
import { Search, Bell } from 'lucide-react';
import '../styles/Header.css';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="header">
            <div className="header-left">
                <h1 className="page-title">{title}</h1>
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search orders, users, or services..." />
                </div>
            </div>

            <div className="header-right">
                <div className="notification-btn">
                    <Bell size={20} />
                    <span className="dot"></span>
                </div>
                <div className="view-badge">
                    <span className="badge-text">Dashboard View</span>
                    <span className="badge-status">REAL-TIME UPDATE ACTIVE</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
