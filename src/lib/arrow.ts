export function drawArrow(ctx : any ,x: number,y: number,angle: number){
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