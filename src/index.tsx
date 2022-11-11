import { render } from "solid-js/web";
import { onMount, onCleanup, createEffect } from "solid-js";
import { Component } from "solid-js";
import { lazy, Suspense, createSignal } from "solid-js";
import { FiChevronDown, FiChevronUp, FiMoreHorizontal, FiArrowDownRight } from "solid-icons/fi";
import dragElement from "./lib/createDraggable";
import { DropdownCipher } from "./components/dropdown";

import "./index.css"
import Canvas from "./components/canvas";

export const App: Component = () => {
  const [size, setSize] = createSignal({ width: document.body.clientWidth, height: document.body.clientHeight });
  const [open, setOpen] = createSignal(false)

  // ciphers
  const [textEncryption, setTextEncryption] = createSignal('');
  const [textEncryptionKey, setTextEncryptionKey] = createSignal('');

  const position = { x: 0, y: 0 }
  function debounce(fn: { apply: (arg0: any, arg1: IArguments) => void; }, ms: number) {
    let timer: any
    return (_: any) => {
      clearTimeout(timer)
      timer = setTimeout((_: any) => {
        timer = null
        fn.apply(this, arguments)
      }, ms)
    };
  }
  // interact('.draggable').draggable({

  //   listeners: {
  //     start (event) {
  //       console.log(event.type, event.target)
  //     },

  //     move (event) {
  //       position.x += event.dx
  //       position.y += event.dy
  //       console.log(event.target.clientY)
  //       if(position.x < 0){
  //         position.x=0
  //       }
  //       if(position.x>= window.innerWidth - event.target.parentElement.clientWidth){
  //         position.x= window.innerWidth - event.target.parentElement.clientWidth;
  //       }
  //       if(position.y < 0){
  //         position.y = 0
  //       }
  //       console.log(event.clientY)
  //       if(position.y>= window.innerHeight - event.target.parentElement.parentElement.clientHeight){
  //         position.y = window.innerHeight - event.target.parentElement.parentElement.clientHeight
  //       }
  //       event.target.parentElement.parentElement.style.transform =
  //         `translate(${position.x}px, ${position.y}px)`
  //     },
  //   }
  // })




  // interact('.resizable')
  //   .resizable({
  //     edges: { top: false, left: false, bottom: true, right: true },

  //     listeners: {
  //       move: function (event) {
  //         let { x, y } = event.target.dataset
  //         x = (parseFloat(x) || 0) + event.deltaRect.left 
  //         y = (parseFloat(y) || 0) + event.deltaRect.top
  //         position.x = x + position.x
  //         position.y = y + position.y
  //         Object.assign(event.target.style, {
  //           width: `${event.rect.width}px`,
  //           height: `${event.rect.height}px`,
  //           transform: `translate(${position.x}px, ${position.y}px)`
  //         })

  //         Object.assign(event.target.dataset, { x , y })
  //       }
  //     }
  //   })

  function handleResize() {
    setSize({ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight })
  }
  window.addEventListener('resize', debounce(handleResize, 200))
  let canvas!: { getContext: (arg0: string) => any; width: number; height: number; }
  let overlaycanvas!: { getContext: (arg0: string) => any; width: number; height: number; }
  onMount(() => {
    makeResizableDiv('.resizable')
    dragElement(document.getElementById("dragdiv"), document.getElementById("dragdivheader"));
    const ctx = canvas.getContext("2d");
    let frame = requestAnimationFrame(loop);

    function loop(t: number) {
      frame = requestAnimationFrame(loop);

      // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // for (let p = 0; p < imageData.data.length; p += 4) {
      //   const i = p / 4;
      //   const x = i % canvas.width;
      //   const y = (i / canvas.height) >>> 0;

      //   const r = 64 + (128 * x) / canvas.width + 64 * Math.sin(t / 1000);
      //   const g = 64 + (128 * y) / canvas.height + 64 * Math.cos(t / 1000);
      //   const b = 128;

      //   imageData.data[p + 0] = r;
      //   imageData.data[p + 1] = g;
      //   imageData.data[p + 2] = b;
      //   imageData.data[p + 3] = 255/2;
      // }
      // ctx.putImageData(imageData, 0, 0);
    }

    onCleanup(() => cancelAnimationFrame(frame));



    //overlay

    const ctx2 = canvas.getContext("2d");
    let frame2 = requestAnimationFrame(loop2);

    function loop2(t: number) {
      frame2 = requestAnimationFrame(loop2);

      // const imageData2 = ctx2.getImageData(0, 0, canvas.width, canvas.height);

      // for (let p = 0; p < imageData2.data.length; p += 4) {
      //   const i = p / 4;
      //   const x = i % canvas.width;
      //   const y = (i / canvas.height) >>> 0;

      //   const r = 64 + (128 * x) / canvas.width + 64 * Math.sin(t / 1000);
      //   const g = 64 + (128 * y) / canvas.height + 64 * Math.cos(t / 1000);
      //   const b = 128;

      //   imageData2.data[p + 0] = r/2;
      //   imageData2.data[p + 1] = g/2 *Math.random();
      //   imageData2.data[p + 2] = b/2 *Math.random();
      //   imageData2.data[p + 3] = 255 * Math.random();



      // }
      // ctx2.putImageData(imageData2, 0, 0);



      // const imageData2 = ctx2.getImageData(0, 0, canvas.width, canvas.height);

      // for (let p = 0; p < imageData2.data.length; p += 4) {


      //   ctx2.fillStyle = "#FF0000";
      //   ctx2.fillRect(0,0,10,20);

      // }

    }

    onCleanup(() => cancelAnimationFrame(frame2));

  });



  function makeResizableDiv(div) {
    const element = document.querySelector(div);
    const resizers = document.querySelectorAll(div + ' .resizer')
    const minimum_size = 228;
    let original_width = 0;
    let original_height = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    for (let i = 0; i < resizers.length; i++) {
      const currentResizer = resizers[i];
      currentResizer.addEventListener('mousedown', function (e) {
        e.preventDefault()
        original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
        original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
        original_x = element.getBoundingClientRect().left;
        original_y = element.getBoundingClientRect().top;
        original_mouse_x = e.pageX;
        original_mouse_y = e.pageY;
        window.addEventListener('mousemove', resize)
        window.addEventListener('mouseup', stopResize)
      })

      function resize(e) {
        if (currentResizer.classList.contains('bottom-right')) {
          const width = original_width + (e.pageX - original_mouse_x);
          const height = original_height + (e.pageY - original_mouse_y)
          // console.log (e.clientY - rect.top)
          if(e.pageX < window.innerWidth){
          if (width >= minimum_size) {
            element.style.width = width + 'px'
          }
        }
        if(e.pageY < window.innerHeight){
          if (height >= minimum_size) {
            element.style.height = height + 'px'
          }
        }
        }
        // else if (currentResizer.classList.contains('bottom-left')) {
        //   const height = original_height + (e.pageY - original_mouse_y)
        //   const width = original_width - (e.pageX - original_mouse_x)
        //   if (height > minimum_size) {
        //     element.style.height = height + 'px'
        //   }
        //   if (width > minimum_size) {
        //     element.style.width = width + 'px'
        //     element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
        //   }
        // }
        // else if (currentResizer.classList.contains('top-right')) {
        //   const width = original_width + (e.pageX - original_mouse_x)
        //   const height = original_height - (e.pageY - original_mouse_y)
        //   if (width > minimum_size) {
        //     element.style.width = width + 'px'
        //   }
        //   if (height > minimum_size) {
        //     element.style.height = height + 'px'
        //     element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
        //   }
        // }
        // else {
        //   const width = original_width - (e.pageX - original_mouse_x)
        //   const height = original_height - (e.pageY - original_mouse_y)
        //   if (width > minimum_size) {
        //     element.style.width = width + 'px'
        //     element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
        //   }
        //   if (height > minimum_size) {
        //     element.style.height = height + 'px'
        //     element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
        //   }
        // }
      }

      function stopResize() {
        window.removeEventListener('mousemove', resize)
      }
    }
  }



  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <Canvas ref={canvas} width={size().width} height={size().height} overlay={false} />
        <Canvas ref={overlaycanvas} width={size().width} height={size().height} overlay={true} />
      </Suspense>






      <div id="dragdiv" class="z-50 w-3/12 flex flex-col absolute resizable" >
        <div class="flex box-border border-2 bg-slate-800 "><div class="flex-initial w-3/4" id="dragdivheader"><FiMoreHorizontal color="white" /></div>{open() ? <FiChevronDown onClick={() => { setOpen(!open()) }} color="white" class="custom-icon z-60 w-1/4 flex-initial" title="a11y" /> : <FiChevronUp onClick={() => { setOpen(!open()) }} color="white" class="custom-icon z-60 w-1/4 flex-initial" title="a11y" />}</div>
        <div id="menu" style={open() && { display: "none", visibility: "hidden" }} class="text-white flex flex-col h-full items-center justify-between bg-slate-800 ">
          <DropdownCipher />
          <br />
          <label for="encrypttext">Text to Cipher</label>
          <br />
          <input name="encrypttext" class="text-black bg-gray-50 border border-gray-30 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onInput={(e) => {
              setTextEncryption(e.target.value);
            }}
          />

          <label for="encrypttextkey">Cipher Key</label>
          <input name="encrypttextkey" class="text-black bg-gray-50 border border-gray-30 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onInput={(e) => {
              setTextEncryptionKey(e.target.value);
            }}
          />

          <button type="submit" class=" bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>

          <FiArrowDownRight class="self-end resizer bottom-right"></FiArrowDownRight>

        </div>

      </div>
    </div>



  );
}

render(() => <App />, document.getElementById("root") as HTMLElement);
