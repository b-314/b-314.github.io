class Butterfly {
  constructor(containerBox, index) {
    this.containerBox = containerBox;
    this.index = index;
    this.domElement = this.createDOM();

    const rect = this.containerBox.getBoundingClientRect();
    this.boxWidth = rect.width || window.innerWidth * 0.66;
    this.boxHeight = rect.height || window.innerHeight;

    this.x = Math.random() * (this.boxWidth - 200) + 100;
    this.y = Math.random() * (this.boxHeight - 200) + 100;
    this.speedX = (Math.random() - 0.5) * 4;
    this.speedY = (Math.random() - 0.5) * 4;

    this.angle = Math.random() * Math.PI * 2;
    this.scale = 0.5 + Math.random() * 0.8;

    this.containerBox.appendChild(this.domElement);
  }

  createDOM() {
    const container = document.createElement('div');
    container.className = 'butterfly-container';

    const butterfly = document.createElement('div');
    butterfly.className = 'butterfly';

    const bodyCenter = document.createElement('div');
    bodyCenter.className = 'body-center';

    // Left Wing Group
    const wingLeft = document.createElement('div');
    wingLeft.className = 'wing-group wing-left';
    const fwLeft = document.createElement('div');
    fwLeft.className = 'wing-piece forewing';
    const hwLeft = document.createElement('div');
    hwLeft.className = 'wing-piece hindwing';
    wingLeft.appendChild(fwLeft);
    wingLeft.appendChild(hwLeft);

    // Right Wing Group
    const wingRight = document.createElement('div');
    wingRight.className = 'wing-group wing-right';
    const fwRight = document.createElement('div');
    fwRight.className = 'wing-piece forewing';
    const hwRight = document.createElement('div');
    hwRight.className = 'wing-piece hindwing';
    wingRight.appendChild(fwRight);
    wingRight.appendChild(hwRight);

    butterfly.appendChild(bodyCenter);
    butterfly.appendChild(wingLeft);
    butterfly.appendChild(wingRight);
    container.appendChild(butterfly);

    return container;
  }

  update(targetCursor, isCursorActive, allButterflies) {
    const rect = this.containerBox.getBoundingClientRect();
    this.boxWidth = rect.width;
    this.boxHeight = rect.height;

    const centerX = this.boxWidth / 2;
    const centerY = this.boxHeight / 2;

    if (isCursorActive && targetCursor) {
      const dx = targetCursor.x - this.x;
      const dy = targetCursor.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 10) {
        this.speedX += (dx / dist) * 0.25;
        this.speedY += (dy / dist) * 0.25;
      }
    } else {
      this.angle += (Math.random() - 0.5) * 0.4;
      this.speedX += Math.cos(this.angle) * 0.15;
      this.speedY += Math.sin(this.angle) * 0.15;
    }

    // Separation behavior: Keep space between butterflies
    allButterflies.forEach((other, idx) => {
      if (idx !== this.index) {
        const sdx = this.x - other.x;
        const sdy = this.y - other.y;
        const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
        const minDistance = 45; // Minimum personal space

        if (sdist < minDistance && sdist > 0) {
          const force = (minDistance - sdist) / minDistance;
          this.speedX += (sdx / sdist) * force * 0.4;
          this.speedY += (sdy / sdist) * force * 0.4;
        }
      }
    });

    // Increased padding so they stay much farther from the borders
    const padding = 120;
    const turnForce = 0.6;

    // Pull heavily back toward the center if hitting/approaching the padding zone
    if (this.x < padding) {
      this.speedX += turnForce;
      this.speedX += (centerX - this.x) * 0.005;
    }
    if (this.x > this.boxWidth - padding) {
      this.speedX -= turnForce;
      this.speedX += (centerX - this.x) * 0.005;
    }
    if (this.y < padding) {
      this.speedY += turnForce;
      this.speedY += (centerY - this.y) * 0.005;
    }
    if (this.y > this.boxHeight - padding) {
      this.speedY -= turnForce;
      this.speedY += (centerY - this.y) * 0.005;
    }

    const maxSpeed = 3.5;
    this.speedX = Math.max(-maxSpeed, Math.min(maxSpeed, this.speedX));
    this.speedY = Math.max(-maxSpeed, Math.min(maxSpeed, this.speedY));

    this.x += this.speedX;
    this.y += this.speedY;

    const rotationRad = Math.atan2(this.speedY, this.speedX);
    const rotationDeg = (rotationRad * 180 / Math.PI) - 90;

    this.domElement.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) scale(${this.scale})`;
    this.domElement.firstElementChild.style.transform = `rotateZ(${rotationDeg}deg)`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const containerBox = document.getElementById('butterfly-box');
  if (!containerBox) return;

  const butterflySwarm = [];
  const totalButterflies = 12;

  for (let i = 0; i < totalButterflies; i++) {
    butterflySwarm.push(new Butterfly(containerBox, i));
  }

  let mousePos = null;
  let isCursorInBox = false;
  let cursorMoving = false;
  let stopTimer = null;

  containerBox.addEventListener('mousemove', (e) => {
    const rect = containerBox.getBoundingClientRect();
    mousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    isCursorInBox = true;
    cursorMoving = true;

    clearTimeout(stopTimer);
    stopTimer = setTimeout(() => {
      cursorMoving = false;
      butterflySwarm.forEach(b => {
        b.speedX = (Math.random() - 0.5) * 6;
        b.speedY = (Math.random() - 0.5) * 6;
      });
    }, 1500);
  });

  containerBox.addEventListener('mouseleave', () => {
    isCursorInBox = false;
    mousePos = null;
    clearTimeout(stopTimer);
  });

  function animationLoop() {
    const activeTracking = isCursorInBox && cursorMoving;
    butterflySwarm.forEach(butterfly => butterfly.update(mousePos, activeTracking, butterflySwarm));
    requestAnimationFrame(animationLoop);
  }

  requestAnimationFrame(animationLoop);
});