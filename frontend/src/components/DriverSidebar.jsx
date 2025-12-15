import { Link, useNavigate } from 'react-router-dom';
import { FaRoute, FaSignOutAlt } from 'react-icons/fa';

function DriverSidebar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-black text-white flex flex-col h-screen">
            <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold">TrackTruck</h2>
                <span className="text-xs text-gray-400">Espace Chauffeur</span>
            </div>

            <nav className="flex-1 p-4">
                <Link to="/driver/my-trips" className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg text-white">
                    <FaRoute /> Mes Trajets
                </Link>
            </nav>

            <div className="p-4 border-t border-gray-800">
                <div className="mb-4">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-gray-300 hover:text-white">
                    <FaSignOutAlt /> Déconnexion
                </button>
            </div>
        </aside>
    );
}

export default DriverSidebar;