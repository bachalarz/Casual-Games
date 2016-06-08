var scoreTotal = 0;

function init() {
    stageMain = new createjs.stage("canvasMain");
    stageInfo = new createjs.Stage("canvasInfo");

    preloadText = new createjs.Text("", "50px Arial", "#000");
    preloadText.textBaseline="middle";
    preloadText.textAlign="center";
    preloadText.x=stage.canvas.width/2;
    preloadText.y=stage.canvas.height/2;

    preload()
}

function preload(){
    queue = new createjs.LoadQueue(autoStart);
    queue.installPlugin(createjs.Sound);
    queue.on("progress", queueProgress);
    queue.on("complete", queueComplete);
    queue.loadManifest([

        //{id: "smug", src:"spritesheets/animations/smug.json"},
        //"img/hero-boy-sheet.png"

    ])
    console.log("Preload")
}

function queueProgress(e){
    preloadText.text="Loading... "+ Math.round(e.progress*100)+"%";
    stage.update(e);
}

function queueComplete(){
    createjs.Ticker.on("tick", tock);
    createjs.Ticker.setFPS(30);
    stage.removeChild(preloadText);

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
    console.log("tock is running")
}

