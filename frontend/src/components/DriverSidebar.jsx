import { Link, useNavigate } from 'react-router-dom';
import { FaTruck, FaRoute, FaSignOutAlt } from 'react-icons/fa';

function DriverSidebar({ activePage }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-black text-white flex flex-col hidden md:flex h-screen">
            {/* Logo */}
            <div className="p-6 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <FaTruck className="text-2xl" />
                    <div>
                        <span className="text-xl font-bold block leading-none">TrackTruck</span>
                        <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Espace Chauffeur</span>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4">
                <Link
                    to="/driver/my-trips"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition mb-2 ${activePage === 'my-trips' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
                        }`}
                >
                    <FaRoute /> Mes Trajets
                </Link>
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                        {user.name?.charAt(0) || 'D'}
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

export default DriverSidebar;