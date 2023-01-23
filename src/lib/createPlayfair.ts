export function createPlayfair(ctx: { clearRect?: (arg0: number, arg1: number, arg2: number, arg3: number) => void; canvas?: any; textAlign?: any; textBaseline?: any; font?: any; beginPath?: any; rect?: any; stroke?: any; fillText?: any; }) {
    return function (display : any,spacexby : number,spaceyby : number,fontsize:number){
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"
      ctx.font = fontsize + "px Arial";

   
      for (let i = 0; i < display.length; i++) {
   
        for (let j = 0; j < display[i].length; j++) {

    
          ctx.beginPath();
          ctx.rect(spacexby * (j), spaceyby * (i), spacexby, spaceyby);
          ctx.stroke();
          if(display[i] == "I"){
            ctx.fillText("I/J", spacexby * (j) + spacexby / 2, spaceyby * (i) + ((spaceyby) / 2));
          }else{
            ctx.fillText(display[i][j], spacexby * (j) + spacexby / 2, spaceyby * (i) + ((spaceyby) / 2));
          }
        }
        
      
      }
    };
  }