const CONFIG = {
  port: 8000,
  weatherUpdateInterval: 300000, // in milliseconds
  defaultLocation: { // if you want a default location for weather to work right away
    lat: 42,
    lon: -84
  }
}

module.exports = CONFIG
