
// Return string with 128 bits of randomness, e.g. "212gxxdjm2hn"
export const uniqueId = () => {
 return (
   (Math.random()*0xffffffff | 0).toString(36) +
   (Math.random()*0xffffffff | 0).toString(36)
 )
}

// Return 'value' but limited to min..max
export const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max)
}

// Return 'value' but limited to min..max
export const wrap = (value, min, max) => {
  const delta = Math.abs(max - min)
  let v = value - min
  v = (value + delta) % delta
  return v + min
}

// Return a random floating point number between `low` and `high`
export const randRange = (low, high) => {
  const delta = high - low
  return low + Math.random() * delta
}

// Return a random integer between `low` and `high`
export const randInt = (low, high) => {
  return Math.floor(randRange(low, high))
}

// Return a random item from an array
export const choice = (arr) => {
  return arr[randInt(0, arr.length)]
}

//   round(1234.5678, -2) = 1200
//   round(1234.5678, 2) = 1234.57
export const round = (value, place) => {
  const tens = Math.pow(10, place)
  return Math.round(value * tens) / tens
}
