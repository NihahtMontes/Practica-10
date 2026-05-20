import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { Plus, Pencil, Trash2, X, Loader2, Tags } from 'lucide-react';

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ nombre: '', descripcion: '' });

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        setLoading(true);
        try {
            const res = await api.get('/categorias');
            setCategorias(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (cat = null) => {
        if (cat) {
            setEditing(cat);
            setForm({ nombre: cat.nombre, descripcion: cat.descripcion || '' });
        } else {
            setEditing(null);
            setForm({ nombre: '', descripcion: '' });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editing) {
                await api.put(`/categorias/${editing.id}`, form);
            } else {
                await api.post('/categorias', form);
            }
            await fetchCategorias();
            setModalOpen(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar esta categoría?')) return;
        try {
            await api.delete(`/categorias/${id}`);
            await fetchCategorias();
        } catch (err) {
            alert('Error al eliminar');
        }
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Categorías</h1>
                    <p className="text-slate-400 text-sm">Organiza tus productos por categorías</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
                >
                    <Plus className="w-4 h-4" />
                    Nueva Categoría
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorias.map((cat, i) => (
                    <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass rounded-2xl p-5 hover:border-white/20 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center">
                                <Tags className="w-5 h-5 text-indigo-300" />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openModal(cat)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-indigo-300">
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                        <h3 className="font-semibold text-slate-100 mb-1">{cat.nombre}</h3>
                        <p className="text-sm text-slate-400 line-clamp-2">{cat.descripcion || 'Sin descripción'}</p>
                    </motion.div>
                ))}
                {categorias.length === 0 && (
                    <div className="col-span-full text-center py-16 text-slate-500">
                        <Tags className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                        No hay categorías registradas
                    </div>
                )}
            </div>

            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass-strong rounded-2xl w-full max-w-md p-6 space-y-5"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">
                                    {editing ? 'Editar Categoría' : 'Nueva Categoría'}
                                </h3>
                                <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-300 mb-1">Nombre</label>
                                    <input
                                        required
                                        value={form.nombre}
                                        onChange={e => setForm({ ...form, nombre: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:outline-none focus:border-indigo-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-300 mb-1">Descripción</label>
                                    <textarea
                                        rows={3}
                                        value={form.descripcion}
                                        onChange={e => setForm({ ...form, descripcion: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:outline-none focus:border-indigo-500/50"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 disabled:opacity-60 transition-all"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editing ? 'Guardar Cambios' : 'Crear Categoría')}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Categorias;
