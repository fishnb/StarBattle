const {maxW, maxH} = {maxW: 960, maxH: 600};
const mask = document.querySelector(".mask");
const main_dom = document.querySelector(".main");
const player_dom = document.querySelector("#player");
const header = document.querySelector(".header");
const footer = document.querySelector(".footer");
const fuel_element = document.querySelector(".fuel-inside")
const fuel_count = document.querySelector("#fuel-count");
const space_elements = document.querySelector(".space-elements");
const space_planet = document.querySelector(".space-planet");
const game_board = document.querySelector(".game-board");
const sound_element = document.querySelector(".sound");
const score_element = document.querySelector("#score")
const bullet = new Bullet()
bullet.initQueue()
const game = new Game(main_dom, space_elements, {maxW, maxH});
const player = new Player(main_dom, player_dom, 2, {maxW, maxH});
const sound_tag = document.querySelector("#sound")
let sound = false;

const asteroids_pic = [
    "./assets/images/asteroid_brown.png",
    "./assets/images/asteroid_dark.png",
    "./assets/images/asteroid_gray.png",
    "./assets/images/asteroid_gray_2.png",
];

/**
 * 键盘监听
 */
window.addEventListener("keydown", function (e) {
    e.preventDefault();
    let {code} = e;

    if (code === "ArrowLeft") {
        player.move("left", 20);
    }

    if (code === "ArrowRight") {
        player.move("right", 20);
    }

    if (code === "ArrowUp") {
        player.move("up", 20);
    }

    if (code === "ArrowDown") {
        player.move("down", 20);
    }
});

window.addEventListener("keyup", function (e) {
    e.preventDefault();
    let {code} = e;

    if (code === "Space") {
        player.shoot()
        console.log('space')
    }

    if (code === "KeyP") {
        if (game.status === "start") {
            stopGame();
        } else if (game.status === "stop") {
            continueGame();
        }
    }
})

let timer;
let time = 0;

function startTimer() {
    let dom = document.querySelector("#timer");
    dom.innerHTML = time;
    timer = setInterval(() => {
        time++;
        dom.innerHTML = time;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function continueTimer() {
    startTimer();
}

let font_size = 20;
let max_font_size = 30;
let min_font_size = 10;

// 字号减小
document.querySelector(".fd").addEventListener("click", () => {
    if (font_size > min_font_size) {
        font_size -= 2;
        setFontSize();
    }
});

//字号增大
document.querySelector(".fp").addEventListener("click", () => {
    if (font_size < max_font_size) {
        font_size += 2;
        setFontSize();
    }
});

function setFontSize() {
    let spans = document.querySelectorAll(".header span");
    for (let i = 0; i < spans.length; i++) {
        spans[i].style.fontSize = font_size + "px";
    }
}

// 暂停游戏
document.querySelector(".status").addEventListener("click", () => {
    if (game.status === "start") {
        stopGame();
    } else if (game.status === "stop") {
        continueGame();
    }
});

// 声音控制
document.querySelector(".sound").addEventListener("click", () => {
    if (sound) {
        sound_element.style.animationPlayState = "paused";
        sound = false
        sound_tag.pause()
    } else {
        sound_element.style.animationPlayState = "running";
        sound = true
        sound_tag.play()
    }
});

window.onload = function () {
    const element = document.querySelector(".sound");
    if (sound) {
        sound_tag.play();
    } else {
        element.style.animationPlayState = "paused";
    }
}

/**
 * 开始游戏
 */
function onStart() {
    try {
        if (game.status !== "end") return;
        // 隐藏遮罩层
        mask.style.display = "none";
        // 展示顶部状态栏
        header.style.display = "grid";
        footer.style.display = "grid";
        game_board.style.display = "block";
        player_dom.style.display = "block";
        fuel_element.style.width = parseInt(player.fuel) * 6 + 'px'

        game.on("start", () => {
            player.fuel = 15
            fuel_element.style.width = parseInt(player.fuel) * 6 + 'px'
            fuel_count.innerHTML = player.fuel
            player.setPosition();
        });

        player.on("fuel", ({fuel}) => {
            if (fuel <= 0) {
                player.die()
            }
            fuel_element.style.width = parseInt(fuel) * 6 + 'px'
            fuel_count.innerHTML = fuel
        });

        player.on("score", ({score}) => {
            score_element.innerHTML = score
        })

        player.on("die", () => {
            endGame();
        })


        game.start();

        for (let i = 0; i < 3; i++) {
            game.create_asteroid(asteroids_pic);
        }

        for (let i = 0; i < 3; i++) {
            game.create_enemy(asteroids_pic);
        }

        sound_element.style.animationPlayState = "running";
        sound = true
        sound_tag.play()

        startTimer();
        game.status = "start";
    } catch (e) {
        console.log(e)
    }
}

/**
 * 停止游戏
 */
function stopGame() {
    game.status = "stop";
    stopTimer();

    for (let i = 0; i < space_elements.children.length; i++) {
        // 获取当前元素
        let child = space_elements.children[i];
        child.style.animationPlayState = "paused";
    }

    for (let i = 0; i < space_planet.children.length; i++) {
        // 获取当前元素
        let child = space_planet.children[i];
        child.style.animationPlayState = "paused";
    }


    sound_element.style.animationPlayState = "paused";
    sound = false
    sound_tag.pause()

    document.querySelector("#status").src = "./assets/images/play.png";
}

/**
 * 结束游戏
 */
function endGame() {
    game.status = "end"
    for (let i = 0; i < space_elements.children.length; i++) {
        // 获取当前元素
        let child = space_elements.children[i];
        child.remove()
    }
    mask.style.display = "grid";
    header.style.display = "none";
    footer.style.display = "none";
    game_board.style.display = "none";
    player_dom.style.display = "none";
}

/**
 * 继续游戏
 */
function continueGame() {
    continueTimer();

    for (let i = 0; i < space_elements.children.length; i++) {
        // 获取当前元素
        let child = space_elements.children[i];
        child.style.animationPlayState = "running";
    }

    for (let i = 0; i < space_planet.children.length; i++) {
        // 获取当前元素
        let child = space_planet.children[i];
        child.style.animationPlayState = "running";
    }

    sound_element.style.animationPlayState = "running";
    sound = true
    sound_tag.play()

    document.querySelector("#status").src = "./assets/images/stop.png";
    game.status = "start";
}

/**
 * 显示排行榜
 */
function onRank() {
}
