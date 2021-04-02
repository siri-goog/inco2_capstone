const express = require('express')
const router = express.Router();
const validator = require('validator');
const db = require('../database')
const crypto = require('crypto');

var err = false

router.get('/', (req, res) => {
    res.render('pages/signup', {
        alertMsg: "",
        alertStatus: ""
    })
})

router.post('/', (req, res) => {
    try {
        const { username, email, password, pswRepeat } = req.body;

        //Finds the validation errors
        //--Username
        if (validator.isEmpty(username)) {
            err = true
        } 
        
        //--Email
        if (validator.isEmpty(email)) {
            err = true
        //----Email format
        } else if (!validator.isEmail(email)) {
            err = true
        }

        //--Password
        if (validator.isEmpty(password)) {
            err = true
        //----Password must be at least 8 characters with at least 1 lowercase, 1 uppercase, 1 number and 1 symbol
        } else if (!validator.isStrongPassword(password)) {
            err = true
        }

        //--Confirm password
        if (validator.isEmpty(pswRepeat)) {
            err = true
        //----Password and Confirm password does not match
        } else if (password != pswRepeat) {
            err = true
        }

        // Password and Confirm Password validation
        if (err === false) {
            db.any('SELECT * FROM users;')
            .then((users) => {
                console.log(users)
                //Check existing user account
                const exists = users.some(user => user.email === email.toLowerCase())
                if (!exists) {
                    // This email is not registered yet
                    const pwdEncrypt = crypto.createHash('sha256').update(password).digest('base64');
                        
                    db.query('INSERT INTO users(username, email, password) VALUES ($1, $2, $3);', [username, email, pwdEncrypt])
                    .then (() => {
                        res.render('pages/login', {
                            alertMsg: "Sign up successful",
                            alertStatus: "alert success"
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                        res.render('pages/error')
                    })
                } else {
                    //Email address is already being used"
                    err = true
                    res.render('pages/signup', {
                        alertMsg: "The email address (" + email +") is already being used",
                        alertStatus: "alert error"
                    })
                }
            })
            .catch((err) => {
                console.log(err)
                res.render('pages/signup', {
                    alertMsg: err,
                    alertStatus: "alert error"
                })
            })
        }
    } catch (error) {
        console.log(error.message)
        res.render('pages/error')
    }
});

module.exports = router