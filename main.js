document.addEventListener('DOMContentLoaded', function() {
  const inputElement = document.getElementById('input');
  const outputElement = document.getElementById('output');
  const startupSound = document.getElementById('startup-sound');
  const beepSound = document.getElementById('beep-sound');
  const desktopIcon = document.getElementById('desktop-icon');
  const terminalContainer = document.querySelector('.terminal-container');
  const loading = document.getElementById('loading');
  const progressBar = document.getElementById('progress-bar');

  desktopIcon.addEventListener('click', function() {
    hideTerminalIcon();
    showLoading();
    setTimeout(function() {
      hideLoading();
      showTerminal();
      playStartupSound();
    }, 4000);
  });
  
  startupSound.addEventListener('ended', function() {
    console.log('O áudio de inicialização foi reproduzido com sucesso! Isso quer dizer que provavelmente o site carregou da forma correta.');
  });
  
  displayWelcomeMessage();

  inputElement.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      handleCommand(inputElement.value.toLowerCase());
      inputElement.value = '';
      playBeepSound();
    }
  });

  function handleCommand(command) {
    const output = document.createElement('p');
    output.textContent = `$ ${command}`;
    outputElement.appendChild(output);
    outputElement.scrollTo({
        top: outputElement.scrollHeight,
        behavior: 'smooth'
    });
    
    beepSound.play();

    switch (command.trim()) {
        case 'about':
            displayAboutInfo();
            break;
        case 'skills':
            displaySkills();
            break;
        case 'contact':
            displayContactInfo();
            break;
        case 'projects':
            displayProjects();
            break;
        case 'joke':
            displayJoke();
            break;
        case 'kill':
            displayKill();
            break;
        case 'easteregg':
            displayEasterEgg();
            break;
        case 'config':
            displayConfig();
            break;
        case 'clear':
            clearTerminal();
            break;
        default:
            simulateResponse(command);
            break;
    }
  }

  function displayWelcomeMessage() {
      const welcomeMessage = `
      Welcome to Ropelato's Portfolio! Try typing "about" for more information.
      `;
      const welcomeResponse = document.createElement('p');
      welcomeResponse.textContent = welcomeMessage;
      outputElement.appendChild(welcomeResponse);
  }

  function displayAboutInfo() {
    const aboutInfo = `
    Name: [Renan Ropelato] <br>
    Occupation: [Data Assistant] <br>
    Location: [Brazil] <br> 
    Interests: [Games, Cats & Coffee] <br><br>
    
    Hello there! I'm Ropelato, a Brazilian with aspirations of becoming a full-stack developer. My journey into coding began in late 2021, where I embarked on various projects using Python, primarily for personal enjoyment and to assist friends. Since early 2024, I've been pursuing a degree in Systems Analysis and Development at <a href="https://www.unicesumar.edu.br/" target="_blank">UNICESUMAR</a>. Among the array of programming languages, my top picks include JavaScript, Visual Basic and Python. Currently, I work at <a href="https://www.solucaofinanceira.com/" target="_blank">Solução Financeira</a> as a Data Assistant.
    <br><br>
    In my free time i like to play games, study more or just be with my wife and cats.<br><br>
    Made and coded by Ropelato with <i class="fa-solid fa-heart" style="color: #0f0;"></i>
    `;
    const aboutResponse = document.createElement('p');
    aboutResponse.innerHTML = aboutInfo;
    outputElement.appendChild(aboutResponse);
  }

  function displaySkills() {
    const skillsInfo = `
    languages <br>
    - JavaScript <i class="fab fa-js" style="color: #0f0;"></i> : [ █ █ █ █ ░ ░ ░ ░ ░ ░ ] 4/10 <br>
    - Visual Basic &#x221e; : [ █ █ █ █ █ █ █ █ ░ ░ ] 8/10 <br>
    - Python <i class="fab fa-python" style="color: #0f0;"></i> : [ █ █ █ █ █ ░ ░ ░ ░ ░ ] 5/10 <br>
    - Java <i class="fab fa-java" style="color: #0f0;"></i> : [ █ █ █ ░ ░ ░ ░ ░ ░ ░ ] 3/10 <br><br>
    
    frameworks <br>
    - Angular <i class="fab fa-angular" style="color: #0f0;"></i> : [ █ ░ ░ ░ ░ ░ ░ ░ ░ ░ ] 1/10 <br>
    - Express.js: [ █ █ ░ ░ ░ ░ ░ ░ ░ ░ ] 2/10 <br>
    - Node.js <i class="fab fa-node-js" style="color: #0f0;"></i> : [ █ █ ░ ░ ░ ░ ░ ░ ░ ░ ] 2/10 <br>
    - MongoDB: [ █ ░ ░ ░ ░ ░ ░ ░ ░ ░ ] 1/10 <br>
    - PyQT: [ █ █ █ ░ ░ ░ ░ ░ ░ ░ ] 3/10 <br><br>

    tools <br>
    - Selenium [ █ █ █ █ █ █ █ █ ░ ░ ] 8/10 <br><br>

    Currently, i'm learning MEAN Stack (MongoDB, Express.js, Angular, Node.js).
    `;
    const skillsResponse = document.createElement('p');
    skillsResponse.innerHTML = skillsInfo;
    outputElement.appendChild(skillsResponse);
  }

  function displayContactInfo() {
    const contactInfo = `
    Contact Information <br>
    - GitHub <i class="fab fa-github" style="color: #0f0;"></i> : <a href="https://github.com/rRopelato" target="_blank">rRopelato</a> <br>
    - LinkedIn <i class="fab fa-linkedin" style="color: #0f0;"></i> : <a href="https://www.linkedin.com/in/renan-ropelato/" target="_blank">Renan Ropelato</a> <br>
    - Discord <i class="fab fa-discord" style="color: #0f0;"></i> : ropelato <br>
    - E-mail: <a href="mailto:r.ropelato@proton.me">r.ropelato@proton.me</a> <br><br>
    
    Please note that I am in the GMT-03 (Brasilia) timezone, so my response time may vary.
    
    `;
  
    const contactResponse = document.createElement('p');
    contactResponse.innerHTML = contactInfo;
    outputElement.appendChild(contactResponse);
  }

  function displayJoke() {
    const jokes = [
        "Why did the programmer go to bed? Because he wanted to catch up on his sleep(0)!",
        "Why was the JavaScript developer sad? Because he didn't know how to 'null' his feelings!",
        "Why was the HTML developer so lost? He didn't know which 'address' to go to!",
        "Why don't programmers like nature? It has too many bugs!",
        "Why do Java developers wear glasses? Because they can't C#!",
        "Why did the computer go to the doctor? Because it had a virus!",
        "Why did the developer go broke? Because he used up all his cache!",
        "Why was the HTML confused? Because it had lost its <head>!",
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "Why was the computer cold? Because it left its Windows open!",

    ];
  
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  
    const jokeResponse = document.createElement('p');
    jokeResponse.textContent = randomJoke;
    outputElement.appendChild(jokeResponse);
  }

  function displayConfig() {
    const configInfo = `
    Configuration <br>
    W.I.P
    `;
  
    const configResponse = document.createElement('p');
    configResponse.innerHTML = contactInfo;
    outputElement.appendChild(configResponse);
  }

  function simulateResponse(command) {
    const response = document.createElement('p');
    response.textContent = `Command not found: "${command}"`;
    outputElement.appendChild(response);
  }

  function clearTerminal() {
    outputElement.innerHTML = '';
  }

  function displayProjects() {
    const projectsInfo = `
    Projects <br>
    - Project 1: <a href="https://github.com/rRopelato/chromedriver-updater" target="_blank">ChromeDriver Updater</a> - Auto Update the ChromeDriver for Selenium | <i class="fab fa-python" style="color: #0f0;"></i><br>
    - Project 2: <a href="https://github.com/rRopelato/TransmuteCraft" target="_blank">TransmuteCraft</a> - A plugin for custom crafting GUI in Minecraft | <i class="fab fa-java" style="color: #0f0;"></i><br>
    - Project 3: <a href="https://github.com/Ropelatoo/Nunu-Picker" target="_blank">Nunu Picker</a> - A Nunu & Willump skin and build randomizer for League of Legends | <i class="fab fa-python" style="color: #0f0;"></i><br>
    - Project 4: <a href="https://github.com/rRopelato/rropelato.github.io" target="_blank">My Portfolio</a> - Portfolio with a terminal theme | <i class="fab fa-js" style="color: #0f0;"></i> <i class="fab fa-html5" style="color: #0f0;"></i> <i class="fab fa-css3-alt" style="color: #0f0;"></i><br>
    
    `;
    
    const projectsResponse = document.createElement('p');
    projectsResponse.innerHTML = projectsInfo;
    outputElement.appendChild(projectsResponse);
  }

  function displayEasterEgg() {
    const eastereggInfo = `
    Huh...? <br>
    So, i guess you was looking into the code, and found out this hidden command that isn't visible on the terminal commands. <br>
  
  `;

  const eastereggResponse = document.createElement('p');
  eastereggResponse.innerHTML = eastereggInfo;
  outputElement.appendChild(eastereggResponse);
  }

  function displayKill() {
    const killInfo = `
    HEY! <br>
    You can't just go into people portfolio and start using random commands trying to break their website... <br><br>

    Even though this doesn't work.
  
  `;

  const killResponse = document.createElement('p');
  killResponse.innerHTML = killInfo;
  outputElement.appendChild(killResponse);
  }

  function hideTerminalIcon() {
    desktopIcon.style.display = 'none';
  }

  function showTerminal() {
    terminalContainer.classList.remove('hidden');
  }

  function playStartupSound() {
    startupSound.play();
  }

  function playBeepSound() {
    beepSound.play();
  }

  function playHDDSound() {
    const hddSound = document.getElementById('hdd-sound');
    hddSound.play();
  }

  function showLoading() {
    loading.style.display = 'flex';
    progressBar.style.width = '100%'; 
    playHDDSound();
  }
  
  function hideLoading() {
    loading.style.display = 'none';
    progressBar.style.width = '0';
  }
});
