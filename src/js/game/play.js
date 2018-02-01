/* global Phaser */
/* eslint object-shorthand: ["error", "never"] */

import images from './images'
import './../phaser.min'

let player
let guests
let cursors
let timer

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

function generateGuests(playState) {
  for (let i = 0; i < 15; i += 1) {
    const guest = guests.create(playState.game.world.randomX, playState.game.world.randomY, 'guestmale1')
    guest.anchor.set(0.5, 0.5)
    guest.body.collideWorldBounds = true
    guest.body.inmmovable = true
    guest.animations.add('walksouth', [0], 30, true)
    guest.animations.add('walknorth', [1], 30, true)
    guest.animations.add('walkwest', [2], 30, true)
    guest.animations.add('walkeast', [3], 30, true)
  }
}

function createGuests(playState) {
  guests = playState.game.add.group()
  guests.physicsBodyType = Phaser.Physics.ARCADE
  guests.enableBody = true
  generateGuests(playState)
}

/*
function blockMoving(char) {
  const sprite = char
  if (sprite.body.touching.up) {
    sprite.body.velocity.y = 75
  } else if (sprite.body.touching.down) {
    sprite.body.velocity.y = -75
  } else if (sprite.body.touching.left) {
    sprite.body.velocity.x = 75
  } else if (sprite.body.touching.right) {
    sprite.body.velocity.x = -75
  }
}
*/

function getPerspective(y) {
  const z = y
  return z
}

function blockGuest(npc) {
  if (npc.body.touching.up) {
    npc.body.velocity.y = 0
  } else if (npc.body.touching.down) {
    npc.body.velocity.y = 0
  } else if (npc.body.touching.left) {
    npc.body.velocity.x = 0
  } else if (npc.body.touching.right) {
    npc.body.velocity.x = 0
  }
}

function bumpBetweenGuests(sprite1, sprite2) {
  if (sprite1.body.y < sprite2.body.y) {
    sprite1.moveDown()
    sprite2.moveUp()
  } else if (sprite1.body.y > sprite2.body.y) {
    sprite1.moveUp()
    sprite2.moveDown()
  }
  /*
  } else {
    blockGuest(sprite1)
  */
}

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
    if (this.game.time.now - timer > 1000) {
      guestsMovement(playState)
    }
    // this.game.physics.arcade.overlap(player, guests, bumpIntoPeople, null, this)
    this.game.physics.arcade.overlap(guests, guests, bumpBetweenGuests, null, this)
  }
  /*
  ,
  render: function(){
    guests.forEachAlive(function(item){
      playState.game.debug.body(item)
    })
  }
  */
}

export default playState
