const musicExts = [".mp3", ".wav", ".flac"];
let playlistItems = [];
let imgEntity = null;
var jsonData = null;
currentIndex = 0;
isPlaying = false;

async function selectFolder() {
  const folderHandle = await window.showDirectoryPicker();
  const playlist = document.getElementById("playlist");
  playlist.innerHTML = "";

  playlistItems = [];

  const sortedEntries = [];

  for await (const entry of folderHandle.values()) {
    if (entry.kind === "file") {
      if (musicExts.some((extension) => entry.name.endsWith(extension))) {
        sortedEntries.push(entry);
      }
      if (entry.name.startsWith("albumart")) {
        imgEntity = entry;
      }
      if (entry.name === "info.json") {
        const file = await entry.getFile();
        const content = await file.text();
        jsonData = JSON.parse(content);
      }
    }
  }

  if (jsonData) {
    setInnerHTMLById("album-title", jsonData.album.title);
    setInnerHTMLById("album-artist", jsonData.album.artist);
  }

  sortedEntries.sort((a, b) => a.name.localeCompare(b.name));

  for (const [index, entry] of Object.entries(sortedEntries)) {
    const listItem = document.createElement("li");
    listItem.textContent =
      zeroPadIndex(index, jsonData.songs[index].title) || entry.name;
    listItem.addEventListener("click", () => playMusic(entry));
    playlist.appendChild(listItem);

    playlistItems.push({
      fileHandle: entry,
      element: listItem,
    });
  }
  if (imgEntity === null) {
    document.getElementById("albumart").src = "notfound.png";
  } else {
    document.getElementById("albumart").src = URL.createObjectURL(
      await imgEntity.getFile()
    );
  }

  if (playlistItems.length > 0) {
    playMusic(playlistItems[currentIndex].fileHandle);
    const audio = document.getElementById("audio");
    audio.addEventListener("ended", playNext);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("play", () => {
      isPlaying = true;
    });
    audio.addEventListener("pause", () => {
      isPlaying = false;
    });
    var slider = document.getElementById("seek");
    slider.addEventListener("input", seeking);
    var vol = document.getElementById("volume");
    vol.addEventListener("input", changeVolume);
  }
}

async function playMusic(fileHandle) {
  const audio = document.getElementById("audio");

  currentIndex = playlistItems.findIndex(
    (item) => item.fileHandle.name === fileHandle.name
  );

  playlistItems.forEach((item) => item.element.classList.remove("playing"));

  playlistItems[currentIndex].element.classList.add("playing");

  const file = await fileHandle.getFile();
  audio.src = URL.createObjectURL(file);
  audio.play();
}

function playNext() {
  const audio = document.getElementById("audio");
  if (!audio.src) {
    alert("まず音楽をよみこんでください");
    selectFolder();
    return;
  }
  currentIndex = (currentIndex + 1) % playlistItems.length;
  playMusic(playlistItems[currentIndex].fileHandle);
}

function playPrevious() {
  const audio = document.getElementById("audio");
  if (!audio.src) {
    alert("まず音楽をよみこんでください");
    selectFolder();
    return;
  }
  currentIndex =
    (currentIndex - 1 + playlistItems.length) % playlistItems.length;
  playMusic(playlistItems[currentIndex].fileHandle);
}

function timerFormatString(second) {
  if (isNaN(second)) {
    return "--:--";
  }
  const minutes = Math.floor(second / 60);
  const seconds = Math.floor(second % 60);
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

function onTimeUpdate() {
  var slider = document.getElementById("seek");
  var currentTime = audio.currentTime;
  var duration = audio.duration;
  document.getElementById("timer").innerHTML = `${timerFormatString(
    currentTime
  )} / ${timerFormatString(duration)}`;
  var progress = (currentTime / duration) * 2000;
  slider.value = progress;
  if (jsonData) {
    setInnerHTMLById("album-title", jsonData.album.title);
    setInnerHTMLById("album-artist", jsonData.album.artist);
    setInnerHTMLById("song-artist", jsonData.songs[currentIndex].artist);
    document.getElementById("song-description").innerHTML = "";
    setInnerHTMLById(
      "song-description",
      jsonData.songs[currentIndex].description
    );
  }
}

function pauseOrPlay() {
  const audio = document.getElementById("audio");
  if (!audio.src) {
    alert("まず音楽をよみこんでください");
    selectFolder();
    return;
  }
  var btn = document.getElementById("play-pause-button");
  if (isPlaying) {
    audio.pause();
    btn.src = "pause.png";
  } else {
    audio.play();
    btn.src = "play.png";
  }
}
function clipNumber(n, min, max) {
  if (isNaN(n)) return false;
  result = n < min ? min : n > max ? max : n;
  return result;
}
function seeking() {
  var audio = document.getElementById("audio");
  var value = document.getElementById("seek").value;
  value = clipNumber(value, 0, 1995);
  audio.currentTime = (value / 2000) * audio.duration;
}
function changeVolume() {
  var audio = document.getElementById("audio");
  var vol = document.getElementById("volume");
  audio.volume = vol.value / 100;
}
function mute() {
  var audio = document.getElementById("audio");
  var vol = document.getElementById("volume");
  var btn = document.getElementById("volume-button");
  audio.muted = !audio.muted;
  if (audio.muted) {
    btn.src = "mute.png";
  } else {
    btn.src = "volume.png";
  }
}

function setInnerHTMLById(id, value) {
  if (value) {
    document.getElementById(id).innerHTML = value.replace(/\n/g, "<br>");
  }
}

function zeroPadIndex(index, str) {
  const oneBased = parseInt(index) + 1;
  return String(oneBased).padStart(2, "0") + " - " + str;
}
