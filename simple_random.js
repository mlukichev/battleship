class SimpleRandomAlgorithm {

    constructor(player) {
        this.player = player;
    }

    chooseCell() {
        var freeCells = 0;
        for (var i=0; i<10; i++) {
            for (var j=0; j<10; j++) {
                if (this.player.otherSea[i][j] == 0) {
                    freeCells ++;
                }
            }
        }
        var shot = getRandomInt(freeCells);
        for(var i=0; i<10; i++){
            for(var j=0; j<10; j++){
                if (this.player.otherSea[i][j]!=0) {
                    continue;
                }
                if (shot == 0){
                    return { i, j };
                } else {
                    shot --;
                }
            }
        }
    }

    tellResult(i, j, result) {
    }

}