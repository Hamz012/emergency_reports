<?php
header("Content-Type: application/json");

// ambil dari Railway Environment Variables
$host = getenv("DB_HOST");
$username = getenv("DB_USER");
$password = getenv("DB_PASS");
$database = getenv("DB_NAME");
$port = getenv("DB_PORT") ?: 3306;

// validasi env
if (!$host || !$username || !$database) {
    die(json_encode([
        "success" => false,
        "message" => "ENV Railway belum diset"
    ]));
}

$conn = mysqli_connect($host, $username, $password, $database, $port);

if (!$conn) {
    die(json_encode([
        "success" => false,
        "message" => "Koneksi DB gagal",
        "error" => mysqli_connect_error()
    ]));
}

mysqli_set_charset($conn, "utf8");
?>