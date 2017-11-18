
// ================================================================================
// ==================== add event listeners to music control buttons ====================
// ================================================================================

document.getElementById('back').addEventListener('click', MUSIC.songBack)
document.getElementById('play').addEventListener('click', MUSIC.playPause)
document.getElementById('forward').addEventListener('click', MUSIC.songForward)
document.getElementById('shuffle').addEventListener('click', MUSIC.songShuffle)
document.getElementById('playlists').addEventListener('change', function () { MUSIC.changePlaylist(this.value) })

MUSIC.init()
MAP.init()
