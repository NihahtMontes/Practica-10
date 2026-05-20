import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, Tags, Calendar, ChevronRight } from 'lucide-react';

const AdminLayout = () => {
    const location = useLocation();
    const menuItems = [
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { to: '/admin/productos', icon: Package, label: 'Productos' },
        { to: '/admin/categorias', icon: Tags, label: 'Categorías' },
        { to: '/admin/reservas', icon: Calendar, label: 'Reservas' },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:w-64 flex-shrink-0"
            >
                <div className="glass rounded-2xl p-4 sticky top-24">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
                        Administración
                    </h3>
                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = item.exact
                                ? location.pathname === item.to
                                : location.pathname.startsWith(item.to);
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                        isActive
                                            ? 'bg-indigo-500/20 text-indigo-300'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                    }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                    {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </motion.aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
