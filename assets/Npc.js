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
        game.npc[this.id] = this

        let npc_css = {
            left: x + "px",
            top: y + "px",
        }
        let npc_class = "npc"
        const speed = 8 - Math.random() * 3

        if (x === 0) {
            x = Math.floor(Math.random() * 100) + 960;
        }
        if (y === 0) {
            y = Math.floor(Math.random() * 400) + 300;
        }
        className.forEach((item) => {
            npc_class += ` ${item}`
        })
        if (className.includes('enemy') || className.includes('friend')) {
            npc_css['animation'] = `0.25s steps(4) 0s infinite normal none paused npc-bg, 5.17673s linear 0s 1 normal none move-left,move-left ${speed}s linear`
        }

        this.dom = $(this.html).addClass(npc_class).css(npc_css).appendTo(".game-board").on('webkitAnimationEnd', function () {
            _this.remove();
            delete game.npc[this.id]
        });
    }

    stop() {
        this.dom.css({'animation-play-state': 'paused'});
    }

    die() {
        this.dom.remove();
        if (!gameData.muted) {
            GameBoard.append('<video src="sound/destroyed.mp3" autoplay onended="this.remove()"></video>');
        }
    }

    remove() {
        this.dom.remove();
    }

    getLeft() {
        return parseInt(this.dom.css('left'));
    }

    getTop() {
        return parseInt(this.dom.css('top'));
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
        this.create(['enemy'])
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
    }

    impact(item) {
        let itemLw = item.getLeft() + item.getWidth();
        let itemTh = item.getTop() + item.getHeight();
        let thisLw = this.getLeft() + this.getWidth();
        let thisTh = this.getTop() + this.getHeight();
        // console.log(item.dom.width());
        return this.getLeft() < itemLw && itemLw < thisLw + item.getWidth()
            && this.getTop() < itemTh && itemTh < thisTh + item.getHeight();
    }
}

class EnemyBullet extends Npc {
    constructor(x, y) {
        super();
        this.create(["bullet", "enemy-bullet"], x, y,)
    }
}