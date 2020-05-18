
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

    //console.log(scene.transformations);
    for(var transformation of scene.transformations.slice()) {
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

function main() {
    var scene = new Scene();

    var ships = placeShips();
    for (var ship of ships) {
        scene.addObject(ship);
    }

    var splash = new Splash(2,2);
    scene.addObject(splash);
    scene.addTransformation(new SplashTransformation(splash, scene));

    // var explosion = new Explosion(9,9);
    // scene.addObject(explosion);
    // scene.addTransformation(new ExplosionTransformation(explosion, scene));
 
    draw(scene);

    var canvas = document.getElementById("water");
    canvas.addEventListener("click", (ev) => {
        var s = new ScreenPoint(ev.clientX-canvas.offsetLeft, ev.clientY-canvas.offsetTop);
        var p = s.toWorldPoint(screen.X0, screen.Y0, 0);
        var i = Math.floor(p.y/50);
        var j = Math.floor(p.x/50);
        scene.addTransformation(new StartExplosionTransformation(i, j, 0, scene));
    }, false);

}