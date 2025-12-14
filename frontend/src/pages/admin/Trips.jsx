import { useState, useEffect } from 'react';
import { FaRoute, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import AdminSidebar from '../../components/AdminSidebar';
import axios from 'axios';

function Trips() {

    const token = localStorage.getItem('token');

    const [trips, setTrips] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [trailers, setTrailers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingTrip, setEditingTrip] = useState(null);
    const [formData, setFormData] = useState({
        lieuDepart: '',
        lieuArrivee: '',
        dateDepart: '',
        dateArrivee: '',
        chauffeur: '',
        camion: '',
        remorque: '',
        statut: 'planifié'
    });

    useEffect(() => {
        fetchTrips();
        fetchDrivers();
        fetchTrucks();
        fetchTrailers();
    }, []);

    const fetchTrips = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/trips', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrips(response.data.trips || []);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const fetchDrivers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/auth/drivers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDrivers(response.data.drivers || []);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    const fetchTrucks = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/trucks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrucks(response.data.trucks || []);
        } catch (error) {
            console.error('Error fetching trucks:', error);
        }
    };

    const fetchTrailers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/trailers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrailers(response.data.trailers || []);
        } catch (error) {
            console.error('Error fetching trailers:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/trips', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTrips();
            resetForm();
            alert('Trajet créé avec succès!');
        } catch (error) {
            alert('Erreur: ' + (error.response?.data?.error || 'Erreur inconnue'));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/api/trips/${editingTrip._id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTrips();
            resetForm();
            alert('Trajet modifié avec succès!');
        } catch (error) {
            alert('Erreur: ' + (error.response?.data?.error || 'Erreur inconnue'));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce trajet?')) {
            try {
                await axios.delete(`http://localhost:3001/api/trips/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchTrips();
                alert('Trajet supprimé!');
            } catch (error) {
                alert('Erreur: ' + (error.response?.data?.error || 'Erreur inconnue'));
            }
        }
    };

    const startEdit = (trip) => {
        setEditingTrip(trip);
        setFormData({
            lieuDepart: trip.lieuDepart,
            lieuArrivee: trip.lieuArrivee,
            dateDepart: trip.dateDepart?.split('T')[0] || '',
            dateArrivee: trip.dateArrivee?.split('T')[0] || '',
            chauffeur: trip.chauffeur?._id || '',
            camion: trip.camion?._id || '',
            remorque: trip.remorque?._id || '',
            statut: trip.statut
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            lieuDepart: '',
            lieuArrivee: '',
            dateDepart: '',
            dateArrivee: '',
            chauffeur: '',
            camion: '',
            remorque: '',
            statut: 'planifié'
        });
        setEditingTrip(null);
        setShowForm(false);
    };

    return (
        <div className="flex h-screen bg-gray-50">

            {/* SIDEBAR */}
            <AdminSidebar activePage="trips" />

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col">

                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-black text-black">Gestion des Trajets</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                        <FaPlus /> Créer un trajet
                    </button>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">

                    {/* Form Modal */}
                    {showForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] flex flex-col">
                                {/* Modal Header */}
                                <div className="px-4 py-3 border-b border-gray-200">
                                    <h2 className="text-lg font-bold text-black">
                                        {editingTrip ? 'Modifier le trajet' : 'Créer un trajet'}
                                    </h2>
                                </div>

                                {/* Scrollable Form Content */}
                                <div className="px-4 py-3 overflow-y-auto">
                                    <form onSubmit={editingTrip ? handleUpdate : handleAdd} className="space-y-3">

                                        {/* Row 1: Locations */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                    Lieu de départ *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lieuDepart"
                                                    value={formData.lieuDepart}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                                                    placeholder="Casablanca"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                    Lieu d'arrivée *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lieuArrivee"
                                                    value={formData.lieuArrivee}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                                                    placeholder="Rabat"
                                                />
                                            </div>
                                        </div>

                                        {/* Row 2: Dates */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                    Date de départ *
                                                </label>
                                                <input
                                                    type="date"
                                                    name="dateDepart"
                                                    value={formData.dateDepart}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                    Date d'arrivée *
                                                </label>
                                                <input
                                                    type="date"
                                                    name="dateArrivee"
                                                    value={formData.dateArrivee}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Row 3: Driver & Truck */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                    Chauffeur *
                                                </label>
                                                <select
                                                    name="chauffeur"
                                                    value={formData.chauffeur}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none bg-white"
                                                >
                                                    <option value="">-- Chauffeur --</option>
                                                    {drivers.map(driver => (
                                                        <option key={driver._id} value={driver._id}>
                                                            {driver.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                    Camion *
                                                </label>
                                                <select
                                                    name="camion"
                                                    value={formData.camion}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none bg-white"
                                                >
                                                    <option value="">-- Camion --</option>
                                                    {trucks.map(truck => (
                                                        <option key={truck._id} value={truck._id}>
                                                            {truck.immatriculation}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Row 4: Trailer & Status */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                    Remorque
                                                </label>
                                                <select
                                                    name="remorque"
                                                    value={formData.remorque}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none bg-white"
                                                >
                                                    <option value="">-- Aucune --</option>
                                                    {trailers.map(trailer => (
                                                        <option key={trailer._id} value={trailer._id}>
                                                            {trailer.immatriculation}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                    Statut *
                                                </label>
                                                <select
                                                    name="statut"
                                                    value={formData.statut}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none bg-white"
                                                >
                                                    <option value="planifié">Planifié</option>
                                                    <option value="en cours">En cours</option>
                                                    <option value="terminé">Terminé</option>
                                                    <option value="annulé">Annulé</option>
                                                </select>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                {/* Modal Footer */}
                                <div className="px-4 py-3 border-t border-gray-200 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={editingTrip ? handleUpdate : handleAdd}
                                        className="flex-1 px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800"
                                    >
                                        {editingTrip ? 'Modifier' : 'Créer'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Trips Table */}
                    {loading ? (
                        <p className="text-center py-12 text-gray-500">Chargement...</p>
                    ) : trips.length === 0 ? (
                        <p className="text-center py-12 text-gray-500">Aucun trajet trouvé</p>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Départ</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Arrivée</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Date départ</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Chauffeur</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Camion</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Remorque</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Statut</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trips.map((trip) => (
                                        <tr key={trip._id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">{trip.lieuDepart}</td>
                                            <td className="px-6 py-4">{trip.lieuArrivee}</td>
                                            <td className="px-6 py-4">{new Date(trip.dateDepart).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">{trip.chauffeur?.name}</td>
                                            <td className="px-6 py-4">{trip.camion?.immatriculation}</td>
                                            <td className="px-6 py-4">{trip.remorque?.immatriculation}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${trip.statut === 'planifié' ? 'bg-blue-100 text-blue-800' :
                                                    trip.statut === 'en cours' ? 'bg-yellow-100 text-yellow-800' :
                                                        trip.statut === 'terminé' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {trip.statut}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => startEdit(trip)} className="text-green-600 hover:text-green-800 mr-3">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDelete(trip._id)} className="text-red-600 hover:text-red-800">
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Trips;