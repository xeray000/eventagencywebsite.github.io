// Общие функции для всех страниц
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    // Инициализация GSAP и ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // ОТКЛЮЧАЕМ СОЗДАНИЕ ДОПОЛНИТЕЛЬНОЙ ПРОКРУТКИ
        ScrollTrigger.config({
            limitCallbacks: true,
            ignoreMobileResize: true
        });
        
        createOrganicAnimations();
        initHeaderAnimation();
    }
    
    // Инициализация мобильного меню
    initMobileMenu();
    
    // Инициализация активной страницы в навигации
    highlightActivePage();
    
    // Инициализация плавной прокрутки
    initSmoothScroll();
    
    // Инициализация специфичных для страницы функций
    initPageSpecificFunctions();
}

// Органичные анимации при скролле
function createOrganicAnimations() {
    const animationConfig = {
        '.slide-from-left': { x: -80, y: 0, scale: 1, rotation: 0 },
        '.slide-from-right': { x: 80, y: 0, scale: 1, rotation: 0 },
        '.slide-from-bottom': { x: 0, y: 80, scale: 1, rotation: 0 },
        '.slide-from-top': { x: 0, y: -80, scale: 1, rotation: 0 },
        '.scale-in': { x: 0, y: 0, scale: 0.9, rotation: 0 },
        '.rotate-in': { x: 0, y: 0, scale: 0.95, rotation: -5 },
        '.fade-in': { x: 0, y: 0, scale: 0.95, rotation: 0 }
    };

    Object.keys(animationConfig).forEach(selector => {
        const elements = gsap.utils.toArray(selector);
        const config = animationConfig[selector];
        
        elements.forEach((element, index) => {
            const delay = index * 0.1;
            
            gsap.fromTo(element, {
                opacity: 0,
                visibility: "hidden",
                x: config.x,
                y: config.y,
                scale: config.scale,
                rotation: config.rotation
            }, {
                opacity: 1,
                visibility: "visible",
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                duration: 1.2,
                delay: delay,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play reverse play reverse",
                    markers: false
                }
            });
        });
    });
}

// Анимация хедера при скролле
function initHeaderAnimation() {
    gsap.to('header', {
        backgroundColor: 'rgba(10, 10, 10, 0.98)',
        padding: '10px 0',
        duration: 0.4,
        scrollTrigger: {
            trigger: 'body',
            start: '100px top',
            end: 'bottom top',
            toggleActions: 'play reverse play reverse',
            // ОТКЛЮЧАЕМ СОЗДАНИЕ ДОПОЛНИТЕЛЬНОЙ ПРОКРУТКИ
            pin: false
        }
    });
}

// Мобильное меню
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
}

// Подсветка активной страницы
function highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Плавная прокрутка
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Закрываем мобильное меню если открыто
                const nav = document.querySelector('nav');
                if (nav) nav.classList.remove('active');
            }
        });
    });
}

// Специфичные для страницы функции
function initPageSpecificFunctions() {
    // Инициализация вкладок коктейлей если они есть на странице
    if (document.querySelector('.cocktail-tab')) {
        initCocktailTabs();
    }
    
    // Инициализация фильтров портфолио если они есть на странице
    if (document.querySelector('.portfolio-filter')) {
        initPortfolioFilters();
    }
    
    // Инициализация форм если они есть на странице
    if (document.getElementById('contactForm')) {
        initContactForm();
    }
}

// Функции для коктейльных вкладок
function initCocktailTabs() {
    document.querySelectorAll('.cocktail-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Анимация кнопки
            this.classList.add('tab-loading');
            setTimeout(() => {
                this.classList.remove('tab-loading');
            }, 600);

            // Убираем активный класс у всех вкладок
            document.querySelectorAll('.cocktail-tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Добавляем активный класс текущей вкладке
            this.classList.add('active');
            
            const tabId = this.getAttribute('data-tab');
            const targetContent = document.getElementById(`${tabId}-content`);
            
            // Анимация переключения контента
            document.querySelectorAll('.cocktail-content').forEach(content => {
                if (content.classList.contains('active')) {
                    gsap.to(content, {
                        opacity: 0,
                        y: -30,
                        duration: 0.3,
                        ease: "power2.in",
                        onComplete: () => {
                            content.classList.remove('active');
                            showNewTabContent(targetContent);
                        }
                    });
                }
            });
        });
    });

    // Инициализация видимых карточек на активной вкладке
    document.querySelectorAll('.cocktail-content.active .cocktail-card').forEach(card => {
        card.classList.add('visible');
    });
}

function showNewTabContent(contentElement) {
    contentElement.classList.add('active');
    
    // Анимация появления нового контента
    gsap.fromTo(contentElement, {
        opacity: 0,
        y: 30
    }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
    });

    // Анимация появления карточек с задержкой
    const cards = contentElement.querySelectorAll('.cocktail-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.9)';
        
        setTimeout(() => {
            card.classList.add('visible');
            gsap.to(card, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                delay: index * 0.1,
                ease: "back.out(1.7)"
            });
        }, 100);
    });
}

// Функции для фильтров портфолио
function initPortfolioFilters() {
    document.querySelectorAll('.portfolio-filter').forEach(filter => {
        filter.addEventListener('click', function() {
            // Анимация кнопки фильтра
            this.classList.add('active');
            setTimeout(() => {
                this.classList.remove('active');
            }, 300);

            // Убираем активный класс у всех фильтров
            document.querySelectorAll('.portfolio-filter').forEach(f => {
                f.classList.remove('active');
            });
            
            // Добавляем активный класс текущему фильтру
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            const portfolioItems = document.querySelectorAll('.portfolio-item');
            
            // Анимация переключения элементов портфолио
            portfolioItems.forEach((item, index) => {
                const shouldShow = filterValue === 'all' || item.getAttribute('data-category') === filterValue;
                
                if (shouldShow && !item.classList.contains('active')) {
                    // Анимация появления
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.add('fade-in');
                        item.classList.remove('fade-out');
                        item.classList.add('active');
                        gsap.fromTo(item, {
                            opacity: 0,
                            scale: 0.8,
                            rotation: -5
                        }, {
                            opacity: 1,
                            scale: 1,
                            rotation: 0,
                            duration: 0.6,
                            delay: index * 0.1,
                            ease: "back.out(1.7)"
                        });
                    }, 50);
                } else if (!shouldShow && item.classList.contains('active')) {
                    // Анимация исчезновения
                    item.classList.add('fade-out');
                    item.classList.remove('fade-in');
                    item.classList.remove('active');
                    gsap.to(item, {
                        opacity: 0,
                        scale: 0.8,
                        rotation: 5,
                        duration: 0.4,
                        onComplete: () => {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    });

    // Инициализация видимых элементов портфолио
    document.querySelectorAll('.portfolio-item.active').forEach(item => {
        item.style.display = 'block';
    });
}

// Функции для формы
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const eventType = document.getElementById('event').value;
            const message = document.getElementById('message').value;
            
            const fullMessage = `Новая заявка с сайта:%0A%0AИмя: ${name}%0AТелефон: ${phone}%0AТип мероприятия: ${eventType}%0AСообщение: ${message}`;
            
            openWhatsApp(fullMessage);
        });
    }
}

// Глобальные функции
function openWhatsApp(service = '') {
    const phone = '79773001608';
    const message = service ? `Здравствуйте! Я хочу заказать: ${service}` : 'Здравствуйте! Я хочу заказать мероприятие';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

// Переход наверх при клике на логотип
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
});
