class Player {
    constructor() {
        this.otherSea = createEmptyMap();
        this.algorithm = new SmartyPantsAlgorithm(this);

        this.ourSea = createEmptyMap();
        this.ships = placeShips();
        for (var ship of this.ships) {
            ship.markOnTheMap(this.ourSea);
        }    
    }

    nextShot(ask){
        var { i, j } = this.algorithm.chooseCell();

        var { result, ship } = ask(i, j); // 0 - miss, 1 - hit, 2 - kill (also returns ship)
        if (result == -1) {
            throw new Error("Impossible situation -- hitting the same cell more than once");
        }
        this.otherSea[i][j] = result+1;
        if(result == 2){
            ship.getNeighborCells().forEach(({i, j}) => {
                if(i>=0 && i<10 && j>=0 && j<10 && this.otherSea[i][j]==0) {
                    this.otherSea[i][j]=1;
                }
            });
        }

        this.algorithm.tellResult(i, j, result);
    }

    takeHit(i, j) {
        // Check where the shell hit and return:
        //   { result: 0, ship: null } if miss
        //   { result: 1, ship } if hit, but not killed yet
        //   { result: 2, ship } if killed
        if (this.ourSea[i][j] == 0){
            return { result: 0, ship: null };
        } else {
            var shipIndex = this.ourSea[i][j];
            var ship = this.ships[shipIndex-1];
            if (ship.lives == 1){
                return { result: 2, ship };
            }else{
                return{ result: 1, ship }; 
            }
        }
        
         
    }
}