function Bounds(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.all = () => {
        return [this.x, this.y, this.w, this.h];
    }
    this.pointIn = (px, py) => {
        if(
            px >= this.x &&
            py >= this.y &&
            px <= this.x + this.w &&
            py <= this.y + this.h
        ) {
            return true;
        }
        return false;
    }
    this.resize = ({x: x, y: y, w: w, h: h}) => {
        return new Bounds(x??this.x, y??this.y, w??this.w, h??this.w);
    }
}