class Player {
    constructor() {
        this.otherSea = new Array(10);
        for(var i=0; i<10; i++){
            this.otherSea[i] = new Array(10);
            for(var j=0; j<10; j++) {
                this.otherSea[i][j] = 0;
            }
        }
        this.freeCells = 100;
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