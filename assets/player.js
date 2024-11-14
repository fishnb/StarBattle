class Player extends Npc {
    constructor(game) {
        super()
        this.x = 0;
        this.y = 960 / 3;
        this.direction = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.id = Math.random();
        this.speed = 5;
        this.create(game)
        this.init()
    }

    init() {
        this.x = 0
        this.y = 960 / 3
        this.direction = {
            left: false,
            right: false,
            up: false,
            down: false
        };
    }

    create(game) {
        let _this = this;

        this.dom = $("<div></div>").addClass("plane").appendTo(".game-board")
        game.npc[this.id] = this;
        _this.move();
    }

    remove() {
        this.dom.remove();
        delete game.npc[this.id]
    }

    move(direction) {
        this.direction[direction] = true
    }

    stop(direction) {
        this.direction[direction] = false
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