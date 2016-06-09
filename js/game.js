var gameIsRunning = false;
var stageMain, stageInfo; // Stages
var preloadText, titelText, getReady; // Text
var ufo, ufoSmall, stickMan; //Bitmaps
var hero; //Hero player
var queue; // Start
var moveSmallUfo = false;
var autoStart = true;
var scoreTotal = 0;
var levelData, tiles, currentLevel=-1, t, blockSize = 50; //level
var queue;

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
        {id:"bgSound", src:"audio/music/bgMusic.mp3"},
        {id:"clickSpaceGun", src:"audio/music/spaceGun.mp3"},
        {id:"deadSound", src:"audio/sounds/dead.mp3"},
        //{id:"test1", src:"img/buttonStartGame.png"},
        "img/buttonStartGame.png",
        "img/buttonHowToPlay.png",
<<<<<<< HEAD
        //"img/stickManSprite.png",
        {id:"levelJson",src:"json/levels.json"},
        {id:"tiles",src:"json/tiles.json"},
=======
>>>>>>> 893fd7621f65a4e561d648fbbd77aa7193dcbbea

        "img/ufoSmall.png"
    ]);
    console.log("Preload is running");
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
    console.log('Loading complete');
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

    var buttonStartGame = new createjs.Bitmap(queue.getResult('img/buttonStartGame.png'));
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

    var buttonHowToPlay = new createjs.Bitmap(queue.getResult('img/buttonHowToPlay.png'));
    buttonHowToPlay.width = 250;
    buttonHowToPlay.x = (stageMain.canvas.width/2)-(buttonHowToPlay.width)/2;
    buttonHowToPlay.y = 400;
    buttonHowToPlay.addEventListener('click',
        function(e){
            createjs.Sound.play('clickSpaceGun');
        }
    );

    createjs.Sound.play('bgSound', {loop:-1});
    addBgUfo();
    stageMain.addChild(buttonStartGame, buttonHowToPlay, titelText);
    moveSmallUfo = true;

}

function getReady() {
    console.log("get ready");
    var counter = 4;
    var cT = new createjs.Text(counter, "2000px Raleway", "#000");
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

function selectHeroPage() {}

function instructionPage() {}

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
    
}

function startGame() {
    gameIsRunning = true;
    console.log("start game")
<<<<<<< HEAD
    setupLevel();
    //window.addEventListener('keydown', fingerDown);
    //window.addEventListener('keyup', fingerUp);
=======
    window.addEventListener('keydown', fingerDown);
    window.addEventListener('keyup', fingerUp);
>>>>>>> 893fd7621f65a4e561d648fbbd77aa7193dcbbea
}

function setupLevel() {
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
            stageMain.addChild(t);
        }
    }
}

function gameComplete() {

}

function gameOver() {
    gameIsRunning = false;
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

//add hero

//move hero




function tock(e) {
    stageMain.update(e);
    stageInfo.update(e);
    //console.log("Tock() is running")
}



// Tilføjelser:
// Lifestatus
// Mute
// Reset game
// Add enemi
