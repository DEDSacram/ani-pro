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

function drawLetters(ctx: any, radius: number,key: number | undefined) {
  var ang;
  var num;
  ctx.font = radius*0.1 + "px arial";
  ctx.textBaseline="middle";
  ctx.textAlign="center";
  let arrtext = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
  let arrcipher = arrtext.slice(key).concat(arrtext.slice(0,key))
  for(let heh = 1; heh < 57; heh++){
    if(heh % 2 == 1){
      drawBoundary(ctx,heh*Math.PI/26, radius, radius*0.01);
    }
  }




  var angledivider = 26/2
  drawFirst(ctx,radius,angledivider,0.85,arrtext[0])
  for(num = 1; num < arrtext.length; num++){
    ang = num * Math.PI / angledivider;
    ctx.rotate(ang);
    ctx.translate(0, -radius*0.85);
    ctx.rotate(-ang);
    ctx.fillText(arrtext[num], 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius*0.85);
    ctx.rotate(-ang);
  }
  drawFirst(ctx,radius,angledivider,0.60,arrcipher[0])
  arrcipher.splice(0,1)
  for(num = 1; num < arrtext.length; num++){
    ang = num * Math.PI / angledivider;
    ctx.rotate(ang);
    ctx.translate(0, -radius*0.60);
    ctx.rotate(-ang);
    ctx.fillText(arrcipher[num-1], 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius*0.60);
    ctx.rotate(-ang);
  }
  ctx.beginPath();
  ctx.arc(0, 0, radius*0.52, 0, 2*Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "black";
  ctx.stroke();
}


function drawBoundary(ctx: { beginPath: () => void; lineWidth: any; lineCap: string; moveTo: (arg0: number, arg1: number) => void; rotate: (arg0: number) => void; lineTo: (arg0: number, arg1: number) => void; stroke: () => void }, pos: number, length: number, width: number) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}
