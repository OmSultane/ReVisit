/**
 * Digital Content Organizer (DigitalVault)
 * Mock Data Store & Service Layer
 * 
 * Provides structured access to categories, statistics, and content items.
 * Easily replaceable with REST/GraphQL API calls in subsequent phases.
 */

// Initial Category Definitions
const INITIAL_CATEGORIES = [
  {
    id: 'coding',
    name: 'Coding',
    slug: 'coding',
    icon: 'code',
    accentClass: 'cat-coding',
    description: 'Code snippets, tutorials, backend frameworks, and scripts'
  },
  {
    id: 'study',
    name: 'Study',
    slug: 'study',
    icon: 'book-open',
    accentClass: 'cat-study',
    description: 'Academic coursework, DSA sheets, exam notes, and guides'
  },
  {
    id: 'career',
    name: 'Career',
    slug: 'career',
    icon: 'briefcase',
    accentClass: 'cat-career',
    description: 'Resumes, interview preparation, system design, and job leads'
  },
  {
    id: 'projects',
    name: 'Projects',
    slug: 'projects',
    icon: 'folder-git',
    accentClass: 'cat-projects',
    description: 'Project documentation, architecture diagrams, and task notes'
  },
  {
    id: 'design',
    name: 'Design',
    slug: 'design',
    icon: 'palette',
    accentClass: 'cat-design',
    description: 'UI/UX inspiration, style guides, and design assets'
  },
  {
    id: 'personal',
    name: 'Personal',
    slug: 'personal',
    icon: 'user',
    accentClass: 'cat-personal',
    description: 'Personal goals, reading lists, journals, and bookmarks'
  }
];

// Initial Mock Content Items (Tailored with requested items)
const INITIAL_CONTENT_ITEMS = [
  {
    id: 'item-1',
    title: 'Java Collections Notes',
    type: 'document',
    category: 'Coding',
    categoryId: 'coding',
    tags: ['java', 'dsa'],
    dateDisplay: 'Today',
    timestamp: Date.now() - 3600000,
    isFavorite: true,
    description: 'Important concepts and examples for Java Collections framework including List, Set, and Map internals.',
    url: 'https://docs.oracle.com/en/java/'
  },
  {
    id: 'item-2',
    title: 'Spring Boot Tutorial',
    type: 'link',
    category: 'Coding',
    categoryId: 'coding',
    tags: ['java', 'spring-boot'],
    dateDisplay: 'Yesterday',
    timestamp: Date.now() - 86400000,
    isFavorite: true,
    description: 'Useful Spring Boot tutorial to revisit later with full code examples for building REST APIs.',
    url: 'https://spring.io/guides'
  },
  {
    id: 'item-3',
    title: 'DSA Practice Sheet',
    type: 'document',
    category: 'Study',
    categoryId: 'study',
    tags: ['dsa', 'practice'],
    dateDisplay: '2 days ago',
    timestamp: Date.now() - 172800000,
    isFavorite: false,
    description: 'Curated list of high-frequency interview coding patterns: Sliding Window, Binary Search, and Tree traversals.',
    url: 'https://neetcode.io'
  },
  {
    id: 'item-4',
    title: 'UI Design Inspiration',
    type: 'image',
    category: 'Design',
    categoryId: 'design',
    tags: ['ui', 'inspiration'],
    dateDisplay: '3 days ago',
    timestamp: Date.now() - 259200000,
    isFavorite: true,
    description: 'Modern clean dashboard inspiration showcasing minimal SaaS design, glassmorphism, and balanced whitespace.',
    url: 'https://dribbble.com'
  },
  {
    id: 'item-5',
    title: 'Semester Project Ideas',
    type: 'note',
    category: 'Projects',
    categoryId: 'projects',
    tags: ['college', 'ideas'],
    dateDisplay: '4 days ago',
    timestamp: Date.now() - 345600000,
    isFavorite: false,
    description: 'Brainstorming topics and feature wishlist for the upcoming major semester capstone submission.',
    url: ''
  },
  {
    id: 'item-6',
    title: 'JavaScript Async Tutorial',
    type: 'video',
    category: 'Coding',
    categoryId: 'coding',
    tags: ['javascript', 'async'],
    dateDisplay: '5 days ago',
    timestamp: Date.now() - 432000000,
    isFavorite: false,
    description: 'Deep dive video on the JavaScript Event Loop, Microtask Queue, Promises, and modern async/await patterns.',
    url: 'https://youtube.com'
  },
  {
    id: 'item-7',
    title: 'System Design Primer Notes',
    type: 'note',
    category: 'Career',
    categoryId: 'career',
    tags: ['system-design', 'scalability', 'interview'],
    dateDisplay: 'Sep 08, 2026',
    timestamp: Date.now() - 691200000,
    isFavorite: true,
    description: 'Comprehensive takeaways covering Caching strategies, Load Balancing, CDN distribution, and CAP Theorem trade-offs.',
    url: ''
  },
  {
    id: 'item-8',
    title: 'Cloud VPC Architecture Diagrams',
    type: 'image',
    category: 'Projects',
    categoryId: 'projects',
    tags: ['aws', 'cloud', 'architecture'],
    dateDisplay: 'Sep 05, 2026',
    timestamp: Date.now() - 950400000,
    isFavorite: false,
    description: 'High-resolution diagram illustrating multi-tier AWS VPC layout, public/private subnets, and NAT Gateway routing.',
    url: ''
  },
  {
    id: 'item-9',
    title: 'Software Engineer Resume Checklist',
    type: 'document',
    category: 'Career',
    categoryId: 'career',
    tags: ['resume', 'career', 'portfolio'],
    dateDisplay: 'Sep 02, 2026',
    timestamp: Date.now() - 1209600000,
    isFavorite: true,
    description: 'ATS optimization checklist, action verbs, quantified metrics, and portfolio link guidelines for tech roles.',
    url: ''
  },
  {
    id: 'item-10',
    title: 'Web Development Resources & Guides',
    type: 'link',
    category: 'Projects',
    categoryId: 'projects',
    tags: ['frontend', 'css', 'tools'],
    dateDisplay: 'Aug 28, 2026',
    timestamp: Date.now() - 1641600000,
    isFavorite: false,
    description: 'Bookmarked list of accessible SVG icon packs, modern color palettes, CSS layout tricks, and frontend utilities.',
    url: 'https://developer.mozilla.org'
  }
];

// In-Memory Reactive State with localStorage persistence
const STORAGE_KEY = 'digitalvault_content_items_v1';

class ContentDataStore {
  constructor() {
    this.categories = [...INITIAL_CATEGORIES];
    this.items = this.loadFromStorage();
    this.listeners = [];
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not load from localStorage:', e);
    }
    return [...INITIAL_CONTENT_ITEMS];
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  // Subscribe to changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveToStorage();
    this.listeners.forEach(fn => fn());
  }

  // Get all content items
  getItems() {
    return [...this.items];
  }

  // Get single item by ID
  getItem(itemId) {
    return this.items.find(i => i.id === itemId) || null;
  }

  // Get categories with dynamic counts
  getCategories() {
    return this.categories.map(cat => {
      const count = this.items.filter(item => 
        item.categoryId === cat.id || 
        item.category.toLowerCase() === cat.name.toLowerCase()
      ).length;
      return {
        ...cat,
        count
      };
    });
  }

  // Calculate statistics
  getStats() {
    const total = this.items.length;
    const documents = this.items.filter(i => i.type === 'document').length;
    const images = this.items.filter(i => i.type === 'image').length;
    const videos = this.items.filter(i => i.type === 'video').length;
    const notes = this.items.filter(i => i.type === 'note').length;
    const links = this.items.filter(i => i.type === 'link').length;

    return {
      total,
      documents,
      images,
      videos,
      notes,
      links
    };
  }

  // Filter & Sort content
  filterItems({ search = '', category = 'all', type = 'all', onlyFavorites = false, sort = 'recent' } = {}) {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = this.items.filter(item => {
      // Search matching (title, description, tags, category)
      if (normalizedSearch) {
        const matchesTitle = item.title.toLowerCase().includes(normalizedSearch);
        const matchesDesc = item.description ? item.description.toLowerCase().includes(normalizedSearch) : false;
        const matchesTags = item.tags ? item.tags.some(tag => tag.toLowerCase().includes(normalizedSearch)) : false;
        const matchesCategory = item.category.toLowerCase().includes(normalizedSearch);

        if (!matchesTitle && !matchesDesc && !matchesTags && !matchesCategory) {
          return false;
        }
      }

      // Category matching
      if (category !== 'all') {
        const itemCat = (item.categoryId || item.category).toLowerCase();
        if (itemCat !== category.toLowerCase()) {
          return false;
        }
      }

      // Type matching
      if (type !== 'all') {
        if (item.type.toLowerCase() !== type.toLowerCase()) {
          return false;
        }
      }

      // Favorites filter
      if (onlyFavorites && !item.isFavorite) {
        return false;
      }

      return true;
    });

    // Sorting
    if (sort === 'oldest') {
      filtered.sort((a, b) => a.timestamp - b.timestamp);
    } else if (sort === 'alpha-asc' || sort === 'a-z') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'alpha-desc' || sort === 'z-a') {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    } else {
      // Default: 'recent' (newest first)
      filtered.sort((a, b) => b.timestamp - a.timestamp);
    }

    return filtered;
  }

  // Add new item
  addItem(itemData) {
    const newItem = {
      id: 'item-' + Date.now(),
      title: itemData.title,
      type: itemData.type || 'document',
      category: itemData.category || 'Coding',
      categoryId: (itemData.category || 'coding').toLowerCase(),
      tags: itemData.tags ? itemData.tags.map(t => t.trim().toLowerCase()).filter(Boolean) : [],
      dateDisplay: 'Today',
      timestamp: Date.now(),
      isFavorite: Boolean(itemData.isFavorite),
      description: itemData.description || '',
      url: itemData.url || '',
      thumbnailUrl: itemData.thumbnailUrl || '',
      fileData: itemData.fileData || null
    };

    // Prepend new item
    this.items.unshift(newItem);
    this.notify();
    return newItem;
  }

  // Update existing item
  updateItem(itemId, updatedData) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return null;

    if (updatedData.title !== undefined) item.title = updatedData.title;
    if (updatedData.type !== undefined) item.type = updatedData.type;
    if (updatedData.category !== undefined) {
      item.category = updatedData.category;
      item.categoryId = updatedData.category.toLowerCase();
    }
    if (updatedData.tags !== undefined) {
      item.tags = updatedData.tags.map(t => t.trim().toLowerCase()).filter(Boolean);
    }
    if (updatedData.description !== undefined) item.description = updatedData.description;
    if (updatedData.url !== undefined) item.url = updatedData.url;

    this.notify();
    return item;
  }

  // Toggle favorite status
  toggleFavorite(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.isFavorite = !item.isFavorite;
      this.notify();
      return item;
    }
    return null;
  }

  // Delete item
  deleteItem(itemId) {
    const index = this.items.findIndex(i => i.id === itemId);
    if (index !== -1) {
      const removed = this.items.splice(index, 1)[0];
      this.notify();
      return removed;
    }
    return null;
  }
}

// Export singleton instance
window.dataStore = new ContentDataStore();
