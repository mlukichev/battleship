const cos30 = Math.cos(Math.PI/6);
const sin30 = Math.sin(Math.PI/6);

class ScreenPoint {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    toWorldPoint(X0, Y0, z) {
        var yw = ((this.x-X0)*sin30+(this.y-Y0)*cos30+z*cos30)/(2*sin30*cos30);
        var xw = (this.x-X0)/cos30 - yw;
        return new WorldPoint(xw, yw, z);
    }
}

class WorldPoint {
    constructor (x, y, z) {
        // var p = new WorldPoint(10, 20, 0);
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toScreenPoint(X0, Y0) {
        var xp = X0 + this.x*cos30 + this.y*cos30;
        var yp = Y0 + this.y*sin30 - this.x*sin30 - this.z;
        return new ScreenPoint(xp, yp);
    }
}

class Screen {
    constructor (X0, Y0) {
        this.X0 = X0;
        this.Y0 = Y0;
    }

    drawPolygon(ctx, vertices, strokeColor, color) {
        ctx.beginPath();
        var p0 = vertices[0].toScreenPoint(this.X0, this.Y0);
        ctx.moveTo(p0.x, p0.y);
        for (var i=1; i<vertices.length; i++) {
            var p = vertices[i].toScreenPoint(this.X0, this.Y0);
            ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}



