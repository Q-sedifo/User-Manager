<?php

ini_set('display_errors', 1); 
error_reporting(E_ALL);

require_once 'config/users.php';
require_once 'db.php';

// // Getting users from database
$query = $DB->query('SELECT * FROM `users` ORDER BY id');
$users = $query->fetchAll(PDO::FETCH_OBJ);

require_once 'pages/users.php';