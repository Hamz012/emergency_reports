<?php
header("Content-Type: application/json");

// load env
$envPath = __DIR__ . '/.env';

if (!file_exists($envPath)) {
    die(json_encode([
        "success" => false,
        "message" => ".env file tidak ditemukan"
    ]));
}

$env = parse_ini_file($envPath);

if (!$env) {
    die(json_encode([
        "success" => false,
        "message" => "Gagal membaca .env"
    ]));
}

$host = $env['DB_HOST'] ?? null;
$username = $env['DB_USER'] ?? null;
$password = $env['DB_PASS'] ?? null;
$database = $env['DB_NAME'] ?? null;
$port = $env['DB_PORT'] ?? 3306;

// validasi env
if (!$host || !$username || !$database) {
    die(json_encode([
        "success" => false,
        "message" => "ENV tidak lengkap",
        "debug" => $env
    ]));
}

// koneksi
$conn = mysqli_connect($host, $username, $password, $database, $port);

if (!$conn) {
    die(json_encode([
        "success" => false,
        "message" => "Koneksi DB gagal",
        "error" => mysqli_connect_error(),
        "host" => $host,
        "user" => $username,
        "db" => $database
    ]));
}

mysqli_set_charset($conn, "utf8");
?>