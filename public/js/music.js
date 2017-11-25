// TODO: make buttons prettier, deal with play() promises better (use load() instead?),

// Put everything into one const to minimize global variables/functions
const MUSIC = {
  playlists: {},
  currentSongIndex: 0,
  currentPlaylistSongs: []
}

// Ask server for list of playlists and songs.
MUSIC.init = function () {
  // when server responds, use the data to update displayed playlists. Then start playing first playlist.
  function reqListener () {
    let serverResponse = JSON.parse(this.responseText)
    MUSIC.playlists = serverResponse
    updatePlaylistDisplay(serverResponse)
    MUSIC.changePlaylist(MUSIC.playlists.names[0].id)
  }
  var oReq = new XMLHttpRequest()
  oReq.addEventListener('load', reqListener)
  oReq.open('GET', '/music')
  oReq.send()

  // add playlists to select menu
  function updatePlaylistDisplay (data) {
    data.names.forEach(function (playlist, i) {
      let option = document.createElement('option')
      let playlistNumber = i + 1
      option.value = playlist.id
      option.innerText = playlistNumber + '. ' + playlist.name
      document.getElementById('playlists').appendChild(option)
    })
  }
}

// when a playlist is selected, go through list of songs and make array of songs belonging to that playlist
MUSIC.changePlaylist = function (selection) {
  MUSIC.currentPlaylistSongs = MUSIC.playlists[selection]
  MUSIC.currentSongIndex = 0
  MUSIC.playSong()
}

// function for play/pause button
MUSIC.playPause = function () {
  if (MUSIC.songNowPlaying && MUSIC.songNowPlaying.paused) {
    MUSIC.songNowPlaying.play()
    document.getElementsByClassName('fa-play')[0].classList.add('hidden')
    document.getElementsByClassName('fa-pause')[0].classList.remove('hidden')
  } else if (MUSIC.songNowPlaying && !MUSIC.songNowPlaying.paused) {
    MUSIC.songNowPlaying.pause()
    document.getElementsByClassName('fa-play')[0].classList.remove('hidden')
    document.getElementsByClassName('fa-pause')[0].classList.add('hidden')
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
// set function to use with event listeners. gets index of current song, pulls that from MUSIC.currentPlaylistSongs array, plays it
MUSIC.playSong = function () {
  if (MUSIC.songNowPlaying) {
    MUSIC.songNowPlaying.pause()
  }
  MUSIC.songNowPlaying = new Audio(['/music/' + MUSIC.currentPlaylistSongs[MUSIC.currentSongIndex].track.storeId])
  MUSIC.songNowPlaying.addEventListener('ended', MUSIC.songForward)
  MUSIC.songNowPlaying.play()
  document.getElementsByClassName('fa-play')[0].classList.add('hidden')
  document.getElementsByClassName('fa-pause')[0].classList.remove('hidden')
  MUSIC.updateSongsDisplay()
  MUSIC.nowPlayingPopup()
}

MUSIC.nowPlayingPopup = function () {
  let popup = document.getElementById('now-playing-popup')
  let currentArtist = MUSIC.currentPlaylistSongs[MUSIC.currentSongIndex].track.artist
  let currentTitle = MUSIC.currentPlaylistSongs[MUSIC.currentSongIndex].track.title
  popup.innerHTML = '<span id="now-playing-popup-text">' + currentArtist + ' - ' + currentTitle + '</span'
  popup.classList.remove('hidden')
  setTimeout(() => {
    popup.classList.add('hidden')
  }, 2000)
}

// update the table which displays artist/title
MUSIC.updateSongsDisplay = function () {
  let artists = document.getElementsByClassName('artist')
  let titles = document.getElementsByClassName('title')
  let numberToDisplay = PAGE.songsToDisplay || 5
  let indexModifier = (numberToDisplay - 1) / 2
  for (let i = 0; i < numberToDisplay; i++) {
    let trackIndex = (MUSIC.currentSongIndex - indexModifier + i)
   // First deal with wrapping around beginning and end of list
    if (trackIndex < 0) {
      trackIndex += MUSIC.currentPlaylistSongs.length
    } else if (trackIndex >= MUSIC.currentPlaylistSongs.length) {
      trackIndex -= MUSIC.currentPlaylistSongs.length
    }
    // Now add special HTML to currently-playing song
    if (trackIndex === MUSIC.currentSongIndex) {
      artists[i].innerHTML = '<i class="fa fa-chevron-right" aria-hidden="true"></i><span class="now-playing">' + MUSIC.currentPlaylistSongs[trackIndex].track.artist + '</span>'
      titles[i].innerHTML = '<span class="now-playing">' + MUSIC.currentPlaylistSongs[trackIndex].track.title + '</span>'
    } else {
      artists[i].innerHTML = MUSIC.currentPlaylistSongs[trackIndex].track.artist
      titles[i].innerHTML = MUSIC.currentPlaylistSongs[trackIndex].track.title
    }
  }
  // Deal with situation when we have more places for tracks than tracks to display (like on grid view page)
  if (numberToDisplay < artists.length) {
    for (let i = numberToDisplay; i < artists.length; i++) {
      artists[i].innerHTML = ''
      titles[i].innerHTML = ''
    }
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
