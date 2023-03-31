import { render } from "solid-js/web";
import { onMount } from "solid-js";
import { Component } from "solid-js";
import { Suspense, createSignal } from "solid-js";
import { DropdownCipher } from "./components/dropdown";
import { createPlayfair } from "./lib/createPlayfair";
import { createCaesar } from "./lib/createCaesar";
import { createHomo } from "./lib/createHomo"
import { createCaesarWheel } from "./lib/createCaesarWheel";

import { Selected } from "./lib/Markup";
import { BezPoints } from "./lib/cubic_bezier";

import { Showcaseskip, Showcasestep } from "./lib/control_step";

import { Animate, Animate_T, Animate_Circ, Animate_Circ_Arr } from "./lib/Animations";

import { setCaesar, setHomo, setPlayfair, setCaesarCircle } from "./lib/setCipher";

import "./index.css"
import Canvas from "./components/canvas";

import * as popis from './popis.json';

import { Menu } from "./components/menu";
import { FiChevronsLeft, FiChevronLeft, FiChevronRight, FiChevronsRight, FiArrowRight } from "solid-icons/fi";
import { Slider } from "./components/slider";
import { CanvasMenu } from "./components/canvas_window";




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
  const [size, setSize] = createSignal({ width: 800, height: 800 });

  //form inputs
  const [textEncryption, setTextEncryption] = createSignal('');
  const [textEncryptionKey, setTextEncryptionKey] = createSignal('')
  const [encryptedText, setEncryptedText] = createSignal('')

  //closure for graphical creation of cipher
  let currentfunction: ((key: any, encrypt: boolean) => void) | ((display: any, spacexby: number, spaceyby: number, fontsize: number) => void) | ((arg0: string | string[] | string[][], arg1: number | boolean, arg2: number | undefined, arg3: number | undefined) => void)

  //closure for generation of steps for animation
  let currentfunctionanimation: any

  //canvas context
  let backctx: any
  let frontctx: any

  // id of cipher
  let currentcipher: string;

  //reset
  let submit = false;

  let [encrypt, setEncrypt] = createSignal(true);

  //rescaling animation + sizes
  let xratio: number = 1
  let yratio: number = 1

  let spacex = 0
  let spacey = 0

  let spacexby = 0
  let spaceyby = 0

  let fontsize = 60;



  //animation control
  let currentstep = 0;
  let currentmicrostep = 0;

  //animation running reference
  let running = {
    on: false
  };

  interface progre {
   animationsteps : (number[][][])[];
   savedsteps: any;
}

  let daobj : progre = {
    animationsteps : [],
    savedsteps : []
  }

  //rules for cipher
  let [rules, setRules] = createSignal([]);

  //Description
  let [textbefore, setTextBefore] = createSignal('')
  let [textnow, setTextNow] = createSignal('')

  let [stepnow, setStepNow] = createSignal('')
  let [stepbefore, setStepBefore] = createSignal('')

  let encrypttext = false

  let encryptkey: string;
  //

  //steps

  let [showsteps, setShowSteps] = createSignal([])


  // gv that holds size on which it was generated
  let ongeneratedsize = { width: 0, height: 0 }

  let [duration, setDuration] = createSignal(3000)

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
        backres = data
        console.log(data)
      })
  }
  //choosing cipher from menu
  const refCallback = (el: any) => {
    currentcipher = el



    switch (Number.parseInt(el)) {
      case 1:
        currentfunction = createCaesar(backctx)
        currentfunctionanimation = setCaesar(daobj)
        break;
      case 2:
        currentfunction = createCaesarWheel(backctx)
        currentfunctionanimation = setCaesarCircle(daobj)
        break;
      case 3:
        currentfunction = createPlayfair(backctx)
        currentfunctionanimation = setPlayfair(daobj)
        break;
      case 4:
        currentfunction = createHomo(backctx)
        currentfunctionanimation = setHomo(daobj)
        // Homo Cipher
        break;
      default:
    }
  };

  const canvasCallback = async (cansize: { w: number, h: number }) => {
    if (size().width != cansize.w || size().height != cansize.h) {
      setSize({ width: cansize.w, height: cansize.h })


      if (currentfunction && submit) {
        xratio = size().width / ongeneratedsize.width
        yratio = size().height / ongeneratedsize.height

        spacexby = size().width / spacex
        spaceyby = size().height / spacey

        //canvas clears properties on resize
        resetContext(backctx)
        resetContext(frontctx)

        fontsize = (size().width/(spacex*1.5))*(spacex/spacey)
      
        currentfunction(backres.Display, spacexby, spaceyby, fontsize)

        if(parseInt(currentcipher) == 2){
          let radius = (backctx.canvas.clientHeight / 2)
          running.on = true
          let imageData = backctx.getImageData(0, 0, backctx.canvas.clientWidth, backctx.canvas.clientHeight);
          if (encrypttext) {
            await Animate_Circ(backctx, 0, (13.84 * -Number.parseInt(encryptkey)), radius, duration(), running, imageData, backres.Display)
          } else {
            await Animate_Circ(backctx, 0, 13.84 * Number.parseInt(encryptkey), radius, duration(), running, imageData, backres.Display)
          }
          running.on = false
        }
        Showcaseskip(frontctx,Number.parseInt(backres.Cipher),daobj.animationsteps,currentstep,currentmicrostep,xratio,yratio,spacexby,spaceyby)
      }


    }
  }

  const sliderCallback = (d: number) => {
    setDuration(d)
  }

  //switch input output
  function switchOutputInput() {
    let temp = encryptedText()
    setEncryptedText(textEncryption())
    setTextEncryption(temp)
  }

  // Submit form
  async function onSubmit() {
    if(running.on == true){
    return
    }
    //check if key text to encrypt and cipher was chosen // NOT FOR HOMOCIPHER textEncryptionKey()
    if (textEncryption() && currentcipher) {

      //set form submit to true
      submit = true

      //clear canvas settings
      resetContext(backctx)
      resetContext(frontctx)

      //clear steps
      setShowSteps([])
      daobj.savedsteps = []

      //clear step show under animaenu
      setTextBefore(' ')
      setTextNow(' ')
      setStepBefore(' ')
      setStepNow(' ')

      // add back after edit currentfunction
      if (submit) {

        //clear animation steps
        daobj.animationsteps = [];

        //clear canvas
        backctx.clearRect(0, 0, canvas.width, canvas.height);
        frontctx.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);


        // backend response
        await res(new Postreq(currentcipher, textEncryption(), textEncryptionKey()), encrypt())

        // create animation by cipher
        switch (parseInt(currentcipher)) {
          case 1:
            spacex = 26
            spacey = 26
            setRules(popis.caesar.rules)
            break;
          case 2:
            setRules(popis.caesar.rules)
            break;
          case 3:
            spacex = 5
            spacey = 5
            setRules(popis.playfair.rules)
            break;
          case 4:
            let max_value = -1;
            let y = 0
            for (let key in backres.Display) {
              let value = backres.Display[key];
              if (value.length > max_value) {
                max_value = value.length;
              }
              y++;
              setTextEncryptionKey(JSON.stringify(backres.Display));
              setRules(popis.homo.rules)
            }
            spacex = y
            // first is also a row
            spacey = max_value + 1
            break;
          default:
        }

        ongeneratedsize = { width: size().width, height: size().height }

        spacexby = size().width / spacex
        spaceyby = size().height / spacey

        xratio = 1
        yratio = 1

        setEncryptedText(backres.TextNow)
        // call to create graphics for given cipher
    
        fontsize = (size().width/(spacex*1.5))*(spacex/spacey)
  
    
      
        currentfunction(backres.Display, spacexby, spaceyby, fontsize)

        encrypttext = encrypt()
        encryptkey = textEncryptionKey()

        currentfunctionanimation(backres.Ani,backres.Display,encrypttext,spacexby,spaceyby,backctx,Number.parseInt(encryptkey),encrypttext)

        // Spin for Caesar wheel
        if(parseInt(currentcipher) == 2){
          let radius = (backctx.canvas.clientHeight / 2) * yratio
          running.on = true
          let imageData = backctx.getImageData(0, 0, backctx.canvas.clientWidth, backctx.canvas.clientHeight);
          if (encrypttext) {
            await Animate_Circ(backctx, 0, -(13.84 * Number.parseInt(encryptkey)), radius, duration(), running, imageData, backres.Display)
          } else {
            await Animate_Circ(backctx, 0, 13.84 * Number.parseInt(encryptkey), radius, duration(), running, imageData, backres.Display)
          }
          running.on = false
        }

        //first
        currentmicrostep = 0
        currentstep = 0
        updateDescription()
        UpdateStep()
        Showcasestep(frontctx,Number.parseInt(backres.Cipher),daobj.animationsteps,currentstep,currentmicrostep,xratio,yratio,spacexby,spaceyby)
      }
    }


  }
  //function to reset canvas settings
  function resetContext(ctx: { resetTransform: () => void; strokeStyle: string; lineWidth: number; setLineDash: (arg0: never[]) => void; fillStyle: string; }) {
    ctx.resetTransform();
    ctx.strokeStyle = "white"; ctx.lineWidth = 1; ctx.setLineDash([]);
    ctx.fillStyle = 'white';
  }

  // run animation forward
  async function autoRunRight() {
    //checking if animation is already running
    if (running.on) {
      return
    }
    // if isnt running run
    running.on = true

    let first_g = false
    // giving for loops a label to break from it later
    cancel:
    for (let i = currentstep; i < daobj.animationsteps.length; i++) {
      currentstep = i
      updateDescription()

      if(first_g){
        UpdateStep()
      }
    


      switch (Number.parseInt(backres.Cipher)) {
        case 1:
          // normal caesar
          let cp = { x: ((daobj.animationsteps[i][0][0][0] + (spacexby / 2)) * xratio + (daobj.animationsteps[i][0][1][0] + (spacexby / 2)) * xratio) / 2, y: ((daobj.animationsteps[i][0][0][1] + spaceyby * 2) * yratio + (daobj.animationsteps[i][0][1][1] + spaceyby * 2) * yratio) / 2 }
          let cBez1 = [{ x: (daobj.animationsteps[i][0][0][0] + (spacexby / 2)) * xratio, y: (daobj.animationsteps[i][0][0][1] + spaceyby) * yratio }, cp, cp, { x: (daobj.animationsteps[i][0][1][0] + (spacexby / 2)) * xratio, y: (daobj.animationsteps[i][0][1][1] + spaceyby) * yratio }]
          let cPoints = BezPoints([{ x: (daobj.animationsteps[i][0][0][0] + (spacexby / 2)) * xratio, y: (daobj.animationsteps[i][0][0][1] + spaceyby) * yratio }, cp, cp, { x: (daobj.animationsteps[i][0][1][0] + (spacexby / 2)) * xratio, y: (daobj.animationsteps[i][0][1][1] + spaceyby) * yratio }], 5000)
          await Animate_T(frontctx, cBez1, cPoints, 0, 1, duration(), running)
          break;
        case 2:
          // wheel caesar
          await Animate_Circ_Arr(frontctx,{x: daobj.animationsteps[currentstep][0][0][0] * yratio, y: daobj.animationsteps[currentstep][0][0][1] * yratio}, { x: (daobj.animationsteps[currentstep][0][1][0]) * yratio, y: (daobj.animationsteps[currentstep][0][1][1]) * yratio }, duration(), running)
          break;
        case 3:
          //Playfair

          for (let j = currentmicrostep; j < daobj.animationsteps[i].length; j++) {
            // if to check if animation should be on X or Y axis
            currentmicrostep = j
            if (daobj.animationsteps[i][j][0][0] == daobj.animationsteps[i][j][1][0]) {
              //"sameROW"
              await Animate(frontctx, daobj.animationsteps[i][j][0][1] * yratio, daobj.animationsteps[i][j][1][1] * yratio, undefined, daobj.animationsteps[i][j][0][0] * xratio, spacexby, spaceyby, duration(), running)
            } else {
              //"column"
              await Animate(frontctx, daobj.animationsteps[i][j][0][0] * xratio, daobj.animationsteps[i][j][1][0] * xratio, daobj.animationsteps[i][j][1][1] * yratio, undefined, spacexby, spaceyby, duration(), running)
            }

            if (!running.on) {
              break cancel;
            }
          }
          break;
        case 4:
          await Animate(frontctx, daobj.animationsteps[i][0][0][1] * yratio, daobj.animationsteps[i][0][1][1] * yratio, undefined, daobj.animationsteps[i][0][0][0] * xratio, spacexby, spaceyby, duration(), running)
          break;
      }
      // move in current step
      currentmicrostep = 0
      first_g = true
    }
    if (running.on) {
      currentmicrostep = daobj.animationsteps[currentstep].length
    }
    running.on = false
  }

  // stop animation from running
  function stop() {
    frontctx.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);
    Selected(frontctx, daobj.animationsteps[currentstep][currentmicrostep][0] * xratio, daobj.animationsteps[currentstep][currentmicrostep][1] * yratio, spacexby, spaceyby)
    running.on = false
  }


  function UpdateStep() {
    let temp = [...showsteps()]
    if(daobj.savedsteps[currentstep][1]){
      temp.unshift(daobj.savedsteps[currentstep][0][0]+"->"+daobj.savedsteps[currentstep][0][1] +" "+ daobj.savedsteps[currentstep][1])
    }else{
      temp.unshift(daobj.savedsteps[currentstep][0][0]+"->"+daobj.savedsteps[currentstep][0][1])
    }
    setShowSteps(temp)
   
  }

  // move to one step before
  function skipLeft() {
    if (!daobj.animationsteps.length) return
    if (running.on) {
      stop()
      return
    }
    if (currentstep - 1 > -1) {
      currentstep--;
      //log
      UpdateStep()
      //
    }
    currentmicrostep = 0
    Showcaseskip(frontctx,Number.parseInt(backres.Cipher),daobj.animationsteps,currentstep,currentmicrostep,xratio,yratio,spacexby,spaceyby)
    updateDescription()
  }
  // move to microstep before
  function stepLeft() {
    if (!daobj.animationsteps.length) return
    if (running.on) {
      stop()
      currentmicrostep++
      return
    }

    currentmicrostep--
    if (currentmicrostep < 0) {
      if (currentstep - 1 > -1) {
        currentstep--
        //log
        UpdateStep()
        //
        currentmicrostep = daobj.animationsteps[currentstep].length - 1
      } else {
        currentmicrostep = 0
      }
    }
    Showcasestep(frontctx,Number.parseInt(backres.Cipher),daobj.animationsteps,currentstep,currentmicrostep,xratio,yratio,spacexby,spaceyby)
    updateDescription()
  }



  // move a microstep forward
  function stepRight() {
    if (!daobj.animationsteps.length) return
    if (running.on) {
      stop()
      currentmicrostep--
      return
    }


    currentmicrostep++


    if (currentmicrostep > daobj.animationsteps[currentstep].length - 1) {
      if (currentstep + 1 < daobj.animationsteps.length) {
        currentstep++
        //log
        UpdateStep()
        //
        currentmicrostep = 0
      } else {
        currentmicrostep = daobj.animationsteps[currentstep].length - 1
      }
    }
    Showcasestep(frontctx,Number.parseInt(backres.Cipher),daobj.animationsteps,currentstep,currentmicrostep,xratio,yratio,spacexby,spaceyby)
    updateDescription()
  }



  // move step forward
  function skipRight() {
    if (!daobj.animationsteps.length) return
    if (running.on) {
      stop()
      return
    }
    if (currentstep < daobj.animationsteps.length - 1) {
      currentstep++;
      //log
      UpdateStep()
      //
    }
    currentmicrostep = 0
    Showcaseskip(frontctx,Number.parseInt(backres.Cipher),daobj.animationsteps,currentstep,currentmicrostep,xratio,yratio,spacexby,spaceyby)
    updateDescription()
  }

  function updateDescription() {
   
    // daobj.savedsteps[currentstep][0][0].length+"->"+daobj.savedsteps[currentstep][0][1].length
    //whole show max 14 chars at once

    let max = daobj.savedsteps[currentstep][0][0].length + daobj.savedsteps[currentstep][0][1].length
    let from = Math.floor(16/max)
   
    setTextBefore(backres.TextBefore.slice(Math.floor((currentstep*daobj.savedsteps[currentstep][0][0].length)/max),(currentstep)*daobj.savedsteps[currentstep][0][0].length))
    // setTextNow(, (currentstep+1)*daobj.savedsteps[currentstep][0][1].length))
  
    // //step
    setStepBefore(daobj.savedsteps[currentstep][0][0])
    setStepNow(daobj.savedsteps[currentstep][0][1])
  }
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
        <CanvasMenu title={"Canvas"} itemid={"canvas"} PASSREF={canvasCallback} minwidth={800} minheight={800}>
          <Canvas ref={canvas} width={size().width} height={size().height} overlay={false} />
          <Canvas ref={overlaycanvas} width={size().width} height={size().height} overlay={true} />
        </CanvasMenu>
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
            <div>       <span>Duration per step : {duration()}</span></div>

            <Slider PASSREF={sliderCallback} Initial={duration()}></Slider>

          </div>
          <div class="w-full">
            <div class="flex justify-around items-center flex-row"> <h1>{textbefore()}</h1><FiArrowRight /><h1>{textnow()}</h1></div>
            <div class="flex justify-around items-center flex-row"> <h1>{stepbefore()}</h1><FiArrowRight /><h1>{stepnow()}</h1></div>
          </div>
        </div>
      </Menu>

      <Menu title={"Rules"} itemid={"rulesmenu"} minwidth={200}>
        <div class="w-full">
          <div class=" overflow-auto max-h-40 ">
            <ul class="list-inside list-disc">
              {rules().map((rule) => <li>{rule}</li>)}
            </ul>
          </div>
        </div>
      </Menu>

      <Menu title={"Steps"} itemid={"stepsmenu"} minwidth={200}>
        <div class="w-full">
          <div class=" overflow-auto max-h-40 ">
            <ul class="list-inside list-disc">
              {showsteps().map((step) => <li>{step}</li>)}
            </ul>
          </div>
        </div>
      </Menu>
    </div>
  );
}
render(() => <App />, document.getElementById("root") as HTMLElement);
