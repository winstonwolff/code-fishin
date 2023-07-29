import { createElement } from "react"
export const INIT_USER_CONSOLE = { consoleMessages: [ "Welcome to Gone-Fishin'" ] }

const r = createElement

// Text overlaid on Arena where status messages appear
export const UserConsole = ({messages}) => {
  return (
    r('div',
      { class: 'UserConsole', tabIndex: -1 }, [
        messages.map( message => r('div', {}, message))
      ]
    )
  )
}

export const updateConsole = (newMessage, updateState) => {
  updateState( oldState => ({
      consoleMessages: [
        ...oldState.consoleMessages.slice(-9),
        String(newMessage)
      ]
    })
  )
}
