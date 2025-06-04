document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll("nav.nav a");

    navLinks.forEach(link => {
        const href = link.getAttribute("href");

        if (href === currentPath) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }

        if (
            (currentPath.startsWith("/produkty/") && href === "/produkty")
        ) {
            link.classList.add("active");
        }
    });

    if (currentPath === "/") {
        navLinks.forEach(link => link.classList.remove("active"));
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("menu-toggle");
    const menuButton = document.querySelector(".menu_button");
    const nav = document.querySelector(".nav");
    const blurTargets = document.querySelectorAll('.main_carousel_container, .about_container, .products_container, .carousel_products_container, .dystrybutorzy_container, .career_container, .contact_container');

    toggleButton.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("show");
        toggleButton.textContent = isOpen ? "ZAMKNIJ" : "MENU";

        menuButton.style.backgroundColor = isOpen ? "white" : "#324498";
        toggleButton.style.color = isOpen ? "#324498" : "white";

        blurTargets.forEach(el => {
            el.style.transition = 'filter 0.3s ease';
            el.style.filter = isOpen ? 'blur(5px)' : 'none';
        });
    });
});
