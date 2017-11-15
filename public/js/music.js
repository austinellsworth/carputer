// TODO: make buttons prettier, deal with play() promises better (use load() instead?),
// give variables better names, automatically go to next song,
// clean this file up!
var playlists = {}
var playlistSongs = []
var currentSongIndex = 0
var nowPlaying

// ================================================================================
// ==================== Run right away to get playlists and songs ====================
// ================================================================================

// on page load, ask server for list of playlists and songs.
(function getPlaylistsFromServer () {
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
      playlists[id] = []
    })
    data.songs.forEach(function (song) {
      let plistId = song.playlistId
      if (playlists[plistId]) {
        playlists[plistId].push(song)
      }
    })
    return playlists
  }
})()

// ================================================================================
// ==================== Functions for music controls ====================
// ================================================================================

// when a playlist is selected, go through list of songs and make array of songs belonging to that playlist
function changePlaylist (selection) {
  playlistSongs = playlists[selection]
  currentSongIndex = 0
  updateSongsDisplay()
  playSong()
}

// function for play/pause button
function playPause () {
  if (nowPlaying && nowPlaying.paused) {
    nowPlaying.play()
  } else if (nowPlaying && !nowPlaying.paused) {
    nowPlaying.pause()
  } else {
    playSong()
  }
}

// function for back button
function songBack () {
  if (currentSongIndex > 0) {
    currentSongIndex--
  } else {
    currentSongIndex = playlistSongs.length - 1
  }
  playSong()
}

// function for forward button
function songForward () {
  if (currentSongIndex < playlistSongs.length - 1) {
    currentSongIndex++
  } else {
    currentSongIndex = 0
  }
  playSong()
}

// function for shuffle button
function songShuffle () {
  shuffleSongs(playlistSongs)
  currentSongIndex = 0
  playSong()
}
// set function to use below with event listeners. gets index of current song, pulls that from playlistSongs array, plays it
function playSong () {
  if (nowPlaying) {
    nowPlaying.pause()
  }
  nowPlaying = new Audio(['/music/' + playlistSongs[currentSongIndex].track.storeId])
  nowPlaying.addEventListener('ended', songForward)
  nowPlaying.play()
  updateSongsDisplay()
}

// update the table which displays artist/title
function updateSongsDisplay () {
  let artists = document.getElementsByClassName('artist')
  let titles = document.getElementsByClassName('title')

  for (let i = 0; i < 5; i++) {
    let trackIndex = (currentSongIndex - 2 + i)
    if (trackIndex < 0) {
      trackIndex += playlistSongs.length
    } else if (trackIndex >= playlistSongs.length) {
      trackIndex -= playlistSongs.length
    }
    artists[i].innerText = playlistSongs[trackIndex].track.artist
    titles[i].innerText = playlistSongs[trackIndex].track.title
  }
}

// use Fisher-Yates (aka Knuth) Shuffle (thanks stackoverflow!)
function shuffleSongs (array) {
  let currentIndex = array.length
  let tempValue
  let rndIndex

  while (currentIndex > 0) {
    rndIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    tempValue = array[currentIndex]
    array[currentIndex] = array[rndIndex]
    array[rndIndex] = tempValue
  }
  return array
}

// ================================================================================
// ==================== add event listeners to music control buttons ====================
// ================================================================================

document.getElementById('back').addEventListener('click', songBack)
document.getElementById('play').addEventListener('click', playPause)
document.getElementById('forward').addEventListener('click', songForward)
document.getElementById('shuffle').addEventListener('click', songShuffle)
document.getElementById('playlists').addEventListener('change', function () { changePlaylist(this.value) })
