class Game {
    constructor() {
        this.dimensions = [800, 600]
        this.size = 10        
        this.state = {
            players: {},
            targets: {}
        }
    }

    addPlayer({ id, ...rest }) {
        this.state.players[id] = rest
    }

    removePlayer({ id }) {
        delete this.state.players[id]
    }

    addTarget({ id, ...rest }) {
        this.state.targets[id] = rest
    }

    removeTarget({ id }) {
        delete this.state.targets[id]
    }

    setPlayerDirection({ id, direction }) {
        let player = this.state.players[id]

        const size = this.size
        const movements = {
            ArrowUp() {
                if (!player.direction[1])
                    player.direction = [0, -size]
            },
            ArrowDown() {
                if (!player.direction[1])
                    player.direction = [0, size]
            },
            ArrowLeft() {
                if (!player.direction[0])
                    player.direction = [-size, 0]
            },
            ArrowRight() {
                if (!player.direction[0])
                    player.direction = [size, 0]
            }
        }

        const move = movements[direction]

        move && move()
    }

    moveAllPlayers() {
        for (let player of Object.values(this.state.players)) {
            player.pixels.push([...player.head])

            for (let index in player.head)
                player.head[index] += player.direction[index]

            if (player.pixels.length > player.length)
                player.pixels.shift()
        }
    }

    detectPlayersTargetsCollision() {
        let collisions = []

        for (let [targetId, target] of Object.entries(this.state.targets)) {
            for (let [playerId, player] of Object.entries(this.state.players)) {
                if (player.pixels.map(item => JSON.stringify(item)).includes(JSON.stringify(target.position)))
                    collisions.push({player: playerId, target: targetId})
            }
        }

        return collisions
    }

    detectPlayersBordersCollision() {
        for (let player of Object.values(this.state.players)) {
            for (let index in player.head) {
                if (player.head[index] > this.dimensions[index])
                    player.head[index] -= this.dimensions[index]
 
                if (player.head[index] < 0)
                    player.head[index] += this.dimensions[index]
            }
        }
    }

    detectPlayersPlayersCollision() {
        let collisions = []

        for (let [currentPlayerId, currentPlayer] of Object.entries(this.state.players)) {
            for (let [playerId, player] of Object.entries(this.state.players)) {
                if (player.pixels.map(item => JSON.stringify(item)).includes(JSON.stringify(currentPlayer.head)))
                    collisions.push({winner: playerId, looser: currentPlayerId})
            }
        }

        return collisions
    }

    setScore({ id, score }) {
        const player = this.state.players[id]
        player.length += score
    }
}

export { Game }