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

// Initial Mock Content Items (Tailored with requested items and explicit stored vs external models)
const INITIAL_CONTENT_ITEMS = [
  {
    id: 'item-1',
    title: 'Java Collections Notes',
    type: 'document',
    storageType: 'stored',
    category: 'Coding',
    categoryId: 'coding',
    tags: ['java', 'dsa', 'backend'],
    dateDisplay: 'Today',
    timestamp: Date.now() - 3600000,
    isFavorite: true,
    description: 'Important concepts and examples for Java Collections framework including List, Set, and Map internals, thread safety, and time complexity tradeoffs.',
    url: '',
    documentMeta: {
      fileName: 'Java_Collections_Mastery_Guide.pdf',
      fileSize: 1845000,
      fileSizeFormatted: '1.8 MB',
      fileType: 'PDF Document',
      pagesCount: 14,
      sections: [
        '1. Hierarchy Overview (Iterable, Collection, Map)',
        '2. ArrayList vs LinkedList internal memory layout & amortized O(1)',
        '3. HashMap hashing algorithm & Collision Resolution (Treeify threshold = 8)',
        '4. ConcurrentHashMap locking & CAS bucket updates',
        '5. PriorityQueue binary heap and Comparable vs Comparator'
      ]
    }
  },
  {
    id: 'item-2',
    title: 'Spring Boot REST API Tutorial',
    type: 'video',
    storageType: 'external',
    category: 'Coding',
    categoryId: 'coding',
    tags: ['java', 'spring-boot', 'backend', 'rest-api'],
    dateDisplay: 'Yesterday',
    timestamp: Date.now() - 86400000,
    isFavorite: true,
    platform: 'YouTube',
    resourceType: 'YouTube Video',
    url: 'https://www.youtube.com/watch?v=9SGDpanrc8U',
    domain: 'youtube.com',
    whySaved: 'Good explanation of REST controllers. I want to revisit this when I start building my Spring Boot backend.',
    revisitStatus: 'to-revisit',
    savedDate: 'September 17, 2026',
    description: 'Comprehensive walkthrough on building production-ready REST controllers with validation, global exception handling, and JPA integration.'
  },
  {
    id: 'item-3',
    title: 'Spring Boot Learning Notes',
    type: 'note',
    storageType: 'stored',
    category: 'Coding',
    categoryId: 'coding',
    tags: ['spring-boot', 'java', 'backend'],
    dateDisplay: '2 days ago',
    timestamp: Date.now() - 172800000,
    isFavorite: true,
    createdDate: 'September 15, 2026',
    updatedDate: 'September 16, 2026',
    description: 'Personal study notes breaking down Spring Boot core architecture, essential annotations, and database transaction boundaries.',
    noteBody: `# Spring Boot Core Architecture & Annotations

## 1. Core Component Stereotypes
- **@RestController**: Combines \`@Controller\` and \`@ResponseBody\`. Converts return types into JSON/XML responses automatically using Jackson HttpMessageConverter.
- **@Service**: Marks classes holding core business logic. Keeps controllers lightweight and decoupled.
- **@Repository**: Encapsulates persistence logic and catches platform-specific exceptions, rethrowing them as Spring's unified DataAccessException hierarchy.

## 2. Request Handling Patterns
When constructing REST endpoints, adhere strictly to HTTP verbs:
- **GET /api/v1/resources**: Retrieve collection or filtered subset
- **POST /api/v1/resources**: Create new resource, returns HTTP 201 Created with Location header
- **PUT /api/v1/resources/{id}**: Idempotent full replacement of the resource
- **PATCH /api/v1/resources/{id}**: Partial update for specific fields
- **DELETE /api/v1/resources/{id}**: Remove resource, returns HTTP 204 No Content

## 3. Dependency Injection & Inversion of Control
Always prefer Constructor Injection over Field Injection (\`@Autowired\` directly on private fields):
- Guarantees immutable dependencies (fields can be marked \`final\`)
- Prevents NullPointerExceptions during unit testing without requiring ReflectionTestUtils
- Avoids circular dependency traps at startup

## 4. Key Takeaways for Project Backend
- Configure GlobalExceptionHandler using \`@ControllerAdvice\` and \`@ExceptionHandler\`
- Implement validation constraints via \`jakarta.validation.constraints\`
- Keep DTOs immutable using modern Java Records`
  },
  {
    id: 'item-4',
    title: 'UI Design Inspiration',
    type: 'image',
    storageType: 'stored',
    category: 'Design',
    categoryId: 'design',
    tags: ['ui', 'inspiration', 'dashboard'],
    dateDisplay: '3 days ago',
    timestamp: Date.now() - 259200000,
    isFavorite: true,
    description: 'Modern clean dashboard inspiration showcasing minimal SaaS design, balanced whitespace, card layouts, and subtle borders.',
    imageMeta: {
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85',
      resolution: '1920 × 1080',
      fileSize: '1.4 MB',
      fileType: 'PNG Image'
    },
    url: ''
  },
  {
    id: 'item-5',
    title: 'Spring Boot Documentation',
    type: 'link',
    storageType: 'external',
    category: 'Coding',
    categoryId: 'coding',
    tags: ['spring-boot', 'docs', 'java'],
    dateDisplay: '4 days ago',
    timestamp: Date.now() - 345600000,
    isFavorite: false,
    platform: 'Spring.io',
    resourceType: 'Documentation',
    url: 'https://docs.spring.io/spring-boot/docs/current/reference/html/',
    domain: 'spring.io',
    whySaved: 'Official reference manual for spring-boot-starter-web configurations, security filters, and application.properties references.',
    revisitStatus: 'in-progress',
    savedDate: 'September 13, 2026',
    description: 'Complete official Spring Boot reference guides and configuration property documentation.'
  },
  {
    id: 'item-6',
    title: 'Spring Security Guide',
    type: 'link',
    storageType: 'external',
    category: 'Coding',
    categoryId: 'coding',
    tags: ['spring-boot', 'security', 'backend'],
    dateDisplay: '5 days ago',
    timestamp: Date.now() - 432000000,
    isFavorite: false,
    platform: 'Spring.io',
    resourceType: 'Article',
    url: 'https://spring.io/guides/tutorials/rest',
    domain: 'spring.io',
    whySaved: 'Covers modern stateless JWT authentication filter chain without using deprecated WebSecurityConfigurerAdapter.',
    revisitStatus: 'to-revisit',
    savedDate: 'September 12, 2026',
    description: 'Step-by-step guide to modern Spring Security 6, JWT filters, and role-based route authorizations.'
  },
  {
    id: 'item-7',
    title: 'System Design Primer Notes',
    type: 'note',
    storageType: 'stored',
    category: 'Career',
    categoryId: 'career',
    tags: ['system-design', 'scalability', 'interview'],
    dateDisplay: 'Sep 08, 2026',
    timestamp: Date.now() - 691200000,
    isFavorite: true,
    createdDate: 'September 08, 2026',
    updatedDate: 'September 10, 2026',
    description: 'Comprehensive takeaways covering Caching strategies, Load Balancing, CDN distribution, and CAP Theorem trade-offs.',
    noteBody: `# System Design Architecture & Scalability Fundamentals

## 1. Horizontal vs Vertical Scaling
- **Scale Up (Vertical)**: Adding more RAM and CPU cores to a single machine. Limited by hardware bottlenecks and introduces a single point of failure (SPOF).
- **Scale Out (Horizontal)**: Distributing load across a pool of commodity hardware instances behind reverse proxies. Requires stateless application tiers.

## 2. Caching Strategies & Invalidation
- **Cache-Aside (Lazy Loading)**: Application queries cache first. On miss, queries DB, writes to cache, and returns. Good for read-heavy workloads with sparse changes.
- **Write-Through**: Write to cache and DB simultaneously. Minimizes stale reads but adds write latency.
- **Write-Behind (Write-Back)**: Writes to cache immediately and asynchronously flushes batches to persistent storage. High throughput with slight durability risk during unexpected crashes.

## 3. Database Partitioning & Sharding
- **Vertical Partitioning**: Splitting tables by domain boundary (e.g. Users table vs Billing table).
- **Horizontal Sharding**: Splitting rows across database clusters using consistent hashing based on Shard Key (e.g., hash(userId) % numberOfNodes).`
  },
  {
    id: 'item-8',
    title: 'Cloud VPC Architecture Diagrams',
    type: 'image',
    storageType: 'stored',
    category: 'Projects',
    categoryId: 'projects',
    tags: ['aws', 'cloud', 'architecture'],
    dateDisplay: 'Sep 05, 2026',
    timestamp: Date.now() - 950400000,
    isFavorite: false,
    description: 'High-resolution diagram illustrating multi-tier AWS VPC layout, public/private subnets, and NAT Gateway routing.',
    imageMeta: {
      imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1400&q=85',
      resolution: '1600 × 900',
      fileSize: '890 KB',
      fileType: 'PNG Diagram'
    },
    url: ''
  },
  {
    id: 'item-9',
    title: 'DSA Practice Sheet',
    type: 'document',
    storageType: 'stored',
    category: 'Study',
    categoryId: 'study',
    tags: ['dsa', 'practice', 'interview'],
    dateDisplay: 'Sep 02, 2026',
    timestamp: Date.now() - 1209600000,
    isFavorite: false,
    description: 'Curated list of high-frequency interview coding patterns: Sliding Window, Binary Search, and Tree traversals.',
    documentMeta: {
      fileName: 'NeetCode_75_DSA_Roadmap_Worksheet.pdf',
      fileSize: 3410000,
      fileSizeFormatted: '3.4 MB',
      fileType: 'PDF Document',
      pagesCount: 28,
      sections: [
        '1. Arrays & Hashing (Two Sum, Group Anagrams, Top K Frequent)',
        '2. Two Pointers & Sliding Window (3Sum, Trapping Rain Water)',
        '3. Stack & Monotonic Queues (Valid Parentheses, Daily Temperatures)',
        '4. Binary Search & Modified Rotated Array Search',
        '5. Trees, BFS/DFS & Lowest Common Ancestor',
        '6. Dynamic Programming & 2D Memoization'
      ]
    },
    url: 'https://neetcode.io'
  },
  {
    id: 'item-10',
    title: 'Awesome System Design GitHub',
    type: 'link',
    storageType: 'external',
    category: 'Career',
    categoryId: 'career',
    tags: ['system-design', 'github', 'architecture'],
    dateDisplay: 'Aug 28, 2026',
    timestamp: Date.now() - 1641600000,
    isFavorite: false,
    platform: 'GitHub',
    resourceType: 'GitHub Repository',
    url: 'https://github.com/donnemartin/system-design-primer',
    domain: 'github.com',
    whySaved: 'Huge collection of real-world architecture breakdowns from Uber, Netflix, and Twitter. Essential study material for technical interview prep.',
    revisitStatus: 'to-revisit',
    savedDate: 'August 28, 2026',
    description: 'Learn how to design large-scale systems and prepare for the system design interview.'
  },
  {
    id: 'item-11',
    title: 'MDN Web Docs: JavaScript Event Loop',
    type: 'link',
    storageType: 'external',
    category: 'Coding',
    categoryId: 'coding',
    tags: ['javascript', 'async', 'event-loop'],
    dateDisplay: 'Aug 22, 2026',
    timestamp: Date.now() - 2160000000,
    isFavorite: false,
    platform: 'MDN Web Docs',
    resourceType: 'Documentation',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop',
    domain: 'developer.mozilla.org',
    whySaved: 'Clear diagrams on microtask vs macrotask execution order. Crucial for understanding promise resolution timing in interviews.',
    revisitStatus: 'completed',
    savedDate: 'August 22, 2026',
    description: 'In-depth explanation of JavaScript runtime concurrency model based on an event loop, task queues, and call stack frames.'
  },
  {
    id: 'item-12',
    title: 'Software Engineer Resume Checklist',
    type: 'document',
    storageType: 'stored',
    category: 'Career',
    categoryId: 'career',
    tags: ['resume', 'career', 'portfolio'],
    dateDisplay: 'Aug 15, 2026',
    timestamp: Date.now() - 2764800000,
    isFavorite: true,
    description: 'ATS optimization checklist, action verbs, quantified metrics, and portfolio link guidelines for tech roles.',
    documentMeta: {
      fileName: 'SWE_Resume_Audit_Checklist.pdf',
      fileSize: 460000,
      fileSizeFormatted: '450 KB',
      fileType: 'PDF Document',
      pagesCount: 4,
      sections: [
        '1. Single page standard formatting & ATS parser testing',
        '2. XYZ Resume formula (Accomplished [X] as measured by [Y], by doing [Z])',
        '3. High impact technical skills inventory',
        '4. GitHub and portfolio live links verification'
      ]
    },
    url: ''
  }
];

// In-Memory Reactive State with localStorage persistence
const STORAGE_KEY = 'digitalvault_content_items_v2';
const CATEGORIES_STORAGE_KEY = 'digitalvault_categories_v2';

class ContentDataStore {
  constructor() {
    this.categories = this.loadCategoriesFromStorage();
    this.items = this.loadFromStorage();
    this.listeners = [];
  }

  loadCategoriesFromStorage() {
    try {
      const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with initial categories to preserve defaults
          const existingIds = new Set(parsed.map(c => c.id));
          const missingDefaults = INITIAL_CATEGORIES.filter(c => !existingIds.has(c.id));
          return [...parsed, ...missingDefaults];
        }
      }
    } catch (e) {
      console.warn('Could not load categories from localStorage:', e);
    }
    return [...INITIAL_CATEGORIES];
  }

  saveCategoriesToStorage() {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(this.categories));
    } catch (e) {
      console.warn('Could not save categories to localStorage:', e);
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with INITIAL_CONTENT_ITEMS to ensure rich details are present
          return parsed.map(item => {
            const initialMatch = INITIAL_CONTENT_ITEMS.find(i => i.id === item.id);
            if (initialMatch) {
              return { ...initialMatch, ...item };
            }
            const isExternal = item.storageType === 'external' || item.type === 'link' || item.type === 'video' || Boolean(item.url && item.type !== 'document');
            return {
              storageType: isExternal ? 'external' : 'stored',
              platform: item.platform || (isExternal ? (item.type === 'video' ? 'YouTube' : 'Website') : undefined),
              resourceType: item.resourceType || (isExternal ? (item.type === 'video' ? 'YouTube Video' : 'Website') : undefined),
              revisitStatus: item.revisitStatus || 'to-revisit',
              whySaved: item.whySaved || item.description || '',
              ...item
            };
          });
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
    this.saveCategoriesToStorage();
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

  // Get categories with dynamic counts and recent item previews
  getCategories() {
    return this.categories.map(cat => {
      const matchingItems = this.items.filter(item => 
        item.categoryId === cat.id || 
        item.category.toLowerCase() === cat.name.toLowerCase()
      );
      const count = matchingItems.length;
      const recentPreviews = matchingItems.slice(0, 3).map(i => ({
        id: i.id,
        title: i.title,
        type: i.type,
        dateDisplay: i.dateDisplay
      }));

      return {
        ...cat,
        count,
        recentPreviews
      };
    });
  }

  // Add new Category with duplicate check
  addCategory({ name, icon, description, accentClass }) {
    const trimmedName = name ? name.trim() : '';
    if (!trimmedName) {
      throw new Error('Category name is required.');
    }

    // Duplicate check (case-insensitive)
    const exists = this.categories.some(c => c.name.toLowerCase() === trimmedName.toLowerCase());
    if (exists) {
      throw new Error(`A category named "${trimmedName}" already exists.`);
    }

    const slug = trimmedName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const accentPalettes = ['cat-coding', 'cat-study', 'cat-career', 'cat-projects', 'cat-design', 'cat-personal'];
    const chosenAccent = accentClass || accentPalettes[this.categories.length % accentPalettes.length];

    const newCategory = {
      id: slug || `cat-${Date.now()}`,
      name: trimmedName,
      slug: slug || `cat-${Date.now()}`,
      icon: icon || 'folder-git',
      accentClass: chosenAccent,
      description: description ? description.trim() : `Saved resources for ${trimmedName}`
    };

    this.categories.push(newCategory);
    this.notify();
    return newCategory;
  }

  // Calculate statistics
  getStats() {
    const total = this.items.length;
    const documents = this.items.filter(i => i.type === 'document').length;
    const images = this.items.filter(i => i.type === 'image').length;
    const videos = this.items.filter(i => i.type === 'video').length;
    const notes = this.items.filter(i => i.type === 'note').length;
    const links = this.items.filter(i => i.type === 'link').length;
    const favorites = this.items.filter(i => i.isFavorite).length;

    return {
      total,
      documents,
      images,
      videos,
      notes,
      links,
      favorites,
      categoriesCount: this.categories.length
    };
  }

  // Get favorite items directly
  getFavorites(sort = 'recent') {
    return this.filterItems({ onlyFavorites: true, sort });
  }

  // Filter & Sort content
  filterItems({ search = '', category = 'all', type = 'all', onlyFavorites = false, sort = 'recent' } = {}) {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = this.items.filter(item => {
      // Search matching (title, description, tags, category, platform, whySaved)
      if (normalizedSearch) {
        const matchesTitle = item.title.toLowerCase().includes(normalizedSearch);
        const matchesDesc = item.description ? item.description.toLowerCase().includes(normalizedSearch) : false;
        const matchesTags = item.tags ? item.tags.some(tag => tag.toLowerCase().includes(normalizedSearch)) : false;
        const matchesCategory = item.category.toLowerCase().includes(normalizedSearch);
        const matchesPlatform = item.platform ? item.platform.toLowerCase().includes(normalizedSearch) : false;
        const matchesWhySaved = item.whySaved ? item.whySaved.toLowerCase().includes(normalizedSearch) : false;

        if (!matchesTitle && !matchesDesc && !matchesTags && !matchesCategory && !matchesPlatform && !matchesWhySaved) {
          return false;
        }
      }

      // Category matching
      if (category && category !== 'all') {
        const catLower = category.toLowerCase();
        const itemCatId = (item.categoryId || '').toLowerCase();
        const itemCatName = (item.category || '').toLowerCase();
        if (itemCatId !== catLower && itemCatName !== catLower) {
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

  // Find 3-4 related items based on category and shared tags
  getRelatedItems(itemId, limit = 4) {
    const current = this.getItem(itemId);
    if (!current) return [];

    const others = this.items.filter(i => i.id !== itemId);

    const scored = others.map(item => {
      let score = 0;
      if (item.category && current.category && item.category.toLowerCase() === current.category.toLowerCase()) {
        score += 3;
      }
      if (current.tags && item.tags) {
        const sharedTags = item.tags.filter(t => current.tags.includes(t));
        score += sharedTags.length * 2;
      }
      return { item, score };
    });

    scored.sort((a, b) => b.score - a.score || b.item.timestamp - a.item.timestamp);
    return scored.slice(0, limit).map(s => s.item);
  }

  // Add new item
  addItem(itemData) {
    const isExternal = itemData.type === 'link' || itemData.type === 'video' || (itemData.url && itemData.type !== 'document');

    const newItem = {
      id: 'item-' + Date.now(),
      title: itemData.title,
      type: itemData.type || 'document',
      storageType: isExternal ? 'external' : 'stored',
      category: itemData.category || 'Coding',
      categoryId: (itemData.category || 'coding').toLowerCase(),
      tags: itemData.tags ? itemData.tags.map(t => t.trim().toLowerCase()).filter(Boolean) : [],
      dateDisplay: 'Today',
      timestamp: Date.now(),
      isFavorite: Boolean(itemData.isFavorite),
      description: itemData.description || '',
      url: itemData.url || '',
      thumbnailUrl: itemData.thumbnailUrl || '',
      fileData: itemData.fileData || null,
      platform: isExternal ? (itemData.platform || (itemData.type === 'video' ? 'YouTube' : 'Website')) : undefined,
      resourceType: isExternal ? (itemData.resourceType || (itemData.type === 'video' ? 'YouTube Video' : 'Website')) : undefined,
      revisitStatus: 'to-revisit',
      whySaved: itemData.whySaved || itemData.description || '',
      noteBody: itemData.noteBody || (itemData.type === 'note' ? itemData.description : '')
    };

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
    if (updatedData.whySaved !== undefined) item.whySaved = updatedData.whySaved;
    if (updatedData.revisitStatus !== undefined) item.revisitStatus = updatedData.revisitStatus;
    if (updatedData.noteBody !== undefined) item.noteBody = updatedData.noteBody;

    this.notify();
    return item;
  }

  // Update revisit status
  updateRevisitStatus(itemId, status) {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.revisitStatus = status;
      this.notify();
      return item;
    }
    return null;
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

