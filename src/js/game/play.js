/* global Phaser */
/* eslint object-shorthand: ["error", "never"] */

import images from './images'
import './../phaser.min'

let player
let cursors

function createPlayer(playState) {
  player = playState.game.add.sprite(100, 100, 'player')
  
  player.anchor.set(0.5, 0.5)
  
  playState.game.physics.enable(player, Phaser.Physics.ARCADE)
  player.enableBody = true
  player.body.collideWorldBounds = true

  player.animations.add('walksouth', [0], 30, true)
  player.animations.add('walknorth', [1], 30, true)
  player.animations.add('walkwest', [2], 30, true)
  player.animations.add('walkeast', [3], 30, true)
}

const playState = {
  preload: function () {
    this.game.load.spritesheet('player', images.lib.player, 44, 104)
  },
  create: function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    createPlayer(playState)
    cursors = this.game.input.keyboard.createCursorKeys()
    this.game.stage.backgroundColor = '#400000'
  },
  update: function () {
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
}

export default playState
