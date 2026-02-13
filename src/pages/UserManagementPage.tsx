import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Download, Plus, CheckCircle, Trash2, Edit2, MoreVertical, Users, Hammer } from 'lucide-react';
import StatCard from '../components/StatCard';
import { AdminService } from '../services/admin';
import '../styles/UserManagement.css';
const UserManagementPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            const roleFilter = activeTab === 'all' ? undefined : activeTab;
            const [usersData, statsData] = await Promise.all([
                AdminService.getAllUsers(search || undefined, roleFilter),
                AdminService.getStats()
            ]);
            setUsers(usersData);
            setStats(statsData);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchData();
    };

    const handleVerify = async (userId: string) => {
        if (!window.confirm('Verify this artisan?')) return;
        try {
            await AdminService.verifyArtisan(userId, true);
            fetchData();
        } catch (error) {
            alert('Failed to verify artisan');
        }
    };

    const handleDelete = async (userId: string) => {
        if (!window.confirm('Are you sure you want to PERMANENTLY delete this user? This action cannot be undone.')) return;
        try {
            await AdminService.deleteUser(userId);
            fetchData();
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    return (
        <div className="user-management-page">
            <div className="page-header">
                <div>
                    <h1>User Management</h1>
                    <p>Manage system users, roles, and artisan verifications.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary"><Download size={18} /> Export CSV</button>
                    <button className="btn-primary"><Plus size={18} /> Add User</button>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard
                    title="TOTAL USERS"
                    value={stats?.totalUsers || '1,284'}
                    change={12}
                    icon={<Users size={20} />}
                    iconBg="#E8F5E9"
                />
                <StatCard
                    title="PENDING ARTISANS"
                    value={stats?.pendingVerifications || '42'}
                    change={5}
                    icon={<Hammer size={20} />}
                    iconBg="#FFF3E0"
                />
                <StatCard
                    title="ACTIVE CLIENTS"
                    value={stats?.totalUsers - stats?.totalArtisans || '842'}
                    change={8}
                    icon={<Users size={20} />}
                    iconBg="#E3F2FD"
                />
                <StatCard
                    title="VERIFIED RATE"
                    value="94%"
                    change={2}
                    icon={<CheckCircle size={20} />}
                    iconBg="#E8F5E9"
                />
            </div>

            <div className="content-card card">
                <div className="card-filters">
                    <div className="tabs">
                        <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Users</button>
                        <button className={`tab ${activeTab === 'customer' ? 'active' : ''}`} onClick={() => setActiveTab('customer')}>Clients</button>
                        <button className={`tab ${activeTab === 'artisan' ? 'active' : ''}`} onClick={() => setActiveTab('artisan')}>Artisans</button>
                        <button className={`tab ${activeTab === 'banned' ? 'active' : ''}`} onClick={() => setActiveTab('banned')}>Banned</button>
                    </div>
                    <form className="search-filter" onSubmit={handleSearch}>
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                </div>

                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>USER</th>
                                <th>ROLE</th>
                                <th>STATUS</th>
                                <th>JOINED DATE</th>
                                <th className="text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="user-cell">
                                            <img
                                                src={user.profile?.avatar || "https://ui-avatars.com/api/?name=" + user.profile?.name}
                                                alt=""
                                                className="avatar-small"
                                            />
                                            <div className="user-details">
                                                <span className="user-name">{user.profile?.name}</span>
                                                <span className="user-email">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${user.role}`}>
                                            {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-pill ${user.isVerified ? 'verified' : 'pending'}`}>
                                            {user.role === 'artisan' ? (user.isVerified ? 'VERIFIED' : 'PENDING') : 'ACTIVE'}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-group">
                                            {user.role === 'artisan' && !user.isVerified && (
                                                <button className="verify-btn" onClick={() => handleVerify(user._id)}>
                                                    <CheckCircle size={14} /> Verify
                                                </button>
                                            )}
                                            <button className="icon-btn"><Edit2 size={16} /></button>
                                            <button className="icon-btn danger" onClick={() => handleDelete(user._id)}>
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="icon-btn"><MoreVertical size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <span>Showing 1 to {users.length} of {users.length} users</span>
                    <div className="pagination-btns">
                        <button className="page-btn active">1</button>
                        <button className="page-btn">2</button>
                        <button className="page-btn">3</button>
                        <span>...</span>
                        <button className="page-btn">129</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagementPage;
