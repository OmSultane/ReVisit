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
    id: 'personal',
    name: 'Personal',
    slug: 'personal',
    icon: 'user',
    accentClass: 'cat-personal',
    description: 'Personal goals, reading lists, journals, and bookmarks'
  }
];

// Initial Mock Content Items
const INITIAL_CONTENT_ITEMS = [
  {
    id: 'item-1',
    title: 'Java Collections Framework Complete Notes',
    type: 'note',
    category: 'Study',
    categoryId: 'study',
    tags: ['java', 'dsa', 'cheat-sheet'],
    dateDisplay: '2 hours ago',
    timestamp: Date.now() - 7200000,
    isFavorite: true,
    description: 'Comprehensive breakdown of ArrayList, LinkedList, HashMap, TreeMap, and their internal implementations with time complexities.',
    url: 'https://docs.oracle.com/en/java/'
  },
  {
    id: 'item-2',
    title: 'Spring Boot 3 + PostgreSQL REST API Guide',
    type: 'video',
    category: 'Coding',
    categoryId: 'coding',
    tags: ['spring-boot', 'backend', 'rest-api'],
    dateDisplay: 'Yesterday',
    timestamp: Date.now() - 86400000,
    isFavorite: true,
    description: 'Full crash course walkthrough on building secure REST APIs using Spring Security 6 and Spring Data JPA.',
    url: 'https://spring.io/guides'
  },
  {
    id: 'item-3',
    title: 'DSA 75 Curated Practice Sheet & Solutions',
    type: 'document',
    category: 'Study',
    categoryId: 'study',
    tags: ['leetcode', 'algorithms', 'neetcode'],
    dateDisplay: '2 days ago',
    timestamp: Date.now() - 172800000,
    isFavorite: false,
    description: 'High-frequency coding interview problems categorized by pattern: Sliding Window, Two Pointers, and Binary Trees.',
    url: 'https://neetcode.io'
  },
  {
    id: 'item-4',
    title: 'Modern Web Development Resources & Tools',
    type: 'link',
    category: 'Projects',
    categoryId: 'projects',
    tags: ['frontend', 'css-tricks', 'design-system'],
    dateDisplay: 'Sep 12, 2026',
    timestamp: Date.now() - 345600000,
    isFavorite: false,
    description: 'Curated list of accessible SVG icon packs, modern color palettes, CSS layout tricks, and frontend utilities.',
    url: 'https://developer.mozilla.org'
  },
  {
    id: 'item-5',
    title: 'DigitalVault System Architecture Documentation',
    type: 'document',
    category: 'Projects',
    categoryId: 'projects',
    tags: ['architecture', 'specs', 'api-docs'],
    dateDisplay: 'Sep 10, 2026',
    timestamp: Date.now() - 518400000,
    isFavorite: false,
    description: 'Software requirements specifications, entity-relationship diagrams, and component breakdown for the organizer project.',
    url: ''
  },
  {
    id: 'item-6',
    title: 'System Design Primer & Caching Strategies',
    type: 'note',
    category: 'Career',
    categoryId: 'career',
    tags: ['system-design', 'scalability', 'interview'],
    dateDisplay: 'Sep 08, 2026',
    timestamp: Date.now() - 691200000,
    isFavorite: true,
    description: 'In-depth notes on Cache-Aside, Write-Through, Redis clustered setups, and database sharding techniques.',
    url: ''
  },
  {
    id: 'item-7',
    title: 'Cloud VPC Architecture & Subnet Diagrams',
    type: 'image',
    category: 'Projects',
    categoryId: 'projects',
    tags: ['aws', 'cloud', 'diagram'],
    dateDisplay: 'Sep 05, 2026',
    timestamp: Date.now() - 950400000,
    isFavorite: false,
    description: 'High-resolution diagram illustrating multi-tier architecture with public/private subnets and load balancer routing.',
    url: ''
  },
  {
    id: 'item-8',
    title: 'Software Engineer Resume & Portfolio Checklist',
    type: 'document',
    category: 'Career',
    categoryId: 'career',
    tags: ['resume', 'interview-prep', 'portfolio'],
    dateDisplay: 'Sep 02, 2026',
    timestamp: Date.now() - 1209600000,
    isFavorite: true,
    description: 'Action verb bullet formulations, ATS keyword optimization, and project deployment guidelines.',
    url: ''
  }
];

// In-Memory Reactive State
class ContentDataStore {
  constructor() {
    this.categories = [...INITIAL_CATEGORIES];
    this.items = [...INITIAL_CONTENT_ITEMS];
    this.listeners = [];
  }

  // Subscribe to changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }

  // Get all content items
  getItems() {
    return [...this.items];
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

  // Filter content
  filterItems({ search = '', category = 'all', type = 'all', onlyFavorites = false } = {}) {
    const normalizedSearch = search.trim().toLowerCase();

    return this.items.filter(item => {
      // Search matching (title, description, tags)
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
      dateDisplay: 'Just now',
      timestamp: Date.now(),
      isFavorite: false,
      description: itemData.description || '',
      url: itemData.url || ''
    };

    // Prepend new item
    this.items.unshift(newItem);
    this.notify();
    return newItem;
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
