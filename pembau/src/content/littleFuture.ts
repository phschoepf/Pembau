// Inhalt des Flyers "Little future – kleine Zukunft" (Oktober 2026), extrahiert aus dem PDF.
// Temporäre Promo-Kampagne für die Landing Page.

export const littleFutureColors = {
  text: "#2e044c", // dunkles Lila aus dem Flyer
} as const;

export const littleFutureFlyer = {
  // Seite 1 (Vorderseite)
  front: {
    day1: "3.",
    day2: "4.",
    month: "Oktober",
    titleEn: "little future",
    titleDe: "kleine Zukunft",
    tagline1: "Festival fürs Zusammenkommen,",
    tagline2: "Ausprobieren & Weitergeben.",
    forAll: "Für alle",
    email: "workshops@pembau.art",
  },

  // Seite 2 (Rückseite) – in Lesereihenfolge des Flyers
  back: {
    heading: "Little future – Kleine Zukunft!",
    // Absätze; innere Arrays = harte Zeilenumbrüche wie im Flyer
    paragraphs: [
      [
        "Wir wagen einen kleinen Blick nach vorne in eine kleine Zukunft, in der wir nicht alles alleine können müssen. In der Wissen die Runde macht, Hände Dinge zeigen und Menschen die Talente der anderen wertschätzen - egal wie gewöhnlich oder extravagant!",
      ],
      [
        "Die Kleine Zukunft ist ein Festival für genau das: fürs Zusammenkommen, Ausprobieren und Weitergeben. Hier treffen gereifte Fähigkeiten auf halbreife Ideen, leise Talente auf laute Experimente. Du kannst etwas mitbringen oder einfach auftauchen und schauen, was passiert. Beides ist mehr als willkommen!",
        "Vielleicht lernst du etwas, das du nie gesucht hast. Vielleicht zeigst du etwas, von dem du dachtest, es sei nichts Besonderes.",
      ],
      [
        "Eingeladen sind alle – Kinder, Erwachsene, Neugierige,",
        "Skeptische, Allein-Kommende und Gemeinsam-Anreisende.",
      ],
    ],
    info: [
      { label: "Wann?", text: "Am 3. & 4. Oktober, jeweils von 11 bis 19 Uhr" },
      { label: "Wo?", text: "Viller Berg 4, Innsbruck" },
      {
        label: "Wie?",
        text: "Der Eintritt ist frei! Eine Anmeldung hilft uns zu planen, spontan vorbeikommen ist aber genauso möglich.",
      },
    ],
    contact: "Schreib uns einfach eine Mail:",
    email: "workshops@pembau.art",
    share:
      "Und wenn du selbst etwas teilen willst: melde dich! Du knüpfst die buntesten Armbänder Tirols, hast ausgefallene Kochrezepte auf Lager oder weißt, wie man Instrumente aus Gemüse bastelt? Es gibt keine Grenzen! Wir unterstützen dich bei der Planung und übernehmen die Materialkosten!",
    signupHint: "Anmeldung wenn du etwas teilen möchtest über den Link:",
    signupUrl: "https://forms.gle/xX4cWq3Fdk7QtkiZ7",
  },
} as const;
