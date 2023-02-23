import { drawcurvewitharrow, drawlinewitharrow, drawlinewitharrow_C } from "./linearrow";
import { Selected } from "./Markup";
export function Showcasestep(ctx : any,cipher : number,animationsteps : (number[][][])[],currentstep : number,currentmicrostep : number,xratio : number,yratio : number,spacexby : number,spaceyby : number) {
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    switch (cipher) {
      case 1:
        // normal caesar
        drawcurvewitharrow(ctx, { x: (animationsteps[currentstep][0][0][0] * xratio + (spacexby / 2)), y: (animationsteps[currentstep][0][0][1]* yratio + spaceyby) }, { x: ((animationsteps[currentstep][0][0][0] * xratio + (spacexby / 2)) + (animationsteps[currentstep][0][1][0] * xratio + (spacexby / 2))) / 2, y: ((animationsteps[currentstep][0][0][1]* yratio + spaceyby * 2) + (animationsteps[currentstep][0][1][1] * yratio + spaceyby * 2)) / 2 }, { x: (animationsteps[currentstep][0][1][0] * xratio + (spacexby / 2)), y: (animationsteps[currentstep][0][1][1]* yratio + spaceyby) }, 10)
        break;
      case 2:
        // wheel caesar
        drawlinewitharrow_C(ctx,{x: animationsteps[currentstep][0][0][0] * yratio, y: animationsteps[currentstep][0][0][1] * yratio}, { x: (animationsteps[currentstep][0][1][0]) * yratio, y: (animationsteps[currentstep][0][1][1]) * yratio },10)
        break;
      case 3:
        //Playfair
        Selected(ctx, animationsteps[currentstep][currentmicrostep][0][0] * xratio, animationsteps[currentstep][currentmicrostep][0][1] * yratio, spacexby, spaceyby, "red")
        Selected(ctx, animationsteps[currentstep][currentmicrostep][1][0] * xratio, animationsteps[currentstep][currentmicrostep][1][1] * yratio, spacexby, spaceyby, "green")
        break;
      case 4:
        Selected(ctx, animationsteps[currentstep][currentmicrostep][0][0] * xratio, animationsteps[currentstep][currentmicrostep][0][1] * yratio, spacexby, spaceyby, "red")
        Selected(ctx, animationsteps[currentstep][currentmicrostep][1][0] * xratio, animationsteps[currentstep][currentmicrostep][1][1] * yratio, spacexby, spaceyby, "green")
        break;
      default:
        return
    }
  }


export function Showcaseskip(ctx : any,cipher : number,animationsteps : (number[][][])[],currentstep : number,currentmicrostep : number,xratio : number,yratio : number,spacexby : number,spaceyby : number) {
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    switch (cipher) {
      case 1:
        // normal caesar
        drawcurvewitharrow(ctx, { x: (animationsteps[currentstep][0][0][0] * xratio + (spacexby / 2)), y: (animationsteps[currentstep][0][0][1]* yratio + spaceyby) }, { x: ((animationsteps[currentstep][0][0][0] * xratio + (spacexby / 2)) + (animationsteps[currentstep][0][1][0] * xratio + (spacexby / 2))) / 2, y: ((animationsteps[currentstep][0][0][1]* yratio + spaceyby * 2) + (animationsteps[currentstep][0][1][1] * yratio + spaceyby * 2)) / 2 }, { x: (animationsteps[currentstep][0][1][0] * xratio + (spacexby / 2)), y: (animationsteps[currentstep][0][1][1]* yratio + spaceyby) }, 10)
        break;
      case 2:
        // wheel caesar resizes proportionally to radius radius is on y
        drawlinewitharrow_C(ctx,{x: animationsteps[currentstep][0][0][0] * yratio, y: animationsteps[currentstep][0][0][1] * yratio}, { x: (animationsteps[currentstep][0][1][0]) * yratio, y: (animationsteps[currentstep][0][1][1]) * yratio },10)
        break;
      case 3:
        //Playfair
        for (let i = 0; i < animationsteps[currentstep].length; i++) {
          Selected(ctx, animationsteps[currentstep][i][0][0] * xratio, animationsteps[currentstep][i][0][1] * yratio, spacexby, spaceyby, "red")
          Selected(ctx, animationsteps[currentstep][i][1][0] * xratio, animationsteps[currentstep][i][1][1] * yratio, spacexby, spaceyby, "green")
        }

        for (let i = 0; i < animationsteps[currentstep].length; i++) {
          drawlinewitharrow(ctx,{ x: (animationsteps[currentstep][i][0][0]* xratio + (spacexby / 2)), y: (animationsteps[currentstep][i][0][1] * yratio + spaceyby / 2) }, { x: (animationsteps[currentstep][i][1][0]* xratio + (spacexby / 2)), y: (animationsteps[currentstep][i][1][1]* yratio + spaceyby / 2) },30)
        }
        break;
      case 4:
        Selected(ctx, animationsteps[currentstep][currentmicrostep][0][0] * xratio, animationsteps[currentstep][currentmicrostep][0][1] * yratio, spacexby, spaceyby, "red")
        Selected(ctx, animationsteps[currentstep][currentmicrostep][1][0] * xratio, animationsteps[currentstep][currentmicrostep][1][1] * yratio, spacexby, spaceyby, "green")
        break;
      default:
    }
  }