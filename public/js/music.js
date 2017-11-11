function reqListener () {
  const PLAYLISTS = JSON.parse(this.responseText)
  PLAYLISTS.forEach(function (playlist) {
    let option = document.createElement('option')
    option.value = playlist.id
    option.innerText = playlist.name
    document.getElementById('playlists').appendChild(option)
  })
}
var oReq = new XMLHttpRequest()
oReq.addEventListener('load', reqListener)
oReq.open('GET', '/music')
oReq.send()
function playSong (playlistID) {
  function songsReqListener () {
    console.log(this.responseText)
    // const SONGS = JSON.parse(this.responseText)
    // SONGS.forEach(function (song) {
    //   let option = document.createElement('option')
    //   option.value = song.id
    //   option.innerText = song.track.title + ' - ' + song.track.artist
    //   document.getElementById('songs').appendChild(option)
    // })
  }
  var songsReq = new XMLHttpRequest()
  songsReq.addEventListener('load', songsReqListener)
  songsReq.open('GET', '/music/' + playlistID)
  songsReq.send()
}

document.getElementById('playlists').addEventListener('change', function () {
  console.log(this.value)
  playSong(this.value)
})
