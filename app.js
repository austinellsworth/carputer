// ==================== REQUIRE STATEMENTS ====================
require('dotenv').config()
const EXPRESS = require('express')
const APP = EXPRESS()
const SERVER = require('http').createServer(APP)
const PATH = require('path')
const IO = require('socket.io')(SERVER)
const REQUEST = require('request')
const GPS = require('./modules/gps')
const PLAYLISTS = require('./modules/music').PLAYLISTS
const MUSIC = require('./modules/music').MUSIC

// ==================== MISC SETUP ====================

APP.use('/assets/', EXPRESS.static(PATH.join(__dirname, '/public')))
APP.use('/', EXPRESS.static(__dirname))

// ==================== SETUP FOR GPSD DAEMON ====================
if (process.env.ENVIRONMENT !== 'dev') {
  GPS.DAEMON.start(GPS.daemonInit)
}

// ==================== SETUP FOR GOOGLE MUSIC ====================

PLAYLISTS.getData()

// ==================== SETUP FOR SOCKET.IO ====================

IO.on('connection', function (socket) {
  console.log('Socket.io running')
  setInterval(function () {
    if (GPS.data) {
      socket.emit('gpsData', GPS.data)
    }
  }, 1000)
})

// ==================== ROUTES ====================

// Send Index page
APP.get('/', function (req, res) {
  res.sendFile('./index.html')
})

// ==================== GOOGLE PLAY MUSIC ROUTES ====================

// client makes request to /music, gets back obj with playlists and all their songs
APP.get('/music/', function (req, res) {
  if (!PLAYLISTS.playlists.names) {
    PLAYLISTS.getData()
  }
  res.send(JSON.stringify(PLAYLISTS.playlists))
})

// client requests song stream by storeId
APP.get('/music/:song', function (req, res) {
  MUSIC.getStream(req.params.song, function (err, stream) {
    if (err) {
      console.log(err)
    } else {
      stream.pipe(res)
    }
  })
})

// ==================== GOOGLE MAPS API ROUTE ====================

APP.get('/private/apikey/', function (req, res) {
  let pageres = res
  // Keep the API key private.
  REQUEST(process.env.API_KEY, function (err, res, body) {
    if (err) {
      console.log(err)
    } else if (res.statusCode === 200) {
      pageres.send(body)
    }
  })
})

// ==================== LISTEN ON PORT 8000 ====================
SERVER.listen(8000, function () {
  console.log('Rav4Pi server is running!')
})
