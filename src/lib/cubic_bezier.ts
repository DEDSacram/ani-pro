export function BezPoints(b: any[], complexity: number) {
  let pts = [b[0]];
  let lastPt = b[0];
  for (let t = 0; t <= complexity; t++) {
    // calc another point along the curve
    let pt = getBezierXY(t / complexity, b);
    let dx = pt.x - lastPt.x;
    let dy = pt.y - lastPt.y;
    let d = Math.sqrt(dx * dx + dy * dy);
    let dInt = Math.floor(d);
    if (dInt > 0 || t == complexity) {
      lastPt = pt;
      pts.push(pt);
    }
  }
  return (pts);
}

export function drawPlots(ctx: any, end: number, pts: { x: number, y: number; }[]) {

  ctx.fillStyle = 'red';
  for (let i = 0; i < end; i++) {
    ctx.beginPath();
    ctx.arc(pts[i].x, pts[i].y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}


function getBezierXY(t: number, b: { x: number, y: number; }[]) {
  return {
    x: Math.pow(1 - t, 3) * b[0].x + 3 * t * Math.pow(1 - t, 2) * b[1].x + 3 * t * t * (1 - t) * b[2].x + t * t * t * b[3].x,
    y: Math.pow(1 - t, 3) * b[0].y + 3 * t * Math.pow(1 - t, 2) * b[1].y + 3 * t * t * (1 - t) * b[2].y + t * t * t * b[3].y
  };
}

export function getBezierAngle(t: number, b: { x: number, y: number; }[]) {
  let dx = Math.pow(1 - t, 2) * (b[1].x - b[0].x) + 2 * t * (1 - t) * (b[2].x - b[1].x) + t * t * (b[3].x - b[2].x);
  let dy = Math.pow(1 - t, 2) * (b[1].y - b[0].y) + 2 * t * (1 - t) * (b[2].y - b[1].y) + t * t * (b[3].y - b[2].y);
  return -Math.atan2(dx, dy) + 0.5 * Math.PI;
}

export function drawArrow(ctx: any, x: number, y: number, angle: number) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.moveTo(-10, -10);
  ctx.lineTo(10, 0);
  ctx.lineTo(-10, 10);
  ctx.lineTo(-10, -10);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.restore();
}


// Given the 4 control points on a Bezier curve 
// Get x,y at interval T along the curve (0<=T<=1)
// function getCubicBezierXYatT(startPt: { x: number; y: number; }, controlPt1: { x: number; y: number; }, controlPt2: { x: number; y: number; }, endPt: { x: number; y: number; }, T: number) {
//   let x = CubicN(T, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
//   let y = CubicN(T, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
//   return ({
//     x: x,
//     y: y
//   });
// }

// helper
// function CubicN(T: number, a : number, b : number, c: number, d: number) {
//   let t2 = T * T;
//   let t3 = t2 * T;
//   return a + (-a * 3 + T * (3 * a - a * T)) * T + (3 * b + T * (-6 * b + b * 3 * T)) * T + (c * 3 - c * 3 * T) * t2 + d * t3;
// }