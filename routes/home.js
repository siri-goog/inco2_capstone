const express = require('express')
const router = express.Router()
const sessionChecker = require("./middleware/sessionChecker")

//Connect to Google API
require('dotenv').config()
const { google } = require('googleapis')

router.get('/', sessionChecker, (req, res) => {
    res.render('pages/home', {
        username: req.session.username,
        data: ""
    })
})

router.post('/search', sessionChecker, (req, res) => {
    const { search } = req.body;
    
    google.youtube('v3').search.list({
        key: process.env.YOUTUBE_TOKEN,
        part: 'snippet',
        q: search, //query (what we want to search)
        maxResults: 10,
    })
    .then((response) => {
        const { data } = response;
        /*console.log(data.items[0])
        data.items.forEach((item) => {
            console.log(`Title: ${item.snippet.title}\nDescription: ${item.snippet.description}\n`)
        })*/

        res.render('pages/home', {
            username: req.session.username,
            data: data
        })
    })
    .catch((err) => console.log(err))
})

router.get('/:videoId', sessionChecker, (req, res) => {
    res.redirect('/recipe/' + req.params.videoId)
})

module.exports = router