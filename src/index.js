'use strict'

import React from "react"
import ReactDOM from 'react-dom';

const r = React.createElement

export const main = (stage_elem) => {
  console.log('hello')

  ReactDOM.render(React.createElement(Stage), stage_elem)
  console.log('Stage rendered')
}

const Stage = () => {
  console.log('Stage called')
  return (
    r('div', {class: "Stage"}, [
      "The Stage"
    ])
  )
}
