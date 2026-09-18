/**
 * Digital Content Organizer (DigitalVault)
 * Main Application Logic & UI Controller
 * 
 * Supports:
 * 1. Multi-view SPA navigation (Dashboard, My Content, Add Content).
 * 2. Add Content page with dynamic type switcher (Document, Image, Video, Link, Note).
 * 3. Drag-and-drop dropzones with local previews and file removal.
 * 4. Interactive Tag Chip input with Enter/comma separation and backspace deletion.
 * 5. Large distraction-free Note writing editor with real-time character/word count.
 * 6. Frontend validation with clear inline error indicators.
 * 7. Saving content into local mock store with localStorage persistence and redirect to My Content.
 * 8. Card actions: Open, Edit, Delete, Favorite toggle, live search, and sorting.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentView: 'dashboard', // 'dashboard' | 'my-content' | 'add-content' | 'content-details' | 'categories' | 'favorites'
    currentDetailsId: null,
    // Dashboard state
    dashboardSearch: '',
    dashboardCategory: 'all',
    dashboardType: 'all',
    // My Content state
    librarySearch: '',
    libraryCategory: 'all',
    libraryType: 'all',
    librarySort: 'recent',
    activeDropdownId: null,
    // New Category Modal state
    selectedCategoryIcon: 'code'
  };

  // Add Content Form Specific State
  const addFormState = {
    type: 'document',
    tags: [],
    isFavorite: false,
    documentFile: null,
    imageFile: null,
    imagePreviewUrl: null,
    videoFile: null
  };

  // DOM Element References
  const elements = {
    // Views
    dashboardView: document.getElementById('dashboardView'),
    myContentView: document.getElementById('myContentView'),
    addContentView: document.getElementById('addContentView'),
    contentDetailsView: document.getElementById('contentDetailsView'),
    contentDetailsWrapper: document.getElementById('contentDetailsWrapper'),
    categoriesView: document.getElementById('categoriesView'),
    categoriesPageGrid: document.getElementById('categoriesPageGrid'),
    newCategoryBtn: document.getElementById('newCategoryBtn'),
    favoritesView: document.getElementById('favoritesView'),
    favoritesGrid: document.getElementById('favoritesGrid'),
    favoritesCountBadge: document.getElementById('favoritesCountBadge'),

    // Topbar & Navigation
    greetingText: document.getElementById('greetingText'),
    searchInput: document.getElementById('searchInput'),
    sidebarNavLinks: document.querySelectorAll('.nav-item-link'),
    navDashboard: document.getElementById('navDashboard'),
    navMyContent: document.getElementById('navMyContent'),
    navFavorites: document.getElementById('navFavorites'),
    navCategories: document.getElementById('navCategories'),
    navCountBadge: document.querySelector('#navMyContent .nav-count-badge'),
    navFavoritesBadge: document.getElementById('navFavoritesBadge'),
    navCategoriesBadge: document.getElementById('navCategoriesBadge'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    sidebarCloseBtn: document.getElementById('sidebarCloseBtn'),
    sidebar: document.getElementById('sidebar'),
    sidebarBackdrop: document.getElementById('sidebarBackdrop'),

    // Dashboard View Elements
    statsContainer: document.getElementById('statsContainer'),
    categoriesContainer: document.getElementById('categoriesContainer'),
    contentGrid: document.getElementById('contentGrid'),
    contentCountBadge: document.getElementById('contentCountBadge'),
    dashboardFilterPills: document.querySelectorAll('#recentContentSection .filter-pill'),
    addContentBtn: document.getElementById('addContentBtn'),

    // My Content View Elements
    libraryAddContentBtn: document.getElementById('libraryAddContentBtn'),
    librarySearchInput: document.getElementById('librarySearchInput'),
    librarySearchClearBtn: document.getElementById('librarySearchClearBtn'),
    libraryFilterPills: document.querySelectorAll('#libraryFilterPills .filter-pill'),
    librarySortSelect: document.getElementById('librarySortSelect'),
    libraryContentGrid: document.getElementById('libraryContentGrid'),
    myContentCategoryBanner: document.getElementById('myContentCategoryBanner'),
    categoryBannerIcon: document.getElementById('categoryBannerIcon'),
    categoryBannerName: document.getElementById('categoryBannerName'),
    categoryBannerCount: document.getElementById('categoryBannerCount'),
    clearCategoryBannerBtn: document.getElementById('clearCategoryBannerBtn'),

    // Add Content Page Elements
    backToMyContentBtn: document.getElementById('backToMyContentBtn'),
    addTypeSelector: document.getElementById('addTypeSelector'),
    typeSelectorBtns: document.querySelectorAll('#addTypeSelector .type-selector-btn'),
    addPageForm: document.getElementById('addPageForm'),
    cancelAddPageBtn: document.getElementById('cancelAddPageBtn'),
    submitAddPageBtn: document.getElementById('submitAddPageBtn'),

    // Type Specific Blocks & Dropzones
    documentFieldBlock: document.getElementById('documentFieldBlock'),
    documentDropzone: document.getElementById('documentDropzone'),
    documentFileInput: document.getElementById('documentFileInput'),
    documentFileInfo: document.getElementById('documentFileInfo'),
    docFileName: document.getElementById('docFileName'),
    docFileSize: document.getElementById('docFileSize'),
    docFileRemoveBtn: document.getElementById('docFileRemoveBtn'),

    imageFieldBlock: document.getElementById('imageFieldBlock'),
    imageDropzone: document.getElementById('imageDropzone'),
    imageFileInput: document.getElementById('imageFileInput'),
    imagePreviewContainer: document.getElementById('imagePreviewContainer'),
    imagePreviewImg: document.getElementById('imagePreviewImg'),
    imagePreviewRemoveBtn: document.getElementById('imagePreviewRemoveBtn'),

    videoFieldBlock: document.getElementById('videoFieldBlock'),
    videoDropzone: document.getElementById('videoDropzone'),
    videoFileInput: document.getElementById('videoFileInput'),
    videoFileInfo: document.getElementById('videoFileInfo'),
    videoFileName: document.getElementById('videoFileName'),
    videoFileSize: document.getElementById('videoFileSize'),
    videoFileRemoveBtn: document.getElementById('videoFileRemoveBtn'),

    linkFieldBlock: document.getElementById('linkFieldBlock'),
    addLinkUrl: document.getElementById('addLinkUrl'),
    linkUrlError: document.getElementById('linkUrlError'),

    noteFieldBlock: document.getElementById('noteFieldBlock'),
    addNoteContent: document.getElementById('addNoteContent'),
    noteCharCounter: document.getElementById('noteCharCounter'),
    noteContentError: document.getElementById('noteContentError'),

    // Common Form Fields
    addPageTitle: document.getElementById('addPageTitle'),
    titleError: document.getElementById('titleError'),
    addPageCategory: document.getElementById('addPageCategory'),
    categoryError: document.getElementById('categoryError'),
    tagChipWrapper: document.getElementById('tagChipWrapper'),
    addTagInput: document.getElementById('addTagInput'),
    secondaryUrlGroup: document.getElementById('secondaryUrlGroup'),
    addSecondaryUrl: document.getElementById('addSecondaryUrl'),
    addPageDescription: document.getElementById('addPageDescription'),
    addFavoriteToggleCard: document.getElementById('addFavoriteToggleCard'),

    // Edit Modal Dialog Elements
    modalOverlay: document.getElementById('modalOverlay'),
    modalTitle: document.getElementById('modalTitle'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalCancelBtn: document.getElementById('modalCancelBtn'),
    modalSubmitBtn: document.getElementById('modalSubmitBtn'),
    addContentForm: document.getElementById('addContentForm'),
    contentEditId: document.getElementById('contentEditId'),

    // New Category Modal Elements
    newCategoryModal: document.getElementById('newCategoryModal'),
    closeNewCategoryModalBtn: document.getElementById('closeNewCategoryModalBtn'),
    cancelNewCategoryBtn: document.getElementById('cancelNewCategoryBtn'),
    newCategoryForm: document.getElementById('newCategoryForm'),
    categoryNameInput: document.getElementById('categoryNameInput'),
    categoryNameError: document.getElementById('categoryNameError'),
    iconPickerGrid: document.getElementById('iconPickerGrid'),
    selectedCategoryIconInput: document.getElementById('selectedCategoryIcon'),
    categoryDescInput: document.getElementById('categoryDescInput'),

    // Content Details Modal Elements
    contentDetailsModal: document.getElementById('contentDetailsModal'),
    contentDetailsModalDialog: document.getElementById('contentDetailsModalDialog'),
    detailsModalTypeBadge: document.getElementById('detailsModalTypeBadge'),
    detailsModalCategoryBadge: document.getElementById('detailsModalCategoryBadge'),
    detailsModalFavBtn: document.getElementById('detailsModalFavBtn'),
    closeDetailsModalBtn: document.getElementById('closeDetailsModalBtn'),
    detailsModalBody: document.getElementById('detailsModalBody'),
    closeDetailsModalFooterBtn: document.getElementById('closeDetailsModalFooterBtn'),
    openFullPageDetailsBtn: document.getElementById('openFullPageDetailsBtn'),

    // Toast Container
    toastContainer: document.getElementById('toastContainer')
  };

  // ==========================================================================
  // SVG Icon Templates
  // ==========================================================================
  const ICONS = {
    document: `<svg class="type-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`,
    note: `<svg class="type-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3z"/><path d="M15 3v6h6"/><path d="M10 13h4"/><path d="M10 17h4"/></svg>`,
    video: `<svg class="type-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
    link: `<svg class="type-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    image: `<svg class="type-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
    code: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    bookOpen: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    briefcase: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    folderGit: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><circle cx="12" cy="13" r="2"/></svg>`,
    palette: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
    user: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    clock: `<svg class="card-date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    star: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    externalLink: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    check: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    moreVertical: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`,
    openIcon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    editIcon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`,
    trashIcon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
    download: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    maximize: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
    chevronLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
    chevronRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
    zoomIn: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
    zoomOut: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
    copy: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="13" height="13" x="9" y="9" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`
  };

  const getCategoryIconSvg = (iconName) => {
    switch (iconName) {
      case 'code': return ICONS.code;
      case 'book-open': return ICONS.bookOpen;
      case 'briefcase': return ICONS.briefcase;
      case 'folder-git': return ICONS.folderGit;
      case 'palette': return ICONS.palette;
      case 'user': return ICONS.user;
      default: return ICONS.code;
    }
  };

  // Helper to format byte sizes
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // ==========================================================================
  // Dynamic Greeting based on local time
  // ==========================================================================
  const updateGreeting = () => {
    const hour = new Date().getHours();
    let greeting = 'Good morning, Om 👋';
    if (hour >= 12 && hour < 17) {
      greeting = 'Good afternoon, Om 👋';
    } else if (hour >= 17 || hour < 5) {
      greeting = 'Good evening, Om 👋';
    }
    if (elements.greetingText) {
      elements.greetingText.textContent = greeting;
    }
  };

  // ==========================================================================
  // SPA View Routing (Dashboard, My Content, Add Content, Categories, Favorites)
  // ==========================================================================
  const switchView = (viewName, itemId = null) => {
    state.currentView = viewName;
    state.activeDropdownId = null;

    // Hide all views first
    if (elements.dashboardView) elements.dashboardView.classList.add('hidden');
    if (elements.myContentView) elements.myContentView.classList.add('hidden');
    if (elements.addContentView) elements.addContentView.classList.add('hidden');
    if (elements.contentDetailsView) elements.contentDetailsView.classList.add('hidden');
    if (elements.categoriesView) elements.categoriesView.classList.add('hidden');
    if (elements.favoritesView) elements.favoritesView.classList.add('hidden');

    elements.sidebarNavLinks.forEach(link => link.classList.remove('active'));

    if (viewName === 'my-content') {
      if (elements.myContentView) elements.myContentView.classList.remove('hidden');
      if (elements.navMyContent) elements.navMyContent.classList.add('active');
      renderMyContent();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'add-content') {
      if (elements.addContentView) elements.addContentView.classList.remove('hidden');
      if (elements.navMyContent) elements.navMyContent.classList.add('active');
      // Focus title input
      setTimeout(() => {
        if (elements.addPageTitle) elements.addPageTitle.focus();
      }, 50);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'content-details') {
      if (elements.contentDetailsView) elements.contentDetailsView.classList.remove('hidden');
      if (elements.navMyContent) elements.navMyContent.classList.add('active');
      state.currentDetailsId = itemId;
      renderContentDetails(itemId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'categories') {
      if (elements.categoriesView) elements.categoriesView.classList.remove('hidden');
      if (elements.navCategories) elements.navCategories.classList.add('active');
      renderCategoriesPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'favorites') {
      if (elements.favoritesView) elements.favoritesView.classList.remove('hidden');
      if (elements.navFavorites) elements.navFavorites.classList.add('active');
      renderFavoritesPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Default: dashboard
      if (elements.dashboardView) elements.dashboardView.classList.remove('hidden');
      if (elements.navDashboard) elements.navDashboard.classList.add('active');
      renderStats();
      renderCategories();
      renderRecentContent();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    updateSidebarBadges();
  };

  const handleRoute = () => {
    const rawHash = window.location.hash;
    const lowerHash = rawHash.toLowerCase();

    if (lowerHash.startsWith('#content-details')) {
      const queryPart = rawHash.split('?')[1] || '';
      const params = new URLSearchParams(queryPart);
      const itemId = params.get('id');
      switchView('content-details', itemId);
    } else if (lowerHash.startsWith('#my-content')) {
      const queryPart = rawHash.split('?')[1] || '';
      const params = new URLSearchParams(queryPart);
      const catParam = params.get('category');
      if (catParam) {
        state.libraryCategory = catParam;
      }
      switchView('my-content');
    } else if (lowerHash.startsWith('#add-content')) {
      const queryPart = rawHash.split('?')[1] || '';
      const params = new URLSearchParams(queryPart);
      const catParam = params.get('category');
      if (catParam && elements.addPageCategory) {
        elements.addPageCategory.value = catParam;
      }
      switchView('add-content');
    } else if (lowerHash === '#favorites') {
      switchView('favorites');
    } else if (lowerHash === '#categories') {
      switchView('categories');
    } else {
      switchView('dashboard');
    }
  };

  window.addEventListener('hashchange', handleRoute);

  // Sync sidebar items count badge
  const updateSidebarBadges = () => {
    const stats = window.dataStore.getStats();
    if (elements.navCountBadge) {
      elements.navCountBadge.textContent = stats.total;
    }
    if (elements.navFavoritesBadge) {
      elements.navFavoritesBadge.textContent = stats.favorites;
    }
    if (elements.navCategoriesBadge) {
      elements.navCategoriesBadge.textContent = stats.categoriesCount;
    }
  };

  // ==========================================================================
  // Render Statistics Cards (Dashboard)
  // ==========================================================================
  const renderStats = () => {
    if (!elements.statsContainer) return;
    const stats = window.dataStore.getStats();

    const statDefinitions = [
      {
        key: 'total',
        label: 'Total Content',
        value: stats.total,
        typeClass: 'total',
        trend: '+4 this week',
        icon: `<svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`
      },
      {
        key: 'document',
        label: 'Documents',
        value: stats.documents,
        typeClass: 'document',
        trend: 'PDFs, Docs',
        icon: ICONS.document
      },
      {
        key: 'image',
        label: 'Images',
        value: stats.images,
        typeClass: 'image',
        trend: 'Screenshots, SVGs',
        icon: ICONS.image
      },
      {
        key: 'video',
        label: 'Videos',
        value: stats.videos,
        typeClass: 'video',
        trend: 'Guides & Talks',
        icon: ICONS.video
      },
      {
        key: 'note',
        label: 'Notes',
        value: stats.notes,
        typeClass: 'note',
        trend: 'Markdown, Quick',
        icon: ICONS.note
      }
    ];

    elements.statsContainer.innerHTML = statDefinitions.map(stat => `
      <div class="stat-card" data-stat-type="${stat.key}">
        <div class="stat-top">
          <div class="stat-icon-wrapper ${stat.typeClass}">
            ${stat.icon}
          </div>
          <span class="stat-trend">${stat.trend}</span>
        </div>
        <div class="stat-content">
          <span class="stat-value">${stat.value}</span>
          <span class="stat-label">${stat.label}</span>
        </div>
      </div>
    `).join('');
  };

  // ==========================================================================
  // Utility & Helper Functions
  // ==========================================================================
  const escapeHtml = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const CATEGORY_ICONS = [
    { key: 'code', emoji: '💻', label: 'Coding' },
    { key: 'book-open', emoji: '📚', label: 'Study' },
    { key: 'briefcase', emoji: '💼', label: 'Career' },
    { key: 'folder-git', emoji: '🚀', label: 'Projects' },
    { key: 'palette', emoji: '🎨', label: 'Design' },
    { key: 'user', emoji: '👤', label: 'Personal' },
    { key: 'zap', emoji: '⚡', label: 'Productivity' },
    { key: 'flask', emoji: '🔬', label: 'Research' },
    { key: 'music', emoji: '🎵', label: 'Media' },
    { key: 'lightbulb', emoji: '💡', label: 'Ideas' },
    { key: 'globe', emoji: '🌐', label: 'Web' },
    { key: 'lock', emoji: '🔒', label: 'Security' }
  ];

  const getCategoryEmojiForName = (catName) => {
    if (!catName || catName === 'all') return '📁';
    const categories = window.dataStore.getCategories();
    const cat = categories.find(c => 
      c.name.toLowerCase() === catName.toLowerCase() || 
      c.id === catName.toLowerCase()
    );
    if (!cat) return '📁';
    const iconObj = CATEGORY_ICONS.find(ci => ci.key === cat.icon);
    return iconObj ? iconObj.emoji : (cat.icon && cat.icon.length <= 2 ? cat.icon : '📁');
  };

  const populateCategoryDropdowns = (selectedCategory = null) => {
    const categories = window.dataStore.getCategories();
    const selects = [elements.addPageCategory, document.getElementById('contentCategory')].filter(Boolean);

    selects.forEach(select => {
      const currentVal = selectedCategory || select.value;
      select.innerHTML = categories.map(cat => 
        `<option value="${escapeHtml(cat.name)}" ${currentVal === cat.name ? 'selected' : ''}>${escapeHtml(cat.name)}</option>`
      ).join('');
    });
  };

  const renderIconPicker = () => {
    if (!elements.iconPickerGrid) return;
    elements.iconPickerGrid.innerHTML = CATEGORY_ICONS.map(item => `
      <div class="icon-picker-item ${state.selectedCategoryIcon === item.key ? 'active' : ''}" data-icon-key="${item.key}" title="${item.label}">
        <span>${item.emoji}</span>
      </div>
    `).join('');

    elements.iconPickerGrid.querySelectorAll('.icon-picker-item').forEach(tile => {
      tile.addEventListener('click', () => {
        state.selectedCategoryIcon = tile.getAttribute('data-icon-key');
        if (elements.selectedCategoryIconInput) {
          elements.selectedCategoryIconInput.value = state.selectedCategoryIcon;
        }
        renderIconPicker();
      });
    });
  };

  const openNewCategoryModal = () => {
    state.selectedCategoryIcon = 'code';
    if (elements.newCategoryForm) elements.newCategoryForm.reset();
    if (elements.categoryNameError) elements.categoryNameError.style.display = 'none';
    if (elements.selectedCategoryIconInput) elements.selectedCategoryIconInput.value = 'code';
    renderIconPicker();
    if (elements.newCategoryModal) {
      elements.newCategoryModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        if (elements.categoryNameInput) elements.categoryNameInput.focus();
      }, 50);
    }
  };

  const closeNewCategoryModal = () => {
    if (elements.newCategoryModal) {
      elements.newCategoryModal.classList.remove('active');
      document.body.style.overflow = '';
    }
    if (elements.newCategoryForm) elements.newCategoryForm.reset();
    if (elements.categoryNameError) elements.categoryNameError.style.display = 'none';
  };

  // Wire up New Category Modal events
  if (elements.newCategoryBtn) elements.newCategoryBtn.addEventListener('click', openNewCategoryModal);
  if (elements.closeNewCategoryModalBtn) elements.closeNewCategoryModalBtn.addEventListener('click', closeNewCategoryModal);
  if (elements.cancelNewCategoryBtn) elements.cancelNewCategoryBtn.addEventListener('click', closeNewCategoryModal);
  if (elements.newCategoryModal) {
    elements.newCategoryModal.addEventListener('click', (e) => {
      if (e.target === elements.newCategoryModal) closeNewCategoryModal();
    });
  }

  if (elements.newCategoryForm) {
    elements.newCategoryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = elements.categoryNameInput ? elements.categoryNameInput.value.trim() : '';
      const desc = elements.categoryDescInput ? elements.categoryDescInput.value.trim() : '';
      const iconKey = state.selectedCategoryIcon || 'code';

      if (!name) {
        if (elements.categoryNameError) {
          elements.categoryNameError.textContent = 'Category name is required.';
          elements.categoryNameError.style.display = 'block';
        }
        if (elements.categoryNameInput) elements.categoryNameInput.focus();
        return;
      }

      // Check duplicates
      const existing = window.dataStore.getCategories();
      const isDup = existing.some(c => c.name.toLowerCase() === name.toLowerCase());
      if (isDup) {
        if (elements.categoryNameError) {
          elements.categoryNameError.textContent = `A category named "${name}" already exists.`;
          elements.categoryNameError.style.display = 'block';
        }
        if (elements.categoryNameInput) elements.categoryNameInput.focus();
        return;
      }

      try {
        const newCat = window.dataStore.addCategory({
          name,
          icon: iconKey,
          description: desc
        });
        closeNewCategoryModal();
        populateCategoryDropdowns(newCat.name);
        showToast(`Category "${newCat.name}" created!`);
        if (state.currentView === 'categories') {
          renderCategoriesPage();
        }
      } catch (err) {
        if (elements.categoryNameError) {
          elements.categoryNameError.textContent = err.message;
          elements.categoryNameError.style.display = 'block';
        }
      }
    });
  }

  // Clear Category Filter Banner Button in My Content
  if (elements.clearCategoryBannerBtn) {
    elements.clearCategoryBannerBtn.addEventListener('click', () => {
      state.libraryCategory = 'all';
      if (elements.myContentCategoryBanner) elements.myContentCategoryBanner.classList.add('hidden');
      window.location.hash = 'my-content';
      renderMyContent();
    });
  }

  const navigateToCategoryLibrary = (catName) => {
    state.libraryCategory = catName;
    window.location.hash = `my-content?category=${encodeURIComponent(catName)}`;
  };

  // Content Details Modal Open / Close
  const openDetailsModal = (itemId) => {
    const item = window.dataStore.getItem(itemId);
    if (!item || !elements.contentDetailsModal) return;

    state.currentDetailsId = itemId;

    // Badges & Actions
    if (elements.detailsModalTypeBadge) {
      elements.detailsModalTypeBadge.className = `type-badge ${item.type}`;
      elements.detailsModalTypeBadge.innerHTML = `${ICONS[item.type] || ICONS.document} ${item.resourceType || item.type}`;
    }

    if (elements.detailsModalCategoryBadge) {
      elements.detailsModalCategoryBadge.textContent = item.category;
    }

    if (elements.detailsModalFavBtn) {
      elements.detailsModalFavBtn.classList.toggle('active', Boolean(item.isFavorite));
      elements.detailsModalFavBtn.onclick = (e) => {
        e.stopPropagation();
        const updated = window.dataStore.toggleFavorite(item.id);
        if (updated) {
          elements.detailsModalFavBtn.classList.toggle('active', updated.isFavorite);
          showToast(updated.isFavorite ? 'Added to Favorites' : 'Removed from Favorites');
        }
      };
    }

    const isExternal = item.storageType === 'external' || item.type === 'link' || item.type === 'video' || (item.url && item.type !== 'document');

    const tagsHtml = item.tags && item.tags.length > 0
      ? item.tags.map(tag => `<span class="tag-pill">#${escapeHtml(tag)}</span>`).join('')
      : '<span style="color:var(--text-muted); font-size:var(--text-xs); font-style:italic;">No tags</span>';

    elements.detailsModalBody.innerHTML = `
      <div>
        <h2 class="details-modal-title">${escapeHtml(item.title)}</h2>
      </div>

      <div class="details-meta-bar">
        <div class="details-meta-item">
          ${ICONS.clock}
          <span>Saved: ${item.dateDisplay || 'Recently'}</span>
        </div>
        <div class="details-meta-item">
          <span>${isExternal ? '🌐 External Resource' : '💾 Stored Content'}</span>
        </div>
        ${item.platform ? `
          <div class="details-meta-item">
            <span>📺 ${escapeHtml(item.platform)}</span>
          </div>
        ` : ''}
      </div>

      ${item.thumbnailUrl ? `
        <div style="width: 100%; max-height: 220px; overflow: hidden; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--gray-100);">
          <img src="${item.thumbnailUrl}" alt="${escapeHtml(item.title)}" style="width: 100%; height: 200px; object-fit: cover;">
        </div>
      ` : ''}

      ${isExternal && item.url ? `
        <div class="details-resource-banner">
          <div class="details-resource-left">
            <span style="font-size: 1.4rem;">🔗</span>
            <div>
              <div style="font-weight: 600; font-size: var(--text-xs); color: var(--text-secondary);">Source URL</div>
              <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="details-resource-url">${escapeHtml(item.url)}</a>
            </div>
          </div>
          <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 0.45rem 0.85rem; font-size: var(--text-xs);">
            <span>Open Link ↗</span>
          </a>
        </div>
      ` : ''}

      ${item.fileData ? `
        <div class="details-file-attachment">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.3rem;">📎</span>
            <div>
              <div style="font-weight: 600; font-size: var(--text-sm);">${escapeHtml(item.fileData.name)}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted);">${formatBytes(item.fileData.size)}</div>
            </div>
          </div>
          <button type="button" class="btn btn-secondary" data-action="download-attachment" style="padding: 0.35rem 0.75rem; font-size: var(--text-xs);">
            ${ICONS.download}
            <span>Download</span>
          </button>
        </div>
      ` : ''}

      <div>
        <div style="font-size: var(--text-xs); font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.4rem; letter-spacing: 0.04em;">Description & Notes</div>
        <div class="details-content-box">${escapeHtml(item.noteBody || item.description || 'No additional notes provided.')}</div>
      </div>

      <div>
        <div style="font-size: var(--text-xs); font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.4rem; letter-spacing: 0.04em;">Tags</div>
        <div class="details-tags-row">${tagsHtml}</div>
      </div>
    `;

    const downloadBtn = elements.detailsModalBody.querySelector('[data-action="download-attachment"]');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        showToast(`Preparing download for "${item.fileData ? item.fileData.name : item.title}"...`);
      });
    }

    if (elements.openFullPageDetailsBtn) {
      elements.openFullPageDetailsBtn.onclick = () => {
        closeDetailsModal();
        window.location.hash = `content-details?id=${item.id}`;
      };
    }

    elements.contentDetailsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDetailsModal = () => {
    if (elements.contentDetailsModal) {
      elements.contentDetailsModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (elements.closeDetailsModalBtn) elements.closeDetailsModalBtn.addEventListener('click', closeDetailsModal);
  if (elements.closeDetailsModalFooterBtn) elements.closeDetailsModalFooterBtn.addEventListener('click', closeDetailsModal);
  if (elements.contentDetailsModal) {
    elements.contentDetailsModal.addEventListener('click', (e) => {
      if (e.target === elements.contentDetailsModal) closeDetailsModal();
    });
  }

  // ==========================================================================
  // Unified Content Card Markup & Event Handler
  // ==========================================================================
  const createContentCardHtml = (item, viewContext = 'library') => {
    const typeIcon = ICONS[item.type] || ICONS.document;
    const isFav = item.isFavorite;
    const isExternal = item.storageType === 'external' || item.type === 'link' || item.type === 'video' || (item.url && item.type !== 'document');
    const isDropdownActive = state.activeDropdownId === item.id;

    const tagsHtml = item.tags && item.tags.length > 0 
      ? item.tags.map(tag => `<span class="tag-pill">#${escapeHtml(tag)}</span>`).join('') 
      : '';

    return `
      <article class="content-card" data-item-id="${item.id}" style="cursor:pointer;">
        <div class="card-top">
          <div style="display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;">
            <span class="type-badge ${item.type}">
              ${typeIcon}
              ${escapeHtml(item.resourceType || item.type)}
            </span>
            ${isExternal ? `
              <span class="storage-badge external" style="font-size:0.6rem; padding:0.15rem 0.45rem;">External</span>
            ` : `
              <span class="storage-badge stored" style="font-size:0.6rem; padding:0.15rem 0.45rem;">Stored</span>
            `}
          </div>
          <div class="card-actions">
            <button class="fav-btn ${isFav ? 'active' : ''}" data-action="toggle-fav" data-id="${item.id}" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}" aria-label="Favorite">
              ${ICONS.star}
            </button>

            <div class="card-menu-wrapper">
              <button class="card-menu-btn ${isDropdownActive ? 'active' : ''}" data-action="open-menu" data-id="${item.id}" title="Card actions" aria-label="More options">
                ${ICONS.moreVertical}
              </button>
              <div class="card-dropdown ${isDropdownActive ? 'active' : ''}" id="menu-${viewContext}-${item.id}">
                <button class="dropdown-item" data-action="open-item" data-id="${item.id}">
                  ${ICONS.openIcon}
                  <span>Open Details</span>
                </button>
                <button class="dropdown-item" data-action="edit-item" data-id="${item.id}">
                  ${ICONS.editIcon}
                  <span>Edit</span>
                </button>
                ${isExternal && item.url ? `
                  <button class="dropdown-item" data-action="open-ext-item" data-url="${escapeHtml(item.url)}">
                    ${ICONS.externalLink}
                    <span>Open Link ↗</span>
                  </button>
                ` : `
                  <button class="dropdown-item" data-action="download-item" data-id="${item.id}">
                    ${ICONS.download}
                    <span>Download</span>
                  </button>
                `}
                <button class="dropdown-item danger" data-action="delete-item" data-id="${item.id}">
                  ${ICONS.trashIcon}
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="card-body">
          <h3 class="card-title" data-action="open-item" data-id="${item.id}" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h3>
          <span class="card-category-tag" data-action="filter-cat" data-cat="${escapeHtml(item.category)}">${escapeHtml(item.category)}</span>
          ${item.thumbnailUrl ? `
            <div style="width:100%; max-height:160px; overflow:hidden; border-radius:var(--radius-md); margin-top:0.35rem; background:var(--gray-100); border:1px solid var(--border-default);">
              <img src="${item.thumbnailUrl}" alt="${escapeHtml(item.title)}" style="width:100%; height:140px; object-fit:cover;">
            </div>
          ` : ''}
          ${item.fileData ? `
            <div style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.7rem; color:var(--text-muted); background:var(--gray-50); border:1px solid var(--border-default); padding:0.15rem 0.45rem; border-radius:var(--radius-sm); margin-top:0.25rem;">
              <span>📎 ${escapeHtml(item.fileData.name)}</span>
              <span>(${formatBytes(item.fileData.size)})</span>
            </div>
          ` : ''}
          ${item.description ? `<p class="text-xs text-muted" style="line-height:1.4; margin-top:2px;">${escapeHtml(item.description)}</p>` : ''}
          ${tagsHtml ? `<div class="card-tags">${tagsHtml}</div>` : ''}
        </div>

        <div class="card-footer">
          <div class="card-date">
            ${ICONS.clock}
            <span>${item.dateDisplay || 'Today'}</span>
          </div>
          <span class="card-details-link" data-action="open-item" data-id="${item.id}" style="font-size:var(--text-xs); color:var(--primary-600); font-weight:600;">View Details →</span>
        </div>
      </article>
    `;
  };

  const attachCardEvents = (container, viewContext = 'library') => {
    // 1. Favorite toggle
    container.querySelectorAll('[data-action="toggle-fav"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (viewContext === 'favorites') {
          const card = btn.closest('.content-card');
          if (card) {
            card.style.transition = 'all 0.22s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.92)';
          }
          setTimeout(() => {
            window.dataStore.toggleFavorite(id);
            showToast('Removed from Favorites');
          }, 220);
        } else {
          const updated = window.dataStore.toggleFavorite(id);
          if (updated) {
            btn.classList.toggle('active', updated.isFavorite);
            showToast(updated.isFavorite ? `Added "${updated.title}" to Favorites` : `Removed from Favorites`);
          }
        }
      });
    });

    // 2. Three-dot menu toggle
    container.querySelectorAll('[data-action="open-menu"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        state.activeDropdownId = state.activeDropdownId === id ? null : id;
        if (viewContext === 'library') {
          renderMyContent();
        } else if (viewContext === 'favorites') {
          renderFavoritesPage();
        } else {
          renderRecentContent();
        }
      });
    });

    // 3. Open Details Modal action
    container.querySelectorAll('[data-action="open-item"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        state.activeDropdownId = null;
        openDetailsModal(id);
      });
    });

    // 3b. Open External Link action
    container.querySelectorAll('[data-action="open-ext-item"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = btn.getAttribute('data-url');
        state.activeDropdownId = null;
        if (url) window.open(url, '_blank');
      });
    });

    // 3c. Download action
    container.querySelectorAll('[data-action="download-item"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const item = window.dataStore.getItem(id);
        state.activeDropdownId = null;
        showToast(`Preparing download for "${item ? item.title : 'file'}"...`);
      });
    });

    // 4. Edit action
    container.querySelectorAll('[data-action="edit-item"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const item = window.dataStore.getItem(id);
        state.activeDropdownId = null;
        if (item) {
          openEditModal(item);
        }
      });
    });

    // 5. Delete action
    container.querySelectorAll('[data-action="delete-item"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        state.activeDropdownId = null;
        const item = window.dataStore.getItem(id);
        if (item && confirm(`Are you sure you want to delete "${item.title}"?`)) {
          const deleted = window.dataStore.deleteItem(id);
          if (deleted) {
            showToast(`Deleted "${deleted.title}"`);
          }
        }
      });
    });

    // 6. Category Tag Filter
    container.querySelectorAll('[data-action="filter-cat"]').forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.stopPropagation();
        const cat = tag.getAttribute('data-cat');
        navigateToCategoryLibrary(cat);
      });
    });

    // 7. Clicking anywhere on the card opens Details Modal
    container.querySelectorAll('.content-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-action]') || e.target.closest('.card-menu-wrapper') || e.target.closest('a')) return;
        const id = card.getAttribute('data-item-id');
        openDetailsModal(id);
      });
    });
  };

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (state.activeDropdownId && !e.target.closest('.card-menu-wrapper')) {
      state.activeDropdownId = null;
      document.querySelectorAll('.card-dropdown.active').forEach(dropdown => {
        dropdown.classList.remove('active');
      });
      document.querySelectorAll('.card-menu-btn.active').forEach(btn => {
        btn.classList.remove('active');
      });
    }
  });

  // ==========================================================================
  // Render Categories Section (Dashboard)
  // ==========================================================================
  const renderCategories = () => {
    if (!elements.categoriesContainer) return;
    const categories = window.dataStore.getCategories();

    elements.categoriesContainer.innerHTML = categories.map(cat => {
      const isActive = state.dashboardCategory === cat.slug;
      return `
        <div class="category-card ${cat.accentClass} ${isActive ? 'active' : ''}" data-category-slug="${cat.slug}" role="button" tabindex="0" title="Filter by ${escapeHtml(cat.name)}">
          <div class="category-icon-box ${cat.accentClass}">
            ${getCategoryIconSvg(cat.icon)}
          </div>
          <div class="category-info">
            <span class="category-name">${escapeHtml(cat.name)}</span>
            <span class="category-count">${cat.count} ${cat.count === 1 ? 'item' : 'items'}</span>
          </div>
        </div>
      `;
    }).join('');

    elements.categoriesContainer.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const slug = card.getAttribute('data-category-slug');
        state.dashboardCategory = state.dashboardCategory === slug ? 'all' : slug;
        renderCategories();
        renderRecentContent();
      });
    });
  };

  // ==========================================================================
  // Render Categories Dedicated Page (#categories)
  // ==========================================================================
  const renderCategoriesPage = () => {
    if (!elements.categoriesPageGrid) return;
    const categories = window.dataStore.getCategories();

    elements.categoriesPageGrid.innerHTML = categories.map(cat => {
      const emoji = getCategoryEmojiForName(cat.name);
      const accentPalettes = ['cat-coding', 'cat-study', 'cat-career', 'cat-projects', 'cat-design', 'cat-personal'];
      const accentClass = cat.accentClass || accentPalettes[0];
      const previewList = cat.recentPreviews && cat.recentPreviews.length > 0
        ? cat.recentPreviews.map(p => {
            const iconMini = p.type === 'document' ? '📄' : (p.type === 'image' ? '🖼️' : (p.type === 'video' ? '🎥' : (p.type === 'link' ? '🔗' : '📝')));
            return `
              <div class="category-preview-item" data-action="open-item" data-id="${p.id}" title="Click to open ${escapeHtml(p.title)}">
                <div class="category-preview-item-left">
                  <span>${iconMini}</span>
                  <span class="category-preview-title">${escapeHtml(p.title)}</span>
                </div>
                <span class="category-preview-date">${p.dateDisplay || 'Saved'}</span>
              </div>
            `;
          }).join('')
        : `<span class="category-preview-empty">No items saved yet in this category</span>`;

      return `
        <article class="category-page-card" data-category-name="${escapeHtml(cat.name)}" role="button" tabindex="0">
          <div class="category-card-header">
            <div class="category-icon-box ${accentClass}">
              <span>${emoji}</span>
            </div>
            <span class="category-count-pill">${cat.count} ${cat.count === 1 ? 'item' : 'items'}</span>
          </div>

          <div class="category-card-meta">
            <h3 class="category-card-title">${escapeHtml(cat.name)}</h3>
            <p class="category-card-desc">${escapeHtml(cat.description || `Saved resources in ${cat.name}`)}</p>
          </div>

          <div class="category-preview-section">
            <span class="category-preview-label">Recent Items</span>
            <div class="category-previews-list">
              ${previewList}
            </div>
          </div>

          <div class="category-card-footer">
            <button type="button" class="category-view-btn" data-action="view-category" data-cat="${escapeHtml(cat.name)}">
              <span>View Category</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </article>
      `;
    }).join('');

    elements.categoriesPageGrid.querySelectorAll('.category-page-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // If clicking on preview item, open details modal
        const previewItem = e.target.closest('[data-action="open-item"]');
        if (previewItem) {
          e.stopPropagation();
          const itemId = previewItem.getAttribute('data-id');
          openDetailsModal(itemId);
          return;
        }

        const catName = card.getAttribute('data-category-name');
        navigateToCategoryLibrary(catName);
      });
    });
  };

  // ==========================================================================
  // Render Favorites Dedicated Page (#favorites)
  // ==========================================================================
  const renderFavoritesPage = () => {
    if (!elements.favoritesGrid) return;
    const favorites = window.dataStore.getFavorites();

    if (elements.favoritesCountBadge) {
      elements.favoritesCountBadge.textContent = `${favorites.length} saved`;
    }

    if (favorites.length === 0) {
      elements.favoritesGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon-wrap" style="background-color: #FEF3C7; color: #D97706;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <h4 class="empty-title">Nothing saved here yet</h4>
          <p class="empty-desc">Star your most important documents, videos, and notes to find them quickly.</p>
          <button class="btn btn-secondary" id="browseMyContentFromFavBtn">
            <span>Browse My Content</span>
          </button>
        </div>
      `;

      const browseBtn = document.getElementById('browseMyContentFromFavBtn');
      if (browseBtn) {
        browseBtn.addEventListener('click', () => {
          state.libraryCategory = 'all';
          window.location.hash = 'my-content';
        });
      }
      return;
    }

    elements.favoritesGrid.innerHTML = favorites.map(item => createContentCardHtml(item, 'favorites')).join('');
    attachCardEvents(elements.favoritesGrid, 'favorites');
  };

  // ==========================================================================
  // Render Recent Content (Dashboard)
  // ==========================================================================
  const renderRecentContent = (onlyFavorites = false) => {
    if (!elements.contentGrid) return;

    const items = window.dataStore.filterItems({
      search: state.dashboardSearch,
      category: state.dashboardCategory,
      type: state.dashboardType,
      onlyFavorites: onlyFavorites
    });

    if (elements.contentCountBadge) {
      elements.contentCountBadge.textContent = `${items.length} ${items.length === 1 ? 'item' : 'items'}`;
    }

    if (items.length === 0) {
      elements.contentGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h4 class="empty-title">No matching content found</h4>
          <p class="empty-desc">Try tweaking your search term or clearing filters to see all stored items.</p>
          <button class="btn btn-secondary" id="resetDashboardFiltersBtn">Reset All Filters</button>
        </div>
      `;

      const resetBtn = document.getElementById('resetDashboardFiltersBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.dashboardSearch = '';
          state.dashboardCategory = 'all';
          state.dashboardType = 'all';
          if (elements.searchInput) elements.searchInput.value = '';
          elements.dashboardFilterPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-type') === 'all'));
          renderCategories();
          renderRecentContent();
        });
      }
      return;
    }

    elements.contentGrid.innerHTML = items.map(item => createContentCardHtml(item, 'dashboard')).join('');
    attachCardEvents(elements.contentGrid, 'dashboard');
  };

  // ==========================================================================
  // Render My Content / Content Library Page
  // ==========================================================================
  const renderMyContent = () => {
    if (!elements.libraryContentGrid) return;

    const items = window.dataStore.filterItems({
      search: state.librarySearch,
      category: state.libraryCategory,
      type: state.libraryType,
      sort: state.librarySort
    });

    if (elements.librarySearchClearBtn) {
      elements.librarySearchClearBtn.classList.toggle('active', state.librarySearch.trim().length > 0);
    }

    // Handle Active Category Banner
    if (elements.myContentCategoryBanner) {
      if (state.libraryCategory && state.libraryCategory !== 'all') {
        elements.myContentCategoryBanner.classList.remove('hidden');
        if (elements.categoryBannerName) elements.categoryBannerName.textContent = state.libraryCategory;
        if (elements.categoryBannerCount) elements.categoryBannerCount.textContent = `(${items.length} ${items.length === 1 ? 'item' : 'items'})`;
        if (elements.categoryBannerIcon) elements.categoryBannerIcon.textContent = getCategoryEmojiForName(state.libraryCategory);
      } else {
        elements.myContentCategoryBanner.classList.add('hidden');
      }
    }

    if (items.length === 0) {
      // Check if this is an empty category
      if (state.libraryCategory && state.libraryCategory !== 'all') {
        elements.libraryContentGrid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-icon-wrap" style="background-color: var(--primary-50); color: var(--primary-600);">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
                <line x1="12" y1="10" x2="12" y2="16"/>
                <line x1="9" y1="13" x2="15" y2="13"/>
              </svg>
            </div>
            <h4 class="empty-title">No content in this category yet</h4>
            <p class="empty-desc">Start saving something to build your collection.</p>
            <button class="btn btn-primary" id="emptyCategoryAddBtn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>+ Add Content</span>
            </button>
          </div>
        `;

        const emptyAddBtn = document.getElementById('emptyCategoryAddBtn');
        if (emptyAddBtn) {
          emptyAddBtn.addEventListener('click', () => {
            if (elements.addPageCategory) {
              elements.addPageCategory.value = state.libraryCategory;
            }
            window.location.hash = `add-content?category=${encodeURIComponent(state.libraryCategory)}`;
          });
        }
        return;
      }

      // Default empty state
      elements.libraryContentGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon-wrap">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <h4 class="empty-title">No content found</h4>
          <p class="empty-desc">Try changing your search or filters.</p>
          <button class="btn btn-secondary" id="clearLibraryFiltersBtn">Clear Filters</button>
        </div>
      `;

      const clearBtn = document.getElementById('clearLibraryFiltersBtn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          state.librarySearch = '';
          state.libraryCategory = 'all';
          state.libraryType = 'all';
          state.librarySort = 'recent';
          if (elements.librarySearchInput) elements.librarySearchInput.value = '';
          if (elements.librarySortSelect) elements.librarySortSelect.value = 'recent';
          elements.libraryFilterPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-type') === 'all'));
          renderMyContent();
        });
      }
      return;
    }

    elements.libraryContentGrid.innerHTML = items.map(item => createContentCardHtml(item, 'library')).join('');
    attachCardEvents(elements.libraryContentGrid, 'library');
  };

  // ==========================================================================
  // Add Content Page - Form Logic & Interactive Handlers
  // ==========================================================================

  // 1. Content Type Switcher
  const setContentType = (type) => {
    addFormState.type = type;

    // Update buttons UI
    elements.typeSelectorBtns.forEach(btn => {
      const isSelected = btn.getAttribute('data-type') === type;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', isSelected);
    });

    // Hide all type field blocks
    if (elements.documentFieldBlock) elements.documentFieldBlock.style.display = 'none';
    if (elements.imageFieldBlock) elements.imageFieldBlock.style.display = 'none';
    if (elements.videoFieldBlock) elements.videoFieldBlock.style.display = 'none';
    if (elements.linkFieldBlock) elements.linkFieldBlock.style.display = 'none';
    if (elements.noteFieldBlock) elements.noteFieldBlock.style.display = 'none';

    // Show selected block
    if (type === 'document') {
      if (elements.documentFieldBlock) elements.documentFieldBlock.style.display = 'block';
      if (elements.secondaryUrlGroup) elements.secondaryUrlGroup.style.display = 'block';
    } else if (type === 'image') {
      if (elements.imageFieldBlock) elements.imageFieldBlock.style.display = 'block';
      if (elements.secondaryUrlGroup) elements.secondaryUrlGroup.style.display = 'block';
    } else if (type === 'video') {
      if (elements.videoFieldBlock) elements.videoFieldBlock.style.display = 'block';
      if (elements.secondaryUrlGroup) elements.secondaryUrlGroup.style.display = 'block';
    } else if (type === 'link') {
      if (elements.linkFieldBlock) elements.linkFieldBlock.style.display = 'block';
      if (elements.secondaryUrlGroup) elements.secondaryUrlGroup.style.display = 'none';
      if (elements.addLinkUrl) setTimeout(() => elements.addLinkUrl.focus(), 50);
    } else if (type === 'note') {
      if (elements.noteFieldBlock) elements.noteFieldBlock.style.display = 'block';
      if (elements.secondaryUrlGroup) elements.secondaryUrlGroup.style.display = 'block';
    }

    clearValidationErrors();
  };

  elements.typeSelectorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      if (type) setContentType(type);
    });
  });

  // 2. Document Dropzone & Selection
  const setupDocumentDropzone = () => {
    if (!elements.documentDropzone || !elements.documentFileInput) return;

    elements.documentDropzone.addEventListener('click', () => {
      elements.documentFileInput.click();
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      elements.documentDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        elements.documentDropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      elements.documentDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        elements.documentDropzone.classList.remove('dragover');
      });
    });

    elements.documentDropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleDocumentFile(files[0]);
      }
    });

    elements.documentFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleDocumentFile(e.target.files[0]);
      }
    });

    if (elements.docFileRemoveBtn) {
      elements.docFileRemoveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addFormState.documentFile = null;
        elements.documentFileInput.value = '';
        elements.documentFileInfo.style.display = 'none';
        elements.documentDropzone.style.display = 'flex';
      });
    }
  };

  const handleDocumentFile = (file) => {
    addFormState.documentFile = {
      name: file.name,
      size: file.size,
      type: file.type
    };

    if (elements.docFileName) elements.docFileName.textContent = file.name;
    if (elements.docFileSize) elements.docFileSize.textContent = formatBytes(file.size);

    // Auto-fill title if empty
    if (elements.addPageTitle && !elements.addPageTitle.value.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      elements.addPageTitle.value = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    }

    elements.documentDropzone.style.display = 'none';
    elements.documentFileInfo.style.display = 'flex';
  };

  // 3. Image Dropzone & Preview
  const setupImageDropzone = () => {
    if (!elements.imageDropzone || !elements.imageFileInput) return;

    elements.imageDropzone.addEventListener('click', () => {
      elements.imageFileInput.click();
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      elements.imageDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        elements.imageDropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      elements.imageDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        elements.imageDropzone.classList.remove('dragover');
      });
    });

    elements.imageDropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleImageFile(files[0]);
      }
    });

    elements.imageFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleImageFile(e.target.files[0]);
      }
    });

    if (elements.imagePreviewRemoveBtn) {
      elements.imagePreviewRemoveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addFormState.imageFile = null;
        addFormState.imagePreviewUrl = null;
        elements.imageFileInput.value = '';
        elements.imagePreviewContainer.style.display = 'none';
        elements.imageDropzone.style.display = 'flex';
      });
    }
  };

  const handleImageFile = (file) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file');
      return;
    }

    addFormState.imageFile = {
      name: file.name,
      size: file.size,
      type: file.type
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      addFormState.imagePreviewUrl = dataUrl;
      if (elements.imagePreviewImg) elements.imagePreviewImg.src = dataUrl;
      elements.imageDropzone.style.display = 'none';
      elements.imagePreviewContainer.style.display = 'flex';
    };
    reader.readAsDataURL(file);

    // Auto-fill title if empty
    if (elements.addPageTitle && !elements.addPageTitle.value.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      elements.addPageTitle.value = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    }
  };

  // 4. Video Dropzone & Selection
  const setupVideoDropzone = () => {
    if (!elements.videoDropzone || !elements.videoFileInput) return;

    elements.videoDropzone.addEventListener('click', () => {
      elements.videoFileInput.click();
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      elements.videoDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        elements.videoDropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      elements.videoDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        elements.videoDropzone.classList.remove('dragover');
      });
    });

    elements.videoDropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleVideoFile(files[0]);
      }
    });

    elements.videoFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleVideoFile(e.target.files[0]);
      }
    });

    if (elements.videoFileRemoveBtn) {
      elements.videoFileRemoveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addFormState.videoFile = null;
        elements.videoFileInput.value = '';
        elements.videoFileInfo.style.display = 'none';
        elements.videoDropzone.style.display = 'flex';
      });
    }
  };

  const handleVideoFile = (file) => {
    addFormState.videoFile = {
      name: file.name,
      size: file.size,
      type: file.type
    };

    if (elements.videoFileName) elements.videoFileName.textContent = file.name;
    if (elements.videoFileSize) elements.videoFileSize.textContent = formatBytes(file.size);

    if (elements.addPageTitle && !elements.addPageTitle.value.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      elements.addPageTitle.value = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    }

    elements.videoDropzone.style.display = 'none';
    elements.videoFileInfo.style.display = 'flex';
  };

  // 5. Interactive Tag Chip Input
  const renderTagChips = () => {
    if (!elements.tagChipWrapper || !elements.addTagInput) return;

    // Remove existing chips
    elements.tagChipWrapper.querySelectorAll('.tag-chip-item').forEach(chip => chip.remove());

    // Insert chips before the input field
    addFormState.tags.forEach(tag => {
      const chip = document.createElement('span');
      chip.className = 'tag-chip-item';
      chip.innerHTML = `
        #${tag}
        <button type="button" class="tag-chip-remove-btn" data-tag="${tag}" aria-label="Remove tag ${tag}">✕</button>
      `;
      elements.tagChipWrapper.insertBefore(chip, elements.addTagInput);
    });
  };

  if (elements.tagChipWrapper && elements.addTagInput) {
    // Focus input when clicking tag area
    elements.tagChipWrapper.addEventListener('click', (e) => {
      if (e.target.classList.contains('tag-chip-remove-btn')) {
        const tagToRemove = e.target.getAttribute('data-tag');
        addFormState.tags = addFormState.tags.filter(t => t !== tagToRemove);
        renderTagChips();
        elements.addTagInput.focus();
        return;
      }
      elements.addTagInput.focus();
    });

    elements.addTagInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const value = elements.addTagInput.value.trim().toLowerCase().replace(/^#+/, '').replace(/,/g, '');
        if (value && !addFormState.tags.includes(value)) {
          addFormState.tags.push(value);
          elements.addTagInput.value = '';
          renderTagChips();
        } else {
          elements.addTagInput.value = '';
        }
      } else if (e.key === 'Backspace' && elements.addTagInput.value === '') {
        if (addFormState.tags.length > 0) {
          addFormState.tags.pop();
          renderTagChips();
        }
      }
    });
  }

  // 6. Note Editor Word & Character Counter
  if (elements.addNoteContent && elements.noteCharCounter) {
    elements.addNoteContent.addEventListener('input', (e) => {
      const text = e.target.value.trim();
      const words = text ? text.split(/\s+/).length : 0;
      const chars = e.target.value.length;
      elements.noteCharCounter.textContent = `${words} ${words === 1 ? 'word' : 'words'}, ${chars} ${chars === 1 ? 'character' : 'characters'}`;
      if (elements.noteContentError) elements.noteContentError.style.display = 'none';
      e.target.closest('.note-editor-wrapper')?.classList.remove('is-invalid');
    });
  }

  // 7. Favorite Toggle Switch
  if (elements.addFavoriteToggleCard) {
    elements.addFavoriteToggleCard.addEventListener('click', () => {
      addFormState.isFavorite = !addFormState.isFavorite;
      elements.addFavoriteToggleCard.classList.toggle('active', addFormState.isFavorite);
      elements.addFavoriteToggleCard.setAttribute('aria-checked', addFormState.isFavorite);
    });

    elements.addFavoriteToggleCard.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        elements.addFavoriteToggleCard.click();
      }
    });
  }

  // 8. Validation Helpers
  const clearValidationErrors = () => {
    document.querySelectorAll('.form-error-msg').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  };

  const validateAddForm = () => {
    clearValidationErrors();
    let isValid = true;
    let firstErrorField = null;

    // Title validation
    const title = elements.addPageTitle ? elements.addPageTitle.value.trim() : '';
    if (!title) {
      isValid = false;
      if (elements.titleError) {
        elements.titleError.textContent = 'Please enter a title for this content.';
        elements.titleError.style.display = 'flex';
      }
      if (elements.addPageTitle) elements.addPageTitle.classList.add('is-invalid');
      if (!firstErrorField) firstErrorField = elements.addPageTitle;
    }

    // Category validation
    const category = elements.addPageCategory ? elements.addPageCategory.value : '';
    if (!category) {
      isValid = false;
      if (elements.categoryError) {
        elements.categoryError.textContent = 'Please select a category.';
        elements.categoryError.style.display = 'flex';
      }
      if (!firstErrorField) firstErrorField = elements.addPageCategory;
    }

    // Type-specific validations
    if (addFormState.type === 'link') {
      const url = elements.addLinkUrl ? elements.addLinkUrl.value.trim() : '';
      if (!url) {
        isValid = false;
        if (elements.linkUrlError) {
          elements.linkUrlError.textContent = 'Please enter a resource link URL.';
          elements.linkUrlError.style.display = 'flex';
        }
        if (elements.addLinkUrl) elements.addLinkUrl.classList.add('is-invalid');
        if (!firstErrorField) firstErrorField = elements.addLinkUrl;
      } else {
        // Basic URL regex check
        const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;
        if (!urlPattern.test(url)) {
          isValid = false;
          if (elements.linkUrlError) {
            elements.linkUrlError.textContent = 'Please enter a valid web URL (e.g. https://example.com/guide).';
            elements.linkUrlError.style.display = 'flex';
          }
          if (elements.addLinkUrl) elements.addLinkUrl.classList.add('is-invalid');
          if (!firstErrorField) firstErrorField = elements.addLinkUrl;
        }
      }
    } else if (addFormState.type === 'note') {
      const noteContent = elements.addNoteContent ? elements.addNoteContent.value.trim() : '';
      if (!noteContent) {
        isValid = false;
        if (elements.noteContentError) {
          elements.noteContentError.textContent = 'Please write some note content before saving.';
          elements.noteContentError.style.display = 'flex';
        }
        elements.addNoteContent.closest('.note-editor-wrapper')?.classList.add('is-invalid');
        if (!firstErrorField) firstErrorField = elements.addNoteContent;
      }
    }

    if (!isValid && firstErrorField) {
      firstErrorField.focus();
    }

    return isValid;
  };

  // Clear errors on typing
  if (elements.addPageTitle) {
    elements.addPageTitle.addEventListener('input', () => {
      if (elements.titleError) elements.titleError.style.display = 'none';
      elements.addPageTitle.classList.remove('is-invalid');
    });
  }

  if (elements.addLinkUrl) {
    elements.addLinkUrl.addEventListener('input', () => {
      if (elements.linkUrlError) elements.linkUrlError.style.display = 'none';
      elements.addLinkUrl.classList.remove('is-invalid');
    });
  }

  // 9. Reset Add Form
  const resetAddForm = () => {
    if (elements.addPageForm) elements.addPageForm.reset();
    addFormState.tags = [];
    addFormState.isFavorite = false;
    addFormState.documentFile = null;
    addFormState.imageFile = null;
    addFormState.imagePreviewUrl = null;
    addFormState.videoFile = null;

    renderTagChips();
    clearValidationErrors();

    if (elements.addFavoriteToggleCard) {
      elements.addFavoriteToggleCard.classList.remove('active');
      elements.addFavoriteToggleCard.setAttribute('aria-checked', 'false');
    }

    if (elements.documentFileInfo) elements.documentFileInfo.style.display = 'none';
    if (elements.documentDropzone) elements.documentDropzone.style.display = 'flex';

    if (elements.imagePreviewContainer) elements.imagePreviewContainer.style.display = 'none';
    if (elements.imageDropzone) elements.imageDropzone.style.display = 'flex';

    if (elements.videoFileInfo) elements.videoFileInfo.style.display = 'none';
    if (elements.videoDropzone) elements.videoDropzone.style.display = 'flex';

    if (elements.noteCharCounter) elements.noteCharCounter.textContent = '0 words, 0 characters';

    setContentType('document');
  };

  // 10. Check if user entered substantial changes
  const hasUnsavedChanges = () => {
    const title = elements.addPageTitle ? elements.addPageTitle.value.trim() : '';
    const desc = elements.addPageDescription ? elements.addPageDescription.value.trim() : '';
    const note = elements.addNoteContent ? elements.addNoteContent.value.trim() : '';
    const url = elements.addLinkUrl ? elements.addLinkUrl.value.trim() : '';
    const hasTags = addFormState.tags.length > 0;
    const hasFiles = addFormState.documentFile || addFormState.imageFile || addFormState.videoFile;

    return Boolean(title || desc || note || url || hasTags || hasFiles);
  };

  const handleCancelAdd = () => {
    if (hasUnsavedChanges()) {
      if (confirm('You have unsaved changes. Are you sure you want to discard them and return to My Content?')) {
        resetAddForm();
        window.location.hash = 'my-content';
      }
    } else {
      resetAddForm();
      window.location.hash = 'my-content';
    }
  };

  if (elements.cancelAddPageBtn) elements.cancelAddPageBtn.addEventListener('click', handleCancelAdd);
  if (elements.backToMyContentBtn) elements.backToMyContentBtn.addEventListener('click', handleCancelAdd);

  // 11. Form Submission (Save Content)
  if (elements.addPageForm) {
    elements.addPageForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateAddForm()) return;

      const title = elements.addPageTitle.value.trim();
      const type = addFormState.type;
      const category = elements.addPageCategory.value;
      const description = elements.addPageDescription ? elements.addPageDescription.value.trim() : '';
      
      let finalUrl = '';
      if (type === 'link' && elements.addLinkUrl) {
        let enteredUrl = elements.addLinkUrl.value.trim();
        if (enteredUrl && !/^https?:\/\//i.test(enteredUrl)) {
          enteredUrl = 'https://' + enteredUrl;
        }
        finalUrl = enteredUrl;
      } else if (elements.addSecondaryUrl && elements.addSecondaryUrl.value.trim()) {
        let enteredUrl = elements.addSecondaryUrl.value.trim();
        if (!/^https?:\/\//i.test(enteredUrl)) {
          enteredUrl = 'https://' + enteredUrl;
        }
        finalUrl = enteredUrl;
      }

      // If note, combine note content with description if description is empty
      let finalDesc = description;
      if (type === 'note' && elements.addNoteContent) {
        const noteText = elements.addNoteContent.value.trim();
        if (!finalDesc) {
          finalDesc = noteText.slice(0, 160) + (noteText.length > 160 ? '...' : '');
        }
      }

      // Visual saving feedback
      if (elements.submitAddPageBtn) {
        elements.submitAddPageBtn.disabled = true;
        elements.submitAddPageBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
            <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="16"/>
          </svg>
          <span>Saving...</span>
        `;
      }

      setTimeout(() => {
        const newItem = window.dataStore.addItem({
          title,
          type,
          category,
          tags: [...addFormState.tags],
          description: finalDesc,
          url: finalUrl,
          isFavorite: addFormState.isFavorite,
          thumbnailUrl: addFormState.imagePreviewUrl || '',
          fileData: addFormState.documentFile || addFormState.videoFile || null
        });

        // Reset button
        if (elements.submitAddPageBtn) {
          elements.submitAddPageBtn.disabled = false;
          elements.submitAddPageBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            <span>Save Content</span>
          `;
        }

        resetAddForm();
        showToast('Content saved successfully.');

        // Redirect to My Content view to see newly added item
        window.location.hash = 'my-content';
      }, 250);
    });
  }

  // Initialize dropzones
  setupDocumentDropzone();
  setupImageDropzone();
  setupVideoDropzone();

  // ==========================================================================
  // My Content View Controls (Search, Filters, Sort)
  // ==========================================================================
  if (elements.librarySearchInput) {
    elements.librarySearchInput.addEventListener('input', (e) => {
      state.librarySearch = e.target.value;
      renderMyContent();
    });
  }

  if (elements.librarySearchClearBtn) {
    elements.librarySearchClearBtn.addEventListener('click', () => {
      state.librarySearch = '';
      if (elements.librarySearchInput) {
        elements.librarySearchInput.value = '';
        elements.librarySearchInput.focus();
      }
      renderMyContent();
    });
  }

  elements.libraryFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      elements.libraryFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.libraryType = pill.getAttribute('data-type') || 'all';
      renderMyContent();
    });
  });

  if (elements.librarySortSelect) {
    elements.librarySortSelect.addEventListener('change', (e) => {
      state.librarySort = e.target.value;
      renderMyContent();
    });
  }

  // ==========================================================================
  // Topbar Search & Hotkey
  // ==========================================================================
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      if (state.currentView === 'my-content') {
        state.librarySearch = e.target.value;
        if (elements.librarySearchInput) elements.librarySearchInput.value = e.target.value;
        renderMyContent();
      } else {
        state.dashboardSearch = e.target.value;
        renderRecentContent();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const targetInput = state.currentView === 'my-content' && elements.librarySearchInput 
        ? elements.librarySearchInput 
        : elements.searchInput;
      if (targetInput) {
        targetInput.focus();
        targetInput.select();
      }
    }
    if (e.key === 'Escape') {
      if (state.activeDropdownId) {
        state.activeDropdownId = null;
        document.querySelectorAll('.card-dropdown.active').forEach(d => d.classList.remove('active'));
      }
      if (elements.modalOverlay && elements.modalOverlay.classList.contains('active')) {
        closeModal();
      }
      if (elements.newCategoryModal && elements.newCategoryModal.classList.contains('active')) {
        closeNewCategoryModal();
      }
      if (elements.contentDetailsModal && elements.contentDetailsModal.classList.contains('active')) {
        closeDetailsModal();
      }
    }
  });

  // ==========================================================================
  // Sidebar Navigation Links
  // ==========================================================================
  elements.sidebarNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const navTarget = link.getAttribute('data-nav');
      if (!navTarget) return;

      closeSidebar();

      if (navTarget === 'dashboard') {
        window.location.hash = 'dashboard';
        switchView('dashboard');
      } else if (navTarget === 'my-content') {
        window.location.hash = 'my-content';
        switchView('my-content');
      } else if (navTarget === 'favorites') {
        window.location.hash = 'favorites';
        switchView('favorites');
      } else if (navTarget === 'categories') {
        window.location.hash = 'categories';
        switchView('categories');
      } else {
        showToast(`${link.querySelector('span').textContent} section`);
      }
    });
  });

  // ==========================================================================
  // Mobile Sidebar Drawer
  // ==========================================================================
  const openSidebar = () => {
    elements.sidebar.classList.add('open');
    elements.sidebarBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeSidebar = () => {
    elements.sidebar.classList.remove('open');
    elements.sidebarBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (elements.mobileMenuBtn) elements.mobileMenuBtn.addEventListener('click', openSidebar);
  if (elements.sidebarCloseBtn) elements.sidebarCloseBtn.addEventListener('click', closeSidebar);
  if (elements.sidebarBackdrop) elements.sidebarBackdrop.addEventListener('click', closeSidebar);

  // ==========================================================================
  // Add & Edit Content Entry Points
  // ==========================================================================
  // Navigate to Add Content Page on clicking "+ Add Content" buttons
  if (elements.addContentBtn) {
    elements.addContentBtn.addEventListener('click', () => {
      window.location.hash = 'add-content';
    });
  }

  if (elements.libraryAddContentBtn) {
    elements.libraryAddContentBtn.addEventListener('click', () => {
      window.location.hash = 'add-content';
    });
  }

  // Modal Editing Dialog (Used for Edit action from card dropdown)
  const openEditModal = (item) => {
    if (elements.modalTitle) elements.modalTitle.textContent = 'Edit Content';
    if (elements.modalSubmitBtn) elements.modalSubmitBtn.textContent = 'Save Changes';
    if (elements.contentEditId) elements.contentEditId.value = item.id;

    document.getElementById('contentTitle').value = item.title || '';
    document.getElementById('contentType').value = item.type || 'document';
    document.getElementById('contentCategory').value = item.category || 'Coding';
    document.getElementById('contentTags').value = item.tags ? item.tags.join(', ') : '';
    document.getElementById('contentUrl').value = item.url || '';
    document.getElementById('contentDescription').value = item.description || '';

    elements.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    const firstInput = document.getElementById('contentTitle');
    if (firstInput) setTimeout(() => firstInput.focus(), 50);
  };

  const closeModal = () => {
    elements.modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (elements.addContentForm) elements.addContentForm.reset();
    if (elements.contentEditId) elements.contentEditId.value = '';
  };

  if (elements.modalCloseBtn) elements.modalCloseBtn.addEventListener('click', closeModal);
  if (elements.modalCancelBtn) elements.modalCancelBtn.addEventListener('click', closeModal);
  if (elements.modalOverlay) {
    elements.modalOverlay.addEventListener('click', (e) => {
      if (e.target === elements.modalOverlay) closeModal();
    });
  }

  // Modal Form Submission (Edit item only)
  if (elements.addContentForm) {
    elements.addContentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const editId = elements.contentEditId ? elements.contentEditId.value.trim() : '';
      const title = document.getElementById('contentTitle').value.trim();
      const type = document.getElementById('contentType').value;
      const category = document.getElementById('contentCategory').value;
      const tagsString = document.getElementById('contentTags').value;
      const description = document.getElementById('contentDescription').value.trim();
      const url = document.getElementById('contentUrl').value.trim();

      if (!title) return;

      const tags = tagsString
        ? tagsString.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      if (editId) {
        const updated = window.dataStore.updateItem(editId, {
          title,
          type,
          category,
          tags,
          description,
          url
        });
        closeModal();
        showToast(`Saved changes to "${updated.title}"`);
      }
    });
  }

  // ==========================================================================
  // Toast Notification System
  // ==========================================================================
  const showToast = (message) => {
    if (!elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      ${ICONS.check}
      <span>${message}</span>
    `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => {
        toast.remove();
      }, 250);
    }, 2800);
  };

  // ==========================================================================
  // Data Store Subscription (Auto Re-render on State Mutation)
  // ==========================================================================
  window.dataStore.subscribe(() => {
    updateSidebarBadges();
    renderStats();
    renderCategories();
    populateCategoryDropdowns();
    if (state.currentView === 'my-content') {
      renderMyContent();
    } else if (state.currentView === 'dashboard') {
      renderRecentContent();
    } else if (state.currentView === 'categories') {
      renderCategoriesPage();
    } else if (state.currentView === 'favorites') {
      renderFavoritesPage();
    }
  });

  // ==========================================================================
  // Initialize Page
  // ==========================================================================
  updateGreeting();
  populateCategoryDropdowns();
  renderIconPicker();
  updateSidebarBadges();
  handleRoute();
});
