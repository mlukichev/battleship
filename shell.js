class Shell{
    constructor(p) {
        this.p = p;
    }
    
    getSprites(){
        return [new ShellSprite(this.p)];
    }
}

class ShellSprite{
    constructor(p){
        this.p = p;
    } 
    
    draw(ctx, screen) {
        var s = screen.toScreenPoint(this.p);
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI*2);
        ctx.closePath();
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.stroke();
    }

    zDistance(screen) {
        return screen.Y0 + sin30 * (this.p.x-this.p.y) - this.p.z;
    }
}

class ShellFlight {

    constructor(p0, p1, shellSteps, shell, scene) {
        this.shell = shell;
        this.scene = scene;
        this.p0 = p0
        this.p1 = p1
        this.shellSteps = shellSteps;
        this.index = 0;
    }

    apply() {
        this.shell.p = this.p0.add(
            (this.p1.x-this.p0.x)*this.index/this.shellSteps,
            (this.p1.y-this.p0.y)*this.index/this.shellSteps,
            (this.p1.z-this.p0.z)*this.index/this.shellSteps);
    }

    next() {
        this.index += 1;
        if (this.index == this.shellSteps) {
            this.scene.removeObject(this.shell);
            this.scene.removeTransformation(this);
        } 
    }

}

class FireShellTransformation extends OneOffTransformation {
    
    constructor(i, j, shellSteps, delay, scene) {
        super(delay, scene);
        this.p0 = new WorldPoint(10*50, 10*50, 500);
        this.p1 = new WorldPoint((j+0.5)*50, (i+0.5)*50, 0);
        this.shellSteps = shellSteps;
    }

    doApply() {
        var shell = new Shell(this.p0);
        this.scene.addObject(shell);
        this.scene.addTransformation(new ShellFlight(this.p0, this.p1, this.shellSteps, shell, this.scene));
    }
}