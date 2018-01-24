/* global Phaser */

import $ from 'jquery'
import './phaser.min'
import images from './images'
// import { player, cursors } from './game/core'
// import playState from './game/play'

let game
let player
let cursors

function update() {
  player.body.velocity.x = 0
  player.body.velocity.y = 0
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

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE)
  player = game.add.sprite(100, 100, 'player')
  player.anchor.setTo(0.5, 0.5)
  game.physics.enable(player, Phaser.Physics.ARCADE)

  player.animations.add('walksouth', [0], 30, true)
  player.animations.add('walknorth', [1], 30, true)
  player.animations.add('walkwest', [2], 30, true)
  player.animations.add('walkeast', [3], 30, true)

  cursors = game.input.keyboard.createCursorKeys()
  game.stage.backgroundColor = '#400000'
}

function preload() {
  game.load.spritesheet('player', images.path.player, 44, 104)
}

$(document).ready(() => {
  game = new Phaser.Game(640, 480, Phaser.CANVAS, 'rumours', { preload, create, update })
  /*
  game.state.add('play', playState)
  game.state.start('play')
  */
})
