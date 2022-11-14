function ScreenManager(screens) {
    this.screens = screens;
    this.current = 0;
    this.update = () => {
        this.screens[this.current].update(this);
    }
    this.draw = (c) => {
        this.screens[this.current].draw(this, c);
    }
    this.setScreen = (screen) => {
        if(screen > -1 && screen < this.screens.length && Number.isInteger(screen)) {
            this.current = screen;
        }
    }
    this.mousemove = (m, e) => {
        this.screens[this.current].mousemove(m, e, this);
    }
    this.mouseup = (m, e) => {
        this.screens[this.current].mouseup(m, e, this);
    }
    this.mousedown = (m, e) => {
        this.screens[this.current].mousedown(m, e, this);
    }
    this.keypress = (key) => {
        this.screens[this.current].onkeypress(key, this);
    }
}