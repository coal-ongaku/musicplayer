const musicExts = [".mp3", ".wav", ".flac"];
let playlistItems = [];
let imgEntity;
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
      if (entry.name.startsWith("albumArt")) {
        imgEntry = entry;
      }
    }
  }

  sortedEntries.sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of sortedEntries) {
    const listItem = document.createElement("li");
    listItem.textContent = entry.name;
    listItem.addEventListener("click", () => playMusic(entry));
    playlist.appendChild(listItem);

    playlistItems.push({
      fileHandle: entry,
      element: listItem,
    });
  }

  if (playlistItems.length > 0) {
    playMusic(playlistItems[currentIndex].fileHandle);
    const audio = document.getElementById("audio");
    audio.addEventListener("ended", playNext);
    audio.addEventListener("timeupdate", setTimer);
    var slider = document.getElementById("seek");
    slider.addEventListener("input", seeking);
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
  isPlaying = true;
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

function setTimer() {
  var slider = document.getElementById("seek");
  var currentTime = audio.currentTime;
  var duration = audio.duration;
  document.getElementById("timer").innerHTML = `${timerFormatString(
    currentTime
  )} / ${timerFormatString(duration)}`;
  var progress = (currentTime / duration) * 2000;
  slider.value = progress;
}

function pauseOrPlay() {
  const audio = document.getElementById("audio");
  if (!audio.src) {
    alert("まず音楽をよみこんでください");
    selectFolder();
    return;
  }
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    audio.play();
    isPlaying = true;
  }
}
function seeking() {
  var audio = document.getElementById("audio");
  var value = document.getElementById("seek").value;
  audio.currentTime = (value / 2000) * audio.duration;
}
