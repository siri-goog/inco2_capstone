const express = require('express')
const router = express.Router()
const sessionChecker = require("./middleware/sessionChecker")

//Connect to Google API
require('dotenv').config()
const { google } = require('googleapis')

router.get('/:videoId', sessionChecker, (req, res) => {
    const { getSubtitles } = require('youtube-captions-scraper')

    getSubtitles({
        videoID: req.params.videoId, // youtube video id
        lang: 'en' // default: `en`
    })
    .then(captions => {
        console.log(captions);
        captions.forEach((item) => {
            console.log(`${item.text}\n`)
        })
    });

    res.render('pages/recipe', {
        username: req.session.username
    })
})

module.exports = router