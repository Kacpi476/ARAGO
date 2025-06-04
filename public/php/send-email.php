<?php
$contact = trim($_POST['contact'] ?? '');
$message = trim($_POST['message'] ?? '');

if (empty($contact) || empty($message)) {
    die("Uzupełnij wszystkie pola.");
}

$is_email = filter_var($contact, FILTER_VALIDATE_EMAIL);
$is_phone = preg_match('/^\+?\d{9,15}$/', $contact);

if (!$is_email && !$is_phone) {
    die("Wprowadź poprawny adres e-mail lub numer telefonu.");
}


$to = "email@example.com";  // ZMIENIC!!!
$subject = "Nowa wiadomość z formularza";
$body = "Wiadomość:\n$message\n\nDane kontaktowe: $contact";
$headers = "From: kontakt@twojadomena.pl";

if (mail($to, $subject, $body, $headers)) {
    echo "Dziękujemy! Wiadomość została wysłana.";
} else {
    echo "Błąd podczas wysyłania wiadomości.";
}
?>
