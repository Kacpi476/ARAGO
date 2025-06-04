document.getElementById('contact-form').addEventListener('submit', function(event) {
    const contact = document.querySelector('[name="contact"]').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{9,15}$/; // pl +48

    if (!emailRegex.test(contact) && !phoneRegex.test(contact)) {
        alert("Wprowadź poprawny adres e-mail lub numer telefonu.");
        event.preventDefault();
    }
});