function Screen(
    update = (sv,sm)=>{},
    draw = (sv,sm)=>{},
    mousemove = (m,sv,b,sm)=>{},
    mouseup = (m,sv,b,sm)=>{},
    mousedown = (m,sv,b,sm)=>{},
    keypress = (k,sv,sm)=>{},
    buttons = [],
    keybinds = {},
    screenvariables = {},
) {
    this.update = (sm)=>(update(this.sv, sm));
    this.draw = (sm, ctx)=>{
        draw(this.sv, sm);
        for(var button of this.buttons) {
            button.draw(ctx);
        }
    };
    this.mousemove = (m, e, sm)=>(mousemove(m, this.sv, e, sm));
    this.mouseup = (m, e, sm) => {
        var clickButton = false;
        for(var button of this.buttons) {
            if(
                m.ld && !m.md && !m.rd &&
                button.pointIn(m.x, m.y) && button.pointIn(m.ldsx, m.ldsy)) {
                    button.onclick(this.sv, sm);
                    clickButton = true;
            }
        }
        if(!clickButton) {
            mouseup(m, this.sv, e, sm);
        }
    };
    this.mousedown = (m, e, sm)=>(mousedown(m, this.sv, e, sm));
    this.buttons = buttons;
    this.keybinds = keybinds;
    this.sv = screenvariables;
    this.keypress = keypress;
    this.onkeypress = (key, sm) => {
        this.keypress(key, this.sv, sm);
        var k = '';
        if(key.ctrlKey) {
            k+='ctrl+';
        }
        if(key.altKey) {
            k+='alt+';
        }
        if(key.shiftKey) {
            k+='shift+';
        }
        k+=key.key;
        if(this.keybinds[k] != null) {
            this.keybinds[k](this.sv, sm);
        }
    }
}