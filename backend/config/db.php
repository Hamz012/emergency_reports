<?php
header("Content-Type: application/json");

$host = getenv("MYSQLHOST") ?: "localhost";
$username = getenv("MYSQLUSER") ?: "root";
$password = getenv("MYSQLPASSWORD") ?: "";
$database = getenv("MYSQLDATABASE") ?: "pelaporan_darurat";
$port = getenv("MYSQLPORT") ?: 3307;

$conn = mysqli_connect($host, $username, $password, $database, $port);

if (!$conn) {
    echo json_encode([
        "success" => false,
        "message" => "Database gagal connect: " . mysqli_connect_error()
    ]);
    exit;
}
?>