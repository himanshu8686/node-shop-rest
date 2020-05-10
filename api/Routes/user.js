const express = require("express");

const router = express.Router();

const UserController = require('../Controllers/users.controller');

router.post("/register", UserController.registerUser);


router.post('/login', UserController.userLogin);


router.delete('/:userId', UserController.deleteUser);

module.exports = router;