<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

include __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents("php://input"), true) ?? [];

$no_hp = trim($data['no_hp'] ?? '');

if (!$no_hp) {
    echo json_encode([
        "success" => false,
        "message" => "Nomor HP kosong"
    ]);
    exit;
}

/* normalize nomor */
$no_hp = str_replace(["+62", " "], ["0", ""], $no_hp);
$no_hp = mysqli_real_escape_string($conn, $no_hp);

/* query */
$sql = "SELECT id, nama, no_hp, role 
        FROM users 
        WHERE TRIM(no_hp) = '$no_hp' 
        LIMIT 1";

$query = mysqli_query($conn, $sql);

if (!$query) {
    echo json_encode([
        "success" => false,
        "message" => "SQL ERROR",
        "error" => mysqli_error($conn)
    ]);
    exit;
}

$user = mysqli_fetch_assoc($query);

if ($user) {
    echo json_encode([
        "success" => true,
        "message" => "Login berhasil",
        "user" => $user
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "User tidak ditemukan",
        "input" => $no_hp
    ]);
}
?>