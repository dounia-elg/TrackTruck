import { useState, useEffect } from 'react';
import axios from 'axios';
import DriverSidebar from '../../components/DriverSidebar';
import { FaMapMarkerAlt, FaCalendarAlt, FaTruck, FaClock } from 'react-icons/fa';

function MyTrips() {
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        const fetchTrips = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:3001/api/trips/my-trips', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrips(response.data.trips);
            } catch (error) {
                console.error("Erreur:", error);
            }
        };
        fetchTrips();
    }, []);

    const getStatusDotColor = (status) => {
        switch (status) {
            case 'terminé': return 'bg-green-500';
            case 'en cours': return 'bg-yellow-500';
            case 'annulé': return 'bg-red-500';
            default: return 'bg-blue-500';
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <DriverSidebar />

            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mes Trajets</h1>
                        <p className="text-gray-500 mt-2">Gérez vos missions et suivez vos itinéraires.</p>
                    </header>

                    <div className="grid gap-6">
                        {trips.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaTruck className="text-2xl text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Aucun trajet</h3>
                                <p className="text-gray-500">Vous n'avez pas de missions assignées pour le moment.</p>
                            </div>
                        ) : (
                            trips.map(trip => (
                                <div key={trip._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                    {/* Top Row: Route & Status */}
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                                        <div className="flex items-center gap-3 text-lg font-bold text-gray-900">
                                            <span>{trip.lieuDepart}</span>
                                            <span className="text-gray-400">➔</span>
                                            <span>{trip.lieuArrivee}</span>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${trip.statut === 'terminé' ? 'bg-green-100 text-green-700' :
                                                trip.statut === 'en cours' ? 'bg-yellow-100 text-yellow-700' :
                                                    trip.statut === 'annulé' ? 'bg-red-100 text-red-700' :
                                                        'bg-blue-100 text-blue-700'
                                            }`}>
                                            {trip.statut}
                                        </div>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-gray-50 rounded-lg p-4 border border-gray-100">
                                        {/* Dates */}
                                        <div className="flex flex-col justify-center">
                                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                                <FaCalendarAlt className="text-gray-400" />
                                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Départ</span>
                                            </div>
                                            <p className="font-semibold text-gray-900">{new Date(trip.dateDepart).toLocaleDateString()}</p>
                                        </div>

                                        <div className="flex flex-col justify-center">
                                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                                <FaCalendarAlt className="text-gray-400" />
                                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Arrivée</span>
                                            </div>
                                            <p className="font-semibold text-gray-900">{new Date(trip.dateArrivee).toLocaleDateString()}</p>
                                        </div>

                                        {/* Vehicle Info */}
                                        <div className="flex items-center gap-4 md:border-l md:border-gray-200 md:pl-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FaTruck className="text-gray-400" />
                                                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Véhicule</span>
                                                </div>
                                                <div className="font-bold text-gray-900">
                                                    {trip.camion?.immatriculation}
                                                    {trip.remorque && (
                                                        <span className="font-normal text-gray-500 ml-1">
                                                            + {trip.remorque.immatriculation}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default MyTrips;