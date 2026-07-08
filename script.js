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
const themeIcon = themeToggle.querySelector("i");

function applyLight() {
    themeIcon.classList.remove("fa-sun-o");
    themeIcon.classList.add("fa-moon-o");
}

function applyDark() {
    themeIcon.classList.remove("fa-moon-o");
    themeIcon.classList.add("fa-sun-o");
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