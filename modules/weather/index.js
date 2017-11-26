require('dotenv').config()
const REQUEST = require('request')
const GPS = require('../gps')

const WEATHER = {
  data: {},
  retreiveWeatherData: function () {
    let lat = GPS.data.lat
    let lon = GPS.data.lon
    if (lat && lon && GPS.currentSocket) {
      console.log('Getting Weather...')
      WEATHER.makeWeatherRequests(lat, lon, function () {
        console.log(WEATHER.data.current_observation.temp_f + 'F')
        GPS.currentSocket.emit('weatherData', WEATHER.data)
      })
    }
  },
  startWeatherLoop: function () {
    if (!WEATHER.isLooping) {
      WEATHER.retreiveWeatherData()
      setInterval(WEATHER.retreiveWeatherData, process.env.WEATHER_INTERVAL)
      WEATHER.isLooping = true
    } else {
      GPS.currentSocket.emit('weatherData', WEATHER.data)
    }
  },
  makeWeatherRequests: function (lat, lon, callback) {
    let reqUrl = process.env.WEATHER_API + 'geolookup/q/' + lat + ',' + lon + '.json'
    REQUEST(reqUrl, function (err, res, body) {
      if (err) {
        console.log(err)
      } else {
        let data = JSON.parse(body).location
        let city = data.city
        let state = data.state
        let weatherReq = process.env.WEATHER_API + 'conditions/q/' + state + '/' + city + '.json'
        REQUEST(weatherReq, function (err, res, body) {
          if (err) {
            console.log(err)
          } else {
            WEATHER.data = JSON.parse(body)
            callback()
          }
        })
      }
    })
  }
}

module.exports = WEATHER


