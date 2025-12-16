import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar';
import { FaWrench, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

function Maintenance() {
    const [maintenanceItems, setMaintenanceItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchMaintenanceData();
    }, []);

    const fetchMaintenanceData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/trucks', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const items = [];
            response.data.trucks.forEach(truck => {
                if (truck.maintenanceRules && truck.maintenanceRules.length > 0) {
                    truck.maintenanceRules.forEach(rule => {
                        const nextDue = rule.lastKm + rule.intervalKm;
                        const remaining = nextDue - truck.kilometrage;

                        let status = 'ok';
                        if (remaining <= 0) status = 'urgent';
                        else if (remaining < 1000) status = 'warning';

                        items.push({
                            truckId: truck._id,
                            immatriculation: truck.immatriculation,
                            type: rule.type,
                            interval: rule.intervalKm,
                            lastKm: rule.lastKm,
                            nextDue: nextDue,
                            remaining: remaining,
                            status: status
                        });
                    });
                }
            });

            // Sort by urgency (urgent first)
            items.sort((a, b) => a.remaining - b.remaining);

            setMaintenanceItems(items);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar activePage="maintenance" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <h1 className="text-2xl font-black text-black flex items-center gap-2">
                        <FaWrench /> Maintenance
                    </h1>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left">Camion</th>
                                    <th className="px-6 py-3 text-left">Type</th>
                                    <th className="px-6 py-3 text-left">Dernier Entretien</th>
                                    <th className="px-6 py-3 text-left">Prochain (km)</th>
                                    <th className="px-6 py-3 text-left">Restant</th>
                                    <th className="px-6 py-3 text-left">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center py-8">Chargement...</td></tr>
                                ) : maintenanceItems.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-8 text-gray-500">Aucune règle de maintenance définie.</td></tr>
                                ) : (
                                    maintenanceItems.map((item, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-bold">{item.immatriculation}</td>
                                            <td className="px-6 py-4">{item.type}</td>
                                            <td className="px-6 py-4">{item.lastKm} km</td>
                                            <td className="px-6 py-4">{item.nextDue} km</td>
                                            <td className="px-6 py-4 font-mono">
                                                {item.remaining > 0 ? `${item.remaining} km` : `${item.remaining} km (Dépassé)`}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.status === 'urgent' && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold animate-pulse">
                                                        <FaExclamationTriangle /> CRITIQUE
                                                    </span>
                                                )}
                                                {item.status === 'warning' && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                                                        <FaExclamationTriangle /> Bientôt
                                                    </span>
                                                )}
                                                {item.status === 'ok' && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">
                                                        <FaCheckCircle /> OK
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Maintenance;
