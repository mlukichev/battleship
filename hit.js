class Hit{
    constructor(i, j, hitOrMiss) {
        this.i = i;
        this.j = j;
        this.hitOrMiss = hitOrMiss;
    }
    
    getSprites(){
        return [new HitSprite(new WorldPoint(70+this.j*40,70+this.i*40, 0), this.hitOrMiss)];
    }
}

class HitSprite{
    constructor(p, hitOrMiss) {
        this.p = p
        this.hitOrMiss = hitOrMiss
    }

    draw(ctx, screen) {
        var s = screen.toScreenPoint(this.p);
        ctx.beginPath();
        ctx.arc(s.x, s.y, 10, 0, Math.PI*2);
        ctx.closePath();
        var color;
        if (this.hitOrMiss == 0){
            color="white";
        } else {
            color="red";
        }
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
    }

    zDistance(screen) {
        return 0;
    }
}
