// TODO: make buttons prettier, deal with play() promises better (use load() instead?),
// give variables better names, automatically go to next song,
// clean this file up!

// Put everything into one const to minimize global variables/functions
const MUSIC = {
  playlists: {},
  currentSongIndex: 0,
  currentPlaylistSongs: []
}

// Ask server for list of playlists and songs.
MUSIC.init = function () {
  function reqListener () {
    let serverResponse = JSON.parse(this.responseText)
    updatePlaylistDisplay(serverResponse)
    assignSongstoPlaylists(serverResponse)
  }
  var oReq = new XMLHttpRequest()
  oReq.addEventListener('load', reqListener)
  oReq.open('GET', '/music')
  oReq.send()

  // add playlists to select menu
  function updatePlaylistDisplay (data) {
    data['playlists'].forEach(function (playlist) {
      let option = document.createElement('option')
      option.value = playlist.id
      option.innerText = playlist.name
      document.getElementById('playlists').appendChild(option)
    })
  }
  // loop through playlists and add them as properties to the playlists variable
  // loop through all songs and add each one to the corresponding playlist's array
  function assignSongstoPlaylists (data) {
    data.playlists.forEach(function (playlist) {
      let id = playlist.id
      MUSIC.playlists[id] = []
    })
    data.songs.forEach(function (song) {
      let plistId = song.playlistId
      if (MUSIC.playlists[plistId]) {
        MUSIC.playlists[plistId].push(song)
      }
    })
  }
}

// when a playlist is selected, go through list of songs and make array of songs belonging to that playlist
MUSIC.changePlaylist = function (selection) {
  MUSIC.currentPlaylistSongs = MUSIC.playlists[selection]
  MUSIC.currentSongIndex = 0
  MUSIC.updateSongsDisplay()
  MUSIC.playSong()
}

// function for play/pause button
MUSIC.playPause = function () {
  if (MUSIC.songNowPlaying && MUSIC.songNowPlaying.paused) {
    MUSIC.songNowPlaying.play()
  } else if (MUSIC.songNowPlaying && !MUSIC.songNowPlaying.paused) {
    MUSIC.songNowPlaying.pause()
  } else {
    MUSIC.playSong()
  }
}

// function for back button
MUSIC.songBack = function () {
  if (MUSIC.currentSongIndex > 0) {
    MUSIC.currentSongIndex--
  } else {
    MUSIC.currentSongIndex = MUSIC.currentPlaylistSongs.length - 1
  }
  MUSIC.playSong()
}

// function for forward button
MUSIC.songForward = function () {
  if (MUSIC.currentSongIndex < MUSIC.currentPlaylistSongs.length - 1) {
    MUSIC.currentSongIndex++
  } else {
    MUSIC.currentSongIndex = 0
  }
  MUSIC.playSong()
}

// function for shuffle button
MUSIC.songShuffle = function () {
  MUSIC.shuffleSongs(MUSIC.currentPlaylistSongs)
  MUSIC.currentSongIndex = 0
  MUSIC.playSong()
}
// set function to use below with event listeners. gets index of current song, pulls that from MUSIC.currentPlaylistSongs array, plays it
MUSIC.playSong = function () {
  if (MUSIC.songNowPlaying) {
    MUSIC.songNowPlaying.pause()
  }
  MUSIC.songNowPlaying = new Audio(['/music/' + MUSIC.currentPlaylistSongs[MUSIC.currentSongIndex].track.storeId])
  MUSIC.songNowPlaying.addEventListener('ended', MUSIC.songForward)
  MUSIC.songNowPlaying.play()
  MUSIC.updateSongsDisplay()
}

// update the table which displays artist/title
MUSIC.updateSongsDisplay = function () {
  let artists = document.getElementsByClassName('artist')
  let titles = document.getElementsByClassName('title')

  for (let i = 0; i < 5; i++) {
    let trackIndex = (MUSIC.currentSongIndex - 2 + i)
    if (trackIndex < 0) {
      trackIndex += MUSIC.currentPlaylistSongs.length
    } else if (trackIndex >= MUSIC.currentPlaylistSongs.length) {
      trackIndex -= MUSIC.currentPlaylistSongs.length
    }
    artists[i].innerText = MUSIC.currentPlaylistSongs[trackIndex].track.artist
    titles[i].innerText = MUSIC.currentPlaylistSongs[trackIndex].track.title
  }
}

// use Fisher-Yates (aka Knuth) Shuffle (thanks stackoverflow!)
MUSIC.shuffleSongs = function (array) {
  let currentIndex = array.length

  while (currentIndex > 0) {
    let rndIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    let tempValue = array[currentIndex]
    array[currentIndex] = array[rndIndex]
    array[rndIndex] = tempValue
  }
}
