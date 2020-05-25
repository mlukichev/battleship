class Ship {
    constructor (i, j, l, d, lives, ship_index) {
        this.i = i;
        this.j = j;
        this.l = l;
        this.d = d;
        this.lives = lives;
        this.ship_index = ship_index;
    }

    getSprites() {
        return [new ShipSprite(new WorldPoint(
            this.j*50, this.i*50, 0
        ), this.l*50, 50, this.d, this.lives <= 0, "c"+this.l+this.d)];
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
        var p1 = new WorldPoint(x1, y1, 0);

        var id;
        if (this.dead) {
            id = `dead_${this.img}`;
        } else {
            id = this.img;
        }
        var img = document.getElementById(id);
        ctx.drawImage(img, 
            this.p0.toScreenPoint(screen.X0, screen.Y0).x, 
            p1.toScreenPoint(screen.X0, screen.Y0).y)
    }

    zDistance(screen) {
        var p1;
        if (this.d == "v") {
            p1 = new WorldPoint(this.p0.x+this.w/2, this.p0.y+this.l/2, 0); 
        } else {
            p1 = new WorldPoint(this.p0.x+this.l/2, this.p0.y+this.w/2, 0); 
        } 
        return screen.Y0 + sin30 * (p1.x-p1.y);
    }
}

