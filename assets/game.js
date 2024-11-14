class Game {
    constructor() {
        this.status = "over"
        this.muted = true
        this.font_size = 18
        this.npc = {}
        this.gameData = {
            score: 0,
            time: 0,
            fuel: 15,
            name: "",
            rankData: null
        }
    }

    /**
     * 开始游戏
     */
    start() {
        this.resetGameData()
        this.timer()
        this.player = new Player(this)
        this.status = "start"
        this.mute()
    }

    /**
     * 结束游戏
     */
    over() {
        if (game.status === "over") return;
        this.status = "over"
        this.player.remove()
        $(".npc").remove()
        $(".game").hide()
        $(".frame").show()
        $(".frame .over").css("display", "flex")
        $(".frame .over .submit").css("display", "flex")
    }

    /**
     * 停止游戏
     */
    pause() {
        this.status = "pause"
        this.mute()
        $(".npc").css("animation-play-state", "paused")
        $(".planet").css("animation-play-state", "paused")
        $("#status").attr("src", "./assets/images/play.png")
    }

    /**
     * 继续游戏
     */
    continue() {
        this.status = "start"
        this.mute()
        $(".npc").css("animation-play-state", "running")
        $(".planet").css("animation-play-state", "running")
        $("#status").attr("src", "./assets/images/stop.png")
    }

    /**
     * 重置游戏数据
     */
    resetGameData() {
        this.gameData = {
            player: '',
            score: 0,
            time: 0,
            fuel: 15,
            name: "",
        };
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
            if (this.status === "over") {
                clearInterval(npc_create)
                return;
            }
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
            this.gameData.fuel--
            this.gameData.time++
        }, 1000)


        const check = setInterval(() => {
            if (game.status === "over") {
                clearInterval(check)
                return false
            }
            if (game.status === "pause") return false;
            if (this.gameData.fuel <= 0) {
                this.over()
                return;
            }
            if (this.gameData.fuel >= 30) {
                this.gameData.fuel = 30
            }

            $("#fuel").html(this.gameData.fuel);
            $("#timer").html(this.gameData.time);
            $("#score").html(this.gameData.score);
            $(".fuel-inside").css({width: this.gameData.fuel * 6});

            $.each(this.npc, (index, value) => {
                if (value.dom.is(".player-bullet")) {
                    let bullet = value
                    $.each(this.npc, (_index, _value) => {
                        if (!_value.dom.is(".plane,.player-bullet,.enemy-bullet,.fuel") && bullet.impact(_value)
                        ) {
                            if (_value.dom.is(".enemy")) {
                                this.gameData.score += 5
                                _value.die()
                            } else if (_value.dom.is('.friend')) {
                                this.gameData.score -= 10;
                                _value.die();
                            } else if (_value.dom.is('.asteroid')) {
                                _value.hp--
                                if (_value.hp <= 0) {
                                    this.gameData.score += 10;
                                    _value.die();
                                }
                            }
                            bullet.remove()
                        }
                    })
                }
            })
        }, 15)
    }
}