import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTruck, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import AdminSidebar from '../../components/AdminSidebar';
import axios from 'axios';

function Trucks() {
    
    const token = localStorage.getItem('token');

    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingTruck, setEditingTruck] = useState(null);
    const [formData, setFormData] = useState({
        immatriculation: '',
        modele: '',
        capaciteCarburant: '',
        kilometrage: '',
        statut: 'disponible'
    });

    useEffect(() => {
        fetchTrucks();
    }, []);

    const fetchTrucks = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/trucks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrucks(response.data.trucks || []);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
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
            await axios.post('http://localhost:3001/api/trucks', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTrucks(); // Refresh list
            resetForm();
            alert('Camion ajouté avec succès!');
        } catch (error) {
            alert('Erreur: ' + (error.response?.data?.error || 'Erreur inconnue'));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/api/trucks/${editingTruck._id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTrucks(); // Refresh list
            resetForm();
            alert('Camion modifié avec succès!');
        } catch (error) {
            alert('Erreur: ' + (error.response?.data?.error || 'Erreur inconnue'));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce camion?')) {
            try {
                await axios.delete(`http://localhost:3001/api/trucks/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchTrucks(); // Refresh list
                alert('Camion supprimé!');
            } catch (error) {
                alert('Erreur: ' + (error.response?.data?.error || 'Erreur inconnue'));
            }
        }
    };

    const startEdit = (truck) => {
        setEditingTruck(truck);
        setFormData({
            immatriculation: truck.immatriculation,
            modele: truck.modele,
            capaciteCarburant: truck.capaciteCarburant,
            kilometrage: truck.kilometrage,
            statut: truck.statut
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            immatriculation: '',
            modele: '',
            capaciteCarburant: '',
            kilometrage: '',
            statut: 'disponible'
        });
        setEditingTruck(null);
        setShowForm(false);
    };

    return (
        <div className="flex h-screen bg-gray-50">

            {/* SIDEBAR */}
            <AdminSidebar activePage="trucks" />

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col">

                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-black text-black">Gestion des Camions</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                        <FaPlus /> Ajouter un camion
                    </button>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">

                    {/* Form Modal */}
                    {showForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                                <h2 className="text-2xl font-bold mb-4">
                                    {editingTruck ? 'Modifier le camion' : 'Ajouter un camion'}
                                </h2>

                                <form onSubmit={editingTruck ? handleUpdate : handleAdd} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Immatriculation</label>
                                        <input
                                            type="text"
                                            name="immatriculation"
                                            value={formData.immatriculation}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            placeholder="ABC-123-MA"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Modèle</label>
                                        <input
                                            type="text"
                                            name="modele"
                                            value={formData.modele}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            placeholder="Mercedes Actros"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Capacité carburant (L)</label>
                                        <input
                                            type="number"
                                            name="capaciteCarburant"
                                            value={formData.capaciteCarburant}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            placeholder="400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Kilométrage</label>
                                        <input
                                            type="number"
                                            name="kilometrage"
                                            value={formData.kilometrage}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            placeholder="50000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Statut</label>
                                        <select
                                            name="statut"
                                            value={formData.statut}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="disponible">Disponible</option>
                                            <option value="en service">En service</option>
                                            <option value="en maintenance">En maintenance</option>
                                            <option value="hors service">Hors service</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-3">
                                        <button type="submit" className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800">
                                            {editingTruck ? 'Modifier' : 'Ajouter'}
                                        </button>
                                        <button type="button" onClick={resetForm} className="flex-1 bg-gray-200 text-black py-2 rounded-lg hover:bg-gray-300">
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Trucks Table */}
                    {loading ? (
                        <p className="text-center py-12 text-gray-500">Chargement...</p>
                    ) : trucks.length === 0 ? (
                        <p className="text-center py-12 text-gray-500">Aucun camion trouvé</p>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold">Immatriculation</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold">Modèle</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold">Carburant (L)</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold">Kilométrage</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold">Statut</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trucks.map((truck) => (
                                        <tr key={truck._id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">{truck.immatriculation}</td>
                                            <td className="px-6 py-4">{truck.modele}</td>
                                            <td className="px-6 py-4">{truck.capaciteCarburant}</td>
                                            <td className="px-6 py-4">{truck.kilometrage} km</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${truck.statut === 'disponible' ? 'bg-green-100 text-green-800' :
                                                        truck.statut === 'en service' ? 'bg-blue-100 text-blue-800' :
                                                            truck.statut === 'en maintenance' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                    }`}>
                                                    {truck.statut}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => startEdit(truck)} className="text-green-600 hover:text-green-800 mr-3">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDelete(truck._id)} className="text-red-600 hover:text-red-800">
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

export default Trucks;