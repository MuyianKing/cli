import http from '@http'

class Token {
  constructor() {
    this.interval = 150000
    this.user = useUserStore()

    this.refresh()
  }

  refresh() {
    if (this.user.token) {
      http.post(hl.api.tyyh.token).finally(() => {
        setTimeout(() => {
          this.refresh()
        }, this.interval)
      })
    } else {
      setTimeout(() => {
        this.refresh()
      }, this.interval)
    }
  }
}

export default Token
