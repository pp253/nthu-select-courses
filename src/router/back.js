let stack = []

export function unregister(fn) {
  let index = stack.indexOf(fn)
  if (index < 0) {
    return null
  }
  if (index < stack.length - 1) {
    console.warn('You should unregister the higher level function first.')
  }
  return stack.splice(index, 1)
}

export function register(fn) {
  if (typeof fn !== 'function') {
    throw new Error('[back/register] fn must be function.')
  }
  stack.push(fn)
}

export function signal() {
  if (stack.length === 0) {
    return true
  }
  return stack[stack.length - 1]()
}
