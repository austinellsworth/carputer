MUSIC.init()
MAP.init()

// functions for page display changes
const PAGE = {
  songsToDisplay: 3,
  elements: {
    map: document.getElementById('map'),
    music: document.getElementById('music'),
    dash: document.getElementById('dash')
  },
  toggleSettings: () => {
    document.getElementById('settings-dropdown').classList.toggle('hidden')
  },
  toggleBrightness: () => {
    document.getElementById('container').classList.toggle('night-mode')
  },
  toggleFullScreen: () => {
    if (window.innerHeight === screen.height) {
      document.webkitCancelFullScreen()
      document.getElementById('fullscreen-icon').classList.remove('hidden')
      document.getElementById('cancel-fullscreen-icon').classList.add('hidden')
    } else {
      document.documentElement.webkitRequestFullscreen()
      document.getElementById('fullscreen-icon').classList.add('hidden')
      document.getElementById('cancel-fullscreen-icon').classList.remove('hidden')
    }
  },
  resetClassList: () => {
    for (let element in PAGE.elements) {
      PAGE.elements[element].classList.remove('grid-view')
      PAGE.elements[element].classList.remove('full-view')
      PAGE.elements[element].classList.remove('hidden')
    }
  },
  hideOthers: (except) => {
    for (let element in PAGE.elements) {
      if (PAGE.elements[element] !== except) {
        PAGE.elements[element].classList.add('hidden')
      }
    }
  },
  gridView: () => {
    PAGE.resetClassList()
    for (let element in PAGE.elements) {
      if (PAGE.elements.hasOwnProperty(element)) {
        PAGE.elements[element].classList.add('grid-view')
      }
      PAGE.songsToDisplay = 3
      MUSIC.updateSongsDisplay()
    }
  },
  mapView: () => {
    PAGE.resetClassList()
    PAGE.elements.map.classList.add('full-view')
    PAGE.hideOthers(PAGE.elements.map)
    MAP.init()
  },
  musicView: () => {
    PAGE.resetClassList()
    PAGE.elements.music.classList.add('full-view')
    PAGE.hideOthers(PAGE.elements.music)
    PAGE.songsToDisplay = 11
    MUSIC.updateSongsDisplay()
  },
  dashView: () => {
    PAGE.resetClassList()
    PAGE.elements.dash.classList.add('full-view')
    PAGE.hideOthers(PAGE.elements.dash)
  }
}

// Event listener for Online status
window.addEventListener('online', () => {
  document.getElementById('wifi-status').classList.remove('danger')
})
window.addEventListener('offline', () => {
  document.getElementById('wifi-status').classList.add('danger')
})

// Event listeners for settings buttons
document.getElementById('settings-button').addEventListener('click', PAGE.toggleSettings)
document.getElementById('brightness-button').addEventListener('click', PAGE.toggleBrightness)
document.getElementById('fullscreen-toggle-button').addEventListener('click', PAGE.toggleFullScreen)

// Event listeners for page display buttons
document.getElementById('home-button').addEventListener('click', PAGE.gridView)
document.getElementById('map-button').addEventListener('click', PAGE.mapView)
document.getElementById('music-button').addEventListener('click', PAGE.musicView)
document.getElementById('dash-button').addEventListener('click', PAGE.dashView)

// Event listeners for music controls
document.getElementById('back').addEventListener('click', MUSIC.songBack)
document.getElementById('play').addEventListener('click', MUSIC.playPause)
document.getElementById('forward').addEventListener('click', MUSIC.songForward)
document.getElementById('shuffle').addEventListener('click', MUSIC.songShuffle)
document.getElementById('playlists').addEventListener('change', function () { MUSIC.changePlaylist(this.value) })
