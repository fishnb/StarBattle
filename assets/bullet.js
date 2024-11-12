class Bullet {
    constructor() {
        this.queue = []; // 碰撞检测队列
        this.intervalId = null;
    }


    // 初始化队列
    initQueue() {
        this.queue = [];
        this.startProcessingQueue();
    }

    startProcessingQueue() {
        if (this.intervalId) return;

        this.intervalId = setInterval(() => {
            if (game.status === "end") return;
            if (game.status === "stop") this.clearIntervals()
            this.processQueue();
        }, 10);
    }

    /**
     * 队列任务处理
     */
    processQueue() {
        this.queue.forEach((item, index) => {
            if (item.type === "shoot") {
                this.handleShoot(item.data);
                this.queue.splice(index, 1);
            } else if (item.type === "listen") {
                this.handleListen(item);
            }
        });
    }

    /**
     * 处理射击任务
     * @param {Object} data - 射击数据
     */
    handleShoot(data) {
        const bullet = document.createElement("img");
        bullet.classList.add("bullet", `${data.name}-bullet`);
        bullet.src = "./assets/images/bullet.png";
        bullet.style.width = "16px";
        bullet.style.height = "8px";
        bullet.style.transform = "rotate(180deg)";
        bullet.style.top = `${data.y}px`;
        bullet.style.left = `${data.x}px`;

        bullet.timeoutId = setTimeout(() => {
            if (bullet.parentNode) {
                bullet.remove();
                this.queue = this.queue.filter(item => item !== item);
            }
        }, 10000);
        this.addTask("listen", {obj: bullet});
        document.querySelector(".space-elements").append(bullet);
    }

    /**
     * 处理监听任务
     * @param {Object} item - 监听任务
     */
    handleListen(item) {
        const timer = setInterval(() => {
            const spaceElements = document.querySelector(".space-elements");
            const doms = Array.from(spaceElements.children);

            for (let i = 0; i < doms.length; i++) {
                const child = doms[i];
                if (child.className.includes("asteroid") || child.className.includes("enemy")) {
                    if (this.impact(child, item.data.obj)) {

                        if (child.className.includes("enemy")) {
                            player.addScore(5)
                        }

                        if (child.className.includes("asteroid")) {
                            if (child.className.includes("shoot")) {
                                player.addScore(10)
                                child.remove();
                            } else {
                                child.classList.add("shoot")
                            }

                        }
                        item.data.obj.remove();
                        clearInterval(timer);
                        clearTimeout(item.data.obj.timeoutId);
                        this.queue = this.queue.filter(item => item !== item);
                        break;
                    }
                }
            }
        }, 10);
    }

    /**
     * 添加任务
     * @param {string} type - 任务类型
     * @param {Object} data - 任务数据
     */
    addTask(type, data) {
        this.queue.push({type, data});
    }

    /**
     * 射击
     * @param {number} x - 子弹的 x 坐标
     * @param {number} y - 子弹的 y 坐标
     * @param {string} name - 子弹名称
     */
    shoot(x, y, name) {
        this.addTask("shoot", {x, y, name});
    }

    /**
     * 检测碰撞
     * @param {HTMLElement} bullet - 子弹元素
     * @param {HTMLElement} obj - 对象元素
     * @returns {boolean} - 是否发生碰撞
     */
    impact(bullet, obj) {
        const itemRect = obj.getBoundingClientRect();
        const thisRect = bullet.getBoundingClientRect();

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

    /**
     * 清除定时器
     */
    clearIntervals() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }
}
