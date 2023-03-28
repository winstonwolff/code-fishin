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
      r('svg', { xmlns:"http://www.w3.org/2000/svg",
                 viewBox: "0 0 1000 1000",
                 width: "400",
                 height: "400" }, [
        r('circle', { cx: "500", cy: "300", r:"20", fill: "gold" }),
        r('circle', { cx: "300", cy: "700", r:"20", fill: "blue" }),
      ])
    ])
  )
}
