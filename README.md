# SABİS Toplu Ders Materyali İndirici

![Language](https://img.shields.io/badge/Language-JavaScript-F7DF1E?style=for-the-badge&logo=javascript)

Bu betik (script), Sakarya Üniversitesi Bilgi Sistemi (SABİS) üzerindeki bir dersin "Ders Materyyalleri" sayfasında bulunan tüm dosyaları tek seferde indirmenizi sağlar. Betik, sayfadaki tüm PDF dosyalarını otomatik olarak birleştirir ve tüm materyalleri ders adıyla isimlendirilmiş tek bir `.zip` arşivi içinde sunar.

## Özellikler

- **Toplu İndirme:** Sayfadaki tüm ders materyallerini (PDF, PPTX, DOCX vb.) tek bir işlemle indirir.
- **PDF Birleştirme:** Tüm `.pdf` uzantılı dosyaları, sayfadaki sıralarını koruyarak tek bir PDF dosyasında birleştirir.
- **Dinamik İsimlendirme:** Dersin adını sayfadan otomatik olarak okur ve hem birleştirilmiş PDF'i hem de son `.zip` dosyasını bu isme göre adlandırır.
- **Tek Paket:** Tüm orijinal dosyaları ve birleştirilmiş PDF'i tek bir `.zip` arşivi olarak indirir.
- **Kurulum Gerektirmez:** Herhangi bir program veya eklenti kurmanızı gerektirmez, doğrudan tarayıcı konsolunda çalışır.

## Kullanım Adımları

Bu betiği kullanmak için herhangi bir programlama bilgisine ihtiyacınız yoktur. Aşağıdaki adımları sırasıyla takip etmeniz yeterlidir.

**1. Doğru Sayfaya Gidin**
   - Sakarya Üniversitesi Bilgi Sistemi'ne (SABİS) giriş yapın.
   - Materyallerini indirmek istediğiniz dersin **"Ders Materyalleri"** bölümüne tıklayın.

**2. Geliştirici Konsolunu Açın**
   - Sayfa açıkken, tarayıcınızın geliştirici konsolunu açmak için aşağıdaki kısayol tuşlarını kullanabilirsiniz:
     - **Chrome / Edge / Firefox (Windows/Linux):** `F12` veya `Ctrl + Shift + I`
     - **Chrome / Edge / Firefox (Mac):** `Cmd + Option + I`

**3. Kodu Kopyalayın**
   - Bu projedeki `sabis-downloader.js` dosyasının içeriğinin **tamamını** kopyalayın.

**4. Kodu Çalıştırın**
   - Açtığınız geliştirici panelinde **"Console"** sekmesine gelin.
   - Kopyaladığınız kodu konsol penceresine yapıştırın.
   - `Enter` tuşuna basarak kodu çalıştırın.

**5. İşlemin Tamamlanmasını Bekleyin**
   - Kod çalışmaya başladığında, konsolda işlemin ilerleyişini gösteren mesajlar göreceksiniz (dosyaların indirildiği, PDF'lerin birleştirildiği vb.).
   - Dosya sayısı ve boyutuna bağlı olarak bu işlem birkaç dakika sürebilir. Lütfen işlem tamamlanana kadar sayfayı kapatmayın veya yenilemeyin.

**6. ZIP Dosyasını İndirin**
   - İşlem başarıyla tamamlandığında, tarayıcınız otomatik olarak ders adıyla isimlendirilmiş `.zip` dosyasını indirmek için bir pencere açacaktır. Dosyayı kaydedin.

## Önemli Uyarı: CORS Politikası

> Bu betiğin çalışabilmesi için, dosyaların barındırıldığı sunucunun (`s3-esentepe.sakarya.edu.tr`) kaynaklar arası paylaşıma (CORS) izin vermesi gerekmektedir. Eğer sunucu bu tür isteklere izin vermiyorsa, konsolda **CORS ile ilgili bir hata** alırsınız ve betik dosyaları indiremez. Bu bir kod hatası değil, sunucu taraflı bir güvenlik yapılandırmasıdır.
