import { render } from "solid-js/web";
import { onMount, onCleanup, createEffect } from "solid-js";
import { Component } from "solid-js";
import { lazy, Suspense, createSignal } from "solid-js";
import { FiChevronDown, FiChevronUp, FiMoreHorizontal, FiArrowDownRight } from "solid-icons/fi";
import dragElement from "./lib/createDraggable";
import makeResizableDiv from "./lib/createResizable";
import { DropdownCipher } from "./components/dropdown";
import { createPlayfair } from "./lib/createPlayfair";
import { createCaesar } from "./lib/createCaesar";
import { createCaesarWheel } from "./lib/createCaesarWheel";
import "./index.css"
import Canvas from "./components/canvas";
import { Menu } from "./components/menu";


export const App: Component = () => {
  //window size
  const [size, setSize] = createSignal({ width: document.body.clientWidth, height: document.body.clientHeight });

  //is menu opened
  const [open, setOpen] = createSignal(false)
  const [aniOpen, setAniOpen] = createSignal(false)
  // ciphers
  const [textEncryption, setTextEncryption] = createSignal('');
  const [textEncryptionKey, setTextEncryptionKey] = createSignal('')
  let currentfunction
  let backctx;
  let frontctx;
  //reset
  let submit = false;

  const refCallback = (el) => {
    console.log(el)
    switch (el) {
      case "1":
        currentfunction = new createCaesar(backctx)
        break;
      case "2":
        currentfunction = new createCaesarWheel(backctx)
        break;
      case "3":
        currentfunction = new createPlayfair(backctx)
        break;
      default:
      // code block
    }
  };
  // wait timer before window resize optimalization
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
  //resize window
  function handleResize() {
    setSize({ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight })
    if (currentfunction && submit) {
      currentfunction(textEncryptionKey())
    }

  }

  function onSubmit() {
    if (textEncryption() && textEncryptionKey()) {
      submit = true
      if (currentfunction && submit) {
        backctx.clearRect(0, 0, canvas.width, canvas.height);
        frontctx.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);
        currentfunction(textEncryptionKey())
        resetContext(backctx)
        resetContext(frontctx)
      }
    }

    function resetContext(ctx) {
      ctx.resetTransform();
      ctx.strokeStyle = "#000"; ctx.lineWidth = 1; ctx.setLineDash([]);
    }
  }
  // calling timeout before resizing
  window.addEventListener('resize', debounce(handleResize, 500))

  //creating canvas back and overlay references
  let canvas!: { getContext: (arg0: string) => any; width: number; height: number; }
  let overlaycanvas!: { getContext: (arg0: string) => any; width: number; height: number; }

  // Mounting after dom was rendered
  onMount(() => {
    // resize and drag function on menu
    backctx = canvas.getContext("2d")
    frontctx = overlaycanvas.getContext("2d")
  });



  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <Canvas ref={canvas} width={size().width} height={size().height} overlay={false} />
        <Canvas ref={overlaycanvas} width={size().width} height={size().height} overlay={true} />
      </Suspense>
      <Menu title={"CipMenu"} itemid={"menu"} minwidth={270} minheight={270}>
        <DropdownCipher PASSREF={refCallback} />
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
        <button onClick={onSubmit} type="submit" class=" bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
      </Menu>
      <Menu title={"AniMenu"} itemid={"animenu"} minwidth={450} minheight={81}>
        <div >
          <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">AutoLeft</button>
          <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Left</button>
          <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Stop</button>
          <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Right</button>
          <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">AutoRight</button>
        </div>
      </Menu>
    </div>



  );
}

render(() => <App />, document.getElementById("root") as HTMLElement);
