<?php

// Activate error messages (only during development)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set response headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: application/json, Content-Type');
header('Content-Type: application/json; charset=utf-8');

switch($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $response = fetchMap($_GET['name']);
        break;
    case 'POST':
        // Extract JSON payload from request body
        $payload = json_decode(file_get_contents('php://input'));
        $response = createMap($payload);
        break;
    case 'PUT':
        // Extract JSON payload from request body
        $payload = json_decode(file_get_contents('php://input'));
        $response = updateMap($payload);
    break;
}

echo $response;

function updateMap($payload) {
    $pdo = createPDO();
    // Check that there exists a map with this name
    $stmt = $pdo->prepare('SELECT map_editor.id FROM map_editor WHERE map_editor.name = :name');
    $stmt->execute(['name' => $payload->name]);
    $row = $stmt->fetch();
    $id = $row['id'];
    if(empty($id)) {
        $response = new stdClass();
        $response->status = 'error';
        $response->description = 'There exists no map with that name';
    } else {
        // Update existing map
        $map = json_encode($payload->map, JSON_UNESCAPED_UNICODE);
        $stmt = $pdo->prepare('UPDATE map_editor SET map_editor.map = :map WHERE map_editor.id = :id');
        $stmt->execute(['map' => $map, 'id' => $id]);
        $response = new stdClass();
        $response->status = 'ok';
        $response->description = 'Map is updated';
    }
    return json_encode($response, JSON_UNESCAPED_UNICODE);
}

function createMap($payload) {
    $pdo = createPDO();
    // Check if there already exists a map with this name
    $stmt = $pdo->prepare('SELECT map_editor.id FROM map_editor WHERE map_editor.name = :name');
    $stmt->execute(['name' => $payload->name]);
    $row = $stmt->fetch();
    $id = $row['id'];
    $map = json_encode($payload->map, JSON_UNESCAPED_UNICODE);
    if(empty($id)) {
        // There exists no map with this name, so create a new row in the table for this new map
        $stmt = $pdo->prepare('INSERT INTO map_editor(name, map) VALUES (:name, :map)');
        $stmt->execute(['name' => $payload->name, 'map' => $map]);
        $response = new stdClass();
        $response->status = 'ok';
        $response->description = 'Map is updated';
    } else {
        $response = new stdClass();
        $response->status = 'error';
        $response->description = 'There already exists a map with that name'; 
    }
    return json_encode($response, JSON_UNESCAPED_UNICODE);
}

function fetchMap($name) {
    $pdo = createPDO();
    // Fetch the ID and map for the map that has this name
    $stmt = $pdo->prepare('SELECT map_editor.id, map_editor.map FROM map_editor WHERE map_editor.name = :name');
    $stmt->execute(['name' => $name]);
    $row = $stmt->fetch();
    $id = $row['id'];
    $map = $row['map'];
    if(empty($id)) {
        // There is no map with this name
        $response = new stdClass();
        $response->status = 'error';
        $response->description = 'There exists no map with that name';
    } else {
        // Found a map with this name, so send it back to the client
        $response = new stdClass();
        $response->status = 'ok';
        $data = new stdClass();
        $data->id = $id;
        $data->map = json_decode($map);
        $response->data = $data;
        //$response = '{"status":"Map found","id":' . $id . ',"map":"' . $map . '"}';
    }
    return json_encode($response, JSON_UNESCAPED_UNICODE);
}

// Configure and create PDO object
function createPDO() {
    // Get settings
    require_once '../settings.php';
    $dsn = "$databaseDriver:host=$host;dbname=$database;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    try {
        $pdo = new PDO($dsn, $username, $password, $options);
    } catch (\PDOException $e) {
        throw new \PDOException($e->getMessage(), (int)$e->getCode());
    }
    return $pdo;
}