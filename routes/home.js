const express = require('express')
const router = express.Router()
const validator = require('validator')
const db = require('../database')
const crypto = require('crypto')
const sessionChecker = require("./middleware/sessionChecker")

router.get('/', sessionChecker, (req, res) => {
    res.render('pages/home', {
        username: req.session.username
    })
})

module.exports = router