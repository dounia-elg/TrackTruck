import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTruck, FaTrailer, FaRoute, FaHome, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';

function AdminDashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    const [stats, setStats] = useState({
        totalTrucks: 0,
        totalTrailers: 0,
        totalTrips: 0,
        activeTrips: 0
    });
    const [loading, setLoading] = useState(true);

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
                totalTrucks: trucksRes.data.count || 0,
                totalTrailers: trailersRes.data.count || 0,
                totalTrips: tripsRes.data.count || 0,
                activeTrips: tripsRes.data.trips?.filter(t => t.statut === 'en cours').length || 0
            });

            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50">

            {/* LEFT SIDEBAR - Black background */}
            <aside className="w-64 bg-black text-white flex flex-col">

                {/* Logo Section */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <FaTruck className="text-2xl" />
                        <span className="text-xl font-bold">TrackTruck</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4">
                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 text-white mb-2">
                        <FaHome /> Dashboard
                    </Link>
                    <Link to="/admin/trucks" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition mb-2">
                        <FaTruck /> Camions
                    </Link>
                    <Link to="/admin/trailers" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition mb-2">
                        <FaTrailer /> Remorques
                    </Link>
                    <Link to="/admin/trips" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition">
                        <FaRoute /> Trajets
                    </Link>
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                            {user.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.role}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
                        <FaSignOutAlt /> Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">

                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <h1 className="text-2xl font-black text-black">Tableau de bord Admin</h1>
                </header>

                <main className="flex-1 overflow-y-auto p-6">

                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Chargement...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-6">

                            {/* Trucks */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                                        <FaTruck className="text-white text-xl" />
                                    </div>
                                    <span className="text-3xl font-black">{stats.totalTrucks}</span>
                                </div>
                                <h3 className="font-semibold text-gray-700">Camions</h3>
                                <p className="text-sm text-gray-500">Total flotte</p>
                            </div>

                            {/* Trailers */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                                        <FaTrailer className="text-white text-xl" />
                                    </div>
                                    <span className="text-3xl font-black">{stats.totalTrailers}</span>
                                </div>
                                <h3 className="font-semibold text-gray-700">Remorques</h3>
                                <p className="text-sm text-gray-500">Total remorques</p>
                            </div>

                            {/* Total Trips */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                                        <FaRoute className="text-white text-xl" />
                                    </div>
                                    <span className="text-3xl font-black">{stats.totalTrips}</span>
                                </div>
                                <h3 className="font-semibold text-gray-700">Total trajets</h3>
                                <p className="text-sm text-gray-500">Tous statuts</p>
                            </div>

                            {/* Active Trips */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                                        <FaRoute className="text-white text-xl" />
                                    </div>
                                    <span className="text-3xl font-black">{stats.activeTrips}</span>
                                </div>
                                <h3 className="font-semibold text-gray-700">Trajets actifs</h3>
                                <p className="text-sm text-gray-500">En cours</p>
                            </div>

                            

                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;