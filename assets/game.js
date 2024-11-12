class Game {
    /**
     *
     * @param {HTMLElement} main
     * @param {HTMLElement} space
     */
    constructor(main, space, {maxW, maxH}) {
        this.main = main;
        this.space = space;
        this.status = "end";
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

    start() {
        this.status = "start";
        this.triggerEvent("start", {});
    }

    stop() {
        this.status = "stop";
        this.triggerEvent("stop", {});
    }

    end() {
        this.status = "end";
        this.triggerEvent("end", {});
    }

    /**
     * 随机生成一个索引值
     *
     * @param {number} maxLength
     * @returns {number}
     */
    random_index(maxLength) {
        return Math.floor(Math.random() * maxLength);
    }

    /**
     * 随机生成一个可视范围内的坐标
     *
     * @returns {{x: number, y: number}}
     */
    random_coordinate() {
        const x = Math.floor(Math.random() * (maxW - 100) + 10);
        const y = Math.floor(Math.random() * (maxH - 100) + 10);
        return {x, y};
    }

    /**
     * 创建一个星球
     */
    create_planet(pics) {
        const planet = document.createElement("img");
        planet.classList.add("planet");
        planet.src = pics[this.random_index(pics.length)];
        planet.style.top = this.random_coordinate().y + "px";
        planet.style.left = this.random_coordinate().x + "px";
        this.space.append(planet);
    }

    /**
     * 创建一个陨石
     */
    create_asteroid(pics) {
        const asteroid = document.createElement("img");
        asteroid.classList.add("asteroid");
        asteroid.src = pics[this.random_index(pics.length)];
        asteroid.style.top = this.random_coordinate().y + "px";
        asteroid.style.left = this.random_coordinate().x + "px";
        this.space.append(asteroid);
    }

    /**
     * 创建敌人
     */
    create_enemy() {
        const enemy = document.createElement("img");
        enemy.classList.add("enemy");
        enemy.src = "./assets/images/enemy.png";
        enemy.style.top = this.random_coordinate().y + "px";
        enemy.style.left = this.random_coordinate().x + "px";
        this.space.append(enemy);
    }

    /**
     * 创建·燃料
     */
    create_fuel() {
        const fuel = document.createElement("img");
        fuel.classList.add("fuel");
        fuel.src = "./assets/images/fuel.png";
        fuel.style.top = this.random_coordinate().y + "px";
        fuel.style.left = this.random_coordinate().x + "px";
        this.space.append(fuel)
    }
}
