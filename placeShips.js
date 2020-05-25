function placeShip(sea, d, l, ships) {
    var freeCells = 100;
    for (var i=0; i<10; i++) {
        for (var j=0; j<10; j++) {
            if(sea[i][j] == 1) {
                freeCells -= 1;
            } else {
                for (var k=1; k<l; k++){
                    if (d=="h"){
                        if(j+k >= 10 || sea[i][j+k] == 1) {
                            sea[i][j] = 2;
                            freeCells -= 1;
                            break;
                        }
                    } else {
                        if(i+k >= 10 || sea[i+k][j] == 1) {
                            sea[i][j] = 2;
                            freeCells -= 1;
                            break;   
                        }
                    }
                }
            }
        }
    }

    if (freeCells <= 0) {
        throw Error("Cannot place a ship");
    }

    var cell = getRandomInt(freeCells);

    sea_loop:
    for (var i=0; i<10; i++) {
        for (var j=0; j<10; j++) {
            if(sea[i][j] == 0){
                if(cell == 0) {
                    ships.push(new Ship(i, j, l, d, l, ships.length+1));
                    for(var k=0; k<l; k++){
                        if(d=="h"){
                            sea[i][j+k]=1;
                            if (i>=1) {
                                sea[i-1][j+k]=1;
                            }
                            if (i<=8){
                                sea[i+1][j+k]=1;
                            }
                        } else {
                            sea[i+k][j]=1;
                            if (j>=1) {
                                sea[i+k][j-1]=1;
                            }
                            if (j<=8){
                                sea[i+k][j+1]=1;
                            }
                        }
                    }
                    if (d=="h") {
                        if (j>=1) {
                            sea[i][j-1] = 1;
                            if (i>=1) {
                                sea[i-1][j-1]=1;
                            }
                            if (i<=8){
                                sea[i+1][j-1]=1;
                            }
                        }
                        if (j+l-1<=8) {
                            sea[i][j+l] = 1;
                            if (i>=1) {
                                sea[i-1][j+l]=1;
                            }
                            if (i<=8){
                                sea[i+1][j+l]=1;
                            }
                        }
                    } else {
                        if (i>=1) {
                            sea[i-1][j] = 1;
                            if (j>=1) {
                                sea[i-1][j-1]=1;
                            }
                            if (j<=8){
                                sea[i-1][j+1]=1;
                            }
                        }
                        if (i+l-1<=8) {
                            sea[i+l][j] = 1;
                            if (j>=1) {
                                sea[i+l][j-1]=1;
                            }
                            if (j<=8){
                                sea[i+l][j+1]=1;
                            }
                        }

                    }
                    break sea_loop;
                } else {
                    cell--;
                }
            }
        }
    }

    for (var i=0; i<10; i++) {
        for (var j=0; j<10; j++) {
            if(sea[i][j]==2){
                sea[i][j]=0;
            }
        }
    }
} 

function randomDirection() {
    if (getRandomInt(2) == 0) {
        return "h";
    } else {
        return "v";
    }
}

function placeShips() {
    var sea = [];
    for (var i=0; i<10; i++) {
        sea.push([]);
        for (var j=0; j<10; j++) {
            sea[i].push(0);
        }
    }

    var ships = [];
    placeShip(sea, randomDirection(), 4, ships);
    placeShip(sea, randomDirection(), 3, ships);
    placeShip(sea, randomDirection(), 3, ships);
    placeShip(sea, randomDirection(), 2, ships);
    placeShip(sea, randomDirection(), 2, ships);
    placeShip(sea, randomDirection(), 2, ships);
    placeShip(sea, randomDirection(), 1, ships);
    placeShip(sea, randomDirection(), 1, ships);
    placeShip(sea, randomDirection(), 1, ships);
    placeShip(sea, randomDirection(), 1, ships);

    return ships;
}

