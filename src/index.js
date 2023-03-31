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
const MIN_FRAME_MILLIS = 33

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
    cancelAnimationFrame(animationHandle.current)
    storage.removePlayer(mhyPlayer)
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
    const timeDeltaSec = timeDeltaMillis / 1000.0
    let newPlayer = oldPlayer
    newPlayer = Player.checkKeys(newPlayer, timeDeltaSec, keyTracker)
    newPlayer = Player.think(newPlayer, timeDeltaSec)

    storage.writePlayer(newPlayer)
    return newPlayer
  }


  const onPlayerChange = ({playersDict}) => {
    const playersList = Object.values(playersDict)
    // console.log('onPlayerchange players=', playersList)
    setPlayers(playersList)
  }

  const onClearPlayers = event => {
    storage.clearPlayers()
  }

  return (
    r('div', {class: "Game"}, [
      r(Stage, {players}),
      r('div', { class: 'button-bar' }, [
        r('button',
          { onClick: onClearPlayers },
          [ 'Clear Stale Players' ]),
      ]),
      r('div',
        { class: 'hack-panel' },
        [
          r('textarea',
            { rows: 10 },
            [ '# type JS here' ]
          ),
        ]
      ),
      r('div',
        { class: 'debug-info' }, [
        r('div', {}, [
          `frame millis: ${Math.floor(timing.current.lastDeltaMillis)}`,
        ]),
        r('div', { class: 'debug-info' }, [
          `frame num: ${Math.floor(timing.current.frameNum)}`
        ])
      ])
    ])
  )
}

const Stage = ({players}) => {
  // console.log('Stage called. players=', players)
  return (
    r('div',
      {class: "Stage", autofocus: 1},
      [
        r('svg',
          { xmlns:"http://www.w3.org/2000/svg",
            viewBox: `0 0 ${k.STAGE_WIDTH} ${k.STAGE_WIDTH}`,
            width: "400",
            height: "400",
          },
          players.map( player => r(PlayerView, {player}) )
        ),
      ]
    )
  )
}

const PlayerView = ({player}) => {
  return r('ellipse',
    { rx: 30,
      ry: 10,
      fill: player.color,
      transform: (
        `translate(${Math.round(player.pos[X])} ${Math.round(player.pos[Y])}) `
        + ` rotate(${Math.round(player.direction * k.RAD_TO_DEG)})`
      )
    }
  )
}

