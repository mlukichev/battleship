
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

var map;

function main() {
    var scene = new Scene();
    var radarScene = new Scene();
    var otherPlayer = new Player();

    map = new Array(10);
    for (var i=0; i<10; i++) {
        map[i]= new Array(10);
        for(var j=0; j<10; j++) {
            map[i][j]=0;
        }
    }

    var ships = placeShips();
    for (var ship of ships) {
        scene.addObject(ship);
        ship.markOnTheMap(map);
    }

    draw(scene, radarScene);

    setInterval(() => {
        otherPlayer.nextShot((i, j) => {
            var shellSteps = 30;
            scene.addTransformation(new FireShellTransformation(i, j, shellSteps, 0, scene));
            if(map[i][j] > 0){
                var ship_index = map[i][j];
                var ship = ships[ship_index-1];
                scene.addTransformation(new OneOffTransformation(shellSteps, scene, () => {
                    ship.lives -= 1;
                }))
                scene.addTransformation(new StartExplosionTransformation(i, j, shellSteps, scene));
                if (ship.lives - 1 == 0) {
                    scene.addTransformation(new StartSinkTransformation(ship, shellSteps, scene));
                    return 2;
                }
                return 1;
            }else{
                scene.addTransformation(new StartSplashTransformation(i, j, shellSteps, scene));
                return 0;
            } 
        })
    }, 1000);

    var canvas2 = document.getElementById("radar");
    canvas2.addEventListener("click", (ev) => {
        var s = new ScreenPoint(ev.clientX-canvas2.offsetLeft, ev.clientY-canvas2.offsetTop);
        var p = screen2.toWorldPoint(s, 0);
        console.log("hit:", s, p);
        var i = Math.floor((p.y-50)/40);
        var j = Math.floor((p.x-50)/40);

        // if(map[i][j] > 0){
        //     var ship_index = map[i][j];
        //     var ship = ships[ship_index-1];
        //     ship.lives -= 1;
        //     scene.addTransformation(new StartExplosionTransformation(i, j, 0, scene));
        //     if (ship.lives == 0) {
        //         scene.addTransformation(new SinkTransformation(ship, scene));
        //     }
        // }else{
        //     scene.addTransformation(new StartSplashTransformation(i, j, 0, scene));
        // }
        if (i<10 && j<10 && i>-1 && j>-1) {
            var hitOrMiss;
            if (otherPlayer.ourSea[i][j] != 0){
                hitOrMiss=1;
            }else{
                hitOrMiss=0;
            }
            radarScene.addObject(new Hit(i,j, hitOrMiss));
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