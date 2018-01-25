# Store (Vuex)

## Way to name the mutation

### Keywords

`setSome(state, options: Object)`: use `set` with an `options` payload object.

`toggleSome(state)`: use `toggle` to perform `some = !some`. `toggle` should not be have any payload.

`openSome` or `startSome(state, options?: Object)` use `open` or `start` to perform `some = true` (or `false` if it's logical).

`closeSome` or `stopSome(state, options?: Object)` use `close` or `stop` to perform `some = false` (or `true` if it's logical).




