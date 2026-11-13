// Training data for the Italian prepositions trainer (A2).
//
// verbs:    Italian infinitive -> English [base, third-person-singular] and the
//           Italian present tense (io, tu, lui/lei, noi, voi, loro).
// phrases:  a verb + the exact Italian phrase that follows it (preposition,
//           article and noun together, e.g. "al cinema"), plus its English
//           counterpart. "ev" optionally overrides the English verb
//           ([base, third-person-singular]) when the Italian verb maps onto
//           different English verbs (e.g. fare -> have / take / do).
// notes:    usage notes about a preposition, shown after the answer to every
//           phrase they apply to. "text" uses **bold** and *italic*. "for"
//           lists the verbs the note applies to; "it" optionally restricts it
//           to those Italian phrases of the verb (omit it for all of them).
//           A phrase can match several notes.
// subjects: the English subjects shown in conjugated phrases and the Italian
//           person they map to. "pronouns" are the Italian subject pronouns
//           that may optionally prefix the answer.

globalThis.DATA = {
  subjects: [
    { en: "I",     person: "io",   pronouns: ["io"] },
    { en: "you",   person: "tu",   pronouns: ["tu"] },
    { en: "he",     person: "lui",  pronouns: ["lui"] },
    { en: "she",    person: "lui",  pronouns: ["lei"] },
    { en: "y'all", person: "voi",  pronouns: ["voi"] },
    { en: "we",    person: "noi",  pronouns: ["noi"] },
    { en: "they",  person: "loro", pronouns: ["loro"] }
  ],

  // Nouns inside each English phrase (keyed by the phrase's "en" text) and
  // their Italian translation, as [english, italian]. Listed in the order they
  // appear in the phrase. The Italian noun is shown bare (no article), so the
  // article stays part of the exercise. Phrases without a translatable noun
  // (names, pronouns, adverbs, numbers) have an empty list.
  nouns: {
    "to the cinema": [["cinema", "cinema"]],
    "to school": [["school", "scuola"]],
    "to the bank": [["bank", "banca"]],
    "to the doctor": [["doctor", "medico"]],
    "to Rome": [["Rome", "Roma"]],
    "to Italy": [["Italy", "Italia"]],
    "to the seaside": [["seaside", "mare"]],
    "on foot": [["foot", "piedi"]],
    "from Naples": [["Naples", "Napoli"]],
    "with us": [],
    "to the party": [["party", "festa"]],
    "to my house": [["house", "casa"]],
    "in Milan": [["Milan", "Milano"]],
    "in Italy": [["Italy", "Italia"]],
    "in the city centre": [["city centre", "centro"]],
    "in the countryside": [["countryside", "campagna"]],
    "with my parents": [["parents", "genitori"]],
    "in the city": [["city", "città"]],
    "in Spain": [["Spain", "Spagna"]],
    "with a friend": [["friend", "amico"]],
    "to a friend": [["friend", "amico"]],
    "about work": [["work", "lavoro"]],
    "on the phone": [["phone", "telefono"]],
    "about the problems": [["problems", "problemi"]],
    "to the teacher": [["teacher", "professore"]],
    "of the house": [["house", "casa"]],
    "with friends": [["friends", "amici"]],
    "of the cinema": [["cinema", "cinema"]],
    "of the office": [["office", "ufficio"]],
    "for Rome": [["Rome", "Roma"]],
    "from Milan": [["Milan", "Milano"]],
    "by train": [["train", "treno"]],
    "at eight": [],
    "home": [["home", "casa"]],
    "from school": [["school", "scuola"]],
    "from work": [["work", "lavoro"]],
    "in Naples": [["Naples", "Napoli"]],
    "late": [],
    "from the station": [["station", "stazione"]],
    "by plane": [["plane", "aereo"]],
    "breakfast at the bar": [["breakfast", "colazione"], ["bar", "bar"]],
    "a walk in the park": [["walk", "passeggiata"], ["park", "parco"]],
    "the shopping at the supermarket": [["shopping", "spesa"], ["supermarket", "supermercato"]],
    "a trip to the lake": [["trip", "gita"], ["lake", "lago"]],
    "a book to Luca": [["book", "libro"]],
    "a kiss to mum": [["kiss", "bacio"], ["mum", "mamma"]],
    "at home": [["home", "casa"]],
    "with the family": [["family", "famiglia"]],
    "in a hotel": [["hotel", "albergo"]],
    "a coffee at the bar": [["coffee", "caffè"], ["bar", "bar"]],
    "tea with milk": [["tea", "tè"], ["milk", "latte"]],
    "at the restaurant": [["restaurant", "ristorante"]],
    "in the kitchen": [["kitchen", "cucina"]],
    "bread from the baker": [["bread", "pane"], ["baker", "panettiere"]],
    "milk at the supermarket": [["milk", "latte"], ["supermarket", "supermercato"]],
    "a gift for Anna": [["gift", "regalo"]],
    "the books to school": [["books", "libri"], ["school", "scuola"]],
    "the dog to the vet": [["dog", "cane"], ["vet", "veterinario"]],
    "a cake to the party": [["cake", "dolce"], ["party", "festa"]],
    "about Marco": [],
    "about the future": [["future", "futuro"]],
    "about the holidays": [["holidays", "vacanze"]],
    "football": [["football", "calcio"]],
    "cards": [["cards", "carte"]],
    "in the park": [["park", "parco"]],
    "in an office": [["office", "ufficio"]],
    "at a bank": [["bank", "banca"]],
    "for a company": [["company", "azienda"]],
    "from home": [["home", "casa"]],
    "for a friend at the station": [["friend", "amico"], ["station", "stazione"]],
    "for the bus at the stop": [["bus", "autobus"], ["stop", "fermata"]],
    "on the train": [["train", "treno"]],
    "on the bus": [["bus", "autobus"]],
    "into the car": [["car", "macchina"]],
    "onto the roof": [["roof", "tetto"]],
    "with a pen": [["pen", "penna"]],
    "in the notebook": [["notebook", "quaderno"]],
    "Maria": [],
    "the doctor": [["doctor", "dottore"]],
    "mum": [["mum", "mamma"]],
    "at university": [["university", "università"]],
    "in the library": [["library", "biblioteca"]],
    "for the exam": [["exam", "esame"]],
    "for work": [["work", "lavoro"]],

    "to the stadium": [["stadium", "stadio"]],
    "the grandparents": [["grandparents", "nonni"]],
    "to the friends": [["friends", "amici"]],
    "about the job": [["job", "lavoro"]],
    "about sport": [["sport", "sport"]],
    "about the exam": [["exam", "esame"]],
    "about the family": [["family", "famiglia"]],
    "about the friends": [["friends", "amici"]],
    "of the stadium": [["stadium", "stadio"]],
    "to the grandparents": [["grandparents", "nonni"]],
    "from the holidays": [["holidays", "vacanze"]],
    "in the stadium": [["stadium", "stadio"]],
    "in the hospital": [["hospital", "ospedale"]],
    "in the room": [["room", "camera"]],
    "in the restaurants": [["restaurants", "ristoranti"]],
    "in the offices": [["offices", "uffici"]],
    "in the schools": [["schools", "scuole"]],
    "on the scooter": [["scooter", "scooter"]],
    "on the blackboard": [["blackboard", "lavagna"]],
    "on the walls": [["walls", "muri"]],
    "on the buses": [["buses", "autobus"]],
    "on the pages": [["pages", "pagine"]]
  },

  verbs: {
    andare:    { en: ["go", "goes"],                 pres: { io: "vado",    tu: "vai",     lui: "va",       noi: "andiamo",    voi: "andate",    loro: "vanno" } },
    venire:     { en: ["come", "comes"],              pres: { io: "vengo",   tu: "vieni",   lui: "viene",    noi: "veniamo",    voi: "venite",    loro: "vengono" } },
    abitare:    { en: ["live", "lives"],              pres: { io: "abito",   tu: "abiti",   lui: "abita",    noi: "abitiamo",   voi: "abitate",   loro: "abitano" } },
    vivere:     { en: ["live", "lives"],              pres: { io: "vivo",    tu: "vivi",    lui: "vive",     noi: "viviamo",    voi: "vivete",    loro: "vivono" } },
    parlare:    { en: ["talk", "talks"],              pres: { io: "parlo",   tu: "parli",   lui: "parla",    noi: "parliamo",   voi: "parlate",   loro: "parlano" } },
    uscire:     { en: ["go out", "goes out"],         pres: { io: "esco",    tu: "esci",    lui: "esce",     noi: "usciamo",    voi: "uscite",    loro: "escono" } },
    partire:    { en: ["leave", "leaves"],            pres: { io: "parto",   tu: "parti",   lui: "parte",    noi: "partiamo",   voi: "partite",   loro: "partono" } },
    tornare:    { en: ["return", "returns"],          pres: { io: "torno",   tu: "torni",   lui: "torna",    noi: "torniamo",   voi: "tornate",   loro: "tornano" } },
    arrivare:   { en: ["arrive", "arrives"],          pres: { io: "arrivo",  tu: "arrivi",  lui: "arriva",   noi: "arriviamo",  voi: "arrivate",  loro: "arrivano" } },
    fare:       { en: ["do", "does"],                 pres: { io: "faccio",  tu: "fai",     lui: "fa",       noi: "facciamo",   voi: "fate",      loro: "fanno" } },
    dare:       { en: ["give", "gives"],              pres: { io: "do",      tu: "dai",     lui: "dà",       noi: "diamo",      voi: "date",      loro: "danno" } },
    stare:      { en: ["stay", "stays"],              pres: { io: "sto",     tu: "stai",    lui: "sta",      noi: "stiamo",     voi: "state",     loro: "stanno" } },
    bere:       { en: ["drink", "drinks"],            pres: { io: "bevo",    tu: "bevi",    lui: "beve",     noi: "beviamo",    voi: "bevete",    loro: "bevono" } },
    mangiare:   { en: ["eat", "eats"],                pres: { io: "mangio",  tu: "mangi",   lui: "mangia",   noi: "mangiamo",   voi: "mangiate",  loro: "mangiano" } },
    comprare:   { en: ["buy", "buys"],                pres: { io: "compro",  tu: "compri",  lui: "compra",   noi: "compriamo",  voi: "comprate",  loro: "comprano" } },
    portare:    { en: ["bring", "brings"],            pres: { io: "porto",   tu: "porti",   lui: "porta",    noi: "portiamo",   voi: "portate",   loro: "portano" } },
    pensare:    { en: ["think", "thinks"],            pres: { io: "penso",   tu: "pensi",   lui: "pensa",    noi: "pensiamo",   voi: "pensate",   loro: "pensano" } },
    giocare:    { en: ["play", "plays"],              pres: { io: "gioco",   tu: "giochi",  lui: "gioca",    noi: "giochiamo",  voi: "giocate",   loro: "giocano" } },
    lavorare:   { en: ["work", "works"],              pres: { io: "lavoro",  tu: "lavori",  lui: "lavora",   noi: "lavoriamo",  voi: "lavorate",  loro: "lavorano" } },
    aspettare:  { en: ["wait", "waits"],              pres: { io: "aspetto", tu: "aspetti", lui: "aspetta",  noi: "aspettiamo", voi: "aspettate", loro: "aspettano" } },
    salire:     { en: ["get", "gets"],                pres: { io: "salgo",   tu: "sali",    lui: "sale",     noi: "saliamo",    voi: "salite",    loro: "salgono" } },
    scrivere:   { en: ["write", "writes"],            pres: { io: "scrivo",  tu: "scrivi",  lui: "scrive",   noi: "scriviamo",  voi: "scrivete",  loro: "scrivono" } },
    telefonare: { en: ["call(📞)", "calls(📞)"], pres: { io: "telefono",tu: "telefoni",lui: "telefona", noi: "telefoniamo",voi: "telefonate",loro: "telefonano" } },
    studiare:   { en: ["study", "studies"],           pres: { io: "studio",  tu: "studi",   lui: "studia",   noi: "studiamo",   voi: "studiate",  loro: "studiano" } },
    viaggiare:  { en: ["travel", "travels"],          pres: { io: "viaggio", tu: "viaggi",  lui: "viaggia",  noi: "viaggiamo",  voi: "viaggiate", loro: "viaggiano" } },
    cenare:     { en: ["have dinner", "has dinner"],  pres: { io: "ceno",    tu: "ceni",    lui: "cena",     noi: "ceniamo",    voi: "cenate",    loro: "cenano" } }
  },

  phrases: [
    // andare
    { v: "andare", it: "al cinema",        en: "to the cinema" },
    { v: "andare", it: "a scuola",         en: "to school" },
    { v: "andare", it: "in banca",         en: "to the bank" },
    { v: "andare", it: "dal medico",       en: "to the doctor" },
    { v: "andare", it: "a Roma",           en: "to Rome" },
    { v: "andare", it: "in Italia",        en: "to Italy" },
    { v: "andare", it: "al mare",          en: "to the seaside" },
    { v: "andare", it: "a piedi",          en: "on foot" },
    // venire
    { v: "venire", it: "da Napoli",        en: "from Naples" },
    { v: "venire", it: "con noi",          en: "with us" },
    { v: "venire", it: "alla festa",       en: "to the party" },
    { v: "venire", it: "a casa mia",       en: "to my house" },
    // abitare
    { v: "abitare", it: "a Milano",        en: "in Milan", alt: [{ v: "vivere" }] },
    { v: "abitare", it: "in Italia",       en: "in Italy", alt: [{ v: "vivere" }] },
    { v: "abitare", it: "in centro",       en: "in the city centre", alt: [{ v: "vivere" }] },
    { v: "abitare", it: "in campagna",     en: "in the countryside", alt: [{ v: "vivere" }] },
    { v: "abitare", it: "con i miei genitori", en: "with my parents", alt: [{ v: "vivere" }] },
    // vivere
    { v: "vivere", it: "in città",         en: "in the city", alt: [{ v: "abitare" }] },
    { v: "vivere", it: "in Spagna",        en: "in Spain", alt: [{ v: "abitare" }] },
    { v: "vivere", it: "con un amico",     en: "with a friend", alt: [{ v: "abitare" }] },
    // parlare
    { v: "parlare", it: "con un amico",    en: "to a friend" },
    { v: "parlare", it: "di lavoro",       en: "about work" },
    { v: "parlare", it: "al telefono",     en: "on the phone" },
    { v: "parlare", it: "dei problemi",    en: "about the problems" },
    { v: "parlare", it: "con il professore", en: "to the teacher" },
    // uscire
    { v: "uscire", it: "di casa",          en: "of the house" },
    { v: "uscire", it: "con gli amici",    en: "with friends" },
    { v: "uscire", it: "dal cinema",       en: "of the cinema" },
    { v: "uscire", it: "dall'ufficio",     en: "of the office" },
    // partire
    { v: "partire", it: "per Roma",        en: "for Rome" },
    { v: "partire", it: "da Milano",       en: "from Milan" },
    { v: "partire", it: "in treno",        en: "by train" },
    { v: "partire", it: "alle otto",       en: "at eight" },
    // tornare
    { v: "tornare", it: "a casa",          en: "home" },
    { v: "tornare", it: "dalla scuola",    en: "from school" },
    { v: "tornare", it: "in Italia",       en: "to Italy" },
    { v: "tornare", it: "dal lavoro",      en: "from work" },
    // arrivare
    { v: "arrivare", it: "a Napoli",       en: "in Naples" },
    { v: "arrivare", it: "in ritardo",     en: "late" },
    { v: "arrivare", it: "dalla stazione", en: "from the station" },
    { v: "arrivare", it: "in aereo",       en: "by plane" },
    // fare
    { v: "fare", it: "colazione al bar",        en: "breakfast at the bar",     ev: ["have", "has"] },
    { v: "fare", it: "una passeggiata nel parco", en: "a walk in the park",     ev: ["take", "takes"] },
    { v: "fare", it: "la spesa al supermercato", en: "the shopping at the supermarket" },
    { v: "fare", it: "una gita al lago",        en: "a trip to the lake",       ev: ["take", "takes"] },
    // dare
    { v: "dare", it: "un libro a Luca",  en: "a book to Luca" },
    { v: "dare", it: "un bacio alla mamma", en: "a kiss to mum" },
    // stare
    { v: "stare", it: "a casa",          en: "at home" },
    { v: "stare", it: "con la famiglia", en: "with the family" },
    { v: "stare", it: "in albergo",      en: "in a hotel" },
    // bere
    { v: "bere", it: "un caffè al bar",  en: "a coffee at the bar" },
    { v: "bere", it: "il tè con il latte", en: "tea with milk" },
    // mangiare
    { v: "mangiare", it: "a casa",       en: "at home", alt: [{ v: "cenare" }] },
    { v: "mangiare", it: "al ristorante", en: "at the restaurant", alt: [{ v: "cenare" }] },
    { v: "mangiare", it: "in cucina",    en: "in the kitchen", alt: [{ v: "cenare" }] },
    { v: "mangiare", it: "con la famiglia", en: "with the family", alt: [{ v: "cenare" }] },
    // comprare
    { v: "comprare", it: "il pane dal panettiere", en: "bread from the baker" },
    { v: "comprare", it: "il latte al supermercato", en: "milk at the supermarket" },
    { v: "comprare", it: "un regalo per Anna", en: "a gift for Anna" },
    // portare
    { v: "portare", it: "i libri a scuola", en: "the books to school" },
    { v: "portare", it: "il cane dal veterinario", en: "the dog to the vet" },
    { v: "portare", it: "un dolce alla festa", en: "a cake to the party" },
    // pensare
    { v: "pensare", it: "a Marco",       en: "about Marco" },
    { v: "pensare", it: "al futuro",     en: "about the future" },
    { v: "pensare", it: "alle vacanze",  en: "about the holidays" },
    // giocare
    { v: "giocare", it: "a calcio",      en: "football" },
    { v: "giocare", it: "a carte",       en: "cards" },
    { v: "giocare", it: "con gli amici", en: "with friends" },
    { v: "giocare", it: "nel parco",     en: "in the park" },
    // lavorare
    { v: "lavorare", it: "in ufficio",   en: "in an office" },
    { v: "lavorare", it: "in banca",     en: "at a bank" },
    { v: "lavorare", it: "per un'azienda", en: "for a company" },
    { v: "lavorare", it: "da casa",      en: "from home" },
    // aspettare
    { v: "aspettare", it: "un amico alla stazione", en: "for a friend at the station" },
    { v: "aspettare", it: "l'autobus alla fermata", en: "for the bus at the stop" },
    // salire
    { v: "salire", it: "sul treno",      en: "on the train" },
    { v: "salire", it: "sull'autobus",   en: "on the bus" },
    { v: "salire", it: "in macchina",    en: "into the car" },
    { v: "salire", it: "sul tetto",      en: "onto the roof" },
    // scrivere
    { v: "scrivere", it: "a un amico",   en: "to a friend" },
    { v: "scrivere", it: "con la penna", en: "with a pen" },
    { v: "scrivere", it: "sul quaderno", en: "in the notebook" },
    // telefonare
    { v: "telefonare", it: "a Maria",    en: "Maria" },
    { v: "telefonare", it: "al dottore", en: "the doctor" },
    { v: "telefonare", it: "alla mamma", en: "mum" },
    // studiare
    { v: "studiare", it: "all'università", en: "at university" },
    { v: "studiare", it: "in biblioteca", en: "in the library" },
    { v: "studiare", it: "con un amico", en: "with a friend" },
    { v: "studiare", it: "per l'esame",  en: "for the exam" },
    // viaggiare
    { v: "viaggiare", it: "in aereo",    en: "by plane" },
    { v: "viaggiare", it: "in treno",    en: "by train" },
    { v: "viaggiare", it: "con gli amici", en: "with friends" },
    { v: "viaggiare", it: "per lavoro",  en: "for work" },
    // cenare
    { v: "cenare", it: "al ristorante",  en: "at the restaurant", alt: [{ v: "mangiare" }] },
    { v: "cenare", it: "con gli amici",  en: "with friends", alt: [{ v: "mangiare" }] },
    { v: "cenare", it: "a casa",         en: "at home", alt: [{ v: "mangiare" }] },
    { v: "cenare", it: "alle otto",      en: "at eight", alt: [{ v: "mangiare" }] },

    // Articulated prepositions that the phrases above do not cover, so that
    // every a/di/da/in/su + article form appears at least once.
    // a
    { v: "andare", it: "allo stadio",      en: "to the stadium" },
    { v: "telefonare", it: "ai nonni",     en: "the grandparents" },
    { v: "scrivere", it: "agli amici",     en: "to the friends" },
    // di
    { v: "parlare", it: "del lavoro",      en: "about the job" },
    { v: "parlare", it: "dello sport",     en: "about sport" },
    { v: "parlare", it: "dell'esame",      en: "about the exam" },
    { v: "parlare", it: "della famiglia",  en: "about the family" },
    { v: "parlare", it: "degli amici",     en: "about the friends" },
    { v: "parlare", it: "delle vacanze",   en: "about the holidays" },
    // da
    { v: "uscire", it: "dallo stadio",     en: "of the stadium" },
    { v: "andare", it: "dai nonni",        en: "to the grandparents" },
    { v: "andare", it: "dagli amici",      en: "to the friends" },
    { v: "tornare", it: "dalle vacanze",   en: "from the holidays" },
    // in
    { v: "giocare", it: "nello stadio",    en: "in the stadium" },
    { v: "lavorare", it: "nell'ospedale",  en: "in the hospital" },
    { v: "stare", it: "nella camera",      en: "in the room" },
    { v: "mangiare", it: "nei ristoranti", en: "in the restaurants", alt: [{ v: "cenare" }] },
    { v: "lavorare", it: "negli uffici",   en: "in the offices" },
    { v: "lavorare", it: "nelle scuole",   en: "in the schools" },
    // su
    { v: "salire", it: "sullo scooter",    en: "on the scooter" },
    { v: "scrivere", it: "sulla lavagna",  en: "on the blackboard" },
    { v: "scrivere", it: "sui muri",       en: "on the walls" },
    { v: "salire", it: "sugli autobus",    en: "on the buses" },
    { v: "scrivere", it: "sulle pagine",   en: "on the pages" }
  ],

  notes: [
    {
      text: "With sports and games, **giocare** takes **a**, and no article: *giocare a calcio*, *a carte*, *a tennis*. To say who you play with, use **con**: *giocare con gli amici*.",
      for: [{ v: "giocare", it: ["a calcio", "a carte", "con gli amici"] }]
    },
    {
      text: "To go to a person, or to be at their place or shop, use **da** + article: *andare dal medico*, *dai nonni*, *comprare il pane dal panettiere*. For a place as such, use **a** or **in**: *andare al cinema*, *in banca*.",
      for: [
        { v: "andare",   it: ["dal medico", "dai nonni", "dagli amici"] },
        { v: "comprare", it: ["il pane dal panettiere"] },
        { v: "portare",  it: ["il cane dal veterinario"] }
      ]
    },
    {
      text: "Cities take **a**: *abitare a Milano*. Countries and regions take **in**, with no article: *vivere in Spagna*, *in Italia*. Also **in** for general areas: *in centro*, *in campagna*, *in città*.",
      for: [
        { v: "abitare", it: ["a Milano", "in Italia", "in centro", "in campagna"] },
        { v: "vivere",  it: ["in città", "in Spagna"] }
      ]
    },
    {
      text: "Travelling by a means of transport takes **in**, with no article: *in treno*, *in aereo*. But *getting on* a train or bus is **salire su** + article: *sul treno*, *sull'autobus*. Cars are the exception: *salire in macchina*.",
      for: [
        { v: "viaggiare", it: ["in treno", "in aereo"] },
        { v: "partire",   it: ["in treno"] },
        { v: "arrivare",  it: ["in aereo"] },
        { v: "salire",    it: ["sul treno", "sull'autobus", "sugli autobus", "in macchina"] }
      ]
    },
    {
      text: "**partire per** = leave *for* a place: *per Roma*. **partire da** = leave *from* a place: *da Milano*.",
      for: [{ v: "partire", it: ["per Roma", "da Milano"] }]
    },
    {
      text: "English 'think about' is **pensare a** + article: *pensare al futuro*. Don't mix it up with **parlare di** (talk about): *parlare di lavoro*.",
      for: [{ v: "pensare" }]
    },
    {
      text: "*At/to home* is **a casa**, with no article, even with a possessive: *a casa mia*. **In casa** means *inside the house*. To go to someone's home, use **da**: *da Marco*.",
      for: [
        { v: "venire",   it: ["a casa mia"] },
        { v: "tornare",  it: ["a casa"] },
        { v: "stare",    it: ["a casa"] },
        { v: "mangiare", it: ["a casa"] },
        { v: "cenare",   it: ["a casa"] }
      ]
    },

    // ---- Places: a / in / da ----
    {
      text: "With motion verbs, cities take **a**: *andare a Roma*, *arrivare a Napoli*. Countries take **in**, with no article: *andare in Italia*.",
      for: [
        { v: "andare",   it: ["a Roma", "in Italia"] },
        { v: "arrivare", it: ["a Napoli"] }
      ]
    },
    {
      text: "Places used for their usual purpose often take **in** or **a** with **no article**: *in banca* (at the bank), *in ufficio*, *in biblioteca*, *in cucina*, *a scuola*. Compare *al cinema* or *al ristorante*, where the article stays.",
      for: [
        { v: "andare",   it: ["in banca", "a scuola"] },
        { v: "lavorare", it: ["in ufficio", "in banca"] },
        { v: "studiare", it: ["in biblioteca"] },
        { v: "stare",    it: ["in albergo"] },
        { v: "mangiare", it: ["in cucina"] },
        { v: "portare",  it: ["i libri a scuola"] }
      ]
    },
    {
      text: "A specific place (a venue, shop, bar, restaurant, station, party) takes **a** + article, meaning *at* or *to*: *al cinema*, *al bar*, *al ristorante*, *alla stazione*, *alla festa*, *all'università*.",
      for: [
        { v: "andare",   it: ["al cinema", "allo stadio"] },
        { v: "venire",   it: ["alla festa"] },
        { v: "fare",     it: ["colazione al bar", "la spesa al supermercato"] },
        { v: "bere",     it: ["un caffè al bar"] },
        { v: "mangiare", it: ["al ristorante"] },
        { v: "cenare",   it: ["al ristorante"] },
        { v: "comprare", it: ["il latte al supermercato"] },
        { v: "portare",  it: ["un dolce alla festa"] },
        { v: "aspettare", it: ["un amico alla stazione", "l'autobus alla fermata"] },
        { v: "studiare", it: ["all'università"] }
      ]
    },
    {
      text: "Plural places always take the article, so **in** merges with it: *negli uffici*, *nelle scuole*, *nei ristoranti*. The same goes for one specific place: *nel parco*, *nell'ospedale*, *nello stadio*, *nella camera*.",
      for: [
        { v: "lavorare", it: ["negli uffici", "nelle scuole", "nell'ospedale"] },
        { v: "mangiare", it: ["nei ristoranti"] },
        { v: "giocare",  it: ["nel parco", "nello stadio"] },
        { v: "fare",     it: ["una passeggiata nel parco"] },
        { v: "stare",    it: ["nella camera"] }
      ]
    },
    {
      text: "The sea and lakes take **a** + article: *al mare*, *al lago*. Mountains and the countryside take **in** with no article: *in montagna*, *in campagna*.",
      for: [
        { v: "andare", it: ["al mare"] },
        { v: "fare",   it: ["una gita al lago"] }
      ]
    },
    {
      text: "Where you come or leave *from* is **da** (+ article): *venire da Napoli*, *uscire dal cinema*, *arrivare dalla stazione*.",
      for: [
        { v: "venire",   it: ["da Napoli"] },
        { v: "uscire",   it: ["dal cinema", "dall'ufficio", "dallo stadio"] },
        { v: "arrivare", it: ["dalla stazione"] }
      ]
    },
    {
      text: "*Uscire di casa* (leave the house) is a fixed expression with **di**. For other places, **uscire** takes **da**: *uscire dal cinema*.",
      for: [{ v: "uscire", it: ["di casa"] }]
    },
    {
      text: "**tornare a** / **in** = go back *to* a place: *tornare a casa*, *in Italia*. **tornare da** = come back *from*: *tornare dalla scuola*, *dal lavoro*, *dalle vacanze*.",
      for: [{ v: "tornare" }]
    },
    {
      text: "*Work from home* is **da casa**: *lavorare da casa*. Compare **a casa** = at home.",
      for: [{ v: "lavorare", it: ["da casa"] }]
    },
    {
      text: "*On foot* is the fixed expression **a piedi**, not *in*: *andare a piedi*. (*In piedi* means *standing*.) Other means of transport take **in**: *in treno*, *in macchina*.",
      for: [{ v: "andare", it: ["a piedi"] }]
    },

    // ---- Apostrophes (elision before a vowel) ----
    {
      text: "Before a vowel, the singular article *lo* / *la* becomes **l'**, and a preposition merges with it **with an apostrophe**: *a* + *l'università* = *all'università*, *da* + *l'ufficio* = *dall'ufficio*, *di* + *l'esame* = *dell'esame*, *in* + *l'ospedale* = *nell'ospedale*, *su* + *l'autobus* = *sull'autobus*. No space after the apostrophe. Plurals have none: *negli uffici*, *degli esami*.",
      for: [
        { v: "uscire",   it: ["dall'ufficio"] },
        { v: "studiare", it: ["all'università"] },
        { v: "parlare",  it: ["dell'esame"] },
        { v: "lavorare", it: ["nell'ospedale"] },
        { v: "salire",   it: ["sull'autobus"] }
      ]
    },
    {
      text: "Before a vowel, the singular article *lo* / *la* becomes **l'** (with an apostrophe): *l'autobus*, *l'esame*. **per** does not merge with the article, so it stays separate: *per l'esame*.",
      for: [
        { v: "aspettare", it: ["l'autobus alla fermata"] },
        { v: "studiare",  it: ["per l'esame"] }
      ]
    },
    {
      text: "Feminine *una* is shortened to **un'** (with an apostrophe) before a vowel: *un'azienda*. Masculine *un* never takes an apostrophe: *un amico*.",
      for: [{ v: "lavorare", it: ["per un'azienda"] }]
    },

    // ---- People: a / con / per / di ----
    {
      text: "The person who receives the action takes **a** (+ article): *telefonare a Maria*, *scrivere a un amico*, *dare un libro a Luca*. English 'call someone' is **telefonare a** someone.",
      for: [
        { v: "telefonare", it: ["a Maria", "al dottore", "alla mamma", "ai nonni"] },
        { v: "scrivere",   it: ["a un amico", "agli amici"] },
        { v: "dare",       it: ["un libro a Luca", "un bacio alla mamma"] }
      ]
    },
    {
      text: "**con** = with. Unlike **a**, **di**, **da**, **in** and **su**, it does not merge with the article: *con il professore*, *con la famiglia*, *con gli amici*, *con un amico*.",
      for: [
        { v: "parlare",  it: ["con un amico", "con il professore"] },
        { v: "vivere",   it: ["con un amico"] },
        { v: "studiare", it: ["con un amico"] },
        { v: "venire",   it: ["con noi"] },
        { v: "uscire",   it: ["con gli amici"] },
        { v: "cenare",   it: ["con gli amici"] },
        { v: "viaggiare", it: ["con gli amici"] },
        { v: "stare",    it: ["con la famiglia"] },
        { v: "mangiare", it: ["con la famiglia"] },
        { v: "bere",     it: ["il tè con il latte"] }
      ]
    },
    {
      text: "Possessives normally take the article: *con **i** miei genitori*. With a singular family member it is dropped: *con mia madre*.",
      for: [{ v: "abitare", it: ["con i miei genitori"] }]
    },
    {
      text: "**per** = *for*: a person (*un regalo per Anna*), a purpose (*studiare per l'esame*), an employer (*lavorare per un'azienda*), a reason (*viaggiare per lavoro*).",
      for: [
        { v: "comprare",  it: ["un regalo per Anna"] },
        { v: "studiare",  it: ["per l'esame"] },
        { v: "lavorare",  it: ["per un'azienda"] },
        { v: "viaggiare", it: ["per lavoro"] }
      ]
    },

    // ---- Verbs and their specific prepositions ----
    {
      text: "The topic of a conversation takes **di**: *parlare di lavoro* (about work in general). A specific topic takes the article, and **di** merges with it: *del lavoro*, *dello sport*, *dell'esame*, *della famiglia*, *degli amici*, *delle vacanze*.",
      for: [
        { v: "parlare", it: ["di lavoro", "dei problemi", "del lavoro", "dello sport", "dell'esame", "della famiglia", "degli amici", "delle vacanze"] }
      ]
    },
    {
      text: "Means of communication take **a** + article: *parlare al telefono* (on the phone).",
      for: [{ v: "parlare", it: ["al telefono"] }]
    },
    {
      text: "English 'wait **for**' has no preposition in Italian: *aspettare un amico*, *aspettare l'autobus*. Only the place takes one: *alla stazione*.",
      for: [{ v: "aspettare" }]
    },
    {
      text: "**scrivere su** + article = write *on* a surface: *sul quaderno*, *sulla lavagna*, *sui muri*, *sulle pagine*. The tool takes **con**: *con la penna*.",
      for: [{ v: "scrivere", it: ["sul quaderno", "sulla lavagna", "sui muri", "sulle pagine", "con la penna"] }]
    },
    {
      text: "**su** = *on*, *onto*, and it merges with the article: *salire sul tetto* (climb onto the roof), *sullo scooter*.",
      for: [{ v: "salire", it: ["sul tetto", "sullo scooter"] }]
    },

    // ---- Time and fixed expressions ----
    {
      text: "Clock times take **a** + article (*le ore*): *alle otto*. One o'clock is *all'una* (*a* + *l'*, with an apostrophe), midday *a mezzogiorno*.",
      for: [
        { v: "partire", it: ["alle otto"] },
        { v: "cenare",  it: ["alle otto"] }
      ]
    },
    {
      text: "*In ritardo* (late) is a fixed expression with **in** and no article. The opposite is *in anticipo* (early).",
      for: [{ v: "arrivare", it: ["in ritardo"] }]
    }
  ]
};
