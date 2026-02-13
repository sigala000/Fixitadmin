import React, { useEffect, useState } from 'react';
import { Calendar, Filter, Download, MoreVertical, Users, Hammer, Clock, CheckCircle, XCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import { AdminService } from '../services/admin';
import '../styles/BookingHistory.css';

const BookingHistoryPage: React.FC = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingsData, statsData] = await Promise.all([
                    AdminService.getAllBookings(),
                    AdminService.getStats()
                ]);
                setBookings(bookingsData);
                setStats(statsData);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchData();
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'completed';
            case 'in-progress': return 'progress';
            case 'cancelled': return 'cancelled';
            default: return 'pending';
        }
    };

    return (
        <div className="booking-history-page">
            <div className="page-header">
                <div>
                    <h1>Booking History</h1>
                    <p>Track and manage all service bookings across the platform.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary"><Download size={18} /> Export Data</button>
                    <button className="btn-primary"><Filter size={18} /> Advanced Filter</button>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard
                    title="TOTAL BOOKINGS"
                    value={stats?.totalBookings || '4,291'}
                    change={15}
                    icon={<Calendar size={20} />}
                    iconBg="#E3F2FD"
                />
                <StatCard
                    title="ACTIVE JOBS"
                    value={stats?.activeBookings || '156'}
                    change={-2}
                    icon={<Clock size={20} />}
                    iconBg="#FFF3E0"
                />
                <StatCard
                    title="COMPLETED"
                    value={stats?.completedBookings || '3,842'}
                    change={12}
                    icon={<CheckCircle size={20} />}
                    iconBg="#E8F5E9"
                />
                <StatCard
                    title="CANCELLED"
                    value={stats?.cancelledBookings || '293'}
                    change={-1}
                    icon={<XCircle size={20} />}
                    iconBg="#FFEBEE"
                />
            </div>

            <div className="content-card card">
                <div className="card-header">
                    <div className="search-filter">
                        <Calendar size={18} className="search-icon" />
                        <input type="text" placeholder="Filter by date, service, or customer..." />
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>BOOKING ID</th>
                                <th>CUSTOMER</th>
                                <th>ARTISAN</th>
                                <th>SERVICE</th>
                                <th>STATUS</th>
                                <th>DATE</th>
                                <th className="text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td><span className="id-text">#{booking._id.slice(-6).toUpperCase()}</span></td>
                                    <td>
                                        <div className="user-info-cell">
                                            <span className="user-name">{booking.clientId?.profile?.name || 'Customer'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="user-info-cell">
                                            <span className="user-name">{booking.artisanId?.profile?.name || 'Artisan'}</span>
                                        </div>
                                    </td>
                                    <td>{booking.serviceType || 'General Repair'}</td>
                                    <td>
                                        <span className={`status-pill ${getStatusStyle(booking.status)}`}>
                                            {booking.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button className="icon-btn"><MoreVertical size={16} /></button>
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

export default BookingHistoryPage;
