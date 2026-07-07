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