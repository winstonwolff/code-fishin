'use strict'

console.debug('loading src/index.js')

import React, { useState, useEffect, useRef, useReducer } from "react"
import ReactDOM from 'react-dom'
import icepick from 'icepick'
import * as storage from './storage.js'
import * as k from './constants.js'
import { X, Y } from './constants.js'
import { Player } from './player.js'
import { KeyTracker } from './keys.js'
import { evalPlayerScript } from './playerScript.js'
import { useAnimationFrame } from './useAnimationFrame.js'
import { initialState } from './state.js'

const r = React.createElement
const MIN_FRAME_MILLIS = 33

export const main = (stage_elem) => {
  ReactDOM.render(r(Game), stage_elem)
}

const keyTracker = new KeyTracker()

const onAnimationFrame = updateState => timeDeltaMillis => {
  const timeDeltaSec = timeDeltaMillis / 1000.0

  updateState( oldState => {
    let newPlayer = oldState.myPlayer

    // Run all the playerUpdate funcs
    newPlayer = Player.checkKeys(newPlayer, timeDeltaSec, keyTracker)
    newPlayer = Player.think(newPlayer, timeDeltaSec)

    // Including the user's playerUpdates
    const playerUpdates = evalPlayerScript({ timeDeltaSec, keyTracker, script: oldState.script })
    newPlayer = playerUpdates.reduce(
      ((oldPlayer, playerUpdate) => playerUpdate(oldPlayer)),
      newPlayer
    )

    storage.writePlayer(newPlayer)

    const stateChanges = {
      frameDeltaMillis: timeDeltaMillis,
      myPlayer: newPlayer,
    }
    return stateChanges
  })
}

const Game = () => {
  //
  //    Refs
  //
  // const animationHandle = useRef(null)
  const stageRef = useRef(null)

  //
  //    State
  //
  //    'updateState' takes a function which modifies state. E.g.:
  //      updateState( oldState => ({...oldState, newValue: 999}))
  const [state, updateState] = useReducer(
    ((oldState, mergeFunc) => ({...oldState, ...mergeFunc(oldState)})),
    null,
    initialState)

  // Animation
  useAnimationFrame( onAnimationFrame(updateState), MIN_FRAME_MILLIS )

  const setup = () => {
    storage.writePlayer(state.myPlayer)
    storage.listenPlayers(onPlayerChange)
    setTimeout(
      () => keyTracker.listen(stageRef.current),
      10)
    return shutdown
  }
  useEffect(setup, [])

  const shutdown = () => {
    storage.removePlayer(mhyPlayer)
  }

  const onPlayerChange = ({playersDict}) => {
    const playersList = Object.values(playersDict)
    // console.log('onPlayerchange players=', playersList)
    updateState( () => ({ players: playersList }))
  }

  const onClearPlayers = event => {
    storage.clearPlayers()
  }

  return (
    r('div', {class: "Game"}, [
      r(Stage, { players: state.players, ref: stageRef }),
      r('div', { class: 'button-bar' }, [
        r('button',
          { onClick: onClearPlayers },
          [ 'Clear Stale Players' ]),
      ]),
      r('div',
        { class: 'hack-panel' },
        [
          r('textarea',
            { rows: 10,
              value: state.script,
              onChange: event => updateState( () => ({ script: event.target.value }))
            }
          ),
        ]
      ),
      r('div',
        { class: 'debug-info' }, [
        r('div', {}, [
          `frame millis: ${Math.floor(state.frameDeltaMillis)}`,
        ]),
      ])
    ])
  )
}

const Stage = React.forwardRef(({players}, ref) => {
  // console.log('Stage called. players=', players)
  return (
    r('div',
      {class: "Stage", tabIndex: -1, autofocus: 1, ref},
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
})

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

