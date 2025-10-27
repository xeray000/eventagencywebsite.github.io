// Активная навигация
document.addEventListener('DOMContentLoaded', function() {
    // Получаем текущую страницу
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Находим все ссылки в навигации
    const navLinks = document.querySelectorAll('nav a');
    
    // Устанавливаем активный класс для текущей страницы
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
