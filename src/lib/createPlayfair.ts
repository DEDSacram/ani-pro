export function createPlayfair(ctx: { clearRect?: (arg0: number, arg1: number, arg2: number, arg3: number) => void; canvas?: any; textAlign?: any; textBaseline?: any; font?: any; beginPath?: any; rect?: any; stroke?: any; fillText?: any; }) {
    return function (pass: string){
     
      if(!pass){
        return null
      }
      let arr = ["A","B","C","D","E","F","G","H","I","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"] //removed J if odd filler X
      let fixed = [...new Set(pass.toUpperCase().replace("J","").split(''))]
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
        if(arr[i] == "I"){
          ctx.fillText("I/J", spacexby * (i % 5) + spacexby / 2, spaceyby * (Math.floor(i / 5)) + ((spaceyby) / 2));
        }else{
          ctx.fillText(arr[i], spacexby * (i % 5) + spacexby / 2, spaceyby * (Math.floor(i / 5)) + ((spaceyby) / 2));
        }
        
      }
      return arr
    
    };
  }