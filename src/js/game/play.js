/* global Phaser */
/* eslint object-shorthand: ["error", "never"] */
/* eslint no-param-reassign: [2, { "props": false }] */
/* eslint no-use-before-define: ["error", { "functions": false }] */

// Imports
import $ from 'jquery'
import sprites from './images/sprites'
import titles from './names/titles'
import femaleNames from './names/female'
import maleNames from './names/male'
import surnames from './names/surnames'
import './../phaser.min'

// "Consts"
let game
let player
let rivals
let guests
let cursors
let keys
let waltz
let waltzEvent
let timer
let scandalString
let scandalScore
let scandalText
let waltzString
let waltzClock
let waltzText

// Number of generated guests & rivals
const guestNumber = 15
const rivalNumber = (localStorage.difficulty !== undefined) ? +localStorage.difficulty : 2

const playerVelocity = 150
const guestVelocity = 75
const rivalVelocity = 125

// Our list of rumours
const rumourList = [
  'reads those obscene French literates',
  'has a liason with the Countess',
  'has sympathies for the Magyar nationalists',
  'has a secret son in London',
  'has lost his fortune and filed for bankrupcy'
]

/**
 * Pretty much creates the player. It does that. What else do you need?
 * @param {*} playState
 */
function createPlayer() {
  player = game.add.sprite(320, 400, 'player')
  player.anchor.set(0.5, 0.5)
  game.physics.enable(player, Phaser.Physics.ARCADE)
  player.enableBody = true
  player.body.collideWorldBounds = true

  // Random background generation
  player.gender = 'male'
  const nameRoll = Math.floor(Math.random() * 15)
  const surnameRoll = Math.floor(Math.random() * 30)

  player.title = (player.gender === 'female') ? titles[0].female : titles[0].male
  player.name = (player.gender === 'female') ? femaleNames[nameRoll] : maleNames[nameRoll]
  player.surname = surnames[surnameRoll]

  // A past sin you can't correct...
  const secretRoll = Math.floor(Math.random() * 5)
  player.secret = rumourList[secretRoll]

  // ... and a bright new beginning
  player.scandal = 0

  player.animations.add('walksouth', [0], 30, true)
  player.animations.add('walknorth', [1], 30, true)
  player.animations.add('walkwest', [2], 30, true)
  player.animations.add('walkeast', [3], 30, true)
}

/**
 * More civil discourse, of course.
 * @param {*} npc 
 * @param {*} success 
 */
function gossipExchange(npc, success) {
  $(document).off()
  $('#dialogWindow').empty()
  $('#dialogWindow').css('display', 'block')
  $('#dialogWindow').css('height', '30%')
  let message
  if (success) {
    message = 'Oh my! What a delicious piece of gossip...!'
    player.scandal += 1
    scandalText.text = scandalString + player.scandal
  } else {
    message = `That sounds quite interesting, but haven't you heard perchance that the ${npc.rumour.target.title} ${npc.rumour.target.surname} ${rumourList[npc.rumour.scandal - 1]}?`
    // This is a really fun touch. Love it. I should be doing more core stuff, tho
    if (npc.rumour.scandal > 3) {
      message += ' Scandalous!'
    }
  }

  $(`<p>"${message}"</p>`).appendTo('#dialogWindow')
  $('<a href="" id="leave"><span id="rumourDialog0" class="throwSelector"></span><span class="rumourOption">Leave</span></a>').appendTo('#dialogWindow')
  $('#rumourDialog0').text('\u25B6')
  
  $(document).keydown((event) => {
    if (event.which === 32 || event.keyCode === 32) {
      unpauseGame()
    }
  })
}

/**
 * "Let me tell you a little secret..."
 */
function expandRumour(protagonist, npc, enemy) {
  $('#dialogWindow').css('display', 'block')
  // input[type="radio"][name="rumour"]:checked
  // WHY U NO WORK >:(
  //
  // Nevermind I'm a retard
  const options = $('input[name="rumour"]')

  let scandalPoints
  Object.values(options).map((radio) => {
    if (radio.checked) {
      scandalPoints = radio.value
    }
  })

  const rumour = {
    origin: protagonist,
    target: enemy,
    scandal: +scandalPoints
  }

  if (npc.rumour !== undefined) {
    if (npc.rumour.scandal > rumour.scandal) {
      gossipExchange(npc, false)
    } else {
      npc.rumour = rumour
      gossipExchange(npc, true)
    }
  } else {
    npc.rumour = rumour
    gossipExchange(npc, true)
  }
}

/**
 * As if you needed to find more!
 * @param {*} fullName 
 */
function findRival(fullName) {
  let enemy
  rivals.forEach((rival) => {
    const nFullName = `${rival.name} ${rival.surname}`
    if (fullName === nFullName) {
      enemy = rival
    }
  })
  return enemy
}

/**
 * Simple and fun
 * @param {*} rival 
 */
function showRumourChoices(rival) {
  $('#rumourChoices').empty()
  const numChoices = rumourList.length
  for (let i = 0; i < numChoices; i += 1) {
    const scandal = i + 1
    $(`<input type="radio" id="rumour${scandal}" name="rumour" value="${scandal}"><label for="rumour${scandal}">The ${rival.title} ${rival.surname} ${rumourList[i]}</label><br />`).appendTo('#rumourChoices')
  }
}

/**
 * This needs refactoring. Like, right now.
 * NOPE FORGET IT KEEP GOING
 *
 * @param {*} protagonist
 * @param {*} npc
 */
function rumourMenu(protagonist, npc) {
  $(document).off()
  $('#dialogWindow').empty()
  $('#dialogWindow').css('display', 'block')
  $('#dialogWindow').css('height', '50%')
  $('<select id="rivalsList"></select>').appendTo('#dialogWindow')

  let enemy
  $('#rivalsList').change(() => {
    enemy = findRival($('#rivalsList').val())
    showRumourChoices(enemy)
  })
  rivals.forEach((rival) => {
    $(`<option value="${rival.name} ${rival.surname}">${rival.title} ${rival.surname}</option>`).appendTo('#rivalsList')
  })
  $('<div id="rumourChoices"></div>').appendTo('#dialogWindow')

  // This smells
  enemy = findRival($('#rivalsList').val())
  showRumourChoices(enemy)

  $('<div id="rumourMenuChoices"></div>').appendTo('#dialogWindow')
  $('<a href="" id="leave"><span id="rumourDialog0" class="throwSelector"></span><span class="rumourOption">Leave</span></a>').appendTo('#rumourMenuChoices')
  $('<a href="" id="throw"><span id="rumourDialog1" class="throwSelector"></span><span class="rumourOption">Throw</span></a>').appendTo('#rumourMenuChoices')

  $('.throwSelector').empty()

  const options = [
    'rumourDialog0', 'rumourDialog1'
  ]

  const rumours = [
    'rumour1', 'rumour2', 'rumour3', 'rumour4', 'rumour5'
  ]

  // Two sets of movements, two counters. Makes sense!
  let counter = 0
  let rumourCounter = 0
  $(`#${rumours[rumourCounter]}`).prop('checked', true)
  $(`#${options[counter]}`).text('\u25B6')
  /**
   * We can select radio using up and down and then move our selector with left right.
   * Spacebar selects option.
   */
  $(document).keydown((event) => {
    if ((event.which === 37 || event.keyCode === 37) && counter !== 0) {
      $('.throwSelector').empty()
      counter -= 1
      $(`#${options[counter]}`).text('\u25B6')
    }
    if ((event.which === 39 || event.keyCode === 39) && counter !== 1) {
      $('.throwSelector').empty()
      counter += 1
      $(`#${options[counter]}`).text('\u25B6')
    }
    if ((event.which === 38 || event.keyCode === 38) && rumourCounter !== 0) {
      $('input[type="radio"]').prop('checked', false)
      rumourCounter -= 1
      $(`#${rumours[rumourCounter]}`).prop('checked', true)
    }
    if ((event.which === 40 || event.keyCode === 40) && rumourCounter !== 4) {
      $('input[type="radio"]').prop('checked', false)
      rumourCounter += 1
      $(`#${rumours[rumourCounter]}`).prop('checked', true)
    }
    if (event.which === 32 || event.keyCode === 32) {
      event.preventDefault()
      switch (counter) {
        case 0:
          unpauseGame()
          break
        case 1:
          expandRumour(protagonist, npc, enemy)
          break
        default:
          break
      }
    }
  })
}

/**
 * Civil discourse
 */
function guestInteract() {
  $('#dialogWindow').empty()
  $('#pauseCurtain').css('display', 'block')
  $('#dialogWindow').css('display', 'block')
  const title = (player.gender === 'female') ? 'lady' : 'sir'
  $(`<p>"Hmmm. Delighted to make your acquaintance, young ${title}."</p>`).appendTo('#dialogWindow')
  $('<a href="" id="rumour"><span id="rumourMenu0" class="rumourSelector"></span><span class="rumourOption">Throw Rumour</span></a>').appendTo('#dialogWindow')
  $('<a href="" id="leave"><span id="rumourMenu1" class="rumourSelector"></span><span class="rumourOption">Excuse yourself</span></a>').appendTo('#dialogWindow')
}

/**
 * AKA Throw shit around
 * @param {*} protagonist 
 * @param {*} npc 
 */
function throwRumour(protagonist, npc) {
  game.paused = true
  $(document).off()
  guestInteract()

  $('.rumourSelector').empty()

  const options = [
    'rumourMenu0', 'rumourMenu1'
  ]

  let counter = 0
  $(`#${options[counter]}`).text('\u25B6')

  $(document).keydown((event) => {
    if ((event.which === 38 || event.keyCode === 38) && counter !== 0) {
      $('.rumourSelector').empty()
      counter -= 1
      $(`#${options[counter]}`).text('\u25B6')
    }
    if ((event.which === 40 || event.keyCode === 40) && counter !== 1) {
      $('.rumourSelector').empty()
      counter += 1
      $(`#${options[counter]}`).text('\u25B6')
    }
    if (event.which === 32 || event.keyCode === 32) {
      switch (counter) {
        case 0:
          rumourMenu(protagonist, npc)
          break
        case 1:
          unpauseGame()
          break
        default:
          break
      }
    }
  })
}

/**
 * Player movement:
 * I'm sure there is a nicer, far more elegant way to do this. Oh well!
 *
 * ¯\_(ツ)_/¯
 */
function playerAction() {
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

/** This is stupidly cute */
const getVelocity = id => ({
  guest: guestVelocity,
  rival: rivalVelocity
})[id]

/**
 * Quite like playerMovement only slower, because they are way cooler
 * than you and they know it.
 * @param {*} game
 */
function npcMovement(group) {
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
  // This way we check if it's time for our npcs to move again or not
  timer = game.time.now
}

/**
 * What kind of party has no guests? Certainly not one I'd bother to go, I say!
 * @param {*} playState
 */
function generateGuests() {
  for (let i = 0; i < guestNumber; i += 1) {
    const guest = guests.create(game.world.randomX, game.world.randomY, 'guestmale1')
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
function createGuests() {
  guests = game.add.group()
  guests.physicsBodyType = Phaser.Physics.ARCADE
  guests.enableBody = true
  guests.setAll('body.mass', 'body', 1)
  generateGuests()
}

/**
 * Let's create our villains!
 */
function generateRivals() {
  const rivalStyles = ['rivalmale1', 'rivalmale2', 'rivalmale3']

  for (let i = 0; i < rivalNumber; i += 1) {
    const rival = rivals.create(game.world.randomX, game.world.randomY, rivalStyles[i])
    rival.anchor.set(0.5, 0.5)
    rival.body.collideWorldBounds = true
    rival.allowGravity = false

    rival.gender = 'male'
    const titleRoll = Math.floor(Math.random() * 3)
    const nameRoll = Math.floor(Math.random() * 15)
    const surnameRoll = Math.floor(Math.random() * 30)

    rival.title = (rival.gender === 'female') ? titles[titleRoll].female : titles[titleRoll].male
    rival.name = (rival.gender === 'female') ? femaleNames[nameRoll] : maleNames[nameRoll]
    rival.surname = surnames[surnameRoll]

    const secretRoll = Math.floor(Math.random() * 5)
    rival.secret = rumourList[secretRoll]

    rival.scandal = 0

    rival.animations.add('walksouth', [0], 30, true)
    rival.animations.add('walknorth', [1], 30, true)
    rival.animations.add('walkwest', [2], 30, true)
    rival.animations.add('walkeast', [3], 30, true)
  }
}

/**
 * Creates rival group
 */
function createRivals() {
  rivals = game.add.group()
  rivals.physicsBodyType = Phaser.Physics.ARCADE
  rivals.enableBody = true
  rivals.setAll('body.mass', 'body', 1)
  generateRivals()
}

/**
 * "All you hear are whispers."
 * 
 * @param {*} guest1 
 * @param {*} guest2 
 */
function shareRumours(guest1, guest2) {
  if (guest2.rumour !== undefined) {
    if (guest1.rumour.scandal > guest2.rumour.scandal) {
      guest2.rumour = guest1.rumour
    } else if (guest1.rumour.scandal < guest2.rumour.scandal) {
      guest1.rumour = guest2.rumour
    }
  } else {
    guest2.rumour = guest1.rumour
  }
}

/**
 * It needs some IA. I needs some time.
 * 
 * @param {*} enemy 
 * @param {*} npc 
 */
function rivalThrowsRumour(enemy, npc) {
  const playas = ['player', 'rivalmale1', 'rivalmale2', 'rivalmale3']
  const targetList = []

  const totalShit = rivalNumber + 1

  for (let i = 0; i < totalShit; i += 1) {
    if (enemy.key !== playas[i]) {
      targetList.push(playas[i])
    }
  }

  const targetsLength = targetList.length
  const targets = [player]

  for (let i = 0; i < targetsLength; i += 1) {
    rivals.forEach((rival) => {
      if (rival.key === targetList[i]) {
        targets.push(rival)
      }
    })
  }

  // Everybody gets shit here!
  const targetRoll = Math.floor(Math.random() * targetsLength)
  const rumourRoll = Math.floor((Math.random() * 5) + 1)
  const rumour = {
    origin: enemy,
    target: targets[targetRoll],
    scandal: rumourRoll
  }

  if (npc.rumour !== undefined) {
    if (npc.rumour.scandal < rumour.scandal) {
      npc.rumour = rumour
      enemy.scandal += 1
    }
  } else {
    npc.rumour = rumour
    enemy.scandal += 1
  }
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

  // A whole day to figure this out. F*** everything.
  if (sprite1.key === 'player' && sprite2.key.substring(0, 5) === 'guest' && keys.interact.isDown) {
    throwRumour(sprite1, sprite2)
  }

  if (sprite1.key.substring(0, 5) === 'guest' && sprite2.key.substring(0, 5) === 'guest' && sprite1.rumour !== undefined) {
    shareRumours(sprite1, sprite2)
  }

  if (sprite1.key.substring(0, 5) === 'rival' && sprite2.key.substring(0, 5) === 'guest' && sprite1.scandal < 9) {
    rivalThrowsRumour(sprite1, sprite2)
  }
}

function createKeys(playState) {
  keys = {
    interact: playState.input.keyboard.addKey(Phaser.Keyboard.Z),
    pause: playState.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
  }
}

/**
 * Gets auxWindow ready
 */
function readyAuxWindow() {
  $(document).off()
  $('#auxWindow').empty()
  $('#auxWindow').css('display', 'inline-block')
}

/**
 * Character sheet!
 */
function showCharacterSheet() {
  readyAuxWindow()
  const quote = '"A young new face in the court..."'
  const article = (player.gender === 'female') ? 'She' : 'He'
  $(`<p>TITLE: ${player.title}</p>`).appendTo('#auxWindow')
  $(`<p>NAME: ${player.name} ${player.surname}</p>`).appendTo('#auxWindow')
  $(`<p>${quote}</p><br />`).appendTo('#auxWindow')
  $(`<p>SECRET: ${article} ${player.secret}</p>`).appendTo('#auxWindow')
  $(`<p>SCANDAL: ${player.scandal}</p>`).appendTo('#auxWindow')
  $(document).keydown((event) => {
    if (event.which === 32 || event.keyCode === 32) {
      $('#auxWindow').css('display', 'none')
      menuSelection(1)
    }
  })
}

/**
 * It unpauses the game.
 */
function unpauseGame() {
  $('#pauseCurtain').css('display', 'none')
  $('#pauseMenu').css('display', 'none')
  $('#dialogWindow').css('display', 'none')
  game.paused = false
  waltz.resume()
  pauseEvent()
}

/**
 * I'm sure there has to be a way to refactor all this madness! Meanwhile...
 * @param {*} option 
 */
function innerSelection(option) {
  $('#pauseCurtain').css('display', 'none')
  $('#pauseMenu').css('display', 'none')
  $('#auxWindow').css('display', 'none')
  game.paused = false
  $(document).off()
  if (option === 'restart') {
    game.state.restart()
  } else {
    game.state.start('intro')
  }
}

/**
 * Bit more complex than I'd like. Checks whether you want to leave the game or not.
 * @param {*} option 
 */
function confirmWindow(option) {
  readyAuxWindow()
  const message = (option === 'restart') ? 'start a new game' : 'quit the game'
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
          menuSelection(((option === 'restart') ? 2 : 3))
          break
        case 1:
          innerSelection(option)
          break
        default:
          break
      }
    }
  })
}

/**
 * Took me quite a bit. Not bad. Not bad!
 * @param {*} option 
 */
function menuSelection(option) {
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
          unpauseGame()
          break
        case 1:
          showCharacterSheet()
          break
        case 2:
          confirmWindow('restart')
          break
        case 3:
          confirmWindow('quit')
          break
        default:
          break
      }
    }
  })
}

/**
 * It pauses the game. It's a pretty chill function.
 */
function pauseEvent() {
  $(document).off()
  $(document).keydown((event) => {
    if (event.which === 32 || event.keyCode === 32) {
      game.paused = true
      $('#pauseCurtain').css('display', 'block')
      $('#pauseMenu').css('display', 'flex')
      waltz.pause()
      menuSelection(0)
    }
  })
}

function compare(a, b) {
  let value
  if (a.popularity < b.popularity) {
    value = 1
  } else if (a.popularity > b.popularity) {
    value = -1
  } else {
    value = 0
  }
  return value
}

/**
* You deserve a reward!
*/
function addScore() {
  const hiscores = JSON.parse(localStorage.hiscores)
  const user = JSON.parse(localStorage.player)
  hiscores.hiscores.push({
    name: user.name,
    avatar: user.avatar,
    scandal: player.scandal
  })
  localStorage.hiscores = JSON.stringify(hiscores)
}

/**
 * Need more time, need more time!
 * To be shown: most popular rumour, check if true else lose the game
 */
function waltzOver() {
  game.paused = true
  waltz.stop()
  $(document).off()
  $('#statusWindow').empty()
  $('#statusWindow').css('display', 'block')


  $('<p>Most delicious rumours of the dance</p>').appendTo('#statusWindow')
  $('<p>-----------------------------------</p>').appendTo('#statusWindow')

  const specificRumours = []

  guests.forEach((guest) => {
    if (guest.rumour !== undefined) {
      // allRumours.push(guest.rumour)
      const foundRumour = specificRumours.find((rumour) => {
        return rumour === guest.rumour
      })
      if (foundRumour === undefined) {
        specificRumours.push(guest.rumour)
      }
    }
  })

  const popRumoursList = []

  const specRumoursLength = specificRumours.length

  for (let i = 0; i < specRumoursLength; i += 1) {
    const rumour = specificRumours[i]
    let rumourPopularity = 0
    guests.forEach((guest) => {
      if (guest.rumour === rumour) {
        rumourPopularity += 1
      }
    })

    popRumoursList.push({
      rumour: rumour,
      popularity: rumourPopularity
    })
  }

  popRumoursList.sort(compare)
  const auxLength = (popRumoursList.length > 3) ? 3 : popRumoursList.length

  for (let i = 0; i < auxLength; i += 1) {
    const rumour = popRumoursList[i].rumour
    let message
    const auxRumour = +rumour.scandal - 1
    if (rumourList[auxRumour] === rumour.target.secret) {
      message = 'And it\'s true!'
      if (rumour.target.key === 'player') {
        message += ' Your secrets are laid bare for the court to enjoy. The Scandal will haunt you forever.'
      }
      if (rumour.origin.key === 'player') {
        message += ' The Countess smiles at you.'
      }
      rumour.target.scandal += (rumour.scandal * 2)
      scandalText.text = scandalString + player.scandal
    } else {
      message = 'And it\'s not true!'
      if (rumour.origin.key === 'player') {
        message += ' You earn Scandal for gossiping about your betters.'
      }
      rumour.origin.scandal += rumour.scandal
      scandalText.text = scandalString + player.scandal
    }
    $(`<p>The ${rumour.target.title} ${rumour.target.surname} ${rumourList[rumour.scandal - 1]}. ${message}</p>`).appendTo('#statusWindow')
  }

  rivals.forEach((rival) => {
    if (rival.scandal > 10) {
      $(`<p>The ${rival.title} ${rival.surname} leaves the party after embarrassing himself.</p>`).appendTo('#statusWindow')
    }
  })

  if (player.scandal > 10) {
    $('<p style="margin-top: 1em">You became the laughing stock of your peers. You go back to the countryside to never return.</p>').appendTo('#statusWindow')
  } else {
    $('<p style="margin-top: 1em">You survived your first bout with the court. Maybe there is a place for you amongst the sharp tongues and cruel smiles around you...</p>').appendTo('#statusWindow')
    addScore()
  }

  $('<p style="margin-top: 1em">Press spacebar to restart...</p>').appendTo('#statusWindow')
  $(document).keydown((event) => {
    if (event.which === 32 || event.keyCode === 32) {
      game.paused = false
      $('#statusWindow').empty()
      $('#statusWindow').css('display', 'none')
      game.state.start('intro')
    }
  })
}

function formatTime(s) {
  const minutes = `0${Math.floor(s / 60)}`
  const seconds = `0${s - minutes * 60}`
  return `${minutes.substr(-2)}:${seconds.substr(-2)}`
}

/**
 * Simple stuff
 * */
function createUI() {
  scandalString = 'Scandal: '
  scandalScore = player.scandal
  scandalText = game.add.text(450, 440, scandalString + scandalScore, { font: '28px VCR OSD Mono', fill: 'ghostwhite' })
  
  
}

/**
 * Playing stage. May have whispers and scandal.
 */
const playState = {
  preload: function () {
    game = this.game
    game.load.spritesheet('player', sprites.lib.player, 44, 104)
    game.load.spritesheet('guestmale1', sprites.lib.guestmale1, 44, 104)
    game.load.spritesheet('rivalmale1', sprites.lib.rivalmale1, 44, 104)
    game.load.spritesheet('rivalmale2', sprites.lib.rivalmale2, 44, 104)
    game.load.spritesheet('rivalmale3', sprites.lib.rivalmale3, 44, 104)

    $('#pauseCurtain').css('display', 'none')
  },
  create: function () {
    game.physics.startSystem(Phaser.Physics.ARCADE)
    timer = game.time.now
    waltz = game.time.create()
    waltzEvent = waltz.add(Phaser.Timer.MINUTE * 1 + Phaser.Timer.SECOND * 30, waltzOver, this)
    waltz.start()
    waltzText = game.add.text(325, 10, waltzString + waltzClock, { font: '22px VCR OSD Mono', fill: 'ghostwhite' })
    createGuests()
    createRivals()
    createPlayer()
    createUI()
    cursors = game.input.keyboard.createCursorKeys()
    createKeys(playState)
    game.stage.backgroundColor = '#400000'
    pauseEvent()
  },
  update: function () {
    playerAction()
    // NPCs move around every second or so. Mostly.
    if (game.time.now - timer > 1000) {
      npcMovement(rivals)
      npcMovement(guests)
    }
    game.physics.arcade.collide(player, guests, bumpIntoPeople, null, this)
    game.physics.arcade.collide(player, rivals, bumpIntoPeople, null, this)
    game.physics.arcade.collide(guests, guests, bumpIntoPeople, null, this)
    game.physics.arcade.collide(rivals, guests, bumpIntoPeople, null, this)
    game.physics.arcade.collide(rivals, rivals, bumpIntoPeople, null, this)
  },
  render: function () {
    if (waltz.running) {
      waltzString = 'End of the waltz: '
      waltzClock = formatTime(Math.round((waltzEvent.delay - waltz.ms) / 1000))
      waltzText.text = waltzString + waltzClock
      waltzText.bringToTop()
    }
  },
  endTimer: () => {
    waltz.stop()
  },
  formatTime: (sec) => {
    const minutes = '0' + Math.floor(sec / 60)
    const seconds = '0' + (sec - minutes * 60)
    return minutes.substr(-2) + ':' + seconds.substr(-2)
  }
}

export default playState
