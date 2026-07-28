class Butterfly {
  constructor(containerBox) {
    this.containerBox = containerBox;
    this.domElement = this.createDOM();
    
    // Bounding dimensions
    const rect = this.containerBox.getBoundingClientRect();
    this.boxWidth = rect.width || window.innerWidth * 0.66;
    this.boxHeight = rect.height || window.innerHeight;

    // Randomize initial spatial parameters within the right box
    this.x = Math.random() * this.boxWidth;
    this.y = Math.random() * this.boxHeight;
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
    
    // Left Wing Group (Forewing + Hindwing)
    const wingLeft = document.createElement('div');
    wingLeft.className = 'wing wing-left';
    const fwLeft = document.createElement('div');
    fwLeft.className = 'wing forewing';
    const hwLeft = document.createElement('div');
    hwLeft.className = 'wing hindwing';
    wingLeft.appendChild(fwLeft);
    wingLeft.appendChild(hwLeft);
    
    // Right Wing Group (Forewing + Hindwing)
    const wingRight = document.createElement('div');
    wingRight.className = 'wing wing-right';
    const fwRight = document.createElement('div');
    fwRight.className = 'wing forewing';
    const hwRight = document.createElement('div');
    hwRight.className = 'wing hindwing';
    wingRight.appendChild(fwRight);
    wingRight.appendChild(hwRight);
    
    butterfly.appendChild(bodyCenter);
    butterfly.appendChild(wingLeft);
    butterfly.appendChild(wingRight);
    container.appendChild(butterfly);
    
    return container;
  }

  update(targetCursor, isCursorActive) {
    // Update local box dimensions on update loop in case of resizing
    const rect = this.containerBox.getBoundingClientRect();
    this.boxWidth = rect.width;
    this.boxHeight = rect.height;

    if (isCursorActive && targetCursor) {
      // Pull towards cursor if active inside the box
      const dx = targetCursor.x - this.x;
      const dy = targetCursor.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 10) {
        this.speedX += (dx / dist) * 0.3;
        this.speedY += (dy / dist) * 0.3;
      }
    } else {
      // Standard autonomous wandering behavior
      this.angle += (Math.random() - 0.5) * 0.4;
      this.speedX += Math.cos(this.angle) * 0.15;
      this.speedY += Math.sin(this.angle) * 0.15;
    }
    
    // Clamp maximum speeds
    const maxSpeed = 4.0;
    this.speedX = Math.max(-maxSpeed, Math.min(maxSpeed, this.speedX));
    this.speedY = Math.max(-maxSpeed, Math.min(maxSpeed, this.speedY));
    
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Strict Rectangle Border Collision Handling (bounce back)
    const margin = 30;
    if (this.x < margin) {
      this.x = margin;
      this.speedX *= -1;
    }
    if (this.x > this.boxWidth - margin) {
      this.x = this.boxWidth - margin;
      this.speedX *= -1;
    }
    if (this.y < margin) {
      this.y = margin;
      this.speedY *= -1;
    }
    if (this.y > this.boxHeight - margin) {
      this.y = this.boxHeight - margin;
      this.speedY *= -1;
    }
    
    const rotationRad = Math.atan2(this.speedY, this.speedX);
    const rotationDeg = (rotationRad * 180 / Math.PI) - 90; 
    
    this.domElement.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) scale(${this.scale})`;
    this.domElement.firstElementChild.style.transform = `rotateZ(${rotationDeg}deg)`;
  }
}

// Setup and Interaction State
document.addEventListener("DOMContentLoaded", () => {
  const containerBox = document.getElementById('butterfly-box');
  if (!containerBox) return;

  const butterflySwarm = [];
  const totalButterflies = 12;

  for (let i = 0; i < totalButterflies; i++) {
    butterflySwarm.push(new Butterfly(containerBox));
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
    // If cursor stops moving for 1.5 seconds, trigger scatter away behavior
    stopTimer = setTimeout(() => {
      cursorMoving = false;
      // Give them a sudden burst away from the resting cursor
      butterflySwarm.forEach(b => {
        b.speedX = (Math.random() - 0.5) * 8;
        b.speedY = (Math.random() - 0.5) * 8;
      });
    }, 1500);
  });

  containerBox.addEventListener('mouseleave', () => {
    isCursorInBox = false;
    mousePos = null;
    clearTimeout(stopTimer);
  });

  function animationLoop() {
    // Butterflies track cursor only if it's inside the box AND currently moving
    const activeTracking = isCursorInBox && cursorMoving;
    butterflySwarm.forEach(butterfly => butterfly.update(mousePos, activeTracking));
    requestAnimationFrame(animationLoop);
  }

  requestAnimationFrame(animationLoop);
});