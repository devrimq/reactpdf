import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ImageToPdf from './components/ImageToPdf';
import PdfToImage from './components/PdfToImage';
import Hero from './components/Hero';



const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/image-to-pdf" element={<ImageToPdf />} />
        <Route path="/pdf-to-image" element={<PdfToImage />} />
        {/* Varsayılan bir yönlendirme (isteğe bağlı) */}
        <Route path="/" element={<Hero />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
