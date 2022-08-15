<?php

class UserValidator {
    private $error = null;

    private $fields = [
        'firstName', 'lastName', 'role', 'status'
    ];
    
    public function __construct($post) {
        $this->post = $post;
        $this->checkFields();
    }

    public function checkFields() {
        $this->checkFirstName();
        $this->checkLastName();
        $this->checkRole();
        $this->checkStatus();
    }

    public function checkFirstName() {
        if (strlen($this->post['firstName']) == 0) {
            $this->error['code'] = 110;
            $this->error['message'] = 'Input first name';
        }
    }

    public function checkLastName() {
        if (strlen($this->post['lastName']) == 0) {
            $this->error['code'] = 120;
            $this->error['message'] = 'Input last name';
        }
    }

    public function checkRole() {
        $role = intval($this->post['role']);
        if (!isset($role)) {
            $this->error['code'] = 130;
            $this->error['message'] = 'Incorrect role';
        }
    }

    public function checkStatus() {
        $status = intval($this->post['status']);
        if (!isset($status)) {
            $this->error['code'] = 140;
            $this->error['message'] = 'Incorrect status';
        }
    }

    public function checkError() {
        if ($this->error) return false;
        return true;
    }

    public function getError() {
        return $this->error;
    }

    public function getValidatedData() {
        $post = [];
        foreach ($this->post as $key => $value) {
            $post[$key] = htmlentities(trim($value));
        }
        return $post;
    }
}

