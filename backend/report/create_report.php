<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true) ?? [];

$user_id = intval($data['user_id'] ?? 0);
$kategori = $data['kategori'] ?? '';
$deskripsi = $data['deskripsi'] ?? '';
$alamat = $data['alamat'] ?? '';
$latitude = $data['latitude'] ?? '';
$longitude = $data['longitude'] ?? '';

if (!$user_id || !$kategori || !$deskripsi) {
    echo json_encode([
        "success" => false,
        "message" => "Data tidak lengkap"
    ]);
    exit;
}

$query = mysqli_query($conn,
    "INSERT INTO reports (user_id, kategori, deskripsi, alamat, latitude, longitude)
     VALUES ('$user_id', '$kategori', '$deskripsi', '$alamat', '$latitude', '$longitude')"
);

if ($query) {
    echo json_encode([
        "success" => true,
        "message" => "Laporan berhasil dikirim"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Insert gagal",
        "error" => mysqli_error($conn)
    ]);
}
?>