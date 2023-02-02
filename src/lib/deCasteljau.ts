export function deCasteljauAlgorithm (points: string | any[], t: number): any {
if (t === 1) {
    return points[points.length - 1];
}

if (t === 0) {
    return points[0];
}

if (points.length == 1) {
    return points[0];
}

let calculatedPoints = [];

for (let i = 1; i < points.length; i++) {
    calculatedPoints.push(calculatePoints([points[i - 1], points[i]], t));
}

return deCasteljauAlgorithm(calculatedPoints, t);
}

function calculatePoints (points: any[], t: number) {
let p1X = points[0][0],
    p1Y = points[0][1], 
    p2X = points[1][0],
    p2Y = points[1][1];

let pInterX = p1X + (p2X - p1X) * t,
    pInterY = p1Y + (p2Y - p1Y) * t;

return [pInterX, pInterY];
}