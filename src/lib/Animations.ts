import { getBezierAngle, drawPlots, drawArrow } from "./cubic_bezier";
import { drawPoint } from "./createCaesarWheel";
import { drawlinewitharrow_C } from "./linearrow"
// function to calculate coordinate for quarctic movement
function easeInOutQuart(t: number, b: number, c: number, d: number) {
  if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
  return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
}
export async function Animate(ctx: any, from: number, to: number, col: number | undefined, row: number | undefined, width: number, height: number, duration: number, states: { on: boolean; }, color = "white") {
  return await new Promise(resolve => {

    let start = new Date().getTime();
    let innertimer = setInterval(function () {
      if (!states.on) {
        clearTimeout(innertimer)
        Promise.resolve(0)
      }
      let time = new Date().getTime() - start;
      ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
      let value = easeInOutQuart(time, from, to - from, duration);
      // ctx.fillStyle = color;
      //Test
      let percentage = (time / duration);

      ctx.fillStyle = `rgb(${(0.5 - percentage) * 255 + 128},${(percentage) * 150},0)`;

      if (row == undefined) {
        ctx.fillRect(value, col, width, height);
      } else {
        ctx.fillRect(row, value, width, height);
      }
      if (time >= duration) {
        clearTimeout(innertimer)
        resolve('done');
      }
    }, 1000 / 60);
  });
}

export async function Animate_Circ(ctx: any, from: number, to: number, radius: number, duration: number, states: { on: boolean; }, imageData: any, alphabet: any) {
  return await new Promise(resolve => {

    let start = new Date().getTime();
    let innertimer = setInterval(function () {
      if (!states.on) {
        clearTimeout(innertimer)
        Promise.resolve(0)
      }
      let time = new Date().getTime() - start;
      ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
      ctx.putImageData(imageData, 0, 0)
      let yk = easeInOutQuart(time, from, to - from, duration);
      Sum(ctx, yk, radius, alphabet)
      if (time >= duration) {
        clearTimeout(innertimer)
        resolve('done');
      }
    }, 1000 / 60);
  });
}

export async function Animate_Circ_Arr(ctx: any, from: {x:number,y:number}, to: {x:number,y:number}, duration: number, states: { on: boolean; }) {
  return await new Promise(resolve => {

    let start = new Date().getTime();
    let innertimer = setInterval(function () {
      if (!states.on) {
        clearTimeout(innertimer)
        Promise.resolve(0)
      }
      let time = new Date().getTime() - start;
      ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
      let xk = easeInOutQuart(time, from.x, to.x - from.x, duration);
      let yk = easeInOutQuart(time, from.y, to.y - from.y, duration);
      drawlinewitharrow_C(ctx,{x: from.x, y: from.y},{x:xk,y:yk},20)
      if (time >= duration) {
        clearTimeout(innertimer)
        resolve('done');
      }
    }, 1000 / 60);
  });
}



export async function Animate_T(ctx: any, cBez1: any, cPoints: any, from: number, to: number, duration: number, states: { on: boolean; }, color = "white") {

  return await new Promise(resolve => {

    let start = new Date().getTime();
    let innertimer = setInterval(function () {
      if (!states.on) {
        clearTimeout(innertimer)
        Promise.resolve(0)
      }

      ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
      let time = new Date().getTime() - start;
      let x = easeInOutQuart(time, from, to - from, duration);
      let endindex = Math.floor((cPoints.length - 1) * x)
      let angle = getBezierAngle(x, cBez1)
      drawPlots(ctx, endindex, cPoints);
      drawArrow(ctx, cPoints[endindex].x, cPoints[endindex].y, angle)
      if (time >= duration) {
        resolve('done');
        clearInterval(innertimer)
      }
    }, 1000 / 60);
  });
}

function Sum(ctx: any, by: number, radius: number, alphabet: any) {
  ctx.font = radius * 0.1 + "px arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 5;
  let onelet = 13.84;

  ctx.translate(ctx.canvas.clientWidth / 2, ctx.canvas.clientHeight / 2);
  for (let heh = 1; heh < 27; heh++) {
    let textpoint = drawPoint(onelet * heh + onelet / 2 + by, 0.85, radius)
    ctx.fillText(alphabet[heh - 1], textpoint.circx, textpoint.circy);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Problem with multiple lines without erasing
  // for (let heh = 1; heh < 27; heh++) {
  //   let textpoint = drawPoint(ctx, onelet * heh + onelet / 2, 0.85, radius)
  //   ctx.fillText(backres.Display[heh - 1], textpoint.circx + radius, textpoint.circy + radius);
  // }

  // for(let heh = 1;heh<6;heh++){
  //   let circpoint = drawPoint(ctx, onelet * heh+ by, 0.70, radius)
  //   ctx.moveTo(circpoint.circx+ radius, circpoint.circy+ radius)
  //   circpoint = drawPoint(ctx, onelet * heh + by, 1, radius)
  //   ctx.lineTo(circpoint.circx+ radius, circpoint.circy+ radius);
  //   ctx.stroke()
  // }
}
