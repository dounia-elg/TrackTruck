import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Trucks from './pages/admin/Trucks';
import Trailers from './pages/admin/Trailers';
import Trips from './pages/admin/Trips';
import Maintenance from './pages/admin/Maintenance';
import MyTrips from './pages/driver/MyTrips';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />


          {/* Admin Routes */}
          <Route path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/trucks" element={
            <ProtectedRoute allowedRole="admin">
              <Trucks />
            </ProtectedRoute>
          }
          />
          <Route path="/admin/trailers" element={
            <ProtectedRoute allowedRole="admin">
              <Trailers />
            </ProtectedRoute>
          }
          />
          <Route path="/admin/trips" element={
            <ProtectedRoute allowedRole="admin">
              <Trips />
            </ProtectedRoute>
          }
          />
          <Route path="/admin/maintenance" element={
            <ProtectedRoute allowedRole="admin">
              <Maintenance />
            </ProtectedRoute>
          }
          />

          {/* Driver Routes */}
          <Route path="/driver/my-trips" element={
            <ProtectedRoute allowedRole="driver">
              <MyTrips />
            </ProtectedRoute>
          } />




          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;