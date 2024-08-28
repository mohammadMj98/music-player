const musicImage = document.querySelector('#music-cover');
const singerName = document.querySelector('.singer-name');
const singerMusicName = document.querySelector('.singer-music-name');
const progressContainer = document.querySelector('.progres-container');
const progress = document.querySelector('.progress');
const audio = document.querySelector('#audio');
const currentTimeElem = document.querySelector('.current-time');
const endTimeElem = document.querySelector('.end-time');
const backwardBtn = document.querySelector('#prev');
const playBtn = document.querySelector('.play-pause');
const forwardBtn = document.querySelector('#next');
const repeatBtn = document.querySelector('#repeat-plist');
const navigaitor = document.querySelector('.navigaitor');
const listBox = document.querySelector('.list-music-item');
const closeBtn = document.querySelector('#close');
const musicWrapper = document.querySelector('.music-wrapper');
const moreMusicItem = document.querySelector('#more');


let allMusic = [
  { name: "flying", artist: "anatema", img: "anatema.jpg", src:"anathema_-_flying_universal_-_live_2013.mp3" },
  { name: "hotel california", artist: "eagles", img:"hotel-california.png", src:"1. Eagles - Hotel California (2013 Remaster) (320).mp3" },
  { name: "30_Seconds_To_Mars", artist: "jared leto", img: "second-to-mars.jpg", src: "30_Seconds_To_Mars_Acoustic_Live_Revenge_Energy_NRJ_Ber_upMf41xfKcE.mp3" },
  { name: "back to back", artist: "emy whithouse", img:"back-to-back.jpg", src:"Back-To-Black.mp3" },
  { name: "lost control", artist: "anatema", img:"lost-control.jpg", src:"lost-control-anathema.mp3" },
  { name: "nothing else matters", artist: "metalica", img:"nothing-else-mather.jpg", src:"Metallica-Nothing-Else-Matters.mp3" }
];

let isPlay = false;
let musicIndex = Math.floor(Math.random() * allMusic.length);
let repeatState = 'off'; // 'off', 'repeat', 'shuffle'

window.addEventListener("load", () => {
  loadMusic(musicIndex);
});

function loadMusic(indexNumb) {
  singerMusicName.innerText = allMusic[indexNumb].name;
  singerName.innerText = allMusic[indexNumb].artist;
  musicImage.src = `images/${allMusic[indexNumb].img}`;
  audio.src = `songs/${allMusic[indexNumb].src}`;
}

function playSong() {
  isPlay = true;
  playBtn.querySelector("i").innerHTML = "pause";
  navigaitor.classList.add('paused')
  audio.play();
  musicImage.classList.add('rotate')
}

function pauseSong() {
  isPlay = false;
  audio.pause();
  playBtn.querySelector("i").innerHTML = "play_arrow";
  musicImage.classList.remove('rotate')
}

function prevSong() {
  musicIndex = (musicIndex - 1 + allMusic.length) % allMusic.length;
  loadMusic(musicIndex);
  playSong();
}

function nextSong() {
  musicIndex = (musicIndex + 1) % allMusic.length;
  loadMusic(musicIndex);
  playSong();
}

function formatTime(time) {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${seconds}`;
}

function updateTimes() {
  currentTimeElem.textContent = formatTime(audio.currentTime);
  if (audio.duration) {
    endTimeElem.textContent = formatTime(audio.duration);
  }
}

function updateProgress() {
  const { duration, currentTime } = audio;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

function setProgress(e) {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

function toggleRepeat() {
  if (repeatState === 'off') {
    repeatState = 'repeat';
    repeatBtn.classList.add('active');
    repeatBtn.innerHTML ='repeat_one';


  } else if (repeatState === 'repeat') {
    repeatState = 'shuffle';
    repeatBtn.innerHTML ='shuffle';
    
  } else {
    repeatState = 'off';
    repeatBtn.classList.remove('active');
    repeatBtn.innerHTML ='repeat';

  }
}

function playNext() {
  if (repeatState === 'repeat') {
    audio.currentTime = 0;
    audio.play();
  } else if (repeatState === 'shuffle') {
    musicIndex = Math.floor(Math.random() * allMusic.length);
    loadMusic(musicIndex);
    playSong();
  } else {
    nextSong();
  }
}


playBtn.addEventListener('click', () => {
  if (isPlay) {
    pauseSong();
  } else {
    playSong();
  }
});

// creat music list

allMusic.forEach(item => {
  listBox.insertAdjacentHTML('beforeend', `
    <div class="box" onclick="applyMusic(${allMusic.indexOf(item)})">
      <div class="list-img">
        <img src="images/${item.img}" alt="">
      </div>
      <div class="music-info">
        <p class="music-title">${item.name}</p>
        <p class="music-name">${item.artist}</p>
      </div>
    </div>
  `);
});


function applyMusic(indexNumb) {
  musicIndex = indexNumb;
  loadMusic(musicIndex);
  playSong();
  musicWrapper.classList.remove('close')
}

closeBtn.addEventListener('click' ,()=>{
    musicWrapper.classList.toggle('close')
})

moreMusicItem.addEventListener('click' , ()=>{
  musicWrapper.classList.toggle('close')
})

repeatBtn.addEventListener('click', toggleRepeat);

backwardBtn.addEventListener('click', prevSong);
forwardBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateTimes);
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('ended', playNext);
