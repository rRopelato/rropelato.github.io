/**
 * Minimal site-wide EN/PT language toggle. Elements marked with
 * data-i18n="key" get their textContent swapped; choice persists via
 * localStorage so it carries across index.html <-> resume.html.
 * Terminal command lines ($ whoami, $ cat about.txt, ...) are left in
 * English on purpose — they're part of the UI chrome, not content.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "site-lang";

  const TRANSLATIONS = {
    en: {
      "nav.about": "[1] about",
      "nav.projects": "[2] projects",
      "nav.skills": "[3] skills",
      "nav.experience": "[4] experience",
      "nav.education": "[5] education",
      "nav.contact": "[6] contact",
      "nav.resume": "[7] resume",

      "about.subtitle": "> Full-Stack Developer",
      "about.line1": "Full-stack developer focused on Java, Python, and practical systems that make daily work faster.",
      "about.line2": "Experienced in web applications, API integrations, database modeling, and process automation with tools such as Selenium, Playwright, VBA, and Google Apps Script.",
      "about.line3": "Lives in Campo Mourão, Paraná, Brazil.",
      "link.resume": "[resume]",

      "project.pawnnexus": "A Dragon's Dogma 2 community platform for pawn listings and management.",
      "project.chromedriver": "ChromeDriver updater written in Go.",
      "project.flaskbase": "STUDY PROJECT - Flask base project template.",
      "project.phplogin": "STUDY PROJECT - Login system written in PHP.",
      "project.pythondb": "STUDY PROJECT - Semi automatic database generator written in Python.",
      "projects.viewall": "→ view all repositories",

      "skills.programming": "Programming & Scripting",
      "skills.frameworks": "Frameworks & Libraries",
      "skills.tools": "Tools & Platforms",
      "skills.data": "Data & Automation",

      "exp.ipm.title": "IPM Sistemas — Resident Support Analyst",
      "exp.ipm.date": "Nov 2025 – Present",
      "exp.ipm.li1": "Works at the city hall of Campo Mourão, Paraná, Brazil.",
      "exp.sf.title": "Solução Financeira — Technical Assistant",
      "exp.sf.date": "May 2022 – Sep 2025",
      "exp.sf.li1": "Developed full-stack internal applications with API integration, process automation (Python, VBA, Apps Script), and legacy system support, improving operational efficiency.",
      "exp.sf.li2": "Automated web tasks and data extraction using Selenium, BeautifulSoup, Playwright, and PyAutoGUI; maintained dynamic Excel/Google Sheets dashboards.",
      "exp.sf.li3": "Contributed to database design, managed GCP resources, provided remote IT support via AnyDesk, and created technical tutorials for internal training.",

      "edu.title": "Centro Universitário Integrado — Systems Analysis and Development",
      "edu.date": "May 2025 – Jan 2027 (Estimated)",

      "footer.text": "Designed & built by Renan Ropelato",

      "resume.location": "Campo Mourão, Paraná - Brazil",
      "resume.downloadpdf": "[download pdf]",
      "resume.summary.heading": "Summary",
      "resume.summary.text": "Backend Developer with expertise in Java, Spring and Python. Experienced in web development and building fully functional web applications. Also highly experienced in process automation, creating efficient solutions to streamline workflows and reduce manual tasks.",
      "resume.skills.heading": "Skills",
      "resume.experience.heading": "Professional Experience",
      "resume.education.heading": "Education",
      "resume.ipm.li1": "Work at the city hall of Campo Mourão, Paraná, Brazil.",
    },
    pt: {
      "nav.about": "[1] sobre",
      "nav.projects": "[2] projetos",
      "nav.skills": "[3] habilidades",
      "nav.experience": "[4] experiência",
      "nav.education": "[5] formação",
      "nav.contact": "[6] contato",
      "nav.resume": "[7] currículo",

      "about.subtitle": "> Desenvolvedor Full-Stack",
      "about.line1": "Desenvolvedor full-stack focado em Java, Python e sistemas práticos que tornam o trabalho do dia a dia mais rápido.",
      "about.line2": "Experiência em aplicações web, integrações de API, modelagem de banco de dados e automação de processos com ferramentas como Selenium, Playwright, VBA e Google Apps Script.",
      "about.line3": "Mora em Campo Mourão, Paraná, Brasil.",
      "link.resume": "[currículo]",

      "project.pawnnexus": "Uma plataforma de comunidade de Dragon's Dogma 2 para listagem e gerenciamento de pawns.",
      "project.chromedriver": "Atualizador de ChromeDriver escrito em Go.",
      "project.flaskbase": "PROJETO DE ESTUDO - Template base de projeto Flask.",
      "project.phplogin": "PROJETO DE ESTUDO - Sistema de login escrito em PHP.",
      "project.pythondb": "PROJETO DE ESTUDO - Gerador semiautomático de banco de dados escrito em Python.",
      "projects.viewall": "→ ver todos os repositórios",

      "skills.programming": "Programação & Scripting",
      "skills.frameworks": "Frameworks & Bibliotecas",
      "skills.tools": "Ferramentas & Plataformas",
      "skills.data": "Dados & Automação",

      "exp.ipm.title": "IPM Sistemas — Analista de Suporte Residente",
      "exp.ipm.date": "Nov 2025 – Atual",
      "exp.ipm.li1": "Atua na prefeitura de Campo Mourão, Paraná, Brasil.",
      "exp.sf.title": "Solução Financeira — Assistente Técnico",
      "exp.sf.date": "Mai 2022 – Set 2025",
      "exp.sf.li1": "Desenvolveu aplicações internas full-stack com integração de API, automação de processos (Python, VBA, Apps Script) e suporte a sistemas legados, melhorando a eficiência operacional.",
      "exp.sf.li2": "Automatizou tarefas web e extração de dados usando Selenium, BeautifulSoup, Playwright e PyAutoGUI; manteve dashboards dinâmicos em Excel/Google Sheets.",
      "exp.sf.li3": "Contribuiu para o design de banco de dados, gerenciou recursos do GCP, prestou suporte técnico remoto via AnyDesk e criou tutoriais técnicos para treinamento interno.",

      "edu.title": "Centro Universitário Integrado — Análise e Desenvolvimento de Sistemas",
      "edu.date": "Mai 2025 – Jan 2027 (Estimado)",

      "footer.text": "Projetado & desenvolvido por Renan Ropelato",

      "resume.location": "Campo Mourão, Paraná - Brasil",
      "resume.downloadpdf": "[baixar pdf]",
      "resume.summary.heading": "Resumo",
      "resume.summary.text": "Desenvolvedor Backend com experiência em Java, Spring e Python. Experiência em desenvolvimento web e na construção de aplicações web totalmente funcionais. Também com ampla experiência em automação de processos, criando soluções eficientes para otimizar fluxos de trabalho e reduzir tarefas manuais.",
      "resume.skills.heading": "Habilidades",
      "resume.experience.heading": "Experiência Profissional",
      "resume.education.heading": "Formação Acadêmica",
      "resume.ipm.li1": "Atua na prefeitura de Campo Mourão, Paraná, Brasil.",
    },
  };

  function applyLang(lang) {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang-btn") === lang);
    });
  }

  function setLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* storage unavailable (private mode etc.) — just skip persistence */
    }
    applyLang(lang);
  }

  let lang = "en";
  try {
    lang = localStorage.getItem(STORAGE_KEY) || "en";
  } catch (e) {
    /* ignore */
  }

  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang-btn")));
  });

  applyLang(lang);
})();
