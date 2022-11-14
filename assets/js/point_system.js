function PointSystem(points, sticks, bounds, damping = 1, strech = 1, foldable = false, breakFactor = Number.POSITIVE_INFINITY, count = 1) {
    this.points = points;
    this.sticks = sticks;
    this.bounds = bounds;
    this.damping = damping;
    this.strech = strech;
    this.foldable = foldable;
    this.breakFactor = breakFactor;
    this.rad = 7;
    this.count = count;
    this.display = (c) => {
        c.strokeStyle = '#00aa00';
        c.lineWidth = 2;
        for(var stick of this.sticks) {
            c.beginPath();
            c.moveTo(points[stick[0]].x, points[stick[0]].y);
            c.lineTo(points[stick[1]].x, points[stick[1]].y);
            c.stroke();
        }
        for(var point of this.points) {
            c.beginPath();
            if(point.locked) {
                c.fillStyle = '#cc0000';
            } else {
                c.fillStyle = '#ffaaaa';
            }
            c.arc(point.x, point.y, this.rad, 0, Math.PI * 2, false);
            c.fill();
        }
    }
    this.updatePoints = () => {
        for(var p of this.points) {
            if(!p.locked) {
                var vx = p.vx()*this.damping;
                var vy = p.vy()*this.damping;
                p.px=p.x;
                p.py=p.y;
                p.x+=vx;
                p.y+=vy+0.05;
            }
        }
    }
    this.updateSticks = () => {
        for(var c = 0; c < 1; c++) {
            for(var i = this.sticks.length-1; i > -1; i--) {
                var s = this.sticks[i],
                    dx = this.points[s[1]].x - this.points[s[0]].x,
                    dy = this.points[s[1]].y - this.points[s[0]].y,
                    dist = Math.sqrt(dx*dx + dy*dy),
                    diff = s[2] - dist,
                    ratio = diff/dist/2*strech;
                if(Number.isNaN(ratio)) {
                    ratio = 0;
                }
                if(this.foldable) {
                    ratio = Math.min(ratio, 0);
                }
                var osX = dx * ratio
                    osY = dy * ratio;
                
                if(dist > s[2]*this.breakFactor) {
                    this.sticks.splice(i, 1);
                    continue;
                }
                if(!this.points[s[0]].locked && !this.points[s[1]].locked) {
                    this.points[s[1]].x += osX;
                    this.points[s[1]].y += osY;
                    this.points[s[0]].x -= osX;
                    this.points[s[0]].y -= osY;
                } else if(this.points[s[0]].locked && !this.points[s[1]].locked) {
                    this.points[s[1]].x += 2*osX;
                    this.points[s[1]].y += 2*osY;
                } else if(!this.points[s[0]].locked && this.points[s[1]].locked) {
                    this.points[s[0]].x -= 2*osX;
                    this.points[s[0]].y -= 2*osY;
                }
            }
        }
    }

    this.closestPoint = (x, y, dist = false) => {
        var closestIndex = -1;
        var closestDist = Number.POSITIVE_INFINITY;
        for(var i = 0; i < this.points.length; i++) {
            var newDist = Math.hypot(this.points[i].x-x, this.points[i].y-y);
            if(newDist < closestDist) {
                closestDist = newDist;
                closestIndex = i;
            }
        }
        return dist?closestDist:closestIndex;
    }
    this.onleftup = (m) => {
        if(Math.abs(m.ldsx-m.x)<this.rad&&Math.abs(m.ldsy-m.y)<this.rad&&this.closestPoint((m.ldsx+m.x)/2,(m.ldsy+m.y)/2,true)<this.rad) {
            var index = this.closestPoint((m.ldsx+m.x)/2, (m.ldsy+m.y)/2)
            this.points[index].locked = !this.points[index].locked;
            this.points[index].px = this.points[index].x;
            this.points[index].py = this.points[index].y;
        } else if(Math.hypot(m.ldsx-m.x, m.ldsy-m.y) < this.rad && this.bounds.pointIn(m.x, m.y)) {
            this.points.push(new Point((m.ldsx+m.x)/2, (m.ldsy+m.y)/2));
        } else if(this.closestPoint(m.ldsx, m.ldsy, true) < 20 && this.closestPoint(m.x, m.y, true) < 20) {
            var cpStart = this.closestPoint(m.ldsx, m.ldsy);
            var cpEnd = this.closestPoint(m.x, m.y);
            var newEl = [cpStart, cpEnd, Math.hypot(this.points[cpStart].x-this.points[cpEnd].x, this.points[cpStart].y-this.points[cpEnd].y)];
            if(cpStart == cpEnd) {
                return;
            }
            for(var el of this.sticks) {
                if(el[0] == newEl[0] && el[1] == newEl[1]) {
                    return;
                }
            }
            this.sticks.push(newEl);
        }
    }
    this.onmiddleup = (m) => {}
    this.onrightup = (m) => {
        if(Math.abs(m.rdsx-m.x)<this.rad&&Math.abs(m.rdsy-m.y)<this.rad&&this.closestPoint((m.rdsx+m.x)/2,(m.rdsy+m.y)/2,true)<this.rad) {
            var cpi = this.closestPoint((m.rdsx+m.x)/2, (m.rdsy+m.y)/2);
            this.points.splice(cpi, 1);
            for(var i = this.sticks.length - 1; i > -1; i--) {
                if(this.sticks[i][0] == cpi || this.sticks[i][1] == cpi) {
                    this.sticks.splice(i, 1);
                    continue;
                }
                if(this.sticks[i][0] > cpi) {
                    this.sticks[i][0]--;
                }
                if(this.sticks[i][1] > cpi) {
                    this.sticks[i][1]--;
                }
            }
        }
    }
    this.onleftmove = (m) => {}
    this.onmiddlemove = (m) => {
        if(this.closestPoint(m.px, m.py, true) < this.rad*2) {
            this.points[this.closestPoint(m.px, m.py)].x += m.x-m.px;
            this.points[this.closestPoint(m.px, m.py)].y += m.y-m.py;
            this.points[this.closestPoint(m.px, m.py)].px += m.x-m.px;
            this.points[this.closestPoint(m.px, m.py)].py += m.y-m.py;
        }
    }
    this.onrightmove = (m) => {
        for(var i = this.sticks.length - 1; i > -1; i--) {
            if(intersects([m.x, m.y], [m.px, m.py], this.points[this.sticks[i][0]].pos(), this.points[this.sticks[i][1]].pos())) {
                this.sticks.splice(i, 1);
            }
        }
    }
}
function randomPointSystem(bounds) {
    var points = [];
    var sticks = [];
    for(var i = 0; i < randRange(40, 70); i++) {
        points.push(new Point(randRange(bounds.x, bounds.w), randRange(bounds.y, bounds.y + bounds.h)));
    }
    for(var i = 0; i < points.length; i++) {
        for(var j = i+1; j < points.length; j++) {
            if(Math.random() < 0.02) {
                sticks.push([i, j, Math.hypot(points[i].x-points[j].x, points[i].y-points[j].y)]);
            }
        }
    }
    var unconnected = [];
    for(var i = 0; i < points.length; i++) {
        unconnected.push(0);
    }
    for(var i of sticks) {
        unconnected[i[0]] = 1;
        unconnected[i[1]] = 1;
    }
    for(var i = unconnected.length-1; i > -1; i--) {
        if(unconnected[i] == 0) {
            points.splice(i, 1);
            for(var s of sticks) {
                if(s[0] >= i) {
                    s[0]--;
                }
                if(s[1] >= i) {
                    s[1]--;
                }
            }
        }
    }
    return new PointSystem(points, sticks, bounds);
}
function generateCloth(bounds) {
    var points = [];
    var sticks = [];
    var dist = 10;
    var rows = 0;
    var colums = 0;
    for(var i = bounds.x + dist; i < bounds.w-dist; i+=dist) {
        rows++;
        for(var j = bounds.y + dist; j < bounds.h/2-dist; j+=dist) {
            points.push(new Point(i+randRange(-1, 1), j+randRange(-1, 1), (j==bounds.y+dist)&&((i-dist)/dist%4==0)));
            colums++;
        }
    }
    colums/=rows;
    for(var i = 0; i < rows; i++) {
        for(var j = 1; j < colums; j++) {
            sticks.push([i*colums+j, i*colums+j-1, dist+randRange(-1, 1)])
        }
    }
    for(var i = 1; i < rows; i++) {
        for(var j = 0; j < colums; j++) {
            sticks.push([i*colums+j, i*colums+j-colums, dist+randRange(-1, 1)])
        }
    }
    var ps = new PointSystem(points, sticks, bounds, 1, 0.5, true, 50/Math.log2(dist));
    ps.rad = 0;
    return ps;
}
function generateString(bounds) {
    var points = [];
    var sticks = [];
    var dist = 5;
    var s = dist/20;
    for(var i = bounds.x + bounds.w/2; i < bounds.w/2+bounds.h/3*2; i+=dist) {
        points.push(new Point(i+randRange(-s, s), bounds.y + bounds.h/4+randRange(-s, s), i==(bounds.x + bounds.w/2)));
    }
    for(var i = 1; i < points.length; i++) {
        sticks.push([i, i-1, dist+randRange(-s, s)]);
    }
    var ps = new PointSystem(points, sticks, bounds, 1, 1, true, Number.POSITIVE_INFINITY, 50);
    ps.rad = 0;
    console.log(ps)
    return ps;
}