/* ---------------- NAVIGATION ---------------- */

const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav-menu");
const overlay = document.querySelector(".overlay");

function toggleMenu() {
    menuBtn.classList.toggle("active");
    nav.classList.toggle("active");
    overlay.classList.toggle("active");
}

menuBtn.addEventListener("click", toggleMenu);
overlay.addEventListener("click", toggleMenu);

/* ---------------- THEME TOGGLE ---------------- */

const themeToggle = document.getElementById("theme-toggle");

// Restore saved preference
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    document.body.classList.add("light");
    themeToggle.checked = true;
} else {
    document.body.classList.remove("light");
    themeToggle.checked = false;
}

themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
        document.body.classList.add("light");
        localStorage.setItem("theme", "light");
    } else {
        document.body.classList.remove("light");
        localStorage.setItem("theme", "dark");
    }
});

/* ---------------- REVEAL ANIMATION ---------------- */

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, {
    threshold: 0.2
});

document.querySelectorAll(".reveal, .reveal-heading, .reveal-words, .gallery img").forEach(el => {
    observer.observe(el);
});

/* ---------------- ART MODAL ---------------- */

const modal = document.querySelector(".art-modal");

const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalReference = document.getElementById("modal-reference");

document.querySelectorAll(".gallery img").forEach(image => {
    image.addEventListener("click", () => {
        modalImage.src = image.src;
        modalTitle.textContent = image.dataset.title;
        modalDescription.textContent = image.dataset.description;
        modalReference.innerHTML = image.dataset.reference;
        modal.classList.add("active");
    });
});

document.querySelector(".close-art").addEventListener("click", () => {
    modal.classList.remove("active");
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("active");
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        modal.classList.remove("active");
    }
});