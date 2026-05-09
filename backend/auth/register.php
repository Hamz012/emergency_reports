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

$nama = trim($data['nama'] ?? '');
$no_hp = trim($data['no_hp'] ?? '');

if (!$nama || !$no_hp) {
    echo json_encode([
        "success" => false,
        "message" => "Data tidak lengkap"
    ]);
    exit;
}

/* normalize nomor */
$no_hp = str_replace("+62", "0", $no_hp);
$no_hp = mysqli_real_escape_string($conn, $no_hp);
$nama = mysqli_real_escape_string($conn, $nama);

/* cek duplikat */
$cek = mysqli_query($conn, "SELECT id FROM users WHERE no_hp='$no_hp'");

if (mysqli_num_rows($cek) > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Nomor sudah terdaftar"
    ]);
    exit;
}

/* insert user */
$insert = mysqli_query($conn,
    "INSERT INTO users (nama, no_hp, role)
     VALUES ('$nama', '$no_hp', 'user')"
);

if ($insert) {
    echo json_encode([
        "success" => true,
        "message" => "Register berhasil"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Register gagal",
        "error" => mysqli_error($conn)
    ]);
}
?>