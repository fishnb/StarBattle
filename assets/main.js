const GameHeader = document.querySelector(".header")
const GameFooter = document.querySelector(".footer")
const GameBoard = document.querySelector(".game-board")
let gameData = {
    player: '',
    score: 0,
    time: 0,
    fuel: 15,
    name: "",
}

const game = new Game()

window.addEventListener("keydown", (e) => {
    const {code} = e;

    if (code.startsWith("Arrow")) {
        game.move(code.split("Arrow")[1].toLowerCase())
    }
})

window.addEventListener("keyup", (e) => {
    const {code} = e;

    if (code.startsWith("Arrow")) {
        gameData.player.stop(code.split("Arrow")[1].toLowerCase())
    }
    if (code === "Space") {
        new PlayerBullet(gameData.player.x + 100, gameData.player.y + 25)
    }
})

$(".sound img").click(() => {
    game.mute()
})

$(".fd").click(() => {
    game.fontSize("reduce")
})

$(".fp").click(() => {
    game.fontSize("add")
})

$(".status").click(() => {
    if (game.status === "start") {
        game.pause()
    } else if (game.status === "pause") {
        game.continue()
    }
})
game.start()

const playerMove = () => {
    let dir = gameData.player.direction;
    dir.left && (gameData.player.x -= gameData.player.speed);
    dir.right && (gameData.player.x += gameData.player.speed)
    dir.up && (gameData.player.y -= gameData.player.speed)
    dir.down && (gameData.player.y += gameData.player.speed)

    gameData.player.dom.style.left = gameData.player.x + "px";
    gameData.player.dom.style.top = gameData.player.y + "px";
    requestAnimationFrame(playerMove)
}


playerMove()