/*require('dotenv').config()
//console.log(process.env.YOUTUBE_TOKEN)
const { google } = require('googleapis')

//search video
google.youtube('v3').search.list({
    key: process.env.YOUTUBE_TOKEN,
    part: 'snippet',
    q: 'joji', //query (what we wawnt to search)
    maxResults: 10,
})
.then((response) => {
    const { data } = response;
    console.log(data.items[0].id)
    data.items.forEach((item) => {
        //console.log(`Title: ${item.snippet.title}\nDescription: ${item.snippet.description}\n`)
    })
})
.catch((err) => console.log(err))*/

//import { getSubtitles } from 'youtube-captions-scraper';
const { getSubtitles } = require('youtube-captions-scraper')

getSubtitles({
  videoID: 'sv3TXMSv6Lw', // youtube video id
  lang: 'en' // default: `en`
}).then(captions => {
  console.log(captions);
  captions.forEach((item) => {
    console.log(`${item.text}\n`)
  })
});

// ES5
//var getSubtitles = require('youtube-captions-scraper').getSubtitles;

getSubtitles({
  videoID: 'sv3TXMSv6Lw', // youtube video id
  lang: 'fr' // default: `en`
}).then(function(captions) {
  console.log(captions);
});