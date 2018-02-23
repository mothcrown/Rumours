/* global Phaser */
/* eslint object-shorthand: ["error", "never"] */
/* eslint no-param-reassign: [2, { "props": false }] */
/* eslint no-use-before-define: ["error", { "functions": false }] */

// Imports
import $ from 'jquery'
import avatars from './images/avatars'

let hiscores = require('./../../json/hiscores.json')

let game

function startGame() {
  const player = {}
  player.name = $('#userName').val()
  player.avatar = $('#avatarList').val()

  localStorage.player = JSON.stringify(player)

  $('#dialogWindow').empty()
  $('#dialogWindow').css('display', 'none')
  $('.title').remove()
  $('.subtitle').remove()
  $('.copyright').remove()

  game.state.start('play')
}

function registerUser() {
  $(document).off()
  $('#dialogWindow').empty()

  $('<p style="display: inline-block; margin-right: 1em">Insert your name (3 letter max!):</p>').appendTo('#dialogWindow')
  $('<input type="text" id="userName" maxlength="3" style="width: 10%" pattern="[A-Z]{3}"><br/>').appendTo('#dialogWindow')
  $('<p style="display: inline-block; margin-top: 0; margin-right: 1em">Select your portrait:</p>').appendTo('#dialogWindow')
  $('<select id="avatarList"></select>').appendTo('#dialogWindow')
  $('<option value="0">-- Choose portrait --</option>').appendTo('#avatarList')
  
  Object.keys(avatars.lib).map((avatar) => {
    $(`<option value="${avatar}">Portrait ${avatar}</option>`).appendTo('#avatarList')
  })

  $('#avatarList').change(() => {
    $('#portrait').remove()
    const portrait = $('#avatarList').val()
    $(`<img id="portrait" src="${avatars.lib[portrait]}">`).insertAfter('#avatarList')
  })

  $('<a href="" class="registerMenu" id="registerStart"><span id="registerMenu0" class="registerSelector"></span><span class="registerOption">Start</span></a>').appendTo('#dialogWindow')

  $('#registerMenu0').text('\u25B6')
  
  $(document).keydown((event) => {
    if (event.which === 32 || event.keyCode === 32) {
      startGame()
    }
  })
}

function selectDifficulty() {
  $('.diffSelector').empty()

  const options = [
    'diffMenu0', 'diffMenu1', 'diffMenu2'
  ]

  let counter = 0
  $(`#${options[counter]}`).text('\u25B6')

  $(document).keydown((event) => {
    if ((event.which === 38 || event.keyCode === 38) && counter !== 0) {
      $('.diffSelector').empty()
      counter -= 1
      $(`#${options[counter]}`).text('\u25B6')
    }
    if ((event.which === 40 || event.keyCode === 40) && counter !== 2) {
      $('.diffSelector').empty()
      counter += 1
      $(`#${options[counter]}`).text('\u25B6')
    }
    if (event.which === 32 || event.keyCode === 32) {
      switch (counter) {
        case 0:
          localStorage.difficulty = 1
          break
        case 1:
          localStorage.difficulty = 2
          break
        case 2:
          localStorage.difficulty = 3
          break
        default:
          break
      }
      registerUser()
    }
  })
}

function newGame() {
  $(document).off()
  $('#dialogWindow').empty()

  $('<p>Choose your difficulty:</p>').appendTo('#dialogWindow')
  $('<a href="" class="diffMenu" id="easy"><span id="diffMenu0" class="diffSelector"></span><span class="diffOption">Easy</span></a>').appendTo('#dialogWindow')
  $('<a href="" class="diffMenu" id="normal"><span id="diffMenu1" class="diffSelector"></span><span class="diffOption">Normal</span></a>').appendTo('#dialogWindow')
  $('<a href="" class="diffMenu" id="hard"><span id="diffMenu2" class="diffSelector"></span><span class="diffOption">Hard</span></a>').appendTo('#dialogWindow')
  selectDifficulty()
}

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
