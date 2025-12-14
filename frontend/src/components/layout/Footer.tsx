import { FiMail, FiPhone, FiMapPin, FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-chocolate-800 text-chocolate-100 py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    {/* Brand Section */}
                    <div>
                        <Link to="/" className="text-2xl font-serif font-bold text-white flex items-center gap-2 mb-6">
                            <span className="text-gold-500">Sweet</span>Shop
                        </Link>
                        <p className="leading-relaxed mb-6 text-chocolate-200">
                            Your one-stop destination for the finest sweets and confections. We bring joy to every moment with our carefully curated selection of treats.
                        </p>
                        <div className="flex items-center gap-1 text-sm text-chocolate-300">
                            Made with <FiHeart className="text-red-400 fill-red-400" /> for sweet lovers everywhere
                        </div>
                    </div>



                    {/* Contact Us */}
                    <div>
                        <h3 className="text-gold-500 font-bold text-lg mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-chocolate-200">
                                <FiMail className="text-gold-500" />
                                <span>hello@sweetshop.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-chocolate-200">
                                <FiPhone className="text-gold-500" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3 text-chocolate-200">
                                <FiMapPin className="text-gold-500" />
                                <span>123 Sweet Street, Candy City</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-chocolate-700 pt-8 text-center text-sm text-chocolate-300">
                    <p>&copy; {new Date().getFullYear()} SweetShop. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
