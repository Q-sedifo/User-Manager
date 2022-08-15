<?php

ini_set('display_errors', 1); 
error_reporting(E_ALL);

require_once 'db.php';

// // Getting users from database
$query = $DB->query('SELECT * FROM `users`');
$users = $query->fetchAll(PDO::FETCH_OBJ);

require_once 'pages/users.php';