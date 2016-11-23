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
    collisionDetection();
    update(delta/1000);
    renderItems();
    items[5].burn();
    hero.render();
    npcs[0].render();
    renderMsgs();
    then = now;
    requestAnimationFrame(main);
}

function renderItems() {
  for (i = 0; i < items.length; i += 1) {
      items[i].render();
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

function update(modifier) {
    if (gameArea.key && gameArea.key == 37 && crashLeft === false) {
      hero.sourceY = characterTiles[14].y;
      hero.sourceX = spriteTiles.coordinatesLeft[spriteTiles.frameLeft];
      hero.x -= hero.speed * modifier;
      spriteTiles.frameLeft = (spriteTiles.frameLeft + 1) % spriteTiles.coordinatesLeft.length;
    }
    if (gameArea.key && gameArea.key == 39 && crashRight === false) {
      hero.sourceY = characterTiles[24].y;
      hero.sourceX = spriteTiles.coordinatesRight[spriteTiles.frameRight];
      hero.x += hero.speed * modifier;
      spriteTiles.frameRight = (spriteTiles.frameRight + 1) % spriteTiles.coordinatesRight.length;
      
    }
    if (gameArea.key && gameArea.key == 38 && crashTop === false) {
      hero.sourceY = characterTiles[37].y;
      hero.sourceX = spriteTiles.coordinatesTop[spriteTiles.frameTop];
      hero.y -= hero.speed * modifier; 
      spriteTiles.frameTop = (spriteTiles.frameTop + 1) % spriteTiles.coordinatesTop.length;
    }
    if (gameArea.key && gameArea.key == 40 && crashBottom === false) {
      hero.sourceY = characterTiles[0].y;
      hero.sourceX = spriteTiles.coordinatesBottom[spriteTiles.frameBottom];
      hero.y += hero.speed * modifier; 
      spriteTiles.frameBottom = (spriteTiles.frameBottom + 1) % spriteTiles.coordinatesBottom.length;
    } 
    if (gameArea.key && gameArea.key == 79) {
      checkOpenable();
    }
    if (isItemOpen === true) {
      openItem();
    }
    if (gameArea.key && gameArea.key == 83) {
      checkSwitchable();
    }
    if (isItemSwitched === true) {
      switchItem();
    }
    if (gameArea.key && gameArea.key == 75) {
      checkKickable();
    }
    if (isItemBroken === true) {
      kickItem();
    }
    if (gameArea.key && gameArea.key == 84) {
      talkToNpc();
    }
    if (gameArea.key === false) {
      hero.sourceX = 16;
      hero.sourceY = 0;
    }
}

function checkActionAble(item) {
        var left = hero.x;
        var right = hero.x + (hero.width);
        var top = hero.y;
        var bottom = hero.y + (hero.height);
        var itemleft = item.x;
        var itemright = item.x + (item.width);
        var itemtop = item.y;
        var itembottom = item.y + (item.height);
        isItemClose = false;
        if (top >= itembottom-3 && right < itemright+10 && left > itemleft-10 && bottom < itembottom+25) {
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

function talkToNpc() {
  for (i = 0; i < npcs.length; i += 1) {
      checkActionAble(npcs[i]);
      if (isItemClose === true && npcs[i].type === "npc") {
        msgs[0].text = texts[6];
        msgs[1].text = texts[7];
        textFrame = -300;
        break;
      }
      else if (isItemClose === true && npcs[i].type != "npc") {
        msgs[0].text = texts[8];
        textFrame = 0;
      }
    }
}

function checkOpenable() {
  for (i = 0; i < items.length; i += 1) {
      checkActionAble(items[i]);
      if (isItemClose === true && (items[i].type === "door" || items[i].type === "chest")) {
        isItemOpen = true;
        break;
      }
      else if (isItemClose === true && (items[i].type != "door" || items[i].type != "chest")) {
        msgs[0].text = texts[1];
        textFrame = 0;
      }
    }
}

function openItem() {
  for (i = 0; i < items.length; i += 1) {
      checkActionAble(items[i]);
      if (isItemClose === true) {
        items[i].open();
          if (items[i].type === "door") {
            makeItemWalkable(items[i]);
          }
        break;
      }
    }
}

function checkSwitchable() {
  for (i = 0; i < items.length; i += 1) {
      checkActionAble(items[i]);
      if (isItemClose === true && items[i].type === "switch") {
        isItemSwitched = true;
        break;
      }
      else if (isItemClose === true && items[i].type != "switch") {
        msgs[0].text = texts[2];
        textFrame = 0;
      }
    }
}

function switchItem() {
  for (i = 0; i < items.length; i += 1) {
      checkActionAble(items[i]);
      if (isItemClose === true) {
        items[i].switch();
        break;
      }
    }
}

function checkKickable() {
  for (i = 0; i < items.length; i += 1) {
      checkActionAble(items[i]);
      if (isItemClose === true && items[i].type === "pot") {
        isItemBroken = true;
        break;
      }
      else if (isItemClose === true && items[i].type != "pot") {
        msgs[0].text = texts[3];
        textFrame = 0;
      }
    }
}

function kickItem() {
  for (i = 0; i < items.length; i += 1) {
      checkActionAble(items[i]);
      if (isItemClose === true) {
        items[i].kick();
          if (items[i].type === "pot") {
            makeItemWalkable(items[i]);
          }
        break;
      }
    }
}

function startGame() {
    then = Date.now();
    gameArea.start();
    hero = new Hero(characterAtlas, 16, 0, 16, 16, 0, 112, 16, 16, 0, "hero");
    npcs[0] = new Hero(characterAtlas, 64, 0, 16, 16, 272, 160, 16, 16, 1, "npc");
    items[0] = new Item(otherAtlas, 0, 0, 16, 16, 64, 304, 16, 16, 1, "door");
    items[1] = new Item(otherAtlas, 0, 0, 16, 16, 288, 192, 16, 16, 1, "door");
    items[2] = new Item(otherAtlas, 96, 0, 16, 16, 48, 272, 16, 16, 1, "chest");
    items[3] = new Item(otherAtlas, 48, 64, 16, 16, 320, 368, 16, 16, 1, "switch");
    items[4] = new Item(otherAtlas, 144, 0, 16, 16, 464, 176, 16, 16, 1, "pot");
    items[5] = new Item(otherAtlas, 0, 64, 16, 16, 176, 336, 16, 16, 1, "torch");
    items[6] = new Item(otherAtlas, 0, 0, 16, 16, 416, 64, 16, 16, 1, "door");
    msgs[0] = new Message(texts[0], 300, 20);
    msgs[1] = new Message(texts[0], 300, 35);
}
