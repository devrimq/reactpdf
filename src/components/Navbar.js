import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <h1 className="text-white text-center text-2xl mb-4">PDF Dönüştürücü</h1>
            <ul className="flex justify-center space-x-4">
                <li>
                    <Link to="/image-to-pdf" className="text-white hover:text-gray-400">Resimden PDF</Link>
                </li>
                <li>
                    <Link to="/pdf-to-image" className="text-white hover:text-gray-400">PDF'den Resim</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
