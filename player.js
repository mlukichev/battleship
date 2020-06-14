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
                if (shot == 0){
                    var { result, ship } = ask(i, j); // 0 - miss, 1 - hit, 2 - kill (also returns ship)
                    if (result == -1) {
                        throw new Error("Impossible situation -- hitting the same cell more than once");
                    }
                    this.otherSea[i][j] = result+1;
                    this.freeCells--;
                    return;
                } else {
                    shot --;
                }
            }
        } 
    }

    takeHit(i, j) {
        // TODO Check where the shell hit and return:
        //   { -1, null } if cell has been hit before -- redo 
        //   { 0, null } if miss
        //   { 1, null } if hit, but not killed yet
        //   { 2, ship } if killed
        return { result: 0, ship: null }; 
    }
}