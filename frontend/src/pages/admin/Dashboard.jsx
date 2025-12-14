import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTruck, FaTrailer, FaRoute } from 'react-icons/fa';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar';

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


    return (
        <div className="flex h-screen bg-gray-50">

            <AdminSidebar activePage="dashboard" />

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