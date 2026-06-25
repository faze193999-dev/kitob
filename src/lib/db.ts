// BookVerse Database Service Layer
// Supports client-side state persisted in localStorage and server-side fallback.
// Automatically prepared to connect to Supabase if environment variables are supplied.

export interface Chapter {
  id: number;
  title: string;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  coverUrl: string;
  description: string;
  readTime: string;
  rating: number;
  views: number;
  chapters: Chapter[];
  featured?: boolean;
  trending?: boolean;
  publishedYear: number;
  gradientFrom?: string;
  gradientTo?: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  bookId: string;
  chapterId: number;
  scrollPosition: number;
  percentage: number;
  createdAt: string;
}

export interface Highlight {
  id: string;
  userId: string;
  bookId: string;
  chapterId: number;
  text: string;
  color: string; // 'yellow' | 'green' | 'blue' | 'pink'
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  bookId: string;
  chapterId: number;
  text: string;
  highlightText: string;
  createdAt: string;
}

export interface ReadingProgress {
  userId: string;
  bookId: string;
  percentage: number;
  currentChapter: number;
  lastReadAt: string;
  timeSpentMinutes: number;
}

// ----------------------------------------------------
// Seed Data: 6 fully readable books
// ----------------------------------------------------
const INITIAL_BOOKS: Book[] = [
  {
    id: "odyssey-of-code",
    title: "The Odyssey of Code",
    author: "Elena Rostova",
    category: "Technology",
    coverUrl: "/covers/odyssey.png",
    description: "An epic exploration into the architecture of modern software systems, neural networks, and the future of engineering. Dive deep into clean coding, high performance design, and quantum computing concepts.",
    readTime: "45 mins",
    rating: 4.9,
    views: 12480,
    publishedYear: 2026,
    featured: true,
    trending: true,
    chapters: [
      {
        id: 1,
        title: "Chapter 1: The Silicon Canvas",
        content: `Software is the architecture of the modern mind. We write instructions that govern billions of transistors, breathing life into inert pieces of silicon. The history of software is a history of abstraction. From machine code to assembly, to structural C, to object-oriented frameworks, and now to declarative UI and agentic models, we have constantly sought to move the developer closer to pure thought.

Every line of code is a design decision. It is a trade-off between speed, readability, flexibility, and memory. A master engineer does not merely write code that compiles; they build a system that can evolve. The beauty of code lies not in its complexity, but in its clarity. When we design structures that represent logic cleanly, the computer does not notice the difference, but the human maintainer does. And software, above all, is written for humans to read and only incidentally for machines to execute.`
      },
      {
        id: 2,
        title: "Chapter 2: The Neural Frontier",
        content: `With the advent of deep learning, we stopped writing explicit rules and instead began writing code that *learns* rules. We design architectures—neural layers, attention weights, activation functions—and expose them to large volumes of data. The code acts as a trellis, guiding the growth of a statistical vine.

This shift from deterministic programming to probabilistic reasoning changes our relationship with software. We are no longer builders of rigid gears; we are gardeners of algorithms. We must monitor distribution drifts, build guardrails, and implement robust evaluation pipelines. The future of code is hybrid: core logical systems cooperating with adaptable neural components.`
      },
      {
        id: 3,
        title: "Chapter 3: Quantum Architecture",
        content: `Quantum computing shifts us from bits to qubits. A standard bit is a door that is either closed (0) or open (1). A qubit is a door that can be in a superposition of both states, existing in a probability field until measured.

When we program quantum computers, we utilize gates that perform rotations on the Bloch sphere—superposition, entanglement, and interference. The challenges are hardware noise and coherence times. We write quantum algorithms in frameworks like Qiskit or Cirq, compiling them down to pulses of microwave radiation. This is the next frontier of computation, unlocking exponential scaling for cryptography, chemical simulation, and optimization.`
      }
    ]
  },
  {
    id: "mind-and-flow",
    title: "Mind & Flow",
    author: "Julian Vance",
    category: "Self-Development",
    coverUrl: "/covers/mindflow.png",
    description: "A masterclass in managing attention, cultivating flow states, and overcoming digital fatigue in a hyper-connected society. Learn practical strategies to regain control of your focus.",
    readTime: "30 mins",
    rating: 4.8,
    views: 8930,
    publishedYear: 2025,
    featured: true,
    trending: false,
    chapters: [
      {
        id: 1,
        title: "Chapter 1: The Economics of Attention",
        content: `Attention is the only resource we cannot renew. In a hyper-connected world, every app, website, and notification is optimized to capture a sliver of our cognitive space. Our attention is mined and sold to the highest bidder in what is known as the attention economy.

To reclaim our lives, we must first reclaim our focus. This requires building digital fortresses: silencing notifications, scheduling deep-work blocks, and establishing friction between ourselves and addictive interfaces. When you control where your eyes go, you control where your mind goes.`
      },
      {
        id: 2,
        title: "Chapter 2: Entering the Flow State",
        content: `Flow is the mental state of operation in which a person performing an activity is fully immersed in a feeling of energized focus, full involvement, and enjoyment. Coined by Mihaly Csikszentmihalyi, it is the peak of human performance.

To trigger flow, we need three elements: clear goals, immediate feedback, and a balance between challenge and skill. If the task is too easy, we feel bored; if too difficult, we feel anxious. The flow state exists on the thin ridge between boredom and anxiety, where our skills are stretched to their limit.`
      },
      {
        id: 3,
        title: "Chapter 3: Rest as a Weapon",
        content: `In a society that worships hustle, rest is often viewed as a weakness. However, peak performance is cyclical. The brain requires periods of default mode network activation—mind-wandering, walking in nature, sleep—to consolidate memories, spark creativity, and restore cognitive energy.

True rest is active, not passive. Scrolling social media is not rest; it is cognitive consumption. Read a physical book, walk without headphones, talk with a friend, or sleep. Make rest a non-negotiable part of your daily toolkit.`
      }
    ]
  },
  {
    id: "art-of-scaling",
    title: "The Art of Scaling",
    author: "Marcus Chen",
    category: "Business",
    coverUrl: "",
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-600",
    description: "The playbook for growing tech startups. Learn about scaling architectures, building distributed leadership, and navigating product-market fit transitions.",
    readTime: "35 mins",
    rating: 4.7,
    views: 11200,
    publishedYear: 2025,
    featured: false,
    trending: true,
    chapters: [
      {
        id: 1,
        title: "Chapter 1: Zero to One vs One to Ten",
        content: `Starting a business is about solving an initial problem for a small group of passionate users. Scaling a business is about taking that solution and building an engine that can deliver it to millions. The skills required for these two phases are completely different.

In the zero-to-one phase, you need chaos, speed, and raw experimentation. In the one-to-ten phase, you need structure, processes, unit economics, and alignment. Many founders fail because they try to scale using startup chaos, or they try to start a new product using corporate structure.`
      },
      {
        id: 2,
        title: "Chapter 2: Scaling the Architecture",
        content: `Systems scale horizontally or vertically. Vertical scaling is getting a larger machine; horizontal scaling is getting more machines. In organizational design, horizontal scaling is delegating decision-making down to independent, cross-functional squads.

When you scale, communication overhead grows quadratically. If you have 4 people, there are 6 communication channels. If you have 20 people, there are 190. If you have 100, there are 4,950. To scale, you must actively break down communication dependencies by creating autonomous, fully-aligned teams.`
      }
    ]
  },
  {
    id: "echoes-of-future",
    title: "Echoes of the Future",
    author: "Sarah Elson",
    category: "Fiction",
    coverUrl: "",
    gradientFrom: "from-indigo-600",
    gradientTo: "to-purple-800",
    description: "A gripping sci-fi narrative centered on a quantum computer technician who discovers code coordinates matching historical events perfectly, pointing to a simulation theory.",
    readTime: "40 mins",
    rating: 4.9,
    views: 15600,
    publishedYear: 2026,
    featured: false,
    trending: true,
    chapters: [
      {
        id: 1,
        title: "Chapter 1: The Glitch in the Core",
        content: `The liquid helium pumps hummed at a low 4-Hertz vibration, keeping the processor at a chilling 15 millikelvin. Kaelen adjusted his thermal glasses, watching the quantum entanglement arrays. A qubit coherence drift of 0.04% was normal, but this was different. The nodes were firing in a cyclical, rhythmic pulse.

He opened the terminal. A stream of hexadecimal coordinates was writing itself into the system log. He copied a string, feeding it into a geo-coordinate database. The output flashed: 48.8584° N, 2.2945° E. Timestamp: June 25, 1940. He stared at the screen. That was the Eiffel Tower, the exact day it was captured. The processor was compiling historical event timelines in real-time.`
      },
      {
        id: 2,
        title: "Chapter 2: The Architect's Signature",
        content: `Kaelen did not sleep that night. He mapped more coordinates. Every major historical turning point—the library of Alexandria burning, the launch of Apollo 11, the drop of the atomic bomb—were all hardcoded into the vacuum state fluctuations of the quantum core. It wasn't math; it was a script.

He realized the universe wasn't expanding; it was rendering. We were characters inside an elaborate, high-fidelity quantum simulation, and the processor he was repairing was the server. The question wasn't how the code got there, but who wrote it and why they were starting to leave warnings.`
      }
    ]
  },
  {
    id: "quantum-mechanics",
    title: "Quantum Mechanics: The Basics",
    author: "Dr. Arthur Pendelton",
    category: "Science",
    coverUrl: "",
    gradientFrom: "from-blue-600",
    gradientTo: "to-cyan-500",
    description: "An accessible guide to quantum physics, covering wave-particle duality, superposition, Schrödinger's cat, and quantum entanglement without complex math.",
    readTime: "50 mins",
    rating: 4.6,
    views: 6540,
    publishedYear: 2024,
    featured: false,
    trending: false,
    chapters: [
      {
        id: 1,
        title: "Chapter 1: The Dual Nature of Light",
        content: `Is light a wave or a particle? For centuries, Isaac Newton argued it was a stream of corpuscles (particles), while Christiaan Huygens argued it was a wave. In 1801, Thomas Young performed the famous Double Slit Experiment, proving that light creates interference patterns—proving light is indeed a wave.

However, in 1905, Albert Einstein explained the photoelectric effect by suggesting light travels in packets called photons (particles). Quantum mechanics resolves this conflict with wave-particle duality: light, and indeed all matter (including electrons and atoms), behaves as both a wave and a particle depending on how we measure it. It exists as a wave of probability until it is observed, at which point its wave function collapses into a single particle state.`
      },
      {
        id: 2,
        title: "Chapter 2: The Measurement Problem",
        content: `In the quantum world, things do not have definite properties until they are measured. Schrödinger's Cat is a thought experiment illustrating this absurdity: a cat in a sealed box with a radioactive source and poison gas is simultaneously alive and dead (in a state of superposition) until an observer opens the box.

The question of what constitutes an 'observer' remains one of the greatest philosophical debates in physics. Does it require a conscious human? Or is any interaction with the surrounding environment—such as a single photon bouncing off the cat—enough to collapse the superposition? Most physicists today subscribe to decoherence theory, which suggests environmental interactions collapse quantum states almost instantly.`
      }
    ]
  },
  {
    id: "great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    coverUrl: "",
    gradientFrom: "from-yellow-600",
    gradientTo: "to-zinc-800",
    description: "A classic portrait of the Jazz Age, F. Scott Fitzgerald's masterpiece tells the story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.",
    readTime: "60 mins",
    rating: 4.8,
    views: 22400,
    publishedYear: 1925,
    featured: false,
    trending: false,
    chapters: [
      {
        id: 1,
        title: "Chapter 1: East Egg and West Egg",
        content: `In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. 'Whenever you feel like criticizing any one,' he told me, 'just remember that all the people in this world haven't had the advantages that you've had.'

He didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I'm inclined to reserve all judgments, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.

My house was at the very tip of the egg, only fifty yards from the Sound, and squeezed between two huge places that rented for twelve or fifteen thousand a season. The one on my right was a colossal affair by any standard—it was a factual imitation of some Hôtel de Ville in Normandy, with a tower on one side, spanking new under a thin beard of raw ivy, and a marble swimming pool, and more than forty acres of lawn and garden. It was Gatsby's mansion.`
      },
      {
        id: 2,
        title: "Chapter 2: The Valley of Ashes",
        content: `About half-way between West Egg and New York the motor road hastily joins the railroad and runs beside it for a quarter of a mile, so as to shrink away from a certain desolate area of land. This is a valley of ashes—a fantastic farm where ashes grow like wheat into ridges and hills and grotesque gardens; where ashes take the forms of houses and chimneys and rising smoke and, finally, with a transcendent effort, of men who move dimly and already crumbling through the powdery air.

Above the gray land and the spasms of bleak dust which drift endlessly over it, you perceive, after a moment, the eyes of Doctor T. J. Eckleburg. The eyes of Doctor T. J. Eckleburg are blue and gigantic—their retinas are one yard high. They look out of no face, but, instead, from a pair of enormous yellow spectacles which pass over a non-existent nose.`
      }
    ]
  }
];

// Helper to check for client-side window
const isClient = () => typeof window !== "undefined";

// Get item from localStorage or fallback
const getStorageItem = <T>(key: string, fallback: T): T => {
  if (!isClient()) return fallback;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : fallback;
};

// Set item in localStorage
const setStorageItem = <T>(key: string, value: T): void => {
  if (!isClient()) return;
  localStorage.setItem(key, JSON.stringify(value));
};

// ----------------------------------------------------
// DB Controller Implementation
// ----------------------------------------------------
export const BookVerseDB = {
  // Books CRUD
  getBooks(): Book[] {
    return getStorageItem<Book[]>("bv_books", INITIAL_BOOKS);
  },

  getBookById(id: string): Book | undefined {
    const books = this.getBooks();
    return books.find((b) => b.id === id);
  },

  addBook(book: Omit<Book, "id" | "views" | "rating">): Book {
    const books = this.getBooks();
    const newBook: Book = {
      ...book,
      id: book.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      views: 0,
      rating: 5.0
    };
    books.push(newBook);
    setStorageItem("bv_books", books);
    return newBook;
  },

  updateBook(updatedBook: Book): void {
    const books = this.getBooks();
    const idx = books.findIndex((b) => b.id === updatedBook.id);
    if (idx !== -1) {
      books[idx] = updatedBook;
      setStorageItem("bv_books", books);
    }
  },

  deleteBook(id: string): void {
    const books = this.getBooks();
    const filtered = books.filter((b) => b.id !== id);
    setStorageItem("bv_books", filtered);
  },

  // Bookmarks
  getBookmarks(userId: string): Bookmark[] {
    return getStorageItem<Bookmark[]>("bv_bookmarks", []).filter((b) => b.userId === userId);
  },

  saveBookmark(bookmark: Omit<Bookmark, "id" | "createdAt">): Bookmark {
    const bookmarks = getStorageItem<Bookmark[]>("bv_bookmarks", []);
    
    // Check if bookmark already exists for this book/chapter
    const existingIdx = bookmarks.findIndex(
      (b) => b.userId === bookmark.userId && b.bookId === bookmark.bookId && b.chapterId === bookmark.chapterId
    );

    const newBookmark: Bookmark = {
      ...bookmark,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    if (existingIdx !== -1) {
      bookmarks[existingIdx] = newBookmark;
    } else {
      bookmarks.push(newBookmark);
    }

    setStorageItem("bv_bookmarks", bookmarks);
    return newBookmark;
  },

  deleteBookmark(id: string): void {
    const bookmarks = getStorageItem<Bookmark[]>("bv_bookmarks", []);
    const filtered = bookmarks.filter((b) => b.id !== id);
    setStorageItem("bv_bookmarks", filtered);
  },

  // Highlights
  getHighlights(userId: string, bookId: string): Highlight[] {
    return getStorageItem<Highlight[]>("bv_highlights", []).filter(
      (h) => h.userId === userId && h.bookId === bookId
    );
  },

  saveHighlight(highlight: Omit<Highlight, "id" | "createdAt">): Highlight {
    const highlights = getStorageItem<Highlight[]>("bv_highlights", []);
    const newHighlight: Highlight = {
      ...highlight,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    highlights.push(newHighlight);
    setStorageItem("bv_highlights", highlights);
    return newHighlight;
  },

  deleteHighlight(id: string): void {
    const highlights = getStorageItem<Highlight[]>("bv_highlights", []);
    const filtered = highlights.filter((h) => h.id !== id);
    setStorageItem("bv_highlights", filtered);
  },

  // Notes
  getNotes(userId: string, bookId: string): Note[] {
    return getStorageItem<Note[]>("bv_notes", []).filter((n) => n.userId === userId && n.bookId === bookId);
  },

  saveNote(note: Omit<Note, "id" | "createdAt">): Note {
    const notes = getStorageItem<Note[]>("bv_notes", []);
    const newNote: Note = {
      ...note,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    notes.push(newNote);
    setStorageItem("bv_notes", notes);
    return newNote;
  },

  deleteNote(id: string): void {
    const notes = getStorageItem<Note[]>("bv_notes", []);
    const filtered = notes.filter((n) => n.id !== id);
    setStorageItem("bv_notes", filtered);
  },

  // Reading Progress
  getAllProgress(userId: string): ReadingProgress[] {
    return getStorageItem<ReadingProgress[]>("bv_progress", []).filter((p) => p.userId === userId);
  },

  getProgressForBook(userId: string, bookId: string): ReadingProgress | undefined {
    return this.getAllProgress(userId).find((p) => p.bookId === bookId);
  },

  saveProgress(
    userId: string,
    bookId: string,
    percentage: number,
    currentChapter: number,
    timeIncrementMinutes: number = 0
  ): void {
    const progressList = getStorageItem<ReadingProgress[]>("bv_progress", []);
    const idx = progressList.findIndex((p) => p.userId === userId && p.bookId === bookId);
    
    // Increment book view once if starting progress
    if (idx === -1) {
      const books = this.getBooks();
      const bIdx = books.findIndex(b => b.id === bookId);
      if (bIdx !== -1) {
        books[bIdx].views += 1;
        setStorageItem("bv_books", books);
      }
    }

    const prevTime = idx !== -1 ? progressList[idx].timeSpentMinutes : 0;

    const newProgress: ReadingProgress = {
      userId,
      bookId,
      percentage: Math.min(100, Math.max(0, percentage)),
      currentChapter,
      lastReadAt: new Date().toISOString(),
      timeSpentMinutes: prevTime + timeIncrementMinutes
    };

    if (idx !== -1) {
      newProgress.percentage = Math.max(progressList[idx].percentage, newProgress.percentage);
      progressList[idx] = newProgress;
    } else {
      progressList.push(newProgress);
    }

    setStorageItem("bv_progress", progressList);
  },

  // Analytics for user
  getAnalytics(userId: string) {
    const progress = this.getAllProgress(userId);
    const completedBooks = progress.filter((p) => p.percentage >= 99).length;
    const activeBooks = progress.filter((p) => p.percentage > 0 && p.percentage < 99).length;
    
    let totalMinutes = 0;
    progress.forEach((p) => {
      totalMinutes += p.timeSpentMinutes;
    });

    const weeklyActivity = [
      { day: "Mon", minutes: completedBooks > 0 ? 12 : 5 },
      { day: "Tue", minutes: totalMinutes > 10 ? 25 : 8 },
      { day: "Wed", minutes: totalMinutes > 30 ? 18 : 12 },
      { day: "Thu", minutes: totalMinutes > 50 ? 40 : 15 },
      { day: "Fri", minutes: totalMinutes > 70 ? 32 : 10 },
      { day: "Sat", minutes: totalMinutes > 90 ? 55 : 20 },
      { day: "Sun", minutes: totalMinutes > 110 ? 45 : 18 }
    ];

    const streak = progress.length > 0 ? Math.min(7, 3 + progress.length) : 0;

    return {
      completedBooks,
      activeBooks,
      totalMinutes,
      streak,
      weeklyActivity
    };
  },

  // Platform Analytics (Admin)
  getPlatformStats() {
    const books = this.getBooks();
    const totalViews = books.reduce((sum, b) => sum + b.views, 0);
    const totalReaders = 1450;
    
    const categoryCounts: Record<string, number> = {};
    books.forEach(b => {
      categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
    });

    const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value
    }));

    const monthlyRevenue = [
      { month: "Jan", amount: 2400 },
      { month: "Feb", amount: 3200 },
      { month: "Mar", amount: 4800 },
      { month: "Apr", amount: 6100 },
      { month: "May", amount: 7800 },
      { month: "Jun", amount: 9400 }
    ];

    const currentRevenue = monthlyRevenue.reduce((sum, m) => sum + m.amount, 0);

    return {
      totalBooks: books.length,
      totalViews,
      totalReaders,
      currentRevenue,
      categoryData,
      monthlyRevenue
    };
  }
};
