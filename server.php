<?php

require_once 'db.php';
require_once 'UserValidator.php';

if (!empty($_POST)) {
    $usersId = $_POST['usersId'];

    // Deleting users
    if ($_POST['action'] == 'delete') {

        foreach ($usersId as $id) {
            $sql = "DELETE FROM users WHERE id = ?";
            $DB->prepare($sql)->execute([$id]);
        }
    }

    // Activate users
    if ($_POST['action'] == 'activate') {

        foreach ($usersId as $id) {
            $sql = "UPDATE users SET `status` = 1 WHERE id IN (?)";
            $DB->prepare($sql)->execute([$id]);
        }
    }

    // Deactivate users
    if ($_POST['action'] == 'deactivate') {

        foreach ($usersId as $id) {
            $sql = "UPDATE users SET `status` = 0 WHERE id IN (?)";
            $DB->prepare($sql)->execute([$id]);
        }
    }

    // Adding user
    if ($_POST['action'] == 'add') {
        $response['status'] = true;
        $name = $_POST['firstName'];

        $form = new UserValidator($_POST);
        if ($form->checkError()) {
            $sql = "INSERT INTO users (`firstName`, `lastName`, `role`, `status`) VALUES (?, ?, ?, ?)";
            $DB->prepare($sql)->execute([
                $_POST['firstName'], $_POST['lastName'], $_POST['role'], $_POST['status']
            ]);

            // Return edded user
            $query = $DB->query("SELECT * FROM `users` WHERE `firstName` = '$name'");
            $response['user'] = $query->fetch(PDO::FETCH_OBJ);

            echo json_encode($response);
            exit();
        }

        $response['status'] = false;
        $response['error'] = $form->getError();
        echo json_encode($response);
    }

    // Editing user
    if ($_POST['action'] == 'edit') {
        $response['status'] = true;
        $userId = $_POST['id'];

        $form = new UserValidator($_POST);
        if ($form->checkError()) {
            $sql = "UPDATE users SET `firstName` = ?, `lastName` = ?, `role` = ?, `status` = ? WHERE id = ?";
            $DB->prepare($sql)->execute([
                $_POST['firstName'], $_POST['lastName'], $_POST['role'], $_POST['status'], $_POST['id']
            ]);

            // Return edited user
            $query = $DB->query("SELECT * FROM `users` WHERE id = $userId");
            $response['user'] = $query->fetch(PDO::FETCH_OBJ);
            echo json_encode($response);
            exit();
        }

        $response['status'] = false;
        $response['error'] = $form->getError();
        echo json_encode($response);
    }

    exit();
}

header('Location: ../index.php');