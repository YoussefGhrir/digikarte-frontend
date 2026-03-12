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
    de: "Menu digital Admin",
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
  dashboardNone: {
    de: "Ohne Kategorie",
    fr: "Sans section",
    en: "No section",
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
    de: "Orte konfiguriert",
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
    de: "Dieses Artikel aus dem Menü entfernen?",
    fr: "Supprimer cet article du menu ?",
    en: "Remove this item from the menu?",
  },
  menuEditButton: {
    de: "Bearbeiten",
    fr: "Modifier",
    en: "Edit",
  },
  menuDeleteButton: {
    de: "Löschen",
    fr: "Supprimer",
    en: "Delete",
  },
  menuViewButton: {
    de: "Ansehen",
    fr: "Voir",
    en: "View",
  },
  menuSectionTitle: {
    de: "Menü",
    fr: "Menu",
    en: "Menu",
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
    de: "Menüartikel",
    fr: "Articles du menu",
    en: "Menu items",
  },
  menuAddSectionButton: {
    de: "Sektion hinzufügen",
    fr: "Ajouter une section",
    en: "Add section",
  },
  menuAddItemButton: {
    de: "+ Artikel hinzufügen",
    fr: "+ Ajouter un article",
    en: "+ Add item",
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
  menuItemImageOptional: {
    de: "Bild-URL (optional)",
    fr: "URL image (optionnel)",
    en: "Image URL (optional)",
  },
  menuSectionLabel: {
    de: "Kategorie (Abschnitt)",
    fr: "Section (catégorie)",
    en: "Section (category)",
  },
  menuSectionCustomLabel: {
    de: "Benutzerdefinierter Abschnittstitel",
    fr: "Titre de section personnalisé",
    en: "Custom section title",
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
    de: "Sektion auswählen",
    fr: "Choix de section",
    en: "Choose section",
  },
  menuChooseSectionTitle: {
    de: "Welche Sektion möchten Sie hinzufügen?",
    fr: "Quelle section souhaitez-vous ajouter ?",
    en: "Which section would you like to add?",
  },
  menuChooseSectionSubtitle: {
    de: "Wählen Sie eine typische Kategorie der Gastronomie (Heißgetränke, Desserts, Frühstück …) oder geben Sie Ihre eigene Bezeichnung ein.",
    fr: "Choisissez une catégorie typique de la restauration (boissons chaudes, desserts, petit-déjeuner…) ou saisissez votre propre intitulé.",
    en: "Choose a typical hospitality category (hot drinks, desserts, breakfast…) or enter your own label.",
  },
  menuAddSectionConfirm: {
    de: "Sektion erstellen",
    fr: "Créer la section",
    en: "Create section",
  },
  menuAdd: {
    de: "Hinzufügen",
    fr: "Ajouter",
    en: "Add",
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
  menuQrTitle: {
    de: "QR-Code des Menüs",
    fr: "Code QR du menu",
    en: "Menu QR code",
  },
  menuQrSubtitle: {
    de: "Dieser QR-Code führt zur öffentlichen Version Ihres Menüs. Drucken Sie ihn auf Ihre Tische, Karten oder Plakate, damit Ihre Gäste ihn scannen können.",
    fr: "Ce code QR pointe vers la version publique de votre menu. Imprimez-le sur vos tables, cartes ou affiches pour que vos clients puissent le scanner.",
    en: "This QR code points to the public version of your menu. Print it on your tables, cards or posters so that your guests can scan it.",
  },
  menuQrScanHint: {
    de: "Scannen Sie mit Ihrem Smartphone, um die Anzeige zu testen.",
    fr: "Scannez avec votre smartphone pour tester l'affichage.",
    en: "Scan with your smartphone to test the display.",
  },
  menuQrOpenLink: {
    de: "Link im neuen Tab öffnen",
    fr: "Ouvrir le lien dans un nouvel onglet",
    en: "Open link in new tab",
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
