import React, { useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

// İşçi dosyasının URL'sini ayarlayın
GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const PdfToImage = () => {
    const [file, setFile] = useState(null);
    const [previews, setPreviews] = useState([]);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Lütfen bir PDF dosyası yükleyin.');
            setFile(null);
        }
    };

    const handleConvert = async () => {
        if (!file) {
            setError('Lütfen geçerli bir PDF dosyası seçin.');
            return;
        }

        const pdfDoc = await getDocument(URL.createObjectURL(file)).promise;
        const pngImages = [];

        for (let i = 0; i < pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i + 1);
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const context = canvas.getContext('2d');

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            pngImages.push(canvas.toDataURL('image/png'));
        }

        setPreviews(pngImages);
    };

    const handleRemoveImage = (index) => {
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setPreviews(updatedPreviews);
    };

    // Zip dosyasını indirip tüm resimleri ekleme
    const handleDownloadAll = async () => {
        const zip = new JSZip();
        const imgFolder = zip.folder("images");

        previews.forEach((preview, index) => {
            const imgData = preview.split(',')[1]; // Base64 kısmını al
            imgFolder.file(`page-${index + 1}.png`, imgData, { base64: true });
        });

        const content = await zip.generateAsync({ type: "blob" });
        FileSaver.saveAs(content, "pdf-images.zip");
    };

    return (
        <div id="pdf-to-image" className="p-8">
            <h3 className="text-2xl font-semibold mb-4">PDF'den Resme Dönüştür</h3>

            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="mb-2 border border-gray-300 p-2 rounded-md"
            />
            {error && <p className="text-red-500">{error}</p>}

            {file && (
                <button onClick={handleConvert} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md">
                    Resme Dönüştür
                </button>
            )}

            <div className="flex flex-wrap mt-4">
                {previews.map((preview, index) => (
                    <div key={index} className="relative mr-4 mb-4">
                        <img
                            src={preview}
                            alt={`preview-${index}`}
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

            {previews.length > 0 && (
                <button onClick={handleDownloadAll} className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md">
                    Tüm Resimleri İndir
                </button>
            )}
        </div>
    );
};

export default PdfToImage;
