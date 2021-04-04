const express = require('express')
const router = express.Router();
const validator = require('validator');
const db = require('../database')
const crypto = require('crypto');

var err = false

router.get('/', (req, res) => {
    res.render('pages/login', {
        alertMsg: "",
        alertStatus: ""
    })
})

router.post('/', (req, res) => {
    try {
        const { email, password } = req.body;

        //Finds the validation errors
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
        }

        const pwdEncrypt = crypto.createHash('sha256').update(password).digest('base64');
        if (err === false) {
            db.any('SELECT * FROM users WHERE email = $1 AND password = $2;', [email, pwdEncrypt])
            .then((users) => {
                if (users.length === 0) {
                    //Incorrect username or password
                    res.render('pages/login', {
                        alertMsg: "Incorrect username or password",
                        alertStatus: "alert error"
                    })
                } else {
                    //Correct username and password
                    req.session.user_id = users[0].user_id
                    req.session.username = users[0].username
                    res.redirect("/todo")
                }
            })
            .catch((err) => {
                console.log(err)
                res.render('pages/login', {
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