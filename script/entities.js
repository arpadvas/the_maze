caReady = false;
var characterAtlas = new Image();
characterAtlas.onload = function () {
	caReady = true;
};
characterAtlas.src = "pics/characters.png";

oaReady = false;
var otherAtlas = new Image();
otherAtlas.onload = function () {
	oaReady = true;
};
otherAtlas.src = "pics/things.png";


var spriteTiles = {
  coordinatesRight : [0, 0, 0, 0, 0, 16, 16, 16, 16, 16, 32, 32, 32, 32, 32],
  coordinatesLeft : [32, 32, 32, 32, 32, 16, 16, 16, 16, 16, 0, 0, 0, 0, 0],
  coordinatesTop : [0, 0, 0, 0, 0, 16, 16, 16, 16, 16, 32, 32, 32, 32, 32],
  coordinatesBottom : [0, 0, 0, 0, 0, 16, 16, 16, 16, 16, 32, 32, 32, 32, 32],
  frameRight : 0,
  frameLeft : 0,
  frameTop : 0,
  frameBottom : 0
};

var doorTiles = {
  coordinates : [0, 16, 16, 32, 32, 48],
  frame : 0
};

var characterTiles = [
                        {x: 0, y: 0}, {x: 16, y: 0}, {x: 32, y: 0}, {x: 48, y: 0}, {x: 64, y: 0}, {x: 80, y: 0}, {x: 96, y: 0}, {x: 112, y: 0}, {x: 128, y: 0}, {x: 144, y: 0}, {x: 160, y: 0}, {x: 176, y: 0},
                        {x: 0, y: 16}, {x: 16, y: 16}, {x: 32, y: 16}, {x: 48, y: 16}, {x: 64, y: 16}, {x: 80, y: 16}, {x: 96, y: 16}, {x: 112, y: 16}, {x: 128, y: 16}, {x: 144, y: 16}, {x: 160, y: 16}, {x: 176, y: 16},
                        {x: 0, y: 32}, {x: 16, y: 32}, {x: 32, y: 32}, {x: 48, y: 32}, {x: 64, y: 32}, {x: 80, y: 32}, {x: 96, y: 32}, {x: 112, y: 32}, {x: 128, y: 32}, {x: 144, y: 32}, {x: 160, y: 32}, {x: 176, y: 32},
                        {x: 0, y: 48}, {x: 16, y: 48}, {x: 32, y: 48}, {x: 48, y: 48}, {x: 64, y: 48}, {x: 80, y: 48}, {x: 96, y: 48}, {x: 112, y: 48}, {x: 128, y: 48}, {x: 144, y: 48}, {x: 160, y: 48}, {x: 176, y: 48},
                        {x: 0, y: 64}, {x: 16, y: 64}, {x: 32, y: 64}, {x: 48, y: 64}, {x: 64, y: 64}, {x: 80, y: 64}, {x: 96, y: 64}, {x: 112, y: 64}, {x: 128, y: 64}, {x: 144, y: 64}, {x: 160, y: 64}, {x: 176, y: 64},
                        {x: 0, y: 80}, {x: 16, y: 80}, {x: 32, y: 80}, {x: 48, y: 80}, {x: 64, y: 80}, {x: 80, y: 80}, {x: 96, y: 80}, {x: 112, y: 80}, {x: 128, y: 80}, {x: 144, y: 80}, {x: 160, y: 80}, {x: 176, y: 80},
                        {x: 0, y: 96}, {x: 16, y: 96}, {x: 32, y: 96}, {x: 48, y: 96}, {x: 64, y: 96}, {x: 80, y: 96}, {x: 96, y: 96}, {x: 112, y: 96}, {x: 128, y: 96}, {x: 144, y: 96}, {x: 160, y: 96}, {x: 176, y: 96},
                        {x: 0, y: 112}, {x: 16, y: 112}, {x: 32, y: 112}, {x: 48, y: 112}, {x: 64, y: 112}, {x: 80, y: 112}, {x: 96, y: 112}, {x: 112, y: 112}, {x: 128, y: 112}, {x: 144, y: 112}, {x: 160, y: 112}, {x: 176, y: 112}
                     ];

function Entity(image, sourceX, sourceY, swidth, sheight, x, y, width, height) {
    this.image = image;
    this.sourceX = sourceX;
    this.sourceY = sourceY;
    this.width = width;
    this.height = height;
    this.swidth = swidth;
    this.sheight = sheight;
    this.x = x;
    this.y = y;
}

Entity.prototype.render = function() {
    ctx = gameArea.context;
    ctx.drawImage(this.image, this.sourceX, this.sourceY, this.swidth, this.sheight, this.x, this.y, this.width, this.height);
}

function Hero(image, sourceX, sourceY, swidth, sheight, x, y, width, height, type) {
    Entity.call(this, image, sourceX, sourceY, swidth, sheight, x, y, width, height);
    this.speed = 64;
    if (type === "nonWalkAble") {
      nonWalkableArea.push(new createNonWalkableArea(this.x, this.y, this.width, this.height));
    }
}

var doors = [];

function Door(image, sourceX, sourceY, swidth, sheight, x, y, width, height, type) {
    Entity.call(this, image, sourceX, sourceY, swidth, sheight, x, y, width, height);
    if (type === "nonWalkAble") {
      nonWalkableArea.push(new createNonWalkableArea(this.x, this.y, this.width, this.height));
    }
    this.open = function () {
       this.sourceY = doorTiles.coordinates[doorTiles.frame];
       if (doorTiles.frame != 5) {
         doorTiles.frame = (doorTiles.frame + 1);
       } 
       else {
         doorTiles.frame = 5;
         isDoorOpen = false;
       }
    }
}

Door.prototype = Object.create(Entity.prototype);
Hero.prototype = Object.create(Entity.prototype);