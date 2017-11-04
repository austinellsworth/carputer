var map
var marker
var currentLocation = {}

function initMap () {
  let start = {lat: 42, lng: -84}
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: start
  })
  marker = new google.maps.Marker({
    position: start,
    map: map
  })
}

function updateLocation () {
  map.setCenter(currentLocation)
  marker.setMap(null)
  marker = new google.maps.Marker({
    position: currentLocation,
    map: map
  })
  document.getElementById('location').innerText = Math.round(currentLocation.lat * 10000) / 10000 + ', ' + Math.round(currentLocation.lng * 10000) / 10000
}

const socket = io()
socket.open()
socket.on('connect', function () {
  console.log('Connected!')
})
socket.on('gpsData', function (data) {
  document.getElementById('speed').innerText = Math.round(data.speed)
  currentLocation.lat = data.lat
  currentLocation.lng = data.lon
  if (data.lat) {
    updateLocation()
  }
})
