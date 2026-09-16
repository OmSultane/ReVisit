/**
 * Digital Content Organizer (DigitalVault)
 * Main Application Logic & UI Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    searchQuery: '',
    selectedCategory: 'all',
    selectedType: 'all',
    activeNav: 'dashboard'
  };

  // DOM Element References
  const elements = {
    greetingText: document.getElementById('greetingText'),
    statsContainer: document.getElementById('statsContainer'),
    categoriesContainer: document.getElementById('categoriesContainer'),
    contentGrid: document.getElementById('contentGrid'),
    contentCountBadge: document.getElementById('contentCountBadge'),
    searchInput: document.getElementById('searchInput'),
    filterPills: document.querySelectorAll('.filter-pill'),
    sidebarNavLinks: document.querySelectorAll('.nav-item-link'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    sidebarCloseBtn: document.getElementById('sidebarCloseBtn'),
    sidebar: document.getElementById('sidebar'),
    sidebarBackdrop: document.getElementById('sidebarBackdrop'),
    addContentBtn: document.getElementById('addContentBtn'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalCancelBtn: document.getElementById('modalCancelBtn'),
    addContentForm: document.getElementById('addContentForm'),
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
    user: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    clock: `<svg class="card-date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    star: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    externalLink: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    check: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
  };

  // Map category icon names to SVG strings
  const getCategoryIconSvg = (iconName) => {
    switch (iconName) {
      case 'code': return ICONS.code;
      case 'book-open': return ICONS.bookOpen;
      case 'briefcase': return ICONS.briefcase;
      case 'folder-git': return ICONS.folderGit;
      case 'user': return ICONS.user;
      default: return ICONS.code;
    }
  };

  // ==========================================================================
  // Dynamic Greeting based on time of day
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
  // Render Statistics Cards
  // ==========================================================================
  const renderStats = () => {
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
  // Render Categories Section
  // ==========================================================================
  const renderCategories = () => {
    const categories = window.dataStore.getCategories();

    elements.categoriesContainer.innerHTML = categories.map(cat => {
      const isActive = state.selectedCategory === cat.slug;
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

    // Attach click events to category cards
    elements.categoriesContainer.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const slug = card.getAttribute('data-category-slug');
        if (state.selectedCategory === slug) {
          state.selectedCategory = 'all'; // toggle off
        } else {
          state.selectedCategory = slug;
        }
        renderCategories();
        renderRecentContent();
      });
    });
  };

  // ==========================================================================
  // Render Recent Content Cards
  // ==========================================================================
  const renderRecentContent = () => {
    const items = window.dataStore.filterItems({
      search: state.searchQuery,
      category: state.selectedCategory,
      type: state.selectedType,
      onlyFavorites: state.activeNav === 'favorites'
    });

    // Update count badge
    if (elements.contentCountBadge) {
      elements.contentCountBadge.textContent = `${items.length} items`;
    }

    // Handle empty state
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
          <button class="btn btn-secondary" id="resetFiltersBtn">Reset All Filters</button>
        </div>
      `;

      const resetBtn = document.getElementById('resetFiltersBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.searchQuery = '';
          state.selectedCategory = 'all';
          state.selectedType = 'all';
          if (elements.searchInput) elements.searchInput.value = '';
          updateFilterPillsUI();
          renderCategories();
          renderRecentContent();
        });
      }
      return;
    }

    // Render grid of cards
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

    // Attach favorite toggle listeners
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
  // Filter Pill Controls
  // ==========================================================================
  const updateFilterPillsUI = () => {
    elements.filterPills.forEach(pill => {
      const type = pill.getAttribute('data-type');
      if (type === state.selectedType) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  };

  elements.filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      state.selectedType = pill.getAttribute('data-type') || 'all';
      updateFilterPillsUI();
      renderRecentContent();
    });
  });

  // ==========================================================================
  // Live Search & Keyboard Shortcuts
  // ==========================================================================
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderRecentContent();
    });
  }

  // Ctrl+K / Cmd+K focus shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (elements.searchInput) {
        elements.searchInput.focus();
        elements.searchInput.select();
      }
    }
  });

  // ==========================================================================
  // Sidebar Navigation Handling
  // ==========================================================================
  elements.sidebarNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const navTarget = link.getAttribute('data-nav');
      if (!navTarget) return;

      elements.sidebarNavLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      state.activeNav = navTarget;

      // Close mobile drawer if open
      closeSidebar();

      if (navTarget === 'dashboard') {
        state.selectedCategory = 'all';
        renderCategories();
        renderRecentContent();
        showToast('Viewing Dashboard');
      } else if (navTarget === 'favorites') {
        renderRecentContent();
        showToast('Showing Favorited Items');
      } else if (navTarget === 'categories') {
        const catSection = document.getElementById('categoriesSection');
        if (catSection) {
          catSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        showToast(`${link.querySelector('span').textContent} section active`);
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

  if (elements.mobileMenuBtn) {
    elements.mobileMenuBtn.addEventListener('click', openSidebar);
  }
  if (elements.sidebarCloseBtn) {
    elements.sidebarCloseBtn.addEventListener('click', closeSidebar);
  }
  if (elements.sidebarBackdrop) {
    elements.sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  // ==========================================================================
  // Add Content Modal
  // ==========================================================================
  const openModal = () => {
    elements.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    const firstInput = document.getElementById('contentTitle');
    if (firstInput) setTimeout(() => firstInput.focus(), 50);
  };

  const closeModal = () => {
    elements.modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (elements.addContentForm) elements.addContentForm.reset();
  };

  if (elements.addContentBtn) {
    elements.addContentBtn.addEventListener('click', openModal);
  }
  if (elements.modalCloseBtn) {
    elements.modalCloseBtn.addEventListener('click', closeModal);
  }
  if (elements.modalCancelBtn) {
    elements.modalCancelBtn.addEventListener('click', closeModal);
  }
  if (elements.modalOverlay) {
    elements.modalOverlay.addEventListener('click', (e) => {
      if (e.target === elements.modalOverlay) {
        closeModal();
      }
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Modal Form Submission
  if (elements.addContentForm) {
    elements.addContentForm.addEventListener('submit', (e) => {
      e.preventDefault();

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
    renderStats();
    renderCategories();
    renderRecentContent();
  });

  // ==========================================================================
  // Initialize Page
  // ==========================================================================
  updateGreeting();
  renderStats();
  renderCategories();
  renderRecentContent();
});
