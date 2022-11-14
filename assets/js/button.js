function Button(x, y, w, h, click = (sv, sm) => {}, rad = 0, text = 'Button', color = 'white', textColor = 'black', margin = 5) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
    this.onclick = (sv, sm) => click(sv, sm);
    this.rad = rad;
    this.color = color;
    this.textColor = textColor;
    this.margin = margin;
    var fs = this.h - 2 * this.rad - this.margin/2;
    var f = '';
    var ctx = document.createElement('canvas').getContext('2d');
    do {
        fs--;
        ctx.font = f = `bold ${fs}px Courier`;
    } while (ctx.measureText(this.text).width > this.w - this.margin);
    this.font = f;
    this.pointIn = (mx, my) => {
        var x = this.x;
        var y = this.y;
        var w = this.w;
        var h = this.h;
        var rad = this.rad;
        if(
            pointInRectangle(mx, my, x, y + rad, w, h - 2 * rad) ||
            pointInRectangle(mx, my, x + rad, y, w - 2 * rad, h) ||
            dist(mx, my, x + rad, y + rad) <= rad ||
            dist(mx, my, x + w - rad, y + rad) <= rad ||
            dist(mx, my, x + w - rad, y + h - rad) <= rad ||
            dist(mx, my, x + rad, y + h - rad) <= rad
        ) {
            return true;
        }
        return false;
    }
    this.setDim = (w, h) => {
        this.w = w;
        this.h = h;
        var fs = this.h - 2 * this.rad - this.margin/2;
        do {
            fs--;
            ctx.font = `bold ${fs}px Courier`;
        } while (ctx.measureText(this.text).width > this.w - this.margin);
        this.fontsize = fs;
    }
    this.draw = (ctx) => {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x + this.rad, this.y + this.rad, this.rad, Math.PI * 1, Math.PI * 1.5, false);
        ctx.arc(this.x + this.w - this.rad, this.y + this.rad, this.rad, Math.PI * 1.5 , 0, false);
        ctx.arc(this.x + this.w - this.rad, this.y + this.h - this.rad, this.rad, 0, Math.PI * 0.5, false);
        ctx.arc(this.x + this.rad, this.y + this.h - this.rad, this.rad, Math.PI * 0.5, Math.PI, false);
        ctx.fill();
        ctx.fillStyle = this.textColor;
        ctx.textAlign = 'center'

        ctx.font = this.font;
        ctx.fillText(this.text, this.x + this.w / 2, this.y + this.h/2 + this.rad);
    }
}