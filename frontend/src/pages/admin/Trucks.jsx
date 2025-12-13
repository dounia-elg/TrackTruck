import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTruck, FaEdit, FaTrash, FaPlus, FaHome } from 'react-icons/fa';
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

    
}

export default Trucks;