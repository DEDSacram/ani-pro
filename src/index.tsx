import { render } from "solid-js/web";
import { onMount } from "solid-js";
import { Component } from "solid-js";
import { Suspense, createSignal } from "solid-js";
import { DropdownCipher } from "./components/dropdown";
import { createPlayfair } from "./lib/createPlayfair";
import { createCaesar } from "./lib/createCaesar";
import { createCaesarWheel } from "./lib/createCaesarWheel";
import "./index.css"
import Canvas from "./components/canvas";

import * as popis from './popis.json';

import { Menu } from "./components/menu";
import { FiChevronsLeft, FiChevronLeft, FiChevronRight, FiChevronsRight, FiArrowRight } from "solid-icons/fi";

class Postreq {
  public Cipher: string;
  public Text: string;
  public Key: string | number;
  constructor(cipher: string, text: string, key: string | number) {
    this.Cipher = cipher
    this.Text = text
    this.Key = key
  }
}
interface Postres {
  TextBefore: string;
  TextNow: string;
  Ani: number[][][][];
  Cipher: string;
  Display: string[] | string[][];

}
export const App: Component = () => {
  //window size
  const [size, setSize] = createSignal({ width: document.body.clientWidth, height: document.body.clientHeight });

  //form inputs
  const [textEncryption, setTextEncryption] = createSignal('');
  const [textEncryptionKey, setTextEncryptionKey] = createSignal('')
  const [encryptedText, setEncryptedText] = createSignal('')

  //closure for graphical creation of cipher
  let currentfunction: ((key: any, encrypt: boolean) => void) | ((display: any, spacexby: number, spaceyby: number, fontsize: number) => void) | ((arg0: string | string[] | string[][], arg1: number | boolean, arg2: number | undefined, arg3: number | undefined) => void)

  //closure for generation of steps for animation
  let currentfunctionanimation: () => void

  //canvas context
  let backctx: { clearRect?: any; canvas?: any; textAlign?: any; textBaseline?: any; font?: any; beginPath?: any; rect?: any; stroke?: any; fillText?: any; translate?: any; resetTransform?: () => void; strokeStyle?: string; lineWidth?: number; setLineDash?: (arg0: never[]) => void; fillStyle?: string; }
  let frontctx: { clearRect?: any; resetTransform?: () => void; strokeStyle?: string; lineWidth?: number; setLineDash?: (arg0: never[]) => void; fillStyle?: string; }

  // id of cipher
  let currentcipher: string;

  //reset
  let submit = false;

  let [encrypt, setEncrypt] = createSignal(true);

  //rescaling animation + sizes
  let xratio = 1
  let yratio = 1

  let spacex = 0
  let spacey = 0

  let spacexby = 0
  let spaceyby = 0

  //animation control
  let currentstep = 0;
  let currentmicrostep = 0;

  //animation running reference
  let running = {
    on: false
  };

  //rules for cipher
  let [rules,setRules] = createSignal([]);

  //Descryption
  let [textbefore,setTextBefore] = createSignal('')
  let [textnow,setTextNow] = createSignal('')

  let [stepnow,setStepNow] = createSignal('')
  let [stepbefore,setStepBefore] = createSignal('')
  //
 

  //stays
  let ongeneratedsize = { width: 0, height: 0 }

  //animation
  let animationsteps: ( number[][][])[] = []


  // response from
  let backres: Postres;
  const res = async (data: Postreq, encrypt: boolean) => {
    let url = 'http://localhost:5294/decrypt'
    if (encrypt) {
      url = 'http://localhost:5294/encrypt'
    }
    return await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => response.json())
      .then((data) => {
        console.log(data)
        backres = data
      })
  }
  //choosing cipher from menu
  const refCallback = (el: any) => {
    currentcipher = el
    switch (Number.parseInt(el)) {
      case 1:
        currentfunction = createCaesar(backctx)
        currentfunctionanimation = setCaesar()
        spacex = 26
        spacey = 26
        break;
      case 2:
        currentfunction = createCaesarWheel(backctx)
        currentfunctionanimation = setCaesarCircle()
        break;
      case 3:
        currentfunction = createPlayfair(backctx)
        currentfunctionanimation = setPlayfair()
        spacex = 5
        spacey = 5
        break;
      default:
    }
  };

  // wait timer before window resize
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
  //called after window resize
  function handleResize() {
    if (submit) {
      xratio = document.documentElement.clientWidth / ongeneratedsize.width
      yratio = document.documentElement.clientHeight / ongeneratedsize.height
    }
    setSize({ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight })
    if (currentfunction && submit) {
      spacexby = size().width / spacex
      spaceyby = size().height / spacey
      currentfunction(backres.Display,spacexby,spaceyby,(ongeneratedsize.height*yratio) / spacey)
      Selected(frontctx, animationsteps[currentstep][currentmicrostep][0][0] * xratio, animationsteps[currentstep][currentmicrostep][0][1] * yratio, spacexby, spaceyby, "red")
      Selected(frontctx, animationsteps[currentstep][currentmicrostep][1][0] * xratio, animationsteps[currentstep][currentmicrostep][1][1] * yratio, spacexby, spaceyby, "green")
    }
  }

  //switch input output
  function switchOutputInput() {
    let temp = encryptedText()
    setEncryptedText(textEncryption())
    setTextEncryption(temp)
  }

  // Submit form
  async function onSubmit() {
     //check if key text to encrypt and cipher was chosen
    if (textEncryption() && textEncryptionKey() && currentcipher) {
      //set form submit to true
      submit = true

      //clear canvas settings
      resetContext(backctx)
      resetContext(frontctx)

      //check if both submit and cipher was chosen
      if (currentfunction && submit) {

        //clear animation steps
        animationsteps = [];

        //clear canvas
        backctx.clearRect(0, 0, canvas.width, canvas.height);
        frontctx.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);


        // backend response
        await res(new Postreq(currentcipher, textEncryption(), textEncryptionKey()), encrypt())

        // keeping track of size on which it was generated
        ongeneratedsize = { width: size().width, height: size().height }
        spacexby = size().width / spacex
        spaceyby = size().height / spacey

        // call to create graphics for given cipher
        currentfunction(backres.Display,spacexby,spaceyby,((ongeneratedsize.height*yratio) / spacey))

        //set encrypted text
        setEncryptedText(backres.TextNow)

        // create animation by cipher
        switch (parseInt(currentcipher)) {
          case 1:
            currentfunctionanimation()
            setRules(popis.caesar.rules) 
            break;
          case 2:
            currentfunctionanimation()
            setRules(popis.caesar.rules) 
            break;
          case 3:
            currentfunctionanimation()
            setRules(popis.playfair.rules) 
            break;
          default:
            console.log("FAIL")
        }

        //clear global variables 
        currentmicrostep = 0
        currentstep = 0

      }
    }
    

  }
    //function to reset canvas settings
    function resetContext(ctx: { resetTransform: () => void; strokeStyle: string; lineWidth: number; setLineDash: (arg0: never[]) => void; fillStyle: string; }) {
      ctx.resetTransform();
      ctx.strokeStyle = "white"; ctx.lineWidth = 1; ctx.setLineDash([]);
      ctx.fillStyle = 'white';
    }
  
  // Playfair steps to coordinates
  function setPlayfair() {
    return function GenerateStepsPlayfair() {
      for (let i = 0; i < backres.Ani.length; i++) {
        let step = []
        for (let j = 0; j < backres.Ani[i].length; j++) {
           let letter = []
           for(let z = 0; z < backres.Ani[i][j].length;z++){
            letter.push([backres.Ani[i][j][z][1]*spacexby,backres.Ani[i][j][z][0]*spaceyby])
           }
           step.push(letter)
        }
        animationsteps.push(step)
      }
    
    }
   
  }
   // Caesar steps to coordinates
  function setCaesar() {
    return function GenerateStepsCaesar() {
      for (let i = 0; i < backres.Ani.length; i++) {
        let step = []
        for (let j = 0; j < backres.Ani[i][0].length; j++) {
          let microstep = [backres.Ani[i][0][j][0] * spacexby, backres.Ani[i][0][j][1] * spaceyby]
          step.push(microstep)
        }
        animationsteps.push([step])
      }
    }
  }
   // Caesar steps to coordinates not yet
  function setCaesarCircle() {
    return function GenerateStepsCaesar() {
    }
  }

  // function to calculate coordinate for quarctic movement
  function easeInOutQuart(t: number, b: number, c: number, d: number) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  }

  // function to animate at 60HZ
  async function Animate(ctx: { clearRect: any; resetTransform?: (() => void) | undefined; strokeStyle?: string | undefined; lineWidth?: number | undefined; setLineDash?: ((arg0: never[]) => void) | undefined; fillStyle: any; fillRect?: any; }, from: number, to: number, col: number | undefined, row: number | undefined, width: number, height: number, duration: number, states: { on: boolean; }, color = "white") {
    return await new Promise(resolve => {

      var start = new Date().getTime();
      var innertimer = setInterval(function () {
        if (!running.on) {
          clearTimeout(innertimer)
          Promise.resolve(0)
        }
        var time = new Date().getTime() - start;
        if (row == undefined) {
          var x = easeInOutQuart(time, from, to - from, duration);
          ctx.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);
          ctx.fillStyle = color;
          ctx.fillRect(x, col, width, height);
        } else {
          var y = easeInOutQuart(time, from, to - from, duration);
          ctx.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);
          ctx.fillStyle = color;
          ctx.fillRect(row, y, width, height);
        }

        if (time >= duration) {
          resolve('done');
          clearInterval(innertimer)
        }
      }, 1000 / 60);
    });
  }

  // run animation forward
  async function autoRunRight() {
    //checking if animation is already running
    if (running.on) {
      return
    }
    // if isnt running run
    running.on = true

      // giving for loops a label to break from it later
      cancel:
      for (currentstep; currentstep < animationsteps.length; currentstep++) {
        //letter steps
        
        //update description
        updateDescription()

        for (currentmicrostep; currentmicrostep < animationsteps[currentstep].length; currentmicrostep++) {
          // if to check if animation should be on X or Y axis
          if (animationsteps[currentstep][currentmicrostep][0][0] == animationsteps[currentstep][currentmicrostep][1][0]) {
            //"sameROW"
            await Animate(frontctx, animationsteps[currentstep][currentmicrostep][0][1] * yratio, animationsteps[currentstep][currentmicrostep][1][1] * yratio, undefined, animationsteps[currentstep][currentmicrostep][0][0] * xratio, spacexby, spaceyby, 1000, running)

          } else {
            //"column"
            await Animate(frontctx, animationsteps[currentstep][currentmicrostep][0][0] * xratio, animationsteps[currentstep][currentmicrostep][1][0] * xratio, animationsteps[currentstep][currentmicrostep][1][1] * yratio, undefined, spacexby, spaceyby, 1000, running)
          }
          if (!running.on) {
            break cancel;
          }
        }
        // move in current step
        currentmicrostep = 0
      }
    
    // problem with for loop out of bounds
    if (currentstep > animationsteps.length - 1) {
      currentstep--
    }
  }

//p1 start p2 end size: size of arrow
function linearrow (ctx: { save: () => void; translate: (arg0: any, arg1: any) => void; rotate: (arg0: number) => void; beginPath: () => void; moveTo: (arg0: number, arg1: number) => void; lineTo: (arg0: number, arg1: number) => void; stroke: () => void; fillStyle: string; fill: () => void; restore: () => void; },p1: { y: number; x: number; }, p2: { y: number; x: number; }, size: number) {
  var angle = Math.atan2((p2.y - p1.y) , (p2.x - p1.x));
  var hyp = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));

  ctx.save();
  ctx.translate(p1.x, p1.y);
  ctx.rotate(angle);

  // line
  ctx.beginPath();	
  ctx.moveTo(0, 0);
  ctx.lineTo(hyp - size, 0);
  ctx.stroke();

  // triangle
  ctx.fillStyle = 'blue';
  ctx.beginPath();
  ctx.lineTo(hyp - size, size);
  ctx.lineTo(hyp, 0);
  ctx.lineTo(hyp - size, -size);
  ctx.fill();

  ctx.restore();
}






  // arrow at the end of a line
  function arrow (ctx: { save: () => void; translate: (arg0: any, arg1: any) => void; rotate: (arg0: number) => void; fillStyle: string; strokeStyle: string; beginPath: () => void; lineWidth: number; lineTo: (arg0: number, arg1: number) => void; fill: () => void; stroke: () => void; restore: () => void; },p1: { y: number; x: number; }, p2: { x: any; y: any; }, size: number) {
    var angle = Math.atan2((p2.y - p1.y) , (p2.x - p1.x));
    var hyp = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
    ctx.save();
    ctx.translate(p1.x, p1.y);
    ctx.rotate(angle);
    // triangle
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.lineTo(hyp - size, size);
    ctx.lineTo(hyp, 0);
    ctx.lineTo(hyp - size, -size);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // line with arrow estimate
  function drawcurvewitharrow(ctx: { clearRect?: any; resetTransform?: (() => void) | undefined; strokeStyle?: string | undefined; lineWidth: any; setLineDash?: ((arg0: never[]) => void) | undefined; fillStyle?: string | undefined; beginPath?: any; moveTo?: any; quadraticCurveTo?: any; stroke?: any; },startpoint: { x: any; y: any; },control_p: { x: any; y: any; },endpoint: { x: any; y: any; },arrowsize: number){
  ctx.beginPath();
  ctx.moveTo(startpoint.x, startpoint.y);
  ctx.quadraticCurveTo(control_p.x, control_p.y, endpoint.x, endpoint.y);
  ctx.lineWidth = 4;
  ctx.stroke();
  arrow(ctx,control_p, {x: endpoint.x, y: endpoint.y}, arrowsize);
  }



  // stop animation from running
  function stop() {
    frontctx.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);
    Selected(frontctx, animationsteps[currentstep][currentmicrostep][0] * xratio, animationsteps[currentstep][currentmicrostep][1] * yratio, spacexby, spaceyby)
    running.on = false
  }
  // color a rectangle
  function Selected(ctx: { clearRect?: any; resetTransform?: (() => void) | undefined; strokeStyle?: string | undefined; lineWidth?: number | undefined; setLineDash?: ((arg0: never[]) => void) | undefined; fillStyle: any; beginPath?: any; rect?: any; fill?: any; }, x: number, y: number, width: number, height: number, color = "white") {
    ctx.beginPath()
    ctx.fillStyle = color;
    ctx.rect(x, y, width, height);
    ctx.fill()
  }

  // move to one step before
  function skipLeft() {
    if (!animationsteps.length) return
    if (running.on) {
      stop()
      return
    }
    if (currentstep - 1 > -1) {
      currentstep--;
    }
    currentmicrostep = 0
    frontctx.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);
    switch (Number.parseInt(backres.Cipher)) {
      case 1:
        // normal caesar
        drawcurvewitharrow(frontctx,{x: (animationsteps[currentstep][0][0][0]+(spacexby/2)) * xratio,y:(animationsteps[currentstep][0][0][1]+spaceyby) * yratio},{x: ((animationsteps[currentstep][0][0][0]+(spacexby/2)) * xratio + (animationsteps[currentstep][0][1][0]+(spacexby/2)) * xratio)/2,y: ((animationsteps[currentstep][0][0][1]+spaceyby*2) * yratio+(animationsteps[currentstep][0][1][1]+spaceyby*2) * yratio)/2},{x: (animationsteps[currentstep][0][1][0]+(spacexby/2)) * xratio, y: (animationsteps[currentstep][0][1][1]+spaceyby) * yratio},10)
        break;
      case 2:
        // wheel caesar
        break;
      case 3:
       //Playfair
       for(let i = 0; i < animationsteps[currentstep].length; i++){
        Selected(frontctx, animationsteps[currentstep][i][0][0] * xratio, animationsteps[currentstep][i][0][1] * yratio, spacexby, spaceyby, "red")
        Selected(frontctx, animationsteps[currentstep][i][1][0] * xratio, animationsteps[currentstep][i][1][1] * yratio, spacexby, spaceyby, "green")
       }
        break;
      default:
    }
    updateDescription()
  }
  // move to microstep before
  function stepLeft() {
    if (!animationsteps.length) return
    if (running.on) {
      stop()
      currentmicrostep++
      return
    }


    currentmicrostep--
    if (currentmicrostep < 0) {
      if (currentstep - 1 > -1) {
        currentstep--
        currentmicrostep = animationsteps[currentstep].length - 1
      } else {
        currentmicrostep = 0
      }
    }
    frontctx.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);
    switch (Number.parseInt(backres.Cipher)) {
      case 1:
        // normal caesar
        drawcurvewitharrow(frontctx,{x: (animationsteps[currentstep][0][0][0]+(spacexby/2)) * xratio,y:(animationsteps[currentstep][0][0][1]+spaceyby) * yratio},{x: ((animationsteps[currentstep][0][0][0]+(spacexby/2)) * xratio + (animationsteps[currentstep][0][1][0]+(spacexby/2)) * xratio)/2,y: ((animationsteps[currentstep][0][0][1]+spaceyby*2) * yratio+(animationsteps[currentstep][0][1][1]+spaceyby*2) * yratio)/2},{x: (animationsteps[currentstep][0][1][0]+(spacexby/2)) * xratio, y: (animationsteps[currentstep][0][1][1]+spaceyby) * yratio},10)
        break;
      case 2:
        // wheel caesar
        break;
      case 3:
       //Playfair
        Selected(frontctx, animationsteps[currentstep][currentmicrostep][0][0] * xratio, animationsteps[currentstep][currentmicrostep][0][1] * yratio, spacexby, spaceyby, "red")
        Selected(frontctx, animationsteps[currentstep][currentmicrostep][1][0] * xratio, animationsteps[currentstep][currentmicrostep][1][1] * yratio, spacexby, spaceyby, "green")
        break;
      default:
      return
    }
    updateDescription()
  }



  // move a microstep forward
  function stepRight() {
    if (!animationsteps.length) return
    if (running.on) {
      stop()
      return
    }

    currentmicrostep++

    if (currentmicrostep > animationsteps[currentstep].length - 1) {
      if (currentstep + 1 < animationsteps.length) {
        currentstep++
        currentmicrostep = 0
      } else {
        currentmicrostep = animationsteps[currentstep].length - 1
      }
    }
    frontctx.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);
    switch (Number.parseInt(backres.Cipher)) {
    case 1:
      // normal caesar
      drawcurvewitharrow(frontctx,{x: (animationsteps[currentstep][0][0][0]+(spacexby/2)) * xratio,y:(animationsteps[currentstep][0][0][1]+spaceyby) * yratio},{x: ((animationsteps[currentstep][0][0][0]+(spacexby/2)) * xratio + (animationsteps[currentstep][0][1][0]+(spacexby/2)) * xratio)/2,y: ((animationsteps[currentstep][0][0][1]+spaceyby*2) * yratio+(animationsteps[currentstep][0][1][1]+spaceyby*2) * yratio)/2},{x: (animationsteps[currentstep][0][1][0]+(spacexby/2)) * xratio, y: (animationsteps[currentstep][0][1][1]+spaceyby) * yratio},10)
      break;
    case 2:
      // wheel caesar
      
      break;
    case 3:
     //Playfair
      Selected(frontctx, animationsteps[currentstep][currentmicrostep][0][0] * xratio, animationsteps[currentstep][currentmicrostep][0][1] * yratio, spacexby, spaceyby, "red")
      Selected(frontctx, animationsteps[currentstep][currentmicrostep][1][0] * xratio, animationsteps[currentstep][currentmicrostep][1][1] * yratio, spacexby, spaceyby, "green")
      break;
    default:
  }
  updateDescription()
  }



  // move step forward
  function skipRight() {
    if (!animationsteps.length) return
    if (running.on) {
      stop()
      return
    }
    if (currentstep < animationsteps.length - 1) {
      currentstep++;
    }
    currentmicrostep = 0
    frontctx.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);

    switch (Number.parseInt(backres.Cipher)) {
      case 1:
        // normal caesar
        drawcurvewitharrow(frontctx,{x: (animationsteps[currentstep][0][0][0]+(spacexby/2)) * xratio,y:(animationsteps[currentstep][0][0][1]+spaceyby) * yratio},{x: ((animationsteps[currentstep][0][0][0]+(spacexby/2)) * xratio + (animationsteps[currentstep][0][1][0]+(spacexby/2)) * xratio)/2,y: ((animationsteps[currentstep][0][0][1]+spaceyby*2) * yratio+(animationsteps[currentstep][0][1][1]+spaceyby*2) * yratio)/2},{x: (animationsteps[currentstep][0][1][0]+(spacexby/2)) * xratio, y: (animationsteps[currentstep][0][1][1]+spaceyby) * yratio},10)
        break;
      case 2:
        // wheel caesar
        break;
      case 3:
       //Playfair
       for(let i = 0; i < animationsteps[currentstep].length; i++){
        Selected(frontctx, animationsteps[currentstep][i][0][0] * xratio, animationsteps[currentstep][i][0][1] * yratio, spacexby, spaceyby, "red")
        Selected(frontctx, animationsteps[currentstep][i][1][0] * xratio, animationsteps[currentstep][i][1][1] * yratio, spacexby, spaceyby, "green")
       }
        break;
      default:
    }
    updateDescription()
  }

  function updateDescription(){
    let index = backres.Ani[currentstep].length*(currentstep+1)
    let indexfrom = backres.Ani[currentstep].length*(currentstep+1) - backres.Ani[currentstep].length
    //whole
    setTextBefore(backres.TextBefore.slice(0,index))
    setTextNow(backres.TextNow.slice(0,index))
    //step
    setStepBefore(backres.TextBefore.slice(indexfrom,index))
    setStepNow(backres.TextNow.slice(indexfrom,index))
  }

  // calling timeout before resizing
  window.addEventListener('resize', debounce(handleResize, 500))
  //creating canvas back and overlay references
  let canvas!: { getContext: (arg0: string) => any; width: number; height: number; }
  let overlaycanvas!: { getContext: (arg0: string) => any; width: number; height: number; }
  // Mounting after dom was rendered
  onMount(() => {
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
        <div>
          <button onClick={() => { setEncrypt(!encrypt()) }} class=" bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{(encrypt()) ? "Encipher" : "Decipher"}</button>    <button onClick={switchOutputInput} class=" bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Switch</button>
        </div>
        <br />
        <label for="encrypttext">Text to Cipher</label>
        <br />
        <input name="encrypttext" value={textEncryption()} class="text-black bg-gray-50 border border-gray-30 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onInput={(e) => {
            setTextEncryption(e.target.value);
          }}
        />
        <label for="encrypttextkey">Cipher Key</label>
        <input name="encrypttextkey" value={textEncryptionKey()} class="text-black bg-gray-50 border border-gray-30 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onInput={(e) => {
            setTextEncryptionKey(e.target.value);
          }}
        />

        <label for="output">Output</label>
        <input name="output" class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-gray-100 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" value={encryptedText()} readOnly />

        <button onClick={onSubmit} type="submit" class=" bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
      </Menu>
      <Menu title={"AniMenu"} itemid={"animenu"} minwidth={450} minheight={81}>
        <div >
          <div>
          <button onClick={skipLeft} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"><FiChevronsLeft /></button>
          <button onClick={stepLeft} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"><FiChevronLeft /></button>
          <button onClick={stepRight} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"><FiChevronRight /> </button>
          <button onClick={skipRight} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"><FiChevronsRight /> </button>
          <button onClick={autoRunRight} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"><div class="flex"><FiChevronsRight /><FiChevronsRight /></div></button>
        </div>
        <div class="w-full">
        <div class="flex justify-around items-center flex-row"> <h1>{textbefore()}</h1><FiArrowRight/><h1>{textnow()}</h1></div>
        <div class="flex justify-around items-center flex-row"> <h1>{stepbefore()}</h1><FiArrowRight/><h1>{stepnow()}</h1></div>
        </div>
        </div>
      </Menu>

      <Menu title={"Rules"} itemid={"rulesmenu"} minwidth={200}>
        <div class="w-full">
          <div class=" overflow-auto max-h-40 ">
          <ul class="list-inside list-disc">
            {rules().map((rule) =>  <li>{rule}</li>)}
          </ul>
          </div>
        </div>
      </Menu>

      <Menu title={"Steps"} itemid={"stepsmenu"} minwidth={200}>
        <div class="w-full">
        
        <div class=" overflow-auto max-h-40 ">
          {/* //content */}
        </div>

        </div>
      </Menu>

    </div>
    
  );
}

render(() => <App />, document.getElementById("root") as HTMLElement);
