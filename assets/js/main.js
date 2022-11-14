var canv = document.getElementById('canv');
var c = canv.getContext('2d');
var width = canv.width = window.innerWidth;
var height = canv.height = window.innerHeight;

var bounds = new Bounds(0, 0, width, height);
var psBounds = bounds.resize({x: 150, h: height-5});
var m = new Mouse();
var w = {
    focus: true,
}

var firstScreen = new Screen(
    (sv,sm)=>{
        c.textAlign = 'left';
        c.fillStyle = '#28a';
        c.fillRect(sv.bounds.x + 50, sv.bounds.y + 50, sv.bounds.w -100, sv.bounds.h - 100);
        c.fillStyle = '#fa6';
        c.font = '30px Courier';
        c.fillText('Welcome to a Project on Verlet Integration', sv.bounds.x + 70, sv.bounds.y + 90);
        c.font = '16px Courier';
        c.fillText('Verlet integration is a way to get a great approximation for bodies attached to strings.', sv.bounds.x + 90, sv.bounds.y + 120);
        c.fillText('Controls:', sv.bounds.x + 90, sv.bounds.y + 140);
        c.fillText('- space       : pause/play', sv.bounds.x + 110, sv.bounds.y + 160);
        c.fillText('- r           : Random point system', sv.bounds.x + 110, sv.bounds.y + 180);
        c.fillText('- c           : Cloth', sv.bounds.x + 110, sv.bounds.y + 200);
        c.fillText('- s           : String', sv.bounds.x + 110, sv.bounds.y + 220);
        c.fillText('- n           : Clear', sv.bounds.x + 110, sv.bounds.y + 240);
        c.fillText('- h           : Help', sv.bounds.x + 110, sv.bounds.y + 260);
        c.fillText('- q           : Increase size', sv.bounds.x + 110, sv.bounds.y + 280);
        c.fillText('- w           : Decrease size', sv.bounds.x + 110, sv.bounds.y + 300);
        c.fillText('- left click  : Add node', sv.bounds.x + 110, sv.bounds.y + 320);
        c.fillText('- lc on node  : Lock/unlock node', sv.bounds.x + 110, sv.bounds.y + 340);
        c.fillText('- right click : Remove node', sv.bounds.x + 110, sv.bounds.y + 360);
        c.fillText('- left drag   : Add stick', sv.bounds.x + 110, sv.bounds.y + 380);
        c.fillText('- right drag  : Remove stick', sv.bounds.x + 110, sv.bounds.y + 400);
        c.fillText('- middle drag : Move Node', sv.bounds.x + 110, sv.bounds.y + 420);
        c.fillText('Click anywhere or space to continue', sv.bounds.x + 90, sv.bounds.y + 440);
    },
    (sv,sm)=>{},
    (m,sv,b,sm)=>{},
    (m,sv,b,sm)=>{sm.setScreen(1)},
    (m,sv,b,sm)=>{},
    (k,sv,sm)=>{},
    [],
    {
        ' ': (sv, sm)=>{sm.setScreen(1)},
    },
    {
        get bounds() {return bounds;},
    },
)
var clothScreen = new Screen(
    (sv, sm) => {
        if(sv.playing) {
            sv.ps.updatePoints();
            sv.ps.updateSticks();
        }
    }, // update
    (sv, sm) => {
        sv.ps.display(c);
    }, // draw
    (m, sv, e, sm) => {
        if(m.ld) {
            sv.ps.onleftmove(m);
        }
        if(m.md) {
            sv.ps.onmiddlemove(m);
        }
        if(m.rd) {
            sv.ps.onrightmove(m);
        }
    }, // mousemove
    (m, sv, e, sm) => {
        if(e.button == 0) {
            sv.ps.onleftup(m);
        } else if(e.button == 1) {
            sv.ps.onmiddleup(m);
        } else if(e.button == 2) {
            sv.ps.onrightup(m);
        }
    }, // mouseup
    (m, sv, e, sm) => {

    }, // mousedown
    (k, sv, sm) => {

    }, // keypress
    [
        new Button(10, 10, 140, 40, (sv, sm) => {
            sv.playing = !sv.playing;
        }, 10, 'Pause/play', '#f72', 'black', 0),
        new Button(10, 60, 140, 40, (sv, sm) => {
            sv.ps = randomPointSystem(sv.psBounds);
        }, 10, 'Random', '#f72', 'black', 0),
        new Button(10, 110, 140, 40, (sv, sm) => {
            sv.ps = generateCloth(sv.psBounds);
        }, 10, 'Cloth', '#f72', 'black', 0),
        new Button(10, 160, 140, 40, (sv, sm) => {
            sv.ps = generateString(sv.psBounds);
        }, 10, 'String', '#f72', 'black', 0),
        new Button(10, 210, 140, 40, (sv, sm) => {
            sv.ps = new PointSystem([], [], sv.psBounds);
        }, 10, 'Clear', '#f72', 'black', 0),
        new Button(10, 260, 140, 40, (sv, sm) => {
            sv.ps.rad++;
        }, 10, 'Inc. size', '#f72', 'black', 0),
        new Button(10, 310, 140, 40, (sv, sm) => {
            sv.ps.rad = Math.max(sv.ps.rad-1, 0);
        }, 10, 'Dec. size', '#f72', 'black', 0),
        new Button(10, 360, 140, 40, (sv, sm) => {
            sm.setScreen(0);
        }, 10, 'Help', '#f72', 'black', 0),
    ], // buttons
    {
        ' ': (sv, sm) => {
            sv.playing = !sv.playing;
        },
        'r': (sv, sm) => {
            sv.ps = randomPointSystem(sv.psBounds);
        },
        'c': (sv, sm) => {
            sv.ps = generateCloth(sv.psBounds);
        },
        's': (sv, sm) => {
            sv.ps = generateString(sv.psBounds);
        },
        'n': (sv, sm) => {
            sv.ps = new PointSystem([], [], sv.psBounds);
        },
        'h': (sv, sm) => {
            sm.setScreen(0);
        },
        
        'q': (sv, sm) => {
            sv.ps.rad++;
        },
        'w': (sv, sm) => {
            sv.ps.rad = Math.max(sv.ps.rad-1, 0);
        },
    }, // keybinds
    {
        playing: false,
        get psBounds() {return psBounds;},
        ps: new PointSystem(
            [
                new Point(width/2+25, height/3, true),
                new Point(width/3*2+25, height/2, false),
                new Point(width/6*5+25, height/2, false),
            ],
            [[1, 0, dist(width/2+25, height/3, width/3*2+25, height/2)], [2, 1, dist(width/3*2+25, height/2, width/6*5+25, height/2)]],
            psBounds, 1, 1, false, Number.POSITIVE_INFINITY, 1),
    }, // screen variables
);
var sm = new ScreenManager([firstScreen, clothScreen]);

function loop() {
    if(w.focus) {
        background();
        updateMouse();
        sm.update();
        sm.draw(c);
    }
}

window.addEventListener('mousemove', (e) => {
    m.x = e.x;
    m.y = e.y;
    sm.mousemove(m,e);
});
window.addEventListener('mousedown', (e) => {
    if(e.button == 0) {
        m.x = m.ldsx = e.x;
        m.y = m.ldsy = e.y;
        m.ld = true;
    } else if(e.button == 1) {
        m.x = m.mdsx = e.x;
        m.y = m.mdsy = e.y;
        m.md = true;
    } else if(e.button == 2) {
        m.x = m.rdsx = e.x;
        m.y = m.rdsy = e.y;
        m.rd = true;
    }
    sm.mousedown(m, e);
});
window.addEventListener('mouseup', (e) => {
    sm.mouseup(m, e);
    if(e.button == 0) {
        m.ld = false;
        m.ldsx = null;
        m.ldsy = null;
    } else if(e.button == 1) {
        m.md = false;
        m.mdsx = null;
        m.mdsy = null;
    } else if(e.button == 2) {
        m.rd = false;
        m.rdsx = null;
        m.rdsy = null;
    }
    m.x = e.x;
    m.y = e.y;
});
window.addEventListener('keypress', (e) => {
    sm.keypress(e);
});
window.addEventListener('focus', (e) => {
    w.focus = true;
})
window.addEventListener('blur', (e) => {
    w.focus = false;
})
window.addEventListener('resize', (e) => {
    bounds.w = canv.width = width = window.innerWidth
    bounds.h = canv.height = height = window.innerHeight;
    psBounds.x = bounds.x + 150;
    psBounds.y = bounds.y;
    psBounds.h =  bounds.h - 5;
    psBounds.w =  bounds.w;
})
window.addEventListener('contextmenu', e => e.preventDefault());

function updateMouse() {
    m.px = m.x;
    m.py = m.y;
}

function background() {
    c.beginPath();
    c.fillStyle = '#0055ab';
    c.rect(...bounds.all());
    c.fill();
}

window.setInterval(loop, 1000/60);