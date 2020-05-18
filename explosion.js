class ExplosionSprite {
    // p0 -- world coordinates of top left corner
    // index -- sprite index
    constructor (p0, index) {
        this.p0 = p0;
        this.index = index;
    }

    draw(ctx, screen) {
        // p1 -- center of the cell
        var p1 = new WorldPoint(this.p0.x+25, this.p0.y+25, 0);
        // s1 -- screen coordinates of p1
        var s1 = p1.toScreenPoint(screen.X0, screen.Y0);

        var explosionId = "explosion"+this.index.toString().padStart(2,"0");
        var image = document.getElementById(explosionId);
        ctx.drawImage(image, s1.x-18, s1.y-75, 37, 89);
    }

    zDistance(screen) {
        var p1 = new WorldPoint(this.p0.x+25, this.p0.y+25+75, 0); 
        return screen.Y0 + sin30 * (p1.x-p1.y);
    }    
}

class Explosion {
    constructor (i, j) {
        this.i = i;
        this.j = j;
        this.index = 0;
    }

    setIndex(v) {
        this.index = v;
    }

    getSprites() {
        return [new ExplosionSprite(new WorldPoint(
            this.j*50, this.i*50, 0
        ), this.index)];
    }
}

class ExplosionTransformation {
    
    constructor(explosion, scene) {
        this.explosion = explosion;
        this.scene = scene;
        this.index = 0;
    }

    apply() {
        this.explosion.setIndex(this.index);
    }

    next() {
        this.index += 1;
        if (this.index == 24) {
            this.scene.removeObject(this.explosion);
            this.scene.removeTransformation(this);
        } 
    }
}

class StartExplosionTransformation extends OneOffTransformation {

    constructor(i, j, delay, scene) {
        super(delay, scene);
        this.i = i;
        this.j = j;
    }

    doApply() {
        var explosion = new Explosion(this.i, this.j);
        this.scene.addObject(explosion);
        this.scene.addTransformation(new ExplosionTransformation(explosion, this.scene));
    }
}

