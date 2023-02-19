export function createHomo(ctx: { clearRect?: (arg0: number, arg1: number, arg2: number, arg3: number) => void; canvas?: any; textAlign?: any; textBaseline?: any; font?: any; beginPath?: any; rect?: any; stroke?: any; fillText?: any; }) {
    return function (display : any,spacexby : number,spaceyby : number,fontsize:number){
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"
      ctx.font = fontsize + "px Arial";

      let counterx = 0
      for (let key in display) {
        let value = display[key];
        ctx.beginPath();
        ctx.rect(spacexby * (counterx),0, spacexby, spaceyby);
        ctx.stroke();
        ctx.fillText(key, spacexby * (counterx) + spacexby / 2, ((spaceyby) / 2));
        for(let i = 0; i < value.length; i++){
          ctx.beginPath();
          ctx.rect(spacexby * (counterx), spaceyby * (i+1), spacexby, spaceyby);
          ctx.stroke();
          ctx.fillText(value[i], spacexby * (counterx) + spacexby / 2, spaceyby * (i+1) + ((spaceyby) / 2));
        }
        counterx++;
      }
    };
  }