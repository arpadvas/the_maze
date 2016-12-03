function collisionDetection() {
  for (i = 0; i < nonWalkableArea.length; i += 1) {
      crashWithLeft(nonWalkableArea[i]);
      if (crashLeft === true) {
        break;
      }
    }
    for (i = 0; i < nonWalkableArea.length; i += 1) {
      crashWithRight(nonWalkableArea[i]);
      if (crashRight === true) {
        break;
      }
    }
    for (i = 0; i < nonWalkableArea.length; i += 1) {
      crashWithTop(nonWalkableArea[i]);
      if (crashTop === true) {
        break;
      }
    }
    for (i = 0; i < nonWalkableArea.length; i += 1) {
      crashWithBottom(nonWalkableArea[i]);
      if (crashBottom === true) {
        break;
      }
    }
}

function crashWithTop(wall) {
        var left = hero.x;
        var right = hero.x + (hero.width);
        var top = hero.y;
        var bottom = hero.y + (hero.height);
        var wallleft = wall.x;
        var wallright = wall.x + (wall.width);
        var walltop = wall.y;
        var wallbottom = wall.y + (wall.height);
        crashTop = false;
        if ((top <= wallbottom && bottom > wallbottom && right > wallleft+3 && left < wallright-3) || top < 0) {
           crashTop = true;
        }
    }

function crashWithBottom(wall) {
        var left = hero.x;
        var right = hero.x + (hero.width);
        var top = hero.y;
        var bottom = hero.y + (hero.height);
        var wallleft = wall.x;
        var wallright = wall.x + (wall.width);
        var walltop = wall.y;
        var wallbottom = wall.y + (wall.height);
        crashBottom = false;  
        if ((bottom >= walltop && top < walltop && right > wallleft+5 && left < wallright-5) || bottom > gameArea.canvas.height) {
           crashBottom = true;
        }
    }

function crashWithRight(wall) {
        var left = hero.x;
        var right = hero.x + (hero.width);
        var top = hero.y;
        var bottom = hero.y + (hero.height);
        var wallleft = wall.x;
        var wallright = wall.x + (wall.width);
        var walltop = wall.y;
        var wallbottom = wall.y + (wall.height);
        crashRight = false;
        if ((right >= wallleft && bottom > walltop+3 && top < wallbottom-3 && left < wallleft) || right > gameArea.canvas.width) {
           crashRight = true;
        }
    }

function crashWithLeft(wall) {
        var left = hero.x;
        var right = hero.x + (hero.width);
        var top = hero.y;
        var bottom = hero.y + (hero.height);
        var wallleft = wall.x;
        var wallright = wall.x + (wall.width);
        var walltop = wall.y;
        var wallbottom = wall.y + (wall.height);
        crashLeft = false;
        if ((left <= wallright && bottom > walltop+3 && top < wallbottom-3 && right > wallright) || left < 0) {
           crashLeft = true;
        }
    }

var gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 512;
        this.canvas.height = 512;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        requestAnimationFrame(main);
        window.addEventListener('keydown', function (e) {
            gameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            gameArea.key = false;
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function main() {
    now = Date.now();
    delta = now - then;
    gameArea.clear();
    map.tileCreator(0);
    map.tileCreator(1);
    isNonWalkableAreaFilled = true;
    collisionDetection();
    update(delta/1000);
    renderItems();
    hero.render();
    npcs[0].render();
    renderMsgs();
    then = now;
    if (isGameOver === false) {
      requestAnimationFrame(main);
    }
}

function renderItems() {
  for (i = 0; i < items.length; i += 1) {
      if (items[i].acted === 0 || items[i].acted === 1) {
        items[i].render();
        if (items[i].type === "torch") {
          items[i].burn();
        }
      }  
  }
}

function renderMsgs() {
  for (i = 0; i < msgs.length; i += 1) {
      msgs[i].render();
      msgs[i].zero();
  }
}

var isItemOpen = false;
var isItemSwitched = false;
var isItemBroken = false;
var isGameOver = false;
var isNpcTalked = false;

function update(modifier) {
    if (hero.y < 0) {
      isGameOver = true;
      msgs[0].text = texts[14];
    }
    if (gameArea.key && gameArea.key == 37 && crashLeft === false) {
      hero.sourceY = 16;
      hero.sourceX = spriteTiles.coordinatesLeft[spriteTiles.frameLeft];
      hero.x -= hero.speed * modifier;
      spriteTiles.frameLeft = (spriteTiles.frameLeft + 1) % spriteTiles.coordinatesLeft.length;
      sounds[4].play();
    }
    if (gameArea.key && gameArea.key == 39 && crashRight === false) {
      hero.sourceY = 32;
      hero.sourceX = spriteTiles.coordinatesRight[spriteTiles.frameRight];
      hero.x += hero.speed * modifier;
      spriteTiles.frameRight = (spriteTiles.frameRight + 1) % spriteTiles.coordinatesRight.length;
      sounds[4].play();
    }
    if (gameArea.key && gameArea.key == 38 && crashTop === false) {
      hero.sourceY = 48;
      hero.sourceX = spriteTiles.coordinatesTop[spriteTiles.frameTop];
      hero.y -= hero.speed * modifier; 
      spriteTiles.frameTop = (spriteTiles.frameTop + 1) % spriteTiles.coordinatesTop.length;
      sounds[4].play();
    }
    if (gameArea.key && gameArea.key == 40 && crashBottom === false) {
      hero.sourceY = 0;
      hero.sourceX = spriteTiles.coordinatesBottom[spriteTiles.frameBottom];
      hero.y += hero.speed * modifier; 
      spriteTiles.frameBottom = (spriteTiles.frameBottom + 1) % spriteTiles.coordinatesBottom.length;
      sounds[4].play();
    } 
    if (gameArea.key && (gameArea.key == 79 || gameArea.key == 83 || gameArea.key == 75)) {
      checkIfItemActionable(gameArea.key);
    }
    if (isItemOpen === true || isItemSwitched === true || isItemBroken === true) {
      performAction();
    }
    if (gameArea.key && gameArea.key == 84) {
      if (isNpcTalked === false) {
        talkToNpc();
        isNpcTalked = true;
      }
    }
    if (gameArea.key && gameArea.key == 72) {
      msgs[0].text = texts[12];
      msgs[1].text = texts[13];
      textFrame = -600;
    }
    if (gameArea.key === false) {
      hero.sourceX = 16;
      hero.sourceY = 0;
      isNpcTalked = false;
    }
}


function talkToNpc() {
  for (i = 0; i < npcs.length; i += 1) {
      checkIfItemClose(npcs[i]);
      if (isItemClose === true && npcs[i].type === "npc" && npcs[i].acted === 0) {
        npcs[i].acter();
        afterActon();
        msgs[0].text = texts[6];
        msgs[1].text = texts[7];
        textFrame = -600;
      }
      else if (isItemClose === true && npcs[i].type === "npc" && npcs[i].acted === 1) {
        msgs[0].text = texts[15];
        textFrame = 0;
      }
    }
}


function checkIfItemActionable(key) {
  for (i = 0; i < items.length; i += 1) {
      checkIfItemClose(items[i]);
      if (isItemClose === true && (items[i].type === "door" || items[i].type === "chest") && key === 79) {
        isItemOpen = true;
        break;
      } 
      else if (isItemClose === true && key === 79 && (items[i].type !== "door" || items[i].type !== "chest")) {
        msgs[0].text = texts[1];
        textFrame = 0;
      }
      if (isItemClose === true && items[i].type === "switch" && key === 83) {
        isItemSwitched = true;
        break;
      }
      else if (isItemClose === true && items[i].type != "switch" && key === 83) {
        msgs[0].text = texts[2];
        textFrame = 0;
      }
      if (isItemClose === true && items[i].type === "pot" && key === 75) {
        isItemBroken = true;
        break;
      }
      else if (isItemClose === true && items[i].type != "pot" && key === 75) {
        msgs[0].text = texts[3];
        textFrame = 0;
      }
  } 
}


function performAction() {
    for (i = 0; i < items.length; i += 1) {
      checkIfItemClose(items[i]);
      if (isItemClose === true && isItemOpen === true && (items[i].type === "door" || items[i].type === "chest")) {
        if (items[i].doable === true) {
          items[i].open();
          items[i].acter();
          afterActon();
          if (items[i].type === "door") {
            sounds[1].play();
          }
          if (items[i].type === "chest") {
            sounds[2].play();
          }
          if (items[i].type === "door") {
            makeItemWalkable(items[i]);
          }
          break;
        } else {
          isItemOpen = false;
          msgs[0].text = texts[9];
          textFrame = 0;
        }
      }
      if (isItemClose === true && items[i].type === "switch" && isItemSwitched === true) {
        if (items[i].doable === true) {
          sounds[0].play();
          items[i].switch();
          items[i].acter();
          afterActon();
        } else {
          isItemSwitched = false;
          msgs[0].text = texts[10];
          textFrame = 0;
        }
      }
      if (isItemClose === true && items[i].type === "pot" && isItemBroken === true) {
        sounds[0].play();
        items[i].kick();
        items[i].acter();
        afterActon();
        makeItemWalkable(items[i]);
        break;
      }
  }
}

function checkIfItemClose(item) {
        var left = hero.x;
        var right = hero.x + (hero.width);
        var top = hero.y;
        var bottom = hero.y + (hero.height);
        var itemleft = item.x;
        var itemright = item.x + (item.width);
        var itemtop = item.y;
        var itembottom = item.y + (item.height);
        isItemClose = false;
        if ((top >= itembottom-3 && right < itemright+10 && left > itemleft-10 && bottom < itembottom+25) ||
            (right < itemright+10 && left > itemleft-10 && bottom <= itemtop+3 && top > itemtop-25 ) || 
            (top > itemtop-10 && bottom < itembottom+10 && left >= itemright-3 && right < itemright+25) ||
            (top > itemtop-10 && bottom < itembottom+10 && right <= itemleft+3 && left > itemleft-25)) {
             isItemClose = true;   
        }
    }

function makeItemWalkable(item) {
  for (i = 0; i < nonWalkableArea.length; i += 1) {
      if (nonWalkableArea[i].x === item.x && nonWalkableArea[i].y === item.y) {
        nonWalkableArea.splice(i, 1);
      }
    }
}

var stepOne = true;
var stepTwo = true;
var stepThree = true;
var stepFour = true;
var stepFive = true;

function afterActon() {
  if (npcs[0].acted === 1 && stepOne) {
    stepOne = false;
    items[3].doable = true;
    items[10].acted = 1;
    msgs[0].text = texts[6];
    msgs[1].text = texts[7];
    textFrame = -600;
  }
  if (items[3].acted === 1 && stepTwo) {
    stepTwo = false;
    items[0].doable = true;
    items[10].acted = 2;
  }
  if (items[4].acted === 1 && stepThree) {
    stepThree = false;
    items[2].doable = true;
    items[8].acted = 1;
    msgs[0].text = texts[4];
    textFrame = 0;
  }
  if (items[2].acted === 1 && stepFour) {
    stepFour = false;
    items[6].doable = true;
    items[8].acted = 2;
    items[9].acted = 1;
    msgs[0].text = texts[5];
    textFrame = 0;
  }
  if (items[6].acted === 1 && stepFive) {
    stepFive = false;
    items[9].acted = 2;
  }
}


function startGame() {
    sounds[0] = new Sound("sounds/jarbreak.wav", 1, false);
    sounds[1] = new Sound("sounds/door.wav", 1, false);
    sounds[2] = new Sound("sounds/chestbig.wav", 1, false);
    sounds[3] = new Sound("sounds/switch.wav", 1, false);
    sounds[4] = new Sound("sounds/foot.wav", 1, false);
    sounds[5] = new Sound("sounds/background.mp3", 1, true);
    sounds[5].play();
    then = Date.now();
    gameArea.start();
    hero = new Hero(characterAtlas, 16, 0, 16, 16, 0, 112, 16, 16, 0, "hero", 0);
    npcs[0] = new Hero(characterAtlas, 64, 0, 16, 16, 272, 160, 16, 16, 1, "npc", 0);
    items[0] = new Item(otherAtlas, 0, 0, 16, 16, 64, 304, 16, 16, 1, "door", false, 0);
    items[1] = new Item(otherAtlas, 0, 0, 16, 16, 288, 192, 16, 16, 1, "door", true, 0);
    items[2] = new Item(otherAtlas, 96, 0, 16, 16, 464, 176, 16, 16, 1, "chest", false, 0);
    items[3] = new Item(otherAtlas, 48, 64, 16, 16, 320, 368, 16, 16, 1, "switch", false, 0);
    items[4] = new Item(otherAtlas, 144, 0, 16, 16, 48, 272, 16, 16, 1, "pot", true, 0);
    items[5] = new Item(otherAtlas, 0, 64, 16, 16, 176, 336, 16, 16, 1, "torch", true, 0);
    items[6] = new Item(otherAtlas, 0, 0, 16, 16, 416, 64, 16, 16, 1, "door", false, 0);
    items[7] = new Item(otherAtlas, 0, 64, 16, 16, 48, 336, 16, 16, 1, "torch", true, 0);
    items[8] = new Item(itemAtlas, 96, 0, 32, 32, 16, 16, 24, 24, 0, "item", false, 2);
    items[9] = new Item(itemAtlas, 128, 0, 32, 32, 48, 16, 24, 24, 0, "item", false, 2);
    items[10] = new Item(itemAtlas, 192, 32, 32, 32, 80, 16, 24, 24, 0, "item", false, 2);
    items[11] = new Item(otherAtlas, 0, 64, 16, 16, 256, 256, 16, 16, 1, "torch", true, 0);
    items[12] = new Item(otherAtlas, 0, 64, 16, 16, 304, 256, 16, 16, 1, "torch", true, 0);
    items[13] = new Item(otherAtlas, 0, 64, 16, 16, 176, 272, 16, 16, 1, "torch", true, 0);
    items[14] = new Item(otherAtlas, 144, 0, 16, 16, 240, 368, 16, 16, 1, "pot", true, 0);
    items[15] = new Item(otherAtlas, 144, 0, 16, 16, 240, 432, 16, 16, 1, "pot", true, 0);
    items[16] = new Item(otherAtlas, 96, 0, 16, 16, 240, 64, 16, 16, 1, "chest", true, 0);
    items[17] = new Item(otherAtlas, 96, 0, 16, 16, 464, 224, 16, 16, 1, "chest", false, 0);
    items[18] = new Item(otherAtlas, 48, 64, 16, 16, 336, 160, 16, 16, 1, "switch", true, 0);
    msgs[0] = new Message(texts[0], 130, 15);
    msgs[1] = new Message(texts[0], 130, 35);
    msgs[0].text = texts[11];
    textFrame = -300;
}
