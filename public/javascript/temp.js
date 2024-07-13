
class Pair {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    first() {
        return this.x
    }
    second() {
        return this.y
    }
}

class Queue {
    constructor() {
        this.queue = [];
        this.front = 0;
        this.rear = -1;
    }

    push(item) {
        this.queue[++this.rear] = item
    }

    getFront() {
        if (this.empty()) {
            return
        }
        const item = this.queue[this.front]
        return item
    }

    pop() {
        if (this.empty()) {
            return;
        }
        const item = this.queue[this.front]
        delete this.queue[this.front++]
        return item
    }

    size() {
        return this.rear - this.front + 1
    }

    empty() {
        return this.size() === 0
    }
}

const speedSelector = {
    "fast": 0,
    "average": 50,
    "slow": 200
}

const getNeighbours = function (node) {

    let up = new Pair(node.first() - 1, node.second())
    let down = new Pair(node.first() + 1, node.second())
    let right = new Pair(node.first(), node.second() + 1)
    let left = new Pair(node.first(), node.second() - 1)

    const upId = stringfyBlock(up)
    const upElement = document.getElementById(upId)

    const downId = stringfyBlock(down)
    const downElement = document.getElementById(downId)

    const rightId = stringfyBlock(right)
    const rightElement = document.getElementById(rightId)

    const leftId = stringfyBlock(left)
    const leftElement = document.getElementById(leftId)


    if (node.first() - 1 <= 0 || upElement.classList.contains("wall")) up = null
    if (node.first() + 1 >= 19 || downElement.classList.contains("wall")) down = null
    if (node.second() + 1 >= 50 || rightElement.classList.contains("wall")) right = null
    if (node.second() - 1 <= 0 || leftElement.classList.contains("wall")) left = null

    return returnObject = { up, down, right, left }

}

const getNeighboursWithMaze = function (node) {
    const nodeId = stringfyBlock(node)
    const nodeElement = document.getElementById(nodeId)

    let up = null
    let down = null
    let right = null
    let left = null


    if (nodeElement.style.borderTop) {
        up = new Pair(node.first() - 1, node.second())
        const upId = stringfyBlock(up)
        const upElement = document.getElementById(upId)
        if (upElement.classList.contains("wall")) {
            up = null
        }
    }

    if (nodeElement.style.borderBottom) {
        down = new Pair(node.first() + 1, node.second())
        const downId = stringfyBlock(down)
        const downElement = document.getElementById(downId)
        if (downElement.classList.contains("wall")) {
            down = null
        }
    }

    if (nodeElement.style.borderRight) {
        right = new Pair(node.first(), node.second() + 1)
        const rightId = stringfyBlock(right)
        const rightElement = document.getElementById(rightId)
        if (rightElement.classList.contains("wall")) {
            right = null
        }
    }

    if (nodeElement.style.borderLeft) {
        left = new Pair(node.first(), node.second() - 1)
        const leftId = stringfyBlock(left)
        const leftElement = document.getElementById(leftId)
        if (leftElement.classList.contains("wall")) {
            left = null
        }
    }

    return returnObject = { up, down, right, left }

}

const stringfyBlock = function (block) {
    return `${block.first()}-${block.second()}`
}

const drawPath = function (destinationBlock, parents) {

    let currentNodeId = stringfyBlock(destinationBlock)
    while (currentNodeId) {
        let node = document.getElementById(currentNodeId)
        node.classList.add("path")
        currentNodeId = parents[currentNodeId]
    }
}

const drawPathMaze = function (destinationBlock, parents) {
    let currentNodeId = stringfyBlock(destinationBlock)
    let currentParent


}

const createBlock = function (element) {
    const coordinatesArray = (element.id).split("-")
    const xCoordinate = parseInt(coordinatesArray[0])
    const yCoordinate = parseInt(coordinatesArray[1])
    return new Pair(xCoordinate, yCoordinate)

}

const getMostPromisingNode = function (distances, visited) {
    let promisingNodeDistance = Number.MAX_SAFE_INTEGER
    let promisingNode = null
    for (let node in distances) {
        if (!visited[node] && distances[node] <= promisingNodeDistance) {
            promisingNode = node
            promisingNodeDistance = distances[node]
        }
    }
    return promisingNode
}

const dijkstra = async function (startCell, destinationCell, speed = "fast") {
    let currentBlock = createBlock(startCell);
    const destinationBlock = createBlock(destinationCell);
    let currentNodeId = stringfyBlock(currentBlock);
    const visited = {};
    let nextInLineSize = 1;
    const distances = {};
    const parents = {};
    parents[currentNodeId] = null;
    distances[currentNodeId] = 0;

    while (nextInLineSize) {
        let neighbours = getNeighbours(currentBlock);
        for (let neighbourDirection in neighbours) {
            if (neighbours[neighbourDirection]) {
                let neighbourNodeBlock = neighbours[neighbourDirection];
                let neighbourNodeId = stringfyBlock(neighbourNodeBlock);
                let neighbour = document.getElementById(neighbourNodeId);

                if (!visited[neighbourNodeId]) {
                    const weightElement = neighbour.querySelector(".weight");
                    if (weightElement) {
                        const weight = parseInt(weightElement.innerText);
                        if (!distances[neighbourNodeId] || distances[neighbourNodeId] > distances[currentNodeId] + weight) {
                            distances[neighbourNodeId] = distances[currentNodeId] + weight;
                            parents[neighbourNodeId] = currentNodeId;
                            neighbour.classList.remove("unvisited");
                            await new Promise(resolve => setTimeout(resolve, speedSelector[speed]))
                            neighbour.classList.add("visited");
                            ++nextInLineSize;
                        }
                    }
                }
            }
        }
        visited[currentNodeId] = true;
        currentNodeId = getMostPromisingNode(distances, visited);
        if (!currentNodeId) break

        let node = document.getElementById(currentNodeId);
        currentBlock = createBlock(node);
        if (currentBlock.first() === destinationBlock.first() && currentBlock.second() === destinationBlock.second()) {
            break;
        }
        --nextInLineSize;
    }
    drawPath(destinationBlock, parents);
};

const createHeuristic = function (destinationNodeBlock, startCell, destinationCell) {
    const heuristic = {}
    const grid = document.querySelectorAll("td")

    //Good Heuristic
    // const distances = reverseDijkstra(startCell, destinationCell)
    for (let cell of grid) {
        //Good Heuristic 
        // heuristic[cell.id] = distances[cell.id]


        // For Manhatten Heuristic
        const cellBlock = createBlock(cell)
        const estimatedDistace = Math.abs(cellBlock.first() - destinationNodeBlock.first()) + Math.abs(cellBlock.second() - destinationNodeBlock.second())
        heuristic[cell.id] = estimatedDistace
    }

    return heuristic
}

const reverseDijkstra = function (startCell, destinationCell) {
    const distances = {}
    const visited = {}
    let nextInLine = 1
    const destinationCellId = destinationCell.id
    distances[destinationCell.id] = 0

    destinationCell.querySelector(".weight").innerText = "0"
    startCell.querySelector(".weight").innerText = "0"

    while (nextInLine) {
        currentNodeId = getMostPromisingNode(distances, visited)
        if (!currentNodeId) break
        visited[currentNodeId] = true
        let currentElement = document.getElementById(currentNodeId)
        let currentBlock = createBlock(currentElement)

        let neighbours = getNeighbours(currentBlock)
        for (let neighbourDirection in neighbours) {
            let neighbour = neighbours[neighbourDirection]
            if (neighbour) {
                let neighbourId = stringfyBlock(neighbour)
                let neighbourElement = document.getElementById(neighbourId)
                let cellWeight = parseInt(neighbourElement.querySelector(".weight").innerText)
                if (!visited[neighbourId] || distances[neighbourId] > distances[currentNodeId] + cellWeight) {
                    distances[neighbourId] = distances[currentNodeId] + cellWeight
                    ++nextInLine
                }

            }
        }
        --nextInLine
    }

    for (let nodeId in distances) {
        if (nodeId !== destinationCellId)
            distances[nodeId] -= 1
    }

    return distances
}

const getMostPromisingNodeHeuristically = function (distancesAndAstartScore, visited) {
    let promisingNodeAstarScore = Number.MAX_SAFE_INTEGER
    let promisingNode = null
    for (let node in distancesAndAstartScore) {
        if (distancesAndAstartScore[node].aStarScore < promisingNodeAstarScore && !visited[node]) {
            promisingNodeAstarScore = distancesAndAstartScore[node].aStarScore
            promisingNode = node
        }
    }
    return promisingNode
}

const aStar = async function (startCell, destinationCell, speed = "fast") {
    const startNodeBlock = createBlock(startCell);
    const destinationNodeBlock = createBlock(destinationCell);
    const startNodeId = stringfyBlock(startNodeBlock);
    const destinationNodeId = stringfyBlock(destinationNodeBlock)

    const heuristic = createHeuristic(destinationNodeBlock, startCell, destinationCell);

    const distancesAndAstarScore = {};
    distancesAndAstarScore[startNodeId] = {
        distance: 0,
        aStarScore: heuristic[startNodeId]
    };

    const parents = {};
    parents[startNodeId] = null;

    const visited = {};

    let nextInLine = 1;

    while (nextInLine) {
        const currentNodeId = getMostPromisingNodeHeuristically(distancesAndAstarScore, visited);
        if (!currentNodeId) break;

        const currentNodeBlock = createBlock(document.getElementById(currentNodeId));
        const nodeElement = document.getElementById(currentNodeId);
        nodeElement.classList.remove("unvisited");
        await new Promise(resolve => setTimeout(resolve, speedSelector[speed]));
        nodeElement.classList.add("visited");

        if (currentNodeId === destinationNodeId) {
            break;
        }

        visited[currentNodeId] = true;

        const neighbours = getNeighbours(currentNodeBlock);

        for (let neighbourDirection in neighbours) {
            const neighbour = neighbours[neighbourDirection];
            if (neighbour) {
                const neighbourId = stringfyBlock(neighbour);
                if (!visited[neighbourId]) {
                    const weight = parseInt(document.getElementById(neighbourId).querySelector(".weight").innerText);
                    const newDistance = distancesAndAstarScore[currentNodeId].distance + weight;
                    const newAStarScore = newDistance + heuristic[neighbourId];

                    if (!distancesAndAstarScore[neighbourId] || newAStarScore < distancesAndAstarScore[neighbourId].aStarScore) {
                        distancesAndAstarScore[neighbourId] = { distance: newDistance, aStarScore: newAStarScore };
                        parents[neighbourId] = currentNodeId;
                        nextInLine++;
                    }
                }
            }
        }

        --nextInLine;
    }

    drawPath(destinationNodeBlock, parents);
};


const getMostPromisingGreedliy = function (promisingNodes, visited, heuristic) {
    let promisingHeuristic = Number.MAX_SAFE_INTEGER;
    let promisingNode = null;
    for (let node in promisingNodes) {
        if (!visited[node] && promisingHeuristic > promisingNodes[node]) {
            promisingHeuristic = promisingNodes[node];
            promisingNode = node;
        }
    }
    return promisingNode;
};


const greedbyBestFirstSearch = async function (startCell, destinationCell, speed = "fast") {
    let currentNode = startCell
    let currentNodeBlock = createBlock(currentNode)
    let currentNodeId = stringfyBlock(currentNodeBlock)
    const destinationBlock = createBlock(destinationCell)

    const heuristic = createHeuristic(destinationBlock, startCell, destinationCell);

    const visited = {}
    const parents = {}
    parents[currentNodeId] = null

    const promisingNodes = {}
    promisingNodes[currentNodeId] = heuristic[currentNodeId]
    let nextInLine = 1
    while (nextInLine) {
        currentNodeId = getMostPromisingGreedliy(promisingNodes, visited, heuristic)
        if (!currentNodeId)
            break
        const currentElement = document.getElementById(currentNodeId)
        const currentBlock = createBlock(currentElement)

        if (currentBlock.first() === destinationBlock.first() && currentBlock.second() === destinationBlock.second()) {
            break;
        }


        currentElement.classList.remove("unvisited")
        await new Promise(resolve => setTimeout(resolve, speedSelector[speed]))
        currentElement.classList.add("visited")
        visited[currentNodeId] = true

        let neighbours = getNeighbours(currentBlock)

        for (let neighbourDirection in neighbours) {
            let neighbour = neighbours[neighbourDirection]
            if (neighbour) {
                let neighbourId = stringfyBlock(neighbour)
                if (!visited[neighbourId]) {
                    promisingNodes[neighbourId] = heuristic[neighbourId]
                    parents[neighbourId] = currentNodeId
                    ++nextInLine
                }
            }
        }


        --nextInLine
    }
    drawPath(destinationBlock, parents)
}


const bidirectionalSearch = async function (startCell, destinationCell, speed = "fast") {
    let startBlock = createBlock(startCell)
    let destinationBlock = createBlock(destinationCell)
    let currentRightBlock = createBlock(startCell)
    let currentLeftBlock = createBlock(destinationCell)
    let currentRightId = stringfyBlock(currentRightBlock)
    let currentLeftId = stringfyBlock(currentLeftBlock)

    let neighboursRight
    let neighboursLeft

    const parentsLeft = {}
    const parentsRight = {}
    parentsLeft[currentLeftId] = null
    parentsRight[currentRightId] = null

    const visitedLeft = {}
    visitedLeft[currentLeftId] = true
    const visitedRight = {}
    visitedRight[currentRightId] = true

    const nextInLineRight = new Queue()
    nextInLineRight.push(currentRightBlock)
    const nextInLineLeft = new Queue()
    nextInLineLeft.push(currentLeftBlock)

    while (!nextInLineLeft.empty() && !nextInLineRight.empty()) {

        currentLeftBlock = nextInLineLeft.getFront()
        currentRightBlock = nextInLineRight.getFront()

        currentLeftId = stringfyBlock(currentLeftBlock)
        currentRightId = stringfyBlock(currentRightBlock)

        let currentLeftElement = document.getElementById(currentLeftId)
        let currentRightElement = document.getElementById(currentRightId)

        if (currentLeftElement.classList.contains("visited-right")) {
            drawPath(currentLeftBlock, parentsLeft)
            drawPath(currentLeftBlock, parentsRight)
            return
        } else if (currentRightElement.classList.contains("visited-left")) {
            drawPath(currentRightBlock, parentsLeft)
            drawPath(currentRightBlock, parentsRight)
            return
        }

        await new Promise(resolve => setTimeout(resolve, speedSelector[speed]))
        currentLeftElement.classList.remove("unvisited")
        currentLeftElement.classList.add("visited-left")
        currentRightElement.classList.remove("unvisited")
        currentRightElement.classList.add("visited-right")



        neighboursRight = getNeighbours(currentRightBlock)
        neighboursLeft = getNeighbours(currentLeftBlock)


        for (neighbourDirection in neighboursLeft) {

            let neighbour = neighboursLeft[neighbourDirection]
            if (neighbour) {
                let neighbourId = stringfyBlock(neighbour)
                if (!visitedLeft[neighbourId]) {
                    visitedLeft[neighbourId] = true
                    parentsLeft[neighbourId] = currentLeftId
                    nextInLineLeft.push(neighbour)
                }
            }
        }

        for (neighbourDirection in neighboursRight) {

            let neighbour = neighboursRight[neighbourDirection]
            if (neighbour) {
                let neighbourId = stringfyBlock(neighbour)
                if (!visitedRight[neighbourId]) {
                    visitedRight[neighbourId] = true
                    parentsRight[neighbourId] = currentRightId
                    nextInLineRight.push(neighbour)
                }
            }
        }
        nextInLineLeft.pop()
        nextInLineRight.pop()
    }


}

const DFShelper = async function (currentBlock, destinationBlock, currentParentId, visited, parents, found, speed) {
    if (found.value) return
    const currentNodeId = stringfyBlock(currentBlock);
    visited[currentNodeId] = true;
    parents[currentNodeId] = currentParentId

    if (currentBlock.first() === destinationBlock.first() && currentBlock.second() === destinationBlock.second()) {
        found.value = true
        return;
    }

    const currentNode = document.getElementById(currentNodeId);
    if (currentNode) {
        currentNode.classList.remove("unvisited");
        await new Promise(resolve => setTimeout(resolve, speedSelector[speed]))
        currentNode.classList.add("visited");
    }

    const neighbours = getNeighbours(currentBlock);


    let directions = ["up", "down", "left", "right"];

    for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
    }


    for (let direction of directions) {
        const nextBlock = neighbours[direction];
        if (nextBlock) {
            const nextNodeId = stringfyBlock(nextBlock);
            if (!visited[nextNodeId]) {
                if (found.value) return
                await DFShelper(nextBlock, destinationBlock, currentNodeId, visited, parents, found, speed);
            }
        }

    }
};

const DFS = async function (startCell, destinationCell, speed = "fast") {
    const startBlock = createBlock(startCell);
    const destinationBlock = createBlock(destinationCell);
    const visited = {};
    const parents = {};
    const currentParent = null;
    const found = { value: false }
    await DFShelper(startBlock, destinationBlock, currentParent, visited, parents, found, speed);
    drawPath(destinationBlock, parents);
};

const DFSMazeHelper = function (currentBlock, visited) {
    const currentId = stringfyBlock(currentBlock);
    if (visited[currentId]) return;
    visited[currentId] = true;

    const neighbours = getNeighbours(currentBlock);
    let directions = ["up", "down", "left", "right"];

    for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
    }
    for (let direction of directions) {
        if (neighbours[direction]) {
            let neighbourBlock = neighbours[direction];
            let neighbourId = stringfyBlock(neighbourBlock)
            let neighbourElement = document.getElementById(neighbourId)
            // await new Promise(resolve => setTimeout(resolve, 0));
            let currentElement = document.getElementById(currentId);

            if (!visited[neighbourId]) {
                if (direction === "up") {
                    currentElement.style.borderTop = "none"
                    neighbourElement.style.borderBottom = "none"
                } else if (direction === "down") {
                    currentElement.style.borderBottom = "none"
                    neighbourElement.style.borderTop = "none"
                } else if (direction === "right") {
                    currentElement.style.borderRight = "none"
                    neighbourElement.style.borderLeft = "none"
                }
                else {
                    currentElement.style.borderLeft = "none"
                    neighbourElement.style.borderRight = "none"
                }
            }



            DFSMazeHelper(neighbourBlock, visited);
        }
    }
};

const DFSMaze = function () {
    const startCell = document.getElementById("1-1");
    let startBlock = createBlock(startCell);
    const visited = {};
    DFSMazeHelper(startBlock, visited);

};

const BFShelper = async function (startBlock, destinationBlock, nextInLine, speed) {
    let neibours;
    let visited = {}
    const startNodeID = stringfyBlock(startBlock)
    const destinationNodeID = stringfyBlock(destinationBlock)
    let parents = {}
    parents[startNodeID] = null
    while (!nextInLine.empty()) {
        let currentNode = nextInLine.getFront()
        neibours = getNeighbours(currentNode)
        let currentNodeId = stringfyBlock(currentNode)
        visited[currentNodeId] = true;
        let node = document.getElementById(currentNodeId);
        await new Promise(resolve => setTimeout(resolve, speedSelector[speed]))
        node.classList.add("visited")

        for (let neibourDirection in neibours) {
            let neibourNode = neibours[neibourDirection]
            if (currentNode.first() === destinationBlock.first() && currentNode.second() === destinationBlock.second()) {
                drawPath(destinationBlock, parents)
                return
            }
            if (neibourNode) {
                let neibourID = stringfyBlock(neibourNode)
                if (!visited[neibourID]) {
                    nextInLine.push(neibourNode)
                    visited[neibourID] = true
                    parents[neibourID] = currentNodeId
                }
            }

        }
        nextInLine.pop();
    }
};

const BFS = async function (startCell, destinationCell, speed = "fast") {
    const startBlock = createBlock(startCell)
    const destinationBlock = createBlock(destinationCell)
    const nextInLine = new Queue()
    nextInLine.push(startBlock)
    await BFShelper(startBlock, destinationBlock, nextInLine, speed)
}

const recursiveDivision = function () {
    console.log("recusive division")

}

const random = function () {
    console.log("random")

}

const stair = function () {

}

const noMaze = function () { }

const algorithmFunction = {
    "dijkstra": dijkstra,
    "astar": aStar,
    "bds": bidirectionalSearch,
    "dfs": DFS,
    "bfs": BFS,
    "gbfs": greedbyBestFirstSearch
}

const mazeFunction = {
    "rd": recursiveDivision,
    "random": random,
    "stair": stair,
    "no": noMaze
}


