/* global Phaser */

import $ from 'jquery'
import './phaser.min'
import playState from './game/play'

$(document).ready(() => {
  const game = new Phaser.Game(640, 480, Phaser.CANVAS, 'rumours') // , { preload, create, update })
  game.state.add('play', playState)
  game.state.start('play')
})
