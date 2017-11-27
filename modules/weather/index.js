require('dotenv').config()
const CONFIG = require('../../config')
const REQUEST = require('request')
const GPS = require('../gps')

const WEATHER = {
  data: {},
  retreiveWeatherData: function () {
    let lat = GPS.data.lat || CONFIG.defaultLocation.lat
    let lon = GPS.data.lon || CONFIG.defaultLocation.lon
    if (lat && lon && GPS.currentSocket) {
      console.log('Getting Weather...')
      WEATHER.makeWeatherRequest(lat, lon, function () {
        console.log(WEATHER.data.current_observation.temp_f + 'F')
        GPS.currentSocket.emit('weatherData', WEATHER.data)
      })
    }
  },
  startWeatherLoop: function () {
    if (!WEATHER.isLooping) {
      WEATHER.retreiveWeatherData()
      setInterval(WEATHER.retreiveWeatherData, CONFIG.weatherUpdateInterval)
      WEATHER.isLooping = true
    } else {
      GPS.currentSocket.emit('weatherData', WEATHER.data)
    }
  },
  makeWeatherRequest: function (lat, lon, callback) {
    let reqUrl = process.env.WEATHER_API + 'conditions/q/' + lat + ',' + lon + '.json'
    REQUEST(reqUrl, function (err, res, body) {
      if (err) {
        console.log(err)
      } else {
        WEATHER.data = JSON.parse(body)
        callback()
      }
    })
  }
}

module.exports = WEATHER
