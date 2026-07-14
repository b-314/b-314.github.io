/* ---------------- NAVIGATION ---------------- */

const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav-menu");
const overlay = document.querySelector(".overlay");

function toggleMenu(){
    menuBtn.classList.toggle("active");
    nav.classList.toggle("active");
    overlay.classList.toggle("active");
}

menuBtn.addEventListener("click", toggleMenu);
overlay.addEventListener("click", toggleMenu);

/* ---------------- THEME TOGGLE ---------------- */

const themeToggle = document.querySelector(".theme-toggle");

function applyLight() {
    themeToggle.textContent = "Dark mode →"; 
    themeToggle.setAttribute("aria-label", "Switch to dark theme");
}

function applyDark() {
    themeToggle.textContent = "Light mode →";
    themeToggle.setAttribute("aria-label", "Switch to light theme");
}

// Restore saved preference
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    document.body.classList.add("light");
    applyLight(); 
} 
else {
    document.body.classList.remove("light");
    applyDark(); 
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
       applyLight(); 
        localStorage.setItem("theme", "light");
    } 
    else {
        applyDark(); 
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

document.querySelectorAll(".reveal, .reveal-heading, .reveal-words").forEach(el => {
    observer.observe(el);
});