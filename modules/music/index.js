const PLAYMUSIC = require('playmusic')
const MUSIC = new PLAYMUSIC()

// Everything for the initial setup of Google Play Music is in this PLAYLISTS constant
// On the main app.js file, we just need to call PLAYLISTS.getData()
// This will initialize Google Play Music, get all playlists and their songs,
// and then sort the songs by playlist.
// Then we can send all our playlists and songs to the server in one nice package.
// PLAYLISTS.names is needed on the client to set the values for the playlists dropdown menu
// PLAYLISTS also contains a property with the id of each playlist and a value which is an array of its songs

const PLAYLISTS = {
  playlists: {
    names: []
  },
  assignSongstoPlaylists: function (data) {
    data.playlists.forEach(function (playlist) {
      let id = playlist.id
      PLAYLISTS.playlists.names.push(playlist)
      PLAYLISTS.playlists[id] = []
    })
    data.songs.forEach(function (song) {
      let plistId = song.playlistId
      if (PLAYLISTS.playlists[plistId]) {
        PLAYLISTS.playlists[plistId].push(song)
      }
    })
  },
  getData: function () {
    MUSIC.init({email: process.env.EMAIL, password: process.env.PASSWORD}, function (err) {
      if (err) {
        console.log(err)
      }
      MUSIC.getPlayListEntries(function (err, entries) {
        if (err) {
          console.log(err)
        } else {
          MUSIC.getPlayLists(function (err, playlists) {
            if (err) {
              console.log(err)
            } else {
              let rawData = {}
              rawData.playlists = playlists.data.items
              rawData.songs = entries.data.items
              PLAYLISTS.assignSongstoPlaylists(rawData)
            }
          })
        }
      })
    })
  }
}

module.exports = {PLAYLISTS, MUSIC}
