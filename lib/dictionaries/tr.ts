// tr — Türkçe sözlük. Anahtar şekli en ile birebir aynıdır (tests/seo.test.ts derin karşılaştırır).
const tr = {
  brand: "TempoBeat",
  tagline: "Kusursuz tempo tutan müzik araçları.",
  metaDesc:
    "Ücretsiz çevrimiçi müzik araçları: hassas bir tarayıcı metronomu, 20 Hz–20 kHz ton üreteci ve aralık hesaplayıcı. Her şey tarayıcında çalışır — kurulacak hiçbir şey yok.",

  nav: {
    tools: "Tüm araçlar",
    categories: "Kategoriler",
    about: "Hakkında",
    menu: "Menü",
    language: "Dil",
  },

  home: {
    heroTitle: "Kusursuz tempoyu tutan bir metronom — doğrudan tarayıcında",
    heroSub:
      "TempoBeat bir müzik araçları setidir: örnek doğruluğunda çevrimiçi metronom, ton üreteci ve aralık hesaplayıcı. Hepsi tarayıcında — hızlı, ücretsiz, kayıt yok, yükleme yok.",
    browseAll: "Tüm araçlara göz at",
    pinned: "Sabitlenen",
    pin: "Üste sabitle",
    unpin: "Sabitlemeyi kaldır",
    popular: "Şu anda popüler",
    categoriesTitle: "Kategoriler",
    featuredTitle: "Popüler araçlar",
    trustLocal: "Tempoların cihazında kalır",
    trustFree: "Ücretsiz, hesap yok",
    trustFast: "Anında, çevrimdışı bile çalışır",
    rotating: [
      "Web Audio saatine göre planlanan metronom — asla kaymaz",
      "Dört kez dokun, ritmin BPM olur",
      "20 Hz'den 20 kHz'e saf tonlar — uygulama indirmeden",
      "İki frekans gir, kesin aralığı al",
    ],
    statsLabels: { tools: "araç", languages: "dil", uploads: "yükleme", accounts: "hesap" },
    eyebrow: "Sonsuza kadar ücretsiz",
    heroCtaSecondary: "Nasıl çalışır",
    statsTools: "{n} araç",
    statsLanguages: "{n} dil",
    statsUploads: "0 yükleme",
    statsAccounts: "0 hesap",
    categoriesSub: "Çalışma ve kulak eğitimi için müzik araçları — hepsi cihazında çalışır.",
    popularSub: "En çok açılan araçlar.",
    privacyTitle: "Çaldığın hiçbir şey cihazından çıkmaz.",
    privacySub:
      "Yükleme adımı yok. Araçlar tarayıcında çalışan JavaScript kodlarıdır — bu bir politika vaadi değil, nasıl inşa edildiklerinin sonucudur.",
    privacyPoint1T: "Yerel işleme",
    privacyPoint1D:
      "Girdiğin tempo ve frekanslar yazarken bellekte işlenir. Hiçbir şey hiçbir yere gönderilmez.",
    privacyPoint2T: "Hesap yok",
    privacyPoint2D: "Kayıt yok, e-posta yok, saklanan geçmiş yok. Aracı aç ve kullan.",
    privacyPoint3T: "Tasarımdan dürüst",
    privacyPoint3D:
      "Bir şey gerçekten tarayıcıda yapılamıyorsa, yapılabiliyormuş gibi göstermek yerine bunu söyleriz.",
    privacyLink: "Tüm gizlilik notunu oku",
    endTitle: "Bir araç seç. Gerisi kendiliğinden.",
    endSub: "On beş dil, sıfır yükleme, kurulacak hiçbir şey yok.",
  },

  tools: {
    title: "Tüm araçlar",
    subtitle: "{count} ücretsiz müzik aracı. Yükleme yok, kayıt yok.",
    filterPlaceholder: "Araçlarda ara…",
    count: "{count} araç",
    empty: "“{query}” ile eşleşen araç yok.",
  },

  categories: {
    pdf: { name: "PDF", desc: "PDF dosyalarını hiçbir yere yüklemeden birleştir, böl, dönüştür ve düzenle." },
    image: { name: "Görsel", desc: "Görselleri doğrudan tarayıcında sıkıştır, yeniden boyutlandır, kırp ve dönüştür." },
    text: { name: "Metin", desc: "Metni yazarken anında say, temizle, sırala ve dönüştür." },
    developer: { name: "Geliştirici", desc: "Günlük geliştirici işleri için biçimlendiriciler, kodlayıcılar, çözücüler ve üreteçler." },
    seo: { name: "SEO", desc: "Meta etiketleri, schema işaretlemesi, SERP önizlemesi ve diğer sayfa içi SEO yardımcıları." },
    security: { name: "Güvenlik", desc: "Şifreler, karma (hash) değerleri ve sorgular — cihazında üretilir, cihazında denetlenir." },
    utility: { name: "Müzik Araçları", desc: "Hassas bir çevrimiçi metronom, ton üreteci ve aralık hesaplayıcı — tamamen tarayıcında çalışan çalışma araçları." },
  },

  tool: {
    howTo: "Nasıl kullanılır",
    faq: "Sık sorulan sorular",
    related: "İlgili araçlar",
    nextStep: "Sonraki adımlar",
    copyLink: "Bağlantıyı kopyala",
    privacyNote:
      "Bu araç tamamen tarayıcında çalışır. Verilerin asla cihazından çıkmaz — hiçbir sunucuya yüklenmez.",
    inCategory: "{category} kategorisinde daha fazlası",
    backToCategory: "Tüm {category} araçları",
  },

  common: {
    openTool: "Aracı aç",
    copy: "Kopyala",
    copied: "Kopyalandı",
    download: "İndir",
    reset: "Sıfırla",
    swap: "Değiştir",
    clear: "Temizle",
    error: "Bir şeyler ters gitti. Girdini kontrol edip tekrar dene.",
    input: "Girdi",
    output: "Sonuç",
    settings: "Seçenekler",
    dropFiles: "Dosyaları buraya bırak veya tıklayarak seç",
    dropFile: "Dosyayı buraya bırak veya tıklayarak seç",
    processing: "İşleniyor…",
    fileSize: "Boyut",
    sample: "Örneği dene",
    uppercase: "BÜYÜKHARF",
  },

  unit: {
    from: "Kaynak",
    to: "Hedef",
    amount: "Miktar",
    result: "Sonuç",
    common: "Sık kullanılan dönüşümler",
    formula: "Formül",
    allUnits: "Tüm birimler",
  },

  text: {
    stats: {
      words: "Kelime",
      characters: "Karakter",
      charsNoSpaces: "Boşluksuz",
      sentences: "Cümle",
      paragraphs: "Paragraf",
      lines: "Satır",
      readingTime: "Okuma süresi",
      readingMinutes: "{n} dk okuma",
    },
  },

  footer: {
    line: "Kusursuz tempo tutan müzik araçları. Burada çaldığın hiçbir şey cihazından çıkmaz.",
    privacy: "Gizlilik",
    terms: "Kullanım Koşulları",
    about: "Hakkında",
    badges: "Rozetler",
    language: "Dil",
  },

  badge: {
    title: "TempoBeat rozetleri",
    desc: "TempoBeat rozetini sitene, README'ne veya dokümanlarına ekle. Rozet buraya bağlanır ve arkasındaki müzik araçlarının tamamen tarayıcıda çalıştığını söyler.",
    voluntary: "Yerleştirme tamamen isteğe bağlıdır — projeyi seviyorsan bir rozet seç. İzin almaya gerek yok.",
    md: "Markdown (README)",
    html: "HTML (web sitesi)",
    thanks: "Duyulmamıza yardım ettiğin için teşekkürler — her yerleştirme, dosyalarına saygı duyan araçları daha çok kişinin keşfetmesini sağlar.",
  },

  embed: {
    title: "Bu aracı gömün",
    desc: "Tek satırla bu aracı sitenize ekleyin — ziyaretçinin tarayıcısında çalışır.",
  },

    mcp: {
    title: "MCP sunucusu — AI erişimli araçlar",
    desc1: "TempoBeat bir MCP (Model Context Protocol) sunucusu içerir: Claude veya Cursor gibi AI asistanları, bu sitedeki müzik matematiğini — nota frekansları, aralıklar ve dokunma temposu — aynı şekilde çalıştırabilir. Aynı test edilmiş mantık, yeniden yazım yok.",
    desc2: "Araçlar sitenin saf fonksiyonlarını çalıştırır (eşit aralıklı akort yükseklikleri, yarım ton mesafeleri, dokunma tempo ortalamaları). npx üzerinden AI istemcisinin makinesinde çalışır; sunucularımıza hiçbir şey gönderilmez.",
    toolsTitle: "Çalıştırılabilir araçlar ({n})",
    requiresNode: "Node.js 18+ gerekir. Sunucu stdio üzerinden yerel çalışır; yalnızca yaptığınız çağrılar makinenizde hesaplanır.",
    privacy: "Node.js 18+ gerekir. Sunucu stdio üzerinden yerel çalışır; yalnızca yaptığınız çağrılar makinenizde hesaplanır.",
  },

    notFound: {
    title: "Sayfa bulunamadı",
    body: "Aradığın araç mevcut değil. Onun yerine tüm araçlara göz at.",
    home: "Ana sayfaya git",
  },
};

export default tr;
