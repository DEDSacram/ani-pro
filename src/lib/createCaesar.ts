export function createCaesar(ctx: { clearRect?: (arg0: number, arg1: number, arg2: number, arg3: number) => void; canvas?: any; textAlign?: any; textBaseline?: any; font?: any; beginPath?: any; rect?: any; stroke?: any; fillText?: any; }) {
    return function () {
      let sizeWidth = ctx.canvas.clientWidth;
      let sizeHeight = ctx.canvas.clientHeight;
      let spaceyby = sizeHeight / 26
      let spacexby = sizeWidth / 26
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"
      ctx.font = "20px Arial";

      for (let i = 0; i < 27; i++) {

        ctx.beginPath();
        ctx.rect(spacexby * (i), 0, spacexby, spaceyby);
        ctx.stroke();
        ctx.fillText(String.fromCharCode((i + 64)), spacexby * i - (spacexby / 2), spaceyby / 2);
      }
    };
  }