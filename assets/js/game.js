var canvasWidth = 800;
var canvasHeight = 600;
var direction = '';
var velocity = 3;
var sharkSpeed = 2;
var sharks = [];
var fishes = [];
var isDied = false;
var enemyFreq = 0;
var howFish = 0;
var isStarted = false;
var isSandbox = false;
var isVelocity = false;
var velocityText = '';
var layer = new Konva.Layer();
var playerImg = new Image();
var sandBoxText = '';
var record = 0;
playerImg.src = './assets/img/player.png';
var sharkImg = new Image();
sharkImg.src = './assets/img/shark.png';
var fishImg = new Image();
fishImg.src = './assets/img/fish.png';
var stage = new Konva.Stage({
    container: 'game',
    width: canvasWidth,
    height: canvasHeight
});
var player = new Konva.Image({
    x: 0,
    y: canvasHeight / 2,
    image: playerImg,
    width: 177,
    height: 76
});
var stats = new Konva.Text({
    x: 15,
    y: 15,
    text: '',
    fontSize: 18,
    fill: 'white'
});
var gameLoop = new Konva.Animation(function (frame) {
    if (!isDied && isStarted) {
        handleInput();
        randomEnemies();
        moveEnemies();
        checkCollisions();
        if (isSandbox) {
            sandBoxText = ' Sandbox';
        } else {
            sandBoxText = '';
        }
        if (isVelocity) {
            velocityText = ' Speedup';
        } else {
            velocityText = '';
        }
        stats.setAttr('text', 'Рыбок: ' + howFish + velocityText + sandBoxText);
    }
}, layer);
stage.visible(false);

function startGame() {
    document.getElementById("buttonSFX").play();
    isStarted = true;
    isDied = false;
    $('#startScreen').hide();
    $('#deathScreen').hide();
    $('#game').fadeIn();
    stage.visible(true);
    layer.add(player);
    layer.add(stats);
    stage.add(layer);
    gameLoop.start();
    document.getElementById("backgroundSFX").volume = 0.5;
}

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

function handleInput() {

    if (input.isDown('DOWN') || input.isDown('s')) {
        if (player.attrs.y + velocity < canvasHeight - 93) {
            player.setY(player.attrs.y + velocity);
            direction = 'down';
        }
    }
    if (input.isDown('T') || input.isDown('t')) {

        switch (isSandbox) {
            case true:
                isSandbox = false;
                break;
            default:
                isSandbox = true;
        }
    }
    if (input.isDown('P') || input.isDown('p')) {
        switch (isVelocity) {
            case true:
                velocity -= 10;
                isVelocity = false;
                break;
            default:
                velocity += 10;
                isVelocity = true;
        }
    }
    if(input.isDown('F') || input.isDown('f')){
        makeEnemy('fish', player.attrs.x+25, player.attrs.y);
    }
    if (input.isDown('UP') || input.isDown('w')) {
        if (player.attrs.y - velocity > 0) {
            player.setY(player.attrs.y - velocity);
        }
    }

    if (input.isDown('LEFT') || input.isDown('a')) {
        if (player.attrs.x - velocity > 0) {
            player.setX(player.attrs.x - velocity);
        }
    }

    if (input.isDown('RIGHT') || input.isDown('d')) {
        if (player.attrs.x + velocity < canvasWidth - 221) {
            player.setX(player.attrs.x + velocity);
        }
    }
}

function makeEnemy(type, x, y) {

    if (type == 'shark') {
        shark = new Konva.Image({
            x: x,
            y: y,
            image: sharkImg,
            width: 352,
            height: 142
        });
        shark.action = '';
        sharks.push(shark);
        layer.add(shark);
        stage.add(layer);
    }
    if (type == 'fish') {
        fish = new Konva.Image({
            x: x,
            y: y,
            image: fishImg,
            width: 100,
            height: 52
        });
        fish.action = '';
        fishes.push(fish);
        layer.add(fish);
        stage.add(layer);
    }
}

function moveEnemies() {
    sharks.forEach(function (shark) {
        shark.setX(shark.attrs.x - sharkSpeed);
        shark.action = 'go';
    });
    fishes.forEach(function (fish) {
        fish.setX(fish.attrs.x - sharkSpeed);
        fish.action = 'go';
    });
}

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
        b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
        pos[0] + size[0], pos[1] + size[1],
        pos2[0], pos2[1],
        pos2[0] + size2[0], pos2[1] + size2[1]);
}

function checkCollisions() {
    var i;
    var pos = [];
    pos[0] = player.attrs.x;
    pos[1] = player.attrs.y
    if (!isSandbox) {
        for (i = 0; i < sharks.length; i++) {
            var size = [],
                enemyPos = [],
                enemySize = [];

            size[0] = 150;
            size[1] = 60;

            enemyPos[0] = sharks[i].attrs.x;
            enemyPos[1] = sharks[i].attrs.y;

            enemySize[0] = 200;
            enemySize[1] = 100;
            if (boxCollides(enemyPos, enemySize, pos, size)) {
                document.getElementById("collisionSFX").play();
                isDied = true;
                onDie();
            }

        }
    }

    for (i = 0; i < fishes.length; i++) {
        var size = [],
            enemyPos = [],
            enemySize = [];

        size[0] = 150;
        size[1] = 60;

        enemyPos[0] = fishes[i].attrs.x;
        enemyPos[1] = fishes[i].attrs.y;

        enemySize[0] = 200;
        enemySize[1] = 103;
        if (boxCollides(enemyPos, enemySize, pos, size)) {
            document.getElementById("fishSFX").play();
            fishes[i].setX(-10000);
            fishes.splice(i, 1);
            if(howFish+1==5){
                velocity++;
                sharkSpeed++;
            }
            if(howFish+1==10){
                velocity++;
                sharkSpeed++;
            }
            if(howFish+1==15){
                velocity++;
                sharkSpeed++;
            }
            if(howFish+1==20){
                velocity++;
                sharkSpeed++;
            }
            if(howFish+1==25){
                velocity++;
                sharkSpeed++;
            }
            if(howFish+1==30){
                velocity++;
                sharkSpeed++;
            }
            if(howFish+1==35){
                velocity++;
                sharkSpeed++;
            }
            if(howFish+1==40){
                velocity++;
                sharkSpeed++;
            }
            if(howFish+1==45){
                velocity++;
                sharkSpeed++;
            }
            if(howFish+1==50){
                velocity++;
                sharkSpeed++;
            }
            if(howFish+1==55){
                velocity++;
                sharkSpeed++;
            }
            if(howFish+1==60){
                velocity++;
                sharkSpeed++;
            }
            if(howFish+1==65){
                velocity++;
                sharkSpeed++;
            }
            if(howFish+1==70){
                velocity++;
                sharkSpeed++;
            }
            if(howFish+1==75){
                velocity++;
                sharkSpeed++;
            }
            howFish++;
        }

    }
}

function randomEnemies() {
    for (i = 0; i < 5; i++) {
        enemyFreq++;
        if (enemyFreq > 350) {
            makeEnemy('fish', Math.floor((Math.random() * 200) + canvasWidth), Math.floor((Math.random() * 200) - player.attrs.y + 2));
            makeEnemy('shark', Math.floor((Math.random() * 200) + canvasWidth), Math.floor((Math.random() * 300) + player.attrs.y - 5));
            makeEnemy('fish', Math.floor((Math.random() * 200) + canvasWidth), Math.floor((Math.random() * 200) + player.attrs.y - 2));
            makeEnemy('shark', Math.floor((Math.random() * 200) + canvasWidth), Math.floor((Math.random() * 300) - player.attrs.y + 5));
            console.log(enemyFreq);
            enemyFreq -= 350;
        }
    }
}

function onDie() {
    document.getElementById("backgroundSFX").volume = 0.2;
    isDied = true;
    if (record < howFish)
        record = howFish;
    gameLoop.stop();
    $("#game").hide();
    $('#deathScreen').html('<span id="startScreenNavs"><p id="replaybutton" onclick="restartGame()">Переиграть!</p></span>');
    $("#deathScreen").append('<p id="rules">Ваш счет: ' + howFish + '</p>');
    $("#deathScreen").append('<p id="rules">Ваш рекорд: ' + record + '</p>');
    $("#deathScreen").fadeIn();
}

function restartGame() {
    $("#game").html('');
    canvasWidth = 800;
    canvasHeight = 600;
    direction = '';
    velocity = 3;
    sharkSpeed = 2;
    sharks = []; 
    fishes = [];
    isDied = false;
    enemyFreq = 0;
    howFish = 0;
    isStarted = false;
    isVelocity = false;
    isSandbox = false;
    velocityText = '';
    sandBoxText = '';
    layer = new Konva.Layer();
    stage = new Konva.Stage({
        container: 'game',
        width: canvasWidth,
        height: canvasHeight
    });
    player = new Konva.Image({
        x: 0,
        y: canvasHeight / 2,
        image: playerImg,
        width: 177,
        height: 76
    });
    stats = new Konva.Text({
        x: 15,
        y: 15,
        text: '',
        fontSize: 18,
        fill: 'white'
    });
    gameLoop = new Konva.Animation(function (frame) {
        if (!isDied && isStarted) {
            handleInput();
            randomEnemies();
            moveEnemies();
            checkCollisions();
            if (isSandbox) {
                sandBoxText = ' Sandbox';
            } else {
                sandBoxText = '';
            }
            if (isVelocity) {
                velocityText = ' Speedup';
            } else {
                velocityText = '';
            }
            stats.setAttr('text', 'Рыбок: ' + howFish + velocityText + sandBoxText);
        }
    }, layer);
    stage.visible(false);
    startGame();
}
//$("html").html('');