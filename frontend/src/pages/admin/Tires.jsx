import { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaCog
} from "react-icons/fa";

function Tires() {
  const [tires, setTires] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTire, setSelectedTire] = useState(null);
  const [modalType, setModalType] = useState(null); 
  const [filters, setFilters] = useState({
    camion: '',
    statut: ''
  });
  const [formData, setFormData] = useState({
    camion: '',
    position: '',
    marque: '',
    reference: '',
    dateInstallation: '',
    kilometrageInstallation: '',
    usure: '',
    statut: 'bon'
  });

  useEffect(() => {
    fetchTires();
    fetchTrucks();
  }, [filters]);

  const fetchTires = async () => {
    const token = localStorage.getItem("token");
    try {
      const params = new URLSearchParams();
      if (filters.camion) params.append('camion', filters.camion);
      if (filters.statut) params.append('statut', filters.statut);

      const response = await axios.get(`http://localhost:3001/api/tires?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTires(response.data.tires);
    } catch (error) {
      console.error("Erreur chargement pneus:", error);
      alert("Erreur lors du chargement des pneus");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrucks = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:3001/api/trucks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrucks(response.data.trucks);
    } catch (error) {
      console.error("Erreur chargement camions:", error);
    }
  };

  const openModal = (type, tire = null) => {
    setModalType(type);
    setSelectedTire(tire);

    if (type === 'edit' && tire) {
      setFormData({
        camion: tire.camion._id,
        position: tire.position,
        marque: tire.marque,
        reference: tire.reference,
        dateInstallation: tire.dateInstallation ? tire.dateInstallation.split('T')[0] : '',
        kilometrageInstallation: tire.kilometrageInstallation,
        usure: tire.usure || '',
        statut: tire.statut
      });
    } else if (type === 'add') {
      setFormData({
        camion: '',
        position: '',
        marque: '',
        reference: '',
        dateInstallation: new Date().toISOString().split('T')[0],
        kilometrageInstallation: '',
        usure: '',
        statut: 'bon'
      });
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedTire(null);
    setFormData({
      camion: '',
      position: '',
      marque: '',
      reference: '',
      dateInstallation: '',
      kilometrageInstallation: '',
      usure: '',
      statut: 'bon'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (modalType === 'add') {
        await axios.post('http://localhost:3001/api/tires', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Pneu ajouté avec succès");
      } else if (modalType === 'edit') {
        await axios.put(`http://localhost:3001/api/tires/${selectedTire._id}`, {
          usure: formData.usure,
          statut: formData.statut
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Pneu mis à jour avec succès");
      }

      fetchTires();
      closeModal();
    } catch (error) {
      console.error("Erreur:", error);
      alert(error.response?.data?.error || "Erreur lors de l'opération");
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:3001/api/tires/${selectedTire._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Pneu supprimé avec succès");
      fetchTires();
      closeModal();
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert(error.response?.data?.error || "Erreur lors de la suppression");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'bon':
        return 'bg-green-100 text-green-700';
      case 'moyen':
        return 'bg-yellow-100 text-yellow-700';
      case 'usé':
        return 'bg-orange-100 text-orange-700';
      case 'à remplacer':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'bon':
        return <FaCheckCircle className="text-green-500" size={12} />;
      case 'moyen':
        return <FaExclamationTriangle className="text-yellow-500" size={12} />;
      case 'usé':
        return <FaExclamationTriangle className="text-orange-500" size={12} />;
      case 'à remplacer':
        return <FaTimesCircle className="text-red-500" size={12} />;
      default:
        return <FaCog className="text-gray-500" size={12} />;
    }
  };

  const positions = [
    "avant gauche",
    "avant droit",
    "arrière gauche 1",
    "arrière gauche 2",
    "arrière droit 1",
    "arrière droit 2"
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar activePage="tires" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-xl">Chargement...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar activePage="tires" />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-black text-gray-900">Gestion des Pneus</h1>
            
          </header>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pneus</p>
                  <p className="text-2xl font-bold text-black">{tires.length}</p>
                </div>
                <FaCog className="text-gray-500 text-2xl" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">État Bon</p>
                  <p className="text-2xl font-bold text-black">
                    {tires.filter(t => t.statut === 'bon').length}
                  </p>
                </div>
                <FaCheckCircle className="text-gray-500 text-2xl" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">À Surveiller</p>
                  <p className="text-2xl font-bold text-black">
                    {tires.filter(t => t.statut === 'moyen' || t.statut === 'usé').length}
                  </p>
                </div>
                <FaExclamationTriangle className="text-gray-500 text-2xl" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">À Remplacer</p>
                  <p className="text-2xl font-bold text-black">
                    {tires.filter(t => t.statut === 'à remplacer').length}
                  </p>
                </div>
                <FaTimesCircle className="text-gray-500 text-2xl" />
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-400" />
                  <select
                    value={filters.camion}
                    onChange={(e) => setFilters({...filters, camion: e.target.value})}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                  >
                    <option value="">Tous les camions</option>
                    {trucks.map(truck => (
                      <option key={truck._id} value={truck._id}>
                        {truck.immatriculation} - {truck.modele}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-400" />
                  <select
                    value={filters.statut}
                    onChange={(e) => setFilters({...filters, statut: e.target.value})}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="bon">Bon état</option>
                    <option value="moyen">État moyen</option>
                    <option value="usé">Usé</option>
                    <option value="à remplacer">À remplacer</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => openModal('add')}
                className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition flex items-center gap-2"
              >
                <FaPlus size={12} /> Nouveau Pneu
              </button>
            </div>
          </div>

          {/* Tires Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Camion</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marque</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">État</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Installation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tires.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                        Aucun pneu trouvé
                      </td>
                    </tr>
                  ) : (
                    tires.map((tire) => (
                      <tr key={tire._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {tire.camion?.immatriculation}
                          </div>
                          <div className="text-sm text-gray-500">
                            {tire.camion?.modele}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tire.position}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tire.marque}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tire.reference}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(tire.statut)}`}>
                            {getStatusIcon(tire.statut)}
                            {tire.statut === 'à remplacer' ? 'À remplacer' :
                             tire.statut === 'bon' ? 'Bon' :
                             tire.statut === 'moyen' ? 'Moyen' : 'Usé'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tire.usure ? `${tire.usure}%` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{new Date(tire.dateInstallation).toLocaleDateString()}</div>
                          <div className="text-xs">{tire.kilometrageInstallation} km</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openModal('edit', tire)}
                              className="text-green-600 hover:text-green-900"
                              title="Modifier"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => openModal('delete', tire)}
                              className="text-red-600 hover:text-red-900"
                              title="Supprimer"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MODALS */}
        {modalType && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-fade-in">
              {modalType === 'delete' ? (
                <>
                  <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
                  <p className="text-gray-600 mb-6">
                    Êtes-vous sûr de vouloir supprimer ce pneu ?
                    Cette action est irréversible.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
                    >
                      Supprimer
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-4">
                    {modalType === 'add' ? 'Ajouter un pneu' : 'Modifier le pneu'}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {modalType === 'add' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Camion
                          </label>
                          <select
                            required
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition"
                            value={formData.camion}
                            onChange={(e) => setFormData({ ...formData, camion: e.target.value })}
                          >
                            <option value="">Sélectionner un camion</option>
                            {trucks.map(truck => (
                              <option key={truck._id} value={truck._id}>
                                {truck.immatriculation} - {truck.modele}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Position
                          </label>
                          <select
                            required
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          >
                            <option value="">Sélectionner une position</option>
                            {positions.map(position => (
                              <option key={position} value={position}>
                                {position}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Marque
                            </label>
                            <input
                              type="text"
                              required
                              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition"
                              placeholder="Ex: Michelin"
                              value={formData.marque}
                              onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Référence
                            </label>
                            <input
                              type="text"
                              required
                              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition"
                              placeholder="Ex: Pilot Sport 4"
                              value={formData.reference}
                              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Date d'installation
                            </label>
                            <input
                              type="date"
                              required
                              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition"
                              value={formData.dateInstallation}
                              onChange={(e) => setFormData({ ...formData, dateInstallation: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Kilométrage
                            </label>
                            <input
                              type="number"
                              required
                              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition"
                              placeholder="Ex: 150000"
                              value={formData.kilometrageInstallation}
                              onChange={(e) => setFormData({ ...formData, kilometrageInstallation: e.target.value })}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {modalType === 'edit' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Usure (%)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition"
                              placeholder="Ex: 75"
                              value={formData.usure}
                              onChange={(e) => setFormData({ ...formData, usure: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              État
                            </label>
                            <select
                              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition"
                              value={formData.statut}
                              onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                            >
                              <option value="bon">Bon état</option>
                              <option value="moyen">État moyen</option>
                              <option value="usé">Usé</option>
                              <option value="à remplacer">À remplacer</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition"
                      >
                        {modalType === 'add' ? 'Ajouter' : 'Modifier'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Tires;
