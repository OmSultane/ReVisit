/**
 * Digital Content Organizer (DigitalVault)
 * Main Application Logic & UI Controller
 * 
 * Supports seamless multi-view SPA navigation between Dashboard and My Content,
 * live search, type filters, custom sorting, item editing, favorite toggling,
 * three-dot menu actions (Open, Edit, Delete), and toast notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentView: 'dashboard', // 'dashboard' | 'my-content'
    // Dashboard state
    dashboardSearch: '',
    dashboardCategory: 'all',
    dashboardType: 'all',
    // My Content state
    librarySearch: '',
    libraryType: 'all',
    librarySort: 'recent',
    activeDropdownId: null
  };

  // DOM Element References
  const elements = {
    // Views
    dashboardView: document.getElementById('dashboardView'),
    myContentView: document.getElementById('myContentView'),

    // Topbar & Navigation
    greetingText: document.getElementById('greetingText'),
    searchInput: document.getElementById('searchInput'),
    sidebarNavLinks: document.querySelectorAll('.nav-item-link'),
    navDashboard: document.getElementById('navDashboard'),
    navMyContent: document.getElementById('navMyContent'),
    navFavorites: document.getElementById('navFavorites'),
    navCategories: document.getElementById('navCategories'),
    navCountBadge: document.querySelector('#navMyContent .nav-count-badge'),
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

    // Modal Dialog Elements
    modalOverlay: document.getElementById('modalOverlay'),
    modalTitle: document.getElementById('modalTitle'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalCancelBtn: document.getElementById('modalCancelBtn'),
    modalSubmitBtn: document.getElementById('modalSubmitBtn'),
    addContentForm: document.getElementById('addContentForm'),
    contentEditId: document.getElementById('contentEditId'),

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
    trashIcon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`
  };

  // Map category icon names to SVG strings
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
  // SPA View Routing (Dashboard vs My Content)
  // ==========================================================================
  const switchView = (viewName) => {
    state.currentView = viewName;
    state.activeDropdownId = null;

    if (viewName === 'my-content') {
      elements.dashboardView.classList.add('hidden');
      elements.myContentView.classList.remove('hidden');
      elements.sidebarNavLinks.forEach(link => link.classList.remove('active'));
      if (elements.navMyContent) elements.navMyContent.classList.add('active');
      renderMyContent();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      elements.myContentView.classList.add('hidden');
      elements.dashboardView.classList.remove('hidden');
      elements.sidebarNavLinks.forEach(link => link.classList.remove('active'));
      if (elements.navDashboard) elements.navDashboard.classList.add('active');
      renderStats();
      renderCategories();
      renderRecentContent();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRoute = () => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#my-content') {
      switchView('my-content');
    } else if (hash === '#favorites') {
      switchView('dashboard');
      state.dashboardCategory = 'all';
      renderRecentContent(true); // only favorites
      showToast('Showing Favorited Items');
    } else {
      switchView('dashboard');
    }
  };

  window.addEventListener('hashchange', handleRoute);

  // Sync sidebar items count badge
  const updateSidebarBadges = () => {
    const total = window.dataStore.getItems().length;
    if (elements.navCountBadge) {
      elements.navCountBadge.textContent = total;
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
  // Render Categories Section (Dashboard)
  // ==========================================================================
  const renderCategories = () => {
    if (!elements.categoriesContainer) return;
    const categories = window.dataStore.getCategories();

    elements.categoriesContainer.innerHTML = categories.map(cat => {
      const isActive = state.dashboardCategory === cat.slug;
      return `
        <div class="category-card ${cat.accentClass} ${isActive ? 'active' : ''}" data-category-slug="${cat.slug}" role="button" tabindex="0" title="Filter by ${cat.name}">
          <div class="category-icon-box ${cat.accentClass}">
            ${getCategoryIconSvg(cat.icon)}
          </div>
          <div class="category-info">
            <span class="category-name">${cat.name}</span>
            <span class="category-count">${cat.count} ${cat.count === 1 ? 'item' : 'items'}</span>
          </div>
        </div>
      `;
    }).join('');

    // Click events for category filter
    elements.categoriesContainer.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const slug = card.getAttribute('data-category-slug');
        if (state.dashboardCategory === slug) {
          state.dashboardCategory = 'all';
        } else {
          state.dashboardCategory = slug;
        }
        renderCategories();
        renderRecentContent();
      });
    });
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
        <div class="empty-state">
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

    elements.contentGrid.innerHTML = items.map(item => {
      const typeIcon = ICONS[item.type] || ICONS.document;
      const isFav = item.isFavorite;

      const tagsHtml = item.tags && item.tags.length > 0 
        ? item.tags.map(tag => `<span class="tag-pill">#${tag}</span>`).join('') 
        : '';

      return `
        <article class="content-card" data-item-id="${item.id}">
          <div class="card-top">
            <span class="type-badge ${item.type}">
              ${typeIcon}
              ${item.type}
            </span>
            <div class="card-actions">
              <button class="fav-btn ${isFav ? 'active' : ''}" data-action="toggle-fav" data-id="${item.id}" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}" aria-label="Favorite">
                ${ICONS.star}
              </button>
            </div>
          </div>

          <div class="card-body">
            <h3 class="card-title" title="${item.title}">${item.title}</h3>
            <span class="card-category-tag">${item.category}</span>
            ${item.description ? `<p class="text-xs text-muted" style="line-height:1.4; margin-top:2px;">${item.description}</p>` : ''}
            ${tagsHtml ? `<div class="card-tags">${tagsHtml}</div>` : ''}
          </div>

          <div class="card-footer">
            <div class="card-date">
              ${ICONS.clock}
              <span>${item.dateDisplay}</span>
            </div>
            ${item.url ? `
              <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="btn-icon-only" title="Open Link" style="display:inline-flex; align-items:center; color:var(--primary-600);">
                ${ICONS.externalLink}
              </a>
            ` : ''}
          </div>
        </article>
      `;
    }).join('');

    // Dashboard Favorite toggle
    elements.contentGrid.querySelectorAll('[data-action="toggle-fav"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const updated = window.dataStore.toggleFavorite(id);
        if (updated) {
          showToast(updated.isFavorite ? `Added "${updated.title}" to Favorites` : `Removed from Favorites`);
        }
      });
    });
  };

  // ==========================================================================
  // Render My Content / Content Library Page
  // ==========================================================================
  const renderMyContent = () => {
    if (!elements.libraryContentGrid) return;

    const items = window.dataStore.filterItems({
      search: state.librarySearch,
      type: state.libraryType,
      sort: state.librarySort
    });

    // Handle clear search button visibility
    if (elements.librarySearchClearBtn) {
      if (state.librarySearch.trim().length > 0) {
        elements.librarySearchClearBtn.classList.add('active');
      } else {
        elements.librarySearchClearBtn.classList.remove('active');
      }
    }

    // Empty state handling
    if (items.length === 0) {
      elements.libraryContentGrid.innerHTML = `
        <div class="empty-state">
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

    // Render cards with three-dot action menu
    elements.libraryContentGrid.innerHTML = items.map(item => {
      const typeIcon = ICONS[item.type] || ICONS.document;
      const isFav = item.isFavorite;
      const isDropdownActive = state.activeDropdownId === item.id;

      const tagsHtml = item.tags && item.tags.length > 0 
        ? item.tags.map(tag => `<span class="tag-pill">#${tag}</span>`).join('') 
        : '';

      return `
        <article class="content-card" data-item-id="${item.id}">
          <div class="card-top">
            <span class="type-badge ${item.type}">
              ${typeIcon}
              ${item.type}
            </span>
            <div class="card-actions">
              <!-- Favorite Toggle Button -->
              <button class="fav-btn ${isFav ? 'active' : ''}" data-action="toggle-fav" data-id="${item.id}" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}" aria-label="Favorite">
                ${ICONS.star}
              </button>

              <!-- Three-dot Menu Trigger & Dropdown -->
              <div class="card-menu-wrapper">
                <button class="card-menu-btn ${isDropdownActive ? 'active' : ''}" data-action="open-menu" data-id="${item.id}" title="Card actions" aria-label="More options">
                  ${ICONS.moreVertical}
                </button>
                <div class="card-dropdown ${isDropdownActive ? 'active' : ''}" id="menu-${item.id}">
                  <button class="dropdown-item" data-action="open-item" data-id="${item.id}">
                    ${ICONS.openIcon}
                    <span>Open</span>
                  </button>
                  <button class="dropdown-item" data-action="edit-item" data-id="${item.id}">
                    ${ICONS.editIcon}
                    <span>Edit</span>
                  </button>
                  <button class="dropdown-item danger" data-action="delete-item" data-id="${item.id}">
                    ${ICONS.trashIcon}
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="card-body">
            <h3 class="card-title" title="${item.title}">${item.title}</h3>
            <span class="card-category-tag">${item.category}</span>
            ${item.description ? `<p class="text-xs text-muted" style="line-height:1.4; margin-top:2px;">${item.description}</p>` : ''}
            ${tagsHtml ? `<div class="card-tags">${tagsHtml}</div>` : ''}
          </div>

          <div class="card-footer">
            <div class="card-date">
              ${ICONS.clock}
              <span>${item.dateDisplay || 'Today'}</span>
            </div>
            ${item.url ? `
              <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="btn-icon-only" title="Open Link" style="display:inline-flex; align-items:center; color:var(--primary-600);">
                ${ICONS.externalLink}
              </a>
            ` : ''}
          </div>
        </article>
      `;
    }).join('');

    // Attach card action listeners
    attachLibraryCardEvents();
  };

  // Card interaction event listeners
  const attachLibraryCardEvents = () => {
    // 1. Favorite toggle
    elements.libraryContentGrid.querySelectorAll('[data-action="toggle-fav"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const updated = window.dataStore.toggleFavorite(id);
        if (updated) {
          showToast(updated.isFavorite ? `Added "${updated.title}" to Favorites` : `Removed from Favorites`);
        }
      });
    });

    // 2. Three-dot menu toggle
    elements.libraryContentGrid.querySelectorAll('[data-action="open-menu"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        state.activeDropdownId = state.activeDropdownId === id ? null : id;
        renderMyContent();
      });
    });

    // 3. Open action
    elements.libraryContentGrid.querySelectorAll('[data-action="open-item"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const item = window.dataStore.getItem(id);
        state.activeDropdownId = null;
        if (item) {
          if (item.url) {
            window.open(item.url, '_blank');
          } else {
            showToast(`Opened "${item.title}"`);
          }
        }
        renderMyContent();
      });
    });

    // 4. Edit action
    elements.libraryContentGrid.querySelectorAll('[data-action="edit-item"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const item = window.dataStore.getItem(id);
        state.activeDropdownId = null;
        if (item) {
          openEditModal(item);
        }
        renderMyContent();
      });
    });

    // 5. Delete action
    elements.libraryContentGrid.querySelectorAll('[data-action="delete-item"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        state.activeDropdownId = null;
        const deleted = window.dataStore.deleteItem(id);
        if (deleted) {
          showToast(`Deleted "${deleted.title}"`);
        }
      });
    });
  };

  // Close dropdowns when clicking outside
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
  // My Content View Controls (Search, Filters, Sort)
  // ==========================================================================
  // Large Search Input
  if (elements.librarySearchInput) {
    elements.librarySearchInput.addEventListener('input', (e) => {
      state.librarySearch = e.target.value;
      renderMyContent();
    });
  }

  // Clear Search Button
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

  // Type Filter Pills
  elements.libraryFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      elements.libraryFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.libraryType = pill.getAttribute('data-type') || 'all';
      renderMyContent();
    });
  });

  // Sort Select Dropdown
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
        switchView('dashboard');
        renderRecentContent(true);
        showToast('Showing Favorited Items');
      } else if (navTarget === 'categories') {
        window.location.hash = 'dashboard';
        switchView('dashboard');
        const catSection = document.getElementById('categoriesSection');
        if (catSection) {
          catSection.scrollIntoView({ behavior: 'smooth' });
        }
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
  // Add & Edit Content Modal Dialog
  // ==========================================================================
  const openAddModal = () => {
    if (elements.modalTitle) elements.modalTitle.textContent = 'Add New Content';
    if (elements.modalSubmitBtn) elements.modalSubmitBtn.textContent = 'Save Content';
    if (elements.contentEditId) elements.contentEditId.value = '';
    if (elements.addContentForm) elements.addContentForm.reset();

    elements.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    const firstInput = document.getElementById('contentTitle');
    if (firstInput) setTimeout(() => firstInput.focus(), 50);
  };

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

  if (elements.addContentBtn) elements.addContentBtn.addEventListener('click', openAddModal);
  if (elements.libraryAddContentBtn) elements.libraryAddContentBtn.addEventListener('click', openAddModal);
  if (elements.modalCloseBtn) elements.modalCloseBtn.addEventListener('click', closeModal);
  if (elements.modalCancelBtn) elements.modalCancelBtn.addEventListener('click', closeModal);
  if (elements.modalOverlay) {
    elements.modalOverlay.addEventListener('click', (e) => {
      if (e.target === elements.modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Modal Form Submission (Handles Add and Edit)
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
        // Edit existing item
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
      } else {
        // Add new item
        const newItem = window.dataStore.addItem({
          title,
          type,
          category,
          tags,
          description,
          url
        });
        closeModal();
        showToast(`Added "${newItem.title}" to ${newItem.category}!`);
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
    if (state.currentView === 'my-content') {
      renderMyContent();
    } else {
      renderRecentContent();
    }
  });

  // ==========================================================================
  // Initialize Page
  // ==========================================================================
  updateGreeting();
  updateSidebarBadges();
  handleRoute();
});
