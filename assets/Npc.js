class Npc {
    constructor() {
        this.id = Math.random();
        this.html = "<div></div>"
    }

    /**
     * 创建NPC
     * @param className
     * @param x
     * @param y
     */
    create(className, x = 0, y = 0) {
        let _this = this


        let npc_class = "npc"
        const speed = 8 - Math.random() * 3

        if (x === 0) {
            x = Math.floor(Math.random() * 100) + 960;
            if (className.includes("fuel")) {
                x = Math.floor(Math.random() * 960);
            }
        }
        if (y === 0) {
            y = Math.floor(Math.random() * 400) + 300;
            if (className.includes("fuel")) {
                y = 0
            }
        }
        className.forEach((item) => {
            npc_class += ` ${item}`
        })
        let npc_css = {
            left: x + "px",
            top: y + "px",
        }
        if (className.includes('enemy') || className.includes('friend')) {
            this.html=`<div style="animation: npc-bg 0.25s infinite steps(4),move-left ${speed}s linear"></div>`
        }

        if (className.includes("enemy-bullet")) {
            this.html=`<div style="animation: move-left 4s linear"></div>`
        }
        game.npc[this.id] = this

        this.dom = $(this.html).addClass(npc_class).css(npc_css).appendTo(".game-board").on('webkitAnimationEnd', function () {
            _this.remove()
        });
    }

    stop() {
        this.dom.css({'animation-play-state': 'paused'});
    }

    die() {
        this.remove();
        if (!game.gameData.muted) {
            $("body").append('<video src="./assets/sound/destroyed.mp3" autoplay onended="this.remove()"></video>');
        }
    }

    remove() {
        this.dom.remove();
        delete game.npc[this.id]
    }

    getLeft() {
        return parseInt(this.dom.offset().left);
    }

    getTop() {
        return parseInt(this.dom.offset().top);
    }

    getWidth() {
        return parseInt(this.dom.width());
    }

    getHeight() {
        return parseInt(this.dom.height());
    }
}

class Enemy extends Npc {
    constructor() {
        super();
        let _this = this
        this.create(['enemy'])
        this.shot = setInterval(function () {
            if (game.status === "stop" || game.status === "pause") return;
            if (game.status === "over") {
                clearInterval(_this.shot)
                return;
            }

            if (_this.getLeft() <= 800) {
                new EnemyBullet(_this.getLeft(), _this.getTop());
                clearInterval(this.shot);
            }
        }, 2000);
    }
}

class Friend extends Npc {
    constructor() {
        super();
        this.create(['friend'])
    }
}

class Asteroid extends Npc {
    constructor() {
        super();
        this.hp = 2
        this.create(['asteroid'])
    }
}

class Fuel extends Npc {
    constructor() {
        super();
        this.create(['fuel'])
    }
}

class PlayerBullet extends Npc {
    constructor(x, y) {
        super();
        this.create(["bullet", "player-bullet"], x, y)
        if (!game.gameData.muted) {
            $("body").append('<video src="./assets/sound/shoot.mp3" autoplay onended="this.remove()"></video>');
        }
    }

    impact(item) {
        let left = (
            this.getLeft() < item.getLeft() + item.getWidth()
        )
        let right = (
            item.getLeft() < this.getLeft() + this.getWidth()
        )
        let top = (
            this.getTop() < item.getTop() + item.getHeight()
        )
        let bottom = (
            item.getTop() < this.getTop() + this.getHeight()
        )

        return left && right && top && bottom;
    }
}

class EnemyBullet extends Npc {
    constructor(x, y) {
        super();
        this.create(["bullet", "enemy-bullet"], x, y,)
    }
}