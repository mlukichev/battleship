var splashSpriteData = [];

function prepareSplash() {
    var canvas = document.getElementById("splash");
    var ctx = canvas.getContext("2d");
    var width = canvas.width, height = canvas.height;
    for(var i=0; i<28; i++) {
        var splashId = "splash"+i.toString().padStart(2,"0");
        ctx.clearRect(0, 0, width, height);
        var img = document.getElementById(splashId);
        img.crossOrigin = "Anonymous";
        ctx.drawImage(img, 0, 0, width, height);
        var data = ctx.getImageData(0, 0, width, height);
        for (var j=0; j<data.data.length; j += 4) {
            if (data.data[j]*data.data[j]+data.data[j+1]*data.data[j+1]+data.data[j+2]*data.data[j+2] <= 8000) {
                data.data[j+3]=0;
            }
        }
        console.log(data);
        splashSpriteData.push(data);
    }

    ctx.clearRect(0, 0, width, height);
    ctx.putImageData(splashSpriteData[9], 0, 0);
}

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

        var canvas = document.getElementById("splash");
        var ctx2 = canvas.getContext("2d");

        console.log(this.index);
        ctx2.putImageData(splashSpriteData[this.index], 
            0, 0);
        ctx.drawImage(canvas, s1.x-40, s1.y-50);
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

