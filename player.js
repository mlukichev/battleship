class Player {
    constructor() {
        this.otherSea = createEmptyMap();
        this.freeCells = 100;

        this.ourSea = createEmptyMap();
        this.ships = placeShips();
        for (var ship of this.ships) {
            ship.markOnTheMap(this.ourSea);
        }    
    }

    nextShot(ask){
        var shot = getRandomInt(this.freeCells);
        for(var i=0; i<10; i++){
            for(var j=0; j<10; j++){
                if (this.otherSea[i][j]!=0) {
                    continue;
                }
                if (shot==0){
                    var result = ask(i, j); // 0 - miss, 1 - hit, 2 - kill
                    this.otherSea[i][j] = result+1;
                    this.freeCells--;
                    return;
                } else {
                    shot --;
                }
            }
        } 
    }
}