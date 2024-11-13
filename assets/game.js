class Game {
    constructor() {
        this.status = "end"
        this.muted = true
        this.font_size = 18
        this.npc = {}
        this.resetGameData()
    }

    /**
     * 开始游戏
     */
    start() {
        gameData.player = new Player()
        this.timer()
    }

    /**
     * 结束游戏
     */
    over() {
    }

    /**
     * 停止游戏
     */
    pause() {
    }

    /**
     * 继续游戏
     */
    continue() {
    }

    /**
     * 重置游戏数据
     */
    resetGameData() {
        gameData = {
            player: '',
            score: 0,
            time: 0,
            fuel: 15,
            name: "",
        };
        this.muted = true;
        this.npc = {}
    }

    /**
     * 静音
     */
    mute() {
        const audio = $("audio")[0]
        const sound = $(".sound img")[0]
        if (!this.muted) {
            // 静音
            sound.style.animationPlayState = "paused"
            audio.volume = 0
            this.muted = true
        } else {
            // 开启
            sound.style.animationPlayState = "running"
            audio.volume = 1
            this.muted = false
        }
    }

    /**
     * 字号
     */
    fontSize(type) {
        const font = $(".header span")
        if (type === "add") {
            this.font_size += 2;
        }

        if (type === "reduce") {
            this.font_size -= 2;
        }

        if (this.font_size > 22 || this.font_size < 14) this.font_size = 18
        for (let i = 0; i < font.length; i++) {
            font[i].style.fontSize = this.font_size + "px"
        }
    }

    timer() {
        let randomNpc = Math.floor(Math.random() * 10);
        const npc_create = setInterval(() => {
            if (this.status === "over") clearInterval(npc_create)
            if (this.status === "pause") return false;
            if (this.npc.length > 15) return false;

            randomNpc = Math.floor(Math.random() * 4);
            if (randomNpc === 0) {
                new Asteroid();
            }
            if (randomNpc === 1) {
                new Fuel();
            }
            if (randomNpc === 2) {
                new Enemy();
            }
            if (randomNpc === 3) {
                new Friend();
            }
            gameData.fuel--
            gameData.time++
        }, 1000)

        const check = setInterval(() => {
            // if (game.status === "over") clearInterval(npc_create)
            // if (game.status === "pause") return false;
            // if (this.gameData.fuel <= 0) {
            //     this.over()
            //     return;
            // }

            $("#fuel").html(gameData.fuel);
            $("#timer").html(gameData.time);
            $("#core").html(gameData.score);
            $(".fuel-inside").css({width: gameData.fuel * 6});

            $.each(this.npc, () => {
                if (this.dom.is('.player-bullet')) {
                    let bullet = this;
                    console.log(bullet)
                }
            })
        }, 15)
    }
}