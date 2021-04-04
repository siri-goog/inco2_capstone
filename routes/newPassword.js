const express = require('express')
const router = express.Router();
const validator = require('validator');
const db = require('../database')
var session = require('express-session')
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
const { token } = require('morgan');


require('dotenv').config()

router.use(session({
    secret: "It's a secret!",
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

var err = false

router.get('/:token', function(req, res) {
    var token = req.params.token

    db.any('SELECT resetPasswordExpires - NOW() AS passwordexpire FROM users;')
    .then((data) => {
        if (data[0].passwordexpire.minutes <= 0) {
            res.render('pages/resetPassword', {
                alertMsg: "Password reset token is invalid or has expired",
                alertStatus: "alert error"
            })
        } else {
            res.render('pages/newPassword', {
                alertMsg: "",
                alertStatus: "",
                token: token
            })
        }
    })
    .catch((err) => {
        console.log(err)
        res.render('pages/newPassword', {
            alertMsg: err,
            alertStatus: "alert error"
        })
    })
});

router.post('/:token', function(req, res) {
    const { password, pswRepeat } = req.body;
    db.any('SELECT email FROM users WHERE resetPasswordToken = $1;', [req.params.token])
    .then((data) => {
        if (data.length === 0) {
            //Incorrect token
            res.render('pages/resetPassword', {
                alertMsg: "Password reset token is invalid or has expired",
                alertStatus: "alert error"
            })
        } else {
            //Correct token
            const pwdEncrypt = crypto.createHash('sha256').update(password).digest('base64');
            var sql = "UPDATE users SET password = $1, resetPasswordToken = null, resetPasswordExpires = null WHERE email = $2"
            db.query(sql, [pwdEncrypt, data[0].email])
            .then (() => {
                res.render('pages/login', {
                    alertMsg: "Success! Your password has been changed",
                    alertStatus: "alert success"
                })
            })
            .catch((err) => {
                console.log(err)
                res.render('pages/error')
            })
        }
    })
    .catch((err) => {
        console.log(err)
        res.render('pages/resetPassword', {
            alertMsg: err,
            alertStatus: "alert error"
        })
    })
  });

module.exports = router