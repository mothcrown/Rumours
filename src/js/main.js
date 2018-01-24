import $ from 'jquery'
import { Phaser } from 'phaser'
import './images'

const rumours = $('#rumours')
const game = new Phaser.Game(640, 480, Phaser.CANVAS, rumours[0], { preload:preload, create: create, update: update })

let player
let cursors

function preload() {
  game.load.spritesheet('player', playerImgPath, 32, 32)
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE)
  player = game.add.sprite(400, 380, 'player')
  player.anchor.setTo(0.5, 0.5)
  game.physics.enable(player, Phaser.Physics.ARCADE)

  player.animations.add('walksouth', [1], 30, true)
  player.animations.add('walknorth', [2], 30, true)
  player.animations.add('walkwest', [3], 30, true)
  player.animations.add('walkeast', [4], 30, true)

  cursors = game.input.keyboard.createCursorKeys()

  game.stage.backgroundColor = '#400000'
}

function update() {
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
