var stageMain, stageInfo;
var autoStart = true;
//var scoreTotal = 0;

function init() {
    stageMain = new createjs.Stage("canvasMain");
    stageInfo = new createjs.Stage("canvasInfo");

    preloadText = new createjs.Text("", "50px Arial", "#000");
    preloadText.textBaseline="middle";
    preloadText.textAlign="center";
    preloadText.x=stageMain.canvas.width/2;
    preloadText.y=stageMain.canvas.height/2;

    preload()
}

function preload(){
    queue = new createjs.LoadQueue(autoStart);
    queue.installPlugin(createjs.Sound);
    queue.on("progress", queueProgress);
    queue.on("complete", queueComplete);
    queue.loadManifest([
        {id:"bgSound", src:"sounds/music/bg.mp3"},
        {id:"deadSound", src:"sounds/sounds/dead.mp3"}
    ])
    console.log("Preload")
}

function queueProgress(e){
    preloadText.text="Loading... "+ Math.round(e.progress*100)+"%";
    stageMain.update(e);
}

function queueComplete(){
    createjs.Ticker.on("tick", tock);
    createjs.Ticker.setFPS(30);
    stageMain.removeChild(preloadText);

    console.log('load complete')

    window.addEventListener('keydown', fingerDown);
    window.addEventListener('keyup', fingerUp);


    var splash = new createjs.Bitmap("img/start.png");
    splash.x=300;
    splash.y=100;
    splash.addEventListener('click',
        function(e){
            createjs.Sound.play('bgSound', {loop:-1});

            stage.removeChild(e.target);
            stage.removeChild(introText);
            stage2.removeChild(title);
            selectHeroType();
        }
    );
    stage.addChild(splash);

}

function tock(e) {
    stageMain.update(e);
    stageInfo.update(e);
    console.log("tock is running")
}

