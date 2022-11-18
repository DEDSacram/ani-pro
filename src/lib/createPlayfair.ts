export function createPlayfair(ctx) {
    return function (pass) {
      if(pass){
      let arr = ["A","B","C","D","E","F","G","H","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
      let fixed = [...new Set(pass.toUpperCase().split(''))]
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
        ctx.fillText(arr[i], spacexby * (i % 5) + spacexby / 2, spaceyby * (Math.floor(i / 5)) + ((spaceyby) / 2));
      }
    }
    };
  }