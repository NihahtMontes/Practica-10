import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { Plus, Pencil, Trash2, X, Loader2, ImageIcon, Package } from 'lucide-react';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', imagen: '', stock: '', categoria_id: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [pRes, cRes] = await Promise.all([api.get('/productos'), api.get('/categorias')]);
            setProductos(pRes.data);
            setCategorias(cRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (producto = null) => {
        if (producto) {
            setEditing(producto);
            setForm({
                nombre: producto.nombre,
                descripcion: producto.descripcion || '',
                precio: producto.precio,
                imagen: producto.imagen || '',
                stock: producto.stock,
                categoria_id: producto.categoria_id || ''
            });
        } else {
            setEditing(null);
            setForm({ nombre: '', descripcion: '', precio: '', imagen: '', stock: '', categoria_id: '' });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = { ...form, precio: parseFloat(form.precio), stock: parseInt(form.stock) };
            if (editing) {
                await api.put(`/productos/${editing.id}`, data);
            } else {
                await api.post('/productos', data);
            }
            await fetchData();
            setModalOpen(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar este producto?')) return;
        try {
            await api.delete(`/productos/${id}`);
            await fetchData();
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
                    <h1 className="text-2xl font-bold text-white">Productos</h1>
                    <p className="text-slate-400 text-sm">Gestiona tu catálogo de productos</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Producto
                </button>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 uppercase bg-white/5">
                            <tr>
                                <th className="px-6 py-4">Producto</th>
                                <th className="px-6 py-4">Categoría</th>
                                <th className="px-6 py-4">Precio</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {productos.map((p) => (
                                <motion.tr
                                    key={p.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-white/5 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden">
                                                {p.imagen ? (
                                                    <img src={p.imagen} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="w-4 h-4 text-slate-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-200">{p.nombre}</p>
                                                <p className="text-xs text-slate-500 truncate max-w-[200px]">{p.descripcion}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">{p.categoria_nombre || '-'}</td>
                                    <td className="px-6 py-4 font-medium text-indigo-300">{Number(p.precio).toFixed(2)} Bs.</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                            p.stock <= 5 ? 'bg-red-500/10 text-red-300' : 'bg-emerald-500/10 text-emerald-300'
                                        }`}>
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openModal(p)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-indigo-300 transition-colors">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {productos.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        <Package className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                                        No hay productos registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
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
                            className="glass-strong rounded-2xl w-full max-w-lg p-6 space-y-5"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">
                                    {editing ? 'Editar Producto' : 'Nuevo Producto'}
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
                                        rows={2}
                                        value={form.descripcion}
                                        onChange={e => setForm({ ...form, descripcion: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:outline-none focus:border-indigo-500/50"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-300 mb-1">Precio (Bs.)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={form.precio}
                                            onChange={e => setForm({ ...form, precio: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:outline-none focus:border-indigo-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-300 mb-1">Stock</label>
                                        <input
                                            type="number"
                                            required
                                            value={form.stock}
                                            onChange={e => setForm({ ...form, stock: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:outline-none focus:border-indigo-500/50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-300 mb-1">URL Imagen</label>
                                    <input
                                        value={form.imagen}
                                        onChange={e => setForm({ ...form, imagen: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-300 mb-1">Categoría</label>
                                    <select
                                        value={form.categoria_id}
                                        onChange={e => setForm({ ...form, categoria_id: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:outline-none focus:border-indigo-500/50"
                                    >
                                        <option value="" className="bg-slate-900">Sin categoría</option>
                                        {categorias.map(c => (
                                            <option key={c.id} value={c.id} className="bg-slate-900">{c.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 disabled:opacity-60 transition-all"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editing ? 'Guardar Cambios' : 'Crear Producto')}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Productos;
