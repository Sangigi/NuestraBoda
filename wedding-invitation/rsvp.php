<?php
// Importa las clases necesarias
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';
require 'phpmailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Configura los datos
$to = 'sanguineape2189@gmail.com'; // Cambia por el correo al que quieras recibir las confirmaciones
$fromEmail = 'tucorreo@gmail.com'; // Tu correo GMAIL
$appPassword = 'ednh arzk ckwo vtqi'; // Generada en tu cuenta Google

// Obtiene los datos del formulario
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$attendance = $_POST['attendance'] ?? 'No especificado';
$guests = $_POST['guests'] ?? '0';
$message = $_POST['message'] ?? '';

if (empty($name) || empty($email)) {
    http_response_code(400);
    echo "Faltan datos requeridos.";
    exit;
}

// Crea el cuerpo del mensaje
$body = "Nueva confirmación de asistencia:\n\n";
$body .= "Nombre: $name\n";
$body .= "Correo: $email\n";
$body .= "Asistirá: $attendance\n";
$body .= "Número de acompañantes: $guests\n";
$body .= "Mensaje: $message\n";

// Configura PHPMailer
$mail = new PHPMailer(true);

try {
    // Configura el servidor SMTP de Gmail
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $fromEmail;
    $mail->Password = $appPassword;
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    // Direcciones
    $mail->setFrom($fromEmail, 'Invitación Boda');
    $mail->addAddress($to, 'Organizador');

    // Contenido
    $mail->isHTML(false);
    $mail->Subject = "Confirmación de asistencia: $name";
    $mail->Body = $body;

    $mail->send();
    echo "Confirmación enviada con éxito.";
} catch (Exception $e) {
    http_response_code(500);
    echo "Error al enviar el correo: {$mail->ErrorInfo}";
}
