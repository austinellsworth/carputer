require('dotenv').config()
const REQUEST = require('request')

const WEATHER = {
  data: {},
  getWeatherData: function (lat, lon, callback) {
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
