class SplashSprite {
    // p0 -- world coordinates of top left corner
    // index -- sprite index
    constructor (p0, index) {
        this.p0 = p0;
        this.index = index;
    }

    draw(ctx, screen) {
        var p1 = new WorldPoint(this.p0.x+25, this.p0.y+25, 0);
        var s1 = p1.toScreenPoint(screen.X0, screen.Y0);

        var splashId = "splash" + this.index.toString().padStart(2, "0");
        var image = document.getElementById(splashId);
        ctx.drawImage(image, s1.x-40, s1.y-50, 80, 80);
    }

    zDistance(screen) {
        var p1 = new WorldPoint(this.p0.x+25, this.p0.y+25); 
        return screen.Y0 + sin30 * (p1.x-p1.y);
    }    
}

class Splash {
    constructor (i, j) {
        this.i = i;
        this.j = j;
        this.index = 0;
    }

    setIndex(v) {
        this.index = v;
    }

    getSprites() {
        return [new SplashSprite(new WorldPoint(
            this.j*50, this.i*50, 0
        ), this.index)];
    }
}

class SplashTransformation {
    
    constructor(splash, scene) {
        this.splash = splash;
        this.scene = scene;
        this.index = 0;
    }

    apply() {
        this.splash.setIndex(this.index);
    }

    next() {
        this.index += 1;
        if (this.index == 28) {
            this.scene.removeObject(this.splash);
            this.scene.removeTransformation(this);
        } 
    }
}

