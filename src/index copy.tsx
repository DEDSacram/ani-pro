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
import { Menu } from "./components/menu";
import { FiChevronsLeft, FiChevronLeft, FiChevronRight, FiChevronsRight } from "solid-icons/fi";

class Postreq {
  public Cipher: number;
  public Text: string;
  public Key: string | number;
  constructor(cipher: number, text: string, key: string | number) {
    this.Cipher = cipher
    this.Text = text
    this.Key = key
  }
}
interface Postres {
  TextBefore: string;
  TextNow: string;
}
export const App: Component = () => {
  //window size
  const [size, setSize] = createSignal({ width: document.body.clientWidth, height: document.body.clientHeight });
  // ciphers
  const [textEncryption, setTextEncryption] = createSignal('');
  const [textEncryptionKey, setTextEncryptionKey] = createSignal('')
  const [encryptedText, setEncryptedText] = createSignal('')
  let currentfunction
  let currentfunctionanimation
  let backctx: { clearRect?: any; canvas?: any; textAlign?: any; textBaseline?: any; font?: any; beginPath?: any; rect?: any; stroke?: any; fillText?: any; translate?: any; resetTransform?: () => void; strokeStyle?: string; lineWidth?: number; setLineDash?: (arg0: never[]) => void; fillStyle?: string; }
  let frontctx: { clearRect?: any; resetTransform?: () => void; strokeStyle?: string; lineWidth?: number; setLineDash?: (arg0: never[]) => void; fillStyle?: string; }
  let currentcipher: number;
  //reset
  let submit = false;

  let [encrypt, setEncrypt] = createSignal(true);

  //rescaling animation

  let xratio = 1
  let yratio = 1

  let spacex = 0
  let spacey = 0

  let currentstep = 0;
  let currentmicrostep = 0;

  let running = {
    left: false,
    right: false,
    on: false
  };


  let ongeneratedsize = { width: 0, height: 0 }

  let polyalphabetic;

  let animationsteps = []

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
      })
  }


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
    if (submit) {
      xratio = document.documentElement.clientWidth / ongeneratedsize.width
      yratio = document.documentElement.clientHeight / ongeneratedsize.height
    }
    setSize({ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight })
    if (currentfunction && submit) {
      currentfunction(textEncryptionKey(), encrypt())

      let spacexby = size().width / spacex
      let spaceyby = size().height / spacey
      Selected(frontctx, animationsteps[currentstep][currentmicrostep][0] * xratio, animationsteps[currentstep][currentmicrostep][1] * yratio, spacexby, spaceyby)
    }

  }

  function switchOutputInput() {
    let temp = encryptedText()
    setEncryptedText(textEncryption())
    setTextEncryption(temp)

  }

  async function onSubmit() {
    if (textEncryption() && textEncryptionKey() && currentcipher) {
      submit = true
      if (currentfunction && submit) {
        animationsteps = []; // clear ani steps

        backctx.clearRect(0, 0, canvas.width, canvas.height);
        frontctx.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);

        polyalphabetic = currentfunction(textEncryptionKey())

        resetContext(backctx)
        resetContext(frontctx)
        await res(new Postreq(currentcipher, textEncryption(), textEncryptionKey()), encrypt())
        setEncryptedText(backres.TextNow)


        switch (Number.parseInt(currentcipher)) {
          case 1:
            currentfunctionanimation(backres.TextBefore, backres.TextNow, textEncryptionKey(), encrypt())
            break;
          case 2:
            currentfunctionanimation(backres.TextBefore, backres.TextNow, textEncryptionKey(), encrypt())
            break;
          case 3:
            currentfunctionanimation(backres.TextBefore, backres.TextNow, polyalphabetic, encrypt())
            break;
          default:
            console.log("FAIL")
        }


        currentmicrostep = 0
        currentstep = 0
        let spacexby = size().width / spacex
        let spaceyby = size().height / spacey
        frontctx.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);
        Selected(frontctx, animationsteps[currentstep][currentmicrostep][0] * xratio, animationsteps[currentstep][currentmicrostep][1] * yratio, spacexby, spaceyby)
        // currentfunctionanimation(backres.TextBefore,backres.TextNow,textEncryptionKey(),encrypt())


        ongeneratedsize = { width: size().width, height: size().height }

      }
    }
    function resetContext(ctx: { resetTransform: () => void; strokeStyle: string; lineWidth: number; setLineDash: (arg0: never[]) => void; fillStyle: string; }) {
      ctx.resetTransform();
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1; ctx.setLineDash([]);
      ctx.fillStyle = 'black';
    }
  }
  function setPlayfair() {
    return function GenerateStepsPlayfair(text: string, encrypted: string, key: any, encrypt: boolean) {
      let temp = []
      for (let i = 0; i < 5; i++) {
        let temp2 = []
        for (let j = 0; j < 5; j++) {
          temp2.push(key[(i * 5) + j])
        }
        temp.push(temp2)
      }
      if (text.length % 2 == 1) {
        text += 'X'
      }
      text = text.replace('J', 'I')

      let spacexby = size().width / spacex
      let spaceyby = size().height / spacey

      for (let y = 1; y < text.length; y += 2) {
        let step = []
        let x1 = checkArray(temp, text[y - 1])
        let x2 = checkColumn(temp, text[y], x1[0])
        if (x1 && x2) {
          step.push([[x1[0]*spacexby,x1[1]*spaceyby], checkColumn(temp, encrypted[y - 1], x1[0])], [[x2[0]*spacexby,x2[1]*spaceyby], checkColumn(temp, encrypted[y], x2[0])])
        }
        else if (x1 && (x2 = checkRow(temp, text[y], x1[1]))) {
          step.push([[x1[0]*spacexby,x1[1]*spaceyby], checkRow(temp, encrypted[y - 1], x1[1])], [[x2[0]*spacexby,x2[1]*spaceyby], checkRow(temp, encrypted[y], x2[1])])
        }
        else {
          x2 = checkArray(temp, text[y])
          step.push([[x1[0]*spacexby,x1[1]*spaceyby], [x2[0]*spacexby, x1[1]*spaceyby]], [[x2[0]*spacexby,x2[1]*spaceyby], [x1[0]*spacexby,x2[1]*spaceyby ]])
        }
        animationsteps.push(step)
      }



      // Functional 

      // for (let y = 1; y < text.length; y += 2) {
      //   let step = []
      //   let x1 = checkArray(temp, text[y - 1])
      //   let x2 = checkColumn(temp, text[y], x1[0])
      //   if (x1 && x2) {
      //     step.push([x1, checkColumn(temp, encrypted[y - 1], x1[0])], [x2, checkColumn(temp, encrypted[y], x2[0])])
      //   }
      //   else if (x1 && (x2 = checkRow(temp, text[y], x1[1]))) {
      //     step.push([x1, checkRow(temp, encrypted[y - 1], x1[1])], [x2, checkRow(temp, encrypted[y], x2[1])])
      //   }
      //   else {
      //     x2 = checkArray(temp, text[y])
      //     step.push([x1, [x2[0], x1[1]]], [x2, [x1[0],x2[1] ]])
      //   }
      //   animationsteps.push(step)
      // }
      // console.log(animationsteps)
    }
  }
  function checkArray(arr, find) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        if (arr[i][j] == find) {
          return [j, i]
        }
      }
    }
    return undefined
  }
  function checkColumn(arr, find, col) {
    for (let r = 0; r < arr.length; r++) {
      if (arr[r][col] == find) {
        return [col, r]
      }
    }
    return undefined
  }
  function checkRow(arr, find, row) {
    for (let r = 0; r < arr.length; r++) {
      if (arr[row][r] == find) {
        return [r, row]
      }
    }
    return undefined
  }
  function setCaesar() {
    return function GenerateStepsCaesar(text: string, encrypted: string, key: number, encrypt: boolean) {

      let echarindex = 0
      let tcharindex = 0

      //pohyb doleva
      let lettersnum = []

      if (encrypt) {
        for (let i = 0; i < text.length; i++) {
          let isupper = false
          if (text[i] == text[i].toUpperCase()) {
            isupper = true
          }
          if (isupper) {
            tcharindex = text.charCodeAt(i) - 65
            echarindex = encrypted.charCodeAt(i) - 65
          } else {
            tcharindex = text.charCodeAt(i) - 97
            echarindex = encrypted.charCodeAt(i) - 97
          }

          let letters = [tcharindex]
          //Move by 1 to include encrypted char
          while (tcharindex != echarindex) {
            tcharindex++
            if (tcharindex > 25) {
              tcharindex = 0
            }
            letters.push(tcharindex)
          }
          lettersnum.push(letters)
        }
      }
      //pohyb doprava
      else {
        for (let i = 0; i < text.length; i++) {
          let isupper = false
          if (text[i] == text[i].toUpperCase()) {
            isupper = true
          }
          if (isupper) {
            tcharindex = text.charCodeAt(i) - 65
            echarindex = encrypted.charCodeAt(i) - 65
          } else {
            tcharindex = text.charCodeAt(i) - 97
            echarindex = encrypted.charCodeAt(i) - 97
          }

          let letters = [tcharindex]
          //Move by 1 to include encrypted char
          while (tcharindex != echarindex) {
            tcharindex--
            if (tcharindex < 0) {
              tcharindex = 25
            }
            letters.push(tcharindex)
          }
          lettersnum.push(letters)
        }
      }
      let sizeWidth = backctx.canvas.clientWidth;
      let spacexby = sizeWidth / 26
      for (let i = 0; i < lettersnum.length; i++) {
        let x = []
        for (let j = 0; j < lettersnum[i].length; j++) {
          // x.push([spacexby * (lettersnum[i][j]+1),0])
          x.push([spacexby * lettersnum[i][j], 0])
        }
        animationsteps.push(x)
      }

    }
  }
  function setCaesarCircle() {
    return function GenerateStepsCaesar(text: string, encrypted: string, key: number) {
    }
  }

  function easeInOutQuart(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  }
  async function Animate(ctx, from, to, width, height, duration, states, interrupt) {
    return await new Promise(resolve => {

      var start = new Date().getTime();
      var innertimer = setInterval(function () {
        if (!running.on) {
          clearTimeout(innertimer)
          Promise.resolve(0)
        }
        if (interrupt == "left" && !states.left) {
          clearTimeout(innertimer)
          Promise.resolve(0)
          running.on = false
        }
        if (interrupt == "right" && !states.right) {
          clearTimeout(innertimer)
          Promise.resolve(0)
          running.on = false
        }
        var time = new Date().getTime() - start;
        var x = easeInOutQuart(time, from, to - from, duration);
        ctx.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);
        ctx.beginPath()
        ctx.fillStyle = "white";
        ctx.rect(x, 0, width, height);
        ctx.fill()
        if (time >= duration) {
          resolve('done');
          clearInterval(innertimer)
        }
      }, 1000 / 60);
    });
  }





  async function autoRunLeft() {
    if (running.on && running.left) {
      return
    }
    running.left = true
    running.right = false
    running.on = true

    // letters
    cancel:
    for (currentstep; currentstep > -1; currentstep--) {
      for (currentmicrostep; currentmicrostep > -1; currentmicrostep--) {
        if (currentmicrostep - 1 < 0) {
          break
        }
        let spacexby = size().width / spacex
        let spaceyby = size().height / spacey
        await Animate(frontctx, animationsteps[currentstep][currentmicrostep][0] * xratio, animationsteps[currentstep][currentmicrostep - 1][0] * xratio, spacexby, spaceyby, 1000, running, "left")


      }
      currentmicrostep = animationsteps[currentstep - 1].length - 1
      if (running.right || !running.on) {
        break cancel;
      }
    }
  }
  async function autoRunRight() {
    if (running.on && running.right) {
      return
    }
    running.left = false
    running.right = true
    running.on = true

    cancel:
    for (currentstep; currentstep < animationsteps.length; currentstep++) {
      //letter steps
      for (currentmicrostep; currentmicrostep < animationsteps[currentstep].length; currentmicrostep++) {
        if (currentmicrostep + 1 == animationsteps[currentstep].length) {
          break
        }
        let spacexby = size().width / spacex
        let spaceyby = size().height / spacey
        await Animate(frontctx, animationsteps[currentstep][currentmicrostep][0] * xratio, animationsteps[currentstep][currentmicrostep + 1][0] * xratio, spacexby, spaceyby, 1000, running, "right")
      }
      currentmicrostep = 0
      if (running.left || !running.on) {
        break cancel;
      }
    }
  }

  // const recursiveCall = async () => {
  //   return await new Promise((resolve) => {
  //     setTimeout(function () {
  //       if (pauseexec()) {
  //         return resolve(recursiveCall())
  //       } else {
  //         return resolve("done")
  //       }
  //     }, 200);

  //   })
  // }
  function stop() {
    running.on = false
  }
  function Selected(ctx, x, y, width, height) {
    ctx.beginPath()
    ctx.fillStyle = "white";
    ctx.rect(x, y, width, height);
    ctx.fill()
  }
  function skipLeft() {
    stop()
    if (currentstep - 1 > -1) {
      currentstep--;
    }
    // currentmicrostep=animationsteps[currentstep].length - 1
    currentmicrostep = 0
    let spacexby = size().width / spacex
    let spaceyby = size().height / spacey
    frontctx.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);
    Selected(frontctx, animationsteps[currentstep][currentmicrostep][0] * xratio, animationsteps[currentstep][currentmicrostep][1] * yratio, spacexby, spaceyby)
  }
  function stepLeft() {
    stop()
    currentmicrostep--
    if (currentmicrostep < 0) {
      if (currentstep - 1 > -1) {
        currentstep--
        currentmicrostep = animationsteps[currentstep].length - 1
      } else {
        currentmicrostep = 0
      }
    }
    let spacexby = size().width / spacex
    let spaceyby = size().height / spacey
    frontctx.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);
    if(Array.isArray(animationsteps[currentstep][currentmicrostep][0])){
      Selected(frontctx, animationsteps[currentstep][currentmicrostep][0][0] * xratio, animationsteps[currentstep][currentmicrostep][0][1] * yratio, spacexby, spaceyby)
      Selected(frontctx, animationsteps[currentstep][currentmicrostep][1][0] * xratio, animationsteps[currentstep][currentmicrostep][1][1] * yratio, spacexby, spaceyby)
    }else{
      Selected(frontctx, animationsteps[currentstep][currentmicrostep][0] * xratio, animationsteps[currentstep][currentmicrostep][1] * yratio, spacexby, spaceyby)
    }

  }
  function stepRight() {
    stop()
    currentmicrostep++
    if (currentmicrostep > animationsteps[currentstep].length - 1) {
      if (currentstep + 1 < animationsteps.length) {
        currentstep++
        currentmicrostep = 0
      } else {
        currentmicrostep = animationsteps[currentstep].length - 1
      }
    }
    let spacexby = size().width / spacex
    let spaceyby = size().height / spacey
    frontctx.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);
    if(Array.isArray(animationsteps[currentstep][currentmicrostep][0])){
      Selected(frontctx, animationsteps[currentstep][currentmicrostep][0][0] * xratio, animationsteps[currentstep][currentmicrostep][0][1] * yratio, spacexby, spaceyby)
      Selected(frontctx, animationsteps[currentstep][currentmicrostep][1][0] * xratio, animationsteps[currentstep][currentmicrostep][1][1] * yratio, spacexby, spaceyby)
    }else{
      Selected(frontctx, animationsteps[currentstep][currentmicrostep][0] * xratio, animationsteps[currentstep][currentmicrostep][1] * yratio, spacexby, spaceyby)
    }
  }
  function skipRight() {
    stop()
    if (currentstep < animationsteps.length - 1) {
      currentstep++;
    }
    currentmicrostep = 0
    let spacexby = size().width / spacex
    let spaceyby = size().height / spacey
    frontctx.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);
    Selected(frontctx, animationsteps[currentstep][currentmicrostep][0] * xratio, animationsteps[currentstep][currentmicrostep][1] * yratio, spacexby, spaceyby)
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
          <button onClick={() => { setEncrypt(!encrypt()) }} class=" bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{(encrypt()) ? "Encrypt" : "Decrypt"}</button>    <button onClick={switchOutputInput} class=" bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Switch</button>
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
          <button onClick={autoRunLeft} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"><div class="flex"><FiChevronsLeft /><FiChevronsLeft /></div></button>
          <button onClick={skipLeft} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"><FiChevronsLeft /></button>
          <button onClick={stepLeft} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"><FiChevronLeft /></button>
          <button onClick={stepRight} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"><FiChevronRight /> </button>
          <button onClick={skipRight} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"><FiChevronsRight /> </button>
          <button onClick={autoRunRight} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"><div class="flex"><FiChevronsRight /><FiChevronsRight /></div></button>
        </div>
      </Menu>
    </div>
  );
}

render(() => <App />, document.getElementById("root") as HTMLElement);
