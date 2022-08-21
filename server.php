<?php

require_once 'db.php';
require_once 'UserValidator.php';

if (!empty($_POST)) {
    $response['status'] = true;

    if ($_POST['action'] == 'activate' || $_POST['action'] == 'deactivate' || $_POST['action'] == 'delete') {
        $usersId = $_POST['usersId'];

        // Checking for users existing
        foreach ($usersId as $id) {
            if (!UserValidator::userExists($id)) {
                $response['status'] = false;
                $response['error']['message'] = 'Some users do not exist'; 
                echo json_encode($response);
                exit();
            }
        }

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

        // Reply for request
        echo json_encode($response);
        exit();
    }

    // Adding user
    if ($_POST['action'] == 'add') {
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
        $userId = $_POST['id'];

        // Checking user exists
        if (!UserValidator::userExists($userId)) {
            $response['status'] = false;
            $response['error']['message'] = 'This user does not exist';
            echo json_encode($response);
            exit();
        } 

        $form = new UserValidator($_POST);
        if ($form->checkError()) {
            $sql = "UPDATE users SET `firstName` = ?, `lastName` = ?, `role` = ?, `status` = ? WHERE id = ?";
            $DB->prepare($sql)->execute([
                $_POST['firstName'], $_POST['lastName'], $_POST['role'], $_POST['status'], $_POST['id']
            ]);

            // Return edited user
            $response['user'] = UserValidator::getUser($userId);
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
