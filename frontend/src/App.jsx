import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Productos from './pages/admin/Productos';
import Categorias from './pages/admin/Categorias';
import Reservas from './pages/admin/Reservas';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route element={<Layout />}>
                    {/* Públicas */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />

                    {/* Admin protegidas */}
                    <Route path="/admin" element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Dashboard />} />
                        <Route path="productos" element={<Productos />} />
                        <Route path="categorias" element={<Categorias />} />
                        <Route path="reservas" element={<Reservas />} />
                    </Route>
                </Route>
            </Routes>
        </AuthProvider>
    );
}

export default App;
