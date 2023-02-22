function makeResizableDiv(div: any, ref: any, minimum_sizex: number, minimum_sizey: number) {
  let width = 0
  let height = 0
  ref.addEventListener('mousedown', function (e: any) {
    e.preventDefault()
    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', stopResize)
  })
  function resize(e: any) {
    width = e.clientX - div.offsetLeft
    height = e.clientY - div.offsetTop
    if (e.pageX < window.innerWidth) {
      if (width > minimum_sizex) {
        div.style.width = width + "px"
      }

    }
    if (e.pageY < window.innerHeight) {
      if (height > minimum_sizey) {
        div.style.height = height + 'px'
      }

    }
  }
  function stopResize() {
    window.removeEventListener('mousemove', resize)
  }
}
export default makeResizableDiv