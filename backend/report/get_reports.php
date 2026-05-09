<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include __DIR__ . '/../config/database.php';

$query = mysqli_query($conn, "
    SELECT 
        r.id,
        r.user_id,
        u.nama,
        u.no_hp,
        r.kategori,
        r.deskripsi,
        r.alamat,
        r.latitude,
        r.longitude,
        r.status,
        r.created_at
    FROM reports r
    LEFT JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
");

$data = [];

while ($row = mysqli_fetch_assoc($query)) {
    $data[] = $row;
}

echo json_encode([
    "success" => true,
    "total" => count($data),
    "reports" => $data
]);
?>