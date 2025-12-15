import { Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { cartItems } = useCart();
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-chocolate-100 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {user?.role === 'admin' ? (
                    <div className="text-2xl font-serif font-bold text-chocolate-900 flex items-center gap-2 cursor-default">
                        <span className="text-gold-500">Sweet</span>Shop
                    </div>
                ) : (
                    <Link to="/" className="text-2xl font-serif font-bold text-chocolate-900 flex items-center gap-2">
                        <span className="text-gold-500">Sweet</span>Shop
                    </Link>
                )}

                {user?.role !== 'admin' && (
                    <div className="hidden md:flex items-center gap-8 font-medium text-chocolate-700">
                        <Link to="/" className="hover:text-gold-500 transition-colors relative group">
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-500 transition-all group-hover:w-full"></span>
                        </Link>
                        <Link to="/shop" className="hover:text-gold-500 transition-colors relative group">
                            Shop
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-500 transition-all group-hover:w-full"></span>
                        </Link>
                    </div>
                )}

                <div className="flex items-center gap-6">

                    {isAuthenticated && user?.role !== 'admin' && (
                        <div className="flex items-center gap-4">
                            <Link to="/favorites" className="hover:text-gold-500 transition-colors relative" title="My Favorites">
                                <FiHeart size={22} />
                            </Link>
                            <Link to="/cart" className="hover:text-gold-500 transition-colors relative">
                                <FiShoppingBag size={22} />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gold-400 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                                        {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                                    </span>
                                )}
                            </Link>
                        </div>
                    )}

                    {isAuthenticated ? (
                        <>
                            {user?.role === 'admin' ? (
                                <div className="flex items-center gap-6">
                                    <Link to="/admin" className="hover:text-gold-500 transition-colors font-medium relative group">
                                        Analytics
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-500 transition-all group-hover:w-full"></span>
                                    </Link>
                                    <Link to="/admin/inventory" className="hover:text-gold-500 transition-colors font-medium relative group">
                                        Manage Sweets
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-500 transition-all group-hover:w-full"></span>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Link to="/orders" className="hover:text-gold-500 transition-colors font-medium relative group">
                                        Orders
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-500 transition-all group-hover:w-full"></span>
                                    </Link>
                                </>
                            )}

                            <div className="flex items-center gap-4 border-l border-chocolate-200 pl-6 ml-2">
                                <Link to="/profile" className="hover:text-gold-500 transition-colors" title="Profile">
                                    <div className="w-8 h-8 rounded-full bg-chocolate-100 flex items-center justify-center text-chocolate-700 hover:bg-gold-500 hover:text-white transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </Link>
                                <button onClick={logout} className="hover:text-gold-500 transition-colors text-sm font-medium">Logout</button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="hover:text-gold-500 transition-colors font-medium">Login</Link>
                            <Link to="/register" className="bg-gold-500 text-white px-5 py-2 rounded-full hover:bg-gold-600 transition-colors font-medium text-sm">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
