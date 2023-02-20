export function createCaesarWheel(ctx: any){
    return function (key: any,encrypt : boolean){
    var numkey = Number(key) % 26
    if(!encrypt){
      numkey = -numkey
    }
    var radius
    if(ctx.canvas.clientWidth > ctx.canvas.clientHeight){
      radius = ctx.canvas.clientHeight/2
    }
    else{
      radius = ctx.canvas.clientWidth/2
    }
    ctx.translate(ctx.canvas.clientWidth/2, ctx.canvas.clientHeight/2);
    drawBackground(ctx, radius);
    drawLetters(ctx, radius,numkey);
  }
  }


function drawBackground(ctx: { beginPath: () => void; arc: (arg0: number, arg1: number, arg2: number, arg3: number, arg4: number) => void; fillStyle: string; fill: () => void; lineWidth: number; strokeStyle: string; stroke: () => void }, radius: number) {
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2*Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0,0,radius*0.7,0,radius*0.8);
  ctx.lineWidth = 5;
  ctx.strokeStyle = "black";
  ctx.stroke();
  ctx.lineWidth = 5;

  ctx.fillStyle = '#333';
}

function drawFirst(ctx: { rotate: (arg0: number) => void; translate: (arg0: number, arg1: number) => void; fillText: (arg0: any, arg1: number, arg2: number) => void },radius: number,angledivider: number,by: number,letter: string){
  let first = 26 * Math.PI / angledivider;
  ctx.rotate(first);
  ctx.translate(0, -radius*by);
  ctx.rotate(-first);
  ctx.fillText(letter, 0, 0);
  ctx.rotate(first);
  ctx.translate(0, radius*by);
  ctx.rotate(-first);
}

function drawPoint(ctx: { beginPath: () => void; arc: (arg0: number, arg1: number, arg2: any, arg3: number, arg4: number) => void; fill: () => void; font: any; fillText: (arg0: string, arg1: number, arg2: number) => void },angle : number,distance : number,radius : number){
  var x = 0 + radius * Math.cos(-angle*Math.PI/180) * distance;
  var y = 0 + radius * Math.sin(-angle*Math.PI/180) * distance;

  // ctx.beginPath();
  // ctx.arc(x, y, 5, 0, 2 * Math.PI);
  // ctx.fill();
  return {circx:x,circy:y}
}

function drawLetters(ctx: any, radius: number,key: number | undefined) {
  var ang;
  var num;
  ctx.font = radius*0.1 + "px arial";
  ctx.textBaseline="middle";
  ctx.textAlign="center";
  // correct order by my way of displaying
  let arrtext = ["F","E","D","C","B","A","Z","Y","X","W","V","U","T","S","R","Q","P","O","N","M","L","K","J","I","H","G",]
  let arrcipher = arrtext.slice(key).concat(arrtext.slice(0,key))
  let onelet = 13.84;
  for(let heh = 1; heh < 27; heh++){
    
      let circpoint = drawPoint(ctx,onelet*heh,0.70,radius)
      ctx.moveTo(circpoint.circx,circpoint.circy)
      circpoint = drawPoint(ctx,onelet*heh,1,radius)

      let textpoint = drawPoint(ctx,onelet*heh+onelet/2,0.85,radius)

      ctx.fillText(arrcipher[heh-1], textpoint.circx, textpoint.circy);

      textpoint = drawPoint(ctx,onelet*heh+onelet/2,0.61,radius)

      ctx.fillText(arrcipher[heh-1], textpoint.circx, textpoint.circy);

      ctx.lineTo(circpoint.circx, circpoint.circy);
      ctx.stroke()
    
  }
  
  ctx.beginPath();
  ctx.arc(0, 0, radius*0.52, 0, 2*Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "black";
  ctx.stroke();

  for(let heh = 1; heh < 27; heh++){
    
    let circpoint = drawPoint(ctx,(360/26)*heh,0.52,radius)
    ctx.moveTo(circpoint.circx,circpoint.circy)
    circpoint = drawPoint(ctx,(360/26)*heh,0.70,radius)
    ctx.lineTo(circpoint.circx, circpoint.circy);
    ctx.stroke()
  
}
}
function rotate(ctx,radius: number,onelet: number) {
  for(let heh = 1; heh < 27; heh++){
    let circpoint = drawPoint(ctx,onelet*heh,0.70,radius)
    ctx.moveTo(circpoint.circx,circpoint.circy)
    circpoint = drawPoint(ctx,onelet*heh,1,radius)
    ctx.lineTo(circpoint.circx, circpoint.circy);
    ctx.stroke()
}
}