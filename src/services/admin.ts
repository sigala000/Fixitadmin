const API_URL = window.location.hostname.includes('onrender.com')
    ? 'https://fixitbackend-dzn1.onrender.com/api'
    : 'http://localhost:8000/api';

const getHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const AdminService = {
    // User Management
    getAllUsers: async (search?: string, role?: string) => {
        let url = `${API_URL}/admin/users?`;
        if (search) url += `search=${search}&`;
        if (role) url += `role=${role}&`;

        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    },

    deleteUser: async (userId: string) => {
        const response = await fetch(`${API_URL}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete user');
        return response.json();
    },

    // Artisan Verification
    getPendingArtisans: async () => {
        const response = await fetch(`${API_URL}/admin/pending`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch pending artisans');
        return response.json();
    },

    verifyArtisan: async (userId: string, status: boolean) => {
        const response = await fetch(`${API_URL}/admin/verify/${userId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to verify artisan');
        return response.json();
    },

    // Booking Oversight
    getAllBookings: async () => {
        const response = await fetch(`${API_URL}/admin/bookings`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch bookings');
        return response.json();
    },

    // Stats
    getStats: async () => {
        const response = await fetch(`${API_URL}/admin/stats`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch stats');
        return response.json();
    },

    // Auth Sync (for login)
    syncAuth: async (idToken: string) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: idToken })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Authentication sync failed');
        }

        return response.json();
    }
};
