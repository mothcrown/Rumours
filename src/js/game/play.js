/* global Phaser */

import images from './images'
import { player, cursors } from './core'
import './../phaser.min'

const playState = {
  preload: () => {
    this.game.load.spritesheet('player', images.path.player, 32, 32)
  },
  create: () => {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    player = this.game.add.sprite(400, 380, 'player')
    player.anchor.setTo(0.5, 0.5)
    this.game.physics.enable(player, Phaser.Physics.ARCADE)

    player.animations.add('walksouth', [1], 30, true)
    player.animations.add('walknorth', [2], 30, true)
    player.animations.add('walkwest', [3], 30, true)
    player.animations.add('walkeast', [4], 30, true)

    cursors = this.game.input.keyboard.createCursorKeys()
    this.game.stage.backgroundColor = '#400000'
  },
  update: () => {
    if (cursors.left.isDown) {
      player.body.velocity.x = -200
      player.animations.play('walkwest')
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 200
      player.animations.play('walkeast')
    } else if (cursors.up.isDown) {
      player.body.velocity.y = -200
      player.animations.play('walknorth')
    } else if (cursors.up.isDown) {
      player.body.velocity.y = -200
      player.animations.play('walksouth')
    }
  }
}

export default playState
