
var screen = new AxonometricScreen(0, 250);
var screen2 = new XYScreen(0, 0, 0);

function draw(scene, radarScene) {
    // Water
    var canvas = document.getElementById("water");
    var ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);

    for (var i=0; i<10; i++) {
        for (var j=0; j<10; j++) {
            WorldPoint.drawPolygon(ctx, screen, [
                new WorldPoint(j*50, i*50, 0),
                new WorldPoint(j*50+50, i*50, 0),
                new WorldPoint(j*50+50, i*50+50, 0),
                new WorldPoint(j*50, i*50+50, 0),
            ], "white", "blue");
        }
    }

    for(var transformation of scene.transformations) {
        transformation.apply();
    }

    var sprites = [];

    for (var object of scene.objects) {
        sprites = sprites.concat(object.getSprites());
    }

    sprites.sort((a, b) => b.zDistance(screen) - a.zDistance(screen));

    for (var sprite of sprites) {
        sprite.draw(ctx, screen);
    }

    for(var transformation of scene.transformations.slice()) {
        transformation.next();
    }

    // Radar
    var canvas2 = document.getElementById("radar");
    var ctx2 = canvas2.getContext("2d");

    for (var i=0; i<11; i++) {
        WorldPoint.drawPolyline(ctx2, screen2, [new WorldPoint(i*40+50, 50, 0), new WorldPoint(i*40+50, 450, 0)], "green");
        WorldPoint.drawPolyline(ctx2, screen2, [new WorldPoint(50, i*40+50, 0), new WorldPoint(450, i*40+50, 0)], "green");

    }

    for(var transformation of radarScene.transformations) {
        transformation.apply();
    }

    sprites = [];

    for (var object of radarScene.objects) {
        sprites = sprites.concat(object.getSprites());
    }

    sprites.sort((a, b) => b.zDistance(screen2) - a.zDistance(screen2));

    for (var sprite of sprites) {
        sprite.draw(ctx2, screen2);
    }

    for(var transformation of radarScene.transformations.slice()) {
        transformation.next();
    }

    window.requestAnimationFrame(() => { draw(scene, radarScene); });
}

var ourPlayer = new Player();
var otherPlayer = new Player();

var scene = new Scene();
var radarScene = new Scene();

var ourPlayerCanHit = true;

function otherPlayerHits() {
    otherPlayer.nextShot((i, j) => {
        var { result, ship } = ourPlayer.takeHit(i, j);
        var shellSteps = 30;
        scene.addTransformation(new FireShellTransformation(i, j, shellSteps, 0, scene));
        if(result > 0){
            scene.addTransformation(new OneOffTransformation(shellSteps, scene, () => {
                ship.lives -= 1;
                otherPlayerHits();
            }));
            scene.addTransformation(new StartExplosionTransformation(i, j, shellSteps, scene));
            if (result == 2) {
                scene.addTransformation(new StartSinkTransformation(ship, shellSteps, scene));
                // TODO check here if ourPlayer lost
                return 2;
            }
            return 1;
        }else{
            scene.addTransformation(new StartSplashTransformation(i, j, shellSteps, scene));
            scene.addTransformation(new OneOffTransformation(shellSteps, scene, () => {
                ourPlayerCanHit = true;
            }));
            return 0;
        } 
    });
}

function main() {
    for (var ship of ourPlayer.ships) {
        scene.addObject(ship);
    }

    draw(scene, radarScene);

    var canvas2 = document.getElementById("radar");
    canvas2.addEventListener("click", (ev) => {
        if (!ourPlayerCanHit) {
            return;
        }

        var s = new ScreenPoint(ev.clientX-canvas2.offsetLeft, ev.clientY-canvas2.offsetTop);
        var p = screen2.toWorldPoint(s, 0);
        var i = Math.floor((p.y-50)/40);
        var j = Math.floor((p.x-50)/40);

        if (i<10 && j<10 && i>-1 && j>-1) {
            if (ourPlayer.otherSea[i][j] > 0 ) {
                // hit the same cell more than once -- redo
                return;
            }
            var { result, ship } = otherPlayer.takeHit(i, j);
            ourPlayerCanHit = false;
            // TODO use below values returned from takeHit
            var hitOrMiss;
            if (result != 0){
                hitOrMiss=1;
            }else{
                hitOrMiss=0;
            }
            radarScene.addObject(new Hit(i,j, hitOrMiss));

            // TODO check here if we won

            if(result==0){
                otherPlayerHits();
            }else{
                ourPlayerCanHit=true;
            }
        }
    }, false);

}

function waitForAllImagesToLoad(cb) {
    var images = document.getElementsByTagName("img");
    for (var i=0; i<images.length; i++) {
        if (!images.item(i).complete) {
            setTimeout(() => {
                waitForAllImagesToLoad(cb);
            }, 100);
            return;
        }
    }
    cb();
}