const PLAYMUSIC = require('playmusic')
const MUSIC = new PLAYMUSIC()
const GOOGLE = require('../../private/playmusic')

const PLAYLISTS = {
  names: [],
  assignSongstoPlaylists: function (data) {
    data.playlists.forEach(function (playlist) {
      let id = playlist.id
      PLAYLISTS.names.push(playlist)
      PLAYLISTS[id] = []
    })
    data.songs.forEach(function (song) {
      let plistId = song.playlistId
      if (PLAYLISTS[plistId]) {
        PLAYLISTS[plistId].push(song)
      }
    })
  },
  getData: function () {
    MUSIC.init(GOOGLE, function (err) {
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
