class SmartyPantsAlgorithm {

    constructor(player) {
        this.player = player;
        this.context = null;
    }

    chooseCell() {
        if (this.context == null) {
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
        } else {
            var { i, j, d } = this.context;
            if (d) {
                if (d == "h") {
                    if (j-1 >= 0 && this.player.otherSea[i][j-1] == 0)  {
                        return { i, j: j-1 };
                    } else
                    if (j+1 < 10 && this.player.otherSea[i][j+1] == 0) {
                        return { i, j: j+1 };
                    } else {
                        if (j == 9 || this.player.otherSea[i][j+1] == 1) {
                            j --;
                            while (j >= 0 && this.player.otherSea[i][j] > 0) {
                                j --;
                            }
                            if (j < 0) {
                                console.log("Incorrect position: ", this.context, this.player.otherSea[i]);
                                this.context = null;
                                return this.chooseCell();
                            }
                            return { i, j };
                        } else
                        if (j == 0 || this.player.otherSea[i][j-1] == 1) {
                            j ++;
                            while (j < 10 && this.player.otherSea[i][j] > 0) {
                                j ++;
                            }
                            if (j >= 10) {
                                console.log("Incorrect position: ", this.context, this.player.otherSea[i]);
                                this.context = null;
                                return this.chooseCell();
                            }
                            return { i, j };
                        } else {
                            this.context = null;
                            return this.chooseCell();
                        }
                    }
                } else {
                    if (i-1 >= 0 && this.player.otherSea[i-1][j] == 0)  {
                        return { i: i-1, j };
                    } else
                    if (i+1 < 10 && this.player.otherSea[i+1][j] == 0) {
                        return { i: i+1, j };
                    } else {
                        if (i == 9 || this.player.otherSea[i+1][j] == 1) {
                            i --;
                            while (i >= 0 && this.player.otherSea[i][j] > 0) {
                                i --;
                            }
                            if (i < 0) {
                                console.log("Incorrect position: ", this.context, this.player.otherSea.map(v => v[j]));
                                this.context = null;
                                return this.chooseCell();
                            }
                            return { i, j };
                        } else
                        if (i == 0 || this.player.otherSea[i-1][j] == 1) {
                            i ++;
                            while (i < 10 && this.player.otherSea[i][j] > 0) {
                                i ++;
                            }
                            if (i >= 10) {
                                console.log("Incorrect position: ", this.context, this.player.otherSea.map(v => v[j]));
                                this.context = null;
                                return this.chooseCell();
                            }
                            return { i, j };
                        } else {
                            this.context = null;
                            return this.chooseCell();
                        }
                    }
                }
            } else {
                if (i>=1 && this.player.otherSea[i-1][j] == 0) {
                    return { i: i-1, j };
                } else
                if (j>=1 && this.player.otherSea[i][j-1] == 0) {
                    return { i, j: j-1 };
                } else
                if (i<=8 && this.player.otherSea[i+1][j] == 0) {
                    return { i: i+1, j};
                } else 
                if (j<=8 && this.player.otherSea[i][j+1] == 0) {
                    return { i, j: j+1 };
                } else {
                    this.context = null;
                    return this.chooseCell();
                }
            }
        }
    }

    tellResult(i, j, result) {
        if (result == 1) {
            if (this.context) {
                if (this.context.i == i) {
                    this.context.d = "h";
                } else {
                    this.context.d = "v";
                }
            }
            this.context = {
                ...(this.context || {}),
                i,
                j
            };
        } else 
        if (result == 2) {
            this.context = null;
        }
    }

}