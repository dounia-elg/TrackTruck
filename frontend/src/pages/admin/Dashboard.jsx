import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTruck, FaTrailer, FaRoute, FaCog, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';

function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalTrucks: 0,
        totalTrailers: 0,
        totalTrips: 0,
        activeTrips: 0
    });
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };

            const trucksRes = await axios.get('http://localhost:3001/api/trucks', { headers });
            const trailersRes = await axios.get('http://localhost:3001/api/trailers', { headers });
            const tripsRes = await axios.get('http://localhost:3001/api/trips', { headers });

            setStats({
                totalTrucks: trucksRes.data.count || trucksRes.data.trucks?.length || 0,
                totalTrailers: trailersRes.data.count || trailersRes.data.trailers?.length || 0,
                totalTrips: tripsRes.data.count || tripsRes.data.trips?.length || 0,
                activeTrips: tripsRes.data.trips?.filter(t => t.statut === 'en cours').length || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

}
export default AdminDashboard;