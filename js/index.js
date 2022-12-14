let canvas = document.getElementById("ninjaSaga");
let ctx = canvas.getContext("2d");

let audioLoader = new AudioLoader();

let imageLoader = new ImageLoader();

let game = new Game(canvas, imageLoader, audioLoader);

let frameRate = 120;
let count = 0;
let loadingTime = 0;

var intervalId = setInterval(() => {
    if (
        imageLoader.hasAllImagesLoaded() &&
        audioLoader.hasAllAudiosLoaded()
    ) {
        clearInterval(intervalId);
        gameLoop();
    } else {
        loadingTime++;

        if (loadingTime % frameRate == 1) count++;

        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        ctx.font = "20px sans-serif";
        ctx.fillStyle = "#fff";

        ctx.fillText(
            "Loading" + ".".repeat(count % 5),
            GAME_WIDTH * 0.5 - 10,
            GAME_HEIGHT * 0.5
        );

        if (count > 50) {
            ctx.font = "15px sans-serif";
                    ctx.fillStyle = "#fff";

            ctx.fillText(
                "Net too slow?? Please wait for a while",
                GAME_WIDTH * 0.5 - 105,
                GAME_HEIGHT * 0.5 + 40
            );
        }

        if (count > 500) {
            location.reload();
        }
    }
});


function gameLoop() {
    let gameEngine = requestAnimationFrame(gameLoop);
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    game.draw(ctx, gameEngine, this.gameLoop);
    ctx.imageSmoothingEnabled = false;
}


