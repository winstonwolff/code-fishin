'use strict'

console.debug('loading src/index.js')

import React, { useState, useEffect } from "react"
import ReactDOM from 'react-dom'
import icepick from 'icepick'
import * as storage from './storage.js'
import * as k from './constants.js'
import { X, Y } from './constants.js'
import { Player } from './player.js'
import { KeyTracker, KEYCODES } from './keys.js'

const r = React.createElement

export const main = (stage_elem) => {
  ReactDOM.render(r(Game), stage_elem)
}

const keyTracker = new KeyTracker()

const checkKeys = (player) => {
  if (keyTracker.isPressed(KEYCODES.a) || keyTracker.isPressed(KEYCODES.LEFT)) {
    console.log('turn left')
  }
  if (keyTracker.isPressed(KEYCODES.d) || keyTracker.isPressed(KEYCODES.RIGHT)) {
    console.log('turn right')
  }
  if (keyTracker.isPressed(KEYCODES.w) || keyTracker.isPressed(KEYCODES.UP)) {
    console.log('accelerate')
  }
  if (keyTracker.isPressed(KEYCODES.s) || keyTracker.isPressed(KEYCODES.DOWN)) {
    console.log('deccelerate')
  }
}

const Game = () => {
  const [myPlayer, setMyPlayer] = useState(Player.new())
  const [players, setPlayers] = useState([myPlayer])

  // This will be called roughly 60 fps
  const animate = (time) => {
    requestAnimationFrame(animate)
    checkKeys(myPlayer)
  }
  requestAnimationFrame(animate)


  const onPlayerChange = ({playersDict}) => {
    const playersList = Object.values(playersDict)
    console.log('onPlayerchange players=', playersList)
    setPlayers(playersList)
  }

  const setup = () => {
    storage.writePlayer(myPlayer)
    storage.listenPlayers(onPlayerChange)
    keyTracker.listen(document)
  }
  useEffect(setup, [])

  return (
    r('div', {class: "Game"}, [
      r(Stage, {players}),
    ])
  )
}

const Stage = ({players}) => {
  console.log('Stage called. players=', players)
  return (
    r('div', {class: "Stage"}, [
      r('svg', { xmlns:"http://www.w3.org/2000/svg",
                 viewBox: `0 0 ${k.STAGE_WIDTH} ${k.STAGE_WIDTH}`,
                 width: "400",
                 height: "400" },
        players.map( player => r(PlayerView, {player}) )
      )
    ])
  )
}

const PlayerView = ({player}) => {
  return r('circle',
    { cx: player.pos[X], cy: player.pos[Y], r:"20", fill: player.color }
  )
}

