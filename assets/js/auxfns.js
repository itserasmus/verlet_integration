function randRange(min = 0, max = 1) {
    return (Math.random() * (max - min)) + min;
}
function intersects([a,b],[c,d],[p,q],[r,s]) {
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
};
function pointInRectangle(mx, my, x, y, w, h) {
  return x <= mx && mx <= x + w &&
         y <= my && my <= y + h;
}
function dist(x1, y1, x2, y2) {
  return Math.hypot(x1-x2, y1-y2);
}