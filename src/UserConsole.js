import { createElement as r } from "react"


export class ConsoleMessages {
  static MESSAGES_STAY_AROUND_MS = 5000

  static INITIAL_STATE = {
    consoleMessages: {
      msgs: [ "Welcome to Gone-Fishin'" ],
      eraseTimestamp: Number.MAX_SAFE_INTEGER,
    }
  }

  // append 'newMessage' to the console output
  static print(newMessage, updateState) {
    updateState( oldState => ({
        consoleMessages: {
          msgs: [
            ...oldState.consoleMessages.msgs.slice(-9),
            String(newMessage),
          ],
          eraseTimestamp: Date.now() + ConsoleMessages.MESSAGES_STAY_AROUND_MS,
        }
      })
    )
  }
}

// Display ConsoleMessages, overlaid on Arena
export const UserConsole = ({consoleMessages, updateState}) => {

  const messagesAreOld = Date.now() > consoleMessages.eraseTimestamp
  if (messagesAreOld) {
    updateState( oldState => ConsoleMessages.INITIAL_STATE )
  }

  return (
    r('div',
      { class: 'UserConsole', tabIndex: -1 }, [
        consoleMessages.msgs.map( message => r('div', {}, message))
      ]
    )
  )
}

