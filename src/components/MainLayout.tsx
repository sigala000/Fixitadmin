import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout: React.FC = () => {
    const location = useLocation();

    // Map paths to titles for the header
    const getPageTitle = (path: string) => {
        switch (path) {
            case '/': return 'Dashboard Overview';
            case '/users': return 'User Management';
            case '/artisans': return 'Artisan Management';
            case '/bookings': return 'Booking History';
            case '/finances': return 'Financial Overview';
            case '/settings': return 'Account Settings';
            default: return 'Admin Portal';
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <Header title={getPageTitle(location.pathname)} />
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
