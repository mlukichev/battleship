
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

function showMessage(msg) {
    var message = document.getElementById("message-layer");
    var text = document.getElementById("text");
    text.innerText = msg;
    message.setAttribute("class", "fadeIn");
    setTimeout(() => {
        message.setAttribute("class", "fadeOut");
    }, 1500);
}

function otherPlayerHits() {
    otherPlayer.nextShot((i, j) => {
        var { result, ship } = ourPlayer.takeHit(i, j);
        var shellSteps = 30;
        scene.addTransformation(new FireShellTransformation(i, j, shellSteps, 0, scene));
        if(result > 0){
            scene.addTransformation(new OneOffTransformation(shellSteps, scene, () => {
                ship.lives -= 1;
                if (result == 2) {
                    showMessage("Our warship has been sunk!");
                } else {
                    showMessage("Our warship has been hit!");
                }
                otherPlayerHits();
            }));
            scene.addTransformation(new StartExplosionTransformation(i, j, shellSteps, scene));
            if (result == 2) {
                scene.addTransformation(new StartSinkTransformation(ship, shellSteps, scene));
                // TODO check here if ourPlayer lost
                return { result, ship };
            }
            return { result, ship };
        }else{
            scene.addTransformation(new StartSplashTransformation(i, j, shellSteps, scene));
            scene.addTransformation(new OneOffTransformation(shellSteps, scene, () => {
                ourPlayerCanHit = true;
            }));
            return { result, ship };
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
                ship.lives-=1;
            }else{
                hitOrMiss=0;
            }
            radarScene.addObject(new Hit(i,j, hitOrMiss));
            ourPlayer.otherSea[i][j]=result+1;
            if(result==2){
                ship.getNeighborCells().forEach(({i, j}) => {
                    if(i>=0 && i<10 && j>=0 && j<10 && ourPlayer.otherSea[i][j]==0) {
                        radarScene.addObject(new Hit(i,j, 0));
                        ourPlayer.otherSea[i][j]=1;
                    }
                });
            }

            // TODO check here if we won

            if(result==0){
                otherPlayerHits();
            } else {
                if (result==1){
                    showMessage("Enemy warship damaged");
                }else{
                    showMessage("Enemy warship destroyed");
                }
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