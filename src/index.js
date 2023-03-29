'use strict'

console.debug('loading src/index.js')

import React, { useState, useEffect } from "react"
import ReactDOM from 'react-dom'
import icepick from 'icepick'
import * as storage from './storage.js'
import * as k from './constants.js'
import { X, Y } from './constants.js'
import { Player } from './player.js'

const r = React.createElement

export const main = (stage_elem) => {
  ReactDOM.render(r(Game), stage_elem)
}

const Game = () => {
  const [myPlayer, setMyPlayer] = useState(Player.new())
  const [players, setPlayers] = useState([myPlayer])

  // This will be called roughly 60 fps
  const animate = (time) => {
    console.debug('tick...')
    requestAnimationFrame(animate)
  }
  // requestAnimationFrame(animate)


  const onPlayerChange = ({playersDict}) => {
    const playersList = Object.values(playersDict)
    console.log('onPlayerchange players=', playersList)
    setPlayers(playersList)
  }

  const setup = () => {
    storage.writePlayer(myPlayer)
    storage.listenPlayers(onPlayerChange)
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

