export const LOCALES = ['en', 'it'] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'it' : 'en';
}

interface Strings {
  siteTitle: string;
  tagline: string;
  intro: string;
  skip: string;
  navLessons: string;
  navAbout: string;
  navLinks: string;
  switchLanguage: string;
  toDarkTheme: string;
  toLightTheme: string;
  lessonsHeading: string;
  railLabel: string;
  continueAt: string;
  start: string;
  open: string;
  lesson: string;
  lessonOf: (n: number, total: number) => string;
  keyPoints: string;
  tryIt: string;
  noScript: string;
  sources: string;
  sourcesNote: string;
  opensInNewTab: string;
  previous: string;
  next: string;
  backToLessons: string;
  aboutTitle: string;
  aboutSections: { heading: string; body: string }[];
  footer: string;
}

export const STRINGS: Record<Locale, Strings> = {
  en: {
    siteTitle: 'Blockchain explained',
    tagline: 'How a blockchain works, in six short lessons you can operate.',
    intro:
      'A blockchain is built from a few simple ideas stacked on each other. Each lesson explains one of them in a few minutes and gives you something to change, so you can see the consequence for yourself. Everything is computed in your browser.',
    skip: 'Skip to content',
    navLessons: 'Lessons',
    navAbout: 'About',
    navLinks: 'Links',
    switchLanguage: 'Switch to Italian',
    toDarkTheme: 'Switch to the dark theme',
    toLightTheme: 'Switch to the light theme',
    lessonsHeading: 'Lessons',
    railLabel: 'The six lessons, in order',
    continueAt: 'Pick up where you stopped:',
    start: 'Start with lesson 01',
    open: 'Open',
    lesson: 'Lesson',
    lessonOf: (n, total) => `Lesson ${n} of ${total}`,
    keyPoints: 'Key points',
    tryIt: 'Try it',
    noScript:
      'This widget needs JavaScript. The text of the lesson explains the same idea without it.',
    sources: 'Sources',
    sourcesNote: 'Primary sources this lesson is based on.',
    opensInNewTab: '(opens in a new tab)',
    previous: 'Previous',
    next: 'Next',
    backToLessons: 'All lessons',
    aboutTitle: 'About this site',
    aboutSections: [
      {
        heading: 'What it is',
        body: 'An explanation of the mechanism behind a blockchain: hashing, blocks, proof of work, Merkle trees, signatures and consensus. It is not about prices, coins or investing, and it gives no financial advice.',
      },
      {
        heading: 'How the widgets work',
        body: 'Every number a widget shows is computed in your browser by small functions that are tested against published reference values: the NIST SHA-256 examples, public Bitcoin block data, RFC 6979 and the tables in the Bitcoin whitepaper. The code is open on GitHub.',
      },
      {
        heading: 'Simplifications',
        body: 'The toy chain is smaller and simpler than a real one, and each lesson says where. For example, its difficulty counts leading zeros instead of using Bitcoin’s compact target, and the signature demo uses the P-256 curve, which browsers offer, instead of secp256k1.',
      },
      {
        heading: 'Privacy',
        body: 'No cookies, no analytics, no third-party scripts, fonts or images: the pages load only their own files. The keys in the signature demo are created in memory, cannot be exported and disappear when you leave the page. If you choose a theme with the toggle, that choice is saved only in your own browser.',
      },
      {
        heading: 'How it was written',
        body: 'The texts were written with the help of an AI assistant, in a neutral textbook style. Each lesson lists the primary sources it is based on; if you find a mistake, please open an issue on GitHub.',
      },
      {
        heading: 'Independence',
        body: 'This is an independent educational project. It is not affiliated with or endorsed by any blockchain project, foundation or company.',
      },
    ],
    footer: 'Independent educational project. No prices, no financial advice.',
  },
  it: {
    siteTitle: 'Blockchain spiegata',
    tagline: 'Come funziona una blockchain, in sei brevi lezioni da provare con le mani.',
    intro:
      'Una blockchain è fatta di poche idee semplici, una sopra l’altra. Ogni lezione ne spiega una in pochi minuti e ti dà qualcosa da cambiare, per vedere subito che cosa succede. Tutto viene calcolato nel tuo browser.',
    skip: 'Vai al contenuto',
    navLessons: 'Lezioni',
    navAbout: 'Informazioni',
    navLinks: 'Collegamenti',
    switchLanguage: 'Passa all’inglese',
    toDarkTheme: 'Passa al tema scuro',
    toLightTheme: 'Passa al tema chiaro',
    lessonsHeading: 'Lezioni',
    railLabel: 'Le sei lezioni, in ordine',
    continueAt: 'Riprendi dall’ultima lezione aperta:',
    start: 'Comincia dalla lezione 01',
    open: 'Apri',
    lesson: 'Lezione',
    lessonOf: (n, total) => `Lezione ${n} di ${total}`,
    keyPoints: 'Punti chiave',
    tryIt: 'Prova',
    noScript:
      'Questo widget richiede JavaScript. Il testo della lezione spiega la stessa idea anche senza.',
    sources: 'Fonti',
    sourcesNote: 'Le fonti primarie su cui si basa questa lezione.',
    opensInNewTab: '(si apre in una nuova scheda)',
    previous: 'Precedente',
    next: 'Successiva',
    backToLessons: 'Tutte le lezioni',
    aboutTitle: 'Su questo sito',
    aboutSections: [
      {
        heading: 'Che cos’è',
        body: 'Una spiegazione del meccanismo che sta dietro una blockchain: hash, blocchi, proof of work, alberi di Merkle, firme e consenso. Non parla di prezzi, monete o investimenti e non dà consigli finanziari.',
      },
      {
        heading: 'Come funzionano i widget',
        body: 'Ogni numero mostrato da un widget è calcolato nel tuo browser da piccole funzioni verificate con valori di riferimento pubblicati: gli esempi SHA-256 del NIST, dati pubblici di blocchi Bitcoin, la RFC 6979 e le tabelle del whitepaper di Bitcoin. Il codice è pubblico su GitHub.',
      },
      {
        heading: 'Semplificazioni',
        body: 'La catena di prova è più piccola e più semplice di una vera, e ogni lezione dice dove. Per esempio, la sua difficoltà conta gli zeri iniziali invece di usare il bersaglio compatto di Bitcoin, e la dimostrazione delle firme usa la curva P-256, che i browser offrono, invece di secp256k1.',
      },
      {
        heading: 'Privacy',
        body: 'Nessun cookie, nessuna analisi, nessuno script, font o immagine di terzi: le pagine caricano solo i propri file. Le chiavi della dimostrazione delle firme sono create in memoria, non si possono esportare e spariscono quando lasci la pagina. Se scegli un tema con l’interruttore, la scelta resta solo nel tuo browser.',
      },
      {
        heading: 'Come è stato scritto',
        body: 'I testi sono stati scritti con l’aiuto di un assistente AI, in stile neutro da manuale. Ogni lezione elenca le fonti primarie su cui si basa; se trovi un errore, apri una segnalazione su GitHub.',
      },
      {
        heading: 'Indipendenza',
        body: 'Progetto didattico indipendente. Non è affiliato né approvato da alcun progetto blockchain, fondazione o azienda.',
      },
    ],
    footer: 'Progetto didattico indipendente. Niente prezzi, niente consigli finanziari.',
  },
};
