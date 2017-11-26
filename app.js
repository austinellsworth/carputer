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
const WEATHER = require('./modules/weather')

// ==================== MISC SETUP ====================

APP.use('/assets/', EXPRESS.static(PATH.join(__dirname, '/public')))
APP.use('/', EXPRESS.static(__dirname))

// ==================== SETUP FOR WEATHER DATA ====================
function retreiveWeatherData () {
  let lat = GPS.data.lat
  let lon = GPS.data.lon
  if (lat && lon && GPS.currentSocket) {
    console.log('Getting Weather...')
    WEATHER.getWeatherData(lat, lon, function () {
      console.log(WEATHER.data.current_observation.temp_f + 'F')
      GPS.currentSocket.emit('weatherData', WEATHER.data)
    })
  }
}

function startWeatherLoop () {
  if (!WEATHER.isLooping) {
    retreiveWeatherData()
    setInterval(retreiveWeatherData, process.env.WEATHER_INTERVAL)
    WEATHER.isLooping = true
  } else {
    GPS.currentSocket.emit('weatherData', WEATHER.data)
  }
}

// ==================== SETUP FOR GPSD DAEMON ====================
if (process.env.ENVIRONMENT !== 'dev') {
  GPS.DAEMON.start(GPS.daemonInit)
} else { // DEV PURPOSES ONLY. REMOVE THESE
  GPS.data.lat = 42 // DEV PURPOSES ONLY. REMOVE THESE
  GPS.data.lon = -84 // DEV PURPOSES ONLY. REMOVE THESE
}

// ==================== SETUP FOR GOOGLE MUSIC ====================

PLAYLISTS.getData()

// ==================== SETUP FOR SOCKET.IO ====================
function exposeSocket (socket) {
  GPS.currentSocket = socket
  WEATHER.currentSocket = socket
}

IO.on('connection', function (socket) {
  console.log('Socket.io running')
  exposeSocket(socket)
  // setInterval(function () {
  //   if (GPS.data) {
  //     socket.emit('gpsData', GPS.data)
  //   }
  // }, 1000)
  startWeatherLoop()
})

// ==================== ROUTES ====================

// Send Index page
APP.get('/', function (req, res) {
  res.sendFile('./index.html')
})

// ==================== GOOGLE PLAY MUSIC ROUTES ====================

// client makes request to /music, gets back obj with playlists and all their songs
APP.get('/music', function (req, res) {
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

// When user clicks music reset button, re-connect to Google server, then reload index page
APP.get('/reset-music', function (req, res) {
  PLAYLISTS.getData()
  res.redirect('/')
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
SERVER.listen(process.env.PORT, function () {
  console.log('Rav4Pi server is running!')
})
