export default {
  bind(el, binding) {
    const oDiv = el
   // const self = this  // 上下文
    oDiv.onmousedown = function(e) {
      // 鼠标按下，计算当前元素距离可视区的距离
      const pDiv = el.parentNode   // 当前的父元素
      oDiv.style.cursor = 'move'
      const disX = e.clientX - pDiv.offsetLeft
      const disY = e.clientY - pDiv.offsetTop
      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        const pw = document.documentElement.clientWidth - pDiv.clientWidth
        const ph = document.documentElement.clientHeight - pDiv.clientHeight
        const l = e.clientX - disX
        const t = e.clientY - disY
        if (l < 0) { // 不能超出浏览器边界
          pDiv.style.left = 0 + 'px'
        } else if (l >= pw) {
          pDiv.style.left = pw + 'px'
        } else {
          pDiv.style.left = l + 'px'
        }
        if (t < 0) {
          pDiv.style.top = 0 + 'px'
        } else if (t >= ph) {
          pDiv.style.top = ph + 'px'
        } else {
          pDiv.style.top = t + 'px'
        }
      }
      document.onmouseup = function(e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
