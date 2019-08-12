const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const signup = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                message: "Mail exists"
            });
        }
        else{
            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(req.body.password, salt, function (err, hash) {
                    if(err){
                        return res.status(500).json({
                            error: err
                        });
                    }
                    else{
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                        .then(result => {
                            res.status(201).json({
                                message: 'User successfully created',
                                createdUser: {
                                    email: result.email,
                                    password: result.password,
                                    _id: result._id,
                                    request: {
                                        type: "GET",
                                        url: `http://localhost:3000/users/${result._id}`
                                    }
                                }
                            });
                        })
                        .catch(errors => {
                            res.status(500).json({
                                error: errors
                            });
                        });
                    }
                });
            });
        }
    });
}

const login = (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(404).json({
                message: `User with email ${req.body.email} not found`
            });
        }
        else{
            bcrypt.compare(req.body.password, user[0].password, function(err, result) {
                if(err){
                    res.status(500).json({
                        error: err
                    });
                }
                if(result){
                    const token = jwt.sign({email: user[0].email, userId: user[0]._id}, process.env.JWT_SECRET, {expiresIn: "2 days"});
                    return res.status(200).json({
                        message: "Login success",
                        token: token
                    });
                }
                else{
                    return res.status(401).json({
                        message: "Login failed"
                    });
                }
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

const destroy = (req, res, next) => {
    User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: "User deleted",
            request: {
                type: "POST",
                url: `http://localhost:3000/users/signup`,
                body: { email: "String", password: "String" }
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

module.exports = {
    signup: signup,
    login: login,
    destroy: destroy
}