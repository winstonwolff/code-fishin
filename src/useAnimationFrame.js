// From: https://css-tricks.com/using-requestanimationframe-with-react-hooks/

import React from "react"

/* Use it by passing a function to call on each animation frame. Note that
 * state is not updated in the animation function. So use a state-reducing function.

     useAnimationFrame(timeDeltaMillis => {
       // Pass on a function to the setter of the state
       // to make sure we always have the latest state
       setCount(prevCount => (prevCount + timeDeltaMillis * 0.01) % 100)
     })
*/
export const useAnimationFrame = (callback, minFrameMillis) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = React.useRef();
  const previousTimeRef = React.useRef();

  const animate = time => {

    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time;

    } else {
      const timeDeltaMillis = time - previousTimeRef.current;
      if (timeDeltaMillis > minFrameMillis) { // don't render too often
        previousTimeRef.current = time;
        callback(timeDeltaMillis)
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  }

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    const onDismount = () => cancelAnimationFrame(requestRef.current);
    return onDismount
  }, []); // Make sure the effect runs only once
}
