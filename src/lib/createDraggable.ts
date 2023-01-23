function dragElement(elmnt: HTMLElement,header : HTMLElement) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (header) {
      /* if present, the header is where you move the DIV from:*/
      header.onmousedown = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e: { preventDefault: () => void; clientX: number; clientY: number; }) {
      // e = e || window.event;
      e?.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e?.clientX;
      pos4 = e?.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e: { preventDefault: () => void; clientX: number; clientY: number; }) {
      // e = e || window.event;
      e?.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e?.clientX;
      pos2 = pos4 - e?.clientY;
      pos3 = e?.clientX;
      pos4 = e?.clientY;
      // set the element's new position:
   
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      if(e.clientY <= 0){
        elmnt.style.top = 0+ "px";
      }
      if(e.clientX <= 0){
        elmnt.style.left = 0 + "px";
      }
      if(e.clientX >= window.innerWidth){
        elmnt.style.left = window.innerWidth - elmnt.offsetWidth + "px";
      }
      if(e.clientY >= window.innerHeight){
        elmnt.style.top = window.innerHeight - elmnt.offsetHeight + "px";
      }
    }
  
    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
      if(elmnt.offsetTop <= 0){
        elmnt.style.top = 0+ "px";
      }
      if(elmnt.offsetLeft <= 0){
        elmnt.style.left = 0 + "px";
      }
      if(elmnt.offsetLeft + elmnt.offsetWidth >= window.innerWidth){
        elmnt.style.left = window.innerWidth - elmnt.offsetWidth + "px";
      }
      if(elmnt.offsetTop + elmnt.offsetHeight >= window.innerHeight){
        if(elmnt.offsetHeight >window.innerHeight){
          elmnt.style.top = 0 + "px";
        }else{
          elmnt.style.top = window.innerHeight - elmnt.offsetHeight + "px";
        }
        
      }
    }
  }
  export default dragElement