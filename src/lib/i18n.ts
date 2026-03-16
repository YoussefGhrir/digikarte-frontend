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
  landingLoading: {
    de: "Lädt…",
    fr: "Chargement…",
    en: "Loading…",
  },
  landingBrandTagline: {
    de: "Digitales QR-Menü Studio",
    fr: "Studio de menus QR digitaux",
    en: "Digital QR menu studio",
  },
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
  heroKicker: {
    de: "QR-MENÜS · GASTRONOMIE · 3D EXPERIENCE",
    fr: "QR MENUS · HORECA · EXPÉRIENCE 3D",
    en: "QR MENUS · HOSPITALITY · 3D EXPERIENCE",
  },
  heroPrimaryCta: {
    de: "Meine Karte in 60s erstellen",
    fr: "Créer mon menu en 60s",
    en: "Create my menu in 60s",
  },
  heroSecondaryCta: {
    de: "Demo-Menü ansehen",
    fr: "Voir un menu démo",
    en: "View a demo menu",
  },
  heroBadge1Title: {
    de: "Sofortiger Scan",
    fr: "Scan instantané",
    en: "Instant scan",
  },
  heroBadge1Text: {
    de: "Extrem gut lesbare QR-Codes für deine Gäste.",
    fr: "QR ultra-lisibles pour vos clients.",
    en: "Highly readable QR codes for your guests.",
  },
  heroBadge2Title: {
    de: "Mehrere Standorte",
    fr: "Multi-lieux",
    en: "Multi-location",
  },
  heroBadge2Text: {
    de: "Mehrere Restaurants, ein einziges Konto.",
    fr: "Plusieurs restaurants, un seul compte.",
    en: "Multiple venues, a single account.",
  },
  heroBadge3Title: {
    de: "In Echtzeit aktuell",
    fr: "À jour en temps réel",
    en: "Up to date in real time",
  },
  heroBadge3Text: {
    de: "Du änderst – und es ist schon online.",
    fr: "Modifiez, c’est déjà en ligne.",
    en: "Update it, and it’s already live.",
  },
  heroCardTag: {
    de: "Café & Brunch",
    fr: "Café & Brunch",
    en: "Coffee & Brunch",
  },
  heroCardTableChip: {
    de: "Tisch 12 · QR",
    fr: "Table 12 · QR",
    en: "Table 12 · QR",
  },
  heroCardItem1Title: {
    de: "Signature Cappuccino",
    fr: "Cappuccino Signature",
    en: "Signature Cappuccino",
  },
  heroCardItem1Text: {
    de: "Bio-Espresso, cremiger Milchschaum, Vanille-Note.",
    fr: "Espresso bio, mousse onctueuse, note de vanille.",
    en: "Organic espresso, silky foam, hint of vanilla.",
  },
  heroCardItem2Title: {
    de: "Avocado Toast",
    fr: "Avocado Toast",
    en: "Avocado toast",
  },
  heroCardItem2Text: {
    de: "Sauerteigbrot, Zitrus-Avocado, pochiertes Ei.",
    fr: "Pain sourdough, avocat citronné, œuf poché.",
    en: "Sourdough bread, citrus avocado, poached egg.",
  },
  heroCardStat1Title: {
    de: "Organisationen",
    fr: "Organisations",
    en: "Organisations",
  },
  heroCardStat1Text: {
    de: "Restaurant, Bar, Café in einem einzigen Bereich verwalten.",
    fr: "Restaurant, bar, coffee shop gérés dans le même espace.",
    en: "Restaurant, bar, coffee shop managed in the same space.",
  },
  heroCardStat2Title: {
    de: "Aktive QR-Codes",
    fr: "QR actifs",
    en: "Active QR codes",
  },
  heroCardStat2Text: {
    de: "Menüs, die sich nach jeder Änderung automatisch aktualisieren.",
    fr: "Menus mis à jour instantanément après chaque changement.",
    en: "Menus updated instantly after every change.",
  },
  sectionWhyTitle: {
    de: "Warum Gastronomen DigiKarte wählen",
    fr: "Pourquoi les restaurateurs choisissent DigiKarte ?",
    en: "Why restaurateurs choose DigiKarte",
  },
  sectionFlowTitle: {
    de: "Ein fließendes Erlebnis – vom Scan bis zum Dessert",
    fr: "Une expérience fluide, du scan au dessert",
    en: "A smooth experience, from scan to dessert",
  },
  sectionFlowText: {
    de: "DigiKarte ersetzt gedruckte Karten durch ein hochwertiges digitales Erlebnis. Du änderst Preise, Fotos oder Abschnitte, und deine Gäste sehen alles in Echtzeit auf ihrem Smartphone.",
    fr: "DigiKarte remplace vos cartes papier par une expérience digitale haut de gamme. Vous modifiez vos prix, vos photos, vos sections ; vos clients voient tout en temps réel sur leur téléphone.",
    en: "DigiKarte replaces paper menus with a premium digital experience. Update prices, photos or sections and your guests see everything in real time on their phones.",
  },
  step1Title: {
    de: "Erstelle deine Menüs",
    fr: "Créez vos menus",
    en: "Create your menus",
  },
  step1Text: {
    de: "Füge Kategorien, Gerichte, Getränke, Beschreibungen und Fotos in wenigen Klicks hinzu.",
    fr: "Ajoutez vos catégories, vos plats, vos boissons, vos descriptions et photos en quelques clics.",
    en: "Add categories, dishes, drinks, descriptions and photos in just a few clicks.",
  },
  step2Title: {
    de: "Erzeuge deine 3D-QRs",
    fr: "Générez vos QR 3D",
    en: "Generate your 3D QRs",
  },
  step2Text: {
    de: "Drucke moderne QR-Codes auf Tische, Schaufenstersticker oder Werbematerial.",
    fr: "Imprimez des QR modernes sur vos tables, stickers de vitrine ou supports publicitaires.",
    en: "Print modern QR codes on tables, window stickers or marketing materials.",
  },
  step3Title: {
    de: "Aktualisiere in Echtzeit",
    fr: "Mettez à jour en direct",
    en: "Update in real time",
  },
  step3Text: {
    de: "Keine Neudrucke mehr: Preis ändern, Menü anpassen – alle QR-Codes sind sofort à jour.",
    fr: "Plus de réimpression : un prix change, vous modifiez le menu, tous les QR sont à jour.",
    en: "No more reprints: change a price or menu, and every QR is instantly up to date.",
  },
  ctaFinalKicker: {
    de: "Bereit, deine Karte zu modernisieren?",
    fr: "Prêt à moderniser votre carte ?",
    en: "Ready to modernise your menu?",
  },
  ctaFinalTitle: {
    de: "Biete ein digitales Erlebnis, das Appetit macht.",
    fr: "Offrez une expérience digitale qui donne faim.",
    en: "Offer a digital experience that makes guests hungry.",
  },
  ctaFinalText: {
    de: "Starte kostenlos, erstelle deine ersten Menüs und teile deine QR-Codes in wenigen Minuten. Wenn du soweit bist, verbindest du deine Domain und aktivierst alle Pro-Funktionen.",
    fr: "Commencez gratuitement, créez vos premiers menus, et partagez vos QR en quelques minutes. Lorsque vous serez prêt, connectez votre domaine et activez toutes les fonctionnalités avancées.",
    en: "Start for free, create your first menus and share your QR codes in minutes. When you're ready, connect your domain and unlock all advanced features.",
  },
  ctaFinalNote: {
    de: "Keine Zahlung nötig, um zu starten.",
    fr: "Aucun paiement requis pour démarrer.",
    en: "No payment required to get started.",
  },
  // Pricing / subscriptions on landing
  pricingTitle: {
    de: "Ein einfaches Abo, drei Rhythmen.",
    fr: "Un seul abonnement, trois rythmes.",
    en: "One simple plan, three rhythms.",
  },
  pricingSubtitle: {
    de: "Starten Sie mit 3 Tagen Testphase – danach wählen Sie monatlich, halbjährlich oder jährlich.",
    fr: "Commencez avec 3 jours d’essai, puis choisissez mensuel, semestriel ou annuel.",
    en: "Start with a 3‑day trial, then choose monthly, semi‑annual or yearly.",
  },
  pricingTrialNote: {
    de: "Essai mit Karte: Die Karte wird erst nach der 3‑tägigen Testphase belastet. Sie können jederzeit vor Ablauf kündigen.",
    fr: "Essai avec carte bancaire : la carte n’est débitée qu’après les 3 jours d’essai. Vous pouvez annuler avant la fin.",
    en: "Trial with card: your card is only charged after the 3‑day trial. You can cancel before it ends.",
  },
  pricingPerMonthShort: {
    de: "/ Monat",
    fr: "/ mois",
    en: "/ month",
  },
  pricingPer6MonthsShort: {
    de: "/ 6 Monate",
    fr: "/ 6 mois",
    en: "/ 6 months",
  },
  pricingPerYearShort: {
    de: "/ Jahr",
    fr: "/ an",
    en: "/ year",
  },
  pricingCtaChoosePlan: {
    de: "Essai gratuit 3 Tage",
    fr: "3 jours d’essai gratuit",
    en: "Start 3‑day free trial",
  },
  // Section « Comment ajouter et personnaliser »
  explainHowTitle: {
    de: "So fügst du hinzu und personalisierst",
    fr: "Comment ajouter et personnaliser",
    en: "How to add and personalise",
  },
  explainHowSubtitle: {
    de: "Drei Schritte zu deiner digitalen Karte – direkt aus der App.",
    fr: "Trois étapes vers votre carte digitale, tout depuis l’app.",
    en: "Three steps to your digital menu, all from the app.",
  },
  explainAddOrgTitle: {
    de: "Erstelle deine Organisation",
    fr: "Créez votre organisation",
    en: "Create your organisation",
  },
  explainAddOrgText: {
    de: "Registriere dich, lege Restaurant, Café oder Bar an und verwalte alles an einem Ort.",
    fr: "Inscrivez-vous, créez votre restaurant, café ou bar et gérez tout au même endroit.",
    en: "Sign up, create your restaurant, café or bar and manage everything in one place.",
  },
  explainPersonalizeTitle: {
    de: "Menüs hinzufügen und anpassen",
    fr: "Ajoutez et personnalisez vos menus",
    en: "Add and personalise your menus",
  },
  explainPersonalizeText: {
    de: "Kategorien, Gerichte, Preise, Beschreibungen und Vorlagen – alles in wenigen Klicks.",
    fr: "Catégories, plats, prix, descriptions et modèles de design – le tout en quelques clics.",
    en: "Categories, dishes, prices, descriptions and design templates – all in a few clicks.",
  },
  explainQrTitle: {
    de: "QR-Codes generieren",
    fr: "Générez vos QR codes",
    en: "Generate your QR codes",
  },
  explainQrText: {
    de: "Lade deine QR-Codes herunter oder drucke sie für Tische, Schaufenster oder Werbematerial.",
    fr: "Téléchargez ou imprimez vos QR pour tables, vitrines ou supports pub.",
    en: "Download or print your QR codes for tables, windows or marketing materials.",
  },
  headerDashboardButton: {
    de: "Dashboard",
    fr: "Tableau de bord",
    en: "Dashboard",
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
    de: "E-Mail",
    fr: "Email",
    en: "Email",
  },
  authBusinessEmailPlaceholder: {
    de: "email@beispiel.de",
    fr: "email@exemple.com",
    en: "email@example.com",
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
  authFirstNamePlaceholder: {
    de: "Alex",
    fr: "Alex",
    en: "Alex",
  },
  authLastNamePlaceholder: {
    de: "Müller",
    fr: "Martin",
    en: "Taylor",
  },
  authPhonePlaceholder: {
    de: "+49 151 00000000",
    fr: "+33 6 00 00 00 00",
    en: "+41 79 000 00 00",
  },
  authPasswordPlaceholder: {
    de: "••••••••",
    fr: "••••••••",
    en: "••••••••",
  },
  authErrorInvalidCredentials: {
    de: "E-Mail oder Passwort ist falsch.",
    fr: "Email ou mot de passe incorrect.",
    en: "Email or password is incorrect.",
  },
  authErrorEmailExists: {
    de: "Es existiert bereits ein Konto mit dieser E-Mail-Adresse.",
    fr: "Un compte existe déjà avec cet email.",
    en: "An account already exists with this email address.",
  },
  authErrorGeneric: {
    de: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    fr: "Une erreur est survenue. Veuillez réessayer.",
    en: "An error occurred. Please try again.",
  },
  authSlogan: {
    de: "Digitale Menü-Plattform · QR-Code App",
    fr: "Plateforme menu digital · App QR code",
    en: "Digital menu platform · QR code app",
  },
  authBackToHome: {
    de: "Zurück zur Startseite",
    fr: "Retour à l'accueil",
    en: "Back to home",
  },
  // Dashboard
  dashboardNavDashboard: {
    de: "Dashboard",
    fr: "Tableau de bord",
    en: "Dashboard",
  },
  dashboardNavOrganisations: {
    de: "Organisationen",
    fr: "Organisations",
    en: "Organisations",
  },
  subscriptionNav: {
    de: "Abonnement",
    fr: "Abonnement",
    en: "Subscription",
  },
  dashboardNavMenusOfOrg: {
    de: "Menüs dieser Organisation",
    fr: "Menus de cette organisation",
    en: "Menus for this organization",
  },
  dashboardNavProfile: {
    de: "Profil",
    fr: "Profil",
    en: "Profile",
  },
  dashboardMenuDigitalAdmin: {
    de: "Digitales Menü – Admin",
    fr: "Menu digital admin",
    en: "Digital menu admin",
  },
  dashboardLoading: {
    de: "Laden…",
    fr: "Chargement…",
    en: "Loading…",
  },
  dashboardNoOrg: {
    de: "Keine Organisation",
    fr: "Aucune organisation",
    en: "No organization",
  },
  dashboardSelectOrg: {
    de: "Organisation auswählen",
    fr: "Sélectionner une organisation",
    en: "Select organization",
  },
  dashboardLoadingOrgs: {
    de: "Laden der Einrichtungen…",
    fr: "Chargement des établissements…",
    en: "Loading establishments…",
  },
  dashboardLogout: {
    de: "Abmelden",
    fr: "Déconnexion",
    en: "Log out",
  },
  dashboardDeleteAccount: {
    de: "Konto löschen",
    fr: "Supprimer le compte",
    en: "Delete account",
  },
  dashboardConnectedAs: {
    de: "Angemeldet als",
    fr: "Connecté en tant que",
    en: "Connected as",
  },
  dashboardAdmin: {
    de: "Admin",
    fr: "Admin",
    en: "Admin",
  },
  // Profile page
  profileTitle: {
    de: "Profil",
    fr: "Profil",
    en: "Profile",
  },
  profileKicker: {
    de: "Einstellungen",
    fr: "Paramètres",
    en: "Settings",
  },
  profilePhoto: {
    de: "Profilfoto",
    fr: "Photo de profil",
    en: "Profile photo",
  },
  profileChangePhoto: {
    de: "Foto ändern",
    fr: "Changer la photo",
    en: "Change photo",
  },
  profileRemovePhoto: {
    de: "Foto entfernen",
    fr: "Supprimer la photo",
    en: "Remove photo",
  },
  profileFirstName: {
    de: "Vorname",
    fr: "Prénom",
    en: "First name",
  },
  profileLastName: {
    de: "Nachname",
    fr: "Nom",
    en: "Last name",
  },
  profileEmail: {
    de: "E-Mail",
    fr: "Email",
    en: "Email",
  },
  profilePhone: {
    de: "Telefon",
    fr: "Téléphone",
    en: "Phone",
  },
  profileSave: {
    de: "Speichern",
    fr: "Enregistrer",
    en: "Save",
  },
  profileSaving: {
    de: "Wird gespeichert…",
    fr: "Enregistrement…",
    en: "Saving…",
  },
  profileSaved: {
    de: "Gespeichert.",
    fr: "Enregistré.",
    en: "Saved.",
  },
  profileLogout: {
    de: "Abmelden",
    fr: "Déconnexion",
    en: "Log out",
  },
  profileDeleteAccount: {
    de: "Konto löschen",
    fr: "Supprimer le compte",
    en: "Delete account",
  },
  profileDeleteConfirm: {
    de: "Sind Sie sicher, dass Sie Ihr DigiKarte-Konto endgültig löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
    fr: "Êtes-vous sûr de vouloir supprimer définitivement votre compte DigiKarte ? Cette action est irréversible.",
    en: "Are you sure you want to permanently delete your DigiKarte account? This action cannot be undone.",
  },
  profileUploadPhoto: {
    de: "Foto von Gerät auswählen",
    fr: "Importer une photo depuis votre appareil",
    en: "Upload a photo from your device",
  },
  // Errors (by API code)
  errorImageTooLarge: {
    de: "Das Bild ist zu groß. Bitte verwenden Sie ein Bild unter 5 MB oder ein kleineres Bild.",
    fr: "L'image est trop volumineuse. Utilisez une image de moins de 5 Mo ou une image plus petite.",
    en: "Image is too large. Please use an image under 5 MB or a smaller image.",
  },
  errorInvalidImage: {
    de: "Ungültiges Bild. Bitte verwenden Sie eine gültige Bilddatei (JPEG, PNG, WebP oder GIF).",
    fr: "Image invalide. Veuillez utiliser un fichier image valide (JPEG, PNG, WebP ou GIF).",
    en: "Invalid image. Please use a valid image file (JPEG, PNG, WebP or GIF).",
  },
  errorDeleteAccount: {
    de: "Konto konnte nicht gelöscht werden. Bitte versuchen Sie es später erneut.",
    fr: "Impossible de supprimer le compte pour le moment. Veuillez réessayer plus tard.",
    en: "Unable to delete account at this time. Please try again later.",
  },
  // Dashboard main page
  dashboardPageTitle: {
    de: "Ihre Organisationen",
    fr: "Vos organisations",
    en: "Your organizations",
  },
  dashboardPageSubtitle: {
    de: "Erstellen und verwalten Sie mehrere Standorte (Restaurant, Café, Bar) über eine einzige, serviceorientierte Oberfläche.",
    fr: "Créez et gérez plusieurs lieux (restaurant, café, bar) depuis une interface unique, pensée pour le service.",
    en: "Create and manage multiple venues (restaurant, café, bar) from a single interface designed for service.",
  },
  dashboardNewOrg: {
    de: "Neue Organisation",
    fr: "Nouvelle organisation",
    en: "New organization",
  },
  dashboardCancel: {
    de: "Abbrechen",
    fr: "Annuler",
    en: "Cancel",
  },
  dashboardBack: {
    de: "Zurück",
    fr: "Retour",
    en: "Back",
  },
  dashboardNone: {
    de: "Ohne Block",
    fr: "Aucun bloc",
    en: "No block",
  },
  dashboardLoadingOrgsPage: {
    de: "Organisationen werden geladen…",
    fr: "Chargement des organisations…",
    en: "Loading organizations…",
  },
  dashboardStatOrgs: {
    de: "Organisationen",
    fr: "Organisations",
    en: "Organizations",
  },
  dashboardStatOrgsDesc: {
    de: "Aktuell in DigiKarte konfigurierte Standorte.",
    fr: "Lieux actuellement configurés dans DigiKarte.",
    en: "Places currently configured in DigiKarte.",
  },
  dashboardStatMenus: {
    de: "Digitale Menüs",
    fr: "Menus digitaux",
    en: "Digital menus",
  },
  dashboardStatMenusDesc: {
    de: "Pflegen Sie Ihre Karten, um die Leistung zu verfolgen.",
    fr: "Renseignez vos cartes pour suivre leurs performances.",
    en: "Fill in your menus to track their performance.",
  },
  dashboardStatQr: {
    de: "Aktive QR-Codes",
    fr: "QR actifs",
    en: "Active QR codes",
  },
  dashboardStatQrDesc: {
    de: "Jeder QR wird nach Änderung automatisch aktualisiert.",
    fr: "Chaque QR est automatiquement à jour après modification.",
    en: "Each QR is automatically updated after modification.",
  },
  dashboardCreateOrgTitle: {
    de: "Neue Organisation erstellen",
    fr: "Créer une nouvelle organisation",
    en: "Create a new organization",
  },
  dashboardOrgNameLabel: {
    de: "Name der Organisation",
    fr: "Nom de l'organisation",
    en: "Organization name",
  },
  dashboardOrgNamePlaceholder: {
    de: "z. B. Graine de Café – Lausanne",
    fr: "Ex. Graine de Café – Lausanne",
    en: "e.g. Graine de Café – Lausanne",
  },
  dashboardOrgDescLabel: {
    de: "Beschreibung (optional)",
    fr: "Description (optionnel)",
    en: "Description (optional)",
  },
  dashboardOrgDescPlaceholder: {
    de: "z. B. Spezialitätenkaffee, handwerkliche Röstung …",
    fr: "Ex. Coffee shop de spécialité, torréfaction artisanale …",
    en: "e.g. Specialty coffee shop, artisan roasting …",
  },
  dashboardNamingTipLabel: {
    de: "Tipp",
    fr: "Conseil",
    en: "Tip",
  },
  dashboardNamingBestPractices: {
    de: "Tipps zur Benennung",
    fr: "Bonnes pratiques de nommage",
    en: "Naming best practices",
  },
  dashboardNaming1: {
    de: "Stadt oder Stadtteil angeben.",
    fr: "Inclure la ville ou le quartier.",
    en: "Include the city or neighborhood.",
  },
  dashboardNaming2: {
    de: "Standorte unterscheiden, wenn Sie mehrere Cafés haben.",
    fr: "Différencier les lieux si vous avez plusieurs cafés.",
    en: "Differentiate venues if you have several cafés.",
  },
  dashboardNaming3: {
    de: "Kurz und auf dem Handy gut lesbar bleiben.",
    fr: "Rester court et lisible sur mobile.",
    en: "Keep it short and readable on mobile.",
  },
  dashboardCreateOrgButton: {
    de: "Organisation erstellen",
    fr: "Créer l'organisation",
    en: "Create organization",
  },
  dashboardCreating: {
    de: "Wird erstellt…",
    fr: "Création…",
    en: "Creating…",
  },
  dashboardNoOrgYet: {
    de: "Noch keine Organisation.",
    fr: "Aucune organisation pour l'instant.",
    en: "No organization yet.",
  },
  dashboardNoOrgSubtitle: {
    de: "Erstellen Sie Ihre erste Organisation, um digitale Menüs, QR-Codes und mehrsprachige Karten zu erstellen.",
    fr: "Créez votre première organisation pour commencer à générer vos menus digitaux, QR codes et cartes multi-langues.",
    en: "Create your first organization to start generating your digital menus, QR codes and multilingual menus.",
  },
  dashboardFirstOrgButton: {
    de: "Meine erste Organisation erstellen",
    fr: "Créer ma première organisation",
    en: "Create my first organization",
  },
  dashboardMyOrgs: {
    de: "Meine Organisationen",
    fr: "Mes organisations",
    en: "My organizations",
  },
  dashboardPlacesConfigured: {
    de: "Standorte konfiguriert",
    fr: "lieux configurés",
    en: "places configured",
  },
  dashboardOrgLabel: {
    de: "Organisation",
    fr: "Organisation",
    en: "Organization",
  },
  dashboardMenusQr: {
    de: "Menüs & QR",
    fr: "Menus & QR",
    en: "Menus & QR",
  },
  dashboardViewMenus: {
    de: "Menüs ansehen",
    fr: "Voir les menus",
    en: "View menus",
  },
  dashboardEditOrg: {
    de: "Bearbeiten",
    fr: "Modifier",
    en: "Edit",
  },
  dashboardDeleteOrg: {
    de: "Löschen",
    fr: "Supprimer",
    en: "Delete",
  },
  dashboardEditOrgTitle: {
    de: "Organisation bearbeiten",
    fr: "Modifier l'organisation",
    en: "Edit organization",
  },
  dashboardDeleteOrgConfirm: {
    de: "Möchten Sie diese Organisation wirklich löschen? Alle zugehörigen Menüs und Daten werden gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.",
    fr: "Voulez-vous vraiment supprimer cette organisation ? Tous les menus et données associés seront supprimés. Cette action est irréversible.",
    en: "Are you sure you want to delete this organization? All associated menus and data will be deleted. This action cannot be undone.",
  },
  dashboardOrgDeleted: {
    de: "Organisation gelöscht.",
    fr: "Organisation supprimée.",
    en: "Organization deleted.",
  },
  dashboardSaving: {
    de: "Wird gespeichert…",
    fr: "Enregistrement…",
    en: "Saving…",
  },
  dashboardOrgUpdated: {
    de: "Organisation aktualisiert.",
    fr: "Organisation mise à jour.",
    en: "Organization updated.",
  },
  dashboardSwitchOrg: {
    de: "Organisation wechseln",
    fr: "Changer d'organisation",
    en: "Switch organization",
  },
  dashboardSwitchOrgHint: {
    de: "In der Seitenleiste wechseln",
    fr: "Changer dans la barre latérale",
    en: "Switch in sidebar",
  },
  dashboardCurrentOrg: {
    de: "Aktuelle Organisation",
    fr: "Organisation actuelle",
    en: "Current organization",
  },
  // Page organisation (détail + menus)
  orgSectionTitle: {
    de: "Organisation",
    fr: "Organisation",
    en: "Organization",
  },
  orgLogo: {
    de: "Logo der Organisation",
    fr: "Logo de l'organisation",
    en: "Organization logo",
  },
  orgLogoChange: {
    de: "Logo ändern",
    fr: "Changer le logo",
    en: "Change logo",
  },
  orgLogoUpload: {
    de: "Logo hochladen (max. 15 MB, JPEG, PNG, WebP, GIF)",
    fr: "Importer un logo (max. 15 Mo, JPEG, PNG, WebP, GIF)",
    en: "Upload logo (max. 15 MB, JPEG, PNG, WebP, GIF)",
  },
  orgLogoHint: {
    de: "Dieses Logo wird im digitalen Menü angezeigt.",
    fr: "Ce logo sera affiché dans le menu digital.",
    en: "This logo will be displayed in the digital menu.",
  },
  orgAddressLine1Label: {
    de: "Adresse (Straße und Hausnummer)",
    fr: "Adresse (rue et numéro)",
    en: "Address (street and number)",
  },
  orgAddressLine1Placeholder: {
    de: "z. B. Musterstraße 42",
    fr: "Ex. Rue du Commerce 12",
    en: "e.g. 42 Main Street",
  },
  orgAddressPostalCodeLabel: {
    de: "PLZ",
    fr: "Code postal",
    en: "Postal code",
  },
  orgAddressCityLabel: {
    de: "Stadt",
    fr: "Ville",
    en: "City",
  },
  orgCountryLabel: {
    de: "Land",
    fr: "Pays",
    en: "Country",
  },
  orgCountryPlaceholder: {
    de: "z. B. Deutschland",
    fr: "Ex. Allemagne, Suisse",
    en: "e.g. Germany",
  },
  orgPhoneLabel: {
    de: "Telefon",
    fr: "Téléphone",
    en: "Phone",
  },
  orgPhonePlaceholder: {
    de: "z. B. +49 30 12345678",
    fr: "Ex. +49 30 12345678",
    en: "e.g. +49 30 12345678",
  },
  orgEmailLabel: {
    de: "E-Mail (optional)",
    fr: "E-mail (optionnel)",
    en: "Email (optional)",
  },
  orgContactSectionTitle: {
    de: "Kontakt & Adresse (Café/Restaurant)",
    fr: "Contact et adresse (café/restaurant)",
    en: "Contact & address (café/restaurant)",
  },
  orgContactSectionHint: {
    de: "Wird im Menü und im Footer angezeigt (u. a. für das deutsche Impressum).",
    fr: "Affiché dans le menu et le pied de page (conformité Allemagne).",
    en: "Shown in the menu and footer (e.g. German legal requirements).",
  },
  menuFooterContact: {
    de: "Kontakt & Adresse",
    fr: "Contact et adresse",
    en: "Contact & address",
  },
  menuFooterPhone: {
    de: "Tel.",
    fr: "Tél.",
    en: "Tel.",
  },
  orgNotFound: {
    de: "Organisation nicht gefunden.",
    fr: "Organisation introuvable.",
    en: "Organization not found.",
  },
  orgMenusTitle: {
    de: "Menüs",
    fr: "Menus",
    en: "Menus",
  },
  orgNewMenu: {
    de: "+ Neues Menü",
    fr: "+ Nouveau menu",
    en: "+ New menu",
  },
  orgNoMenus: {
    de: "Keine Menüs. Erstellen Sie ein Menü, um Gerichte hinzuzufügen und einen QR-Code zu erzeugen.",
    fr: "Aucun menu. Créez un menu pour ajouter des plats et générer un QR.",
    en: "No menus. Create a menu to add dishes and generate a QR code.",
  },
  orgMenuTitleLabel: {
    de: "Menütitel (optional)",
    fr: "Titre du menu (optionnel)",
    en: "Menu title (optional)",
  },
  orgMenuTitleOptionalInfo: {
    de: "Du kannst dieses Feld leer lassen oder es nutzen, um Menüs zu unterscheiden (z. B. Mittagsmenü, Dessertkarte, Getränkekarte).",
    fr: "Tu peux laisser ce champ vide ou l'utiliser pour distinguer tes menus (ex. Menu du midi, Carte des desserts, Carte des boissons).",
    en: "You can leave this field empty or use it to distinguish menus (e.g. Lunch menu, Dessert menu, Drinks menu).",
  },
  orgMenuDescLabel: {
    de: "Beschreibung (optional)",
    fr: "Description (optionnel)",
    en: "Description (optional)",
  },
  orgCreateMenuButton: {
    de: "Menü erstellen",
    fr: "Créer le menu",
    en: "Create menu",
  },
  orgCreatingMenu: {
    de: "Wird erstellt…",
    fr: "Création…",
    en: "Creating…",
  },
  orgManageMenu: {
    de: "Menü verwalten",
    fr: "Gérer le menu",
    en: "Manage menu",
  },
  orgItemsCount: {
    de: "Artikel",
    fr: "article(s)",
    en: "item(s)",
  },
  menuEditTitle: {
    de: "Menü bearbeiten",
    fr: "Modifier le menu",
    en: "Edit menu",
  },
  menuDeleteConfirm: {
    de: "Dieses Menü und alle zugehörigen Artikel endgültig löschen?",
    fr: "Supprimer définitivement ce menu et tous ses articles ?",
    en: "Permanently delete this menu and all its items?",
  },
  menuItemDeleteConfirm: {
    de: "Diesen Artikel aus dem Menü entfernen?",
    fr: "Supprimer cet article du menu ?",
    en: "Remove this item from the menu?",
  },
  menuEditButton: {
    de: "Bearbeiten",
    fr: "Modifier",
    en: "Edit",
  },
  menuEditItemModalTitle: {
    de: "Gericht bearbeiten",
    fr: "Modifier le plat",
    en: "Edit dish",
  },
  menuEditItemModalHint: {
    de: "Nur Titel und Beschreibung (Preis & Block bleiben unverändert).",
    fr: "Titre et description uniquement (prix et bloc inchangés).",
    en: "Title and description only (price & section unchanged).",
  },
  menuSubProductAdd: {
    de: "Untergericht",
    fr: "Sous-plat",
    en: "Sub-item",
  },
  menuSubProductTitle: {
    de: "Untergericht hinzufügen",
    fr: "Ajouter un sous-plat",
    en: "Add sub-item",
  },
  menuSubProductHint: {
    de: "Erscheint eingerückt unter diesem Gericht.",
    fr: "S’affiche en retrait sous ce plat.",
    en: "Shows indented under this dish.",
  },
  menuDeleteButton: {
    de: "Löschen",
    fr: "Supprimer",
    en: "Delete",
  },
  menuDeleteSection: {
    de: "Block löschen",
    fr: "Supprimer le bloc",
    en: "Delete section",
  },
  menuDeleteSectionConfirm: {
    de: "Diesen Block auflösen? Die Gerichte werden in „Ohne Block“ verschoben.",
    fr: "Supprimer ce bloc ? Les plats seront déplacés dans « Sans bloc ».",
    en: "Remove this section? Items will move to \"No section\".",
  },
  menuBulkDeleteSelection: {
    de: "Auswahl löschen",
    fr: "Supprimer la sélection",
    en: "Delete selection",
  },
  menuSelectForDelete: {
    de: "Zur Mehrfachlöschung auswählen",
    fr: "Sélectionner pour suppression multiple",
    en: "Select for bulk delete",
  },
  menuMoveUp: {
    de: "Nach oben",
    fr: "Monter",
    en: "Move up",
  },
  menuMoveDown: {
    de: "Nach unten",
    fr: "Descendre",
    en: "Move down",
  },
  menuDragHint: {
    de: "Zum Umsortieren ziehen",
    fr: "Glisser pour réordonner",
    en: "Drag to reorder",
  },
  menuSectionOrderLabel: {
    de: "Block",
    fr: "Bloc",
    en: "Block",
  },
  menuSectionMoveUp: {
    de: "Block nach oben",
    fr: "Monter le bloc",
    en: "Move block up",
  },
  menuSectionMoveDown: {
    de: "Block nach unten",
    fr: "Descendre le bloc",
    en: "Move block down",
  },
  menuInlineAddTitle: {
    de: "Neues Gericht unter den bestehenden",
    fr: "Nouveau plat sous la liste",
    en: "New dish below",
  },
  menuInlineAddSubmit: {
    de: "Hinzufügen",
    fr: "Ajouter",
    en: "Add",
  },
  menuReorderBlocks: {
    de: "Blöcke ordnen",
    fr: "Ordre des blocs",
    en: "Reorder blocks",
  },
  menuReorderProducts: {
    de: "Gerichte ordnen",
    fr: "Ordre des plats",
    en: "Reorder dishes",
  },
  menuReorderModalBlocksTitle: {
    de: "Blöcke verschieben (Karten wie Puzzleteile)",
    fr: "Déplacer les blocs (cartes comme un puzzle)",
    en: "Move blocks (cards like a puzzle)",
  },
  menuReorderModalProductsTitle: {
    de: "Gerichte in diesem Block verschieben",
    fr: "Déplacer les plats dans ce bloc",
    en: "Move dishes in this block",
  },
  menuReorderModalHint: {
    de: "Karte greifen und auf eine andere legen.",
    fr: "Glissez une carte sur une autre pour changer l’ordre.",
    en: "Drag a card onto another to change order.",
  },
  menuReorderApply: {
    de: "Reihenfolge speichern",
    fr: "Enregistrer l’ordre",
    en: "Save order",
  },
  menuAddWithPlus: {
    de: "Produkt hinzufügen",
    fr: "Ajouter un plat",
    en: "Add dish",
  },
  menuViewButton: {
    de: "Ansehen",
    fr: "Voir",
    en: "View",
  },
  menuDisplayTemplate: {
    de: "Menü-Darstellung",
    fr: "Affichage du menu",
    en: "Menu display",
  },
  menuTemplateClassic: {
    de: "Klassisch (dunkel)",
    fr: "Classique (sombre)",
    en: "Classic (dark)",
  },
  menuTemplateCafe: {
    de: "Café (warm)",
    fr: "Café (chaleureux)",
    en: "Café (warm)",
  },
  menuTemplateBistro: {
    de: "Bistro (Paris)",
    fr: "Bistro (Paris)",
    en: "Bistro (Paris)",
  },
  menuTemplateMinimal: {
    de: "Minimal (klar)",
    fr: "Minimal (épuré)",
    en: "Minimal (clean)",
  },
  menuTemplateCards: {
    de: "Karten (modern)",
    fr: "Cartes (moderne)",
    en: "Cards (modern)",
  },
  menuTemplateElegant: {
    de: "Elegant (gastronomisch)",
    fr: "Élégant (gastronomique)",
    en: "Elegant (fine dining)",
  },
  menuTemplateRestaurant: {
    de: "Restaurant (Brasserie)",
    fr: "Restaurant (brasserie)",
    en: "Restaurant (brasserie)",
  },
  menuTemplateTerrasse: {
    de: "Terrasse (Café)",
    fr: "Terrasse (café)",
    en: "Terrace (café)",
  },
  menuPreviewLive: {
    de: "Live-Vorschau",
    fr: "Aperçu en direct",
    en: "Live preview",
  },
  menuDisplayTemplateSubtitle: {
    de: "Klicken Sie auf « Demo ansehen », um das Modell in der Vorschau zu sehen, dann wählen Sie es.",
    fr: "Choisissez l’apparence du menu pour vos clients (café, resto, bistro…). Les articles et sections restent identiques, seul le modèle d’affichage change.",
    en: "Click « View demo » to preview the template before choosing it.",
  },
  menuTemplateDemoKicker: {
    de: "Vorschau",
    fr: "Aperçu",
    en: "Preview",
  },
  menuTemplateChoose: {
    de: "Dieses Modell wählen",
    fr: "Choisir ce modèle",
    en: "Choose this template",
  },
  menuTemplateViewDemo: {
    de: "Demo ansehen",
    fr: "Voir la démo",
    en: "View demo",
  },
  menuSectionTitle: {
    de: "Menü",
    fr: "Menu",
    en: "Menu",
  },
  menuSloganLabel: {
    de: "Slogan des Restaurants",
    fr: "Slogan du restaurant",
    en: "Restaurant slogan",
  },
  menuSloganPlaceholder: {
    de: "z. B. Frisch und lecker bei uns",
    fr: "ex. Frais et savoureux chez nous",
    en: "e.g. Fresh and tasty at our place",
  },
  menuNotFound: {
    de: "Menü nicht gefunden.",
    fr: "Menu introuvable.",
    en: "Menu not found.",
  },
  menuContentTab: {
    de: "Menüinhalt",
    fr: "Contenu du menu",
    en: "Menu content",
  },
  menuQrTab: {
    de: "QR-Codes",
    fr: "Codes QR",
    en: "QR codes",
  },
  menuInfoTitle: {
    de: "Menüinformationen",
    fr: "Informations du menu",
    en: "Menu information",
  },
  menuSave: {
    de: "Speichern",
    fr: "Enregistrer",
    en: "Save",
  },
  menuItemsTitle: {
    de: "Deine Gerichte und Getränke",
    fr: "Vos plats et boissons",
    en: "Your dishes and drinks",
  },
  menuItemsHelp: {
    de: "Ein Block ist eine Kategorie (z. B. Getränke, Desserts). In jedem Block fügst du deine Gerichte hinzu – Name und Beschreibung können in 3 Sprachen angezeigt werden.",
    fr: "Un bloc = une catégorie (ex: Boissons, Desserts). Dans chaque bloc vous ajoutez vos plats ; le nom et la description peuvent être en 3 langues.",
    en: "A block is a category (e.g. Drinks, Desserts). In each block you add your dishes; name and description can be in 3 languages.",
  },
  menuAddSectionButton: {
    de: "Neuen Block anlegen",
    fr: "Créer un bloc",
    en: "Create a block",
  },
  menuAddItemButton: {
    de: "Gericht hinzufügen",
    fr: "Ajouter un plat",
    en: "Add a dish",
  },
  menuItemName: {
    de: "Name",
    fr: "Nom",
    en: "Name",
  },
  menuItemPrice: {
    de: "Preis (€)",
    fr: "Prix (€)",
    en: "Price (€)",
  },
  menuItemImageUrl: {
    de: "Bild-URL (z. B. Pizza, Kaffee, Saft)",
    fr: "URL image (ex. pizza, café, jus)",
    en: "Image URL (e.g. pizza, coffee, juice)",
  },
  menuItemImageOptional: {
    de: "Bild-URL (optional)",
    fr: "URL image (optionnel)",
    en: "Image URL (optional)",
  },
  menuSectionLabel: {
    de: "Block (Kategorie)",
    fr: "Bloc (catégorie)",
    en: "Block (category)",
  },
  menuSectionCustomLabel: {
    de: "Eigener Blockname",
    fr: "Nom du bloc (personnalisé)",
    en: "Block name (custom)",
  },
  menuSectionCustomPlaceholder: {
    de: "z. B. Hausspezialitäten",
    fr: "Ex: Spécialités de la maison",
    en: "e.g. House specialties",
  },
  menuSectionHotDrinks: {
    de: "Warme Getränke",
    fr: "Boissons chaudes",
    en: "Hot drinks",
  },
  menuSectionColdDrinks: {
    de: "Kalte Getränke",
    fr: "Boissons froides",
    en: "Cold drinks",
  },
  menuSectionCoffees: {
    de: "Kaffees & Spezialitäten",
    fr: "Cafés & spécialités",
    en: "Coffees & specialties",
  },
  menuSectionTeas: {
    de: "Tees & Infusionen",
    fr: "Thés & infusions",
    en: "Teas & infusions",
  },
  menuSectionSandwiches: {
    de: "Sandwiches",
    fr: "Sandwichs",
    en: "Sandwiches",
  },
  menuSectionSavorySnacks: {
    de: "Herzhafte Snacks",
    fr: "Snacks salés",
    en: "Savory snacks",
  },
  menuSectionDesserts: {
    de: "Kuchen & Süßspeisen",
    fr: "Pâtisseries & desserts",
    en: "Pastries & desserts",
  },
  menuSectionBreakfast: {
    de: "Frühstück",
    fr: "Petit-déjeuner",
    en: "Breakfast",
  },
  menuSectionCustomOption: {
    de: "Benutzerdefiniert…",
    fr: "Personnalisé…",
    en: "Custom…",
  },
  menuChooseSectionKicker: {
    de: "Block auswählen",
    fr: "Choix du bloc",
    en: "Choose block",
  },
  menuChooseSectionTitle: {
    de: "Welchen Block möchtest du anlegen?",
    fr: "Quel bloc voulez-vous créer ?",
    en: "Which block do you want to create?",
  },
  menuChooseSectionSubtitle: {
    de: "Ein Block gruppiert einen Typ von Gerichten (z. B. Getränke, Desserts, Frühstück). Danach fügst du in diesem Block deine Gerichte hinzu – Name und Beschreibung können in 3 Sprachen sein.",
    fr: "Un bloc regroupe un type de plats (ex: boissons, desserts, petit-déjeuner). Ensuite vous ajoutez vos plats dans ce bloc ; nom et description peuvent être en 3 langues.",
    en: "A block groups one type of dishes (e.g. drinks, desserts, breakfast). Then you add your dishes in this block; name and description can be in 3 languages.",
  },
  menuAddSectionConfirm: {
    de: "Diesen Block anlegen",
    fr: "Créer ce bloc",
    en: "Create this block",
  },
  menuAdd: {
    de: "Gericht hinzufügen",
    fr: "Ajouter un plat",
    en: "Add dish",
  },
  menuNoItems: {
    de: "Keine Artikel. Fügen Sie Gerichte oder Getränke hinzu.",
    fr: "Aucun article. Ajoutez des plats ou boissons.",
    en: "No items. Add dishes or drinks.",
  },
  menuLanguageLabel: {
    de: "Sprache des Menüs",
    fr: "Langue du menu",
    en: "Menu language",
  },
  menuLanguageHint: {
    de: "Diese Sprache wird für die vordefinierten Bezeichnungen, Abschnitte und Texte verwendet.",
    fr: "Cette langue sera utilisée pour les libellés, sections et textes prédéfinis.",
    en: "This language will be used for labels, sections and predefined texts.",
  },
  priceUnitLabel: {
    de: "Währung der Preise",
    fr: "Unité des prix (devise)",
    en: "Price currency",
  },
  priceUnitHint: {
    de: "Wählen Sie die Währung für alle Preise in diesem Menü (international).",
    fr: "Choisissez la devise pour tous les prix de ce menu (site international).",
    en: "Choose the currency for all prices in this menu (international site).",
  },
  currencyEUR: { de: "Euro (€)", fr: "Euro (€)", en: "Euro (€)" },
  currencyUSD: { de: "US-Dollar ($)", fr: "Dollar américain ($)", en: "US Dollar ($)" },
  currencyGBP: { de: "Britisches Pfund (£)", fr: "Livre sterling (£)", en: "British Pound (£)" },
  currencyCHF: { de: "Schweizer Franken (CHF)", fr: "Franc suisse (CHF)", en: "Swiss Franc (CHF)" },
  currencyJPY: { de: "Japanischer Yen (¥)", fr: "Yen japonais (¥)", en: "Japanese Yen (¥)" },
  currencyCNY: { de: "Chinesischer Yuan (¥)", fr: "Yuan chinois (¥)", en: "Chinese Yuan (¥)" },
  currencyINR: { de: "Indische Rupie (₹)", fr: "Roupie indienne (₹)", en: "Indian Rupee (₹)" },
  currencyBRL: { de: "Brasilianischer Real (R$)", fr: "Real brésilien (R$)", en: "Brazilian Real (R$)" },
  currencyMXN: { de: "Mexikanischer Peso ($)", fr: "Peso mexicain ($)", en: "Mexican Peso ($)" },
  currencyCAD: { de: "Kanadischer Dollar ($)", fr: "Dollar canadien ($)", en: "Canadian Dollar ($)" },
  currencyAUD: { de: "Australischer Dollar ($)", fr: "Dollar australien ($)", en: "Australian Dollar ($)" },
  currencyNZD: { de: "Neuseeland-Dollar ($)", fr: "Dollar néo-zélandais ($)", en: "New Zealand Dollar ($)" },
  currencyTND: { de: "Tunesischer Dinar (DT)", fr: "Dinar tunisien (DT)", en: "Tunisian Dinar (DT)" },
  currencyMAD: { de: "Marokkanischer Dirham (DH)", fr: "Dirham marocain (DH)", en: "Moroccan Dirham (DH)" },
  currencyDZD: { de: "Algerischer Dinar (DA)", fr: "Dinar algérien (DA)", en: "Algerian Dinar (DA)" },
  currencyEGP: { de: "Ägyptisches Pfund (£)", fr: "Livre égyptienne (£)", en: "Egyptian Pound (£)" },
  currencyZAR: { de: "Südafrikanischer Rand (R)", fr: "Rand sud-africain (R)", en: "South African Rand (R)" },
  currencyNGN: { de: "Nigerianischer Naira (₦)", fr: "Naira nigérian (₦)", en: "Nigerian Naira (₦)" },
  currencyTRY: { de: "Türkische Lira (₺)", fr: "Lire turque (₺)", en: "Turkish Lira (₺)" },
  currencyRUB: { de: "Russischer Rubel (₽)", fr: "Rouble russe (₽)", en: "Russian Ruble (₽)" },
  currencyKRW: { de: "Südkoreanischer Won (₩)", fr: "Won sud-coréen (₩)", en: "South Korean Won (₩)" },
  currencySGD: { de: "Singapur-Dollar ($)", fr: "Dollar de Singapour ($)", en: "Singapore Dollar ($)" },
  currencyAED: { de: "VAE-Dirham (AED)", fr: "Dirham des EAU (AED)", en: "UAE Dirham (AED)" },
  currencySAR: { de: "Saudi-Riyal (﷼)", fr: "Riyal saoudien (﷼)", en: "Saudi Riyal (﷼)" },
  currencyILS: { de: "Israelischer Schekel (₪)", fr: "Shekel israélien (₪)", en: "Israeli Shekel (₪)" },
  currencyTHB: { de: "Thailändischer Baht (฿)", fr: "Baht thaïlandais (฿)", en: "Thai Baht (฿)" },
  currencyMYR: { de: "Malaysischer Ringgit (RM)", fr: "Ringgit malaisien (RM)", en: "Malaysian Ringgit (RM)" },
  currencyIDR: { de: "Indonesische Rupiah (Rp)", fr: "Rupiah indonésienne (Rp)", en: "Indonesian Rupiah (Rp)" },
  currencyPHP: { de: "Philippinischer Peso (₱)", fr: "Peso philippin (₱)", en: "Philippine Peso (₱)" },
  currencyVND: { de: "Vietnamesischer Dong (₫)", fr: "Dong vietnamien (₫)", en: "Vietnamese Dong (₫)" },
  currencyPKR: { de: "Pakistanische Rupie (₨)", fr: "Roupie pakistanaise (₨)", en: "Pakistani Rupee (₨)" },
  currencyBDT: { de: "Bangladesch-Taka (৳)", fr: "Taka bangladais (৳)", en: "Bangladeshi Taka (৳)" },
  currencyLKR: { de: "Sri-Lanka-Rupie (Rs)", fr: "Roupie sri-lankaise (Rs)", en: "Sri Lankan Rupee (Rs)" },
  currencyPLN: { de: "Polnischer Złoty (zł)", fr: "Złoty polonais (zł)", en: "Polish Złoty (zł)" },
  currencyCZK: { de: "Tschechische Krone (Kč)", fr: "Couronne tchèque (Kč)", en: "Czech Koruna (Kč)" },
  currencySEK: { de: "Schwedische Krone (kr)", fr: "Couronne suédoise (kr)", en: "Swedish Krona (kr)" },
  currencyNOK: { de: "Norwegische Krone (kr)", fr: "Couronne norvégienne (kr)", en: "Norwegian Krone (kr)" },
  currencyDKK: { de: "Dänische Krone (kr)", fr: "Couronne danoise (kr)", en: "Danish Krone (kr)" },
  currencyHUF: { de: "Ungarischer Forint (Ft)", fr: "Forint hongrois (Ft)", en: "Hungarian Forint (Ft)" },
  currencyRON: { de: "Rumänischer Leu (lei)", fr: "Leu roumain (lei)", en: "Romanian Leu (lei)" },
  currencyBGN: { de: "Bulgarischer Lew (лв)", fr: "Lev bulgare (лв)", en: "Bulgarian Lev (лв)" },
  currencyUAH: { de: "Ukrainische Hrywnja (₴)", fr: "Hryvnia ukrainienne (₴)", en: "Ukrainian Hryvnia (₴)" },
  currencyARS: { de: "Argentinischer Peso ($)", fr: "Peso argentin ($)", en: "Argentine Peso ($)" },
  currencyCLP: { de: "Chilenischer Peso ($)", fr: "Peso chilien ($)", en: "Chilean Peso ($)" },
  currencyCOP: { de: "Kolumbianischer Peso ($)", fr: "Peso colombien ($)", en: "Colombian Peso ($)" },
  currencyPEN: { de: "Peruanischer Sol (S/)", fr: "Sol péruvien (S/)", en: "Peruvian Sol (S/)" },
  menuQrTitle: {
    de: "QR-Code des Menüs",
    fr: "Code QR du menu",
    en: "Menu QR code",
  },
  menuQrSubtitle: {
    de: "Ihre Gäste scannen den Code und sehen sofort die digitale Karte – modern, immer aktuell.",
    fr: "Vos clients scannent le code et voient la carte en un instant – moderne, toujours à jour.",
    en: "Your guests scan the code and see the digital menu instantly – modern, always up to date.",
  },
  menuQrScanHint: {
    de: "Scannen Sie, um die Karte zu sehen",
    fr: "Scannez pour voir le menu",
    en: "Scan me to see the menu",
  },
  menuQrStickerCta: {
    de: "Scannen Sie, um die Karte zu sehen",
    fr: "Scannez pour voir le menu",
    en: "Scan me to see the menu",
  },
  menuQrPosterSlogan: {
    de: "Scannen Sie für unser digitales Menü",
    fr: "Scannez pour voir notre carte",
    en: "Scan for our digital menu",
  },
  menuQrPermanentHint: {
    de: "Dieser Link bleibt dauerhaft gültig – ideal zum Drucken und Aufkleben auf Tischen.",
    fr: "Ce lien reste valable à vie – idéal pour imprimer et coller sur les tables.",
    en: "This link stays valid forever – ideal for printing and sticking on tables.",
  },
  menuQrOpenLink: {
    de: "Link im neuen Tab öffnen",
    fr: "Ouvrir le lien dans un nouvel onglet",
    en: "Open link in new tab",
  },
  menuQrDownloadStickers: {
    de: "PDF-Sticker (Tische)",
    fr: "PDF Stickers (tables)",
    en: "PDF Stickers (tables)",
  },
  menuQrDownloadPoster: {
    de: "PDF-Poster (Tür)",
    fr: "PDF Affiche (porte)",
    en: "PDF Poster (door)",
  },
  menuQrPosterTitle: {
    de: "Digitales Menü",
    fr: "Menu digital",
    en: "Digital menu",
  },
  menuQrScanLabel: {
    de: "Hier bestellen",
    fr: "Voir le menu ici",
    en: "Order here",
  },
  menuQrLabelTable: {
    de: "Tisch",
    fr: "Table",
    en: "Table",
  },
  menuQrLabelMenu: {
    de: "Menü",
    fr: "Menu",
    en: "Menu",
  },
  menuQrPrintSection: {
    de: "PDF zum Drucken herunterladen",
    fr: "Télécharger des PDF prêts à imprimer",
    en: "Download PDFs to print",
  },
  menuQrTemplateTables: {
    de: "Sticker für Tische",
    fr: "Stickers pour tables",
    en: "Stickers for tables",
  },
  menuQrTemplateDoor: {
    de: "Plakat für die Tür",
    fr: "Affiche pour la porte",
    en: "Poster for door",
  },
  menuQrPreviewPdf: {
    de: "PDF-Vorschau",
    fr: "Aperçu PDF",
    en: "PDF preview",
  },
  menuQrPrint: {
    de: "Drucken",
    fr: "Imprimer",
    en: "Print",
  },
  menuQrDownload: {
    de: "Herunterladen",
    fr: "Télécharger",
    en: "Download",
  },
  menuQrPreviewHint: {
    de: "Beide Vorlagen ansehen, dann drucken oder herunterladen.",
    fr: "Consultez les deux modèles avant d'imprimer ou de télécharger.",
    en: "View both templates before printing or downloading.",
  },
  menuQrGoToManagement: {
    de: "Sticker & Plakat drucken → QR-Verwaltung",
    fr: "Stickers et affiche à imprimer → Gestion des QR",
    en: "Print stickers & poster → QR management",
  },
  menuQrDisplayStyle: {
    de: "Stil des QR-Blocks",
    fr: "Style d'affichage du QR",
    en: "QR display style",
  },
  menuQrTheme: {
    de: "Farben",
    fr: "Couleurs",
    en: "Colors",
  },
  menuQrParametersTitle: {
    de: "Parameter",
    fr: "Paramètres",
    en: "Parameters",
  },
  menuQrParametersSubtitle: {
    de: "Farben, Texte und Schrift für Sticker & Affiche anpassen.",
    fr: "Ajustez couleurs, textes et police pour les stickers et l'affiche.",
    en: "Customise colours, text and font for stickers and poster.",
  },
  menuQrColorsPrint: {
    de: "Farben für Druck (Sticker & Plakat)",
    fr: "Couleurs pour l'impression (étiquettes & affiche)",
    en: "Colors for print (stickers & poster)",
  },
  menuQrPdfCardStickerSubtitle: {
    de: "Design modern · großer QR",
    fr: "Design moderne · QR grande taille",
    en: "Modern design · large QR",
  },
  menuQrPdfCardPosterSubtitle: {
    de: "QR sehr gut lesbar · für Tür, Fenster, Schild, Tafel",
    fr: "QR très lisible · à afficher sur porte, fenêtre, panneau, etc.",
    en: "Highly readable QR · for door, window, panel, sign",
  },
  menuQrStickerBgLabel: {
    de: "Fond carte (Sticker Tisch)",
    fr: "Fond carte (Sticker table)",
    en: "Card background (table sticker)",
  },
  menuQrPosterBgLabel: {
    de: "Fond affiche (Porte)",
    fr: "Fond affiche (Porte)",
    en: "Poster background (door)",
  },
  menuQrPosterIconType: {
    de: "Symbol (Affiche)",
    fr: "Symbole (affiche)",
    en: "Icon (poster)",
  },
  menuQrPosterIconRestaurant: {
    de: "Restaurant",
    fr: "Restaurant",
    en: "Restaurant",
  },
  menuQrPosterIconCafe: {
    de: "Café",
    fr: "Café",
    en: "Café",
  },
  menuQrPosterIconBoth: {
    de: "Beides",
    fr: "Les deux",
    en: "Both",
  },
  menuQrDefault: {
    de: "Standard",
    fr: "Par défaut",
    en: "Default",
  },
  menuQrLinkForDesigner: {
    de: "Menü-Link (für Designer)",
    fr: "Lien du menu (pour designer)",
    en: "Menu link (for designers)",
  },
  menuQrCopyLink: {
    de: "Link kopieren",
    fr: "Copier le lien",
    en: "Copy link",
  },
  menuQrNeutralQr: {
    de: "QR ohne Design",
    fr: "QR neutre (sans design)",
    en: "Neutral QR (no design)",
  },
  menuQrDownloadNeutralQr: {
    de: "QR als PNG herunterladen",
    fr: "Télécharger QR (PNG)",
    en: "Download QR (PNG)",
  },
  menuQrDownloadImage: {
    de: "Bild herunterladen (PNG)",
    fr: "Télécharger l'image (PNG)",
    en: "Download image (PNG)",
  },
  menuQrDownloadPdf: {
    de: "Als PDF",
    fr: "Générer PDF",
    en: "Generate PDF",
  },
  menuQrCopyLinkSuccess: {
    de: "Link in die Zwischenablage kopiert.",
    fr: "Lien copié dans le presse-papiers.",
    en: "Link copied to clipboard.",
  },
  menuQrNeutralQrSuccess: {
    de: "QR-Bild heruntergeladen.",
    fr: "QR neutre téléchargé.",
    en: "Neutral QR downloaded.",
  },
  menuQrPdfSuccessStickers: {
    de: "PDF-Sticker wurden erstellt und heruntergeladen.",
    fr: "PDF des stickers généré et téléchargé avec succès.",
    en: "Sticker PDF generated and downloaded successfully.",
  },
  menuQrPdfSuccessPoster: {
    de: "PDF-Affiche wurde erstellt und heruntergeladen.",
    fr: "PDF de l'affiche généré et téléchargé avec succès.",
    en: "Poster PDF generated and downloaded successfully.",
  },
  menuQrImageSuccessStickers: {
    de: "Sticker-Bild heruntergeladen.",
    fr: "Image du sticker téléchargée avec succès.",
    en: "Sticker image downloaded successfully.",
  },
  menuQrImageSuccessPoster: {
    de: "Affiche-Bild heruntergeladen.",
    fr: "Image de l'affiche téléchargée avec succès.",
    en: "Poster image downloaded successfully.",
  },
  menuQrPdfSuccessDismiss: {
    de: "Schließen",
    fr: "Fermer",
    en: "Dismiss",
  },
  menuQrPhraseAndFont: {
    de: "Text & Schrift",
    fr: "Phrase & police",
    en: "Text & font",
  },
  menuQrPaletteLogo: {
    de: "Vom Logo",
    fr: "Inspirées du logo",
    en: "From logo",
  },
  menuQrFontSans: {
    de: "Sans-serif",
    fr: "Sans serif",
    en: "Sans-serif",
  },
  menuQrFontSerif: {
    de: "Serif",
    fr: "Serif",
    en: "Serif",
  },
  menuQrPhraseSticker: {
    de: "Text unter dem QR (Sticker)",
    fr: "Phrase sous le QR (sticker)",
    en: "Text under QR (sticker)",
  },
  menuQrSloganPoster: {
    de: "Slogan / Untertitel (Plakat)",
    fr: "Slogan / sous-titre (affiche)",
    en: "Slogan / subtitle (poster)",
  },
  menuQrScanHintPoster: {
    de: "Scan-Hinweis (Plakat)",
    fr: "Phrase scan (affiche)",
    en: "Scan hint (poster)",
  },
  menuQrPosterDiscoverOur: {
    de: "Entdecken Sie unser",
    fr: "Découvrez notre",
    en: "Discover our",
  },
  menuQrPosterMenu: {
    de: "Menü",
    fr: "Menu",
    en: "Menu",
  },
  menuQrPosterTapPhone: {
    de: "Telefon halten",
    fr: "Toucher avec le téléphone",
    en: "Tap phone",
  },
  menuQrPosterScanQr: {
    de: "QR-Code scannen",
    fr: "Scanner le QR",
    en: "Scan QR-Code",
  },
  menuQrPosterOr: {
    de: "oder",
    fr: "ou",
    en: "or",
  },
  menuQrColorsDisplay: {
    de: "Design für Tisch & Tür (Anzeige)",
    fr: "Design table et porte (affichage)",
    en: "Display design (tables & door)",
  },
  qrThemeAmber: { de: "Amber", fr: "Ambre", en: "Amber" },
  qrThemeSlate: { de: "Slate", fr: "Ardoise", en: "Slate" },
  qrThemeEmerald: { de: "Smaragd", fr: "Émeraude", en: "Emerald" },
  qrThemeViolet: { de: "Violett", fr: "Violet", en: "Violet" },
  qrThemeRose: { de: "Rosa", fr: "Rose", en: "Rose" },
  qrThemeStone: { de: "Stein", fr: "Pierre", en: "Stone" },
  menuQrAccentSky: { de: "Himmelblau", fr: "Bleu ciel", en: "Sky" },
  menuQrAccentTeal: { de: "Blaugrün", fr: "Sarcelle", en: "Teal" },
  menuQrAccentOrange: { de: "Orange", fr: "Orange", en: "Orange" },
  menuQrAccentBlue: { de: "Blau", fr: "Bleu", en: "Blue" },
  menuQrAccentCustom: { de: "Eigene Farbe", fr: "Couleur personnalisée", en: "Custom color" },
  menuQrCardA4Dedicated: {
    de: "A4-Seite für dieses Menü",
    fr: "Page A4 dédiée à ce menu",
    en: "A4 page dedicated to this menu",
  },
  menuItemDescPlaceholder: {
    de: "Beschreibung",
    fr: "Description",
    en: "Description",
  },
  menuOk: {
    de: "OK",
    fr: "OK",
    en: "OK",
  },
  orgLoading: {
    de: "Laden…",
    fr: "Chargement…",
    en: "Loading…",
  },
  // Subscription / Billing
  subscriptionKicker: {
    de: "ABONNEMENT",
    fr: "ABONNEMENT",
    en: "SUBSCRIPTION",
  },
  subscriptionTitle: {
    de: "Verwalten Sie Ihr DigiKarte-Abo.",
    fr: "Gérez votre abonnement DigiKarte.",
    en: "Manage your DigiKarte subscription.",
  },
  subscriptionSubtitle: {
    de: "3 Tage kostenlos testen, dann ein einziges einfaches Abo – monatlich, halbjährlich oder jährlich.",
    fr: "3 jours d’essai gratuits, puis un seul abonnement simple – mensuel, semestriel ou annuel.",
    en: "3 days free trial, then one simple subscription – monthly, semi-annual or yearly.",
  },
  subscriptionLoading: {
    de: "Laden des Abonnements…",
    fr: "Chargement de l'abonnement…",
    en: "Loading subscription…",
  },
  subscriptionPlanMonthly: {
    de: "Monatlich",
    fr: "Mensuel",
    en: "Monthly",
  },
  subscriptionPlanSemiannual: {
    de: "Halbjährlich",
    fr: "Semestriel",
    en: "Semi-annual",
  },
  subscriptionPlanYearly: {
    de: "Jährlich",
    fr: "Annuel",
    en: "Yearly",
  },
  subscriptionPerMonth: {
    de: "pro Monat (ohne Bindung)",
    fr: "par mois (sans engagement)",
    en: "per month (no commitment)",
  },
  subscriptionPer6Months: {
    de: "alle 6 Monate",
    fr: "tous les 6 mois",
    en: "every 6 months",
  },
  subscriptionPerYear: {
    de: "pro Jahr",
    fr: "par an",
    en: "per year",
  },
  subscriptionMonthlyHint: {
    de: "Ideal zum Starten, kündbar jederzeit.",
    fr: "Idéal pour démarrer, résiliable à tout moment.",
    en: "Perfect to start, cancel anytime.",
  },
  subscriptionSemiannualHint: {
    de: "Für Cafés, die sich für eine Saison engagieren möchten.",
    fr: "Pour les cafés qui veulent s’engager sur une saison.",
    en: "For venues happy to commit for a season.",
  },
  subscriptionYearlyHint: {
    de: "Bestes Preis-Leistungs-Verhältnis auf das Jahr.",
    fr: "Le meilleur rapport qualité/prix à l’année.",
    en: "Best value over the year.",
  },
  subscriptionSemiannualSaving: {
    de: "≈ 18 % günstiger als monatlich.",
    fr: "≈ 18 % d’économie vs mensuel.",
    en: "≈ 18% cheaper than monthly.",
  },
  subscriptionYearlySaving: {
    de: "≈ 26 % günstiger als monatlich.",
    fr: "≈ 26 % d’économie vs mensuel.",
    en: "≈ 26% cheaper than monthly.",
  },
  subscriptionFeatureUnlimitedMenus: {
    de: "Unbegrenzte Organisationen & Menüs.",
    fr: "Organisations & menus illimités.",
    en: "Unlimited organisations & menus.",
  },
  subscriptionFeatureQr: {
    de: "Unbegrenzte QR-Codes & Vorlagen.",
    fr: "QR codes & modèles illimités.",
    en: "Unlimited QR codes & templates.",
  },
  subscriptionFeatureSupport: {
    de: "Support par E-Mail inclus.",
    fr: "Support par email inclus.",
    en: "Email support included.",
  },
  subscriptionChoosePlan: {
    de: "Diesen Plan wählen",
    fr: "Choisir ce plan",
    en: "Choose this plan",
  },
  subscriptionProcessing: {
    de: "Weiterleitung zum Bezahlen…",
    fr: "Redirection vers le paiement…",
    en: "Redirecting to payment…",
  },
  subscriptionBadgePopular: {
    de: "Beliebt",
    fr: "Populaire",
    en: "Popular",
  },
  subscriptionBadgeBest: {
    de: "Beste Wahl",
    fr: "Meilleure offre",
    en: "Best value",
  },
  subscriptionStatusLabel: {
    de: "Status",
    fr: "Statut",
    en: "Status",
  },
  subscriptionPlanLabel: {
    de: "Plan",
    fr: "Offre",
    en: "Plan",
  },
  subscriptionStatusTrial: {
    de: "Kostenloser Test",
    fr: "Essai gratuit",
    en: "Free trial",
  },
  subscriptionStatusActive: {
    de: "Aktiv",
    fr: "Actif",
    en: "Active",
  },
  subscriptionStatusExpired: {
    de: "Abgelaufen",
    fr: "Expiré",
    en: "Expired",
  },
  subscriptionStatusCancelled: {
    de: "Gekündigt",
    fr: "Résilié",
    en: "Cancelled",
  },
  subscriptionCurrentPlanTitle: {
    de: "Ihr aktueller Plan",
    fr: "Votre offre actuelle",
    en: "Your current plan",
  },
  subscriptionCurrentPlanSubtitle: {
    de: "Details zum aktuellen Abrechnungszeitraum und zur nächsten Abbuchung.",
    fr: "Détails sur votre période en cours et le prochain prélèvement.",
    en: "Details about your current period and next charge.",
  },
  subscriptionCurrentPeriodEnd: {
    de: "Ende der aktuellen Periode",
    fr: "Fin de la période en cours",
    en: "End of current period",
  },
  subscriptionNextPaymentLabel: {
    de: "Nächste Zahlung",
    fr: "Prochain paiement",
    en: "Next payment",
  },
  subscriptionNextPayment: {
    de: "Nächste Abbuchung am",
    fr: "Prochain prélèvement le",
    en: "Next automatic payment on",
  },
  subscriptionAutoRenewLabel: {
    de: "Automatische Verlängerung",
    fr: "Renouvellement automatique",
    en: "Automatic renewal",
  },
  subscriptionAutoRenewOn: {
    de: "Aktiviert",
    fr: "Activé",
    en: "Enabled",
  },
  subscriptionAutoRenewOff: {
    de: "Deaktiviert",
    fr: "Désactivé",
    en: "Disabled",
  },
  subscriptionInvoicesTitle: {
    de: "Rechnungen",
    fr: "Factures",
    en: "Invoices",
  },
  subscriptionInvoicesSubtitle: {
    de: "Letzte Zahlungen für Ihre DigiKarte-Lizenz.",
    fr: "Derniers paiements pour votre licence DigiKarte.",
    en: "Latest payments for your DigiKarte license.",
  },
  subscriptionNoInvoices: {
    de: "Noch keine Rechnung verfügbar.",
    fr: "Aucune facture pour l’instant.",
    en: "No invoices yet.",
  },
  subscriptionInvoiceStatusPaid: {
    de: "Bezahlt",
    fr: "Payée",
    en: "Paid",
  },
  subscriptionInvoiceStatusPending: {
    de: "En attente",
    fr: "En attente",
    en: "Pending",
  },
  subscriptionInvoiceStatusFailed: {
    de: "Fehlgeschlagen",
    fr: "Échouée",
    en: "Failed",
  },
  subscriptionInvoiceDownload: {
    de: "Rechnung (PDF)",
    fr: "Facture (PDF)",
    en: "Invoice (PDF)",
  },
  subscriptionLegalNote: {
    de: "Alle Preise zzgl. ggf. gesetzlicher Mehrwertsteuer. Abonnement automatisch verlängerbar, kündbar vor dem nächsten Abrechnungsdatum.",
    fr: "Tous les prix sont hors taxes éventuelles. Abonnement renouvelé automatiquement, résiliable avant la prochaine échéance.",
    en: "All prices exclude applicable taxes. Subscription renews automatically and can be cancelled before the next billing date.",
  },
  subscriptionTrialRemaining: {
    de: "Noch {days} Tage kostenlos testen.",
    fr: "Encore {days} jours d’essai gratuit.",
    en: "{days} days of free trial remaining.",
  },
  subscriptionTrialEnded: {
    de: "Ihr Test ist beendet – wählen Sie einen Plan, um DigiKarte weiter zu nutzen.",
    fr: "Votre essai est terminé – choisissez une offre pour continuer à utiliser DigiKarte.",
    en: "Your trial has ended – choose a plan to keep using DigiKarte.",
  },
  // Bandeau récap abonnement (essai / actif / inactif)
  subscriptionBannerTrialContinue: {
    de: "Kostenlose Testphase aktiv. Ihr Abonnement startet automatisch nach dem Ende des Tests.",
    fr: "Essai gratuit en cours. Votre abonnement payant commencera automatiquement à la fin de l’essai.",
    en: "Free trial is active. Your paid subscription will start automatically when the trial ends.",
  },
  subscriptionBannerActiveUntil: {
    de: "Ihr Abonnement ist aktiv bis",
    fr: "Votre abonnement est actif jusqu’au",
    en: "Your subscription is active until",
  },
  subscriptionBannerInactive: {
    de: "Kein aktives Abonnement. Wählen Sie einen Plan, um DigiKarte weiter zu nutzen.",
    fr: "Aucun abonnement actif. Choisissez une offre pour continuer à utiliser DigiKarte.",
    en: "No active subscription. Choose a plan to continue using DigiKarte.",
  },
  subscriptionDaysRemaining: {
    de: "Tage verbleiben vor der Verlängerung.",
    fr: "jours restants avant le renouvellement.",
    en: "days left before renewal.",
  },
  subscriptionDayRemaining: {
    de: "Tag verbleibt vor der Verlängerung.",
    fr: "jour restant avant le renouvellement.",
    en: "day left before renewal.",
  },
  subscriptionStopTrialInfo: {
    de: "Um das Testabo zu beenden, fügen wir später eine Schaltfläche zur Kündigung direkt mit Stripe hinzu. Aktuell bleibt das Testabo nur in der Stripe-Konsole verwaltet.",
    fr: "Pour arrêter l’essai / l’abonnement, nous ajouterons plus tard un bouton de résiliation connecté à Stripe. Pour l’instant, la gestion se fait uniquement depuis le tableau de bord Stripe.",
    en: "To stop the trial / subscription, we’ll later add a cancel button wired to Stripe. For now, management is only from the Stripe dashboard.",
  },
  // Actions pendant l'essai (boutons skip / annuler)
  subscriptionTrialActionsHint: {
    de: "Sie sind in der kostenlosen Testphase. Sie können den Test jederzeit abbrechen oder direkt zum bezahlten Plan wechseln.",
    fr: "Vous êtes en période d’essai. Vous pouvez arrêter l’essai à tout moment ou passer directement à l’offre payante.",
    en: "You are currently in the trial period. You can stop the trial at any time or jump straight to the paid plan.",
  },
  subscriptionSkipTrialCta: {
    de: "Test überspringen und aktivieren",
    fr: "Passer l’essai et activer",
    en: "Skip trial and activate",
  },
  subscriptionSkipTrialProcessing: {
    de: "Aktivierung läuft…",
    fr: "Activation…",
    en: "Activating…",
  },
  subscriptionCancelTrialCta: {
    de: "Test abbrechen und kündigen",
    fr: "Arrêter l’essai et résilier",
    en: "Stop trial and cancel",
  },
  subscriptionCancelTrialProcessing: {
    de: "Kündigung läuft…",
    fr: "Résiliation…",
    en: "Cancelling…",
  },
  // Annulation / réactivation d'un abonnement actif
  subscriptionCancelAtEndCta: {
    de: "Kündigung zum Periodenende planen",
    fr: "Annuler à la fin de la période",
    en: "Cancel at period end",
  },
  subscriptionCancelAtEndProcessing: {
    de: "Kündigung geplant…",
    fr: "Planification de l’annulation…",
    en: "Scheduling cancellation…",
  },
  subscriptionReactivateCta: {
    de: "Automatische Verlängerung wieder aktivieren",
    fr: "Réactiver le renouvellement automatique",
    en: "Reactivate auto‑renew",
  },
  subscriptionReactivateProcessing: {
    de: "Reaktivierung…",
    fr: "Réactivation…",
    en: "Reactivating…",
  },
  subscriptionCancelScheduledNote: {
    de: "Ihre Kündigung ist geplant: Ihr Zugang bleibt bis zum Ende der aktuellen Periode aktiv, danach wird das Abonnement beendet.",
    fr: "Votre résiliation est programmée : vous gardez l’accès jusqu’à la fin de la période actuelle, puis l’abonnement sera arrêté.",
    en: "Your cancellation is scheduled: you keep access until the end of the current period, then the subscription will end.",
  },
  // Gestion du moyen de paiement (Billing Portal)
  subscriptionManagePaymentMethod: {
    de: "Zahlungsmethode verwalten",
    fr: "Gérer mon moyen de paiement",
    en: "Manage payment method",
  },
} as const;

export function t<K extends keyof typeof translations>(
  key: K,
  locale: Locale
): string {
  return translations[key][locale];
}

const errorCodeToKey: Record<string, keyof typeof translations> = {
  IMAGE_TOO_LARGE: "errorImageTooLarge",
  INVALID_IMAGE: "errorInvalidImage",
  EMAIL_ALREADY_EXISTS: "authErrorEmailExists",
  INVALID_CREDENTIALS: "authErrorInvalidCredentials",
};

export function errorMessageFromCode(code: string | undefined, locale: Locale): string {
  if (!code) return t("authErrorGeneric", locale);
  const key = errorCodeToKey[code];
  if (key) return t(key, locale);
  return t("authErrorGeneric", locale);
}
