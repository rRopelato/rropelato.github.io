document.addEventListener('DOMContentLoaded', function() {
    const profileImage = document.querySelector('.about-image img');
    if (profileImage) {
        profileImage.onload = function() {
            console.log('Imagem carregada com sucesso');
        };
        profileImage.onerror = function() {
            console.error('Erro ao carregar a imagem');
        };
    }

    const fadeElements = document.querySelectorAll('.about-content, .about-details, .section-header, .blog-grid, .projects-grid, .skills-container, .timeline');
    
    fadeElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelectorAll('.dock-item').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });

    const dockItems = document.querySelectorAll('.dock-item');
    dockItems.forEach(item => {
        if (!item.querySelector('.tooltip')) {
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            
            const href = item.getAttribute('href');
            if (href && href.startsWith('#')) {
                const sectionId = href.substring(1);
                tooltip.textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
                item.appendChild(tooltip);
            }
        }
    });

    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        if (Math.abs(scrollPosition - pageHeight) < 2) {
            const lastSection = sections[sections.length - 1];
            current = lastSection.getAttribute('id');
        }
        dockItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href && href === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    createParticles();

    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
    
    const titleElement = document.querySelector('h1');
    if (titleElement) {
        const titleText = titleElement.innerHTML;
        titleElement.innerHTML = '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = titleText;
        const textNodes = Array.from(tempDiv.childNodes);

        function typeWriter() {
            if (textNodes.length > 0) {
                const node = textNodes.shift();
                titleElement.appendChild(node);
                setTimeout(typeWriter, 50);
            }
        }
        typeWriter();
    }

    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
    document.body.appendChild(backToTopBtn);

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    const animatedSections = document.querySelectorAll('.section, .projects-grid, .skills-container, .timeline, .about-details');
    function animateOnScroll() {
        animatedSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) {
                section.classList.add('in-view');
            }
        });
    }
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('DOMContentLoaded', animateOnScroll);

    // Easter egg: OIIA OIIA cat video
    const profileImg = document.querySelector('.about-image img');
    let clickCount = 0;
    let clickTimer = null;

    function showOiiaEasterEgg() {
        if (document.getElementById('oiia-easter-egg')) return;
        const video = document.createElement('video');
        video.id = 'oiia-easter-egg';
        video.src = 'video/catvideo.mp4';
        video.autoplay = true;
        video.loop = true;
        video.muted = false;
        video.volume = 0.15;
        video.style.position = 'fixed';
        video.style.top = '0';
        video.style.left = '0';
        video.style.width = '100vw';
        video.style.height = '100vh';
        video.style.objectFit = 'cover';
        video.style.zIndex = '999';
        video.style.opacity = '0.18';
        video.style.pointerEvents = 'auto';
        video.style.transition = 'opacity 0.3s';
        document.body.appendChild(video);
        // Fechar ao clicar no vídeo ou pressionar ESC
        video.addEventListener('click', () => {
            video.style.opacity = '0';
            setTimeout(() => video.remove(), 300);
        });
        document.addEventListener('keydown', function escListener(e) {
            if (e.key === 'Escape') {
                video.style.opacity = '0';
                setTimeout(() => video.remove(), 300);
                document.removeEventListener('keydown', escListener);
            }
        });
    }
    if (profileImg) {
        profileImg.addEventListener('click', () => {
            clickCount++;
            if (clickTimer) clearTimeout(clickTimer);
            clickTimer = setTimeout(() => { clickCount = 0; }, 700);
            if (clickCount >= 5) {
                showOiiaEasterEgg();
                clickCount = 0;
            }
        });
    }
});

function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.position = 'fixed';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.zIndex = '-1';
    particlesContainer.style.pointerEvents = 'none';
    document.body.prepend(particlesContainer);
    
    const particleCount = 60;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.position = 'absolute';
    const size = Math.random() * 12 + 8;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    const colors = [
        'rgba(79,70,229,0.25)',
        'rgba(16,185,129,0.18)',
        'rgba(255,255,255,0.18)',
        'rgba(55,48,163,0.18)',
        'rgba(255,255,255,0.10)'
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = '50%';
    
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    const duration = Math.random() * 8 + 8;
    particle.style.transition = 'transform ' + duration + 's linear';
    particle.style.transform = 'translateY(0)';
    
    container.appendChild(particle);
    
    setTimeout(() => {
        particle.style.transform = 'translateY(-120vh)';
    }, 100);
    
    setTimeout(() => {
        particle.remove();
        createParticle(container);
    }, duration * 1000);
} 