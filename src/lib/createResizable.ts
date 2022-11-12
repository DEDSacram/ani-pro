function makeResizableDiv(div : any, ref : any) {
    const minimum_size = 270;
    let width = 0
    let height = 0
      ref.addEventListener('mousedown', function (e: any) {
        e.preventDefault()
        window.addEventListener('mousemove', resize)
        window.addEventListener('mouseup', stopResize)
     })
      function resize(e : any) {
          width =  e.clientX - div.offsetLeft
          height =  e.clientY - div.offsetTop
          if(e.pageX < window.innerWidth){
            if(width > minimum_size){
              div.style.width = width + "px"
            }
        
          }
          if(e.pageY < window.innerHeight){
            if(height > minimum_size){
              div.style.height = height + 'px'
            }
        
          }
      }
      function stopResize() {
        window.removeEventListener('mousemove', resize)
      }
  }
  export default makeResizableDiv