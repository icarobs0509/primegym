
// Menu mobile (hambúrguer)
const menuToggle = document.getElementById('menu-toggle');
const menuLista = document.getElementById('menu-lista');
if (menuToggle && menuLista) {
    menuToggle.addEventListener('click', () => {
        const aberto = menuLista.classList.toggle('aberto');
        menuToggle.classList.toggle('aberto', aberto);
        menuToggle.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });
    menuLista.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuLista.classList.remove('aberto');
            menuToggle.classList.remove('aberto');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Animação de entrada ao rolar a página (IntersectionObserver)
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // anima só uma vez
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-card').forEach((element) => {
    observer.observe(element);
});

// Validação do formulário de contato
const formContato = document.getElementById('form-contato');
if (formContato) {
    formContato.addEventListener('submit', function (event) {
        event.preventDefault();
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const feedback = document.getElementById('form-feedback');

        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!nome || !emailOk) {
            feedback.style.color = '#ff8a8a';
            feedback.textContent = 'Preencha ao menos nome e e-mail válidos.';
            return;
        }

        feedback.style.color = '';
        feedback.textContent = `Obrigado pelo contato, ${nome}! Entraremos em contato em breve.`;
        this.reset();
    });
}

// ===== Fundo animado do Hero: rede de partículas em canvas =====
(function () {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const hero = canvas.parentElement;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cores = ['#ff5f6d', '#a259ff', '#39cfda'];

    let largura, altura, particulas, animId;

    function redimensionar() {
        largura = canvas.width = hero.offsetWidth;
        altura = canvas.height = hero.offsetHeight;
    }

    function criarParticulas() {
        const quantidade = Math.min(70, Math.max(24, Math.floor((largura * altura) / 16000)));
        particulas = Array.from({ length: quantidade }, () => ({
            x: Math.random() * largura,
            y: Math.random() * altura,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.8 + 1,
            cor: cores[Math.floor(Math.random() * cores.length)]
        }));
    }

    function desenharFrame() {
        ctx.clearRect(0, 0, largura, altura);

        // move as partículas e faz elas quicarem nas bordas
        particulas.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x <= 0 || p.x >= largura) p.vx *= -1;
            if (p.y <= 0 || p.y >= altura) p.vy *= -1;
        });

        // liga com uma linha as partículas que estão próximas
        for (let i = 0; i < particulas.length; i++) {
            for (let j = i + 1; j < particulas.length; j++) {
                const a = particulas[i];
                const b = particulas[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distancia = Math.sqrt(dx * dx + dy * dy);
                if (distancia < 130) {
                    ctx.strokeStyle = `rgba(255,255,255,${(1 - distancia / 130) * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        // desenha as partículas por cima das linhas, com um leve brilho
        particulas.forEach((p) => {
            ctx.beginPath();
            ctx.fillStyle = p.cor;
            ctx.shadowColor = p.cor;
            ctx.shadowBlur = 8;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.shadowBlur = 0;
    }

    function loop() {
        desenharFrame();
        animId = requestAnimationFrame(loop);
    }

    redimensionar();
    criarParticulas();

    if (prefersReduced) {
        desenharFrame(); // desenha só um quadro parado, sem animar
    } else {
        loop();
    }

    window.addEventListener('resize', () => {
        redimensionar();
        criarParticulas();
    });
})();