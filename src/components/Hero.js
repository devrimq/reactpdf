import React from 'react';

const Hero = () => {
    return (
        <div className="bg-blue-600 text-white text-center py-10">
            <h2 className="text-4xl font-bold">PDF Dönüştürücü Uygulaması</h2>
            <p className="text-lg mt-4">Resimden PDF'e, PDF'den resime hızlıca dönüştürün!</p>
            <p className="text-md mt-2 max-w-2xl mx-auto">
                Bu uygulama, kullanıcının bilgisayarında çalışan, verileri kaydetmeyen, güvenli ve hızlı bir çözümdür.
                <br />
                Resimlerinizi PDF formatına kolayca dönüştürün veya PDF belgelerinizi yüksek kalitede görüntülere dönüştürün.
                <br />
                Dönüşüm işlemi tamamen kullanıcıya ait olup, gizliliğinizi koruyarak çalışır.
            </p>
        </div>
    );
};

export default Hero;
