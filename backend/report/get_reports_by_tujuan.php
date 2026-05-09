<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include __DIR__ . '/../config/database.php';

$tujuan = $_GET['tujuan'] ?? 'polisi';

/*
MAP TUJUAN → KATEGORI
*/
$kategori = "";

if ($tujuan == "polisi") {
    $kategori = "kriminal";
} elseif ($tujuan == "ambulance") {
    $kategori = "kecelakaan";
} elseif ($tujuan == "pemadam") {
    $kategori = "kebakaran";
}

/*
QUERY FIXED
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
r.operator_confirm,
u.nama,
u.no_hp
FROM reports r
JOIN users u ON r.user_id = u.id
WHERE r.kategori = '$kategori'
ORDER BY r.created_at DESC
";

$result = mysqli_query($conn, $sql);

$data = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }
}

echo json_encode($data);
?>