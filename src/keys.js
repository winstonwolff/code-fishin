export const KEYCODES = {
  a: 65,
  s: 83,
  d: 68,
  w: 87,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
}

class KeyTracker {
  constructor() {
    this._keys = {}
  }

  listen(document) {
    console.log('!!! listening')
    document.addEventListener("keydown", this.keyDownHandler.bind(this), false)
    document.addEventListener("keyup", this.keyUpHandler.bind(this), false)
  }

  // unListen(document) {
  //   document.removeEventListener("keydown", this.keyDownHandler, false)
  //   document.removeEventListener("keyup", this.keyUpHandler, false)
  // }

  keyDownHandler(event) {
    // console.log('!!! keyCode=', event.keyCode)
    this._keys[event.keyCode] = true
  }

  keyUpHandler(event) {
    this._keys[event.keyCode] = false
  }

  isPressed(keyCode) {
    return this._keys[keyCode]
  }
}

export { KeyTracker }
