export type Locale = "de" | "fr" | "en";

export const locales: Locale[] = ["de", "fr", "en"];

export const localeLabels: Record<Locale, string> = {
  de: "Deutsch",
  fr: "Français",
  en: "English",
};

export const translations = {
  // Menu public & générique
  menu: {
    de: "Menü",
    fr: "Menu",
    en: "Menu",
  },
  loading: {
    de: "Menü wird geladen…",
    fr: "Chargement du menu…",
    en: "Loading menu…",
  },
  notFound: {
    de: "Menü nicht gefunden.",
    fr: "Menu non trouvé.",
    en: "Menu not found.",
  },
  noItems: {
    de: "Noch keine Artikel.",
    fr: "Aucun article pour le moment.",
    en: "No items yet.",
  },
  price: {
    de: "Preis",
    fr: "Prix",
    en: "Price",
  },
  description: {
    de: "Beschreibung",
    fr: "Description",
    en: "Description",
  },
  digikarte: {
    de: "DigiKarte – Digitales Menü",
    fr: "DigiKarte – Menu digital",
    en: "DigiKarte – Digital menu",
  },
  // Landing marketing
  heroTitle: {
    de: "Digitale Speisekarten mit QR-Code",
    fr: "Menus digitaux avec QR code",
    en: "Digital menus with QR codes",
  },
  heroSubtitle: {
    de: "Erstelle in wenigen Minuten moderne Speisekarten, verwalte deine Produkte und teile sie per QR-Code.",
    fr: "Crée en quelques minutes des menus modernes, gère tes produits et partage-les via QR code.",
    en: "Create modern menus in minutes, manage your items and share them via QR code.",
  },
  ctaGetStarted: {
    de: "Jetzt starten",
    fr: "Commencer",
    en: "Get started",
  },
  ctaLogin: {
    de: "Anmelden",
    fr: "Connexion",
    en: "Log in",
  },
  feature1Title: {
    de: "Einfache Menüverwaltung",
    fr: "Gestion de menus facile",
    en: "Simple menu management",
  },
  feature1Text: {
    de: "Füge Produkte mit Preis, Beschreibung und Bild hinzu und aktualisiere sie in Echtzeit.",
    fr: "Ajoute des produits avec prix, description et image, et mets-les à jour en temps réel.",
    en: "Add products with price, description and image, and update them in real time.",
  },
  feature2Title: {
    de: "QR-Codes in mehreren Stilen",
    fr: "QR codes en plusieurs styles",
    en: "QR codes in multiple styles",
  },
  feature2Text: {
    de: "Generiere verschiedene QR-Designs für Tischaufsteller, Flyer oder Aufkleber.",
    fr: "Génère différents styles de QR pour chevalets, flyers ou stickers.",
    en: "Generate multiple QR styles for table tents, flyers or stickers.",
  },
  feature3Title: {
    de: "Mehrsprachige Speisekarten",
    fr: "Menus multilingues",
    en: "Multilingual menus",
  },
  feature3Text: {
    de: "Biete deine Karte in Deutsch, Französisch und Englisch an.",
    fr: "Propose ton menu en allemand, français et anglais.",
    en: "Offer your menu in German, French and English.",
  },
  authRegisterFooter: {
    de: "Schließen Sie sich den Betrieben an, die das Gästeerlebnis modernisieren.",
    fr: "Rejoignez les établissements qui modernisent leur expérience client.",
    en: "Join the venues that modernise their guest experience.",
  },
  // Auth / back-office
  authLoginKicker: {
    de: "Anmeldung",
    fr: "Connexion",
    en: "Sign in",
  },
  authLoginTitle: {
    de: "Willkommen zurück.",
    fr: "Heureux de vous revoir.",
    en: "Welcome back.",
  },
  authLoginSubtitle: {
    de: "Melden Sie sich an, um Ihre Organisationen, Menüs und QR-Codes zu verwalten.",
    fr: "Connectez-vous pour gérer vos organisations, menus et QR codes DigiKarte.",
    en: "Sign in to manage your organisations, menus and DigiKarte QR codes.",
  },
  authEmailLabel: {
    de: "E-Mail",
    fr: "Email",
    en: "Email",
  },
  authPasswordLabel: {
    de: "Passwort",
    fr: "Mot de passe",
    en: "Password",
  },
  authPasswordHint: {
    de: "Passwort (mind. 6 Zeichen)",
    fr: "Mot de passe (min. 6 caractères)",
    en: "Password (min. 6 characters)",
  },
  authLoginButton: {
    de: "Anmelden",
    fr: "Se connecter",
    en: "Sign in",
  },
  authCreating: {
    de: "Konto wird erstellt…",
    fr: "Inscription…",
    en: "Creating account…",
  },
  authNoAccount: {
    de: "Noch kein Konto?",
    fr: "Pas de compte ?",
    en: "No account yet?",
  },
  authGoRegister: {
    de: "Konto erstellen",
    fr: "Créer un compte",
    en: "Create an account",
  },
  authRegisterKicker: {
    de: "Registrierung",
    fr: "Inscription",
    en: "Sign up",
  },
  authRegisterTitle: {
    de: "Starten Sie mit DigiKarte.",
    fr: "Démarrez avec DigiKarte.",
    en: "Get started with DigiKarte.",
  },
  authRegisterSubtitle: {
    de: "Ein Konto, um Ihre Organisationen, Menüs und QR-Codes zu steuern.",
    fr: "Un seul compte pour piloter vos organisations, menus et QR codes.",
    en: "One account to manage your organisations, menus and QR codes.",
  },
  authFirstName: {
    de: "Vorname",
    fr: "Prénom",
    en: "First name",
  },
  authLastName: {
    de: "Nachname",
    fr: "Nom",
    en: "Last name",
  },
  authPhone: {
    de: "Telefon",
    fr: "Téléphone",
    en: "Phone",
  },
  authBusinessEmail: {
    de: "Geschäftliche E-Mail",
    fr: "Email professionnel",
    en: "Business email",
  },
  authRegisterButton: {
    de: "Konto erstellen",
    fr: "Créer mon compte",
    en: "Create my account",
  },
  authHasAccount: {
    de: "Bereits ein Konto?",
    fr: "Déjà un compte ?",
    en: "Already have an account?",
  },
  authGoLogin: {
    de: "Anmelden",
    fr: "Se connecter",
    en: "Sign in",
  },
} as const;

export function t<K extends keyof typeof translations>(
  key: K,
  locale: Locale
): string {
  return translations[key][locale];
}
