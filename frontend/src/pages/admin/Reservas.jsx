import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { Calendar, CheckCircle, XCircle, Clock, Loader2, Trash2 } from 'lucide-react';

const Reservas = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservas();
    }, []);

    const fetchReservas = async () => {
        setLoading(true);
        try {
            const res = await api.get('/reservas');
            setReservas(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatus = async (id, estado) => {
        try {
            await api.put(`/reservas/${id}/estado`, { estado });
            await fetchReservas();
        } catch (err) {
            alert('Error al actualizar estado');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar esta reserva?')) return;
        try {
            await api.delete(`/reservas/${id}`);
            await fetchReservas();
        } catch (err) {
            alert('Error al eliminar');
        }
    };

    const statusConfig = {
        pendiente: { color: 'bg-amber-500/10 text-amber-300 border-amber-500/20', icon: Clock },
        confirmada: { color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', icon: CheckCircle },
        cancelada: { color: 'bg-red-500/10 text-red-300 border-red-500/20', icon: XCircle },
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Reservas</h1>
                <p className="text-slate-400 text-sm">Gestiona las reservas realizadas por los clientes</p>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 uppercase bg-white/5">
                            <tr>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Producto</th>
                                <th className="px-6 py-4">Teléfono</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {reservas.map((r) => {
                                const config = statusConfig[r.estado] || statusConfig.pendiente;
                                const StatusIcon = config.icon;
                                return (
                                    <motion.tr
                                        key={r.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-200">{r.cliente_nombre}</p>
                                            <p className="text-xs text-slate-500 truncate max-w-[200px]">{r.mensaje}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-slate-200">{r.producto_nombre}</p>
                                            <p className="text-xs text-indigo-300">{Number(r.producto_precio).toFixed(2)} Bs.</p>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{r.cliente_telefono || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${config.color}`}>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                {r.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {new Date(r.fecha_reserva).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {r.estado === 'pendiente' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatus(r.id, 'confirmada')}
                                                            className="p-2 rounded-lg hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition-colors"
                                                            title="Confirmar"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatus(r.id, 'cancelada')}
                                                            className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                                                            title="Cancelar"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(r.id)}
                                                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                            {reservas.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        <Calendar className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                                        No hay reservas registradas
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reservas;
