(function (event, document, window) {
  if (!event.composedPath) {
    Object.defineProperties(event, {
      path: {
        get() {
          let target = this.target
          const path = []
          while (target.parentNode !== null) {
            path.push(target)
            target = target.parentNode
          }
          path.push(document, window)
          return path
        },
      },
      composedPath: {
        value() {
          return this.path
        },
        writable: true,
      },
    })
  }
})(Event.prototype, document, window)
