<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include __DIR__ . '/../config/database.php';

$total = mysqli_fetch_assoc(
    mysqli_query($conn, "SELECT COUNT(*) as total FROM reports")
);

$pending = mysqli_fetch_assoc(
    mysqli_query($conn, "SELECT COUNT(*) as total FROM reports WHERE status='pending'")
);

$done = mysqli_fetch_assoc(
    mysqli_query($conn, "SELECT COUNT(*) as total FROM reports WHERE status='done'")
);

echo json_encode([
    "success" => true,
    "total" => $total['total'],
    "pending" => $pending['total'],
    "done" => $done['total']
]);
?>