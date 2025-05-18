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