// arrow at the end of a line
function arrow(ctx: { save: () => void; translate: (arg0: any, arg1: any) => void; rotate: (arg0: number) => void; fillStyle: string; strokeStyle: string; beginPath: () => void; lineWidth: number; lineTo: (arg0: number, arg1: number) => void; fill: () => void; stroke: () => void; restore: () => void; }, p1: { y: number; x: number; }, p2: { x: any; y: any; }, size: number) {
  var angle = Math.atan2((p2.y - p1.y), (p2.x - p1.x));
  var hyp = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
  ctx.save();
  ctx.translate(p1.x, p1.y);
  ctx.rotate(angle);
  // triangle
  ctx.fillStyle = 'red';
  ctx.strokeStyle = 'white';
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.lineTo(hyp - size, size);
  ctx.lineTo(hyp, 0);
  ctx.lineTo(hyp - size, -size);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

// line with arrow estimate
export function drawcurvewitharrow(ctx: any, startpoint: { x: any; y: any; }, control_p: { x: any; y: any; }, endpoint: { x: any; y: any; }, arrowsize: number) {
  ctx.beginPath();
  ctx.moveTo(startpoint.x, startpoint.y);
  ctx.quadraticCurveTo(control_p.x, control_p.y, endpoint.x, endpoint.y);
  ctx.lineWidth = 4;
  ctx.stroke();
  arrow(ctx, control_p, { x: endpoint.x, y: endpoint.y }, arrowsize);
}