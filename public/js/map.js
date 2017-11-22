const MAP = {
  currentLocation: { lat: 42, lng: -84 },
  map: {},
  marker: {},
  speed: 0,
  init: function () {
    MAP.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: MAP.currentLocation
    })
    MAP.marker = new google.maps.Marker({
      position: MAP.currentLocation,
      map: MAP.map
    })
  },
  updateDisplay: function () {
    MAP.map.setCenter(MAP.currentLocation)
    MAP.marker.setMap(null)
    MAP.marker = new google.maps.Marker({
      position: MAP.currentLocation,
      map: MAP.map
    })
    document.getElementById('speed').innerText = Math.round(MAP.speed)
    document.getElementById('location').innerText = Math.round(MAP.currentLocation.lat * 10000) / 10000 + ', ' + Math.round(MAP.currentLocation.lng * 10000) / 10000
  }
}

const SOCKET = io()
SOCKET.open()
SOCKET.on('connect', function () {
  console.log('Connected!')
})
SOCKET.on('gpsData', function (data) {
  if (data.lat) {
    MAP.currentLocation.lat = data.lat
    MAP.currentLocation.lng = data.lon
    MAP.updateDisplay()
  }
})
