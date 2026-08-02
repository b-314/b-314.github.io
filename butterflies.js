class Butterfly {
  constructor(containerBox, index) {
    this.containerBox = containerBox;
    this.index = index;
    this.domElement = this.createDOM();

    const rect = this.containerBox.getBoundingClientRect();
    this.boxWidth = rect.width || window.innerWidth * 0.66;
    this.boxHeight = rect.height || window.innerHeight;

    // Initialize positions safely inside the center area
    this.x = this.boxWidth * 0.2 + Math.random() * (this.boxWidth * 0.6);
    this.y = this.boxHeight * 0.2 + Math.random() * (this.boxHeight * 0.6);

    // Movement vectors
    const angle = Math.random() * Math.PI * 2;
    this.speed = 3.5;
    this.vx = Math.cos(angle) * this.speed;
    this.vy = Math.sin(angle) * this.speed;

    this.wanderAngle = Math.random() * Math.PI * 2;
    this.scale = 0.5 + Math.random() * 0.7;

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

    // 1. Organic Wandering (Keeps them fluttering randomly)
    this.wanderAngle += (Math.random() - 0.5) * 0.6;
    const wanderX = Math.cos(this.wanderAngle) * 0.5;
    const wanderY = Math.sin(this.wanderAngle) * 0.5;

    // 2. Center Affinity (Balances out total center pull)
    const toCenterX = centerX - this.x;
    const toCenterY = centerY - this.y;
    const distToCenter = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY);
    let centerPullX = 0;
    let centerPullY = 0;
    
    if (distToCenter > this.boxWidth * 0.25) {
      const centerFactor = 0.0006 * (distToCenter / (this.boxWidth * 0.1));
      centerPullX = toCenterX * centerFactor;
      centerPullY = toCenterY * centerFactor;
    }

    // 3. Anticipatory Edge Turning (Curving away before hitting boundaries)
    const margin = 120;
    let edgeX = 0;
    let edgeY = 0;

    if (this.x < margin) {
      const intensity = (margin - this.x) / margin;
      edgeX += intensity * 0.4;
    } else if (this.x > this.boxWidth - margin) {
      const intensity = (this.x - (this.boxWidth - margin)) / margin;
      edgeX -= intensity * 0.4;
    }

    if (this.y < margin) {
      const intensity = (margin - this.y) / margin;
      edgeY += intensity * 0.4;
    } else if (this.y > this.boxHeight - margin) {
      const intensity = (this.y - (this.boxHeight - margin)) / margin;
      edgeY -= intensity * 0.4;
    }

    // 4. Cursor Following (Attraction behavior)
    let cursorFx = 0;
    let cursorFy = 0;
    if (isCursorActive && targetCursor) {
      const dx = targetCursor.x - this.x;
      const dy = targetCursor.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Pull toward cursor gently if they are a bit far away, let wander take over close up
      if (dist > 30) {
        const pullStrength = Math.min(0.3, dist * 0.002);
        cursorFx = (dx / dist) * pullStrength;
        cursorFy = (dy / dist) * pullStrength;
      }
    }

    // 5. Flocking / Personal Space (Prevents them from clumping together)
    let separateX = 0;
    let separateY = 0;
    allButterflies.forEach((other, idx) => {
      if (idx !== this.index) {
        const sdx = this.x - other.x;
        const sdy = this.y - other.y;
        const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
        const minDistance = 50;

        if (sdist < minDistance && sdist > 0) {
          const force = (minDistance - sdist) / minDistance;
          separateX += (sdx / sdist) * force * 0.3;
          separateY += (sdy / sdist) * force * 0.3;
        }
      }
    });

    // Aggregate all forces onto velocity
    this.vx += wanderX + centerPullX + edgeX + cursorFx + separateX;
    this.vy += wanderY + centerPullY + edgeY + cursorFy + separateY;

    // Speed normalization & clamping (maintains fluid, graceful movement speed)
    const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    const targetSpeed = 4.0; // Paced slightly faster

    if (currentSpeed > 0) {
      this.vx = (this.vx / currentSpeed) * Math.min(targetSpeed, currentSpeed);
      this.vy = (this.vy / currentSpeed) * Math.min(targetSpeed, currentSpeed);
    }

    // Apply movement
    this.x += this.vx;
    this.y += this.vy;

    // Calculate heading rotation smoothly
    const rotationRad = Math.atan2(this.vy, this.vx);
    const rotationDeg = (rotationRad * 180 / Math.PI) + 90;

    // Render updates
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

  containerBox.addEventListener('mousemove', (e) => {
    const rect = containerBox.getBoundingClientRect();
    mousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    isCursorInBox = true;
  });

  containerBox.addEventListener('mouseleave', () => {
    isCursorInBox = false;
    mousePos = null;
  });

  function animationLoop() {
    // Pass isCursorInBox directly so they track the mouse continuously while inside
    butterflySwarm.forEach(butterfly => butterfly.update(mousePos, isCursorInBox, butterflySwarm));
    requestAnimationFrame(animationLoop);
  }

  requestAnimationFrame(animationLoop);
});