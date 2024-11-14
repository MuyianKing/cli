export default {
  mounted(el, binding) {
    let scrollTop = 0
    el.addEventListener('scroll', function () {
      if (this.scrollTop - scrollTop < 0) {
        scrollTop = this.scrollTop
        return
      }

      scrollTop = this.scrollTop

      if (this.scrollHeight - (this.clientHeight + this.scrollTop) < 20) {
        binding.value()
      }
    })
  },
}
