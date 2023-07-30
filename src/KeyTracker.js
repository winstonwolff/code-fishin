
class KeyTracker {
  constructor() {
    this._keys = new Set()
  }

  listen(dom_element) {
    dom_element.addEventListener("keydown", this.keyDownHandler.bind(this), false)
    dom_element.addEventListener("keyup", this.keyUpHandler.bind(this), false)
  }

  keyDownHandler(event) {
    // console.log('!!! keyCode=', event.keyCode, 'key=', event.key, 'code=', event.code)
    this._keys.add(event.key)
    event.preventDefault()
  }

  keyUpHandler(event) {
    this._keys.delete(event.key)
    event.preventDefault()
  }

  // Return if 'key' is pressed, where 'key' is either the lower case letter
  // like "a" or "1", or the special keys name such as "ArrowLeft" or "Shift"
  isPressed(key) {
    return this._keys.has(key)
  }
}

export { KeyTracker }
