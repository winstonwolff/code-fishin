import React from "react"

const MESSAGES_STAY_AROUND_MS = 5000

export const INIT_USER_CONSOLE = {
  consoleMessages: {
    msgs: [ "Welcome to Gone-Fishin'" ],
    eraseTimestamp: Number.MAX_SAFE_INTEGER,
  }
}

const r = React.createElement

// Text overlaid on Arena where status messages appear
export const UserConsole = ({consoleMessages, updateState}) => {

  const messagesAreOld = Date.now() > consoleMessages.eraseTimestamp
  if (messagesAreOld) {
    updateState( oldState => INIT_USER_CONSOLE )
  }

  return (
    r('div',
      { class: 'UserConsole', tabIndex: -1 }, [
        consoleMessages.msgs.map( message => r('div', {}, message))
      ]
    )
  )
}

// append 'newMessage' to the console output
export const updateConsole = (newMessage, updateState) => {

  updateState( oldState => ({
      consoleMessages: {
        msgs: [
          ...oldState.consoleMessages.msgs.slice(-9),
          String(newMessage),
        ],
        eraseTimestamp: Date.now() + MESSAGES_STAY_AROUND_MS,
      }
    })
  )
}
