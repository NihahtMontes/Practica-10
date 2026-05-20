import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { Search, MessageCircle, Tag, ShoppingBag, Loader2 } from 'lucide-react';

const Home = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    const [reservandoId, setReservandoId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    api.get('/productos'),
                    api.get('/categorias')
                ]);
                setProductos(prodRes.data);
                setCategorias(catRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleWhatsApp = async (id) => {
        setReservandoId(id);
        try {
            const res = await api.get(`/productos/${id}/whatsapp`);
            window.open(res.data.whatsapp_url, '_blank');
        } catch (err) {
            alert('Error al generar enlace de WhatsApp');
        } finally {
            setReservandoId(null);
        }
    };

    const productosFiltrados = productos.filter(p => {
        const matchCat = categoriaFiltro === 'todas' || p.categoria_id === parseInt(categoriaFiltro);
        const matchSearch = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
        return matchCat && matchSearch;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
            >
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    <span className="text-gradient">Catálogo Digital</span>
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    Explora nuestra colección de productos. Reserva fácilmente por WhatsApp con un solo clic.
                </p>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-4 items-center"
            >
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                    <button
                        onClick={() => setCategoriaFiltro('todas')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                            categoriaFiltro === 'todas'
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                        }`}
                    >
                        Todas
                    </button>
                    {categorias.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setCategoriaFiltro(String(cat.id))}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                                categoriaFiltro === String(cat.id)
                                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                            }`}
                        >
                            {cat.nombre}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {productosFiltrados.map((producto, i) => (
                        <motion.div
                            key={producto.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: i * 0.05 }}
                            className="group glass rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={producto.imagen || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}
                                    alt={producto.nombre}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                                {producto.stock <= 5 && producto.stock > 0 && (
                                    <span className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                        ¡Quedan {producto.stock}!
                                    </span>
                                )}
                                {producto.stock === 0 && (
                                    <span className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                                        Agotado
                                    </span>
                                )}
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-3.5 h-3.5 text-indigo-400" />
                                    <span className="text-xs text-indigo-300">{producto.categoria_nombre || 'Sin categoría'}</span>
                                </div>
                                <h3 className="font-semibold text-slate-100 line-clamp-1">{producto.nombre}</h3>
                                <p className="text-sm text-slate-400 line-clamp-2">{producto.descripcion}</p>
                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-xl font-bold text-gradient">{Number(producto.precio).toFixed(2)} Bs.</span>
                                    <span className="text-xs text-slate-500">Stock: {producto.stock}</span>
                                </div>
                                <button
                                    onClick={() => handleWhatsApp(producto.id)}
                                    disabled={reservandoId === producto.id || producto.stock === 0}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    {reservandoId === producto.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <MessageCircle className="w-4 h-4" />
                                            Reservar por WhatsApp
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {productosFiltrados.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <ShoppingBag className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                    <p className="text-slate-400 text-lg">No se encontraron productos</p>
                </motion.div>
            )}
        </div>
    );
};

export default Home;
