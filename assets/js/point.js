function Point(x, y, locked = false) {
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.locked = locked;
    this.vx = () => this.x - this.px;
    this.vy = () => this.y - this.py;
    this.pos = () => [this.x, this.y];
}