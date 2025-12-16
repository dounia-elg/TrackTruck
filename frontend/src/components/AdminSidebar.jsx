import { Link, useNavigate } from 'react-router-dom';
import { FaTruck, FaTrailer, FaRoute, FaHome, FaSignOutAlt, FaWrench } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function AdminSidebar({ activePage }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-black text-white flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <FaTruck className="text-2xl" />
                    <span className="text-xl font-bold">TrackTruck</span>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4">
                <Link
                    to="/admin/dashboard"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition mb-2 ${activePage === 'dashboard' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
                        }`}
                >
                    <FaHome /> Dashboard
                </Link>
                <Link
                    to="/admin/trucks"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition mb-2 ${activePage === 'trucks' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
                        }`}
                >
                    <FaTruck /> Camions
                </Link>
                <Link
                    to="/admin/trailers"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition mb-2 ${activePage === 'trailers' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
                        }`}
                >
                    <FaTrailer /> Remorques
                </Link>
                <Link
                    to="/admin/trips"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${activePage === 'trips' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
                        }`}
                >
                    <FaRoute /> Trajets
                </Link>
                <Link
                    to="/admin/maintenance"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${activePage === 'maintenance' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
                        }`}
                >
                    <FaWrench /> Maintenance
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
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                >
                    <FaSignOutAlt /> Déconnexion
                </button>
            </div>
        </aside>
    );
}

export default AdminSidebar;