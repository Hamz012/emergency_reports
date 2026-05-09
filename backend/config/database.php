<?php
header("Content-Type: application/json");

$url = getenv("DATABASE_URL");

if (!$url) {
    die(json_encode([
        "success" => false,
        "message" => "DATABASE_URL tidak ditemukan"
    ]));
}

/* parse URL dari Railway */
$db = parse_url($url);

$host = $db["host"];
$user = $db["user"];
$pass = $db["pass"];
$dbname = ltrim($db["path"], "/");
$port = $db["port"] ?? 3306;

$conn = mysqli_connect($host, $user, $pass, $dbname, $port);

if (!$conn) {
    die(json_encode([
        "success" => false,
        "message" => "Koneksi gagal",
        "error" => mysqli_connect_error()
    ]));
}

mysqli_set_charset($conn, "utf8");
?>