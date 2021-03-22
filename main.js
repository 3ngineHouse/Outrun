const gameFrame = document.querySelector("#gameFrame");
const obstacles = document.querySelectorAll(".obstacle");
let speed = 5;

console.log(gameFrame.offsetHeight);
obstacles.forEach(obstacle => {
    console.log("check");
    console.log(obstacle.offsetTop)
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

function gameLoop () {
    moveObstacle();
//  Check for collison
//  Move vehicle
//  Move drones?
//  Check for drone collision?    
    window.requestAnimationFrame(gameLoop);
}

const moveObstacle = () => {
    obstacles.forEach(obstacle => {
        if(obstacle.offsetTop>gameFrame.offsetHeight){
            obstacle.style.top="-200px";
            setObstacle(obstacle);
        } else {
            obstacle.style.top=`${obstacle.offsetTop+speed}px`;
        }
    });
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
