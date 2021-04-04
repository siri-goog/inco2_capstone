const express = require('express')
const router = express.Router();
const db = require('../database')
var session = require('express-session')
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
const { token } = require('morgan');

router.use(session({
    secret: "It's a secret!",
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

var err = false

router.get('/', (req, res) => {
    res.render('pages/resetPassword', {
        alertMsg: "",
        alertStatus: ""
    })
})

router.post('/', (req, res) => {
    const { email } = req.body;

    async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {
            if (err === false) {
                db.any('SELECT * FROM users WHERE email = $1;', [email])
                .then((users) => {
                    if (users.length === 0) {
                        //Incorrect email
                        res.render('pages/resetPassword', {
                            alertMsg: "No account with that email address exists",
                            alertStatus: "alert error"
                        })
                    } else {
                        //Correct email
                        var sql = "UPDATE users SET resetPasswordExpires = (NOW() + interval '1 hour'), resetPasswordToken = $1 WHERE email = $2"
                        db.query(sql, [token, email])
                        .then (() => {
                            var smtpTransport = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: process.env.MAILSERVER_EMAIL,
                                    pass: process.env.MAILSERVER_PWD
                                }
                            });
                              
                            var mailOptions = {
                                to: email,
                                from: 'passwordreset@mygrocerylist.com',
                                subject: 'My Grocery List - Password Reset',
                                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                                  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                  'http://' + req.headers.host + '/newPassword/' + token + '\n\n' +
                                  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                            };
                        
                            smtpTransport.sendMail(mailOptions, function(err) {
                                res.render('pages/resetPassword', {
                                    alertMsg: "An e-mail has been sent to " + email + " with further instructions",
                                    alertStatus: "alert success"
                                })
                            });
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
            }
        }
    ], function(err) {
        if (err) return next(err);
        res.render('pages/resetPassword', {
            alertMsg: err,
            alertStatus: "alert error"
        })
    });
})

router.get('/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
        }
        res.render('reset', {
        user: req.user
        });
    });
});

module.exports = router