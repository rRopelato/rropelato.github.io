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
            if (!targetElement) return;
            
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

    setupProjectCardEffects();
    loadFeaturedProjects();
    
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
            if (clickCount >= 3) {
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
    
    const particleCount = 34;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.position = 'absolute';
    const size = Math.random() * 6 + 3;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    const colors = [
        'rgba(99,102,241,0.18)',
        'rgba(16,185,129,0.14)',
        'rgba(255,255,255,0.12)',
        'rgba(34,211,238,0.10)',
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

function setupProjectCardEffects(root = document) {
    const cards = root.querySelectorAll('.project-card');
    cards.forEach(card => {
        if (card.dataset.effectsReady === 'true') return;
        card.dataset.effectsReady = 'true';

        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

const pinnedProjectsApi = 'https://gh-pinned-repos.egoist.dev/?username=rRopelato';
const githubReposApi = 'https://api.github.com/users/rRopelato/repos?sort=updated&per_page=100';
const preferredRepos = ['pawnnexus', 'chromedriver_updater', 'FlaskBase', 'RopelatoSystem', 'geradorbd_python'];

async function loadFeaturedProjects() {
    const grid = document.querySelector('.projects-grid');
    if (!grid || !window.fetch) return;

    try {
        const projects = await fetchPinnedProjects();
        if (projects.length > 0) {
            renderProjects(grid, projects.slice(0, 4));
            return;
        }
    } catch (error) {
        console.warn('Could not load pinned repositories:', error);
    }

    try {
        const projects = await fetchPreferredRepositories();
        if (projects.length > 0) {
            renderProjects(grid, projects.slice(0, 4));
        }
    } catch (error) {
        console.warn('Could not load GitHub repositories:', error);
    }
}

async function fetchPinnedProjects() {
    const response = await fetchWithTimeout(pinnedProjectsApi, 4000);
    if (!response.ok) return [];

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    return data.map(project => ({
        name: project.repo,
        description: project.description,
        url: project.link || ('https://github.com/' + project.owner + '/' + project.repo),
        language: project.language,
        stars: project.stars
    })).filter(project => project.name && project.url);
}

async function fetchPreferredRepositories() {
    const response = await fetchWithTimeout(githubReposApi, 4000);
    if (!response.ok) return [];

    const repos = await response.json();
    if (!Array.isArray(repos)) return [];

    return preferredRepos
        .map(name => repos.find(repo => repo.name.toLowerCase() === name.toLowerCase()))
        .filter(Boolean)
        .map(repo => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            language: repo.language,
            stars: repo.stargazers_count
        }));
}

async function fetchWithTimeout(url, timeout) {
    if (!window.AbortController) return fetch(url);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
        return await fetch(url, { signal: controller.signal });
    } finally {
        clearTimeout(timer);
    }
}

function renderProjects(grid, projects) {
    grid.innerHTML = projects.map(projectCardTemplate).join('');
    setupProjectCardEffects(grid);
}

function projectCardTemplate(project) {
    const name = escapeHtml(project.name || 'Untitled repository');
    const description = escapeHtml(project.description || 'GitHub repository by Renan Ropelato.');
    const url = escapeHtml(project.url || '#');
    const tags = [project.language]
        .filter(Boolean)
        .map(tag => '<span>' + escapeHtml(tag) + '</span>')
        .join('');
    const stars = Number.isFinite(project.stars) ? '<span class=project-stat><i class=fas fa-star></i> ' + project.stars + '</span>' : '';

    return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="project-card">' +
        '<div class=project-info>' +
            '<h3>' + name + '</h3>' +
            '<p>' + description + '</p>' +
            '<div class=project-card-footer>' +
                '<div class=project-tags>' + tags + '</div>' +
                stars +
            '</div>' +
        '</div>' +
    '</a>';
}

function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = String(value);
    return div.innerHTML;
}
