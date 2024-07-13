const rows = 36
const columns = 100
const minGridWeights = 1
const maxGridWeights = 3

const drawGrid = (rows, columns) => {
    const grid = document.querySelector(".grid")


    for (let row = 1; row <= rows; ++row) {
        const tableRow = document.createElement("tr")
        tableRow.id = `${row}`
        grid.appendChild(tableRow)
        for (let i = 1; i <= columns; ++i) {
            const cell = document.createElement("td")

            cell.id = `${row}-${i}`
            cell.style.height = `${window.innerWidth / 100}px`
            cell.style.width = `${window.innerWidth / 100}px`
            if (row === 17 && i === 13) {
                cell.classList.add("start-cell")

            }
            else if (row === 17 && i === 83) {
                cell.classList.add("destination-cell")

            } else {
                cell.classList.add("unvisited")

            }
            cell.classList.add("cell")
            const spanElement = document.createElement('span')
            spanElement.classList.add("text-center", "weight")
            spanElement.hidden = true
            const weight = Math.floor(Math.random() * (maxGridWeights - minGridWeights + 1)) + minGridWeights;
            spanElement.textContent = `${weight}`;
            cell.appendChild(spanElement);
            tableRow.appendChild(cell)
        }
    }
}
drawGrid(rows, columns)

let tutorialPageNumber = 0

const tutorialData = [
    {
        title: "Welcome to Pathfinding Visualizer!",
        subtitle: "This short tutorial will walk you through all of the features of this application.",
        description: 'Feel free to press the "Skip Tutorial" button below. Otherwise, press  "Next"!',
        counter: "1/9",
        secondaryImage: "",
        primaryImage: "media/turorial/logo.png",
        previous: false,
        next: true
    },
    {
        title: "What is a pathfinding algorithm ?",
        subtitle: "Pathfinding or pathing is the plotting of the shortest route between two points",
        description: 'A pathfinding method searches a graph by starting at one vertex and exploring adjacent nodes until the destination node is reached, generally with the intent of finding the cheapest route.',
        counter: "2/9",
        secondaryImage: "",
        primaryImage: "media/turorial/atob.jpg",
        previous: true,
        next: true
    },
    {
        title: "Moving around",
        subtitle: "Select your starting and destination cells",
        description: 'To set the start or destination locations on the grid, simply click on the corresponding icon, and then click on any grid cell to assign it as the start or destination location.',
        counter: "3/9",
        secondaryImage: "",
        primaryImage: "media/turorial/startDestination.PNG",
        previous: true,
        next: true
    },
    {
        title: "Pick an algorithm",
        subtitle: "Click on the dropdown menu to show all the algorithms",
        description: 'Select the search algorithm you want to visualize.',
        counter: "4/9",
        secondaryImage: "",
        primaryImage: "media/turorial/algorithms.PNG",
        previous: true,
        next: true
    },
    {
        title: "Not all algorithms are created equal",
        subtitle: "Some algorithms, such as A* and Greedy best first search, require a heuristic .",
        description: 'The heuristic provides additional information regarding how far away from the goal node we are. Note that a good heuristic, will in turn result in a more efficient search',
        counter: "5/9",
        secondaryImage: "",
        primaryImage: "media/turorial/heuristic.PNG",
        previous: true,
        next: true
    },
    {
        title: "Make it more difficult for the algorithm",
        subtitle: "Walls are impenetrable. Put obstacbles in the grid and have the algorithm work around them",
        description: 'You can add the wall by either clicking on a single cell, or by clicking and draging to add multiple walls. You can also select one of the obstacle patterns',
        counter: "6/9",
        secondaryImage: "media/turorial/obstacles.PNG",
        primaryImage: "media/turorial/withWalls.PNG",
        previous: true,
        next: true
    },
    {
        title: "Slow and steady will also win the race.",
        subtitle: "Slow down and engjoy the algorithm ",
        description: 'To see the algorithm in action, adjust the animation speed by selecting different speed options from the dropdown menu provided.',
        counter: "7/9",
        secondaryImage: "",
        primaryImage: "media/turorial/speed.PNG",
        previous: true,
        next: true
    },
    {
        title: "Have fun with mazes",
        subtitle: "Mazes are the ultamate challenge for the algorithms",
        description: 'Select maze option from the maze dropdown menu, to generate a new maze.',
        counter: "8/9",
        secondaryImage: "",
        primaryImage: "media/turorial/maze.PNG",
        previous: true,
        next: true
    }
    ,
    {
        title: "Explore and Enjoy!",
        subtitle: "See your all your favorite algorithms in action",
        description: 'Have fun trying all features and try all the possible combinations',
        counter: "9/9",
        secondaryImage: "",
        primaryImage: "media/turorial/last.png",
        previous: true,
        next: false
    }
]

const skipTutorialBtn = document.querySelector("#skip-button")
const nextTutorialBtn = document.querySelector("#next-button")
const previousTutorialBtn = document.querySelector("#previous-button")
const tutorialHeaderData = document.querySelector("#tutorial-header-data")
const tutorialPageCount = document.querySelector("#page-count")
const subtitleData = document.querySelector("#subtitle-data")
const descriptionData = document.querySelector("#description-data")
const primaryImage = document.querySelector("#tutorial-image")
const secondaryImage = document.querySelector("#secondary-image")



const loadTutorial = function (tutorialPageNumber, tutorialData) {
    if (tutorialPageNumber === 0) {
        previousTutorialBtn.hidden = true
    } else {
        previousTutorialBtn.hidden = false
    }

    if (tutorialPageNumber === 8) {
        nextTutorialBtn.hidden = true
    } else {
        nextTutorialBtn.hidden = false

    }
    let tutorial = tutorialData[tutorialPageNumber]
    tutorialHeaderData.textContent = tutorial.title
    tutorialPageCount.textContent = tutorial.counter
    subtitleData.textContent = tutorial.subtitle
    descriptionData.textContent = tutorial.description
    primaryImage.setAttribute("src", tutorial.primaryImage)
    if (tutorial.secondaryImage) {
        secondaryImage.style.display = ""
        secondaryImage.setAttribute("src", tutorial.secondaryImage)
    } else {
        secondaryImage.style.display = "none"
    }

}

loadTutorial(tutorialPageNumber, tutorialData)

nextTutorialBtn.addEventListener("click", () => {
    if (tutorialPageNumber === 8) return
    ++tutorialPageNumber
    loadTutorial(tutorialPageNumber, tutorialData)
})

previousTutorialBtn.addEventListener("click", () => {
    if (tutorialPageNumber === 0) return
    --tutorialPageNumber
    loadTutorial(tutorialPageNumber, tutorialData)
})


let startCell = document.querySelector(".start-cell")
let destinationCell = document.querySelector(".destination-cell")

let potentialStarts
let potentialDestinations
let startFlagFloating
let destinationFlagFloating

const changeStartLocation = function () {
    if (killSwitch.algorithmOn) return
    this.classList.remove("start-cell");
    this.classList.add("unvisited");
    startFlagFloating = true;
    this.removeEventListener("click", changeStartLocation);
    potentialStarts = document.querySelectorAll(".cell");
    for (let cell of potentialStarts) {
        cell.addEventListener("click", () => {
            if (!startFlagFloating) return;
            cell.classList.add("start-cell");
            startFlagFloating = false
            startCell = cell
            if (cell.classList.contains("wall")) {
                cell.classList.remove("wall")
            }
            cell.addEventListener("click", changeStartLocation);
        });
    };

}

const changeDestinationLocation = function () {
    if (killSwitch.algorithmOn) return
    this.classList.remove("destination-cell");
    this.classList.add("unvisited");
    destinationFlagFloating = true;
    this.removeEventListener("click", changeDestinationLocation);
    potentialDestinations = document.querySelectorAll(".cell");
    for (let cell of potentialDestinations) {
        cell.addEventListener("click", () => {
            if (!destinationFlagFloating) return;
            cell.classList.add("destination-cell");
            destinationFlagFloating = false
            destinationCell = cell
            if (cell.classList.contains("wall")) {
                cell.classList.remove("wall")
            }
            cell.addEventListener("click", changeDestinationLocation);
        });
    };
}

startCell.addEventListener("click", changeStartLocation);
destinationCell.addEventListener("click", changeDestinationLocation)

const algorithmTextOutput = document.querySelector("#navbarDropdownMenu1")
const obstaclesTextOutput = document.querySelector("#navbarDropdownMenu2")
const speedTextOutput = document.querySelector("#navbarDropdownMenu3")
const heuristicTextOutput = document.querySelector("#navbarDropdownMenu4")
const mazeTextOutput = document.querySelector("#navbarDropdownMenu5")

const algorithmsOptions = document.querySelectorAll("#algorithm-select .dropdown-item")
const obstaclesOptions = document.querySelectorAll("#obstacles-select .dropdown-item")
const speedOptions = document.querySelectorAll("#speed-select .dropdown-item")
const heuristicOptions = document.querySelectorAll("#heuristic-select .dropdown-item")
const mazeOptions = document.querySelectorAll("#maze-select .dropdown-item")

const clearBtn = document.getElementById("clear-grid")
const tutorialCard = document.querySelector("#tutorial-card")
const heuristicShow = document.querySelector("#heuristic-show")
const algorithmShow = document.querySelector("#algorithm-show")
const obstacblesShow = document.querySelector("#obstacles-show")

const visualizeForm = document.querySelector("#visualize-settings")
const toastBody = document.querySelector(".toast-body")
const visualizeBtn = document.getElementById("visualize-algorithm")
const clearSearch = document.getElementById("clear-search")
const mazeBtn = document.querySelector("#maze")
const noMazeBtn = document.querySelector("#no-maze")

const killSwitch = { algorithmOn: false, killOpration: false, newOperationInitiated: false, isDrawing: false }

let selectedAlgorithm
let selectedObstacle
let selectedSpeed
let selectedHeuristic
let selectedMaze
let mouseDown = false

const loadEventListeners = function () {
    for (let algorithm of algorithmsOptions) {
        algorithm.addEventListener("click", () => {
            if (killSwitch.algorithmOn) {
                const liveToast = new bootstrap.Toast(document.getElementById('liveToast'));
                toastBody.innerText = "You must wait till the search finishes !!"
                return liveToast.show();
            }
            algorithmTextOutput.innerText = algorithm.innerText
            selectedAlgorithm = algorithm.id
            if (selectedAlgorithm === "astar" || selectedAlgorithm === "gbfs") {
                heuristicShow.hidden = false
            } else {
                heuristicShow.hidden = true
            }
        })
    }

    for (let obstacles of obstaclesOptions) {
        obstacles.addEventListener("click", function () {
            if (killSwitch.algorithmOn) {
                const liveToast = new bootstrap.Toast(document.getElementById('liveToast'));
                toastBody.innerText = "You must wait till the search finishes !!"
                return liveToast.show();
            }
            if (selectedMaze === "maze") {
                const liveToast = new bootstrap.Toast(document.getElementById('liveToast'));
                toastBody.innerText = "Can't add obstacbles while in Maze !!"
                return liveToast.show();
            }



            if (killSwitch.isDrawing) {
                killSwitch.newOperationInitiated = true
            }

            obstaclesTextOutput.innerText = obstacles.innerText
            selectedObstacle = obstacles.id

            clearBtn.click()
            if (obstacleFunction[selectedObstacle])
                obstacleFunction[selectedObstacle]()


        })
    }

    for (let speed of speedOptions) {
        speed.addEventListener("click", () => {
            speedTextOutput.innerText = speed.innerText
            selectedSpeed = speed.id
        })
    }

    for (let heuristic of heuristicOptions) {
        heuristic.addEventListener("click", () => {
            heuristicTextOutput.innerText = heuristic.innerText
            selectedHeuristic = heuristic.id
        })
    }

    for (let maze of mazeOptions) {
        maze.addEventListener("click", () => {
            if (killSwitch.algorithmOn) {
                const liveToast = new bootstrap.Toast(document.getElementById('liveToast'));
                toastBody.innerText = "You must wait till the search finishes !!"
                return liveToast.show();

            }

            if (killSwitch.isDrawing) {
                killSwitch.newOperationInitiated = true
            }
            let previousMazeSelection = selectedMaze
            mazeTextOutput.innerText = maze.innerText
            selectedMaze = maze.id
            if (selectedMaze === previousMazeSelection) return
            clearSearch.click()
            mazeFunctions[selectedMaze]()
            if (selectedMaze === "maze") {
                algorithmShow.hidden = true
                obstacblesShow.hidden = true
                heuristicShow.hidden = true
            } else {
                algorithmShow.hidden = false
                obstacblesShow.hidden = false
                if (selectedAlgorithm === "astar" || selectedAlgorithm === "gbfs")
                    heuristicShow.hidden = false

            }

        })
    }
}

loadEventListeners()

document.addEventListener('mousedown', () => {
    mouseDown = true
});

document.addEventListener('mouseup', () => {
    mouseDown = false
});

document.querySelectorAll('.cell').forEach(cell => {

    cell.addEventListener('mouseenter', () => {
        if (killSwitch.algorithmOn) return

        if (mouseDown && !cell.classList.contains("start-cell") && !cell.classList.contains("destination-cell")) {
            if (selectedMaze === "maze" && !startFlagFloating && !destinationFlagFloating) {
                const liveToast = new bootstrap.Toast(document.getElementById('liveToast'));
                toastBody.innerText = "We only add walls before selecting the maze!!"
                return liveToast.show();
            }
            cell.classList.add('wall');
        }
    })

    cell.addEventListener("click", () => {
        if (killSwitch.algorithmOn) return
        if (selectedMaze === "maze" && !startFlagFloating && !destinationFlagFloating) {
            const liveToast = new bootstrap.Toast(document.getElementById('liveToast'));
            toastBody.innerText = "We only add walls before selecting the maze!!"
            return liveToast.show();
        }
        if (!cell.classList.contains("start-cell") && !cell.classList.contains("destination-cell") && !startFlagFloating && !destinationFlagFloating) {
            cell.classList.toggle("wall")
        }
    })



})

const disableControllers = function () {
    visualizeBtn.disabled = true
    clearSearch.disabled = true
    killSwitch.algorithmOn = true
    clearBtn.innerText = "Stop"
}

const enableControllers = function () {
    visualizeBtn.disabled = false
    clearSearch.disabled = false
    killSwitch.algorithmOn = false
    clearBtn.innerText = "New"
    killSwitch.algorithmOn = false
    killSwitch.killOpration = false

}

clearBtn.addEventListener("click", () => {


    if (killSwitch.isDrawing) {
        killSwitch.newOperationInitiated = true
    }
    if (!killSwitch.algorithmOn) {
        if (selectedMaze === "maze") {
            noMazeBtn.click()
            mazeBtn.click()
            return
        }
        const cells = document.querySelectorAll(".cell")
        cells.forEach(cell => {
            if (cell === startCell || cell == destinationCell) {
                cell.classList.remove("path")
                cell.classList.remove("visited")
                cell.classList.remove("visited-left")
                cell.classList.remove("visited-right")

            } else {
                cell.className = ""
                cell.classList.add("unvisited")
                cell.classList.add("cell")
            }

            cell.querySelector(".weight").textContent = `${Math.floor(Math.random() * (maxGridWeights - minGridWeights + 1)) + minGridWeights}`


        })
    } else {
        killSwitch.killOpration = true
    }


})

skipTutorialBtn.addEventListener("click", () => {
    tutorialCard.style.display = "none"
})

clearSearch.addEventListener("click", () => {


    if (killSwitch.isDrawing) {
        killSwitch.newOperationInitiated = true
    }
    const cells = document.querySelectorAll(".cell")
    for (let cell of cells) {
        cell.classList.remove("visited")
        cell.classList.remove("path")
        cell.classList.remove("visited-left")
        cell.classList.remove("visited-right")
        cell.classList.add("unvisited")
        cell.classList.remove("track")
        cell.classList.remove("done")

    }



})

const displayToast = (message) => {
    const liveToast = new bootstrap.Toast(document.getElementById('liveToast'));
    toastBody.innerText = message
    return liveToast.show();
}

visualizeForm.addEventListener("submit", async (e) => {

    e.preventDefault()

    if (!algorithmFunction[selectedAlgorithm] && selectedMaze !== "maze") {
        displayToast("You must select an algorithm")
        return
    }

    clearSearch.click()
    disableControllers()


    if (killSwitch.isDrawing) {
        killSwitch.newOperationInitiated = true
    }

    if (selectedMaze === "maze") {
        await solveMaze(startCell, destinationCell, selectedSpeed)

    } else {
        if (selectedAlgorithm === "astar" || selectedAlgorithm === "gbfs") {

            await algorithmFunction[selectedAlgorithm](startCell, destinationCell, selectedHeuristic, selectedSpeed, selectedMaze)

        } else {

            await algorithmFunction[selectedAlgorithm](startCell, destinationCell, selectedSpeed, selectedMaze)

        }
    }
    enableControllers()


})






















