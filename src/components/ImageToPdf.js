import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

const ImageToPdf = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [previews, setPreviews] = useState([]);
    const [pdfName, setPdfName] = useState('');
    const [pdfCount, setPdfCount] = useState(1);

    const validFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/tiff'];

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const validFiles = selectedFiles.filter(file => validFormats.includes(file.type));
        const invalidFiles = selectedFiles.filter(file => !validFormats.includes(file.type)).map(file => file.name);

        setFiles(prevFiles => [...prevFiles, ...validFiles]);
        setPreviews(prevPreviews => [...prevPreviews, ...validFiles.map(file => URL.createObjectURL(file))]);
        setError(invalidFiles.length > 0 ? `Geçersiz dosya formatları: ${invalidFiles.join(', ')}` : '');
    };

    const embedImage = async (pdfDoc, file) => {
        const imgBytes = await fetch(URL.createObjectURL(file)).then(res => res.arrayBuffer());
        let img;

        if (file.type === 'image/png') {
            img = await pdfDoc.embedPng(imgBytes);
        } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
            img = await pdfDoc.embedJpg(imgBytes);
        } else if (file.type === 'image/tiff') {
            img = await pdfDoc.embedPng(imgBytes);
        }

        return img;
    };

    const handleConvert = async () => {
        if (files.length === 0) {
            setError('Lütfen geçerli bir resim dosyası seçin.');
            return;
        }

        const pdfDoc = await PDFDocument.create();

        for (const file of files) {
            const img = await embedImage(pdfDoc, file);
            if (!img) return;
            const page = pdfDoc.addPage([img.width, img.height]);
            page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const finalPdfName = pdfName.trim() !== '' ? pdfName : `pdf${pdfCount}`;
        setPdfCount(pdfCount + 1);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${finalPdfName}.pdf`;
        a.click();
    };

    const handleRemoveImage = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        const updatedPreviews = previews.filter((_, i) => i !== index);

        setFiles(updatedFiles);
        setPreviews(updatedPreviews);
    };

    return (
        <div id="image-to-pdf" className="p-8">
            <h3 className="text-2xl font-semibold mb-4">Resimlerden PDF'e Dönüştür</h3>

            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="mb-2" />
            {error && <p className="text-red-500">{error}</p>}

            <div className="mt-4">
                <label className="block mb-2">PDF Adı:</label>
                <input
                    type="text"
                    value={pdfName}
                    onChange={(e) => setPdfName(e.target.value)}
                    placeholder="PDF adını girin"
                    className="border border-gray-300 p-2 rounded-md"
                />
            </div>

            <div className="flex flex-wrap mt-4">
                {previews.map((preview, index) => (
                    <div key={index} className="relative mr-4 mb-4">
                        <img
                            src={preview}
                            alt="preview"
                            className="w-24 h-24 object-cover"
                        />
                        <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>

            {files.length > 0 && (
                <button onClick={handleConvert} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md">
                    PDF'e Dönüştür
                </button>
            )}
        </div>
    );
};

export default ImageToPdf;
