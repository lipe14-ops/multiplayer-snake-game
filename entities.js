class Player {
    constructor(id, x, y) {
        this.id = id
        this.head = [x, y]
        this.direction = [0, 0]
        this.pixels = []
        this.length = 1
    }
}

class Target {
    constructor(id, x, y) {
        this.id = id
        this.position = [x, y]
    }
}

export { Target, Player }