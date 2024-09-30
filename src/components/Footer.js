import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white text-center py-4 mt-10">
            <p>&copy; {new Date().getFullYear()} PDF Dönüştürücü Uygulaması. Tüm hakları saklıdır.</p>
        </footer>
    );
};

export default Footer;
