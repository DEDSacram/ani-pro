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
  //window size
  const [size, setSize] = createSignal({ width: document.body.clientWidth, height: document.body.clientHeight });

  //is menu opened
  const [open, setOpen] = createSignal(false)
  const [aniOpen, setAniOpen] = createSignal(false)
  // ciphers
  const [textEncryption, setTextEncryption] = createSignal('');
  const [textEncryptionKey, setTextEncryptionKey] = createSignal('');

  const [backAdd, setBackAdd] = createSignal([])
  const [frontAdd, setFrontAdd] = createSignal([])

  let submit = false





  let currentfunction
  let backctx;
  let frontctx;

  //drag and resize references
  let ref!: HTMLElement | ((el: HTMLDivElement) => void) | undefined
  let resizerright!: SVGSVGElement | ((el: SVGSVGElement) => void)
  let dragheader!: HTMLElement | ((el: HTMLDivElement) => void)

  let ref2: HTMLElement | ((el: HTMLDivElement) => void) | undefined
  let dragheader2: HTMLElement | ((el: HTMLDivElement) => void) | undefined
  let resizerright2: SVGSVGElement | ((el: SVGSVGElement) => void) | undefined
  // retain height reference
  let [heightbefore, setHeightBefore] = createSignal("fit-content")
  // aniopen
  let [heightbefore2, setHeightBefore2] = createSignal("fit-content")
  //refresh
  const refCallback = (el) => {
    switch (el) {
      case "1":
        currentfunction = new caesar(backctx)
        break;
      case "2":
        currentfunction = new playfair(backctx)
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

  function onSubmit(){
    if(textEncryption() && textEncryptionKey()){
    submit = true
    if (currentfunction && submit) {
      backctx.clearRect(0, 0, canvas.width, canvas.height);
      frontctx.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);
      currentfunction(textEncryptionKey())
    }
  }
  }
  // calling timeout before resizing
  window.addEventListener('resize', debounce(handleResize, 500))

  function tryout(ctx){
    var radius
    if(ctx.canvas.clientWidth > ctx.canvas.clientHeight){
      radius = ctx.canvas.clientHeight/2
    }
    else{
      radius = ctx.canvas.clientWidth/2
    }
    ctx.translate(ctx.canvas.clientWidth/2, ctx.canvas.clientHeight/2);
    drawBackground(ctx, radius);
    drawLetters(ctx, radius);
  }


function drawBackground(ctx, radius) {
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2*Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0,0,radius*0.7,0,radius*0.8);
  ctx.lineWidth = 5;
  ctx.strokeStyle = "black";
  ctx.stroke();
  ctx.lineWidth = 5;

  ctx.fillStyle = '#333';
}

function drawFirst(ctx,radius,angledivider,by){
  let first = 26 * Math.PI / angledivider;
  ctx.rotate(first);
  ctx.translate(0, -radius*by);
  ctx.rotate(-first);
  ctx.fillText("A".toString(), 0, 0);
  ctx.rotate(first);
  ctx.translate(0, radius*by);
  ctx.rotate(-first);
}

function drawLetters(ctx, radius) {
  var ang;
  var num;
  ctx.font = radius*0.1 + "px arial";
  ctx.textBaseline="middle";
  ctx.textAlign="center";
  // num = 27
  for(let heh = 1; heh < 57; heh++){
    if(heh % 2 == 1){
      drawBoundary(ctx,heh*Math.PI/26, radius, radius*0.01);
    }
  }




  var angledivider = 26/2
  drawFirst(ctx,radius,angledivider,0.85)
  for(num = 1; num < 26; num++){
    ang = num * Math.PI / angledivider;
    ctx.rotate(ang);
    ctx.translate(0, -radius*0.85);
    ctx.rotate(-ang);
    ctx.fillText(String.fromCharCode((num + 65)), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius*0.85);
    ctx.rotate(-ang);
  }
  drawFirst(ctx,radius,angledivider,0.60)
  for(num = 1; num < 26; num++){
    ang = num * Math.PI / angledivider;
    ctx.rotate(ang);
    ctx.translate(0, -radius*0.60);
    ctx.rotate(-ang);
    ctx.fillText(String.fromCharCode((num + 65)), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius*0.60);
    ctx.rotate(-ang);
  }
  ctx.beginPath();
  ctx.arc(0, 0, radius*0.52, 0, 2*Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "black";
  ctx.stroke();
}


function drawBoundary(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}



  function caesar(ctx) {
    return function () {
      let sizeWidth = ctx.canvas.clientWidth;
      let sizeHeight = ctx.canvas.clientHeight;
      let spaceyby = sizeHeight / 26
      let spacexby = sizeWidth / 26
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"
      ctx.font = "20px Arial";

      for (let i = 0; i < 27; i++) {

        ctx.beginPath();
        ctx.rect(spacexby * (i), 0, spacexby, spaceyby);
        ctx.stroke();
        ctx.fillText(String.fromCharCode((i + 64)), spacexby * i - (spacexby / 2), spaceyby / 2);
      }
    };
  }

  function playfair(ctx) {
    return function (pass) {
      if(pass){
      let arr = ["A","B","C","D","E","F","G","H","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
      let fixed = [...new Set(pass.toUpperCase().split(''))]
      fixed.forEach(element => {
        var index = arr.indexOf(element);
        if (index !== -1) {
          arr.splice(index, 1);
        }
      });
      arr = fixed.concat(arr)
      let sizeWidth = ctx.canvas.clientWidth;
      let sizeHeight = ctx.canvas.clientHeight;
      let spaceyby = sizeHeight / 5
      let spacexby = sizeWidth / 5
      let fontsize = sizeHeight/5
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"
      ctx.font = fontsize + "px Arial";

      for (let i = 0; i < arr.length; i++) {

        ctx.beginPath();
        ctx.rect(spacexby * (i % 5), spaceyby * (Math.floor(i / 5)), spacexby, spaceyby);
        ctx.stroke();
        ctx.fillText(arr[i], spacexby * (i % 5) + spacexby / 2, spaceyby * (Math.floor(i / 5)) + ((spaceyby) / 2));
      }
    }
    };
  }


  //creating canvas back and overlay references
  let canvas!: { getContext: (arg0: string) => any; width: number; height: number; }
  let overlaycanvas!: { getContext: (arg0: string) => any; width: number; height: number; }

  // On open do 
  function checkOpen() {
    if (!open()) {
      setHeightBefore(ref.offsetHeight)
    }
    setOpen(!open())
    moveUp()
  }

  function checkOpen2() {
    if (!aniOpen()) {
      setHeightBefore2(ref2.offsetHeight)
    }
    setAniOpen(!aniOpen())
    moveUp2()
  }
  function moveUp2() {
    if (!aniOpen()) {
      if (ref2.offsetTop + parseInt(heightbefore2()) >= window.innerHeight) {
        let addto = ref2.offsetTop
        ref2.style.top = addto - (ref2.offsetTop + heightbefore2() - window.innerHeight) + "px"
        if (ref2.offsetTop < 0) {
          ref2.style.top = 0 + "px"
        } else {

        }
      }
      ref2.style.height = heightbefore2() + "px"
    }
    else {
      ref2.style.height = "fit-content"
    }
  }

  // check out of bounds if is move to top
  function moveUp() {
    if (!open()) {
      if (ref.offsetTop + parseInt(heightbefore()) >= window.innerHeight) {
        let addto = ref.offsetTop
        ref.style.top = addto - (ref.offsetTop + heightbefore() - window.innerHeight) + "px"
        if (ref.offsetTop < 0) {
          ref.style.top = 0 + "px"
        } else {

        }
      }
      ref.style.height = heightbefore() + "px"
    }
    else {
      ref.style.height = "fit-content"
    }
  }
  // Mounting after dom was rendered
  onMount(() => {
    // resize and drag function on menu
    backctx = canvas.getContext("2d")
    frontctx = overlaycanvas.getContext("2d")

    tryout(backctx)    

    makeResizableDiv(ref, resizerright, 270, 270)
    dragElement(ref, dragheader);
    dragElement(ref2, dragheader2);
    makeResizableDiv(ref2, resizerright2, 450, 81)

  });



  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <Canvas ref={canvas} width={size().width} height={size().height} overlay={false} />
        <Canvas ref={overlaycanvas} width={size().width} height={size().height} overlay={true} />
      </Suspense>

      <div id="dragdiv" ref={ref} class="z-50 w-3/12 flex flex-col absolute" >
        <div class="flex items-center justify-between box-border border-2 bg-slate-800 "><div class="flex flex-row justify-around items-center w-2/3" ref={dragheader} id="dragdivheader"><FiMoreHorizontal color="white" /><h1 class="select-none">CipMenu</h1></div>{open() ? <FiChevronDown onClick={checkOpen} color="white" class="custom-icon z-60 w-1/3" title="a11y" /> : <FiChevronUp onClick={checkOpen} color="white" class="custom-icon z-60 w-1/3" title="a11y" />}</div>
        <div id="menu" style={open() && { display: "none", visibility: "hidden" }} class="text-white flex flex-col h-full items-center justify-between bg-slate-800 ">
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
          <FiArrowDownRight ref={resizerright} class="self-end resizer"></FiArrowDownRight>
        </div>
      </div>


      <div ref={ref2} id="animenu" class="z-50 w-3/12 flex flex-col absolute">
        <div class="flex items-center justify-between box-border border-2 bg-slate-800 "><div class="flex flex-row justify-around items-center w-2/3" ref={dragheader2} id="dragdivheader"><FiMoreHorizontal color="white" /><h1 class="select-none">AniMenu</h1></div>{aniOpen() ? <FiChevronDown onClick={checkOpen2} color="white" class="custom-icon z-60 w-1/3" title="a11y" /> : <FiChevronUp onClick={checkOpen2} color="white" class="custom-icon z-60 w-1/3" title="a11y" />}</div>
        <div style={aniOpen() && { display: "none", visibility: "hidden" }} class="text-white flex flex-col h-full items-center justify-between bg-slate-800 ">
          <div >
            <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">AutoLeft</button>
            <button type="button" onClick={() => draw()} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Left</button>
            <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Stop</button>
            <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Right</button>
            <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">AutoRight</button>
          </div>
          <FiArrowDownRight ref={resizerright2} class="self-end resizer"></FiArrowDownRight>
        </div>
      </div>


    </div>



  );
}

render(() => <App />, document.getElementById("root") as HTMLElement);
