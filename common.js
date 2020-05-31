const cos30 = Math.cos(Math.PI/6);
const sin30 = Math.sin(Math.PI/6);

class ScreenPoint {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

}

class WorldPoint {
    constructor (x, y, z) {
        // var p = new WorldPoint(10, 20, 0);
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(x, y, z) {
        return new WorldPoint(this.x+x, this.y+y, this.z+z);
    }

    static drawPolygon(ctx, screen, vertices, strokeColor, color) {
        ctx.beginPath();
        var p0 = screen.toScreenPoint(vertices[0]);
        ctx.moveTo(p0.x, p0.y);
        for (var i=1; i<vertices.length; i++) {
            var p = screen.toScreenPoint(vertices[i]);
            ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
    }

}

class AxonometricScreen {
    constructor (X0, Y0) {
        this.X0 = X0;
        this.Y0 = Y0;
    }

    toScreenPoint(w) {
        var xp = this.X0 + w.x*cos30 + w.y*cos30;
        var yp = this.Y0 + w.y*sin30 - w.x*sin30 - w.z;
        return new ScreenPoint(xp, yp);
    }

    toWorldPoint(s, z) {
        var yw = ((s.x-this.X0)*sin30+(s.y-this.Y0)*cos30+z*cos30)/(2*sin30*cos30);
        var xw = (s.x-this.X0)/cos30 - yw;
        return new WorldPoint(xw, yw, z);
    }
}

class XYScreen {
    constructor (X0, Y0, phi) {
        this.X0 = X0;
        this.Y0 = Y0;
        this.cosphi = Math.cos(phi);
        this.sinphi = Math.sin(phi);
    }

    toScreenPoint(w) {
        var xp = this.X0 + this.cosphi*w.x - this.sinphi*w.y;
        var yp = this.Y0 + this.sinphi*w.x + this.cosphi*w.y;
        return new ScreenPoint(xp, yp);
    }

    toWorldPoint(s, z) {
        var xw = (s.x - this.X0)*this.cosphi + (s.y - this.Y0)*this.sinphi;
        var yw = -(s.x - this.X0)*this.sinphi + (s.y - this.Y0)*this.cosphi;
        return new WorldPoint(xw, yw, z);
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

class OneOffTransformation {

    constructor(delay, scene) {
        this.delay = delay;
        this.scene = scene;
        this.tick = 0;
    }

    doApply() { }

    apply() { 
        if (this.tick >= this.delay) {
            this.doApply();
        }
        this.tick += 1;
    }

    next() {
        if (this.tick >= this.delay) { 
            this.scene.removeTransformation(this);
        }
    }
}



