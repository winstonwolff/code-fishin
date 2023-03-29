
// Returns string with 128 bits of randomness, e.g. "212gxxdjm2hn"
export const uniqueId = () => {
 return (
   (Math.random()*0xffffffff | 0).toString(36) +
   (Math.random()*0xffffffff | 0).toString(36)
 )
}

export const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max)
}

// Returns a random floating point number between `low` and `high`
export const randRange = (low, high) => {
  const delta = high - low
  return low + Math.random() * delta
}

export const randInt = (low, high) => {
  return Math.floor(randRange(low, high))
}

// Returns a random item from an array
export const choice = (arr) => {
  return arr[randInt(0, arr.length)]
}
