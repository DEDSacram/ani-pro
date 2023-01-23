export function createCaesar(ctx: { clearRect?: (arg0: number, arg1: number, arg2: number, arg3: number) => void; canvas?: any; textAlign?: any; textBaseline?: any; font?: any; beginPath?: any; rect?: any; stroke?: any; fillText?: any; }) {
    return function (display : any,spacexby : number,spaceyby : number,fontsize:number) {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"
      ctx.font = fontsize + "px Arial";
      for (let i = 1; i < display.length+1; i++) {
        ctx.beginPath();
        ctx.rect(spacexby * (i-1), 0, spacexby, spaceyby);
        ctx.stroke();
        ctx.fillText(display[i-1], spacexby * i - (spacexby / 2), spaceyby / 2);
      }
    };
  }