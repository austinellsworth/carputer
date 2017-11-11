// ==================== REQUIRE STATEMENTS ====================
const EXPRESS = require('express')
const APP = require('express')()
const SERVER = require('http').createServer(APP)
const IO = require('socket.io')(SERVER)
const PATH = require('path')
const REQUEST = require('request')
const APIKEY = require('./private/API_KEY')
const GPSD = require('node-gpsd')
// const PLAYMUSIC = require('playmusic')
// const MUSIC = new PLAYMUSIC()
// const GOOGLE = require('./private/playmusic')

// ==================== MISC SETUP ====================

APP.set('view engine', 'ejs')
APP.use('/assets/', EXPRESS.static(PATH.join(__dirname, '/public')))
APP.use('/', EXPRESS.static(__dirname))
// MUSIC.init(GOOGLE, function (err) {
//   if (err) console.error(err)
//   // place code here
// })
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
  res.sendFile('./index.html')
})

// APP.get('/music/', function (req, res) {
//   MUSIC.getPlayListEntries(function (err, data) {
//     if (err) {
//       console.log(err)
//     }
//     let printData = data.data.items
//     console.log(printData)
//     res.send(JSON.stringify(data.data.items))
//   })
// })

// APP.get('/music/:playlist', function (req, res) {
//   console.log(req.params.playlist)
//   MUSIC.getStream('T42a4nws5tlpvwbn2yegdadinuq', function (data, blah) {
//     console.log(data, blah)
//     blah.pipe(res)
//   })
// })

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
