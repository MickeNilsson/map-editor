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
        
        break;
    case 'POST':
        if(!empty($_FILES['textureatlasImage'] && !(empty($_FILES['textureatlas'])))) {
            require_once './upload.php';
            upload($_FILES['textureatlas']);
            upload($_FILES['textureatlasImage']);
        }
        break;
    case 'PUT':
        
    break;
}