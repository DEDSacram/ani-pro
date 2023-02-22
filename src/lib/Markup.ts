export function Selected(ctx: { clearRect?: any; resetTransform?: (() => void) | undefined; strokeStyle?: string | undefined; lineWidth?: number | undefined; setLineDash?: ((arg0: never[]) => void) | undefined; fillStyle: any; beginPath?: any; rect?: any; fill?: any; }, x: number, y: number, width: number, height: number, color = "white") {
    ctx.beginPath()
    ctx.fillStyle = color;
    ctx.rect(x, y, width, height);
    ctx.fill()
}