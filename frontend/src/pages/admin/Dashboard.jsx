import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { Package, Tags, Calendar, DollarSign, TrendingUp, Loader2 } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        productos: 0,
        categorias: 0,
        reservas: 0,
        reservasPendientes: 0,
        totalVentasPotencial: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [prodRes, catRes, resRes] = await Promise.all([
                    api.get('/productos'),
                    api.get('/categorias'),
                    api.get('/reservas')
                ]);

                const productos = prodRes.data;
                const reservas = resRes.data;

                setStats({
                    productos: productos.length,
                    categorias: catRes.data.length,
                    reservas: reservas.length,
                    reservasPendientes: reservas.filter(r => r.estado === 'pendiente').length,
                    totalVentasPotencial: reservas.reduce((sum, r) => sum + Number(r.producto_precio || 0), 0)
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { label: 'Productos', value: stats.productos, icon: Package, color: 'from-blue-500 to-cyan-500' },
        { label: 'Categorías', value: stats.categorias, icon: Tags, color: 'from-violet-500 to-purple-500' },
        { label: 'Reservas', value: stats.reservas, icon: Calendar, color: 'from-emerald-500 to-teal-500' },
        { label: 'Pendientes', value: stats.reservasPendientes, icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-slate-400">Resumen general de tu tienda</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass rounded-2xl p-6 hover:border-white/20 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                                <card.icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white">{card.value}</p>
                        <p className="text-sm text-slate-400 mt-1">{card.label}</p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-2xl p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-semibold text-white">Potencial de Ventas (Reservas)</h3>
                </div>
                <p className="text-4xl font-bold text-gradient">{stats.totalVentasPotencial.toFixed(2)} Bs.</p>
                <p className="text-sm text-slate-400 mt-2">Suma del precio de todos los productos reservados</p>
            </motion.div>
        </div>
    );
};

export default Dashboard;
