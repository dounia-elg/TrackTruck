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
        chauffeurAssigne: '',
        camionAssigne: '',
        remorqueAssignee: '',
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
            chauffeurAssigne: trip.chauffeurAssigne?._id || '',
            camionAssigne: trip.camionAssigne?._id || '',
            remorqueAssignee: trip.remorqueAssignee?._id || '',
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
            chauffeurAssigne: '',
            camionAssigne: '',
            remorqueAssignee: '',
            statut: 'planifié'
        });
        setEditingTrip(null);
        setShowForm(false);
    };

    
}

export default Trips;