import { useState, useEffect } from 'react';
import { FaTrailer, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import AdminSidebar from '../../components/AdminSidebar';
import axios from 'axios';

function Trailers() {
    
    const token = localStorage.getItem('token');

    const [trailers, setTrailers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingTrailer, setEditingTrailer] = useState(null);
    const [formData, setFormData] = useState({
        immatriculation: '',
        type: '',
        capaciteCharge: '',
        statut: 'disponible'
    });

    useEffect(() => {
        fetchTrailers();
    }, []);

    const fetchTrailers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/trailers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrailers(response.data.trailers || []);
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
            await axios.post('http://localhost:3001/api/trailers', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTrailers();
            resetForm();
            alert('Remorque ajoutée avec succès!');
        } catch (error) {
            alert('Erreur: ' + (error.response?.data?.error || 'Erreur inconnue'));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/api/trailers/${editingTrailer._id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTrailers(); 
            resetForm();
            alert('Remorque modifiée avec succès!');
        } catch (error) {
            alert('Erreur: ' + (error.response?.data?.error || 'Erreur inconnue'));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cette remorque?')) {
            try {
                await axios.delete(`http://localhost:3001/api/trailers/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchTrailers(); 
                alert('Remorque supprimée!');
            } catch (error) {
                alert('Erreur: ' + (error.response?.data?.error || 'Erreur inconnue'));
            }
        }
    };

    const startEdit = (trailer) => {
        setEditingTrailer(trailer);
        setFormData({
            immatriculation: trailer.immatriculation,
            type: trailer.type,
            capaciteCharge: trailer.capaciteCharge,
            statut: trailer.statut
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            immatriculation: '',
            type: '',
            capaciteCharge: '',
            statut: 'disponible'
        });
        setEditingTrailer(null);
        setShowForm(false);
    };

    return (
        <div className="flex h-screen bg-gray-50">

            {/* SIDEBAR */}
            <AdminSidebar activePage="trailers" />

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col">

                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-black text-black">Gestion des Remorques</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                        <FaPlus /> Ajouter une remorque
                    </button>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">

                    {/* Form Modal */}
                    {showForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                                <h2 className="text-2xl font-bold mb-4">
                                    {editingTrailer ? 'Modifier la remorque' : 'Ajouter une remorque'}
                                </h2>

                                <form onSubmit={editingTrailer ? handleUpdate : handleAdd} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Immatriculation</label>
                                        <input
                                            type="text"
                                            name="immatriculation"
                                            value={formData.immatriculation}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            placeholder="XYZ-456-MA"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Type</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="">-- Sélectionner --</option>
                                            <option value="bâchée">Bâchée</option>
                                            <option value="frigorifique">Frigorifique</option>
                                            <option value="citerne">Citerne</option>
                                            <option value="plateau">Plateau</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Capacité de charge (tonnes)</label>
                                        <input
                                            type="number"
                                            name="capaciteCharge"
                                            value={formData.capaciteCharge}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            placeholder="25"
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
                                            {editingTrailer ? 'Modifier' : 'Ajouter'}
                                        </button>
                                        <button type="button" onClick={resetForm} className="flex-1 bg-gray-200 text-black py-2 rounded-lg hover:bg-gray-300">
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Trailers Table */}
                    {loading ? (
                        <p className="text-center py-12 text-gray-500">Chargement...</p>
                    ) : trailers.length === 0 ? (
                        <p className="text-center py-12 text-gray-500">Aucune remorque trouvée</p>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-700 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Immatriculation</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Type</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Capacité (t)</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Statut</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trailers.map((trailer) => (
                                        <tr key={trailer._id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">{trailer.immatriculation}</td>
                                            <td className="px-6 py-4">{trailer.type}</td>
                                            <td className="px-6 py-4">{trailer.capaciteCharge} t</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${trailer.statut === 'disponible' ? 'bg-green-100 text-green-800' :
                                                        trailer.statut === 'en service' ? 'bg-blue-100 text-blue-800' :
                                                            trailer.statut === 'en maintenance' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                    }`}>
                                                    {trailer.statut}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => startEdit(trailer)} className="text-green-600 hover:text-green-800 mr-3">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDelete(trailer._id)} className="text-red-600 hover:text-red-800">
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

export default Trailers;