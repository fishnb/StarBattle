class Player extends Npc {
    constructor() {
        super()
        this.x = 0;
        this.y = 960 / 3;
        this.direction = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.speed = 5;
        this.create()
    }

    create() {
        let _this = this;

        game.npc[this.id] = this;
        this.dom = $("<div></div>").addClass("plane").appendTo(".game-board")[0]
        _this.move();
    }

    move(direction) {
        this.direction[direction] = true
    }

    stop(direction) {
        this.direction[direction] = false
    }

    impact(item) {
        let itemLw = item.getLeft() + item.getWidth();
        let itemTh = item.getTop() + item.getHeight();
        // console.log(item.dom.width());
        return this.getLeft() < itemLw &&
            itemLw < this.getLeft() + this.getWidth() + item.getWidth() &&
            this.getTop() < itemTh &&
            itemTh < this.getTop() + this.getHeight() + item.getHeight();
    }
}