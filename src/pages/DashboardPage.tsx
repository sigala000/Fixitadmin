import React, { useEffect, useState } from 'react';
import { Users, Hammer, CalendarCheck, Wallet, MoreVertical, Plus } from 'lucide-react';
import StatCard from '../components/StatCard';
import { AdminService } from '../services/admin';
import '../styles/Dashboard.css';

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, bookingsData] = await Promise.all([
                    AdminService.getStats(),
                    AdminService.getAllBookings()
                ]);
                setStats(statsData);
                setBookings(bookingsData.slice(0, 5)); // Only show latest 5
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard-page">
            <div className="stats-grid">
                <StatCard
                    title="TOTAL USERS"
                    value={stats?.totalUsers || '0'}
                    change={12.5}
                    icon={<Users size={20} />}
                    iconBg="#E8F5E9"
                />
                <StatCard
                    title="ACTIVE ARTISANS"
                    value={stats?.totalArtisans || '0'}
                    change={-2.4}
                    icon={<Hammer size={20} />}
                    iconBg="#E3F2FD"
                    trend="down"
                />
                <StatCard
                    title="TOTAL BOOKINGS"
                    value={stats?.totalBookings || '0'}
                    change={18.2}
                    icon={<CalendarCheck size={20} />}
                    iconBg="#FFF3E0"
                />
                <StatCard
                    title="TOTAL REVENUE"
                    value={`$${stats?.totalRevenue || '0'}`}
                    change={5.1}
                    icon={<Wallet size={20} />}
                    iconBg="#F3E5F5"
                />
            </div>

            <div className="dashboard-grid">
                <div className="chart-section card">
                    <div className="card-header">
                        <h3>User Acquisition</h3>
                        <div className="header-actions">
                            <button className="icon-btn"><MoreVertical size={16} /></button>
                        </div>
                    </div>
                    <div className="chart-placeholder">
                        <p>User growth chart will be rendered here.</p>
                    </div>
                </div>

                <div className="activity-section card">
                    <div className="card-header">
                        <h3>Recent Activity</h3>
                        <button className="btn-text">View All</button>
                    </div>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon user"><Plus size={16} /></div>
                            <div className="activity-info">
                                <p><strong>New user registered</strong></p>
                                <span>2 minutes ago</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon booking"><CalendarCheck size={16} /></div>
                            <div className="activity-info">
                                <p><strong>New booking received</strong></p>
                                <span>15 minutes ago</span>
                            </div>
                        </div>
                        {/* More activity items */}
                    </div>
                </div>

                <div className="table-section card">
                    <div className="card-header">
                        <h3>Latest Bookings</h3>
                        <button className="btn-primary">Manage All Bookings</button>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>CUSTOMER</th>
                                <th>SERVICE</th>
                                <th>AMOUNT</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td>{booking.clientId?.profile?.name || 'Customer'}</td>
                                    <td>{booking.serviceType || 'General Repair'}</td>
                                    <td>$85.00</td>
                                    <td>
                                        <span className={`status-pill ${booking.status.toLowerCase()}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
