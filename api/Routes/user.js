const express = require("express");
const createError = require('http-errors');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/User.model');

router.post("/register", async (req, res, next) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        });
        // console.log("==>", user);
        if (user) {
            // console.log('user exist with this email');
            next(createError(422, "User already Exists!!"));
        } else {
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) {
                    return next(createError(500, error.message));
                } else {
                    console.log("user not exist");
                    const registerUser = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hashedPassword
                    });
                    registerUser.save()
                        .then(result => {
                            console.log('result user save', result);
                            res.send({
                                "response_code": 201,
                                "message": "User created successfully",
                                result
                            });
                        })
                        .catch(error => {
                            // this Validation error comes from mongoose
                            if (error.name === 'ValidationError') {
                                next(createError(422, 'Email or Password is not in correct format'));
                                return;
                            }
                            next(error);
                        });
                }
            });
        }
    } catch (error) {
        console.log(error.message);
        next(error);
    }
});


router.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        });
        if (!user) {
            next(createError(401, 'Authorization failed'));
        } else {
            if (!req.body.password) {
                next(createError(401, 'Password required'));
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    next(createError(401, 'Authorization failed'));
                } else if (result) {
                    const token = jwt.sign({
                            email: user.email,
                            userId: user._id
                        },
                        process.env.JWT_KEY, {
                            expiresIn: "1h"
                        });
                    res.send({
                        "response_code": 200,
                        "message": "Authorized successfully",
                        token: token
                    });
                }
            });
        }
    } catch (error) {
        console.log(error.message);
        next(error);
    }
});

router.delete('/:userId', async (req, res, next) => {
    const id = req.params.userId;
    try {
        const result = await User.findOneAndDelete({
            _id: id
        });
        if (!result) {
            throw createError(404, 'User does Not Exist');
        }
        console.log(result);
        res.send({
            "response_code": 200,
            "message": `User with ${id} deleted`,
            result
        });
    } catch (error) {
        console.log(error.message);
        if (error instanceof mongoose.CastError) {
            next(createError(400, 'invalid User id'));
            return;
        }
        next(error);
    }
});

module.exports = router;