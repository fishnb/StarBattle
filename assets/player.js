class Player {
    /**
     *
     * @param main
     * @param {HTMLElement} player 玩家元素
     * @param {number} speed 移动速度
     * @param maxW
     * @param maxH
     */
    constructor(main, player, speed, {maxW, maxH}) {
        this.main = main;
        this.player = player;
        this.speed = speed;
        this.fuel = 15;
        this.score = 0;
        this.setTimer = false

        this.maxW = maxW;
        this.maxH = maxH;
        this.listeners = {}; // 事件存储
    }

    /**
     * 事件监听器
     * @param {string} name 事件名称
     * @param {Function} callback 回调函数
     */
    on(name, callback) {
        if (!this.listeners[name]) {
            this.listeners[name] = [];
        }
        this.listeners[name].push(callback);
    }

    /**
     * 事件触发器
     * @param {string} name 事件名称
     * @param {Object} data 事件数据
     */
    triggerEvent(name, data) {
        const callbacks = this.listeners[name];
        if (callbacks) {
            callbacks.forEach((callback) => callback(data));
        }
    }

    getLeft() {
        return parseInt(this.player.style.left.split('px')[0]);
    }

    getTop() {
        return parseInt(this.player.style.top.split('px')[0]);
    }

    getWidth() {
        return 100;
    }

    getHeight() {
        return 50;
    }

    /**
     * 修改分数
     */
    addScore(count) {
        this.score += count;
        this.triggerEvent("score", {score: this.score, add: count});
    }

    /**
     * 设置初始位置
     */
    setPosition() {
        this.top = this.maxH / 2;
        this.left = 0;
        this.score = 0;
        this.fuel = 15
        this.move("right", 10);
    }

    die() {
        this.player.style.display = "none";
        this.fuel = 0;
        this.triggerEvent("die", {fuel: this.fuel});
    }

    shoot() {
        bullet.shoot(this.getLeft() + this.getWidth(), this.getTop() + 15, "player")
    }

    /**
     * 增加燃料
     */
    add_fuel(count) {
        if (this.fuel += count >= 30) {
            this.fuel = 30
        } else {
            this.fuel += count;
        }
        this.triggerEvent("fuel", {type: "add", fuel: this.fuel, add: count});
    }

    /**
     * 减少燃料
     */
    reduce_fuel(count) {
        this.fuel -= count;
        if (this.fuel <= 0) {
            this.die()
        }
        this.triggerEvent("fuel", {type: "reduce", fuel: this.fuel, reduce: count});
    }

    /**
     * 控制玩家移动
     *
     * @param {string} direction 移动方向 up/down/right/left
     * @param {number} length 移动长度
     */
    move(direction, length) {
        if (length <= 0) return;
        if (game.status === "stop") return;

        const animate = (remainingLength) => {
            if (remainingLength <= 0) return;

            switch (direction) {
                case "left":
                    this.left -= this.speed;
                    break;
                case "right":
                    this.left += this.speed;
                    break;
                case "up":
                    this.top -= this.speed;
                    break;
                case "down":
                    this.top += this.speed;
                    break;
            }

            if (this.top >= 0 && this.top <= 500) {
                this.player.style.top = `${this.top}px`;
            }
            if (this.left >= 0 && this.left <= 760) {
                this.player.style.left = `${this.left}px`;
            }

            this.triggerEvent("move", {
                direction,
                length: remainingLength,
                top: this.top,
                left: this.left,
            });

            if (!this.setTimer) {
                const check_impact = setInterval(() => {
                    if (game.status === "stop") return;
                    if (game.status === "end" || player.fuel <= 0) {
                        clearInterval(check_impact);
                    }

                    const doms = document.querySelector(".space-elements").children;
                    for (let i = 0; i < doms.length; i++) {
                        let child = doms[i];
                        if (this.impact(child)) {
                            // 小行星/外星人
                            if (
                                child.className.includes("enemy") ||
                                child.className.includes("asteroid")
                            ) {
                                this.reduce_fuel(15)
                                child.remove()
                                if (child.className.includes("asteroid")) game.create_asteroid(asteroids_pic)
                                if (child.className.includes("enemy")) game.create_enemy()
                            }

                            // 燃料
                            if (child.className.includes("fuel")) {
                                this.add_fuel(15)
                                child.remove()
                            }

                            this.triggerEvent("collision", {ele: child});
                        }
                    }
                    this.setTimer = true
                }, 15)
            }
            requestAnimationFrame(() => animate(remainingLength - this.speed));
        };

        animate(length);
    }

    /**
     * 物体碰撞
     */
    impact(item) {
        const itemRect = item.getBoundingClientRect();
        const thisRect = this.player.getBoundingClientRect();

        const itemLeft = itemRect.left;
        const itemRight = itemRect.right;
        const itemTop = itemRect.top;
        const itemBottom = itemRect.bottom;

        const thisLeft = thisRect.left;
        const thisRight = thisRect.right;
        const thisTop = thisRect.top;
        const thisBottom = thisRect.bottom;

        return thisLeft < itemRight && itemLeft < thisRight &&
            thisTop < itemBottom && itemTop < thisBottom;
    }

}
