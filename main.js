const gameFrame = document.querySelector("#gameFrame");
const obstacles = document.querySelectorAll(".obstacle");
const truck = document.querySelector("#truck");
let speed = 8;
let steer = 0;

console.log(gameFrame.offsetHeight);
obstacles.forEach(obstacle => {
    console.log("check");
    console.log(obstacle.offsetTop)
});

document.addEventListener("keydown", function startAction (event) {
    if (event.key === "a") {
        console.log("start turning left!");
        steer = -1;
    }

    if (event.key === "d") {
        console.log("start turning right!");
        steer = 1;
    }
});

document.addEventListener("keyup", function stopAction (event) {
    if (event.key === "a") {
        // We straighten only if the player hasn't already started turning right
        if (steer == -1){
            steer = 0;
        }
    }

    if (event.key === "d") {
        // We straighten only if the player hasn't already started turning left
        if (steer == 1){
            steer = 0;
        }
    }
});

const startGame = () => {
    //Line up the obstacles off the top of the screen, ready to scroll on
    obstacles.forEach((obstacle,index) => {
        let Yposition = 150 + (200*index)
        obstacle.style.top=`-${Yposition}px`;

        setObstacle(obstacle);
    })
    
    window.requestAnimationFrame(gameLoop);
}

const gameLoop = () => {
    moveObstacle();
    moveTruck();
//  Check for collison
//  Move drones?
//  Check for drone collision?    
    window.requestAnimationFrame(gameLoop);
}

const moveObstacle = () => {
    obstacles.forEach(obstacle => {
        if(obstacle.offsetTop>gameFrame.offsetHeight){
            obstacle.style.top=`-${obstacle.offsetHeight+50}px`;
            setObstacle(obstacle);
        } else {
            obstacle.style.top=`${obstacle.offsetTop+speed}px`;
        }
    });
}

const moveTruck = () => {
    let newPosition = truck.offsetLeft+(steer*5);

    if(newPosition > (gameFrame.offsetWidth-truck.offsetWidth)){
        newPosition = (gameFrame.offsetWidth-truck.offsetWidth);
    } else if (newPosition < 0) {
        newPosition = 0;
    }
    truck.style.left=`${newPosition}px`
}

const setObstacle = (obstacle) => {
    // Randomizes the horizontal position of an obstacle across the full width of the frame
    // Randomizes the vertical position to +/-50px of its current position

    let Xposition = Math.random() * (gameFrame.offsetWidth - obstacle.offsetWidth)
    console.log(Xposition);
    obstacle.style.left=`${Xposition}px`;

    let Ynudge = obstacle.offsetTop+50-(Math.random() * 100);
    obstacle.style.top=`${Ynudge}px`;
}
