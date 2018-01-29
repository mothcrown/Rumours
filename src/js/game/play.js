/* global Phaser */
/* eslint object-shorthand: ["error", "never"] */

import images from './images'
import './../phaser.min'

let player
let npcs
let cursors

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

function playerMovement() {
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

function generateNPCs() {
  const npc = npcs.create(200, 200, 'guestmale1')
  npc.animations.add('walksouth', [0], 30, true)
  npc.animations.add('walknorth', [1], 30, true)
  npc.animations.add('walkwest', [2], 30, true)
  npc.animations.add('walkeast', [3], 30, true)
}

function createNPCs(playState) {
  npcs = playState.game.add.group()
  npcs.physicsBodyType = Phaser.Physics.ARCADE
  npcs.enableBody = true
  npcs.setAll('anchor.x', 0.5)
  npcs.setAll('anchor.y', 0.5)
  npcs.setAll('checkWorldBounds', true)
  npcs.setAll('body.collideWorldBounds', true)
  npcs.setAll('body.immovable', true)
  npcs.setAll('allowGravity', false)
  generateNPCs()
}

function bumpIntoPeople(player1, npc) {
  if (player1.body.y > npc.body.y + 20) {
    player1.bringToTop()
  }
  if (player1.body.y + 20 < npc.body.y) {
    player1.sendToBack()
  }
}

const playState = {
  preload: function () {
    this.game.load.spritesheet('player', images.lib.player, 44, 104)
    this.game.load.spritesheet('guestmale1', images.lib.guestmale1, 44, 104)
  },
  create: function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    createNPCs(playState)
    createPlayer(playState)
    cursors = this.game.input.keyboard.createCursorKeys()
    this.game.stage.backgroundColor = '#400000'
  },
  update: function () {
    playerMovement()
    this.game.physics.arcade.overlap(player, npcs, bumpIntoPeople, null, this)
  }
}

export default playState
