export function createCaesarWheel(ctx){
    return function (key){
    var radius
    if(ctx.canvas.clientWidth > ctx.canvas.clientHeight){
      radius = ctx.canvas.clientHeight/2
    }
    else{
      radius = ctx.canvas.clientWidth/2
    }
    ctx.translate(ctx.canvas.clientWidth/2, ctx.canvas.clientHeight/2);
    drawBackground(ctx, radius);
    drawLetters(ctx, radius);
  }
  }


function drawBackground(ctx, radius) {
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

function drawFirst(ctx,radius,angledivider,by){
  let first = 26 * Math.PI / angledivider;
  ctx.rotate(first);
  ctx.translate(0, -radius*by);
  ctx.rotate(-first);
  ctx.fillText("A".toString(), 0, 0);
  ctx.rotate(first);
  ctx.translate(0, radius*by);
  ctx.rotate(-first);
}

function drawLetters(ctx, radius) {
  var ang;
  var num;
  ctx.font = radius*0.1 + "px arial";
  ctx.textBaseline="middle";
  ctx.textAlign="center";
  // num = 27
  for(let heh = 1; heh < 57; heh++){
    if(heh % 2 == 1){
      drawBoundary(ctx,heh*Math.PI/26, radius, radius*0.01);
    }
  }




  var angledivider = 26/2
  drawFirst(ctx,radius,angledivider,0.85)
  for(num = 1; num < 26; num++){
    ang = num * Math.PI / angledivider;
    ctx.rotate(ang);
    ctx.translate(0, -radius*0.85);
    ctx.rotate(-ang);
    ctx.fillText(String.fromCharCode((num + 65)), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius*0.85);
    ctx.rotate(-ang);
  }
  drawFirst(ctx,radius,angledivider,0.60)
  for(num = 1; num < 26; num++){
    ang = num * Math.PI / angledivider;
    ctx.rotate(ang);
    ctx.translate(0, -radius*0.60);
    ctx.rotate(-ang);
    ctx.fillText(String.fromCharCode((num + 65)), 0, 0);
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


function drawBoundary(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}
