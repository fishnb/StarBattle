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

const game = new Game(main_dom, space_elements, {maxW, maxH});
const player = new Player(main_dom, player_dom, 2, {maxW, maxH});
const sound_element = document.querySelector("#sound")
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
    const element = document.querySelector(".sound");
    if (sound) {
        element.style.animationPlayState = "paused";
        sound = false
        sound_element.pause()
    } else {
        element.style.animationPlayState = "running";
        sound = true
        sound_element.play()
    }
});

window.onload = function () {
    const element = document.querySelector(".sound");
    if (sound) {
        sound_element.play();
    } else {
        element.style.animationPlayState = "paused";
    }
}

/**
 * 开始游戏
 */
function onStart() {
    // 隐藏遮罩层
    mask.style.display = "none";
    // 展示顶部状态栏
    header.style.display = "grid";
    footer.style.display = "grid";
    game_board.style.display = "block";
    player_dom.style.display = "block";
    fuel_element.style.width = parseInt(player.fuel) * 6 + 'px'

    game.on("start", () => {
        player.setPosition();
    });

    player.on("fuel", ({type, reduce, add, fuel}) => {
        console.log(type, reduce, fuel)
        if (fuel <= 0) {
            player.die()
        }
        fuel_element.style.width = parseInt(fuel) * 6 + 'px'
        fuel_count.innerHTML = fuel
    });

    player.on("collision", (data) => {
        console.log(data)
    })

    player.on("die", () => {
        endGame();
    })

    console.log(game)
    game.start();
    for (let i = 0; i < 3; i++) {
        game.create_asteroid(asteroids_pic);
    }

    for (let i = 0; i < 3; i++) {
        game.create_enemy(asteroids_pic);
    }

    const reduce_timer = setInterval(() => {
        if (game.status === "stop") return;
        if (this.fuel <= 0 || game.status === "end") clearInterval(reduce_timer);
        player.reduce_fuel(1)
    }, 1000)

    const create_fuel = setInterval(() => {
        const fuel_count = document.querySelectorAll(".space-elements .fuel");
        if (fuel_count.length >= 3) return;
        if (game.status === "stop") return;
        if (this.fuel <= 0 || game.status === "end") clearInterval(create_fuel);
        game.create_fuel()
    }, 2000)

    // const check_element = setInterval(() => {
    //     if (game.status === "stop") return;
    //     if (game.status === "end") clearInterval(check_element)
    //     const elements = document.querySelectorAll(".space-elements")
    //     for (let i = 0; i < elements.length; i++) {
    //         let child = elements[i];
    //
    //         if (child.className.includes("fuel")) {
    //             if (child.style.top.split("px")[0] >= 500) child.remove()
    //         }
    //
    //         if (child.className.includes("asteroid")) {
    //             if (child.style.left.split("px")[0] <= -20) {
    //                 child.remove()
    //                 game.create_asteroid(asteroids_pic)
    //             }
    //         }
    //
    //         if (child.className.includes("enemy")) {
    //             if (child.style.left.split("px")[0] <= -20) {
    //                 child.remove()
    //                 game.create_enemy()
    //             }
    //         }
    //     }
    // }, 10)

    startTimer();
    game.start = "start";
}

/**
 * 停止游戏
 */
function stopGame() {
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

    document.querySelector("#status").src = "./assets/images/play.png";
    game.status = "stop";
}

/**
 * 结束游戏
 */
function endGame() {
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
    game.status = "end"
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

    document.querySelector("#status").src = "./assets/images/stop.png";
    game.status = "start";
}

/**
 * 显示排行榜
 */
function onRank() {
}
