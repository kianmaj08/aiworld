// AI World JavaScript - Professionelle Interaktionen und Animationen

// Globale Variablen
let currentTheme = 'light';
let isNavOpen = false;
let hasAnimatedStats = false;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// App Initialisierung
function initializeApp() {
    // Loading Screen entfernen nach 2 Sekunden
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.classList.add('hidden');
    }, 2000);

    // Event Listeners
    setupEventListeners();
    
    // Scroll Animationen initialisieren
    setupScrollAnimations();
    
    // Navigation Setup
    setupNavigation();
    
    // Theme aus System Preference laden
    detectSystemTheme();
    
    // Statistiken Animation vorbereiten
    setupStatsAnimation();
    
    // Search Setup
    setupSearch();
    
    // Filter Setup
    setupFilters();
}

// Event Listeners Setup
function setupEventListeners() {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    // Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    hamburger.addEventListener('click', () => toggleMobileMenu(hamburger, navMenu));
    
    // Navigation Links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => handleNavClick(e, link));
    });
    
    // Scroll Event für Navbar
    window.addEventListener('scroll', handleScroll);
    
    // Resize Event
    window.addEventListener('resize', handleResize);
    
    // Modal Close Events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Navigation Setup
function setupNavigation() {
    const navbar = document.getElementById('navbar');
    
    // Smooth Scroll für Hero Buttons
    const heroButtons = document.querySelectorAll('.hero-btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const target = button.getAttribute('onclick');
            if (target && target.includes('scrollToSection')) {
                e.preventDefault();
                const sectionId = target.match(/'([^']+)'/)[1];
                scrollToSection(sectionId);
            }
        });
    });
}

// Scroll zu Section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Mobile Menu schließen
        closeMobileMenu();
        
        // Active Link setzen
        setActiveNavLink(sectionId);
    }
}

// Active Navigation Link setzen
function setActiveNavLink(activeId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
        }
    });
}

// Navigation Click Handler
function handleNavClick(e, link) {
    e.preventDefault();
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
        const sectionId = href.substring(1);
        scrollToSection(sectionId);
    }
}

// Mobile Menu Toggle
function toggleMobileMenu(hamburger, navMenu) {
    isNavOpen = !isNavOpen;
    hamburger.classList.toggle('active', isNavOpen);
    navMenu.classList.toggle('active', isNavOpen);
}

// Mobile Menu schließen
function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    isNavOpen = false;
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// Theme Toggle Funktionalität
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    
    // Icon im Button ändern
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Theme anwenden
function applyTheme(theme) {
    document.documentElement.setAttribute('data-color-scheme', theme);
    
    // Smooth Transition für Theme Change
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// System Theme Detection
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        currentTheme = 'dark';
    } else {
        currentTheme = 'light';
    }
    applyTheme(currentTheme);
    
    // Icon setzen
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Scroll Handler
function handleScroll() {
    const navbar = document.getElementById('navbar');
    const scrolled = window.pageYOffset > 50;
    
    // Navbar Background ändern beim Scrollen
    if (scrolled) {
        navbar.style.background = 'rgba(var(--color-slate-900-rgb, 19, 52, 59), 0.98)';
        navbar.style.backdropFilter = 'blur(25px)';
    } else {
        navbar.style.background = 'rgba(var(--color-slate-900-rgb, 19, 52, 59), 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
    }
    
    // Stats Animation triggern
    triggerStatsAnimation();
    
    // Active Section Detection
    detectActiveSection();
}

// Active Section Detection
function detectActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            setActiveNavLink(section.id);
        }
    });
}

// Resize Handler
function handleResize() {
    // Mobile Menu schließen bei Resize
    if (window.innerWidth > 768 && isNavOpen) {
        closeMobileMenu();
    }
}

// Scroll Animationen Setup
function setupScrollAnimations() {
    // Intersection Observer für Scroll-Animationen
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Spezielle Animationen für verschiedene Elemente
                if (entry.target.classList.contains('feature-card')) {
                    entry.target.style.animationDelay = Math.random() * 0.5 + 's';
                }
                
                if (entry.target.classList.contains('model-card')) {
                    const cards = document.querySelectorAll('.model-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    entry.target.style.animationDelay = index * 0.2 + 's';
                }
                
                if (entry.target.classList.contains('application-card')) {
                    const cards = document.querySelectorAll('.application-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    entry.target.style.animationDelay = index * 0.15 + 's';
                }
                
                if (entry.target.classList.contains('news-card')) {
                    const cards = document.querySelectorAll('.news-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    entry.target.style.animationDelay = index * 0.1 + 's';
                }
                
                if (entry.target.classList.contains('timeline-item')) {
                    const items = document.querySelectorAll('.timeline-item');
                    const index = Array.from(items).indexOf(entry.target);
                    entry.target.style.animationDelay = index * 0.3 + 's';
                }
            }
        });
    }, observerOptions);
    
    // Elemente für Animation observieren
    const animatedElements = document.querySelectorAll('.feature-card, .model-card, .application-card, .news-card, .timeline-item, .team-member, .contact-item');
    animatedElements.forEach(el => observer.observe(el));
}

// Statistiken Animation Setup
function setupStatsAnimation() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimatedStats) {
                animateStats();
                hasAnimatedStats = true;
            }
        });
    }, { threshold: 0.5 });
    
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        statsObserver.observe(statsBar);
    }
}

// Statistiken Animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 Sekunden
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const updateStat = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateStat);
            } else {
                stat.textContent = target;
            }
        };
        
        // Kleine Verzögerung für jeden Stat
        const delay = Array.from(statNumbers).indexOf(stat) * 200;
        setTimeout(updateStat, delay);
    });
}

// Stats Animation triggern
function triggerStatsAnimation() {
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar && !hasAnimatedStats) {
        const rect = statsBar.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            animateStats();
            hasAnimatedStats = true;
        }
    }
}

// Search Setup
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            handleSearch(e.target.value);
        }, 300);
    });
    
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(e.target.value);
        }
    });
}

// Search Handler
function handleSearch(query) {
    if (!query.trim()) {
        resetSearch();
        return;
    }
    
    const searchableElements = document.querySelectorAll('.model-card, .application-card, .news-card');
    const searchTerm = query.toLowerCase();
    let hasResults = false;
    
    searchableElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        const isMatch = text.includes(searchTerm);
        
        if (isMatch) {
            element.style.display = 'block';
            element.classList.add('search-highlight');
            hasResults = true;
        } else {
            element.style.display = 'none';
            element.classList.remove('search-highlight');
        }
    });
    
    // Search Results Feedback
    showSearchFeedback(hasResults, query);
}

// Search Feedback anzeigen
function showSearchFeedback(hasResults, query) {
    // Entferne existierende Feedback-Nachrichten
    const existingFeedback = document.querySelector('.search-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    if (!hasResults) {
        const feedback = document.createElement('div');
        feedback.className = 'search-feedback';
        feedback.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--color-text-secondary);">
                <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                <p>Keine Ergebnisse für "${query}" gefunden.</p>
                <button class="btn btn--secondary" onclick="resetSearch()">Suche zurücksetzen</button>
            </div>
        `;
        
        // Feedback in den ersten sichtbaren Container einfügen
        const firstSection = document.querySelector('.comparison-section, .applications-section, .news-section');
        if (firstSection) {
            firstSection.appendChild(feedback);
        }
    }
}

// Search zurücksetzen
function resetSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    
    const searchableElements = document.querySelectorAll('.model-card, .application-card, .news-card');
    searchableElements.forEach(element => {
        element.style.display = 'block';
        element.classList.remove('search-highlight');
    });
    
    const feedback = document.querySelector('.search-feedback');
    if (feedback) {
        feedback.remove();
    }
}

// Filter Setup
function setupFilters() {
    // Comparison Filters
    const comparisonFilters = document.querySelectorAll('.comparison-section .filter-btn');
    comparisonFilters.forEach(btn => {
        btn.addEventListener('click', () => handleComparisonFilter(btn));
    });
    
    // News Filters
    const newsFilters = document.querySelectorAll('.news-section .filter-btn');
    newsFilters.forEach(btn => {
        btn.addEventListener('click', () => handleNewsFilter(btn));
    });
}

// Comparison Filter Handler
function handleComparisonFilter(activeBtn) {
    // Active Button State
    const comparisonFilters = document.querySelectorAll('.comparison-section .filter-btn');
    comparisonFilters.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
    
    const filter = activeBtn.getAttribute('data-filter');
    const modelCards = document.querySelectorAll('.model-card');
    
    modelCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
            card.style.display = 'block';
            card.classList.add('scale-in');
        } else {
            card.style.display = 'none';
            card.classList.remove('scale-in');
        }
    });
}

// News Filter Handler
function handleNewsFilter(activeBtn) {
    // Active Button State
    const newsFilters = document.querySelectorAll('.news-section .filter-btn');
    newsFilters.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
    
    const category = activeBtn.getAttribute('data-category');
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
            card.classList.add('scale-in');
        } else {
            card.style.display = 'none';
            card.classList.remove('scale-in');
        }
    });
}

// Model Details Modal
function showModelDetails(modelId) {
    const modalData = {
        gpt5: {
            title: 'GPT-5 - OpenAI',
            content: `
                <div class="model-details">
                    <div class="detail-section">
                        <h4>Technische Spezifikationen</h4>
                        <ul>
                            <li><strong>Context Window:</strong> 400.000 Tokens</li>
                            <li><strong>Parameter:</strong> Unbekannt (geschätzt >1T)</li>
                            <li><strong>Training Data:</strong> Bis September 2024</li>
                            <li><strong>Multimodalität:</strong> Text, Bild, Audio, Code</li>
                            <li><strong>API Kosten:</strong> Premium Pricing</li>
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Hauptfeatures</h4>
                        <ul>
                            <li>Intelligentes Model Routing zwischen verschiedenen Varianten</li>
                            <li>Drastisch reduzierte Halluzinationen</li>
                            <li>Verbesserte mathematische und logische Fähigkeiten</li>
                            <li>Native Tool-Integration und Agentische Funktionen</li>
                            <li>Erweiterte Code-Generierung und -Analyse</li>
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Benchmark Ergebnisse</h4>
                        <div class="benchmark-grid">
                            <div class="benchmark-item">
                                <span class="benchmark-label">SWE-bench:</span>
                                <span class="benchmark-value">74.9%</span>
                            </div>
                            <div class="benchmark-item">
                                <span class="benchmark-label">MMLU:</span>
                                <span class="benchmark-value">92.3%</span>
                            </div>
                            <div class="benchmark-item">
                                <span class="benchmark-label">HumanEval:</span>
                                <span class="benchmark-value">89.2%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Anwendungsbereiche</h4>
                        <p>GPT-5 eignet sich besonders für komplexe Reasoning-Aufgaben, wissenschaftliche Forschung, erweiterte Code-Entwicklung und multimodale Anwendungen.</p>
                    </div>
                </div>
            `
        },
        claude: {
            title: 'Claude 3.5 Sonnet - Anthropic',
            content: `
                <div class="model-details">
                    <div class="detail-section">
                        <h4>Technische Spezifikationen</h4>
                        <ul>
                            <li><strong>Context Window:</strong> 200.000 Tokens</li>
                            <li><strong>Parameter:</strong> Unbekannt</li>
                            <li><strong>Training:</strong> Constitutional AI</li>
                            <li><strong>Sicherheit:</strong> Höchste Priorität</li>
                            <li><strong>API Kosten:</strong> 3$ pro Million Input Tokens</li>
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Hauptfeatures</h4>
                        <ul>
                            <li>Computer Use - Steuerung von Desktop-Anwendungen</li>
                            <li>Höchste Sicherheitsstandards und ethische KI</li>
                            <li>Exzellente Code-Analyse und -Generierung</li>
                            <li>Präzise und hilfreiche Antworten</li>
                            <li>Starke Performance bei kreativen Aufgaben</li>
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Benchmark Ergebnisse</h4>
                        <div class="benchmark-grid">
                            <div class="benchmark-item">
                                <span class="benchmark-label">SWE-bench:</span>
                                <span class="benchmark-value">64%</span>
                            </div>
                            <div class="benchmark-item">
                                <span class="benchmark-label">MMLU:</span>
                                <span class="benchmark-value">88.7%</span>
                            </div>
                            <div class="benchmark-item">
                                <span class="benchmark-label">HumanEval:</span>
                                <span class="benchmark-value">92%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Anwendungsbereiche</h4>
                        <p>Claude 3.5 Sonnet ist ideal für Aufgaben, die höchste Genauigkeit und Sicherheit erfordern, wie akademische Forschung, professionelle Softwareentwicklung und sensible Datenanalyse.</p>
                    </div>
                </div>
            `
        },
        gemini: {
            title: 'Gemini 2.0 - Google',
            content: `
                <div class="model-details">
                    <div class="detail-section">
                        <h4>Technische Spezifikationen</h4>
                        <ul>
                            <li><strong>Context Window:</strong> 2 Millionen Tokens (Pro)</li>
                            <li><strong>Varianten:</strong> Flash, Pro, Flash-Lite</li>
                            <li><strong>Multimodalität:</strong> Text, Bild, Audio, Video</li>
                            <li><strong>Native Tools:</strong> Google Search, Maps, etc.</li>
                            <li><strong>API Kosten:</strong> Sehr kosteneffizient</li>
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Hauptfeatures</h4>
                        <ul>
                            <li>Agentische KI mit nativer Tool-Nutzung</li>
                            <li>Größtes Context Window (2M Tokens)</li>
                            <li>Höchste Geschwindigkeit (Flash-Variante)</li>
                            <li>Tiefe Integration in Google Ecosystem</li>
                            <li>Multimodale Verarbeitung in Echtzeit</li>
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Varianten Vergleich</h4>
                        <div class="variants-grid">
                            <div class="variant-item">
                                <strong>Flash:</strong> Höchste Geschwindigkeit
                            </div>
                            <div class="variant-item">
                                <strong>Pro:</strong> Maximale Leistung
                            </div>
                            <div class="variant-item">
                                <strong>Flash-Lite:</strong> Mobile Optimierung
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Anwendungsbereiche</h4>
                        <p>Gemini 2.0 ist perfekt für Anwendungen, die hohe Geschwindigkeit, große Dokumente und nahtlose Integration in bestehende Google-Services erfordern.</p>
                    </div>
                </div>
            `
        }
    };
    
    showModal('modelModal', modalData[modelId]);
}

// Application Details Modal
function showApplicationDetails(sector) {
    const applicationData = {
        medizin: {
            title: 'KI in der Medizin',
            content: `
                <div class="application-details">
                    <div class="detail-section">
                        <h4>Revolutionäre Durchbrüche</h4>
                        <p>KI transformiert die Medizin fundamental und ermöglicht präzisere Diagnosen, personalisierte Behandlungen und beschleunigte Arzneimittelentwicklung.</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Konkrete Anwendungen</h4>
                        <div class="application-grid">
                            <div class="app-item">
                                <strong>Bildgebende Diagnostik:</strong>
                                <p>KI erkennt Krebs, Alzheimer und andere Krankheiten in MRT, CT und Röntgenbildern oft genauer als menschliche Experten.</p>
                            </div>
                            <div class="app-item">
                                <strong>Drug Discovery:</strong>
                                <p>Verkürzung der Arzneimittelentwicklung von 15 Jahren auf 3-5 Jahre durch KI-gestützte Moleküldesign.</p>
                            </div>
                            <div class="app-item">
                                <strong>Personalisierte Medizin:</strong>
                                <p>Anpassung von Behandlungen an individuelle Patientenprofile basierend auf Genetik und Biomarkern.</p>
                            </div>
                            <div class="app-item">
                                <strong>Pathologie-Automation:</strong>
                                <p>Automatisierte Analyse von Gewebeproben mit höherer Genauigkeit und Geschwindigkeit.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Erfolgsgeschichten</h4>
                        <ul>
                            <li>Google's DeepMind: 90% Genauigkeit bei Augenerkrankungen</li>
                            <li>IBM Watson for Oncology: Unterstützt Krebsbehandlungen weltweit</li>
                            <li>Zebra Medical Vision: Automatisierte Radiologie-Screening</li>
                            <li>Atomwise: KI-basierte Medikamentenentdeckung</li>
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Zukunftsaussichten</h4>
                        <p>Bis 2030 wird KI voraussichtlich in 80% aller medizinischen Diagnose- und Behandlungsprozesse integriert sein, was zu einer 40% Kostensenkung und 50% schnelleren Behandlungen führen könnte.</p>
                    </div>
                </div>
            `
        },
        bildung: {
            title: 'KI in der Bildung',
            content: `
                <div class="application-details">
                    <div class="detail-section">
                        <h4>Personalisiertes Lernen</h4>
                        <p>KI revolutioniert die Bildung durch maßgeschneiderte Lernpfade, die sich an jeden Schüler individuell anpassen und optimale Lernerfolge ermöglichen.</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Innovative Lösungen</h4>
                        <div class="application-grid">
                            <div class="app-item">
                                <strong>Adaptive Lernplattformen:</strong>
                                <p>Systeme passen Schwierigkeit und Tempo automatisch an die Fähigkeiten des Lernenden an.</p>
                            </div>
                            <div class="app-item">
                                <strong>Intelligente Tutorsysteme:</strong>
                                <p>KI-Tutoren bieten 24/7 personalisierte Unterstützung und Erklärungen in natürlicher Sprache.</p>
                            </div>
                            <div class="app-item">
                                <strong>Automatisierte Bewertung:</strong>
                                <p>Sofortiges Feedback und detaillierte Analyse von Stärken und Verbesserungsmöglichkeiten.</p>
                            </div>
                            <div class="app-item">
                                <strong>Sprachbarrieren überwinden:</strong>
                                <p>Echtzeit-Übersetzung und kulturell angepasste Lerninhalte für globale Bildung.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Führende Unternehmen</h4>
                        <ul>
                            <li>Duolingo: KI-gestütztes Sprachenlernen für 500+ Millionen Nutzer</li>
                            <li>Khan Academy: Personalisierte Mathematik- und Wissenschaftskurse</li>
                            <li>Coursera: Adaptive Assessments und Lernpfad-Optimierung</li>
                            <li>Carnegie Learning: Mathematik-Tutorsystem mit nachgewiesenen Erfolgen</li>
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Auswirkungen</h4>
                        <p>Studien zeigen, dass KI-gestütztes Lernen die Lerneffizienz um bis zu 70% steigern und Lehrkräfte von Routineaufgaben befreien kann, sodass sie sich auf kreative und zwischenmenschliche Aspekte der Bildung konzentrieren können.</p>
                    </div>
                </div>
            `
        },
        industrie: {
            title: 'KI in der Industrie',
            content: `
                <div class="application-details">
                    <div class="detail-section">
                        <h4>Industrie 4.0 Revolution</h4>
                        <p>KI treibt die vierte industrielle Revolution voran und schafft intelligente, selbstoptimierende Produktionssysteme mit beispielloser Effizienz.</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Kernbereiche der Transformation</h4>
                        <div class="application-grid">
                            <div class="app-item">
                                <strong>Predictive Maintenance:</strong>
                                <p>Vorhersage von Maschinausfällen bevor sie auftreten, Reduzierung ungeplanter Stillstände um bis zu 50%.</p>
                            </div>
                            <div class="app-item">
                                <strong>Qualitätskontrolle:</strong>
                                <p>Computer Vision erkennt Defekte in Echtzeit mit 99.9% Genauigkeit, auch bei mikroskopischen Fehlern.</p>
                            </div>
                            <div class="app-item">
                                <strong>Supply Chain Optimierung:</strong>
                                <p>KI optimiert Lieferketten dynamisch, reduziert Lagerkosten um 20-30% und verbessert Liefertreue.</p>
                            </div>
                            <div class="app-item">
                                <strong>Autonome Robotik:</strong>
                                <p>Selbstlernende Roboter passen sich flexibel an neue Aufgaben an ohne Neuprogrammierung.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Branchen-Pioniere</h4>
                        <ul>
                            <li>Siemens: Digitale Fabrik mit KI-gesteuerten Prozessen</li>
                            <li>General Electric: Predix Plattform für industrielle KI</li>
                            <li>BMW: Vollautomatisierte Qualitätsprüfung mit Computer Vision</li>
                            <li>Amazon: Warehouse-Roboter mit ML-basierter Navigation</li>
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Messbare Erfolge</h4>
                        <p>Unternehmen mit KI-Integration berichten von 15-25% Produktivitätssteigerung, 30% weniger Qualitätsmängeln und 20% Energieeinsparungen. Die Amortisation von KI-Investitionen erfolgt typischerweise innerhalb von 12-18 Monaten.</p>
                    </div>
                </div>
            `
        },
        finanzen: {
            title: 'KI im Finanzwesen',
            content: `
                <div class="application-details">
                    <div class="detail-section">
                        <h4>FinTech Revolution</h4>
                        <p>KI transformiert das Finanzwesen durch automatisierte Entscheidungsfindung, Risikomanagement und personalisierte Finanzdienstleistungen in Echtzeit.</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Schlüsselanwendungen</h4>
                        <div class="application-grid">
                            <div class="app-item">
                                <strong>Betrugsbekämpfung:</strong>
                                <p>Echtzeit-Analyse von Transaktionsmustern erkennt 95% der betrügerischen Aktivitäten innerhalb von Millisekunden.</p>
                            </div>
                            <div class="app-item">
                                <strong>Algorithmic Trading:</strong>
                                <p>KI-Systeme führen Millionen von Trades pro Sekunde aus und reagieren auf Marktveränderungen in Echtzeit.</p>
                            </div>
                            <div class="app-item">
                                <strong>Kreditbewertung:</strong>
                                <p>Alternative Datenschätze ermöglichen fairere und schnellere Kreditentscheidungen auch für Unbanked Populations.</p>
                            </div>
                            <div class="app-item">
                                <strong>Robo-Advisor:</strong>
                                <p>Automatisierte Vermögensverwaltung mit personalizierten Portfolios und kontinuierlicher Optimierung.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Marktführer</h4>
                        <ul>
                            <li>JPMorgan Chase: COIN für Vertragsanalyse und Compliance</li>
                            <li>Goldman Sachs: Marcus AI für personalisierte Finanzberatung</li>
                            <li>Ant Financial: Sesame Credit mit alternativen Scoring-Methoden</li>
                            <li>Robinhood: Demokratisierung des Handels durch KI-gestützte Apps</li>
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Zukunft des Bankwesens</h4>
                        <p>Bis 2027 werden schätzungsweise 80% aller Finanzdienstleistungen KI-gestützt sein. Dies führt zu 40% niedrigeren Betriebskosten, 24/7 Service-Verfügbarkeit und hyper-personalisierten Finanzprodukten.</p>
                    </div>
                </div>
            `
        }
    };
    
    showModal('applicationModal', applicationData[sector]);
}

// Generic Modal Show Function
function showModal(modalId, data) {
    const modal = document.getElementById(modalId);
    const title = modal.querySelector(`#${modalId === 'modelModal' ? 'modalTitle' : 'appModalTitle'}`);
    const body = modal.querySelector(`#${modalId === 'modelModal' ? 'modalBody' : 'appModalBody'}`);
    
    title.textContent = data.title;
    body.innerHTML = data.content;
    
    modal.classList.remove('hidden');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Animation
    setTimeout(() => {
        modal.querySelector('.modal-content').classList.add('scale-in');
    }, 10);
}

// Modal schließen
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('hidden');
    
    // Re-enable body scroll
    document.body.style.overflow = '';
    
    modal.querySelector('.modal-content').classList.remove('scale-in');
}

// Alle Modals schließen
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (!modal.classList.contains('hidden')) {
            closeModal(modal.id);
        }
    });
}

// Dynamic CSS für Animationen hinzufügen
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .search-highlight {
            animation: searchHighlight 0.5s ease-in-out;
        }
        
        @keyframes searchHighlight {
            0% { background-color: transparent; }
            50% { background-color: rgba(var(--color-primary-rgb, 33, 128, 141), 0.2); }
            100% { background-color: transparent; }
        }
        
        .benchmark-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin: 1rem 0;
        }
        
        .benchmark-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem;
            background: var(--color-bg-1);
            border-radius: var(--radius-sm);
        }
        
        .benchmark-value {
            font-weight: var(--font-weight-bold);
            color: var(--color-primary);
        }
        
        .application-grid {
            display: grid;
            gap: 1rem;
            margin: 1rem 0;
        }
        
        .app-item {
            padding: 1rem;
            background: var(--color-bg-2);
            border-radius: var(--radius-base);
            border-left: 4px solid var(--color-primary);
        }
        
        .app-item strong {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--color-primary);
        }
        
        .variants-grid {
            display: grid;
            gap: 0.5rem;
            margin: 1rem 0;
        }
        
        .variant-item {
            padding: 0.75rem;
            background: var(--color-bg-3);
            border-radius: var(--radius-base);
        }
        
        .detail-section {
            margin-bottom: 2rem;
        }
        
        .detail-section h4 {
            color: var(--color-primary);
            margin-bottom: 1rem;
            font-size: var(--font-size-lg);
        }
        
        .detail-section ul {
            list-style: none;
            padding-left: 0;
        }
        
        .detail-section li {
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--color-border);
            position: relative;
            padding-left: 1.5rem;
        }
        
        .detail-section li:before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--color-primary);
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
}

// Styles hinzufügen wenn DOM ready
document.addEventListener('DOMContentLoaded', addDynamicStyles);

// Utility Functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Performance Monitoring
let performanceMetrics = {
    loadTime: 0,
    firstContentfulPaint: 0,
    interactions: 0
};

// Track Performance
window.addEventListener('load', () => {
    performanceMetrics.loadTime = performance.now();
    
    // First Contentful Paint
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                    performanceMetrics.firstContentfulPaint = entry.startTime;
                }
            }
        });
        observer.observe({ entryTypes: ['paint'] });
    }
});

// Track User Interactions
document.addEventListener('click', () => {
    performanceMetrics.interactions++;
});

// Global Error Handler
window.addEventListener('error', (event) => {
    console.error('AI World Error:', event.error);
    // In einer echten Anwendung würde hier ein Error-Tracking-Service verwendet
});

// Service Worker Registration für Progressive Web App Features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service Worker würde hier registriert werden für Offline-Funktionalität
        console.log('AI World: Bereit für PWA Features');
    });
}

console.log('🤖 AI World v1.0 - Professional AI Information Platform initialized');
console.log('⚡ All systems ready. Welcome to the future of AI!');