const table = {
  1: 'head',
  2: 'body',
  3: 'legs'
}
export const bodyPart = state => table[state.level]

