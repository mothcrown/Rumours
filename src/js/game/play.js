/* global Phaser */
/* eslint object-shorthand: ["error", "never"] */
/* eslint no-param-reassign: [2, { "props": false }] */
/* eslint no-use-before-define: ["error", { "functions": false }] */

// Imports
import $ from 'jquery'
import images from './images'
import titles from './names/titles'
import femaleNames from './names/female'
import maleNames from './names/male'
import surnames from './names/surnames'
import './../phaser.min'

// "Consts"
let player
let rivals
let guests
let cursors
let keys
let timer

// Number of generated guests & rivals
const guestNumber = 15
const rivalNumber = 1

const playerVelocity = 150
const guestVelocity = 75
const rivalVelocity = 125

/**
 * Pretty much creates the player. It does that. What else do you need?
 * @param {*} playState
 */
function createPlayer(playState) {
  player = playState.game.add.sprite(320, 400, 'player')
  player.anchor.set(0.5, 0.5)
  playState.game.physics.enable(player, Phaser.Physics.ARCADE)
  player.enableBody = true
  player.body.collideWorldBounds = true

  // A bright new beginning!
  player.scandal = 0

  // Random background generation
  player.gender = 'male'
  const nameRoll = Math.floor((Math.random() * 15) + 1)
  const surnameRoll = Math.floor((Math.random() * 30) + 1)

  player.title = (player.gender === 'female') ? titles[0].female : titles[0].male
  player.name = (player.gender === 'female') ? femaleNames[nameRoll] : maleNames[nameRoll]
  player.surname = surnames[surnameRoll]

  player.animations.add('walksouth', [0], 30, true)
  player.animations.add('walknorth', [1], 30, true)
  player.animations.add('walkwest', [2], 30, true)
  player.animations.add('walkeast', [3], 30, true)
}

/**
 * Player movement:
 * I'm sure there is a nicer, far more elegant way to do this. Oh well!
 *
 * ¯\_(ツ)_/¯
 */
function playerAction(playState) {
  player.body.velocity.x = 0
  player.body.velocity.y = 0
  player.sendToBack()
  if (cursors.left.isDown) {
    player.body.velocity.x = playerVelocity * -1
    player.animations.play('walkwest')
  } else if (cursors.right.isDown) {
    player.body.velocity.x = playerVelocity
    player.animations.play('walkeast')
  } else if (cursors.up.isDown) {
    player.body.velocity.y = playerVelocity * -1
    player.animations.play('walknorth')
  } else if (cursors.down.isDown) {
    player.body.velocity.y = playerVelocity
    player.animations.play('walksouth')
  }
}

const getVelocity = id => ({
  guest: guestVelocity,
  rival: rivalVelocity
})[id]

/**
 * Quite like playerMovement only slower, because they are way cooler
 * than you and they know it.
 * @param {*} game
 */
function npcMovement(game, group) {
  group.forEach((npc) => {
    const npc1 = npc
    npc1.body.velocity.y = 0
    npc1.body.velocity.x = 0
    const roll = Math.floor((Math.random() * 10) + 1)
    switch (roll) {
      // South
      case 1:
        npc1.body.velocity.y = getVelocity(npc1.key.substring(0, 5))
        npc1.animations.play('walksouth')
        break
      // Left
      case 2:
        npc1.body.velocity.x = getVelocity(npc1.key.substring(0, 5)) * -1
        npc1.animations.play('walkwest')
        break
      // Up
      case 3:
        npc1.body.velocity.y = getVelocity(npc1.key.substring(0, 5)) * -1
        npc1.animations.play('walknorth')
        break
      // Right
      case 4:
        npc1.body.velocity.x = getVelocity(npc1.key.substring(0, 5))
        npc1.animations.play('walkeast')
        break
      default:
        break
    }
  })
  timer = game.time.now
}

/**
 * What kind of party has no guests? Certainly not one I'd bother to go, I say!
 * @param {*} playState
 */
function generateGuests(playState) {
  for (let i = 0; i < guestNumber; i += 1) {
    const guest = guests.create(playState.game.world.randomX, playState.game.world.randomY, 'guestmale1')
    guest.anchor.set(0.5, 0.5)
    guest.body.collideWorldBounds = true
    guest.allowGravity = false
    guest.animations.add('walksouth', [0], 30, true)
    guest.animations.add('walknorth', [1], 30, true)
    guest.animations.add('walkwest', [2], 30, true)
    guest.animations.add('walkeast', [3], 30, true)
  }
}

/**
 * Setting up stuff for the guests group. It may work. It may not.
 * @param {*} playState
 */
function createGuests(playState) {
  guests = playState.game.add.group()
  guests.physicsBodyType = Phaser.Physics.ARCADE
  guests.enableBody = true
  guests.setAll('body.mass', 'body', 1)
  generateGuests(playState)
}

function generateRivals(playState) {
  for (let i = 0; i < rivalNumber; i += 1) {
    const rival = rivals.create(playState.game.world.randomX, playState.game.world.randomY, 'rivalmale1')
    rival.anchor.set(0.5, 0.5)
    rival.body.collideWorldBounds = true
    rival.allowGravity = false

    rival.gender = 'male'
    const titleRoll = Math.floor(Math.random() * 3)
    const nameRoll = Math.floor((Math.random() * 15) + 1)
    const surnameRoll = Math.floor((Math.random() * 30) + 1)

    rival.title = (rival.gender === 'female') ? titles[titleRoll].female : titles[titleRoll].male
    rival.name = (rival.gender === 'female') ? femaleNames[nameRoll] : maleNames[nameRoll]
    rival.surname = surnames[surnameRoll]

    rival.animations.add('walksouth', [0], 30, true)
    rival.animations.add('walknorth', [1], 30, true)
    rival.animations.add('walkwest', [2], 30, true)
    rival.animations.add('walkeast', [3], 30, true)
  }
}

function createRivals(playState) {
  rivals = playState.game.add.group()
  rivals.physicsBodyType = Phaser.Physics.ARCADE
  rivals.enableBody = true
  rivals.setAll('body.mass', 'body', 1)
  generateRivals(playState)
}

/**
 * "Excuse me, madam!"
 * @param {*} sprite1
 * @param {*} sprite2
 */
function bumpIntoPeople(sprite1, sprite2) {
  if (sprite1.body.touching.up) {
    sprite1.body.velocity.y = 0
    sprite2.body.velocity.y = 0
  } else if (sprite1.body.touching.down) {
    sprite1.body.velocity.y = 0
    sprite2.body.velocity.y = 0
  } else if (sprite1.body.touching.left) {
    sprite1.body.velocity.x = 0
    sprite2.body.velocity.x = 0
  } else if (sprite1.body.touching.right) {
    sprite1.body.velocity.x = 0
    sprite2.body.velocity.x = 0
  }
}

function createKeys(playState) {
  keys = {
    interact: playState.input.keyboard.addKey(Phaser.Keyboard.A),
    pause: playState.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
  }
}

function readyAuxWindow() {
  $(document).off()
  $('#auxWindow').empty()
  $('#auxWindow').css('display', 'inline-block')
}

function showCharacterSheet(playState) {
  readyAuxWindow(playState)
  const quote = '"A young new face in the court..."'
  $(`<p>TITLE: ${player.title}</p>`).appendTo('#auxWindow')
  $(`<p>NAME: ${player.name} ${player.surname}</p><br />`).appendTo('#auxWindow')
  $(`<p>${quote}</p><br />`).appendTo('#auxWindow')
  $(`<p>SCANDAL: ${player.scandal}</p>`).appendTo('#auxWindow')
  $(document).keydown((event) => {
    if (event.which === 32 || event.keyCode === 32) {
      $('#auxWindow').css('display', 'none')
      menuSelection(playState, 1)
    }
  })
}

function unpauseGame(playState) {
  $('#pauseCurtain').css('display', 'none')
  $('#pauseMenu').css('display', 'none')
  playState.game.paused = false
  pauseEvent(playState)
}

function innerSelection(playState, option) {
  $('#pauseCurtain').css('display', 'none')
  $('#pauseMenu').css('display', 'none')
  $('#auxWindow').css('display', 'none')
  playState.game.paused = false
  $(document).off()
  if (option === 'restart') {
    playState.game.state.restart()
  } else {
    window.location = 'https://github.com/mothcrown'
  }
}

function confirmDialog(playState, option) {
  readyAuxWindow(playState)
  const message = (option === 'restart') ? 'start a new game' : 'quite the game'
  $(`<br /><br /><p>Are you sure you want to ${message}?</p>`).appendTo('#auxWindow')
  $('<a href="" id="innerno"><span id="inner0" class="innerSelector"></span><span class="innerOption">No</span></a>').appendTo('#auxWindow')
  $('<a href="" id="inneryes"><span id="inner1" class="innerSelector"></span><span class="innerOption">Yes</span></a>').appendTo('#auxWindow')

  $('.innerSelector').empty()

  const options = [
    'inner0', 'inner1'
  ]

  let counter = 0
  $(`#${options[counter]}`).text('\u25B6')

  $(document).keydown((event) => {
    if ((event.which === 37 || event.keyCode === 37) && counter !== 0) {
      $('.innerSelector').empty()
      counter -= 1
      $(`#${options[counter]}`).text('\u25B6')
    }
    if ((event.which === 39 || event.keyCode === 39) && counter !== 1) {
      $('.innerSelector').empty()
      counter += 1
      $(`#${options[counter]}`).text('\u25B6')
    }
    if (event.which === 32 || event.keyCode === 32) {
      switch (counter) {
        case 0:
          $('#auxWindow').css('display', 'none')
          menuSelection(playState, ((option === 'restart') ? 2 : 3))
          break
        case 1:
          innerSelection(playState, option)
          break
        default:
          break
      }
    }
  })
}

function menuSelection(playState, option) {
  $(document).off()
  $('.selector').empty()

  const options = [
    'selector0', 'selector1', 'selector2', 'selector3'
  ]

  let counter = option
  $(`#${options[counter]}`).text('\u25B6')

  $(document).keydown((event) => {
    if ((event.which === 38 || event.keyCode === 38) && counter !== 0) {
      $('.selector').empty()
      counter -= 1
      $(`#${options[counter]}`).text('\u25B6')
    }
    if ((event.which === 40 || event.keyCode === 40) && counter !== 3) {
      $('.selector').empty()
      counter += 1
      $(`#${options[counter]}`).text('\u25B6')
    }
    if (event.which === 32 || event.keyCode === 32) {
      switch (counter) {
        case 0:
          unpauseGame(playState)
          break
        case 1:
          showCharacterSheet(playState)
          break
        case 2:
          confirmDialog(playState, 'restart')
          break
        case 3:
          confirmDialog(playState, 'quit')
          break
        default:
          break
      }
    }
  })
}

function pauseEvent(playState) {
  $(document).off()
  $(document).keydown((event) => {
    if (event.which === 32 || event.keyCode === 32) {
      playState.game.paused = true
      $('<div id="pauseCurtain"></div>').prependTo('#rumours')
      $('#pauseMenu').css('display', 'flex')
      menuSelection(playState, 0)
    }
  })
}

/**
 * Playing stage. May have whispers and scandal.
 */
const playState = {
  preload: function () {
    this.game.load.spritesheet('player', images.lib.player, 44, 104)
    this.game.load.spritesheet('guestmale1', images.lib.guestmale1, 44, 104)
    this.game.load.spritesheet('rivalmale1', images.lib.rivalmale1, 44, 104)
  },
  create: function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    createGuests(playState)
    createRivals(playState)
    createPlayer(playState)
    cursors = this.game.input.keyboard.createCursorKeys()
    createKeys(playState)
    this.game.stage.backgroundColor = '#400000'
    pauseEvent(playState)
    timer = this.game.time.now
  },
  update: function () {
    playerAction(playState)
    // NPCs move around every second or so. Mostly.
    if (this.game.time.now - timer > 1000) {
      npcMovement(playState, rivals)
      npcMovement(playState, guests)
    }
    this.game.physics.arcade.collide(player, guests, bumpIntoPeople, null, this)
    this.game.physics.arcade.collide(player, rivals, bumpIntoPeople, null, this)
    this.game.physics.arcade.collide(guests, guests, bumpIntoPeople, null, this)
    this.game.physics.arcade.collide(rivals, guests, bumpIntoPeople, null, this)
    this.game.physics.arcade.collide(rivals, rivals, bumpIntoPeople, null, this)
  }
}

export default playState
