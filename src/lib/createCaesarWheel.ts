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


function drawBackground(ctx: any, radius: number) {
  ctx.beginPath();
  ctx.arc(0,0,radius*0.7,0,radius*0.8);
  ctx.lineWidth = 5;
  ctx.strokeStyle = "black";
  ctx.stroke();
  ctx.lineWidth = 5;

  ctx.fillStyle = '#333';
}
export function drawPoint(angle : number,distance : number,radius : number){
  var x = 0 + radius * Math.cos(-angle*Math.PI/180) * distance;
  var y = 0 + radius * Math.sin(-angle*Math.PI/180) * distance;
  return {circx:x,circy:y}
}

function drawLetters(ctx: any, radius: number,key: number | undefined) {
  ctx.font = radius*0.1 + "px arial";
  ctx.textBaseline="middle";
  ctx.textAlign="center";
  ctx.fillStyle = "white";
  // correct order by my way of displaying
  let arrtext = ["F","E","D","C","B","A","Z","Y","X","W","V","U","T","S","R","Q","P","O","N","M","L","K","J","I","H","G"]
  let arrcipher = arrtext.slice(key).concat(arrtext.slice(0,key))
  let onelet = 13.84;

  for(let heh = 1; heh < 27; heh++){
      let circpoint = drawPoint(onelet*heh,0.52,radius)
      let textpoint = drawPoint(onelet*heh+onelet/2,0.61,radius)
      ctx.moveTo(circpoint.circx,circpoint.circy)
      circpoint = drawPoint(onelet*heh,0.70,radius)
      ctx.fillText(arrcipher[heh-1], textpoint.circx, textpoint.circy);
      ctx.lineTo(circpoint.circx, circpoint.circy);
      ctx.stroke()
  }

  for(let heh = 1;heh<27;heh++){
    let circpoint = drawPoint( onelet * heh, 0.70, radius)
    ctx.moveTo(circpoint.circx, circpoint.circy)
    circpoint = drawPoint( onelet * heh, 1, radius)
    ctx.lineTo(circpoint.circx, circpoint.circy);
    ctx.stroke()
  }

  
  ctx.beginPath();
  ctx.arc(0, 0, radius*0.52, 0, 2*Math.PI);
  ctx.lineWidth = 5;
  ctx.stroke();
}
