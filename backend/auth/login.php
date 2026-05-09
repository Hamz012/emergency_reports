<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$no_hp = trim($data['no_hp'] ?? '');

if (empty($no_hp)) {
    echo json_encode([
        "success" => false,
        "message" => "Nomor HP kosong"
    ]);
    exit;
}

$query = mysqli_query(
    $conn,
    "SELECT * FROM users WHERE no_hp='$no_hp'"
);

if (!$query) {
    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);
    exit;
}

$total = mysqli_num_rows($query);

if ($total > 0) {
    $user = mysqli_fetch_assoc($query);

    echo json_encode([
        "success" => true,
        "message" => "Login berhasil",
        "debug" => [
            "input" => $no_hp,
            "found_rows" => $total
        ],
        "user" => $user
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "User tidak ditemukan",
        "debug" => [
            "input" => $no_hp,
            "found_rows" => 0
        ]
    ]);
}
?>