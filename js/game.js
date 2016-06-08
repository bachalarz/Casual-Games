var gameIsRunning = false;
var stageMain, stageInfo; // Stages
var preloadText, titelText; // Text
var ufo, ufoSmall; //Bitmaps
var moveSmallUfo = false;
var autoStart = true;
var scoreTotal = 0;

function init() {
    stageMain = new createjs.Stage("canvasMain");
    stageInfo = new createjs.Stage("canvasInfo");

    ufo = new createjs.Bitmap("img/ufo.png");
    ufo.width = 200;
    ufo.height = 200;
    ufo.x = 0;
    ufo.y = 150;
    stageMain.addChild(ufo);

    preloadText = new createjs.Text("", "50px Raleway", "#000");
    preloadText.textBaseline="middle";
    preloadText.textAlign="center";
    preloadText.x=stageMain.canvas.width/2;
    preloadText.y=stageMain.canvas.height/1.7;

    stageMain.addChild(preloadText);

    preload()
}

function preload(){
    var queue = new createjs.LoadQueue(autoStart);
    queue.installPlugin(createjs.Sound);
    queue.on("progress", queueProgress);
    queue.on("complete", queueComplete);
    queue.loadManifest([
        {id:"bgSound", src:"audio/music/bg.mp3"},
        {id:"deadSound", src:"audio/sounds/dead.mp3"},
        "img/ufoSmall.png"
    ]);
    console.log("Preload is running");
}

function queueProgress(e){
    preloadText.text="Loading... " + Math.round(e.progress*100) + "%";
    ufo.x =+(e.progress*950);
    stageMain.update(e);
}

function queueComplete(){
    createjs.Ticker.on("tick", tock);
    createjs.Ticker.setFPS(30);
    stageMain.removeChild(preloadText, ufo);
    console.log('Loading complete');
    startPage();
}

function startPage(){
    titelText = new createjs.Text("Spillets titel", "50px Raleway", "#000");
    titelText.textBaseline="middle";
    titelText.textAlign="center";
    titelText.x=stageMain.canvas.width/2;
    titelText.y=100;

    stageMain.addChild(titelText);
    moveSmallUfo = true;
    addBgUfo();
    console.log("startPage()");
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

function moveUfo(){
    createjs.Tween.get(ufoSmall).to(
        {
            x:Math.floor(Math.random() * 1100), y:Math.floor(Math.random() * 700)
        },
        7000,
        createjs.Ease.cubicInOut
    ).call(
        function(){
            if(moveSmallUfo=true)
            setTimeout(function() { moveUfo(); }, 2000);
            console.log("moveSmallUfo");
        }
    );
}



function startGame() {
    gameIsRunning = true;
    window.addEventListener('keydown', fingerDown);
    window.addEventListener('keyup', fingerUp);
}

function nextLevel() {
    
}

function gameComplete() {

}

function gameOver() {
    gameIsRunning = false;
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
