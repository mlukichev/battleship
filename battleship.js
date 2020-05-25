
var screen = new Screen(0, 250);

function draw(scene) {
    var canvas = document.getElementById("water");
    var ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);

    for (var i=0; i<10; i++) {
        for (var j=0; j<10; j++) {
            screen.drawPolygon(ctx, [
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

    window.requestAnimationFrame(() => { draw(scene); });
}

var map;

function main() {
    var scene = new Scene();

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

    draw(scene);

    var canvas = document.getElementById("water");
    canvas.addEventListener("click", (ev) => {
        var s = new ScreenPoint(ev.clientX-canvas.offsetLeft, ev.clientY-canvas.offsetTop);
        var p = s.toWorldPoint(screen.X0, screen.Y0, 0);
        var i = Math.floor(p.y/50);
        var j = Math.floor(p.x/50);

        if(map[i][j] > 0){
            var ship_index = map[i][j];
            var ship = ships[ship_index-1];
            ship.lives -= 1;
            scene.addTransformation(new StartExplosionTransformation(i, j, 0, scene));
            if (ship.lives == 0) {
                scene.addTransformation(new SinkTransformation(ship, scene));
            }
        }else{
            scene.addTransformation(new StartSplashTransformation(i, j, 0, scene));
        }

    }, false);

}