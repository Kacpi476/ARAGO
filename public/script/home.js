// linie w main carousel
function drawEdgeToEdgeLines() {
    const column = document.querySelector('.numbers_column');
    const circles = column.querySelectorAll('.circle');
    const svg = document.getElementById('lines');
    const containerRect = column.getBoundingClientRect();

    let lines = '';

    for (let i = 0; i < circles.length - 1; i++) {
        const rect1 = circles[i].getBoundingClientRect();
        const rect2 = circles[i + 1].getBoundingClientRect();

        const x1 = rect1.left + rect1.width / 2 - containerRect.left;
        const y1 = rect1.bottom - containerRect.top;

        const x2 = rect2.left + rect2.width / 2 - containerRect.left;
        const y2 = rect2.top - containerRect.top;

        lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="white" stroke-width="3"/>`;
        }

    svg.innerHTML = lines;
}

window.addEventListener('load', drawEdgeToEdgeLines);
window.addEventListener('resize', drawEdgeToEdgeLines);




const circles = document.querySelectorAll('.circle');
const categoryEl = document.querySelector('.carousel_category');
const titleEl = document.querySelector('.carousel_article_title');
const readMoreLink = document.querySelector('.bottom-right_learnmore a');
const infoDesc = document.querySelector('.bottom-right_info p');
const carousel = document.querySelector('.carousel');
const bottomRightBtn = document.querySelector('.bottom-right');

let currentIndex = 0; // aktualnie aktywny indeks
let autoScrollInterval = null; // przechowuje referencję do setInterval

function updateCarousel(index) {
    const data = carouselData[index];

    categoryEl.classList.add('carousel_text_fade');
    titleEl.classList.add('carousel_text_fade');
    infoDesc.classList.add('carousel_info_fade');

    // animujemy tło przez carousel-bg (fade-in nowego zdjęcia)
    carousel.style.backgroundImage = `linear-gradient(#32449880, #32449880), url('${data.image}')`;

    setTimeout(() => {
        // aktualizacja treści
        categoryEl.textContent = data.category;
        titleEl.textContent = data.title;
        readMoreLink.href = data.link;
        infoDesc.textContent = data.description;

        bottomRightBtn.onclick = () => {
            window.location = data.link;
        };

        categoryEl.classList.remove('carousel_text_fade');
        titleEl.classList.remove('carousel_text_fade');
        infoDesc.classList.remove('carousel_info_fade');

    }, 200);

    // Zmieniamy klasę aktywnego kółka
    circles.forEach(c => c.classList.remove('active'));
    circles[index].classList.add('active');

    // Aktualizujemy indeks
    currentIndex = index;
}

circles.forEach((circle, index) => {
    circle.addEventListener('click', () => {
        updateCarousel(index);
        resetAutoScroll(); // restart autoscrolla po ręcznej zmianie
    });
});

document.addEventListener('DOMContentLoaded', () => {
    updateCarousel(0);
    startAutoScroll(); // uruchamiamy automatyczne przewijanie po załadowaniu
});

// AUTOSCROLL

function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % carouselData.length;
        updateCarousel(nextIndex);
    }, 5000); // zmiana co 5 sekund
}

function resetAutoScroll() {
    clearInterval(autoScrollInterval);
    startAutoScroll();
}



