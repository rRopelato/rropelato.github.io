document.addEventListener('DOMContentLoaded', function() {
    // Verificar se a imagem está sendo carregada
    const profileImage = document.querySelector('.about-image img');
    if (profileImage) {
        profileImage.onload = function() {
            console.log('Imagem carregada com sucesso');
        };
        profileImage.onerror = function() {
            console.error('Erro ao carregar a imagem');
        };
    }

    // Animação de entrada para os elementos principais
    const fadeElements = document.querySelectorAll('.about-content, .about-details, .section-header, .blog-grid, .projects-grid, .skills-container, .timeline');
    
    fadeElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    // Smooth scroll para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Atualizar classe active nos itens do dock
            document.querySelectorAll('.dock-item').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
            
            // Scroll suave até o alvo
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });

    // Adicionar efeito nos tooltips do dock
    const dockItems = document.querySelectorAll('.dock-item');
    dockItems.forEach(item => {
        if (!item.querySelector('.tooltip')) {
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            
            // Obter nome da seção a partir do href
            const href = item.getAttribute('href');
            if (href && href.startsWith('#')) {
                const sectionId = href.substring(1);
                tooltip.textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
                item.appendChild(tooltip);
            }
        }
    });

    // Detecção de seção ativa durante scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        dockItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href && href === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // Efeito de partículas no background (opcional, deixa mais leve descomentando)
    createParticles();

    // Efeito hover 3D para os cards de projetos
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
    
    // Efeito de digitação para o título principal
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
});

// Função para criar efeito de partículas
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