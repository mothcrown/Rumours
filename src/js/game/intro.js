/* global Phaser */
/* eslint object-shorthand: ["error", "never"] */
/* eslint no-param-reassign: [2, { "props": false }] */
/* eslint no-use-before-define: ["error", { "functions": false }] */

// Imports
import $ from 'jquery'
import avatars from './images/avatars'

let hiscores = require('./../../json/hiscores.json')

let game

function loadScores() {
  if (Storage !== void(0)) {
    if (localStorage.hiscores !== undefined) {
      hiscores = JSON.parse(localStorage.hiscores)
    } else {
      localStorage.hiscores = JSON.stringify(hiscores)
    }
  }
}

function renderScores() {
  hiscores.hiscores.map((score) => {
    $(`<p><img src="${avatars.lib[score.avatar]}" style="display: inline-block">  ${score.name}................... Scandal: ${score.scandal}</p>`).appendTo('#statusWindow')
  })
}

function hiScores() {
  $(document).off()
  $('#dialogWindow').empty()
  $('#dialogWindow').css('display', 'none')
  $('#statusWindow').empty()
  $('#statusWindow').css('display', 'block')
  $('<h2 style="margin-left: 30%">HI-SCORES</h2>').appendTo('#statusWindow')
  loadScores()
  renderScores()
  $('<a href="" id="back" style="margin-left: 75%"><span id="scoresDialog0" class="scoresSelector"></span><span class="scoresOption">Back</span></a>').appendTo('#statusWindow')
  $('#scoresDialog0').text('\u25B6')
  
  $(document).keydown((event) => {
    if (event.which === 32 || event.keyCode === 32) {
      openMenu()
    }
  })
}

function introMenuSelector() {
  $('.introSelector').empty()

  const options = [
    'introMenu0', 'introMenu1', 'introMenu2'
  ]

  let counter = 0
  $(`#${options[counter]}`).text('\u25B6')

  $(document).keydown((event) => {
    if ((event.which === 38 || event.keyCode === 38) && counter !== 0) {
      $('.introSelector').empty()
      counter -= 1
      $(`#${options[counter]}`).text('\u25B6')
    }
    if ((event.which === 40 || event.keyCode === 40) && counter !== 2) {
      $('.introSelector').empty()
      counter += 1
      $(`#${options[counter]}`).text('\u25B6')
    }
    if (event.which === 32 || event.keyCode === 32) {
      switch (counter) {
        case 0:
          newGame()
          break
        case 1:
          hiScores()
          break
        case 2:
          window.location = 'https://github.com/mothcrown'
          break
        default:
          break
      }
    }
  })
}

function openMenu() {
  $('#statusWindow').empty()
  $('#statusWindow').css('display', 'none')

  $('#pauseCurtain').css('display', 'block')
  $('#dialogWindow').empty()
  $('#dialogWindow').css('display', 'block')

  $('<a href="" class="introMenu" id="newgame"><span id="introMenu0" class="introSelector"></span><span class="introOption">New Game</span></a>').appendTo('#dialogWindow')
  $('<a href="" class="introMenu" id="scores"><span id="introMenu1" class="introSelector"></span><span class="introOption">Hi-Scores</span></a>').appendTo('#dialogWindow')
  $('<a href="" class="introMenu" id="quit"><span id="introMenu2" class="introSelector"></span><span class="introOption">Quit</span></a>').appendTo('#dialogWindow')
  introMenuSelector()
}

function showTitle() {
  $('<h1 class="title">Rumours</h1>').appendTo('#rumours')
  $('<h2 class="subtitle">A game of whispers and scandal</h2>').appendTo('#rumours')
  $('<h2 class="subtitle">A game of whispers and scandal</h2>').appendTo('#rumours')
  $('<p class="copyright">MOTHCROWN 1988(C)</p>').appendTo('#rumours')
}

const introState = {
  preload: function () {
    game = this.game
    $(document).off()
  },
  create: function () {
    showTitle()
    openMenu()
    game.stage.backgroundColor = '#400000'
  },
  update: function () {

  }
}

export default introState
