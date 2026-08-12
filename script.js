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

/* ---------------- HIDE BULLET POINTS ---------------- */
function setupAllCardsOverflow() {
    const cards = document.querySelectorAll('.project-content');
    cards.forEach(container => {
        const tagsContainer = container.querySelector('.project-tags');
        const listItems = container.querySelectorAll('.project-description li');
        const tags = tagsContainer ? Array.from(tagsContainer.querySelectorAll('.tag')) : [];

        const checkOverflow = () => {
            const containerBottom = container.getBoundingClientRect().bottom - 2;

            if (tagsContainer) tagsContainer.classList.remove('is-hidden');
            tags.forEach(tag => tag.classList.remove('is-hidden'));
            listItems.forEach(li => li.classList.remove('is-hidden'));

            let hasOverflow = () => {
                if (tagsContainer && tagsContainer.getBoundingClientRect().bottom > containerBottom) return true;
                for (let li of listItems) {
                    if (!li.classList.contains('is-hidden') && li.getBoundingClientRect().bottom > containerBottom) return true;
                }
                return false;
            };

            while (hasOverflow()) {
                let hiddenAny = false;

                for (let i = listItems.length - 1; i >= 0; i--) {
                    if (!listItems[i].classList.contains('is-hidden')) {
                        listItems[i].classList.add('is-hidden');
                        hiddenAny = true;
                        break;
                    }
                }

                if (!hiddenAny && tags.length > 0) {
                    for (let i = tags.length - 1; i >= 0; i--) {
                        if (!tags[i].classList.contains('is-hidden')) {
                            tags[i].classList.add('is-hidden');
                            const visibleTags = tags.filter(t => !t.classList.contains('is-hidden'));
                            if (visibleTags.length > 0) {
                                const firstTop = visibleTags[0].getBoundingClientRect().top;
                                for (let t of visibleTags) {
                                    if (t.getBoundingClientRect().top > firstTop + 5) {
                                        t.classList.add('is-hidden');
                                    }
                                }
                            }
                            hiddenAny = true;
                            break;
                        }
                    }
                }
                if (!hiddenAny) break;
            }
        };

        const observer = new ResizeObserver(checkOverflow);
        observer.observe(container);
        checkOverflow();
    });
}

window.addEventListener('load', setupAllCardsOverflow);
/* ---------------- TAG COLORS ---------------- */

document.querySelectorAll('.tag').forEach(tag => {
    const randomHue = Math.floor(Math.random() * (330 - 200 + 1)) + 200;
    tag.style.setProperty('--tag-hue', randomHue);
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