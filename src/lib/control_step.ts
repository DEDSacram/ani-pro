import { drawcurvewitharrow } from "./linearrow";
import { Selected } from "./Markup";
export function Showcasestep(ctx : any,cipher : number,animationsteps : (number[][][])[],currentstep : number,currentmicrostep : number,xratio : number,yratio : number,spacexby : number,spaceyby : number) {
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    switch (cipher) {
      case 1:
        // normal caesar
        drawcurvewitharrow(ctx, { x: (animationsteps[currentstep][0][0][0] + (spacexby / 2)) * xratio, y: (animationsteps[currentstep][0][0][1] + spaceyby) * yratio }, { x: ((animationsteps[currentstep][0][0][0] + (spacexby / 2)) * xratio + (animationsteps[currentstep][0][1][0] + (spacexby / 2)) * xratio) / 2, y: ((animationsteps[currentstep][0][0][1] + spaceyby * 2) * yratio + (animationsteps[currentstep][0][1][1] + spaceyby * 2) * yratio) / 2 }, { x: (animationsteps[currentstep][0][1][0] + (spacexby / 2)) * xratio, y: (animationsteps[currentstep][0][1][1] + spaceyby) * yratio }, 10)
        break;
      case 2:
        // wheel caesar
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
        drawcurvewitharrow(ctx, { x: (animationsteps[currentstep][0][0][0] + (spacexby / 2)) * xratio, y: (animationsteps[currentstep][0][0][1] + spaceyby) * yratio }, { x: ((animationsteps[currentstep][0][0][0] + (spacexby / 2)) * xratio + (animationsteps[currentstep][0][1][0] + (spacexby / 2)) * xratio) / 2, y: ((animationsteps[currentstep][0][0][1] + spaceyby * 2) * yratio + (animationsteps[currentstep][0][1][1] + spaceyby * 2) * yratio) / 2 }, { x: (animationsteps[currentstep][0][1][0] + (spacexby / 2)) * xratio, y: (animationsteps[currentstep][0][1][1] + spaceyby) * yratio }, 10)
        break;
      case 2:
        // wheel caesar
        break;
      case 3:
        //Playfair
        for (let i = 0; i < animationsteps[currentstep].length; i++) {
          Selected(ctx, animationsteps[currentstep][i][0][0] * xratio, animationsteps[currentstep][i][0][1] * yratio, spacexby, spaceyby, "red")
          Selected(ctx, animationsteps[currentstep][i][1][0] * xratio, animationsteps[currentstep][i][1][1] * yratio, spacexby, spaceyby, "green")
        }

        for (let i = 0; i < animationsteps[currentstep].length; i++) {
          drawcurvewitharrow(ctx, { x: (animationsteps[currentstep][i][0][0] + (spacexby / 2)) * xratio, y: (animationsteps[currentstep][i][0][1] + spaceyby / 2) * yratio }, { x: ((animationsteps[currentstep][i][0][0] + (spacexby / 2)) * xratio + (animationsteps[currentstep][i][1][0] + (spacexby / 2)) * xratio) / 2, y: ((animationsteps[currentstep][i][0][1] + spaceyby / 2) * yratio + (animationsteps[currentstep][i][1][1] + spaceyby / 2) * yratio) / 2 }, { x: (animationsteps[currentstep][i][1][0] + (spacexby / 2)) * xratio, y: (animationsteps[currentstep][i][1][1] + spaceyby / 2) * yratio }, 30)
        }
        break;
      case 4:
        Selected(ctx, animationsteps[currentstep][currentmicrostep][0][0] * xratio, animationsteps[currentstep][currentmicrostep][0][1] * yratio, spacexby, spaceyby, "red")
        Selected(ctx, animationsteps[currentstep][currentmicrostep][1][0] * xratio, animationsteps[currentstep][currentmicrostep][1][1] * yratio, spacexby, spaceyby, "green")
        break;
      default:
    }
  }