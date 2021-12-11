class Render {
    constructor(id, canvas) {
        this.currentPlayerId = id
        this.context = canvas.getContext('2d')
        this.size = 10
    }

    renderPlayers(players) {
        for (let [id, player] of Object.entries(players)) {
            let color = id === this.currentPlayerId ? '#fff' : '#aaa' 
            this.context.fillStyle = color

            for (let pixel of player.pixels)
                this.context.fillRect(pixel[0], pixel[1], this.size, this.size)
        }
    }

    renderTargets(targets) {
        this.context.fillStyle = '#555'
        for (let [id, target] of Object.entries(targets)) 
            this.context.fillRect(target.position[0], target.position[1], this.size, this.size)
    }

    gameState({ players, targets }) {
        this.context.clearRect(0, 0, 800, 600)
        this.renderTargets(targets)
        this.renderPlayers(players)
    }
}

export { Render }