<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include __DIR__ . '/../config/database.php';

$tujuan = $_GET['tujuan'] ?? 'polisi';

/*
========================================
MAP TUJUAN -> KATEGORI DATABASE
========================================
*/
$map = [
    "polisi" => ["kriminal"],
    "ambulance" => ["kecelakaan", "ambulance", "kecelakaan lalu lintas"],
    "pemadam" => ["kebakaran"]
];

$kategoriList = $map[$tujuan] ?? [];

if (count($kategoriList) == 0) {
    echo json_encode([]);
    exit;
}

/*
========================================
BUAT PLACEHOLDER IN (?, ?, ?)
========================================
*/
$placeholders = implode(',', array_fill(0, count($kategoriList), '?'));

/*
========================================
QUERY FIXED
========================================
*/
$sql = "
SELECT 
    r.id,
    r.kategori,
    r.deskripsi,
    r.alamat,
    r.latitude,
    r.longitude,
    r.created_at,
    u.nama,
    u.no_hp
FROM reports r
JOIN users u ON r.user_id = u.id
WHERE r.kategori IN ($placeholders)
ORDER BY r.created_at DESC
";

$stmt = mysqli_prepare($conn, $sql);

/*
========================================
BIND DINAMIS
========================================
*/
$types = str_repeat("s", count($kategoriList));
mysqli_stmt_bind_param($stmt, $types, ...$kategoriList);

mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$data = [];

while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode($data);
?>