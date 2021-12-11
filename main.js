import express from 'express';
import http from 'http'
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'socket.io'
import { Game } from './game.js'
import { Target, Player } from './entities.js'

const app = express()
const server = http.createServer(app)
const sockets = new Server(server)
const game = new Game()

function randomNumberGrided(min, max, grid){
    return Math.round((Math.random() * (max - min) + min) / grid) * grid;
}                                              

function generateTargets(targetsNumber) {
    for (let i = 0; i < targetsNumber; i++) {
        game.addTarget(new Target(
            uuidv4(), 
            randomNumberGrided(0, game.dimensions[0], game.size), 
            randomNumberGrided(0, game.dimensions[1], game.size)
            )
        )
    }
}

app.use(express.static('public'))

generateTargets(200)

sockets.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`> new connection!!! id: ${playerId}`)

    game.addPlayer(new Player(
        playerId, 
        randomNumberGrided(0, game.dimensions[0], game.size), 
        randomNumberGrided(0, game.dimensions[1], game.size)
        )
    )

    socket.on('move-player', (event) => {
        game.setPlayerDirection(event)
    })

    socket.on('disconnect', () => {
        console.log(`> player disconnected!!! id: ${socket.id}`)
        game.removePlayer({ id: socket.id })
    })
})

setInterval(() => {
    game.moveAllPlayers()
    game.detectPlayersBordersCollision()

    const playerTargetCollision = game.detectPlayersTargetsCollision()
    const playerPlayerCollision = game.detectPlayersPlayersCollision()

    if (playerTargetCollision) {
        for (let collision of playerTargetCollision) {
            let player = game.state.players[collision.player]
            game.removeTarget({id: collision.target})
            game.setScore({id: collision.player, score: 1})
            generateTargets(1)
        }
    }

    if (playerPlayerCollision) {
        for (let collision of playerPlayerCollision) {
            const looser = game.state.players[collision.looser]
            game.setScore({id: collision.winner, score: looser.length})

            game.addPlayer(new Player(
                collision.looser, 
                randomNumberGrided(0, game.dimensions[0], game.size), 
                randomNumberGrided(0, game.dimensions[1], game.size)
                )
            )
        }
    }

    sockets.emit('set-state', game.state)
}, 100);

server.listen(5000, () => {
    console.log('> server is listening on port 5000.')
})