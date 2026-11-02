// it: dizionario UI italiano — forma chiavi identica a en (tests/seo.test.ts fa un confronto ricorsivo).
// Registro informale ("tu"), coerente con il resto del sito. "TempoBeat" e i segnaposto {n}/{count}/{query}/{category} restano intatti.
const it = {
  brand: "TempoBeat",
  tagline: "Strumenti musicali che tengono un tempo perfetto.",
  metaDesc:
    "Strumenti musicali online gratuiti: un metronomo preciso nel browser, un generatore di toni da 20 Hz a 20 kHz e una calcolatrice di intervalli. Tutto gira nel tuo browser — niente da installare.",

  nav: {
    tools: "Tutti gli strumenti",
    categories: "Categorie",
    about: "Chi siamo",
    menu: "Menu",
    language: "Lingua",
  },

  home: {
    heroTitle: "Un metronomo che mantiene un tempo perfetto — direttamente nel tuo browser",
    heroSub:
      "TempoBeat è un insieme di strumenti musicali: un metronomo online preciso al campione, un generatore di toni e una calcolatrice di intervalli. Tutto nel tuo browser — veloce, gratis, senza registrazione e senza upload.",
    browseAll: "Sfoglia tutti gli strumenti",
    categoriesTitle: "Categorie",
    featuredTitle: "Strumenti popolari",
    trustLocal: "Il tuo tempo resta sul tuo dispositivo",
    trustFree: "Gratis, senza account",
    trustFast: "Istantaneo, funziona offline",
    rotating: [
      "Un metronomo programmato sull'orologio Web Audio — mai uno scostamento",
      "Tocca quattro volte e il tuo ritmo diventa il BPM",
      "Toni puri da 20 Hz a 20 kHz, senza scaricare nessuna app",
      "Due frequenze dentro, l'intervallo esatto fuori",
    ],
    statsLabels: { tools: "strumenti", languages: "lingue", uploads: "upload", accounts: "account" },
    eyebrow: "Gratis per sempre",
    heroCtaSecondary: "Come funziona",
    statsTools: "{n} strumenti",
    statsLanguages: "{n} lingue",
    statsUploads: "0 upload",
    statsAccounts: "0 account",
    categoriesSub: "Strumenti musicali per lo studio e l'orecchio, tutti in esecuzione sul tuo dispositivo.",
    popularSub: "Gli strumenti che le persone aprono più spesso.",
    privacyTitle: "Nulla di ciò che suoni lascia il tuo dispositivo.",
    privacySub:
      "Non esiste un passaggio di upload. Gli strumenti sono JavaScript in esecuzione nel tuo browser: non è una promessa in una privacy policy, è come sono costruiti.",
    privacyPoint1T: "Elaborazione locale",
    privacyPoint1D:
      "Il tempo e le frequenze che inserisci vengono elaborati in memoria mentre scrivi. Nulla viene trasmesso, da nessuna parte.",
    privacyPoint2T: "Nessun account",
    privacyPoint2D: "Niente registrazione, niente email, niente cronologia salvata. Apri uno strumento e usalo.",
    privacyPoint3T: "Onesti per costruzione",
    privacyPoint3D:
      "Se qualcosa non si può davvero fare nel browser, lo diciamo invece di fingere il contrario.",
    privacyLink: "Leggi la nota privacy completa",
    endTitle: "Scegli uno strumento. Funziona, e basta.",
    endSub: "Quindici lingue, zero upload, niente da installare.",
  },

  tools: {
    title: "Tutti gli strumenti",
    subtitle: "Cerca tra {count} strumenti musicali gratuiti. Nessun upload, nessuna registrazione.",
    filterPlaceholder: "Cerca strumenti…",
    count: "{count} strumenti",
    empty: "Nessuno strumento corrisponde a “{query}”.",
  },

  categories: {
    pdf: { name: "PDF", desc: "Unisci, dividi, converti e modifica file PDF senza caricarli da nessuna parte." },
    image: { name: "Immagini", desc: "Comprimi, ridimensiona, ritaglia e converti immagini direttamente nel tuo browser." },
    text: { name: "Testo", desc: "Conta, pulisci, ordina e trasforma il testo all'istante, mentre scrivi." },
    developer: { name: "Sviluppo", desc: "Formattatori, codificatori, decodificatori e generatori per il lavoro di ogni giorno." },
    seo: { name: "SEO", desc: "Meta tag, markup schema, anteprima SERP e altri aiuti per la SEO on-page." },
    security: { name: "Sicurezza", desc: "Password, hash e ricerche — generati e verificati sul tuo dispositivo." },
    utility: { name: "Strumenti musicali", desc: "Un metronomo online preciso, un generatore di toni e una calcolatrice di intervalli — strumenti di studio che girano interamente nel tuo browser." },
  },

  tool: {
    howTo: "Come si usa",
    faq: "Domande frequenti",
    related: "Strumenti correlati",
    privacyNote:
      "Questo strumento gira interamente nel tuo browser. I tuoi dati non lasciano mai il dispositivo: non vengono caricati su nessun server.",
    inCategory: "Altri in {category}",
    backToCategory: "Tutti gli strumenti {category}",
  },

  common: {
    copy: "Copia",
    copied: "Copiato",
    download: "Scarica",
    reset: "Reimposta",
    swap: "Inverti",
    clear: "Svuota",
    error: "Qualcosa è andato storto. Controlla i dati inseriti e riprova.",
    input: "Input",
    output: "Risultato",
    settings: "Opzioni",
    dropFiles: "Trascina qui i file o clicca per sceglierli",
    dropFile: "Trascina qui un file o clicca per sceglierlo",
    processing: "Elaborazione…",
    fileSize: "Dimensione",
    sample: "Prova un esempio",
    uppercase: "MAIUSCOLO",
  },

  unit: {
    from: "Da",
    to: "A",
    amount: "Quantità",
    result: "Risultato",
    common: "Conversioni comuni",
    formula: "Formula",
    allUnits: "Tutte le unità",
  },

  text: {
    stats: {
      words: "Parole",
      characters: "Caratteri",
      charsNoSpaces: "Senza spazi",
      sentences: "Frasi",
      paragraphs: "Paragrafi",
      lines: "Righe",
      readingTime: "Tempo di lettura",
      readingMinutes: "{n} min di lettura",
    },
  },

  footer: {
    line: "Strumenti musicali che tengono un tempo perfetto. Nulla di ciò che suoni qui lascia il tuo dispositivo.",
    privacy: "Privacy",
    terms: "Termini",
    about: "Chi siamo",
    badges: "Badge",
    language: "Lingua",
  },

  badge: {
    title: "Badge TempoBeat",
    desc: "Metti un badge TempoBeat sul tuo sito, nel README o nella documentazione. Rimanda qui e racconta che gli strumenti musicali dietro a quel badge girano interamente nel browser.",
    voluntary: "L'incorporamento è del tutto volontario: scegli un badge se il progetto ti piace. Non serve alcun permesso.",
    md: "Markdown (README)",
    html: "HTML (sito web)",
    thanks: "Grazie per spargere la voce: ogni incorporamento aiuta più persone a scoprire strumenti che rispettano i loro file.",
  },

    embed: {
    title: "Incorpora questo strumento",
    desc: "Metti questo strumento sul tuo sito con una riga: gira nel browser del visitatore.",
  },

    mcp: {
    title: "Server MCP — strumenti accessibili all'IA",
    desc1: "TempoBeat include un server MCP (Model Context Protocol): assistenti IA come Claude o Cursor possono eseguire le stesse elaborazioni musicali di questo sito — frequenze delle note, intervalli e tempo a tocchi — stessa logica testata, senza reimplementazione.",
    desc2: "Gli strumenti eseguono le funzioni pure del sito (altezze del temperamento equabile, distanze in semitoni, medie del tempo a tocchi). Girano via npx sulla macchina del client IA; nulla viene inviato ai nostri server.",
    toolsTitle: "Strumenti eseguibili ({n})",
    requiresNode: "Richiede Node.js 18+. Il server gira localmente via stdio; solo le chiamate che fai vengono calcolate sulla tua macchina.",
    privacy: "Richiede Node.js 18+. Il server gira localmente via stdio; solo le chiamate che fai vengono calcolate sulla tua macchina.",
  },

    notFound: {
    title: "Pagina non trovata",
    body: "Lo strumento che cerchi non esiste. Sfoglia invece tutti gli strumenti.",
    home: "Vai alla homepage",
  },
};

export default it;
