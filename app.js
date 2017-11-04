// ==================== REQUIRE STATEMENTS ====================
const EXPRESS = require('express')
const APP = require('express')()
const SERVER = require('http').createServer(APP)
const IO = require('socket.io')(SERVER)
const PATH = require('path')
const REQUEST = require('request')
const APIKEY = require('./private/API_KEY')
const GPSD = require('node-gpsd')

// ==================== MISC SETUP ====================

APP.set('view engine', 'ejs')
APP.use('/assets/', EXPRESS.static(PATH.join(__dirname, '/public')))

var gpsData = {}

// ==================== SETUP FOR GPSD DAEMON ====================

const DAEMON = new GPSD.Daemon()

function daemonInit () {
  console.log('GPSD Daemon Started')

  const LISTENER = new GPSD.Listener()

  LISTENER.on('TPV', function (tpv) {
    gpsData = tpv
    return gpsData
  })

  LISTENER.connect(function () {
    console.log('Connected')
    LISTENER.watch()
  })
}

DAEMON.start(daemonInit)

// ============================================================
// ==================== ROUTES SETUP ====================
// ============================================================
APP.get('/', function (req, res) {
  IO.on('connection', function (socket) {
    console.log('Socket.io running')
    setInterval(function () {
      if (gpsData) {
        socket.emit('gpsData', gpsData)
      }
    }, 1000)
  })
  res.sendFile('/home/pi/carputer/index.html')
})

// ==================== GOOGLE MAPS API ====================

APP.get('/private/apikey/', function (req, res) {
  let pageres = res
  // This is a weird way to get a script file to the client, but I did it this way to keep the API key private.
  REQUEST(APIKEY, function (err, res, body) {
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
