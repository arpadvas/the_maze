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

iaReady = false;
var itemAtlas = new Image();
itemAtlas.onload = function () {
  iaReady = true;
};
itemAtlas.src = "pics/items.png";

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

var potTiles = {
  coordinates : [0, 16, 16, 32, 32, 48],
  frame : 0
};

var switchTiles = {
  coordinates : [48, 64, 64, 80],
  frame : 0
};

var torchTiles = {
  coordinates : [0, 0, 0, 0, 0, 16, 16, 16, 16, 16, 32, 32, 32, 32, 32],
  frame : 0
};

var npcs = [];
var items = [];
var textFrame = 0
var msgs = [];
var sounds = [];


function Entity(image, sourceX, sourceY, swidth, sheight, x, y, width, height, acted) {
    this.image = image;
    this.sourceX = sourceX;
    this.sourceY = sourceY;
    this.width = width;
    this.height = height;
    this.swidth = swidth;
    this.sheight = sheight;
    this.x = x;
    this.y = y;
    this.acted = acted;
}

Entity.prototype.render = function() {
    ctx = gameArea.context;
    ctx.drawImage(this.image, this.sourceX, this.sourceY, this.swidth, this.sheight, this.x, this.y, this.width, this.height);
}

Entity.prototype.acter = function() {
    this.acted = 1;
}

function Hero(image, sourceX, sourceY, swidth, sheight, x, y, width, height, walkable, type, acted) {
    Entity.call(this, image, sourceX, sourceY, swidth, sheight, x, y, width, height, acted);
    this.speed = 64;
    this.type = type;
    if (walkable === 1) {
      nonWalkableArea.push(new createNonWalkableArea(this.x, this.y, this.width, this.height));
    }
}

function Item(image, sourceX, sourceY, swidth, sheight, x, y, width, height, walkable, type, doable, acted) {
    Entity.call(this, image, sourceX, sourceY, swidth, sheight, x, y, width, height, acted);
    this.type = type;
    this.doable = doable;
    if (walkable === 1) {
      nonWalkableArea.push(new createNonWalkableArea(this.x, this.y, this.width, this.height));
    }
    this.open = function () {
       this.sourceY = doorTiles.coordinates[doorTiles.frame];
       if (doorTiles.frame != 5) {
         doorTiles.frame = (doorTiles.frame + 1);
       } 
       else {
         doorTiles.frame = 5;
         isItemOpen = false;
       }
    }
    this.burn = function () {
       this.sourceX = torchTiles.coordinates[torchTiles.frame];
       torchTiles.frame = (torchTiles.frame + 1) % torchTiles.coordinates.length;
    }
    this.switch = function () {
       this.sourceX = switchTiles.coordinates[switchTiles.frame];
       if (switchTiles.frame != 3) {
         switchTiles.frame = (switchTiles.frame + 1);
       } 
       else {
         switchTiles.frame = 3;
         isItemSwitched = false;
       }
    }
    this.kick = function () {
       this.sourceY = potTiles.coordinates[potTiles.frame];
       if (potTiles.frame != 5) {
         potTiles.frame = (potTiles.frame + 1);
       } 
       else {
         potTiles.frame = 5;
         isItemBroken = false;
       }
    }
}

Item.prototype = Object.create(Entity.prototype);
Hero.prototype = Object.create(Entity.prototype);

var texts = [
             " ", 
             "You can't open this item!", 
             "There is nothing to switch here!", 
             "Do you wanna break your leg?", 
             "What a luck! You found a bronze key!", 
             "What a luck! You found a silver key!", 
             "The monk gives you a parchment with one word on it:", 
             "'Gloria'. You will use this password when needed!",
             "There is no one to talk to!",
             "You don't seem to be having the right key!",
             "To use it find the password first!",
             "Press H for help!",
             "To control your character press arrow keys!",
             "Open: 'O', Switch: 'S', Talk: 'T', Kick: 'K'",
             "You made it to get out! Hats off to you! :)",
             "Sorry Sir but I can't help you more..."
            ];

function Message(text, x, y) {
    this.text = text;
    this.x = x;
    this.y = y;
}

Message.prototype.render = function() {
    ctx = gameArea.context;
    ctx.font = "10px Merienda"
    ctx.fillStyle = "white";
    ctx.fillText(this.text, this.x, this.y);
}

Message.prototype.zero = function() { //to set messages default
    textFrame += 1;
    if (textFrame === 300) {
      textFrame = 0;
      for (i = 0; i < msgs.length; i += 1) {
        msgs[i].text = texts[0];
      }
    }
}

function Sound(src, volume, loop) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.volume = volume;
    this.sound.loop = loop;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}
