import { render } from "solid-js/web";
import { onMount, onCleanup, createEffect } from "solid-js";
import { Component } from "solid-js";
import { lazy, Suspense, createSignal } from "solid-js";
import { FiChevronDown, FiChevronUp, FiMoreHorizontal, FiArrowDownRight } from "solid-icons/fi";
import dragElement from "./lib/createDraggable";
import makeResizableDiv from "./lib/createResizable";
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
  function handleResize() {
    setSize({ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight })
  }

  window.addEventListener('resize', debounce(handleResize, 200))
  let canvas!: { getContext: (arg0: string) => any; width: number; height: number; }
  let overlaycanvas!: { getContext: (arg0: string) => any; width: number; height: number; }
  let ref
  let resizerright
  let [heightbefore,setHeightBefore] = createSignal("fit-content")
  function checkOpen(){
    if(!open()){
      setHeightBefore(ref.offsetHeight + "px")
    }
    console.log(heightbefore())
    setOpen(!open())
  }
  onMount(() => {
    makeResizableDiv(ref,resizerright)
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
    }

    onCleanup(() => cancelAnimationFrame(frame2));

  });



  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <Canvas ref={canvas} width={size().width} height={size().height} overlay={false} />
        <Canvas ref={overlaycanvas} width={size().width} height={size().height} overlay={true} />
      </Suspense>






      <div id="dragdiv" ref={ref} style={!open() ? {height:heightbefore()} : {height:"fit-content"}} class="z-50 w-3/12 flex flex-col absolute" >
        <div class="flex box-border border-2 bg-slate-800 "><div class="flex-initial w-3/4" id="dragdivheader"><FiMoreHorizontal color="white" /></div>{open() ? <FiChevronDown onClick={checkOpen} color="white" class="custom-icon z-60 w-1/4 flex-initial" title="a11y" /> : <FiChevronUp onClick={checkOpen} color="white" class="custom-icon z-60 w-1/4 flex-initial" title="a11y" />}</div>
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

          <FiArrowDownRight ref={resizerright} class="self-end resizer"></FiArrowDownRight>

        </div>

      </div>
    </div>



  );
}

render(() => <App />, document.getElementById("root") as HTMLElement);
