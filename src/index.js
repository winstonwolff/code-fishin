'use strict'

console.debug('loading src/index.js')

import React, { useState, useEffect, useRef } from "react"
import ReactDOM from 'react-dom'
import icepick from 'icepick'
import * as storage from './storage.js'
import * as k from './constants.js'
import { X, Y } from './constants.js'
import { Player } from './player.js'
import { KeyTracker } from './keys.js'

const r = React.createElement
const MIN_FRAME_MILLIS = 30

export const main = (stage_elem) => {
  ReactDOM.render(r(Game), stage_elem)
}

const keyTracker = new KeyTracker()

const Game = () => {
  const animationHandle = useRef(null)
  const timing = useRef({
    lastAnimationTime: 0.0,
    lastDeltaMillis: 0.0,
    frameNum: 0,
  })
  const [myPlayer, setMyPlayer] = useState(Player.new())
  const [players, setPlayers] = useState([myPlayer])

  const setup = () => {
    storage.writePlayer(myPlayer)
    storage.listenPlayers(onPlayerChange)
    keyTracker.listen(document)
    return shutdown
  }
  useEffect(setup, [])

  const shutdown = () => {
    cancelAnimationFrame(animationHandle.current);
  }

  // This will be called roughly 60 fps
  const animate = (timeMillis) => {
    const timeDeltaMillis = (timeMillis - timing.current.lastAnimationTime)
    animationHandle.current = requestAnimationFrame(animate)
    if (timeDeltaMillis < MIN_FRAME_MILLIS) return
    timing.current = {
      lastAnimationTime: timeMillis,
      lastDeltaMillis: timeDeltaMillis,
      frameNum: timing.current.frameNum + 1,
    }

    setMyPlayer(updatePlayer(timeDeltaMillis))
  }
  animate(0.0)

  const updatePlayer = (timeDeltaMillis) => (oldPlayer) => {
    let newPlayer = oldPlayer
    // newPlayer = Player.checkKeys(newPlayer, keyTracker)
    newPlayer = Player.think(newPlayer, timeDeltaMillis / 1000.0)

    storage.writePlayer(newPlayer)
    return newPlayer
  }


  const onPlayerChange = ({playersDict}) => {
    const playersList = Object.values(playersDict)
    // console.log('onPlayerchange players=', playersList)
    setPlayers(playersList)
  }

  return (
    r('div', {class: "Game"}, [
      r(Stage, {players}),
      r('div', {}, [
        `frame millis: ${Math.floor(timing.current.lastDeltaMillis)}`,
      ]),
      r('div', {}, [
        `frame num: ${Math.floor(timing.current.frameNum)}`
      ])
    ])
  )
}

const Stage = ({players}) => {
  // console.log('Stage called. players=', players)
  return (
    r('div', {class: "Stage"}, [
      r('svg', { xmlns:"http://www.w3.org/2000/svg",
                 viewBox: `0 0 ${k.STAGE_WIDTH} ${k.STAGE_WIDTH}`,
                 width: "400",
                 height: "400" },
        players.map( player => r(PlayerView, {player}) )
      ),
    ])
  )
}

const PlayerView = ({player}) => {
  return r('circle',
    { cx: player.pos[X], cy: player.pos[Y], r:"20", fill: player.color }
  )
}

