
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

class MinPriorityQueue {
    constructor() {
        this.heap = [];
        this.map = {}; // To keep track of indices of items in the heap
    }

    // Helper function to swap two elements in the heap
    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
        this.map[this.heap[index1].id] = index1;
        this.map[this.heap[index2].id] = index2;
    }

    // Helper function to heapify up
    heapifyUp(index) {
        let currentIndex = index;
        while (currentIndex > 0) {
            const parentIndex = Math.floor((currentIndex - 1) / 2);
            if (this.heap[currentIndex].distance < this.heap[parentIndex].distance) {
                this.swap(currentIndex, parentIndex);
                currentIndex = parentIndex;
            } else {
                break;
            }
        }
    }

    // Helper function to heapify down
    heapifyDown(index) {
        let currentIndex = index;
        const heapSize = this.heap.length;
        while (true) {
            const leftChildIndex = 2 * currentIndex + 1;
            const rightChildIndex = 2 * currentIndex + 2;
            let smallestIndex = currentIndex;

            if (leftChildIndex < heapSize && this.heap[leftChildIndex].distance < this.heap[smallestIndex].distance) {
                smallestIndex = leftChildIndex;
            }
            if (rightChildIndex < heapSize && this.heap[rightChildIndex].distance < this.heap[smallestIndex].distance) {
                smallestIndex = rightChildIndex;
            }

            if (smallestIndex !== currentIndex) {
                this.swap(currentIndex, smallestIndex);
                currentIndex = smallestIndex;
            } else {
                break;
            }
        }
    }

    // Insert a new element into the priority queue
    insert(id, distance) {
        const newNode = { id, distance };
        this.heap.push(newNode);
        const currentIndex = this.heap.length - 1;
        this.map[id] = currentIndex;
        this.heapifyUp(currentIndex);
    }

    // Extract the minimum element from the priority queue
    extractMin() {
        if (this.heap.length === 0) {
            return null;
        }
        const minNode = this.heap[0];
        const lastNode = this.heap.pop();
        delete this.map[minNode.id];
        if (this.heap.length > 0) {
            this.heap[0] = lastNode;
            this.map[lastNode.id] = 0;
            this.heapifyDown(0);
        }
        return minNode;
    }

    // Update the distance of an existing element in the priority queue
    updateDistance(id, newDistance) {
        if (!(id in this.map)) {
            throw new Error(`Node with id ${id} does not exist in the priority queue`);
        }
        const index = this.map[id];
        const currentNode = this.heap[index];
        if (newDistance < currentNode.distance) {
            currentNode.distance = newDistance;
            this.heapifyUp(index);
        } else if (newDistance > currentNode.distance) {
            currentNode.distance = newDistance;
            this.heapifyDown(index);
        }
    }

    // Check if the priority queue is empty
    isEmpty() {
        return this.heap.length === 0;
    }
}

const speedSelector = {
    "fast": 0,
    "average": 100,
    "slow": 400
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
    if (node.first() + 1 > rows || downElement.classList.contains("wall")) down = null
    if (node.second() + 1 > columns || rightElement.classList.contains("wall")) right = null
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

const animateSearch = async function (parents, destinationCell, selectedSpeed, inMaze) {
    killSwitch.isDrawing = true
    let currentNodeId = destinationCell.id
    const path = []
    while (currentNodeId) {
        path.push(currentNodeId)
        currentNodeId = parents[currentNodeId]
    }
    for (let i = path.length - 2; i >= 1; --i) {
        if (killSwitch.killOpration || killSwitch.newOperationInitiated) {
            killSwitch.newOperationInitiated = false
            killSwitch.isDrawing = false
            return
        }
        let currentElement = document.getElementById(path[i])
        let nextElement = document.getElementById(path[i - 1])

        let currentBlock = createBlock(currentElement)
        let nextBlock = createBlock(nextElement)
        let toRemove

        if (currentBlock.first() > nextBlock.first()) {
            currentElement.classList.add("maze-move-up")
            toRemove = "maze-move-up"

        } else if (currentBlock.first() < nextBlock.first()) {
            currentElement.classList.add("maze-move-down")
            toRemove = "maze-move-down"

        } else if (currentBlock.second() > nextBlock.second()) {
            currentElement.classList.add("maze-move-left")
            toRemove = "maze-move-left"

        } else {
            currentElement.classList.add("maze-move-right")
            toRemove = "maze-move-right"

        }

        await new Promise(resolve => setTimeout(resolve, speedSelector[selectedSpeed]))
        currentElement.classList.remove(toRemove)
        if (inMaze) {
            currentElement.classList.add("track")
        }

    }
    killSwitch.isDrawing = false
}

const drawPath = async function (noPath, destinationBlock, parents) {

    const pathArray = []
    const destinationNodeId = stringfyBlock(destinationBlock)
    if (noPath) {
        displayToast("No Path between start and destiantion")
        return
    }
    const destinationCell = document.getElementById(destinationNodeId)
    let currentNodeId = stringfyBlock(destinationBlock)
    while (currentNodeId) {
        const currentNodeElement = document.getElementById(currentNodeId)
        pathArray.push(currentNodeElement)
        currentNodeId = parents[currentNodeId]
    }
    let totalPathWeight = 0
    for (let i = pathArray.length - 1; i >= 0; --i) {
        if (killSwitch.killOpration) return
        await new Promise(resolve => setTimeout(resolve, 0))
        pathArray[i].classList.add("path")
        const weightElement = pathArray[i].querySelector(".weight");
        const weight = parseInt(weightElement.innerText);

        if (i === pathArray.length - 1 || i === 0)
            continue

        totalPathWeight += weight

    }
    console.log(totalPathWeight)
    const inMaze = false
    animateSearch(parents, destinationCell, "average", inMaze)

}

const BFSMazeHelper = function (startBlock, destinationBlock, nextInLine) {
    let neibours;
    let visited = {}
    const startNodeID = stringfyBlock(startBlock)
    const destinationNodeID = stringfyBlock(destinationBlock)
    let parents = {}
    parents[startNodeID] = null
    while (!nextInLine.empty()) {
        if (killSwitch.killOpration) return

        let currentNode = nextInLine.getFront()
        neibours = getNeighboursWithMaze(currentNode);

        let currentNodeId = stringfyBlock(currentNode)
        visited[currentNodeId] = true;


        for (let neibourDirection in neibours) {
            let neibourNode = neibours[neibourDirection]
            if (currentNode.first() === destinationBlock.first() && currentNode.second() === destinationBlock.second()) {
                return parents
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

const BFSMaze = function (startCell, destinationCell) {
    const startBlock = createBlock(startCell)
    const destinationBlock = createBlock(destinationCell)
    const nextInLine = new Queue()
    nextInLine.push(startBlock)

    return BFSMazeHelper(startBlock, destinationBlock, nextInLine)
}

const solveMaze = async function (startCell, destinationCell, selectedSpeed = "average") {
    let parents = BFSMaze(startCell, destinationCell)
    const inMaze = true
    const destinationBlock = createBlock(destinationCell)
    const destinationId = stringfyBlock(destinationBlock)
    //
    if (!parents[destinationId]) {
        displayToast("No Path between start and destiantion")
        return
    }

    await animateSearch(parents, destinationCell, selectedSpeed, inMaze)

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

// const dijkstra = async function (startCell, destinationCell, speed = "fast") {
//     let currentBlock = createBlock(startCell);
//     const destinationBlock = createBlock(destinationCell);
//     let currentNodeId = stringfyBlock(currentBlock);
//     const visited = {};
//     let nextInLineSize = 1;
//     const distances = {};
//     const parents = {};
//     parents[currentNodeId] = null;
//     distances[currentNodeId] = 0;

//     while (nextInLineSize) {
//         const currentElement = document.getElementById(currentNodeId)
//         let neighbours = getNeighbours(currentBlock);
//         currentElement.classList.add("visited");
//         await new Promise(resolve => setTimeout(resolve, speedSelector[speed]))
//         currentElement.classList.remove("unvisited");

//         for (let neighbourDirection in neighbours) {
//             if (killSwitch.killOpration) return
//             if (neighbours[neighbourDirection]) {
//                 let neighbourNodeBlock = neighbours[neighbourDirection];
//                 let neighbourNodeId = stringfyBlock(neighbourNodeBlock);
//                 let neighbour = document.getElementById(neighbourNodeId);

//                 if (!visited[neighbourNodeId]) {
//                     const weightElement = neighbour.querySelector(".weight");
//                     const weight = parseInt(weightElement.innerText);
//                     if (!distances[neighbourNodeId] || distances[neighbourNodeId] > distances[currentNodeId] + weight) {
//                         distances[neighbourNodeId] = distances[currentNodeId] + weight;
//                         parents[neighbourNodeId] = currentNodeId;
//                         currentElement.classList.add("visited");
//                         ++nextInLineSize;
//                     }

//                 }
//             }
//         }
//         visited[currentNodeId] = true;
//         currentNodeId = getMostPromisingNode(distances, visited);
//         if (!currentNodeId) break

//         let node = document.getElementById(currentNodeId);
//         currentBlock = createBlock(node);
//         if (currentBlock.first() === destinationBlock.first() && currentBlock.second() === destinationBlock.second()) {
//             break;
//         }
//         --nextInLineSize;
//     }
//     await drawPath(destinationBlock, parents);
// }

const dijkstra = async function (startCell, destinationCell, speed = "fast") {
    const distances = {}
    const visited = {}
    const nextInLine = new MinPriorityQueue()
    const parents = {}
    const destinationBlock = createBlock(destinationCell)

    let currentId = startCell.id
    distances[currentId] = 0
    parents[currentId] = null
    nextInLine.insert(currentId, 0)

    while (!nextInLine.isEmpty()) {
        const next = nextInLine.extractMin()
        currentId = next.id
        if (currentId === destinationCell.id) break

        visited[currentId] = true
        currentElement = document.getElementById(currentId)
        currentElement.classList.add("visited")
        await new Promise(resolve => setTimeout(resolve, speedSelector[speed]))
        currentElement.classList.remove("unvisited")
        let currentBlock = createBlock(currentElement)
        let neighbours = getNeighbours(currentBlock)

        for (let neighbourDirection in neighbours) {
            let neighbourBlock = neighbours[neighbourDirection]

            if (neighbourBlock) {
                let neighbourId = stringfyBlock(neighbourBlock)
                let neighbourElement = document.getElementById(neighbourId)

                if (!visited[neighbourId]) {
                    const weightElement = neighbourElement.querySelector(".weight")
                    const weight = parseInt(weightElement.innerText)

                    if (!distances[neighbourId]) {
                        distances[neighbourId] = distances[currentId] + weight
                        nextInLine.insert(neighbourId, distances[neighbourId])
                        parents[neighbourId] = currentId


                    } else if (distances[neighbourId] > distances[currentId] + weight) {
                        distances[neighbourId] = distances[currentId] + weight
                        nextInLine.updateDistance(neighbourId, distances[neighbourId])
                        parents[neighbourId] = currentId
                    }
                }
            }
        }
    }
    let noPath

    if (!parents[stringfyBlock(destinationBlock)])
        noPath = true

    await drawPath(noPath, destinationBlock, parents);


}

const reverseDijkstra = function (destinationCell) {
    const distances = {}
    const visited = {}

    let currentElement = destinationCell
    let currentBlock = createBlock(currentElement)
    let currentId = stringfyBlock(currentBlock)

    distances[currentId] = 0


    while (currentId) {
        currentElement = document.getElementById(currentId)
        currentBlock = createBlock(currentElement)
        visited[currentId] = true
        let neighbours = getNeighbours(currentBlock)
        for (let neighbourDirection in neighbours) {
            let neighbour = neighbours[neighbourDirection]
            if (neighbour) {
                let neighbourId = stringfyBlock(neighbour)
                let neighbourElement = document.getElementById(neighbourId)
                if (!visited[neighbourId]) {
                    const weightElement = neighbourElement.querySelector(".weight");
                    const weight = parseInt(weightElement.innerText);
                    if (!distances[neighbourId] || distances[neighbourId] > distances[currentId] + weight) {
                        distances[neighbourId] = distances[currentId] + weight
                    }
                }
            }
        }

        currentId = getMostPromisingNode(distances, visited);
    }


    return distances
}


const naiveHeuristic = function (destinationNodeBlock, startCell, destinationCell,) {
    const heuristic = {}
    const grid = document.querySelectorAll("td")

    for (let cell of grid) {
        const cellBlock = createBlock(cell)
        const estimatedDistace = Math.abs(cellBlock.first() - destinationNodeBlock.first()) + Math.abs(cellBlock.second() - destinationNodeBlock.second())
        heuristic[cell.id] = estimatedDistace
    }

    return heuristic
}

const informedHeuristic = function (destinationNodeBlock, startCell, destinationCell,) {
    const heuristic = {}
    const grid = document.querySelectorAll("td")

    const distances = reverseDijkstra(destinationCell,)

    for (let cell of grid) {
        heuristic[cell.id] = Math.floor(distances[cell.id] / 1.27)
    }

    return heuristic
}

const advancedHeuristic = function (destinationNodeBlock, startCell, destinationCell,) {
    const heuristic = {}
    const grid = document.querySelectorAll("td")

    const distances = reverseDijkstra(destinationCell,)

    for (let cell of grid) {
        heuristic[cell.id] = Math.floor(distances[cell.id])

    }

    return heuristic
}

const heuristicFunction = {
    "naive": naiveHeuristic,
    "informed": informedHeuristic,
    "advanced": advancedHeuristic
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

const aStar = async function (startCell, destinationCell, selectedHeuristic = "naive", speed = "fast") {
    const startNodeBlock = createBlock(startCell);
    const destinationNodeBlock = createBlock(destinationCell);
    const startNodeId = stringfyBlock(startNodeBlock);
    const destinationNodeId = stringfyBlock(destinationNodeBlock)

    const heuristic = heuristicFunction[selectedHeuristic](destinationNodeBlock, startCell, destinationCell)

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
        if (killSwitch.killOpration) return
        const currentNodeId = getMostPromisingNodeHeuristically(distancesAndAstarScore, visited);
        if (!currentNodeId) break;
        await new Promise(resolve => setTimeout(resolve, speedSelector[speed]));

        const currentNodeBlock = createBlock(document.getElementById(currentNodeId));
        const nodeElement = document.getElementById(currentNodeId);
        nodeElement.classList.remove("unvisited");
        nodeElement.classList.add("visited");

        visited[currentNodeId] = true;

        let neighbours = getNeighbours(currentNodeBlock);

        for (let neighbourDirection in neighbours) {
            const neighbour = neighbours[neighbourDirection];
            if (neighbour) {
                const neighbourId = stringfyBlock(neighbour);
                if (!visited[neighbourId]) {
                    const weight = parseInt(document.getElementById(neighbourId).querySelector(".weight").innerText);
                    const newDistance = distancesAndAstarScore[currentNodeId].distance + weight;
                    const newAStarScore = newDistance + heuristic[neighbourId];

                    if (!distancesAndAstarScore[neighbourId] || newAStarScore <= distancesAndAstarScore[neighbourId].aStarScore) {
                        distancesAndAstarScore[neighbourId] = { distance: newDistance, aStarScore: newAStarScore };
                        parents[neighbourId] = currentNodeId;
                        nextInLine++;
                    }
                }
            }
        }

        if (currentNodeId === destinationNodeId) {
            break;
        }

        --nextInLine;
    }

    let noPath
    if (!parents[stringfyBlock(destinationNodeBlock)])
        noPath = true

    await drawPath(noPath, destinationNodeBlock, parents, noPath);
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

const greedbyBestFirstSearch = async function (startCell, destinationCell, selectedHeuristic = "naive", speed = "fast") {
    let currentNode = startCell
    let currentNodeBlock = createBlock(currentNode)
    let currentNodeId = stringfyBlock(currentNodeBlock)
    const destinationBlock = createBlock(destinationCell)

    const heuristic = heuristicFunction[selectedHeuristic](destinationBlock, startCell, destinationCell,)

    const visited = {}
    const parents = {}
    parents[currentNodeId] = null

    const promisingNodes = {}
    promisingNodes[currentNodeId] = heuristic[currentNodeId]
    let nextInLine = 1
    while (nextInLine) {
        if (killSwitch.killOpration) return
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

        let neighbours = getNeighbours(currentBlock);


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

    let noPath
    if (!parents[stringfyBlock(destinationBlock)])
        noPath = true

    await drawPath(noPath, destinationBlock, parents)
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
    let noPath

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
        if (killSwitch.killOpration) return
        currentLeftBlock = nextInLineLeft.getFront()
        currentRightBlock = nextInLineRight.getFront()

        currentLeftId = stringfyBlock(currentLeftBlock)
        currentRightId = stringfyBlock(currentRightBlock)

        let currentLeftElement = document.getElementById(currentLeftId)
        let currentRightElement = document.getElementById(currentRightId)

        if (currentLeftElement.classList.contains("visited-right")) {
            await drawPath(noPath, currentLeftBlock, parentsLeft)
            await drawPath(noPath, currentLeftBlock, parentsRight)
            return
        } else if (currentRightElement.classList.contains("visited-left")) {
            await drawPath(noPath, currentRightBlock, parentsLeft)
            await drawPath(noPath, currentRightBlock, parentsRight)
            return
        }

        await new Promise(resolve => setTimeout(resolve, speedSelector[speed]))
        currentLeftElement.classList.remove("unvisited")
        currentLeftElement.classList.add("visited-left")
        currentRightElement.classList.remove("unvisited")
        currentRightElement.classList.add("visited-right")


        neighboursRight = getNeighbours(currentRightBlock);
        neighboursLeft = getNeighbours(currentLeftBlock);



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

        if (nextInLineLeft.empty() || nextInLineRight.empty()) {
            displayToast("No Path between start and destiantion")
            return
        }
    }


}

const DFShelper = async function (currentBlock, destinationBlock, currentParentId, visited, parents, found, speed,) {
    if (found.value) return
    if (killSwitch.killOpration) return
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

    let neighbours = getNeighbours(currentBlock);

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
                await DFShelper(nextBlock, destinationBlock, currentNodeId, visited, parents, found, speed,);
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

    let noPath
    if (!parents[stringfyBlock(destinationBlock)])
        noPath = true

    await drawPath(noPath, destinationBlock, parents);
};

const DFSMazeHelper = async function (currentBlock, visited) {
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

const BFShelper = async function (startBlock, destinationBlock, nextInLine, speed,) {
    let neibours;
    let visited = {}
    let noPath
    const startNodeID = stringfyBlock(startBlock)
    const destinationNodeID = stringfyBlock(destinationBlock)
    let parents = {}
    parents[startNodeID] = null
    while (!nextInLine.empty()) {
        if (killSwitch.killOpration) return

        let currentNode = nextInLine.getFront()
        neibours = getNeighbours(currentNode);

        let currentNodeId = stringfyBlock(currentNode)
        visited[currentNodeId] = true;
        let node = document.getElementById(currentNodeId);
        await new Promise(resolve => setTimeout(resolve, speedSelector[speed]))
        node.classList.add("visited")

        for (let neibourDirection in neibours) {
            let neibourNode = neibours[neibourDirection]
            if (currentNode.first() === destinationBlock.first() && currentNode.second() === destinationBlock.second()) {

                await drawPath(noPath, destinationBlock, parents)
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
        if (nextInLine.empty()) {
            displayToast("No Path between start and destiantion")
            return
        }
    }
};

const BFS = async function (startCell, destinationCell, speed = "fast") {
    const startBlock = createBlock(startCell)
    const destinationBlock = createBlock(destinationCell)
    const nextInLine = new Queue()
    nextInLine.push(startBlock)
    await BFShelper(startBlock, destinationBlock, nextInLine, speed,)
}

const random = async function () {
    for (let row = 1; row <= rows; ++row) {
        await new Promise(resolve => setTimeout(resolve, 10))

        for (let column = 1; column <= columns; ++column) {
            if (column % 2 === 0) {
                const id = `${row}-${column}`
                const element = document.getElementById(id)
                let random = Math.floor(Math.random() * 3 + 1)
                if (random < 3 && !element.classList.contains("start-cell") && !element.classList.contains("destination-cell")) {
                    element.classList.add("wall")
                }
            }
        }
    }
}

const stair = async function () {
    const wallColumns = [20, 10, 0, -10, -20, -30, -40, -50, -60, -70];

    let vacantIds = ["23-3", "19-9", "12-2", "19-19", "4-4", "23-23", "8-18", "25-35", "12-32", "17-37", "5-35", "13-43", "22-52", "7-47", "13-53", "7-57", "18-68", "2-62", "9-69"]

    for (let row = 1; row <= rows; ++row) {
        missing = Math.floor(Math.random() * 25 + 1)
        await new Promise(resolve => setTimeout(resolve, 10))

        for (let column = 1; column <= columns; ++column) {

            if (wallColumns.includes(row - column)) {
                const id = `${row}-${column}`
                const element = document.getElementById(id)
                if (element.classList.contains("start-cell") || element.classList.contains("destination-cell") || vacantIds.includes(id)) {
                    continue
                }
                element.classList.add("wall")
            }
        }
    }

}

const removeMaze = function () {
    const cells = document.querySelectorAll(".cell")
    cells.forEach(cell => {
        let cellInLineStyles = cell.getAttribute("style")
        cellInLineStyles = cellInLineStyles.replace("border-bottom: none", "");
        cellInLineStyles = cellInLineStyles.replace("border-top: none", "");
        cellInLineStyles = cellInLineStyles.replace("border-right: none", "");
        cellInLineStyles = cellInLineStyles.replace("border-left: none", "");
        cellInLineStyles = cellInLineStyles.replace("border-width: initial", "");
        cellInLineStyles = cellInLineStyles.replace("border-style: none", "");
        cellInLineStyles = cellInLineStyles.replace("border-color: initial", "");


        cell.setAttribute("style", cellInLineStyles)
    })
}

const algorithmFunction = {
    "dijkstra": dijkstra,
    "astar": aStar,
    "bds": bidirectionalSearch,
    "dfs": DFS,
    "bfs": BFS,
    "gbfs": greedbyBestFirstSearch
}

const obstacleFunction = {
    "random": random,
    "stair": stair,
    "no": null
}

const mazeFunctions = {
    "maze": DFSMaze,
    "no-maze": removeMaze
}


