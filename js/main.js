window.addEventListener('load', init);

// Globals
let flag=true;

// Available Levels
const levels = {
  easy: 7,
  medium: 5,
  hard: 3
};

// To change level
const currentLevel = levels.easy;
let timer;
let time = currentLevel;
let score = 0;
let isPlaying;

// DOM Elements
const wordInput = document.querySelector('#word-input');
const currentWord = document.querySelector('#current-word');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const message = document.querySelector('#message');
const seconds = document.querySelector('#seconds');
const highscoreDisplay = document.querySelector('#highscore');


// Initialize Game
function init() {
  // Show number of seconds in UI
  seconds.innerHTML = currentLevel;
  // Load word from array
  showWord();
  // Start matching on word input
  wordInput.addEventListener('input', startMatch);
  // Call countdown every second
  setInterval(countdown, 1000);
  // Check game status
  timer=setInterval(checkStatus, 4000);
}

// Start match
function startMatch() {
  if (matchWords()) {
    isPlaying = true;
    time = currentLevel + 1;
    showWord();
    wordInput.value = '';
    score++;
  }
  
  // Highscore based on score value for Session Storage
  if (typeof sessionStorage['highscore'] === 'undefined' || score > sessionStorage['highscore']) {
    sessionStorage['highscore'] = score;
  } else {
    sessionStorage['highscore'] = sessionStorage['highscore'];
  }

  // Prevent display of High Score: -1
  if (sessionStorage['highscore'] >= 0) {
  highscoreDisplay.innerHTML = sessionStorage['highscore'];
  }

  // If score is -1, display 0
  if (score === -1) {
    scoreDisplay.innerHTML = 0;
  } else {
    scoreDisplay.innerHTML = score;
  }
}

// Match currentWord to wordInput
function matchWords() {
  if(message=='Game Over!!!'){
      message='';
  }
  if (wordInput.value === currentWord.innerHTML)   {
    message.innerHTML = 'Correct!!!';
    return true;
  } else {
    message.innerHTML = '';
    return false;
  }
}

// Pick & show random word
function showWord() {
  // Call an API to get random words
  fetch('https://random-words-api-three.vercel.app/word', {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    }).then(data => data.json()).then((data)=>{
      let word=data[0].word;
      if(word.length>12){//truncating word 
        word=word.substr(0,12);
      }
      for(let i=0;i<word.length;i++){//omitting special characters from word
        if((/[a-zA-Z]/).test(word.charAt(i))===false){
         // console.log(word);
          word="Hello";
          break;
        }
      }
      currentWord.innerHTML = word;
    })
  // Output random word
}

// Countdown timer
function countdown() {
  // Make sure time is not run out
  if (time > 0) {
    // Decrement
    time--;
  } else if (time === 0) {
    // Game is over
    isPlaying = false;
  }
  // Show time
  timeDisplay.innerHTML = time;
}

// Check game status
function checkStatus() {
  if (!isPlaying && time === 0) {
    message.innerHTML = 'Game Over!!!';
    score = -1;
    loaddn();
  }
}
function loaddn(){
  if(flag==true){
    if (confirm('Game Over! Do you want to start again?')) {//if user wants to continue
      clearInterval(timer);
      window.location.href=window.location.href
    } else {
      //if user wants to end game
      flag=false;
      wordInput.disabled=true;
      wordInput.placeholder="Reload to play again!";
    }
  }
}
