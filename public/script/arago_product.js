const carousel = document.getElementById('carousel');
const title = document.getElementById('carouselTitle');
const subTitle = document.getElementById('carouselText');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.querySelector('.carousel_dots');

const textWlasciwosci = document.getElementById('text_wlasciwosci');
const textDaneTechniczne = document.getElementById('text_dane_techniczne');
const textDodatkoweInfo = document.getElementById('text_dodatkowe_info');
const btnDownload = document.getElementById('download_button');

const dataSwitch = document.getElementById('dataSwitch');
const switchLogo = document.getElementById('switchLogo');
const fadeWrapper = document.querySelector('.fade-wrapper');

let currentIndex = 0;
let carouselData = {};
let imageData = [];


const isChecked = dataSwitch.checked;
let currentDataFile = isChecked ? 'clarbData.json' : 'aragoData.json';
switchLogo.src = isChecked
    ? '/img/products/small_clarb.svg'
    : '/img/products/small_arago.svg';



// Wczytywanie danych
function loadDataAndInitialize() {
    fetch(`/data/${currentDataFile}`)
        .then(response => response.json())
        .then(data => {
            carouselData = data;
            imageData = Object.keys(data).map(key => ({
                id: key,
                src: data[key].src,
                title: data[key].title
            }));
            currentIndex = 0;
            initialize();
        })
        .catch(error => {
            console.error(`Błąd wczytywania ${currentDataFile}:`, error);
        });
}

// Fade tekst
function fadeAndChangeText(element, newText) {
    if (fadeWrapper.classList.contains('fade-out')) {
        element.innerHTML = newText;
        return;
    }

    element.classList.add('fade-text');
    setTimeout(() => {
        element.innerHTML = newText;
        element.classList.remove('fade-text');
    }, 300);
}

// Inicjalizacja karuzeli
function initialize() {
    const clonesStart = imageData.slice(-1);
    const clonesEnd = imageData.slice(0, 2);
    const fullSet = [...clonesStart, ...imageData, ...clonesEnd];

    carousel.innerHTML = '';
    fullSet.forEach((img) => {
        const image = document.createElement('img');
        image.src = img.src;
        image.id = img.id;
        carousel.appendChild(image);
    });

    updateTransform();
    applyClasses();
    createDots();
}

// Przesuwanie karuzeli
function updateTransform() {
    const offset = currentIndex * 420;
    carousel.style.transition = 'transform 0.5s ease-in-out';
    carousel.style.transform = `translateX(-${offset}px)`;
}

// Nadawanie klas i tekstów
function applyClasses() {
    const allImages = carousel.querySelectorAll('img');
    allImages.forEach((img, index) => {
        img.classList.remove('center');
        if (index === currentIndex + 1) {
            img.classList.add('center');
        }
    });

    const centerImage = allImages[currentIndex + 1];
    if (centerImage) {
        const id = centerImage.id;
        const match = imageData.find((img) => img.id === id);
        fadeAndChangeText(title, match ? match.title : '');

        const data = carouselData[id];
        if (data) {
            fadeAndChangeText(subTitle, data.carouselText || '');
            fadeAndChangeText(textWlasciwosci, data.text_wlasciwosci || '');
            fadeAndChangeText(textDaneTechniczne, data.text_dane_techniczne || '');
            fadeAndChangeText(textDodatkoweInfo, data.text_dodatkowe_informacje || '');
            if (data.pdf) {
                btnDownload.setAttribute('href', data.pdf);
            } else {
                btnDownload.removeAttribute('href');
            }
        } else {
            fadeAndChangeText(subTitle, '');
            fadeAndChangeText(textWlasciwosci, '');
            fadeAndChangeText(textDaneTechniczne, '');
            fadeAndChangeText(textDodatkoweInfo, '');
        }
    }
}

// Tworzenie kropek
function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < imageData.length; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.dataset.index = i;
        dotsContainer.appendChild(dot);
    }
    updateDots();
}

// Aktualizacja kropek
function updateDots() {
    const dots = document.querySelectorAll('.carousel_dots .dot');
    dots.forEach(dot => dot.classList.remove('active'));
    const activeIndex = (currentIndex + imageData.length) % imageData.length;
    if (dots[activeIndex]) {
        dots[activeIndex].classList.add('active');
    }
}

// Obsługa przycisków
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imageData.length) % imageData.length;
    updateTransform();
    applyClasses();
    updateDots();
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imageData.length;
    updateTransform();
    applyClasses();
    updateDots();
});

// Obsługa kliknięcia w kropki
dotsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('dot')) {
        const index = parseInt(e.target.dataset.index);
        currentIndex = index;
        updateTransform();
        applyClasses();
        updateDots();
    }
});

// Przełącznik danych (Arago/Clarb)
dataSwitch.addEventListener('change', () => {
    const isChecked = dataSwitch.checked;
    const fadeElements = document.querySelectorAll('.fade-wrapper');

    fadeElements.forEach(el => {
        el.classList.remove('fade-in');
        el.classList.add('fade-out');
    });

    setTimeout(() => {
        currentDataFile = isChecked ? 'clarbData.json' : 'aragoData.json';
        switchLogo.src = isChecked
            ? '/img/products/small_clarb.svg'
            : '/img/products/small_arago.svg';

        loadDataAndInitialize();

        setTimeout(() => {
            fadeElements.forEach(el => {
                el.classList.remove('fade-out');
                el.classList.add('fade-in');
            });
        }, 100);
    }, 300);
});


// Start
loadDataAndInitialize();
