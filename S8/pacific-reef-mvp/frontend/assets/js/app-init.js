import { clearCurrentUser, getCurrentUser, getLanguage, setLanguage } from './session.js';

const pageKey = window.location.pathname.split('/').pop() || 'index.html';

const translations = {
  common: {
    es: {
      languageLabel: 'Idioma',
      languageOptionEs: 'ES',
      languageOptionEn: 'EN',
      brand: 'Pacific Reef',
      navHome: 'Inicio',
      navRooms: 'Habitaciones',
      navReservation: 'Reserva',
      navAdmin: 'Panel admin',
      navLogin: 'Ingresar'
    },
    en: {
      languageLabel: 'Language',
      languageOptionEs: 'ES',
      languageOptionEn: 'EN',
      brand: 'Pacific Reef',
      navHome: 'Home',
      navRooms: 'Rooms',
      navReservation: 'Booking',
      navAdmin: 'Admin panel',
      navLogin: 'Sign in'
    }
  },
  'index.html': {
    es: {
      title: 'Pacific Reef | Inicio',
      heroEyebrow: 'Gestion de Reserva Hotelera',
      heroTitle: 'Reserva con una experiencia clara, rapida y elegante.',
      heroLead: 'Prototipo base para el Hotel Pacific Reef con consulta de disponibilidad, reserva online, pago inicial y gestion interna del servicio.',
      ctaAvailability: 'Consultar disponibilidad',
      ctaRooms: 'Ver habitaciones',
      hotelStatusLabel: 'Estado del hotel',
      hotelStatusTitle: 'Disponibilidad activa',
      hotelStatusToday: 'Hoy',
      metricAvailableRooms: 'Habitaciones disponibles',
      metricMinimumBooking: 'Reserva minima',
      includesLabel: 'Incluye',
      searchEyebrow: 'Vista principal',
      searchTitle: 'Consulta de disponibilidad',
      searchLead: 'Pantalla de inicio para visitantes y clientes. Prioriza claridad, confianza y acceso directo a la reserva.',
      searchBadge: 'Cliente / Visitante',
      labelCheckIn: 'Fecha entrada',
      labelCheckOut: 'Fecha salida',
      labelGuests: 'Huespedes',
      optionGuests2: '2 adultos',
      optionGuests1: '1 adulto',
      optionGuests3: '2 adultos, 1 nino',
      optionGuests4: '4 huespedes',
      btnSearchRooms: 'Buscar habitaciones',
      benefitsEyebrow: 'Beneficios',
      benefitsTitle: 'Que transmite esta vista',
      feature1: 'Busqueda inmediata por rango de fechas.',
      feature2: 'Acceso rapido al catalogo de habitaciones.',
      feature3: 'Entrada visible a registro e inicio de sesion.',
      feature4: 'Diseno limpio para web y tablet.',
      cardResults: 'Resultados',
      cardResultsText: 'Listado filtrado con cards de habitaciones disponibles.',
      cardDetail: 'Detalle',
      cardDetailText: 'Galeria, equipamiento, precio y decision de reserva.',
      cardBooking: 'Reserva',
      cardBookingText: 'Resumen de estadia, calculo total y pago inicial.',
      cardAdmin: 'Gestion',
      cardAdminText: 'Panel para reservas, clientes, precios y reportes.'
    },
    en: {
      title: 'Pacific Reef | Home',
      heroEyebrow: 'Hotel Booking Management',
      heroTitle: 'Book with a clear, fast and elegant experience.',
      heroLead: 'Core prototype for Hotel Pacific Reef with availability search, online booking, initial payment and internal operations.',
      ctaAvailability: 'Check availability',
      ctaRooms: 'View rooms',
      hotelStatusLabel: 'Hotel status',
      hotelStatusTitle: 'Active availability',
      hotelStatusToday: 'Today',
      metricAvailableRooms: 'Available rooms',
      metricMinimumBooking: 'Minimum booking',
      includesLabel: 'Includes',
      searchEyebrow: 'Main view',
      searchTitle: 'Availability search',
      searchLead: 'Landing screen for visitors and guests. It prioritizes clarity, trust and direct access to booking.',
      searchBadge: 'Guest / Visitor',
      labelCheckIn: 'Check-in date',
      labelCheckOut: 'Check-out date',
      labelGuests: 'Guests',
      optionGuests2: '2 adults',
      optionGuests1: '1 adult',
      optionGuests3: '2 adults, 1 child',
      optionGuests4: '4 guests',
      btnSearchRooms: 'Search rooms',
      benefitsEyebrow: 'Benefits',
      benefitsTitle: 'What this view conveys',
      feature1: 'Immediate search by date range.',
      feature2: 'Quick access to the room catalog.',
      feature3: 'Visible entry to register and sign in.',
      feature4: 'Clean design for web and tablet.',
      cardResults: 'Results',
      cardResultsText: 'Filtered list with available room cards.',
      cardDetail: 'Detail',
      cardDetailText: 'Gallery, amenities, price and booking decision.',
      cardBooking: 'Booking',
      cardBookingText: 'Stay summary, total calculation and initial payment.',
      cardAdmin: 'Management',
      cardAdminText: 'Panel for bookings, guests, prices and reports.'
    }
  },
  'habitaciones.html': {
    es: {
      title: 'Pacific Reef | Habitaciones',
      navDetail: 'Detalle',
      roomsEyebrow: 'Vista 2',
      roomsTitle: 'Habitaciones disponibles',
      roomsLead: 'Resultado de la consulta por fecha con tarjetas claras y accion inmediata.',
      roomsLoadingSummary: 'Cargando parametros de busqueda...',
      filtersTitle: 'Filtros',
      filterCategory: 'Categoria',
      filterAll: 'Todas',
      filterTourist: 'Turista',
      filterPremium: 'Premium',
      filterFamily: 'Familiar',
      filterPrice: 'Precio maximo por noche',
      filterApply: 'Aplicar filtros',
      roomsLoading: 'Cargando habitaciones disponibles...'
    },
    en: {
      title: 'Pacific Reef | Rooms',
      navDetail: 'Detail',
      roomsEyebrow: 'View 2',
      roomsTitle: 'Available rooms',
      roomsLead: 'Search results by date with clear cards and quick actions.',
      roomsLoadingSummary: 'Loading search parameters...',
      filtersTitle: 'Filters',
      filterCategory: 'Category',
      filterAll: 'All',
      filterTourist: 'Tourist',
      filterPremium: 'Premium',
      filterFamily: 'Family',
      filterPrice: 'Maximum nightly rate',
      filterApply: 'Apply filters',
      roomsLoading: 'Loading available rooms...'
    }
  },
  'detalle-habitacion.html': {
    es: {
      title: 'Pacific Reef | Detalle',
      navBack: 'Volver a resultados',
      navBooking: 'Ir a reserva',
      eyebrow: 'Vista 3',
      loadingTitle: 'Cargando habitacion...',
      loadingDescription: 'Estamos consultando el detalle de la habitacion seleccionada.',
      equipmentTitle: 'Equipamiento',
      equipmentLoading: 'Cargando equipamiento...',
      infoTitle: 'Informacion',
      infoLoading: 'Cargando informacion...',
      summaryEyebrow: 'Resumen',
      priceLoading: 'Cargando precio...',
      stay: 'Estadia',
      totalEstimate: 'Total estimado',
      deposit: 'Pago inicial',
      reserveButton: 'Reservar habitacion'
    },
    en: {
      title: 'Pacific Reef | Detail',
      navBack: 'Back to results',
      navBooking: 'Go to booking',
      eyebrow: 'View 3',
      loadingTitle: 'Loading room...',
      loadingDescription: 'We are retrieving the details of the selected room.',
      equipmentTitle: 'Amenities',
      equipmentLoading: 'Loading amenities...',
      infoTitle: 'Information',
      infoLoading: 'Loading information...',
      summaryEyebrow: 'Summary',
      priceLoading: 'Loading price...',
      stay: 'Stay',
      totalEstimate: 'Estimated total',
      deposit: 'Initial payment',
      reserveButton: 'Book room'
    }
  },
  'acceso.html': {
    es: {
      title: 'Pacific Reef | Acceso',
      eyebrow: 'Vista 4',
      heading: 'Acceso de usuarios',
      lead: 'Unifica registro e inicio de sesion para clientes, administradores y trabajadores sin romper la simplicidad del flujo.',
      demoTitle: 'Credenciales demo',
      loginTab: 'Iniciar sesion',
      registerTab: 'Registrarse',
      email: 'Correo electronico',
      password: 'Contrasena',
      role: 'Perfil',
      roleClient: 'Cliente',
      roleAdmin: 'Administrador',
      roleStaff: 'Trabajador',
      loginButton: 'Entrar al sistema',
      firstName: 'Nombre',
      lastName: 'Apellido',
      emailShort: 'Correo',
      phone: 'Telefono',
      document: 'Documento',
      registerButton: 'Crear cuenta',
      placeholderSecurePassword: 'Crea una contrasena segura'
    },
    en: {
      title: 'Pacific Reef | Access',
      eyebrow: 'View 4',
      heading: 'User access',
      lead: 'It combines sign in and registration for guests, administrators and staff without breaking the simplicity of the flow.',
      demoTitle: 'Demo credentials',
      loginTab: 'Sign in',
      registerTab: 'Register',
      email: 'Email address',
      password: 'Password',
      role: 'Profile',
      roleClient: 'Guest',
      roleAdmin: 'Administrator',
      roleStaff: 'Staff',
      loginButton: 'Enter system',
      firstName: 'First name',
      lastName: 'Last name',
      emailShort: 'Email',
      phone: 'Phone',
      document: 'Document',
      registerButton: 'Create account',
      placeholderSecurePassword: 'Create a secure password'
    }
  },
  'reserva.html': {
    es: {
      title: 'Pacific Reef | Reserva',
      navRoom: 'Habitacion',
      navBooking: 'Reserva',
      navConfirmation: 'Confirmacion',
      eyebrow: 'Vista 5',
      heading: 'Resumen de reserva y pago inicial',
      lead: 'Pantalla central del flujo: validacion de fechas, datos del huesped y calculo automatico del 30 por ciento.',
      badge: 'Flujo critico',
      formTitle: 'Datos de la reserva',
      authNotice: 'Debes iniciar sesion como cliente para confirmar la reserva.',
      authNoticeLink: 'Ir a acceso',
      checkIn: 'Fecha entrada',
      checkOut: 'Fecha salida',
      guestName: 'Nombre del huesped',
      email: 'Correo',
      guests: 'Cantidad de huespedes',
      paymentMethod: 'Metodo de pago',
      paymentCard: 'Tarjeta',
      paymentTransfer: 'Transferencia',
      paymentWebpay: 'Webpay',
      paymentCash: 'Pago presencial',
      observations: 'Observaciones',
      observationsPlaceholder: 'Ejemplo: llegada tarde o requerimiento especial',
      confirmButton: 'Confirmar reserva',
      summaryEyebrow: 'Calculo',
      summaryRoom: 'Habitacion seleccionada',
      taxes: 'Impuestos y cargos',
      deposit: 'Pago inicial 30%',
      pending: 'Saldo pendiente en check-in',
      validationsTitle: 'Validaciones visibles',
      validationsLoading: 'Cargando validaciones...'
    },
    en: {
      title: 'Pacific Reef | Booking',
      navRoom: 'Room',
      navBooking: 'Booking',
      navConfirmation: 'Confirmation',
      eyebrow: 'View 5',
      heading: 'Booking summary and initial payment',
      lead: 'Core screen of the flow: date validation, guest data and automatic calculation of the 30 percent deposit.',
      badge: 'Critical flow',
      formTitle: 'Booking details',
      authNotice: 'You must sign in as a guest to confirm the booking.',
      authNoticeLink: 'Go to access',
      checkIn: 'Check-in date',
      checkOut: 'Check-out date',
      guestName: 'Guest name',
      email: 'Email',
      guests: 'Guest count',
      paymentMethod: 'Payment method',
      paymentCard: 'Card',
      paymentTransfer: 'Bank transfer',
      paymentWebpay: 'Webpay',
      paymentCash: 'Pay on site',
      observations: 'Notes',
      observationsPlaceholder: 'Example: late arrival or special request',
      confirmButton: 'Confirm booking',
      summaryEyebrow: 'Calculation',
      summaryRoom: 'Selected room',
      taxes: 'Taxes and fees',
      deposit: 'Initial payment 30%',
      pending: 'Remaining balance at check-in',
      validationsTitle: 'Visible validations',
      validationsLoading: 'Loading validations...'
    }
  },
  'confirmacion.html': {
    es: {
      title: 'Pacific Reef | Confirmacion',
      eyebrow: 'Vista 6',
      loadingTitle: 'Cargando confirmacion...',
      lead: 'El sistema registra el pago inicial, genera el ticket y deja disponible el codigo QR para control de acceso y validacion.',
      summaryTitle: 'Resumen final',
      summaryLoadingState: 'Estado',
      summaryLoadingText: 'Consultando reserva...',
      qrText: 'Codigo para validacion de la reserva en recepcion.',
      backHome: 'Volver al inicio',
      admin: 'Ver panel admin'
    },
    en: {
      title: 'Pacific Reef | Confirmation',
      eyebrow: 'View 6',
      loadingTitle: 'Loading confirmation...',
      lead: 'The system records the initial payment, generates the ticket and keeps the QR code available for access control and validation.',
      summaryTitle: 'Final summary',
      summaryLoadingState: 'Status',
      summaryLoadingText: 'Checking booking...',
      qrText: 'Code for booking validation at reception.',
      backHome: 'Back to home',
      admin: 'View admin panel'
    }
  },
  'admin.html': {
    es: {
      title: 'Pacific Reef | Panel Administrativo',
      sidebar: 'Panel administrativo',
      menuReservations: 'Reservas',
      menuClients: 'Clientes',
      menuWorkers: 'Trabajadores',
      menuCatalog: 'Catalogo',
      menuPrices: 'Precios',
      menuReports: 'Reportes',
      eyebrow: 'Vista 7',
      heading: 'Gestion administrativa',
      lead: 'Contenedor principal para administrar reservas, usuarios, catalogo, precios y reportes.',
      workerView: 'Vista trabajador',
      activeBookings: 'Reservas activas',
      checkInToday: 'Check-in hoy',
      occupancy: 'Ocupacion',
      estimatedIncome: 'Ingresos estimados',
      recentBookings: 'Reservas recientes',
      filter: 'Filtrar',
      code: 'Codigo',
      client: 'Cliente',
      dates: 'Fechas',
      status: 'Estado',
      loadingBookings: 'Cargando reservas recientes...',
      roomCatalog: 'Catalogo de habitaciones',
      quickAdd: 'Alta rapida',
      roomNumber: 'Numero',
      roomName: 'Nombre',
      category: 'Categoria',
      selectCategory: 'Selecciona una categoria',
      capacity: 'Capacidad',
      dailyPrice: 'Precio diario',
      mainImageUrl: 'URL imagen principal',
      description: 'Descripcion',
      addRoom: 'Agregar habitacion',
      editRoom: 'Guardar cambios',
      cancelEdit: 'Cancelar',
      actions: 'Acciones',
      edit: 'Editar',
      recentRooms: 'Habitaciones recientes',
      loadingCatalog: 'Cargando catalogo...',
      statusAvailable: 'disponible',
      statusOccupied: 'ocupada',
      statusMaintenance: 'mantenimiento',
      statusInactive: 'inactiva',
      price: 'Precio'
    },
    en: {
      title: 'Pacific Reef | Admin Panel',
      sidebar: 'Admin panel',
      menuReservations: 'Bookings',
      menuClients: 'Guests',
      menuWorkers: 'Staff',
      menuCatalog: 'Catalog',
      menuPrices: 'Prices',
      menuReports: 'Reports',
      eyebrow: 'View 7',
      heading: 'Administrative management',
      lead: 'Main container to manage bookings, users, catalog, prices and reports.',
      workerView: 'Staff view',
      activeBookings: 'Active bookings',
      checkInToday: 'Check-in today',
      occupancy: 'Occupancy',
      estimatedIncome: 'Estimated income',
      recentBookings: 'Recent bookings',
      filter: 'Filter',
      code: 'Code',
      client: 'Guest',
      dates: 'Dates',
      status: 'Status',
      loadingBookings: 'Loading recent bookings...',
      roomCatalog: 'Room catalog',
      quickAdd: 'Quick add',
      roomNumber: 'Number',
      roomName: 'Name',
      category: 'Category',
      selectCategory: 'Select a category',
      capacity: 'Capacity',
      dailyPrice: 'Daily price',
      mainImageUrl: 'Main image URL',
      description: 'Description',
      addRoom: 'Add room',
      editRoom: 'Save changes',
      cancelEdit: 'Cancel',
      actions: 'Actions',
      edit: 'Edit',
      recentRooms: 'Recent rooms',
      loadingCatalog: 'Loading catalog...',
      statusAvailable: 'available',
      statusOccupied: 'occupied',
      statusMaintenance: 'maintenance',
      statusInactive: 'inactive',
      price: 'Price'
    }
  },
  'trabajador.html': {
    es: {
      title: 'Pacific Reef | Vista Trabajador',
      eyebrow: 'Vista 8',
      heading: 'Panel operativo de trabajador',
      lead: 'Interfaz acotada para consultar reservas, calendario y servicio contratado sin exponer funciones administrativas completas.',
      backAdmin: 'Volver al panel admin',
      calendarTitle: 'Calendario operativo',
      dailyTasks: 'Atencion operativa del dia',
      room: 'Habitacion',
      client: 'Cliente',
      observation: 'Observacion',
      entry: 'Ingreso',
      loadingTasks: 'Cargando actividad operativa...',
      todayBookings: 'Reservas del dia',
      loadingBookings: 'Cargando reservas en curso...'
    },
    en: {
      title: 'Pacific Reef | Staff View',
      eyebrow: 'View 8',
      heading: 'Staff operations panel',
      lead: 'Focused interface to review bookings, schedule and contracted service without exposing full administrative functions.',
      backAdmin: 'Back to admin panel',
      calendarTitle: 'Operations calendar',
      dailyTasks: 'Daily operations',
      room: 'Room',
      client: 'Guest',
      observation: 'Observation',
      entry: 'Check-in',
      loadingTasks: 'Loading operational activity...',
      todayBookings: 'Today\'s bookings',
      loadingBookings: 'Loading current bookings...'
    }
  }
};

function setText(selector, value) {
  if (!value) {
    return;
  }

  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
}

function setPlaceholder(selector, value) {
  if (!value) {
    return;
  }

  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute('placeholder', value);
  }
}

function applyCommonTranslations(language) {
  const dictionary = translations.common[language];
  document.documentElement.lang = language;
  setText('.brand-mark', dictionary.brand);
  setText('a[href="index.html"].nav-link', dictionary.navHome);
  setText('a[href="habitaciones.html"].nav-link', dictionary.navRooms);
  setText('a[href="reserva.html"].nav-link', dictionary.navReservation);
  setText('a[href="admin.html"].nav-link', dictionary.navAdmin);
  setText('a[href="acceso.html"].btn', dictionary.navLogin);
}

function applyIndexTranslations(language) {
  const dictionary = translations['index.html'][language];
  document.title = dictionary.title;
  setText('.hero-section .eyebrow', dictionary.heroEyebrow);
  setText('.hero-section .display-title', dictionary.heroTitle);
  setText('.hero-section .lead-copy', dictionary.heroLead);
  setText('.hero-section .btn-brand', dictionary.ctaAvailability);
  setText('.hero-section .btn-outline-brand', dictionary.ctaRooms);
  setText('.hero-panel .mini-label', dictionary.hotelStatusLabel);
  setText('.hero-panel .h4', dictionary.hotelStatusTitle);
  setText('.hero-panel .status-pill', dictionary.hotelStatusToday);
  setText('.hero-panel .metric-card:nth-of-type(1) span', dictionary.metricAvailableRooms);
  setText('.hero-panel .metric-card:nth-of-type(2) span', dictionary.metricMinimumBooking);
  setText('.hero-panel .soft-panel p', dictionary.includesLabel);
  setText('#busqueda .eyebrow', dictionary.searchEyebrow);
  setText('#busqueda .section-title', dictionary.searchTitle);
  setText('#busqueda .text-muted', dictionary.searchLead);
  setText('#busqueda .status-outline', dictionary.searchBadge);
  setText('label[for=""]', '');
  const labels = document.querySelectorAll('#search-form .form-label');
  if (labels[0]) labels[0].textContent = dictionary.labelCheckIn;
  if (labels[1]) labels[1].textContent = dictionary.labelCheckOut;
  if (labels[2]) labels[2].textContent = dictionary.labelGuests;
  const options = document.querySelectorAll('#search-form select option');
  if (options[0]) options[0].textContent = dictionary.optionGuests2;
  if (options[1]) options[1].textContent = dictionary.optionGuests1;
  if (options[2]) options[2].textContent = dictionary.optionGuests3;
  if (options[3]) options[3].textContent = dictionary.optionGuests4;
  setText('#search-form .btn-brand', dictionary.btnSearchRooms);
  setText('.col-lg-4 .eyebrow', dictionary.benefitsEyebrow);
  setText('.col-lg-4 .h4', dictionary.benefitsTitle);
  const benefitItems = document.querySelectorAll('.feature-list li');
  if (benefitItems[0]) benefitItems[0].textContent = dictionary.feature1;
  if (benefitItems[1]) benefitItems[1].textContent = dictionary.feature2;
  if (benefitItems[2]) benefitItems[2].textContent = dictionary.feature3;
  if (benefitItems[3]) benefitItems[3].textContent = dictionary.feature4;
  const cards = document.querySelectorAll('.view-card');
  if (cards[0]) {
    cards[0].querySelector('h3').textContent = dictionary.cardResults;
    cards[0].querySelector('p').textContent = dictionary.cardResultsText;
  }
  if (cards[1]) {
    cards[1].querySelector('h3').textContent = dictionary.cardDetail;
    cards[1].querySelector('p').textContent = dictionary.cardDetailText;
  }
  if (cards[2]) {
    cards[2].querySelector('h3').textContent = dictionary.cardBooking;
    cards[2].querySelector('p').textContent = dictionary.cardBookingText;
  }
  if (cards[3]) {
    cards[3].querySelector('h3').textContent = dictionary.cardAdmin;
    cards[3].querySelector('p').textContent = dictionary.cardAdminText;
  }
}

function applyRoomsTranslations(language) {
  const dictionary = translations['habitaciones.html'][language];
  document.title = dictionary.title;
  setText('a[href="detalle-habitacion.html"].nav-link', dictionary.navDetail);
  setText('main .eyebrow', dictionary.roomsEyebrow);
  setText('main .section-title', dictionary.roomsTitle);
  setText('main .section-title + p', dictionary.roomsLead);
  if (document.querySelector('#search-summary')?.textContent.includes('Cargando')) {
    setText('#search-summary', dictionary.roomsLoadingSummary);
  }
  setText('aside .h5', dictionary.filtersTitle);
  const labels = document.querySelectorAll('aside .form-label');
  if (labels[0]) labels[0].textContent = dictionary.filterCategory;
  if (labels[1]) labels[1].textContent = dictionary.filterPrice;
  const options = document.querySelectorAll('#category-filter option');
  if (options[0]) options[0].textContent = dictionary.filterAll;
  if (options[1]) options[1].textContent = dictionary.filterTourist;
  if (options[2]) options[2].textContent = dictionary.filterPremium;
  if (options[3]) options[3].textContent = dictionary.filterFamily;
  setText('#apply-filters', dictionary.filterApply);
  if (document.querySelector('#rooms-container')?.textContent.includes('Cargando')) {
    setText('#rooms-container .content-card', dictionary.roomsLoading);
  }
}

function applyRoomDetailTranslations(language) {
  const dictionary = translations['detalle-habitacion.html'][language];
  document.title = dictionary.title;
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  if (navLinks[0]) navLinks[0].textContent = dictionary.navBack;
  if (navLinks[1]) navLinks[1].textContent = dictionary.navBooking;
  setText('main .eyebrow', dictionary.eyebrow);
  if (document.querySelector('#room-title')?.textContent.includes('Cargando') || document.querySelector('#room-title')?.textContent.includes('Loading')) {
    setText('#room-title', dictionary.loadingTitle);
  }
  if (document.querySelector('#room-description')?.textContent.includes('consultando') || document.querySelector('#room-description')?.textContent.includes('retrieving')) {
    setText('#room-description', dictionary.loadingDescription);
  }
  const sectionTitles = document.querySelectorAll('.content-card .h5');
  if (sectionTitles[0]) sectionTitles[0].textContent = dictionary.equipmentTitle;
  if (sectionTitles[1]) sectionTitles[1].textContent = dictionary.infoTitle;
  if (document.querySelector('#room-equipment li')?.textContent.includes('Cargando') || document.querySelector('#room-equipment li')?.textContent.includes('Loading')) {
    setText('#room-equipment li', dictionary.equipmentLoading);
  }
  if (document.querySelector('#room-info li')?.textContent.includes('Cargando') || document.querySelector('#room-info li')?.textContent.includes('Loading')) {
    setText('#room-info li', dictionary.infoLoading);
  }
  setText('aside .eyebrow', dictionary.summaryEyebrow);
  if (document.querySelector('#room-price')?.textContent.includes('Cargando') || document.querySelector('#room-price')?.textContent.includes('Loading')) {
    setText('#room-price', dictionary.priceLoading);
  }
  const summaryLabels = document.querySelectorAll('.booking-summary .summary-line span');
  if (summaryLabels[0]) summaryLabels[0].textContent = dictionary.stay;
  if (summaryLabels[1]) summaryLabels[1].textContent = dictionary.totalEstimate;
  if (summaryLabels[2]) summaryLabels[2].textContent = dictionary.deposit;
  setText('#reserve-link', dictionary.reserveButton);
}

function applyAuthTranslations(language) {
  const dictionary = translations['acceso.html'][language];
  document.title = dictionary.title;
  setText('.auth-panel .eyebrow', dictionary.eyebrow);
  setText('.auth-panel .display-title', dictionary.heading);
  setText('.auth-panel .text-white-50.mb-0', dictionary.lead);
  setText('.alert-info strong', dictionary.demoTitle);
  const tabs = document.querySelectorAll('.auth-tabs .nav-link');
  if (tabs[0]) tabs[0].textContent = dictionary.loginTab;
  if (tabs[1]) tabs[1].textContent = dictionary.registerTab;
  const loginLabels = document.querySelectorAll('#login-form .form-label');
  if (loginLabels[0]) loginLabels[0].textContent = dictionary.email;
  if (loginLabels[1]) loginLabels[1].textContent = dictionary.password;
  if (loginLabels[2]) loginLabels[2].textContent = dictionary.role;
  const roleOptions = document.querySelectorAll('#login-form select option');
  if (roleOptions[0]) roleOptions[0].textContent = dictionary.roleClient;
  if (roleOptions[1]) roleOptions[1].textContent = dictionary.roleAdmin;
  if (roleOptions[2]) roleOptions[2].textContent = dictionary.roleStaff;
  setText('#login-form button', dictionary.loginButton);
  const registerLabels = document.querySelectorAll('#register-form .form-label');
  if (registerLabels[0]) registerLabels[0].textContent = dictionary.firstName;
  if (registerLabels[1]) registerLabels[1].textContent = dictionary.lastName;
  if (registerLabels[2]) registerLabels[2].textContent = dictionary.emailShort;
  if (registerLabels[3]) registerLabels[3].textContent = dictionary.phone;
  if (registerLabels[4]) registerLabels[4].textContent = dictionary.document;
  if (registerLabels[5]) registerLabels[5].textContent = dictionary.password;
  setPlaceholder('#register-form input[name="password"]', dictionary.placeholderSecurePassword);
  setText('#register-form button', dictionary.registerButton);
}

function applyReservationTranslations(language) {
  const dictionary = translations['reserva.html'][language];
  document.title = dictionary.title;
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  if (navLinks[0]) navLinks[0].textContent = dictionary.navRoom;
  if (navLinks[1]) navLinks[1].textContent = dictionary.navBooking;
  if (navLinks[2]) navLinks[2].textContent = dictionary.navConfirmation;
  setText('main > .d-flex .eyebrow', dictionary.eyebrow);
  setText('main > .d-flex .section-title', dictionary.heading);
  setText('main > .d-flex .text-muted', dictionary.lead);
  setText('main > .d-flex .status-outline', dictionary.badge);
  setText('.content-card .h4', dictionary.formTitle);
  const authNotice = document.querySelector('#reservation-auth-notice');
  if (authNotice) {
    authNotice.childNodes[0].textContent = `${dictionary.authNotice} `;
    const link = authNotice.querySelector('a');
    if (link) link.textContent = dictionary.authNoticeLink;
  }
  const labels = document.querySelectorAll('#reservation-form .form-label');
  if (labels[0]) labels[0].textContent = dictionary.checkIn;
  if (labels[1]) labels[1].textContent = dictionary.checkOut;
  if (labels[2]) labels[2].textContent = dictionary.guestName;
  if (labels[3]) labels[3].textContent = dictionary.email;
  if (labels[4]) labels[4].textContent = dictionary.guests;
  if (labels[5]) labels[5].textContent = dictionary.paymentMethod;
  if (labels[6]) labels[6].textContent = dictionary.observations;
  const paymentOptions = document.querySelectorAll('select[name="paymentMethod"] option');
  if (paymentOptions[0]) paymentOptions[0].textContent = dictionary.paymentCard;
  if (paymentOptions[1]) paymentOptions[1].textContent = dictionary.paymentTransfer;
  if (paymentOptions[2]) paymentOptions[2].textContent = dictionary.paymentWebpay;
  if (paymentOptions[3]) paymentOptions[3].textContent = dictionary.paymentCash;
  setPlaceholder('textarea[name="observations"]', dictionary.observationsPlaceholder);
  setText('#reservation-form button', dictionary.confirmButton);
  setText('.booking-summary .eyebrow', dictionary.summaryEyebrow);
  if (document.querySelector('#summary-room-name')?.textContent.includes('Habitacion seleccionada') || document.querySelector('#summary-room-name')?.textContent.includes('Selected room')) {
    setText('#summary-room-name', dictionary.summaryRoom);
  }
  const summaryLabels = document.querySelectorAll('.booking-summary .summary-line span');
  if (summaryLabels[1]) summaryLabels[1].textContent = dictionary.taxes;
  if (summaryLabels[2]) summaryLabels[2].textContent = dictionary.deposit;
  if (summaryLabels[3]) summaryLabels[3].textContent = dictionary.pending;
  setText('.soft-panel .fw-semibold', dictionary.validationsTitle);
  if (document.querySelector('#reservation-validations li')?.textContent.includes('Cargando') || document.querySelector('#reservation-validations li')?.textContent.includes('Loading')) {
    setText('#reservation-validations li', dictionary.validationsLoading);
  }
}

function applyConfirmationTranslations(language) {
  const dictionary = translations['confirmacion.html'][language];
  document.title = dictionary.title;
  setText('.confirmation-card .eyebrow', dictionary.eyebrow);
  if (document.querySelector('#confirmation-title')?.textContent.includes('Cargando') || document.querySelector('#confirmation-title')?.textContent.includes('Loading')) {
    setText('#confirmation-title', dictionary.loadingTitle);
  }
  setText('.confirmation-copy', dictionary.lead);
  setText('#confirmation-summary .h5', dictionary.summaryTitle);
  const loadingLine = document.querySelector('#confirmation-summary .summary-line span');
  if (loadingLine) loadingLine.textContent = dictionary.summaryLoadingState;
  const loadingStrong = document.querySelector('#confirmation-summary .summary-line strong');
  if (loadingStrong && (loadingStrong.textContent.includes('Consultando') || loadingStrong.textContent.includes('Checking'))) {
    loadingStrong.textContent = dictionary.summaryLoadingText;
  }
  if (document.querySelector('#confirmation-qr-text')?.textContent.includes('Codigo para validacion') || document.querySelector('#confirmation-qr-text')?.textContent.includes('Code for booking validation')) {
    setText('#confirmation-qr-text', dictionary.qrText);
  }
  const buttons = document.querySelectorAll('.confirmation-card .btn');
  if (buttons[0]) buttons[0].textContent = dictionary.backHome;
  if (buttons[1]) buttons[1].textContent = dictionary.admin;
}

function applyAdminTranslations(language) {
  const dictionary = translations['admin.html'][language];
  document.title = dictionary.title;
  setText('.sidebar-label', dictionary.sidebar);
  const navItems = document.querySelectorAll('.dashboard-nav a');
  if (navItems[0]) navItems[0].textContent = dictionary.menuReservations;
  if (navItems[1]) navItems[1].textContent = dictionary.menuClients;
  if (navItems[2]) navItems[2].textContent = dictionary.menuWorkers;
  if (navItems[3]) navItems[3].textContent = dictionary.menuCatalog;
  if (navItems[4]) navItems[4].textContent = dictionary.menuPrices;
  if (navItems[5]) navItems[5].textContent = dictionary.menuReports;
  setText('section .eyebrow', dictionary.eyebrow);
  setText('section .section-title', dictionary.heading);
  setText('section .section-title + p', dictionary.lead);
  setText('section .btn-outline-brand', dictionary.workerView);
  const metrics = document.querySelectorAll('.dashboard-metric span');
  if (metrics[0]) metrics[0].textContent = dictionary.activeBookings;
  if (metrics[1]) metrics[1].textContent = dictionary.checkInToday;
  if (metrics[2]) metrics[2].textContent = dictionary.occupancy;
  if (metrics[3]) metrics[3].textContent = dictionary.estimatedIncome;
  setText('.col-lg-7 .h5', dictionary.recentBookings);
  setText('.col-lg-7 .btn-light', dictionary.filter);
  const reservationHeaders = document.querySelectorAll('.col-lg-7 th');
  if (reservationHeaders[0]) reservationHeaders[0].textContent = dictionary.code;
  if (reservationHeaders[1]) reservationHeaders[1].textContent = dictionary.client;
  if (reservationHeaders[2]) reservationHeaders[2].textContent = dictionary.dates;
  if (reservationHeaders[3]) reservationHeaders[3].textContent = dictionary.status;
  if (document.querySelector('#admin-reservations-body td')?.textContent.includes('Cargando')) {
    setText('#admin-reservations-body td', dictionary.loadingBookings);
  }
  const rightTitle = document.querySelector('.col-lg-5 .h5');
  if (rightTitle) rightTitle.textContent = dictionary.roomCatalog;
  setText('.col-lg-5 .status-outline', dictionary.quickAdd);
  const labels = document.querySelectorAll('#admin-room-form .form-label');
  if (labels[0]) labels[0].textContent = dictionary.roomNumber;
  if (labels[1]) labels[1].textContent = dictionary.roomName;
  if (labels[2]) labels[2].textContent = dictionary.category;
  if (labels[3]) labels[3].textContent = dictionary.capacity;
  if (labels[4]) labels[4].textContent = dictionary.status;
  if (labels[5]) labels[5].textContent = dictionary.dailyPrice;
  if (labels[6]) labels[6].textContent = dictionary.mainImageUrl;
  if (labels[7]) labels[7].textContent = dictionary.description;
  const statusOptions = document.querySelectorAll('#room-status option');
  if (statusOptions[0]) statusOptions[0].textContent = dictionary.statusAvailable;
  if (statusOptions[1]) statusOptions[1].textContent = dictionary.statusOccupied;
  if (statusOptions[2]) statusOptions[2].textContent = dictionary.statusMaintenance;
  if (statusOptions[3]) statusOptions[3].textContent = dictionary.statusInactive;
  setText('#admin-room-form button', dictionary.addRoom);
  setText('#cancel-room-edit', dictionary.cancelEdit);
  setText('.soft-panel .fw-semibold', dictionary.recentRooms);
  const roomHeaders = document.querySelectorAll('.soft-panel th');
  if (roomHeaders[0]) roomHeaders[0].textContent = dictionary.roomNumber;
  if (roomHeaders[1]) roomHeaders[1].textContent = dictionary.category;
  if (roomHeaders[2]) roomHeaders[2].textContent = dictionary.status;
  if (roomHeaders[3]) roomHeaders[3].textContent = dictionary.price;
  if (roomHeaders[4]) roomHeaders[4].textContent = dictionary.actions;
  if (document.querySelector('#admin-rooms-body td')?.textContent.includes('Cargando')) {
    setText('#admin-rooms-body td', dictionary.loadingCatalog);
  }
}

function applyStaffTranslations(language) {
  const dictionary = translations['trabajador.html'][language];
  document.title = dictionary.title;
  setText('main .eyebrow', dictionary.eyebrow);
  setText('main .section-title', dictionary.heading);
  setText('main .section-title + p', dictionary.lead);
  setText('main .btn-outline-brand', dictionary.backAdmin);
  const titles = document.querySelectorAll('.content-card .h5');
  if (titles[0]) titles[0].textContent = dictionary.calendarTitle;
  if (titles[1]) titles[1].textContent = dictionary.dailyTasks;
  if (titles[2]) titles[2].textContent = dictionary.todayBookings;
  const headers = document.querySelectorAll('.modern-table th');
  if (headers[0]) headers[0].textContent = dictionary.room;
  if (headers[1]) headers[1].textContent = dictionary.client;
  if (headers[2]) headers[2].textContent = dictionary.observation;
  if (headers[3]) headers[3].textContent = dictionary.entry;
  if (document.querySelector('#worker-tasks td')?.textContent.includes('Cargando')) {
    setText('#worker-tasks td', dictionary.loadingTasks);
  }
  if (document.querySelector('#worker-reservations .soft-panel')?.textContent.includes('Cargando')) {
    setText('#worker-reservations .soft-panel', dictionary.loadingBookings);
  }
}

function injectLanguageSwitch(language) {
  if (document.querySelector('#language-switcher')) {
    return;
  }

  const commonDictionary = translations.common[language];
  const wrapper = document.createElement('div');
  wrapper.id = 'language-switcher';
  wrapper.className = 'language-switcher';
  wrapper.innerHTML = `
    <span class="language-switcher__label">${commonDictionary.languageLabel}</span>
    <button type="button" class="language-switcher__btn ${language === 'es' ? 'is-active' : ''}" data-language="es">${commonDictionary.languageOptionEs}</button>
    <button type="button" class="language-switcher__btn ${language === 'en' ? 'is-active' : ''}" data-language="en">${commonDictionary.languageOptionEn}</button>
  `;
  document.body.appendChild(wrapper);

  wrapper.addEventListener('click', (event) => {
    const button = event.target.closest('[data-language]');
    if (!button) {
      return;
    }

    setLanguage(button.dataset.language);
    window.location.reload();
  });
}

function updateNavForSession() {
  const user = getCurrentUser();
  const authLinkItem = document.querySelector('a[href="acceso.html"].btn')?.parentElement;
  if (!authLinkItem) return;

  const lang = getLanguage();
  const logoutLabel = lang === 'en' ? 'Sign out' : 'Salir';

  if (user) {
    authLinkItem.innerHTML = `
      <span class="nav-user-name ms-lg-3 text-muted small fw-semibold">${user.nombre}</span>
      <button class="btn btn-outline-brand ms-2" id="nav-logout-btn" type="button">${logoutLabel}</button>
    `;
    document.getElementById('nav-logout-btn')?.addEventListener('click', () => {
      clearCurrentUser();
      window.location.href = 'index.html';
    });
  }
}

function applyTranslations() {
  const language = getLanguage();
  applyCommonTranslations(language);
  if (pageKey === 'index.html') {
    applyIndexTranslations(language);
  }
  if (pageKey === 'habitaciones.html') {
    applyRoomsTranslations(language);
  }
  if (pageKey === 'detalle-habitacion.html') {
    applyRoomDetailTranslations(language);
  }
  if (pageKey === 'acceso.html') {
    applyAuthTranslations(language);
  }
  if (pageKey === 'reserva.html') {
    applyReservationTranslations(language);
  }
  if (pageKey === 'confirmacion.html') {
    applyConfirmationTranslations(language);
  }
  if (pageKey === 'admin.html') {
    applyAdminTranslations(language);
  }
  if (pageKey === 'trabajador.html') {
    applyStaffTranslations(language);
  }
  injectLanguageSwitch(language);
  updateNavForSession();
}

applyTranslations();