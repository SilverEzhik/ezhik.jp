// conf_beyond184_3d

// EMPTY anything is zero
const EMPTY = 0;

// directions
const NORTH = 1;
const EAST = 2;
const SOUTH = 3;
const WEST = 4;

// types of things on the ground
const ROAD  = 1;
const INTERSECTION = 2;

// types of road "contents"
const CAR = -1;
const WRECK = -2;


function Cell() {
    this.type = EMPTY;

    this.direction = EMPTY;
    this.destination = EMPTY;

    this.content = new Content();
};

function Content() {
    this.type = EMPTY;
    this.cooldown = 0;
    this.wait = 0;
}

//resolution
var resX = 8;
var resY = 8;

//the two fields
var lifeField = [];
var lifeField2 = [];

//variables for swapping around
var currentLF;
var lastLF;
var temp;

//dimensions of the field
var a;
var b;

var iterations = 0;

//mode to place cells
var setupMode = false;
//mode where each cell has a 1 in 10000 chance of randomly changing 


function setup() {
    res = 8;
    resX = res;
    resY = res;
    var canvas = createCanvas(800, 800, WEBGL);
    canvas.parent('canvascontainer');
    //get dimensions
    a = Math.floor(width/resX);
    b = Math.floor(height/resY);

    a = 100;
    b = 100;

    //create two empty fields
    for(var i = 0; i < a; i++) {
        lifeField[i] = [];
        lifeField2[i] = [];
        for(var j = 0; j < b; j++) {
            lifeField[i][j] = new Cell();
            lifeField2[i][j] = new Cell();
        }
    }
 

    currentLF = lifeField;
    lastLF = lifeField2;

    for(var i = 5; i < a; i+=20) {
        for(var j = 0; j < b; j++) {
            createRoad(i, j, SOUTH, SOUTH);
            createRoad(i + 1, j, NORTH, NORTH);
        }
    }
    for(var j = 5; j < b; j+=10) {
        for (var i = 0; i < a; i++) {
            if (getCell(i, j).type == ROAD) {
                createIntersection(i, j, WEST, getCell(i, j).direction, WEST, getCell(i, j).destination);
            }
            else {
                createRoad(i, j, WEST, WEST);
            }
            if (getCell(i, j + 1).type == ROAD) {
                createIntersection(i, j + 1, EAST, getCell(i, j + 1).direction, EAST, getCell(i, j + 1).destination);
            }
            else {
                createRoad(i, j + 1, EAST, EAST);
            }
        }
    }

    for(var i = 0; i < a; i+=2) {
        for(var j = 0; j < b; j+=2) {
            if (getCell(i, j).type == EMPTY) {
                getCell(i, j).height = Math.floor(random(100));
                getLastCell(i, j).height = getCell(i, j).height;
            }
        }
    }

    carCounter = 0;
    for(var i = 0; i < a / 2; i++) {
        for(var j = 0; j < b / 2; j++) {
            carCounter++;
            if (getCell(i, j).type != EMPTY) {
                if (carCounter % 1 == 0) {
                    createContent(i, j, CAR, 2, 2);
                }
            }
        }
    }

    for (i = 0; i < 1000; i++) {
        lifeStep();
    }
}

function createContent(x, y, type, cooldown, wait) {
    currentLF[x][y].content.type = type;
    currentLF[x][y].content.cooldown = cooldown;
    currentLF[x][y].content.wait = wait;

    lastLF[x][y].content.type = type;
    lastLF[x][y].content.cooldown = cooldown;
    lastLF[x][y].content.wait = wait;
}

//delta for roads - don't rewrite all of them every single step
function createIntersection(x, y, direction, iDirection, destination, iDestination) {
    currentLF[x][y].type = INTERSECTION;
    currentLF[x][y].direction = direction;
    currentLF[x][y].iDirection = iDirection;
    currentLF[x][y].destination = destination;
    currentLF[x][y].iDestination = iDestination;

    lastLF[x][y].type = INTERSECTION;
    lastLF[x][y].direction = direction;
    lastLF[x][y].iDirection = iDirection;
    lastLF[x][y].destination = destination;
    lastLF[x][y].iDestination = iDestination;
}

function createRoad(x, y, direction, destination) {
    currentLF[x][y].type = ROAD;
    currentLF[x][y].direction = direction;
    currentLF[x][y].destination = destination;

    lastLF[x][y].type = ROAD;
    lastLF[x][y].direction = direction;
    lastLF[x][y].destination = destination;
}

function getCell(x, y) {
    x = x % a;
    y = y % b;
    //wraparound
    if(x < 0) {
        x = a + x;
    }
    else if (x >= a) {
        x = x - a;
    }
    if(y < 0) {
        y = b + y;
    }
    else if (y >= b) {
        y = y - b;
    }

    return currentLF[x][y];
}

function getLastCell(x, y) {
    //wraparound
    if(x < 0) {
        x = a + x;
    }
    else if (x >= a) {
        x = x - a;
    }
    if(y < 0) {
        y = b + y;
    }
    else if (y >= b) {
        y = y - b;
    }

    return lastLF[x][y];
}

function getLastNeighborWithDirectionalOffset(x, y, i) {
    var direction;
    if (i > 0) {
        direction = getLastCell(x, y).destination;
    }
    else if (i < 0) {
        direction = getLastCell(x, y).direction;
    }
    else {
        return getLastCell(x, y);
    }

    return getLastNeighborAtDirection(x, y, i, direction);
}

function getLastNeighborAtDirection(x, y, i, direction) {
    switch(direction) {
        case NORTH:
            return getLastCell(x, y - i); 
        case EAST:
            return getLastCell(x + i, y); 
        case SOUTH:
            return getLastCell(x, y + i); 
        case WEST:
            return getLastCell(x - i, y); 
    }
}

// returns a cell depending on given cell's direction
function getLastDirectionalNeighbor(x, y) {
    return getLastNeighborWithDirectionalOffset(x, y, -1);
}
// returns a cell depending on given cell's direction
function getLastForwardsDirectionalNeighbor(x, y) {
    return getLastNeighborWithDirectionalOffset(x, y, 1);
}

//if there is something ahead, return true
function isThereAnObstacleAhead(x, y) {
    for (var i = 1; i < 4; i++) {
        neighbor = getLastNeighborWithDirectionalOffset(x, y, i); 
        if (neighbor.type != ROAD || neighbor.content.type != EMPTY) {
            return true;
        }
    }
    return false;
}

//traverse roads somewhat similarly to a linked list, return car count
function getCarCount(originX, originY, originDestination) {
    var carCount = 0;

    var x = originX;
    var y = originY;
    var destination = originDestination;

    var lastCell = getLastCell(x, y);

    for (var i = 0; i < 20; i++) {
        switch(destination) {
            case NORTH:
                y = y - 1; 
                break;
            case EAST:
                x = x + 1; 
                break;
            case SOUTH:
                y = y + 1; 
                break;
            case WEST:
                x = x - 1; 
                break;
        }
        
        currentCell = getLastCell(x, y);
        
        //going from origin cell to first neighbor to check ignores destination-destination matching
        if ((x != originX && y != originY) && lastCell.destination != currentCell.direction) {
            break;
        }
        
        if (currentCell.content.type == CAR) {
            carCount++;
        }

        lastCell = currentCell;
        destination = lastCell.destination;
    }
    return carCount;
}

function getCarCountBackwards(originX, originY, originDirection) {
    var carCount = 0;

    var x = originX;
    var y = originY;
    var direction = originDirection;

    var lastCell = getLastCell(x, y);

    for (var i = 0; i < 5; i++) {
        switch(direction) {
            case NORTH:
                y = y + 1; 
                break;
            case EAST:
                x = x - 1; 
                break;
            case SOUTH:
                y = y - 1; 
                break;
            case WEST:
                x = x + 1; 
                break;
        }
        
        currentCell = getLastCell(x, y);
        
        //going from origin cell to first neighbor to check ignores direction-destination matching
        if ((x != originX && y != originY) && lastCell.direction != currentCell.destination) {
            break;
        }
        
        if (currentCell.content.type == CAR) {
            carCount++;
        }

        lastCell = currentCell;
        direction = lastCell.direction;
    }
    return carCount;
}




//step process for a single cell
function cellStep(x, y) {
    if (getLastCell(x, y).type == INTERSECTION) {
        if (getLastCell(x, y).iDirection != EMPTY) {
            var carCount = getCarCountBackwards(x, y, getLastCell(x, y).direction);
            var iCarCount = getCarCountBackwards(x, y, getLastCell(x, y).iDirection);

            if (carCount > iCarCount) {
                getCell(x, y).direction = getLastCell(x, y).direction;
                getCell(x, y).iDirection = getLastCell(x, y).iDirection;
            }
            else {
                getCell(x, y).direction = getLastCell(x, y).iDirection;
                getCell(x, y).iDirection = getLastCell(x, y).direction;
            }
        }
        
        if (getLastCell(x, y).iDestination != EMPTY) {
            var carCount = getCarCount(x, y, getLastCell(x, y).destination);
            var iCarCount = getCarCount(x, y, getLastCell(x, y).iDestination);

            if (carCount < iCarCount) {
                getCell(x, y).destination = getLastCell(x, y).destination;
                getCell(x, y).iDestination = getLastCell(x, y).iDestination;
            }
            else {
                getCell(x, y).destination = getLastCell(x, y).iDestination;
                getCell(x, y).iDestination = getLastCell(x, y).destination;
            }
        }

        neighbor = getLastDirectionalNeighbor(x, y);
        iNeighbor = getLastNeighborAtDirection(x, y, -1, getLastCell(x, y).iDirection);
        if (iNeighbor.destination == getLastCell(x, y).iDirection && iNeighbor.content.type == CAR && iNeighbor.content.cooldown != 2 && iNeighbor.content.wait == 0 && neighbor.content.type == CAR && neighbor.content.wait == 0) {
                getCell(x, y).content.type = WRECK;
                getCell(x, y).content.wait = 10;
                print("crash " + iterations);
                return;
        }
        else if (iNeighbor.content.type == CAR && iNeighbor.content.cooldown != 2 && iNeighbor.content.wait == 0 && iNeighbor.destination == getLastCell(x, y).iDirection) {
            getCell(x, y).content.type = CAR;
            getCell(x, y).content.cooldown = iNeighbor.content.cooldown;
            getCell(x, y).content.wait = getCell(x, y).content.cooldown;
            
            //if there is something ahead, slow down
            if (isThereAnObstacleAhead(x, y) == true) {
                if (getCell(x, y).content.cooldown < 2) {
                    getCell(x, y).content.cooldown++;
                }
                getCell(x, y).content.wait = getCell(x, y).content.cooldown;
                return;
            }
            //else, speed up
            if (getCell(x, y).content.cooldown > 0) {
                getCell(x, y).content.cooldown--;
                getCell(x, y).content.wait = getCell(x, y).content.cooldown;
            }
            return;
        }
    }

    if (getLastCell(x, y).type != EMPTY) {
        neighbor = getLastDirectionalNeighbor(x, y);
        //operate on cell "contents"
        if (getLastCell(x, y).content.type == WRECK) {
            getCell(x, y).content.type = WRECK;
            getCell(x, y).content.wait = getLastCell(x, y).content.wait - 1;
            
            if (getCell(x, y).content.wait == 0) {
                getCell(x, y).content.type = EMPTY;
            }
        }
        else if (getLastCell(x, y).content.type == EMPTY || (getLastCell(x, y).content.type == CAR && getLastCell(x, y).content.cooldown != 2 && getLastCell(x, y).content.wait == 0 && neighbor.content.cooldown != 2 && neighbor.content.wait == 0)) {
            if (neighbor.content.type == CAR && neighbor.content.wait == 0 && neighbor.destination == getLastCell(x, y).direction) {
                getCell(x, y).content.type = CAR;
                getCell(x, y).content.cooldown = neighbor.content.cooldown;
                getCell(x, y).content.wait = getCell(x, y).content.cooldown;
                
                //if there is something ahead, slow down
                if (isThereAnObstacleAhead(x, y) == true) {
                    if (getCell(x, y).content.cooldown < 2) {
                        getCell(x, y).content.cooldown++;
                    }
                    getCell(x, y).content.wait = getCell(x, y).content.cooldown;
                    return;
                }
                //else, speed up
                if (getCell(x, y).content.cooldown > 0 && getLastCell(x, y).type == ROAD) {
                    getCell(x, y).content.cooldown--;
                    getCell(x, y).content.wait = getCell(x, y).content.cooldown;
                }
                return;
            }
            else {
                getCell(x, y).content.type = EMPTY;
            }
        }
        else if (getLastCell(x, y).content.type == CAR) {
            //check for incoming crashes first
            neighbor = getLastDirectionalNeighbor(x, y);
            if (neighbor.destination == getLastCell(x, y).direction && neighbor.content.type == CAR && neighbor.content.cooldown != 2 && neighbor.content.wait == 0 && getLastCell(x, y).content.wait != 0) {
                print("crash " + iterations);
                getCell(x, y).content.type = WRECK;
                getCell(x, y).content.wait = 10;
                return;
            }

            if (getLastCell(x, y).content.cooldown == 2) {
                if (getLastCell(x, y).content.wait == 0) {
                    forwardsNeighbor = getLastForwardsDirectionalNeighbor(x, y);
                    if (forwardsNeighbor.type != EMPTY && forwardsNeighbor.content.type == EMPTY && forwardsNeighbor.direction == getLastCell(x, y).destination) {
                        getCell(x, y).content.type = EMPTY;
                    }
                    else {
                        getCell(x, y).content.type = CAR;
                        getCell(x, y).content.cooldown = 2;
                        getCell(x, y).content.wait = 0; 
                    }
                }
                else {
                    getCell(x, y).content.type = CAR;
                    getCell(x, y).content.cooldown = 2;
                    getCell(x, y).content.wait = getLastCell(x, y).content.wait - 1;
                }
            }
            else if (getLastCell(x, y).content.cooldown == 1) {
                if (getLastCell(x, y).content.wait == 0) {
                    //we didn't stop so go and crash
                    getCell(x, y).content.type = EMPTY;
                }
                else {
                    getCell(x, y).content.type = CAR;
                    getCell(x, y).content.cooldown = 1;
                    getCell(x, y).content.wait = 0;
                }
            }
            
            else if (getLastCell(x, y).content.cooldown == 0) {
                //go no matter what
                getCell(x, y).content.type = EMPTY;
            }
        }
    }
}

//swaps the two fields
function swapFields() {
    temp = currentLF;
    currentLF = lastLF;
    lastLF = temp;
}

//perform a single step
function lifeStep() {
    swapFields();
    for(var i = 0; i < a; i++) {
        for(var j = 0; j < b; j++) {
            cellStep(i, j);
        }
    }
    iterations++;
}


function keyPressed() {
    if (keyCode === 87) {
        y-=80;
    }
    if (keyCode === 83) {
        y+=80;
    }
    if (keyCode === 65) {
        x-=80;
    }
    if (keyCode === 68) {
        x+=80;
    }

    mod = 0.1;
    if (keyCode === 81) {
        rotZ -= mod;
    }
    if (keyCode === 69) {
        rotZ += mod;
    }
    print(rotZ);

    if (keyCode === 90) {
        rotX -= mod;
    }
    if (keyCode === 88) {
        rotX += mod;
    }

    //mode to place cells on screen
    if (key == ' ') {
        setupMode = !setupMode;
    }
    if (keyCode === 190) {
        lifeStep();
    }
    if (keyCode === 188) {
        iterations--;
        swapFields();
    }
}


function drawSquare(x, y) {
    cc = currentLF[x][y];
    push();
        rectMode(CENTER);
        translate((x + 0.5) * resX, (y + 0.5) * resY);
        fill(0, 0, 0);
        rect(0, 0, resX, resY);
        pop();
        return;
        if(cc.type == ROAD) {
            stroke(255);
        }
        else if (cc.type = INTERSECTION) {
            stroke(150, 200, 255);
        }
        strokeWeight(2);
        push();
            switch(cc.direction) {
                case NORTH:
                    break;
                case EAST:
                    rotate(0.5 * PI);
                    break;
                case SOUTH:
                    rotate(PI);
                    break;
                case WEST:
                    rotate(-0.5 * PI);
                    break;
            }
            line(0, 0, 0, resY/2 - 2);
        pop();

        push();
            switch(cc.destination) {
                case NORTH:
                    rotate(PI);
                    break;
                case EAST:
                    rotate(-0.5 * PI);
                    break;
                case SOUTH:
                    break;
                case WEST:
                    rotate(0.5 * PI);
                    break;
            }
            line(0, 0, 0, resY/2 - 2);
            line(2, resY/3 - 2, 0, resY/3);
            line(-2, resY/3 - 2, 0, resY/3);
        pop();
    pop();
}
        

var carCount;

function drawCar(x, y) {
    var cc = getCell(x, y);

    push();
        translate(x * 10, y * 10, -10);
        switch(cc.destination) {
            case NORTH:
                rotateZ(PI);
                break;
            case EAST:
                rotateZ(-0.5 * PI);
                break;
            case SOUTH:
                break;
            case WEST:
                rotateZ(0.5 * PI);
                break;
        }
        if (getCell(x, y).content.type == WRECK) {
            fill(255, 255, 0);
            putBox(10, 10, 10);
        }
        else {
            fillLightColor(cc.direction);
            ellipse(1.8, 0, 2, 6 - 2 * cc.content.cooldown);
            ellipse(-1.8, 0, 2, 6 - 2 * cc.content.cooldown);
        }

    pop();
}

function putBox(width, height, depth) {
    push();
        translate(0, 0, depth/2);
        box(width, height, depth);
    pop();
}

var x = -200;
var y = -200;
var z = 200;
var rotX = -0.5;
var rotY = 0;
var rotZ = 0;

function fillLightColor(destination) {
        switch(destination) {
            case NORTH:
                if (rotZ > -1.55 && rotZ < 1.55) {
                    fill(255, 0, 0);
                }
                else {
                    fill(255, 255, 255);
                }
                break;
            case EAST:
                if (rotZ > 0.1 && rotZ < 3.2) {
                    fill(255, 0, 0);
                }
                else {
                    fill(255, 255, 255);
                }
                break;
            case SOUTH:
                if (rotZ > -1.55 && rotZ < 1.55) {
                    fill(255, 255, 255);
                }
                else {
                    fill(255, 0, 0);
                }
                break;
            case WEST:
                if (rotZ > 0.1 && rotZ < 3.2) {
                    fill(255, 255, 255);
                }
                else {
                    fill(255, 0, 0);
                }
                break;
        }
        return;
}

function draw() {
    if (frameCount % 800 < 600) {
        mod = 1;
        x += mod;
        y += mod;
    }
    else {
        rotZ += 0.01;
    }

    

    //rotZ += 0.01;
    if (rotZ < -PI) {
        rotZ = TWO_PI + rotZ;
    }
    if (rotZ > PI) {
        rotZ = rotZ - TWO_PI;
    }

    if(x < 0) {
        x = a * 10 + x;
    }
    else if (x >= a * 10) {
        x = x - a * 10;
    }
    if(y < 0) {
        y = b * 10 + y;
    }
    else if (y >= b * 10) {
        y = y - b * 10;
    }

    x = x % (a * 10);
    y = y % (b * 10);

    rotateY(rotY);
    rotateX(rotX);
    rotateZ(rotZ);
    translate(x, y, z);

    //change background depending on mode
    if(setupMode == false) {
        background(0);
        //only swap field pointers if not in setup mode
        lifeStep();
        //swapFields();
        iterations++;
    }
    else {
        background(0, 0, 255);
    }

    push();
    for(var i = -2 * a; i < 2 * a; i++) {
        for(var j = -2 * b; j < 2 * b; j++) {
            if (getDist(-x, i * 10, -y, j * 10) < 500) {
                cc = getCell(i, j); 

                
                if (cc.type != EMPTY) {
                    fill(0, 0, 0);
                    
                    if (cc.content.type != EMPTY) {
                        if (cc.content.type == CAR) {
                            carCount++;
                            switch(cc.content.cooldown) {
                                case 2:
                                    fill(0, 200, 200);
                                    break;
                                case 1:
                                    fill(100, 200, 0);
                                    break;
                                case 0:
                                    fill(200, 200, 0);
                                    break;
                            }
                        }
                        else if (cc.content.type == WRECK) {
                            fill(255, 0, 0);
                        }

                        drawCar(i, j);
                        
                    }
                }
                else {
                    if (typeof cc.height != "undefined") {
                        push();
                            colorMode(HSB);
                            fill(200, 100, 100 * Math.abs(Math.sin(i % a + j * b)));
                            translate(-5 + i * 10, -5 +  j * 10, 0);
                            putBox(20, 20, cc.height);
                        pop();
                    }
                }
            }
        }
    }
    pop();

    fill(255);
}

function getDist(x1, x2, y1, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
