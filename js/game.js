var gameIsRunning = false, timeIsRunning = false;
var heroNoHit = false, heroMove = true, heroStartLife = 3, heroLife = heroStartLife, heroStartScore = 1000, heroScore = heroStartScore; // Hero status
var alienTweenPause = false; //Enemies
var levelText, lifeText, scoreText, timeText; // Show in stageInfo
var stageMain, stageInfo; // Stages
var preloadText, titelText, deadText; // Text
var ufo, ufoSmall, soundButton, buttonStartGame, buttonHowToPlay, restartButton, buttonBack, stickMan, stickManRun, sandDropRun, lifeIcon, scoreIcon, timerBar1, timerBar2, lightningImg, freezeTimeImg; //Bitmaps
var hero, heroSpriteSheet; //Hero player
var queue; // Start
var soundMute = false; // Sounds
var moveSmallUfo = false;
var autoStart = true;
var teleporters=[];
var enemies=[];
var powerUps=[];
nextLevel=[];
var scoreTotal = 0;
var levelData, tiles, alienSprite, currentLevel=-1, t, blockSize = 50; //level
var hitTestNextLevel = true;
var enemies=[];
var keys = {
    rkd:false,
    lkd:false,
    ukd:false,
    dkd:false
};

var countDownTime = false, startTime = null, timeLeft = startTime;
var timerImg1, timerImg2;

function init() {
    stageMain = new createjs.Stage("canvasMain");
    stageInfo = new createjs.Stage("canvasInfo");

    document.getElementsByTagName("body")[0].style.cursor = "url('img/cursor.png'), auto";

    ufo = new createjs.Bitmap("img/ufo.png");
    ufo.width = 200;
    ufo.height = 200;
    ufo.x = 0;
    ufo.y = 150;

    stickMan = new createjs.Bitmap('img/stickMan.png');
    stickMan.width = 80;
    stickMan.height = 100;
    stickMan.x = 600;
    stickMan.y = 190;

    preloadText = new createjs.Text("", "50px Raleway", "#000");
    preloadText.textBaseline="middle";
    preloadText.textAlign="center";
    preloadText.x=stageMain.canvas.width/2;
    preloadText.y=stageMain.canvas.height/1.7;

    stageMain.addChild(preloadText, ufo, stickMan);

    preload()
}

function preload(){
    queue = new createjs.LoadQueue(autoStart);
    queue.installPlugin(createjs.Sound);
    queue.on("progress", queueProgress);
    queue.on("complete", queueComplete);
    queue.loadManifest([
        {id: "heroSprite", src:"json/heroSprite.json"},
        {id: "alienSprite", src:"json/alienSprite.json"},
        {id:"bgSound", src:"audio/music/bgMusic.mp3"},
        {id:"clickSpaceGun", src:"audio/sounds/spaceGun.mp3"},
        {id:"deadSound", src:"audio/sounds/dead.mp3"},
        {id:"freezeTimeSound", src:"audio/sounds/freeze.mp3"},
        {id:"turnBackTimeSound", src:"audio/sounds/turn.mp3"},
        {id:"lifeSound", src:"audio/sounds/life.mp3"},
        {id:"phaseSound", src:"audio/sounds/phase.mp3"},
        {id:"pointSound", src:"audio/sounds/point.mp3"},
        {id:"winSound", src:"audio/sounds/win.mp3"},
        {id: "muteSprite", src:"json/muteSprite.json"},
        {id: "runSprite", src:"json/stickManRun.json"},
        {id: "sandDropSprite", src:"json/sandDropSprite.json"},
        "img/resetWarning.png",
        "img/sandDropSprite.png",
        "img/gameOverBg.png",
        "img/WinBg.png",
        "img/heart.png",
        "img/star.png",
        "img/timer1.png",
        "img/timer2.png",
        "img/buttonStartGame.png",
        "img/buttonHowToPlay.png",
        "img/buttonBack.png",
        "img/buttonPlayAgain.png",
        "img/buttonBackToMain.png",
        "img/buttonRestart.png",
        "img/buttonYes.png",
        "img/buttonNo.png",
        "img/heroSprite.png",
        "img/alienSprite.png",
        "img/rules.png",
        "img/rules.png",
        "img/alienSkull.png",
        "img/lightning.png",
        "img/freezeTime.png",
        {id:"levelJson",src:"json/levels.json"},
        {id:"tiles",src:"json/tiles.json"},

        "img/ufoSmall.png"
    ]);
}

function queueProgress(e){
    preloadText.text="Loading... " + Math.round(e.progress*100) + "%";
    ufo.x =+(e.progress*850);
    stickMan.x =700+(e.progress*350);
    stageMain.update(e);
}

function queueComplete(){
    createjs.Ticker.on("tick", tock);
    createjs.Ticker.setFPS(30);
    stageMain.removeChild(stickMan, preloadText, ufo);
    levelData = queue.getResult("levelJson")
    tiles = new createjs.SpriteSheet(queue.getResult("tiles"));
    alienSprite = new createjs.SpriteSheet(queue.getResult("alienSprite"));
    startPage();
}

function startPage(){

    stageMain.removeChild();
    titelText = new createjs.Text("Space Escape", "50px Raleway", "#000");
    titelText.textBaseline="middle";
    titelText.textAlign="center";
    titelText.x=stageMain.canvas.width/2;
    titelText.y=140;

    stickManRun = new createjs.SpriteSheet(queue.getResult('runSprite'));
    stickManRun = new createjs.Sprite(stickManRun, 'run');
    stickManRun.x = -100;
    stickManRun.y = 550;

    buttonStartGame = new createjs.Bitmap(queue.getResult('img/buttonStartGame.png'));
    buttonStartGame.width = 250;
    buttonStartGame.x = (stageMain.canvas.width/2)-(buttonStartGame.width)/2;
    buttonStartGame.y = 280;
    buttonStartGame.addEventListener('click',
        function(e){
            createjs.Sound.play('clickSpaceGun');
            getReady();
            moveSmallUfo = false;
            removeBgUfo();
            stageMain.removeChild(buttonStartGame, buttonHowToPlay, titelText);
        }
    );

    buttonHowToPlay = new createjs.Bitmap(queue.getResult('img/buttonHowToPlay.png'));
    buttonHowToPlay.width = 250;
    buttonHowToPlay.x = (stageMain.canvas.width/2)-(buttonHowToPlay.width)/2;
    buttonHowToPlay.y = 400;
    buttonHowToPlay.addEventListener('click',
        function(e){
            createjs.Sound.play('clickSpaceGun');
            aboutGame();
        }
    );

    //createjs.Sound.play('bgSound', {loop:-1}); LYD
    addBgUfo();
    stageMain.addChild(buttonStartGame, buttonHowToPlay, titelText, stickManRun);
    moveSmallUfo = true;

    soundButton = new createjs.SpriteSheet(queue.getResult('muteSprite'));
    soundButton = new createjs.Sprite(soundButton, 'muteOff');
    soundButton.x = 50;
    soundButton.y = 30;
    soundButton.addEventListener('click',
        function(e){
            soundOnOff();
        }
    );

    restartButton = new createjs.Bitmap(queue.getResult('img/buttonRestart.png'));
    restartButton.width = 50;
    restartButton.x = 150;
    restartButton.y = 30;
    restartButton.addEventListener('click',
        function(e){
            createjs.Sound.play('deadSound');
            resetGameWarning();
        }
    );

    lifeIcon = new createjs.Bitmap(queue.getResult("img/heart.png"));
    lifeIcon.x = 50;
    lifeIcon.y = 200;

    scoreIcon = new createjs.Bitmap(queue.getResult("img/star.png"));
    scoreIcon.x = 50;
    scoreIcon.y = 300;

    levelText = new createjs.Text("", "40px Raleway", "#000");
    levelText.text = "Level " + currentLevel;
    levelText.textAlign="right";
    levelText.x = 200;
    levelText.y = 110;

    lifeText = new createjs.Text("", "40px Raleway", "#000");
    lifeText.textAlign="right";
    lifeText.x = 200;
    lifeText.y = 200;

    scoreText = new createjs.Text("4000", "40px Raleway", "#000");
    scoreText.textAlign="right";
    scoreText.x = 200;
    scoreText.y = 300;

    timeText = new createjs.Text("Time left", "36px Raleway", "#000");
    timeText.textAlign="right";
    timeText.x = 200;
    timeText.y = 400;

    timerImg1 = new createjs.Bitmap(queue.getResult('img/timer1.png'));
    timerImg1.x = 50;
    timerImg1.y = 480;

    timerImg2 = new createjs.Bitmap(queue.getResult('img/timer2.png'));
    timerImg2.alpha = 1;
    timerImg2.x = 50;
    timerImg2.y = 480;

    sandDropRun = new createjs.SpriteSheet(queue.getResult('sandDropSprite'));
    sandDropRun = new createjs.Sprite(sandDropRun, 'run');
    sandDropRun.x = 110;
    sandDropRun.y = 600;

    timerBar1 = new createjs.Shape();
    timerBar1.graphics.beginFill("#c5910e");
    timerBar1.graphics.drawRect(0, 0, 150, 80);
    timerBar1.x = 50;
    timerBar1.y = 500;
    timerBar1.scaleY=0;

    timerBar2 = new createjs.Shape();
    timerBar2.graphics.beginFill("#c5910e");
    timerBar2.graphics.drawRect(0, 0, 150, 80);
    timerBar2.x = 50;
    timerBar2.y = 605;

    lightningImg = new createjs.Bitmap(queue.getResult("img/lightning.png"));
    lightningImg.alpha= .7;
    lightningImg.x = 1060;
    lightningImg.y = 20;

    freezeTimeImg = new createjs.Bitmap(queue.getResult("img/freezeTime.png"));
    freezeTimeImg.alpha= .7;
    freezeTimeImg.x = 1060;
    freezeTimeImg.y = 20;
    
    stageInfo.addChild(soundButton);
}

function getReady() {
    var counter = 4;
    var cT = new createjs.Text(counter, "1500px Raleway", "#000");
    cT.textBaseline="middle";
    cT.textAlign="center";
    cT.x=stageMain.canvas.width/2;
    cT.y=stageMain.canvas.height/2;

    stageMain.addChild(cT);

    animate();
    function animate() {
        cT.scaleX = cT.scaleY = 0;
        counter--;
        cT.text = counter;
        createjs.Tween.get(cT).to({scaleX: 2, scaleY: 2}, 1000).call(function () {
            if (counter === 1) {

                startGame();
                stageMain.removeChild(cT);
            } else {
                animate();
            }
        })
    }
}

function updateStatusBar() {

    var scale=timeLeft/startTime;
    timerBar2.scaleY=scale;
    timerBar1.scaleY=1-scale;
    var currentLevelStatusBar = currentLevel +1;
    levelText.text = "Level  " + currentLevelStatusBar;
    lifeText.text = heroLife;
    scoreText.text = heroScore;
}

function addBgUfo() {
    ufoSmall = new createjs.Bitmap("img/ufoSmall.png");
    ufoSmall.width = 100;
    ufoSmall.height = 100;
    ufoSmall.x = -200;
    ufoSmall.y = Math.floor(Math.random() * 600);
    stageMain.addChild(ufoSmall);
    moveUfo();
}

function removeBgUfo() {
    setTimeout(function () {
        createjs.Tween.get(ufoSmall).to(
            {
                y:Math.floor(Math.random() * -600), x:-200
            },
            4000,
            createjs.Ease.cubicInOut
        ).call(
            function(){
                stageMain.removeChild(ufoSmall);
            }
        )
    }, 6000);
}

function moveUfo(){
    createjs.Tween.get(ufoSmall).to(
        {
            x:Math.floor(Math.random() * 1000), y:Math.floor(Math.random() * 650)

        },
        6000,
        createjs.Ease.cubicInOut
    ).call(
        function(){
            if(moveSmallUfo===true) {
                setTimeout(function () {
                    moveUfo();
                }, 2000);
            }
        }
    )
}

function aboutGame() {
    stageMain.removeChild(buttonStartGame, buttonHowToPlay, titelText);

    buttonBack = new createjs.Bitmap(queue.getResult('img/buttonBack.png'));
    buttonBack.width = 250;
    buttonBack.x = (stageMain.canvas.width/2)-(buttonStartGame.width)/2;
    buttonBack.y = 600;
    buttonBack.addEventListener('click',
        function(e){
            createjs.Sound.play('clickSpaceGun');
            stageMain.removeChild(buttonBack, rulesGraphics);
            stageMain.addChild(buttonStartGame, buttonHowToPlay, titelText);

        }
    );

    var rulesGraphics = new createjs.Bitmap(queue.getResult("img/rules.png"));
    rulesGraphics.x = 50;
    rulesGraphics.y = 50;

    stageMain.addChild(buttonBack, rulesGraphics);
}

function startGame() {
    gameIsRunning = true;
    timeIsRunning = true;
    addHero();
    setupLevel();
        window.addEventListener('keydown', fingerDown);
        window.addEventListener('keyup', fingerUp);

    countDownTime = true;
    runTimerCountDown();

    stageInfo.addChild(restartButton, levelText, lifeText, scoreText, timeText, lifeIcon, scoreIcon, timerImg1, timerBar1, timerBar2, timerImg2, sandDropRun);

}

function runTimerCountDown () {
    if (countDownTime === true && timeLeft > -1) {
        timerCountDown();
    }
}

function timerCountDown(){
    if (timeIsRunning === true) {
        timeLeft -= .5;
        heroScore -= 1;
        setTimeout(function () {
            runTimerCountDown();
        }, 500);
    }
}

function callSetupLevel() {
    timeIsRunning = false;
    if (gameIsRunning === true) {
        setTimeout(function () {
            heroMove = false;
        }, 200);
        var message = "Level up";
        var messageOnScreen = new createjs.Text(message, "70px Raleway", "#000");
        messageOnScreen.textBaseline = "middle";
        messageOnScreen.textAlign = "center";
        messageOnScreen.x = stageMain.canvas.width / 2;
        messageOnScreen.y = stageMain.canvas.height / 2;
        stageMain.addChild(messageOnScreen);
        animate();
        function animate() {
            messageOnScreen.scaleX = messageOnScreen.scaleY = 0;
            createjs.Tween.get(messageOnScreen).to({scaleX: 2, scaleY: 2}, 1500).call(function () {
                stageMain.removeChild(messageOnScreen);
            })
        }
        setTimeout(function () {
            hero.gotoAndPlay('jump');
            setupLevel();
        }, 2000);
    }
}

function setupLevel() {
    hitTestNextLevel = true;
    timeIsRunning = true;
    heroMove = true;
    runTimerCountDown();
    currentLevel++;
    stageMain.removeAllChildren();
    hero.gotoAndPlay('jump');
    setTimeout(function () {
        hero.gotoAndPlay('still');
    }, 2000);
    startTime = levelData.levels[currentLevel].levelSpeed;
    timeLeft = startTime;
    var row, col;

    var level = levelData.levels[currentLevel].tiles;
    blocks = [];
    teleporters = [];
    powerUps = [];
    enemies = [];
    nextLevel = [];
    var hCol, hRow;
    for (row = 0; row < level.length; row++) {
        for (col = 0; col < level[row].length; col++) {
            var img;
            switch (level[row][col]) {
                case 0:
                    img = "floor";
                    break;
                case 1:
                    img = "block";
                    break;
                case 2:
                    img = "tp";
                    break;
                case 3:
                    img = "wp";
                    break;
                case 4:
                    img = "sg";
                    break;
                case 5:
                    img = "eg";
                    break;
                case "H":
                    img = "floor";
                    hCol = col;
                    hRow = row;
                    break;
            }
            t = new createjs.Sprite(tiles, img);
            t.x = col * blockSize;
            t.y = row * blockSize;
            t.width = blockSize;
            t.height = blockSize;
            t.type = level[row][col];
            if (t.type === 1) {
                blocks.push(t);
            } else {

            }
            stageMain.addChild(t);

        }
    }
    
        var tps = levelData.levels[currentLevel].teleporters;
        for (var i = 0; i < tps.length; i++) {
            t = new createjs.Sprite(tiles, 'tp');
            t.x = tps[i].x;
            t.y = tps[i].y;
            t.width = blockSize;
            t.height = blockSize;
            t.waypointX = tps[i].waypointX;
            t.waypointY = tps[i].waypointY;
            
            teleporters.push(t);
            stageMain.addChild(t);
        }
    var nxl = levelData.levels[currentLevel].nextLevel;
    for (var i = 0; i < nxl.length; i++) {
        t = new createjs.Sprite(tiles, 'eg');
        t.x = nxl[i].x;
        t.y = nxl[i].y;
        t.width = blockSize;
        t.height = blockSize;

        nextLevel.push(t);
        stageMain.addChild(t);
    }
        var pus = levelData.levels[currentLevel].powerUps;
        for (var i = 0; i < pus.length; i++) {
            t = new createjs.Sprite(tiles, pus[i].sprite);
            t.x = pus[i].x;
            t.y = pus[i].y;
            t.width = blockSize;
            t.height = blockSize;
            t.type=pus[i].type;
            
            powerUps.push(t);
            stageMain.addChild(t);
        }
        hero.x = hCol * blockSize;
        hero.y = hRow * blockSize;


    var enm = levelData.levels[currentLevel].enemies;
    for (var i = 0; i < enm.length; i++) {
        var t = new createjs.Sprite(alienSprite, 'up');
        t.width = blockSize;
        t.height = blockSize;
        t.speed = 6;
        t.startX = enm[i].startX;
        t.startY = enm[i].startY;
        t.endX = enm[i].endX;
        t.endY = enm[i].endY;
        t.x = t.startX;
        t.y = t.startY;
        enemies.push(t);
        stageMain.addChild(t);
            createjs.Tween.get(t, {paused:alienTweenPause, loop:true})
                .to({x: t.endX, y: t.endY}, enm[i].speed, createjs.Ease.sineInOut)
                .to({x: t.startX, y: t.startY}, enm[i].speed, createjs.Ease.sineInOut)
    }
    stageMain.addChild(hero, ufoSmall);
    
}

function gameComplete() {
    gameIsRunning = false;
    timeIsRunning = false;
    heroMove = false;
    sandDropRun.gotoAndStop('stop');

    var gameCompleteCon = new createjs.Bitmap(queue.getResult("img/WinBg.png"));
    gameCompleteCon.width = 850;
    gameCompleteCon.height = 550;
    gameCompleteCon.x = (stageMain.canvas.width / 2) - (gameCompleteCon.width / 2);
    gameCompleteCon.y = (stageMain.canvas.height / 2) - (gameCompleteCon.height / 2);

    var buttonRestart = new createjs.Bitmap(queue.getResult("img/buttonBackToMain.png"));
    buttonRestart.width = 250;
    buttonRestart.x = 650;
    buttonRestart.y = 500;
    buttonRestart.addEventListener('click',
        function(e){
            location.reload();
        }
    );

    stageMain.addChild(gameCompleteCon, buttonRestart);
}

function resetGameWarning(){
    timeIsRunning = false;
    heroMove = false;
    sandDropRun.gotoAndStop('stop');

    var restartWarningCon = new createjs.Bitmap(queue.getResult("img/resetWarning.png"));
    restartWarningCon.width = 654;
    restartWarningCon.height = 382;
    restartWarningCon.x = (stageMain.canvas.width / 2) - (restartWarningCon.width / 2);
    restartWarningCon.y = (stageMain.canvas.height / 2) - (restartWarningCon.height / 2);

    var buttonYes = new createjs.Bitmap(queue.getResult("img/buttonYes.png"));
    buttonYes.width = 250;
    buttonYes.x = (stageMain.canvas.width / 2) - (buttonYes.width / 2);
    buttonYes.y = 380;
    buttonYes.addEventListener('click',
        function(e){
            resetGame();
        }
    );

    var buttonNo = new createjs.Bitmap(queue.getResult("img/buttonNo.png"));
    buttonNo.width = 250;
    buttonNo.x = (stageMain.canvas.width / 2) - (buttonNo.width / 2);
    buttonNo.y = 460;
    buttonNo.addEventListener('click',
        function(e){
            stageMain.removeChild(restartWarningCon, buttonYes, buttonNo);
            timeIsRunning = true;
            heroMove = true;
            sandDropRun.gotoAndPlay('run');
            runTimerCountDown();
        }
    );

    stageMain.addChild(restartWarningCon, buttonYes, buttonNo);
}

function resetGame(){
    stageInfo.removeAllChildren();
    stageMain.removeAllChildren();
    timeLeft = startTime;
    heroLife = heroStartLife;
    heroScore = heroStartScore;
    currentLevel=-1;
    getReady();
    sandDropRun.gotoAndPlay('run');
    stageInfo.addChild(soundButton);
}

function gameOver() {
        gameIsRunning = false;

        createjs.Sound.play('deadSound');

        var gameOverBg = new createjs.Bitmap(queue.getResult("img/gameOverBg.png"));
        gameOverBg.width = 850;
        gameOverBg.height = 550;
        gameOverBg.x = (stageMain.canvas.width / 2) - (gameOverBg.width / 2);
        gameOverBg.y = (stageMain.canvas.height / 2) - (gameOverBg.height / 2);


        var splash = new createjs.Bitmap(queue.getResult('img/alienSkull.png'));
        splash.x = stageMain.canvas.width / 2;
        splash.y = 140;
        splash.x = 450;

        deadText = new createjs.Text("", "50px Raleway", "#000");
        deadText.text = "You have died!";
        deadText.textBaseline = "middle";
        deadText.textAlign = "center";
        deadText.x = stageMain.canvas.width / 2;
        deadText.y = 450;

        var buttonPlayAgain = new createjs.Bitmap(queue.getResult("img/buttonPlayAgain.png"));
        buttonPlayAgain.width = 250;
        buttonPlayAgain.x = (stageMain.canvas.width / 2) - (buttonPlayAgain.width / 2);
        buttonPlayAgain.y = 500;
        buttonPlayAgain.addEventListener('click',
            function(e){
                resetGame();
            }
        );

        var buttonBackToMain = new createjs.Bitmap(queue.getResult("img/buttonBackToMain.png"));
        buttonBackToMain.width = 250;
        buttonBackToMain.x = (stageMain.canvas.width / 2) - (buttonBackToMain.width / 2);
        buttonBackToMain.y = 575;
        buttonBackToMain.addEventListener('click',
            function(e){
                location.reload();
            }
        );

        stageMain.addChild(gameOverBg, splash, deadText, buttonPlayAgain, buttonBackToMain);
        stageInfo.removeChild(sandDropRun);

    }

function soundOnOff() {
        if (soundMute === false) {
            soundMute = true;
            createjs.Sound.stop();
            soundButton.gotoAndStop('muteOn');
        } else {
            soundMute = false;
            createjs.Sound.play('bgSound', {loop: -1});
            soundButton.gotoAndStop('muteOff');
        }
    }

function fingerUp(e){
    if(e.keyCode===37){
        keys.lkd=false;
        hero.gotoAndStop('still');
        hero.currentAnimation = "undefined";
    }
    if(e.keyCode===38){
        keys.ukd=false;
        hero.gotoAndStop('still');
        hero.currentAnimation = "undefined";
    }
    if(e.keyCode===39){
        keys.rkd=false;
        hero.gotoAndStop('still');
        hero.currentAnimation = "undefined";
    }
    if(e.keyCode===40){
        keys.dkd=false;
        hero.gotoAndStop('still');
        hero.currentAnimation = "undefined";
    }
    if(e.keyCode===32){
    }
}

function fingerDown(e) {
        if (gameIsRunning === true) {
            if (e.keyCode === 37) {
                keys.lkd = true;
                if (hero.currentAnimation != 'left') {
                    hero.gotoAndPlay('left');
                }
            }
            if (e.keyCode === 38) {
                keys.ukd = true;
                if (hero.currentAnimation != 'up') {
                    hero.gotoAndPlay('up');
                }
            }
            if (e.keyCode === 39) {
                keys.rkd = true;
                if (hero.currentAnimation != 'right') {
                    hero.gotoAndPlay('right');
                }
            }
            if (e.keyCode === 40) {
                keys.dkd = true;
                if (hero.currentAnimation != 'down') {
                    hero.gotoAndPlay('down');
                }
            }
            if(e.keyCode===32){
                hero.gotoAndPlay('jump');
                setTimeout(function () {
                    hero.gotoAndPlay('still');
                }, 2000);
            }
        }
    }

function hitTest(rect1, rect2) {
        if (rect1.x >= rect2.x + rect2.width
            || rect1.x + rect1.width <= rect2.x
            || rect1.y >= rect2.y + rect2.height
            || rect1.y + rect1.height <= rect2.y) {
            return false;
        }
        return true;
    }

function addHero() {

        heroSpriteSheet = new createjs.SpriteSheet(queue.getResult('heroSprite'));
        hero = new createjs.Sprite(heroSpriteSheet, 'still');
        hero.width = 44;
        hero.height = 44;
        hero.regX = 3;
        hero.regY = 3;
        hero.speed = 7;
        hero.nextX;
        hero.nextY;
    }

function moveHero() {
        if (gameIsRunning === true && heroMove === true) {

            var i = 0, powerUpLength = powerUps.length;
            for (; i < powerUpLength; i++) {
                if (hitTest(hero, powerUps[i])) {
                    stageMain.removeChild(powerUps[i]);
                    switch(powerUps[i].type){
                        case "life":
                            createjs.Sound.play('lifeSound');
                            addLife();
                            break;
                        case "freezeTime":
                            createjs.Sound.play('freezeTimeSound');
                            freezeTime();
                            break;
                        case "turnBackTime":
                            createjs.Sound.play('turnBackTimeSound');
                            turnBackTime();
                            break;
                        case "phase":
                            createjs.Sound.play('phaseSound');
                            phase();
                            break;
                        case "point":
                            createjs.Sound.play('pointSound');
                            addHeroPoint();
                            break;
                        case "winGame":
                            createjs.Sound.play('winSound');
                            gameComplete();
                            break;
                    }
                    powerUps.splice(i, 1);
                    break;

                }
            }

            if (heroNoHit === false) {
                var i = 0, enmLength = enemies.length;
                for (; i < enmLength; i++) {
                    if (hitTest(hero, enemies[i])) {
                        heroLoseLife();
                        break;
                    }
                }
            }
                    var i = 0, tpLength = teleporters.length;
                    for (; i < tpLength; i++) {
                        if (hitTest(hero, teleporters[i])) {
                            hero.x = teleporters[i].waypointX;
                            hero.y = teleporters[i].waypointY;
                            break;
                        }
                    }
            var i = 0, nxlLength = nextLevel.length;
            for (; i < nxlLength; i++) {
                if (hitTest(hero, nextLevel[i])) {
                    if (hitTestNextLevel === true) {
                        hitTestNextLevel = false;
                        timeIsRunning = false;
                        callSetupLevel();
                    }
                    break;
                }
            }

                    if (keys.rkd && hero.x < 1150 - hero.width) {
                        var collisionDetected = false;
                        hero.nextY = hero.y;
                        hero.nextX = hero.x + hero.speed;
                        for (i = 0; i < blocks.length; i++) {
                            if (predictHit(hero, blocks[i])) {
                                collisionDetected = true;
                                break;
                            }
                        }
                        if (!collisionDetected) {
                            hero.x += hero.speed;
                        }
                    }
                    if (keys.lkd && hero.x > 0) {
                        var collisionDetected = false;
                        hero.nextY = hero.y;
                        hero.nextX = hero.x - hero.speed;
                        for (i = 0; i < blocks.length; i++) {
                            if (predictHit(hero, blocks[i])) {
                                collisionDetected = true;
                                break;
                            }
                        }
                        if (!collisionDetected) {
                            hero.x -= hero.speed;
                        }
                    }
                    if (keys.ukd && hero.y >= 0) {
                        var collisionDetected = false;
                        hero.nextY = hero.y - hero.speed;
                        hero.nextX = hero.x;
                        for (i = 0; i < blocks.length; i++) {
                            if (predictHit(hero, blocks[i])) {
                                collisionDetected = true;
                                break;
                            }
                        }
                        if (!collisionDetected) {
                            hero.y -= hero.speed;
                        }
                    }
                    if (keys.dkd && hero.y < 750 - hero.height) {
                        var collisionDetected = false;
                        hero.nextY = hero.y + hero.speed;
                        hero.nextX = hero.x;
                        for (i = 0; i < blocks.length; i++) {
                            if (predictHit(hero, blocks[i])) {
                                collisionDetected = true;
                                break;
                            }
                        }
                        if (!collisionDetected) {
                            hero.y += hero.speed;
                        }
                    }
                }
            }

function heroLoseLife() {
    createjs.Sound.play('deadSound');
    heroNoHit = true;
    heroLife--;
    if (heroLife <1){
        gameOver();
    }
    if (gameIsRunning === true) {
        var message = "Lose 1 life";
        var messageOnScreen = new createjs.Text(message, "70px Raleway", "#000");
        messageOnScreen.textBaseline="middle";
        messageOnScreen.textAlign="center";
        messageOnScreen.x=stageMain.canvas.width/2;
        messageOnScreen.y=stageMain.canvas.height/2;
        stageMain.addChild(messageOnScreen);
        animate();
        function animate() {
            messageOnScreen.scaleX = messageOnScreen.scaleY = 0;
            createjs.Tween.get(messageOnScreen).to({scaleX: 2, scaleY: 2}, 1500).call(function () {
                    stageMain.removeChild(messageOnScreen);
            })
        }
    }
    setTimeout(function () {
        heroUnsafe();
    }, 2000)

}

function heroSafe() {
    heroNoHit = true;
}

function heroUnsafe() {
    heroNoHit = false;
}

function predictHit(character, rect1) {
            if (character.nextX >= rect1.x + rect1.width
                || character.nextX + character.width <= rect1.x
                || character.nextY >= rect1.y + rect1.height
                || character.nextY + character.height <= rect1.y) {
                return false;
            }
            return true;
        }

// POWERUPS START
function freezeTime() {
            timeIsRunning = false;
            sandDropRun.gotoAndStop('stop');
            setTimeout(function () {
                createjs.Ticker.setPaused(true)
            }, 1600);
            setTimeout(function () {
                timeIsRunning = true;
                sandDropRun.gotoAndPlay('run');
                timerCountDown()
                stageMain.removeChild(freezeTimeImg);
                createjs.Ticker.setPaused(false);
            }, 10000);
            var message = "Freeze time";
            var messageOnScreen = new createjs.Text(message, "70px Raleway", "#000");
            messageOnScreen.textBaseline="middle";
            messageOnScreen.textAlign="center";
            messageOnScreen.x=stageMain.canvas.width/2;
            messageOnScreen.y=stageMain.canvas.height/2;
            stageMain.addChild(messageOnScreen, freezeTimeImg);
            animate();
            function animate() {
                messageOnScreen.scaleX = messageOnScreen.scaleY = 0;
                createjs.Tween.get(messageOnScreen).to({scaleX: 2, scaleY: 2}, 1500).call(function () {
                    stageMain.removeChild(messageOnScreen);
                })
            }
        }

function turnBackTime() {
            heroScore +=50;
            if (timeLeft < startTime - 10) {
                timeLeft += 10;
            } else {
                timeLeft = startTime;
            }
            var message = "Turn back time";
            var messageOnScreen = new createjs.Text(message, "70px Raleway", "#000");
            messageOnScreen.textBaseline="middle";
            messageOnScreen.textAlign="center";
            messageOnScreen.x=stageMain.canvas.width/2;
            messageOnScreen.y=stageMain.canvas.height/2;
            stageMain.addChild(messageOnScreen);
            animate();
            function animate() {
                messageOnScreen.scaleX = messageOnScreen.scaleY = 0;
                createjs.Tween.get(messageOnScreen).to({scaleX: 2, scaleY: 2}, 1500).call(function () {
                    stageMain.removeChild(messageOnScreen);
                })
            }
        }

function addLife() {
            heroLife++;
            var message = "Get 1 life";
            var messageOnScreen = new createjs.Text(message, "70px Raleway", "#000");
            messageOnScreen.textBaseline="middle";
            messageOnScreen.textAlign="center";
            messageOnScreen.x=stageMain.canvas.width/2;
            messageOnScreen.y=stageMain.canvas.height/2;
            stageMain.addChild(messageOnScreen);
            animate();
            function animate() {
                messageOnScreen.scaleX = messageOnScreen.scaleY = 0;
                createjs.Tween.get(messageOnScreen).to({scaleX: 2, scaleY: 2}, 1500).call(function () {
                    stageMain.removeChild(messageOnScreen);
                })
            }
        }

function addHeroPoint() {
    heroScore +=100;
    var message = "+100 Points";
    var messageOnScreen = new createjs.Text(message, "70px Raleway", "#000");
    messageOnScreen.textBaseline="middle";
    messageOnScreen.textAlign="center";
    messageOnScreen.x=stageMain.canvas.width/2;
    messageOnScreen.y=stageMain.canvas.height/2;
    stageMain.addChild(messageOnScreen);
    animate();
    function animate() {
        messageOnScreen.scaleX = messageOnScreen.scaleY = 0;
        createjs.Tween.get(messageOnScreen).to({scaleX: 2, scaleY: 2}, 1500).call(function () {
            stageMain.removeChild(messageOnScreen);
        })
    }
}

function phase () {
    heroSafe();
    hero.alpha = .4;
    heroScore +=50;
    setTimeout(function () {
        heroUnsafe();
        hero.alpha = 1;
        stageMain.removeChild(lightningImg)
    },5000)
    var message = "Walk Through Enemies";
    var messageOnScreen = new createjs.Text(message, "70px Raleway", "#000");
    messageOnScreen.textBaseline="middle";
    messageOnScreen.textAlign="center";
    messageOnScreen.x=stageMain.canvas.width/2;
    messageOnScreen.y=stageMain.canvas.height/2;
    stageMain.addChild(messageOnScreen, lightningImg);
    animate();
    function animate() {
        messageOnScreen.scaleX = messageOnScreen.scaleY = 0;
        createjs.Tween.get(messageOnScreen).to({scaleX: 2, scaleY: 2}, 1500).call(function () {
            stageMain.removeChild(messageOnScreen);
        })
    }
}

// POWERUPS END

function tock(e) {
            if (gameIsRunning === true) {
                moveHero();
                updateStatusBar();
            }
            if (stickManRun.x < 1200) {
                stickManRun.x += 5;
            }

            if (timeLeft < 0 && gameIsRunning === true) {
                gameOver();
            }


            stageMain.update(e);
            stageInfo.update(e);
        }


