const GPSD = require('node-gpsd')

const GPS = {
  data: {},
  DAEMON: new GPSD.Daemon(),
  daemonInit: function () {
    console.log('GPSD Daemon Started')

    const LISTENER = new GPSD.Listener()

    LISTENER.on('TPV', function (tpv) {
      GPS.data = tpv
      if (GPS.currentSocket) {
        GPS.currentSocket.emit('gpsData', GPS.data)
      }
    })

    LISTENER.connect(function () {
      console.log('Connected')
      LISTENER.watch()
    })
  }
}

module.exports = GPS
