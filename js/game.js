var gameIsRunning = false;
var heroLife = 3, heroScore = 0; // Hero status
var levelText, lifeText, scoreText, timeText; // Show in stageInfo
var stageMain, stageInfo; // Stages
var preloadText, titelText, deadText; // Text
var ufo, ufoSmall, soundButton, buttonStartGame, buttonHowToPlay, restartButton, buttonBack, stickMan, stickManRun, timerBar1, timerBar2; //Bitmaps
var hero, heroSpriteSheet; //Hero player
var queue; // Start
var soundMute = false; // Sounds
var moveSmallUfo = false;
var autoStart = true;
var scoreTotal = 0;
var levelData, tiles, currentLevel=-1, t, blockSize = 50; //level
var hitTest;
var keys = {
    rkd:false,
    lkd:false,
    ukd:false,
    dkd:false,
};

var temp = 60;

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
        {id:"bgSound", src:"audio/music/bgMusic.mp3"},
        {id:"clickSpaceGun", src:"audio/sounds/spaceGun.mp3"},
        {id:"deadSound", src:"audio/sounds/dead.mp3"},
        {id: "muteSprite", src:"json/muteSprite.json"},
        {id: "runSprite", src:"json/stickManRun.json"},
        "img/heart.png",
        "img/star.png",
        "img/timer1.png",
        "img/timer2.png",
        "img/buttonStartGame.png",
        "img/buttonHowToPlay.png",
        "img/buttonBack.png",
        "img/buttonRestart.png",
        "img/heroSprite.png",
        "img/rules.png",
        "img/rules.png",
        {id:"levelJson",src:"json/levels.json"},
        {id:"tiles",src:"json/tiles.json"},

        "img/ufoSmall.png"
    ]);
    //console.log("Preload is running");
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
    //console.log('Loading complete');
    levelData = queue.getResult("levelJson")
    tiles = new createjs.SpriteSheet(queue.getResult("tiles"));
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

    createjs.Sound.play('bgSound', {loop:-1});
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
        }
    );

    var lifeIcon = new createjs.Bitmap(queue.getResult("img/heart.png"));
    lifeIcon.x = 50;
    lifeIcon.y = 200;

    var scoreIcon = new createjs.Bitmap(queue.getResult("img/star.png"));
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

    var timerImg1 = new createjs.Bitmap(queue.getResult('img/timer1.png'));
    timerImg1.x = 50;
    timerImg1.y = 480;

    var timerImg2 = new createjs.Bitmap(queue.getResult('img/timer2.png'));
    timerImg2.alpha = 1;
    timerImg2.x = 50;
    timerImg2.y = 480;

    timerBar1 = new createjs.Shape();
    timerBar1.graphics.beginFill("#c5910e");
    timerBar1.graphics.drawRect(0, 0, 150, temp);
    timerBar1.x = 50;
    timerBar1.y = 500;

    timerBar2 = new createjs.Shape();
    timerBar2.graphics.beginFill("#c5910e");
    timerBar2.graphics.drawRect(0, 0, 150, temp);
    timerBar2.x = 50;
    timerBar2.y = 605;

    stageInfo.addChild(soundButton);
    stageInfo.addChild(restartButton, levelText, lifeText, scoreText, timeText, lifeIcon, scoreIcon, timerImg1, timerBar1, timerBar2, timerImg2); // Fjern mig!!!

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
    setupLevel();
    addHero();
    window.addEventListener('keydown', fingerDown);
    window.addEventListener('keyup', fingerUp);
}

function setupLevel(){
    stageMain.removeAllChildren();
    var row, col;
    currentLevel++;
    var level = levelData.levels[currentLevel].tiles;
    blocks=[];
    for(row=0; row<level.length; row++){
        for(col=0; col<level[row].length; col++){
            var img;
            switch(level[row][col]){
                case 0:
                    img = "floor";
                    break;

                case 1:
                    img = "block";
                    break;
            }
            t = new createjs.Sprite(tiles, img);
            t.x=col*blockSize;
            t.y=row*blockSize;
            t.width=blockSize;
            t.height=blockSize;
            t.type = level[row][col];
            if(t.type===1){
                blocks.push(t);
            }
            stageMain.addChild(t, ufoSmall);
        }
    }
}

function gameComplete() {

}
//tilføjes til enemy hit detection
function lifestatus() {
    if (heroLife <= 0){
        gameOver();
    }
}
function gameOver() {
    deadText = new createjs.Text("", "50px Raleway", "#000");
    deadText.text = "You have died!";
    deadText.textBaseline="middle";
    deadText.textAlign="center";
    deadText.x=stageMain.canvas.width/2;
    deadText.y=300;

    var splash = new createjs.Bitmap("img/skull.png");
    splash.x=stageMain.canvas.width/2;
    splash.y=300;

    stageMain.addChild(deadText);
    gameIsRunning = false;
}

function soundOnOff() {
    if (soundMute===false) {
        soundMute = true;
        createjs.Sound.stop();
        soundButton.gotoAndStop('muteOn');
    } else {
        soundMute = false;
        createjs.Sound.play('bgSound', {loop:-1});
        soundButton.gotoAndStop('muteOff');
    }
}

function fingerUp(e){
    if(e.keyCode===37){
        keys.lkd=false;
        hero.gotoAndStop('left');
        hero.currentAnimation = "undefined";
    }
    if(e.keyCode===38){
        keys.ukd=false;
        hero.gotoAndStop('up');
        hero.currentAnimation = "undefined";
    }
    if(e.keyCode===39){
        keys.rkd=false;
        hero.gotoAndStop('right');
        hero.currentAnimation = "undefined";
    }
    if(e.keyCode===40){
        keys.dkd=false;
        hero.gotoAndStop('down');
        hero.currentAnimation = "undefined";
    }
}

function fingerDown(e){
    if(e.keyCode===37){
        keys.lkd=true;
        if(hero.currentAnimation!='left') {
            hero.gotoAndPlay('left');
        }
    }
    if(e.keyCode===38){
        keys.ukd=true;
        if(hero.currentAnimation!='up') {
            hero.gotoAndPlay('up');
        }
    }
    if(e.keyCode===39){
        keys.rkd=true;
        if(hero.currentAnimation!='right') {
            hero.gotoAndPlay('right');
        }
    }
    if(e.keyCode===40){
        keys.dkd=true;
        if(hero.currentAnimation!='down') {
            hero.gotoAndPlay('down');
        }
    }
}

function hitTest(rect1,rect2) {
    if ( rect1.x >= rect2.x + rect2.width
        || rect1.x + rect1.width <= rect2.x
        || rect1.y >= rect2.y + rect2.height
        || rect1.y + rect1.height <= rect2.y )
    {
        return false;
    }
    return true;
}

function checkCollisions(){

}

//finger up/down

function addHero(){

    heroSpriteSheet = new createjs.SpriteSheet(queue.getResult('heroSprite'));
    hero = new createjs.Sprite(heroSpriteSheet, 'still');
    hero.width = 50;
    hero.height = 50;
    hero.speed = 10;
    hero.nextX;
    hero.nextY;

    hero.x = (stageMain.canvas.width / 2) - (hero.width / 2);
    hero.y = stageMain.canvas.height - hero.height;
    stageMain.addChild(hero); //Her stod den oprindeligt!
}

function moveHero(){
    if(keys.rkd && hero.x < 1150-hero.width){
        var collisionDetected = false;
        hero.nextY=hero.y;
        hero.nextX=hero.x+hero.speed;
        for(i=0; i<blocks.length; i++){
            if(predictHit(hero, blocks[i])){
                collisionDetected=true;
                break;
            }
        }
        if(!collisionDetected) {
            hero.x += hero.speed;
        }
    }
    if(keys.lkd && hero.x > 0){
        var collisionDetected = false;
        hero.nextY=hero.y;
        hero.nextX=hero.x-hero.speed;
        for(i=0; i<blocks.length; i++){
            if(predictHit(hero, blocks[i])){
                collisionDetected=true;
                break;
            }
        }
        if(!collisionDetected) {
            hero.x -= hero.speed;
        }
    }
    if(keys.ukd && hero.y >= 0){
        var collisionDetected = false;
        hero.nextY=hero.y-hero.speed;
        hero.nextX=hero.x;
        for(i=0; i<blocks.length; i++){
            if(predictHit(hero, blocks[i])){
                collisionDetected=true;
                break;
            }
        }
        if(!collisionDetected) {
            hero.y -= hero.speed;
        }
    }
    if(keys.dkd && hero.y < 750-hero.height){
        var collisionDetected = false;
        hero.nextY=hero.y+hero.speed;
        hero.nextX=hero.x;
        for(i=0; i<blocks.length; i++){
            if(predictHit(hero, blocks[i])){
                collisionDetected=true;
                break;
            }
        }
        if(!collisionDetected) {
            hero.y += hero.speed;
        }
    }
}
//Character hitDetection with blocks
function predictHit(character,rect2) {
    if ( character.nextX >= rect2.x + rect2.width
        || character.nextX + character.width <= rect2.x
        || character.nextY >= rect2.y + rect2.height
        || character.nextY + character.height <= rect2.y )
    {
        return false;
    }
    return true;
}




function tock(e) {
    if (gameIsRunning === true) {
        moveHero();
        //updateStatusBar();
    }
    if (stickManRun.x < 1200) {
        stickManRun.x += 5;
    }

    updateStatusBar(); // Skal flyttes til (game is running)

    stageMain.update(e);
    stageInfo.update(e);
    //console.log("Tock() is running")
}

// Tilføjelser:
// Lifestatus
// Reset game
// Add enemi
// SetChildIndex
// setInterval (kører function hvert x tid)

