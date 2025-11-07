async function downloadAndProcessMaterials() {
    /**
     * Gerekli JavaScript kütüphanelerini dinamik olarak sayfaya yükleyen yardımcı fonksiyon.
     * @param {string} src Yüklenecek kütüphanenin URL'si.
     * @returns {Promise<void>} Yükleme tamamlandığında çözülen bir Promise.
     */
    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };
    
    /**
     * Bir metni, dosya adı olarak kullanılabilecek güvenli bir formata dönüştürür.
     * @param {string} name - Ham metin (örn: "Object Oriented / Software*Engineering").
     * @returns {string} - Temizlenmiş dosya adı (örn: "Object_Oriented_Software_Engineering").
     */
    const sanitizeFilename = (name) => {
        if (!name) return "";
        // Geçersiz karakterleri kaldır ve boşlukları alt çizgiye dönüştür.
        const invalidCharsRegex = /[\\/:"*?<>|]/g;
        return name.trim().replace(invalidCharsRegex, "").replace(/\s+/g, '_');
    };

    // --- Kütüphaneleri Yükleme ---
    console.log("Gerekli kütüphaneler (JSZip, pdf-lib) yükleniyor...");
    try {
        await Promise.all([
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'),
            loadScript('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js')
        ]);
        console.log("Kütüphaneler başarıyla yüklendi.");
    } catch (error) {
        console.error("Kütüphaneler yüklenirken bir hata oluştu. İnternet bağlantınızı veya script URL'lerini kontrol edin.", error);
        return;
    }

    // --- Ders Adını Alma ve Temizleme ---
    console.log("Ders adı taranıyor...");
    let courseName = "Ders_Materyalleri"; // Varsayılan isim
    const courseNameElement = document.querySelector('span.font-weight-bold.text-dark-75.text-hover-primary');
    
    if (courseNameElement) {
        const rawName = courseNameElement.textContent;
        courseName = sanitizeFilename(rawName);
        console.log(`Ders adı bulundu ve temizlendi: "${courseName}"`);
    } else {
        console.warn("Ders adı elementi bulunamadı. Varsayılan isim kullanılacak: 'Ders_Materyalleri'");
    }

    // --- Dosya Bağlantılarını Bulma ve İndirme ---
    console.log("Sayfadaki ders materyali bağlantıları taranıyor...");
    const links = Array.from(document.querySelectorAll('a.btn.btn-info.btn-sm[download]'));

    if (links.length === 0) {
        console.error("İndirilecek dosya bağlantısı bulunamadı. Doğru sayfada olduğunuzdan emin olun.");
        return;
    }

    const allFilesData = [];
    console.log(`${links.length} adet dosya bulundu. Dosyalar belleğe alınıyor...`);

    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const url = link.href;
        const urlParams = new URLSearchParams(new URL(url).search);
        const disposition = urlParams.get('response-content-disposition');
        const filenameMatch = disposition ? disposition.match(/filename="([^"]+)"/) : null;
        
        const filename = filenameMatch ? filenameMatch[1] : `dosya-${Date.now()}`;

        console.log(`[${i + 1}/${links.length}] ${filename} indiriliyor...`);

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP hatası! Durum: ${response.status}`);
            const buffer = await response.arrayBuffer();
            allFilesData.push({ filename, buffer });
        } catch (error) {
            console.error(`${filename} indirilirken bir hata oluştu:`, error.message);
            console.warn("Bu hata genellikle sunucunun CORS politikası nedeniyle oluşur. İşlem durduruldu.");
            return;
        }
    }
    console.log("Tüm dosyalar başarıyla belleğe alındı.");

    // --- PDF Dosyalarını Birleştirme ---
    const pdfBuffers = allFilesData
        .filter(file => file.filename.toLowerCase().endsWith('.pdf'))
        .map(file => file.buffer);
    
    let mergedPdfBytes = null;
    if (pdfBuffers.length > 0) {
        console.log(`${pdfBuffers.length} adet PDF dosyası birleştiriliyor... Bu işlem biraz sürebilir.`);
        try {
            const mergedPdfDoc = await PDFLib.PDFDocument.create();
            for (const pdfBuffer of pdfBuffers) {
                const donorPdfDoc = await PDFLib.PDFDocument.load(pdfBuffer);
                const copiedPages = await mergedPdfDoc.copyPages(donorPdfDoc, donorPdfDoc.getPageIndices());
                copiedPages.forEach(page => mergedPdfDoc.addPage(page));
            }
            mergedPdfBytes = await mergedPdfDoc.save();
            console.log("PDF'ler başarıyla birleştirildi.");
        } catch (pdfError) {
            console.error("PDF'ler birleştirilirken bir hata oluştu:", pdfError);
        }
    } else {
        console.log("Birleştirilecek PDF dosyası bulunamadı.");
    }

    // --- ZIP Arşivi Oluşturma ---
    console.log("ZIP arşivi oluşturuluyor...");
    const zip = new JSZip();

    for (const file of allFilesData) {
        zip.file(file.filename, file.buffer);
    }
    console.log(`${allFilesData.length} adet orijinal dosya arşive eklendi.`);
    
    if (mergedPdfBytes) {
        const mergedPdfFilename = `${courseName}_Birlestirilmis.pdf`;
        zip.file(mergedPdfFilename, mergedPdfBytes);
        console.log(`Birleştirilmiş PDF dosyası ("${mergedPdfFilename}") arşive eklendi.`);
    }

    // --- ZIP Dosyasını İndirme ---
    console.log("ZIP dosyası sıkıştırılıyor ve indirme başlatılıyor...");
    const finalZipFilename = `${courseName}_Materyalleri.zip`;

    zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 } })
        .then(function(content) {
            const tempLink = document.createElement('a');
            tempLink.href = URL.createObjectURL(content);
            tempLink.setAttribute('download', finalZipFilename);
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            console.log(`İşlem tamamlandı! "${finalZipFilename}" dosyası indiriliyor.`);
        });
}

// Ana fonksiyonu çalıştır.
downloadAndProcessMaterials();
