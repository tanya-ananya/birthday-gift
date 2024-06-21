const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.friction = 0.99;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.02;
    }
}

class Firework {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {x: 0, y: Math.random() * -4.5 - 1.5};
        this.particles = [];
        this.lifespan = 120;
        this.hasExploded = false;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    explode() {
        for (let i = 0; i < 50; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color));
        }
    }

    update() {
        this.lifespan--;

        if (this.lifespan <= 0 && !this.hasExploded) {
            this.explode();
            this.velocity = {x: 0, y: 0};
            this.hasExploded = true;
        } else if (this.lifespan > 0) {
            this.y += this.velocity.y;
        }

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
            this.particles[i].draw();
        }
    }
}

let fireworks = [];
let startTime = Date.now();
let slowedDown = false;

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const currentTime = Date.now();
    if (currentTime - startTime >= 10000 && !slowedDown) {
        fireworks.forEach(firework => {
            firework.velocity.y /= 2;
            firework.particles.forEach(particle => {
                particle.velocity.x /= 2;
                particle.velocity.y /= 2;
            });
        });
        slowedDown = true;
        displayBanner();
    }

    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();

        if (firework.lifespan <= 0 && firework.particles.every(p => p.alpha <= 0)) {
            fireworks.splice(index, 1);
        }
    });

    if (Math.random() < 0.03) {
        const x = Math.random() * canvas.width;
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        fireworks.push(new Firework(x, canvas.height, color));
    }
}

function displayBanner() {
    // Import Google Fonts stylesheet
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Sacramento&family=Sofia&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const bannerContainer = document.createElement('div');
    bannerContainer.id = 'banner-container';
    bannerContainer.style.position = 'fixed';
    bannerContainer.style.top = '0';
    bannerContainer.style.left = '0';
    bannerContainer.style.width = '100%';
    bannerContainer.style.height = '100%';
    bannerContainer.style.display = 'flex';
    bannerContainer.style.alignItems = 'center';
    bannerContainer.style.justifyContent = 'center';

    const banner = document.createElement('div');
    banner.id = 'banner';
    banner.style.padding = '20px 40px';
    banner.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    banner.style.color = 'white';
    banner.style.fontSize = '36px'; // Increase font size for better visibility
    banner.style.textAlign = 'center';
    banner.style.borderRadius = '5px';
    banner.style.position = 'relative';
    banner.style.overflow = 'hidden';
    banner.style.fontFamily = 'Sacramento, cursive'; // Apply Sacramento font, fallback to generic cursive

    const link = document.createElement('a');
    link.href = 'box.html';
    link.style.color = 'white';
    link.style.textDecoration = 'none';
    link.innerText = 'Happy Birthday';
    link.style.fontFamily = 'Sacramento, cursive'; // Ensure link also uses Sacramento font

    banner.appendChild(link);
    bannerContainer.appendChild(banner);
    document.body.appendChild(bannerContainer);

    // Add CSS for pseudo-elements
    const style = document.createElement('style');
    style.innerHTML = `
        #banner::before, #banner::after {
            content: '';
            position: absolute;
            bottom: -20px;
            border-width: 20px 20px 0 20px;
            border-style: solid;
            border-color: rgba(0, 0, 0, 0.5) transparent transparent transparent;
        }

        #banner::before {
            left: 0;
        }

        #banner::after {
            right: 0;
        }

        #banner a {
            color: white;
            text-decoration: none;
            font-family: Sacramento, cursive; // Ensure link also uses Sacramento font
        }
    `;
    document.head.appendChild(style);
}

animate();
