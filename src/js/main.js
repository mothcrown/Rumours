/* global Phaser */

import $ from 'jquery'
import './phaser.min'
import playState from './game/play'

/**
 * So it begins.
 */
$(document).ready(() => {
  const game = new Phaser.Game(640, 480, Phaser.CANVAS, 'rumours')
  game.state.add('play', playState)
  game.state.start('play')
})
