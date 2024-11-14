const game = new Game()

window.addEventListener("keydown", (e) => {
    const {code} = e;
    if (game.status !== "start") return;

    if (code.startsWith("Arrow")) {
        game.player.move(code.split("Arrow")[1].toLowerCase())
    }
})

window.addEventListener("keyup", (e) => {
    const {code} = e;
    if (game.status === "over") return;

    if (code.startsWith("Arrow")) {
        game.player.stop(code.split("Arrow")[1].toLowerCase())
    }
    if (code === "Space") {
        new PlayerBullet(game.player.x + 100, game.player.y + 25)
    }

    if (code === "KeyP") {
        if (game.status === "start") {
            game.pause()
        } else if (game.status === "pause") {
            game.continue()
        }
    }
})

$("#start").click(() => {
    $(".frame").hide()
    $(".frame .home").hide()
    $(".game").show()
    game.start()
    playerMove()
})

$("#submit-name").click(() => {
    if ($("#input-name").val() === "") {
        alert("Please input your name!")
    } else {
        const rankData = JSON.parse(localStorage.getItem("rank") ?? "[]");
        const newRank = {
            name: $("#input-name").val(),
            time: game.gameData.time,
            score: game.gameData.score
        };
        const updatedRankData = [...rankData, newRank];
        localStorage.setItem("rank", JSON.stringify(updatedRankData));

        $(".frame .over .submit").css("display", "none")
        $(".frame .over .rank").css("display", "flex")

        // 根据score和time降序排序
        updatedRankData.sort((a, b) => b.score - a.score || b.time - a.time);
        // 插入排序数据
        let i = 1;
        let rankHtml;
        updatedRankData.forEach((item) => {
            rankHtml += `<tr><th>${i++}</th><th>${item.name}</th><th>${item.time}</th><th>${item.score}</th></tr>`
        })
        document.querySelector(".rank-list-body").innerHTML = rankHtml.slice(9)
    }
})

$("#continue-game").click(() => {
    $(".frame .over .submit").css("display", "none")
    $(".frame .over .rank").css("display", "none")
    $(".frame .over").css("display", "none")
    $(".frame").show()
    $(".frame .home").show()
})

$(".sound img").click(() => {
    game.mute()
})

$(".fd").click(() => {
    game.fontSize("reduce")
})

$(".fp").click(() => {
    game.fontSize("add")
})

$(".status").click(() => {
    if (game.status === "start") {
        game.pause()
    } else if (game.status === "pause") {
        game.continue()
    }
})

const playerMove = () => {
    let dir = game.player.direction;
    dir.left && (game.player.x -= game.player.speed);
    dir.right && (game.player.x += game.player.speed)
    dir.up && (game.player.y -= game.player.speed)
    dir.down && (game.player.y += game.player.speed)

    game.player.dom[0].style.left = game.player.x + "px";
    game.player.dom[0].style.top = game.player.y + "px";
    requestAnimationFrame(playerMove)

    $.each(game.npc, function (index, _value) {
        if (_value.dom.is(".npc") && game.player.impact(_value)) {
            if (this.dom.is('.enemy')) {
                game.gameData.score += 5;
                game.gameData.fuel -= 15;
                this.die();
            } else if (this.dom.is('.friend')) {
                game.gameData.score -= 10;
                game.gameData.fuel -= 15;
                this.die();
            } else if (this.dom.is('.asteroid')) {
                game.gameData.fuel -= 15;
                game.gameData.score += 10;
                this.die();
            } else if (this.dom.is('.fuel')) {
                game.gameData.fuel += 15;
                this.remove();
            } else if (this.dom.is(".enemy-bullet")) {
                game.gameData.fuel -= 15;
                this.remove();
            }
        }
    });
}