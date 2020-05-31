class Ship {
    constructor (i, j, l, d, lives, ship_index, z) {
        this.i = i;
        this.j = j;
        this.l = l;
        this.d = d;
        this.lives = lives;
        this.ship_index = ship_index;
        this.z = z;
    }

    getSprites() {
        var sprites = [new ShipSprite(new WorldPoint(
            this.j*50, this.i*50, this.z
        ), this.l*50, 50, this.d, this.lives <= 0, "c"+this.l+this.d)];

        var p1;
        if (this.d == "h") {
            p1 = new WorldPoint(this.j*50, this.i*50, 0);
        } else {
            p1 = new WorldPoint(this.j*50, (this.i + this.l)*50, 0);
        }
        sprites.push(new HitPointsSprite(this.lives, this.l, p1, this.d));

        return sprites;
    }

    markOnTheMap(map) {
        var i = this.i, j = this.j;
        for (var k=0; k < this.l; k++) {
            map[i][j]=this.ship_index;
            if(this.d == "h"){
                j++;
            } else {
                i++;
            }
        }
    }
    
}


class ShipSprite {
    // p0 -- world coordinates of top left corner
    // l -- length of the ship in pixels
    // w -- width of the ship in pixels
    // d -- direction (v or h)
    // dead -- true = dead
    // img -- ship image
    constructor (p0, l, w, d, dead, img) {
        this.p0 = p0;
        this.l = l;
        this.w = w;
        this.d = d;
        this.dead = dead;
        this.img = img;
    }

    draw(ctx, screen) {
        var x1;
        if (this.d == "v") {
            x1 = this.p0.x + this.w; 
        } else {
            x1 = this.p0.x + this.l; 
        }
        var y1 = this.p0.y;
        var p1 = new WorldPoint(x1, y1, this.p0.z);

        var id;
        if (this.dead) {
            id = `dead_${this.img}`;
        } else {
            id = this.img;
        }
        var img = document.getElementById(id);
        ctx.drawImage(img, 
            screen.toScreenPoint(this.p0).x, 
            screen.toScreenPoint(p1).y)
    }

    zDistance(screen) {
        var p1;
        if (this.d == "v") {
            p1 = new WorldPoint(this.p0.x+this.w/2, this.p0.y+this.l/2, this.p0.z); 
        } else {
            p1 = new WorldPoint(this.p0.x+this.l/2, this.p0.y+this.w/2, this.p0.z); 
        } 
        return screen.Y0 + sin30 * (p1.x-p1.y) - p1.z;
    }
}

class HitPointsSprite {

    constructor(lives, maxLives, p0, d) {
        this.lives = lives;
        this.maxLives = maxLives;
        this.p0 = p0;
        this.d = d;
    }

    colorLivesAmount() {
        if (this.lives == this.maxLives) {
            return "white";
        } else if (this.lives == 1) {
            return "red";
        } else {
            return "yellow";
        }
    } 

    draw(ctx, screen) {
        if (this.d == "h") {
            for(var k=0; k<this.maxLives; k++){
                WorldPoint.drawPolygon(ctx, screen, [
                    this.p0.add(2,12.5*k+2,0), this.p0.add(2, 12.5*(k+1)-2, 0), 
                    this.p0.add(6, 12.5*(k+1)-2, 0), this.p0.add(6, 12.5*k+2, 0)
                ], "blue", k<this.lives?this.colorLivesAmount():"blue");    
            }
        } else {
            for(var k=0; k<this.maxLives; k++){
                WorldPoint.drawPolygon(ctx, screen, [
                    this.p0.add(12.5*k+2, -2, 0), this.p0.add(12.5*(k+1)-2, -2, 0), 
                    this.p0.add(12.5*(k+1)-2, -6, 0), this.p0.add(12.5*k+2, -6, 0)
                ], "blue", k<this.lives?this.colorLivesAmount():"blue");
            }
        }
    }

    zDistance(screen) {
        var p1;
        if (this.d == "h") {
            p1 = this.p0.add(2.5, 25, 0); 
        } else {
            p1 = this.p0.add(25, -2.5, 0); 
        } 
        return screen.Y0 + sin30 * (p1.x-p1.y) - p1.z;
    }
}

class SinkTransformation {

    constructor(ship, scene) {
        this.ship = ship;
        this.scene = scene;
        this.depth = 0;
        this.index = 0;
    }

    apply() {
        this.ship.z = this.depth;
    }

    next() {
        this.index += 1;
        this.depth = - this.index * 15. / 120.;
        if (this.index == 120) {
            this.scene.removeTransformation(this);
        } 
    }

}

