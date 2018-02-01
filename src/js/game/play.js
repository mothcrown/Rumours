/* global Phaser */
/* eslint object-shorthand: ["error", "never"] */
/* eslint no-param-reassign: [2, { "props": false }] */

// Imports
import images from './images'
import './../phaser.min'

// "Consts"
let player
let guests
let cursors
let timer

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
function playerMovement() {
  player.body.velocity.x = 0
  player.body.velocity.y = 0
  player.sendToBack()
  if (cursors.left.isDown) {
    player.body.velocity.x = -150
    player.animations.play('walkwest')
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 150
    player.animations.play('walkeast')
  } else if (cursors.up.isDown) {
    player.body.velocity.y = -150
    player.animations.play('walknorth')
  } else if (cursors.down.isDown) {
    player.body.velocity.y = 150
    player.animations.play('walksouth')
  }
}

/**
 * Quite like playerMovement only slower, because they are way cooler
 * than you and they know it.
 * @param {*} game 
 */
function guestsMovement(game) {
  guests.forEach((guest) => {
    const guest1 = guest
    guest1.body.velocity.y = 0
    guest1.body.velocity.x = 0
    const roll = Math.floor((Math.random() * 10) + 1)
    switch (roll) {
      // South
      case 1:
        guest1.body.velocity.y = 75
        guest1.animations.play('walksouth')
        break
      // Left
      case 2:
        guest1.body.velocity.x = -75
        guest1.animations.play('walkwest')
        break
      // Up
      case 3:
        guest1.body.velocity.y = -75
        guest1.animations.play('walknorth')
        break
      // Right
      case 4:
        guest1.body.velocity.x = 75
        guest1.animations.play('walkeast')
        break
      default:
        break
    }
  })
  timer = game.time.now
}

/**
 * What kind of party has no guests? Certainly none I'd bother to go, I say!
 * @param {*} playState 
 */
function generateGuests(playState) {
  for (let i = 0; i < 15; i += 1) {
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

/**
 * Playing stage. May have whispers and scandal.
 */
const playState = {
  preload: function () {
    this.game.load.spritesheet('player', images.lib.player, 44, 104)
    this.game.load.spritesheet('guestmale1', images.lib.guestmale1, 44, 104)
  },
  create: function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    createGuests(playState)
    createPlayer(playState)
    cursors = this.game.input.keyboard.createCursorKeys()
    this.game.stage.backgroundColor = '#400000'
    timer = this.game.time.now
  },
  update: function () {
    playerMovement()
    // Guests move around every second or so. Mostly.
    if (this.game.time.now - timer > 1000) {
      guestsMovement(playState)
    }
    this.game.physics.arcade.collide(player, guests, bumpIntoPeople, null, this)
    this.game.physics.arcade.collide(guests, guests, bumpIntoPeople, null, this)
  }
}

export default playState
