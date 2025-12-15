import { useState, useEffect } from "react";
import axios from "axios";
import DriverSidebar from "../../components/DriverSidebar";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTruck,
  FaClock,
  FaPlay,
  FaCheckCircle,
} from "react-icons/fa";

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [modalType, setModalType] = useState(null); // 'start' or 'end'
  const [formData, setFormData] = useState({
    kilometrageDepart: "",
    kilometrageArrivee: "",
    consommationCarburant: "",
  });

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:3001/api/trips/my-trips",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTrips(response.data.trips);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const openModal = (trip, type) => {
    setSelectedTrip(trip);
    setModalType(type);
    setFormData({
      kilometrageDepart: "",
      kilometrageArrivee: "",
      consommationCarburant: "",
    });
  };

  const closeModal = () => {
    setSelectedTrip(null);
    setModalType(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let payload = {};

    if (modalType === "start") {
      payload = {
        statut: "en cours",
        kilometrageDepart: parseFloat(formData.kilometrageDepart),
      };
    } else {
      payload = {
        statut: "terminé",
        kilometrageArrivee: parseFloat(formData.kilometrageArrivee),
        consommationCarburant: formData.consommationCarburant
          ? parseFloat(formData.consommationCarburant)
          : 0,
      };
    }

    try {
      await axios.patch(
        `http://localhost:3001/api/trips/${selectedTrip._id}/status`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTrips();
      closeModal();
      alert("Mise à jour réussie !");
    } catch (error) {
      console.error("Erreur update:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "terminé":
        return "bg-green-100 text-green-700";
      case "en cours":
        return "bg-yellow-100 text-yellow-700";
      case "annulé":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <DriverSidebar activePage="my-trips" />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-black text-gray-900">Mes Trajets</h1>
          </header>

          <div className="grid gap-6">
            {trips.length === 0 ? (
              <p className="text-gray-500">Aucun trajet assigné.</p>
            ) : (
              trips.map((trip) => (
                <div
                  key={trip._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3 text-lg font-bold text-gray-900">
                      <span>{trip.lieuDepart}</span>
                      <span className="text-gray-400">➔</span>
                      <span>{trip.lieuArrivee}</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadge(
                        trip.statut
                      )}`}
                    >
                      {trip.statut}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm bg-gray-50 rounded-lg p-4 border border-gray-100 mb-6">
                    {/* Dates */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                          Départ
                        </p>
                        <p className="font-bold text-gray-900 flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-400" />
                          {new Date(trip.dateDepart).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                          Arrivée Prévue
                        </p>
                        <p className="font-bold text-gray-900 flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-400" />
                          {new Date(trip.dateArrivee).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Véhicules */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                          Camion
                        </p>
                        <p className="font-bold text-gray-900">
                          {trip.camion?.immatriculation}
                        </p>
                        <p className="text-xs text-gray-500">
                          {trip.camion?.modele}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                          Remorque
                        </p>
                        <p className="font-bold text-gray-900">
                          {trip.remorque?.immatriculation || "Aucune"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {trip.remorque?.type}
                        </p>
                      </div>
                    </div>

                    {/* Métriques */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                          Kilométrage
                        </p>
                        <div className="space-y-1">
                          {trip.kilometrageDepart && (
                            <p className="text-xs">
                              Départ:{" "}
                              <span className="font-mono font-bold">
                                {trip.kilometrageDepart} km
                              </span>
                            </p>
                          )}
                          {trip.kilometrageArrivee && (
                            <p className="text-xs">
                              Arrivée:{" "}
                              <span className="font-mono font-bold">
                                {trip.kilometrageArrivee} km
                              </span>
                            </p>
                          )}
                          {!trip.kilometrageDepart &&
                            !trip.kilometrageArrivee && (
                              <p className="text-xs italic text-gray-400">
                                Non renseigné
                              </p>
                            )}
                        </div>
                      </div>
                      {trip.distanceParcourue > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                            Total Parcouru
                          </p>
                          <p className="font-bold text-green-600">
                            {trip.distanceParcourue} km
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Autres */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                          Carburant
                        </p>
                        <p className="font-bold text-gray-900">
                          {trip.consommationCarburant
                            ? `${trip.consommationCarburant} L`
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                          Remarques
                        </p>
                        <p className="text-xs text-gray-600 italic">
                          {trip.remarques || "Aucune remarque"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {(trip.statut === "à faire" ||
                      trip.statut === "planifié") && (
                      <button
                        onClick={() => openModal(trip, "start")}
                        className="flex-1 bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                      >
                        <FaPlay size={12} /> Commencer
                      </button>
                    )}

                    {trip.statut === "en cours" && (
                      <button
                        onClick={() => openModal(trip, "end")}
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                      >
                        <FaCheckCircle size={14} /> Terminer
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MODALS */}
        {modalType && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-fade-in">
              <h2 className="text-xl font-bold mb-4">
                {modalType === "start"
                  ? "Démarer le trajet"
                  : "Terminer le trajet"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {modalType === "start" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kilométrage de départ
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition"
                      placeholder="Ex: 150000"
                      value={formData.kilometrageDepart}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kilometrageDepart: e.target.value,
                        })
                      }
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kilométrage d'arrivée
                      </label>
                      <input
                        type="number"
                        required
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition"
                        placeholder="Ex: 150450"
                        value={formData.kilometrageArrivee}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            kilometrageArrivee: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Carburant ajouté (L) (Optionnel)
                      </label>
                      <input
                        type="number"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition"
                        placeholder="Ex: 50"
                        value={formData.consommationCarburant}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            consommationCarburant: e.target.value,
                          })
                        }
                      />
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
                    Valider
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default MyTrips;
