const gameFrame = document.querySelector("#gameFrame");
const obstacles = document.querySelectorAll(".obstacle");
const truck = document.querySelector("#truck");
const healthBar = document.querySelector("#healthBar");
const menu = document.querySelector("#menu");

let speed = 8;
let steer = 0;
let health = 100;
let running = false;

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

const setLevel = (level) => {
    // Set the difficulty
    speed = 5 + level;
    
    // Reset health
    health = 100;
    healthBar.style.width = `${health}%`;

    // Reset the objects
    truck.style.left = "270px";
    obstacles.forEach(obstacle => obstacle.style.top = `-150px`);

    // Hide the menu
    menu.style.visibility = "hidden";
}

const startGame = () => {
    //Line up the obstacles off the top of the screen, ready to scroll on
    obstacles.forEach((obstacle,index) => {
        let Yposition = 150 + (200*index)
        obstacle.style.top=`-${Yposition}px`;
        setObstacle(obstacle);
    })
    
    running = true;
    window.requestAnimationFrame(gameLoop);
}

const gameLoop = () => {
    moveObstacle();
    moveTruck();
    collisionCheck();
//  Move drones?
//  Check for drone collision?    
    if (running == true){
        window.requestAnimationFrame(gameLoop);
    }
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

const collisionCheck = () => {
    // When the truck hits obstacles, it destroys them but loses health in the process
    obstacles.forEach(obstacle => {
        if (hitCheck(truck, obstacle) && obstacle.style.backgroundColor!="darkslategrey"){
            console.log("hit!");
            obstacle.style.backgroundColor = "darkslategrey"
            health-=10;
            healthBar.style.width = `${health}%`;
        }

        // If health is 0, it's game over
        if (health<=0 && running==true){
            alert("game over!");
            running = false;
            menu.style.visibility = "visible";
        }
    });
}

const hitCheck = (object1, object2) => {
    // This only works on rectangles that are aligned with the screen!
    let wideObject;
    let narrowObject;
    let longObject;
    let shortObject;

    if (object1.offsetWidth > object2.offsetWidth){
        wideObject = object1;
        narrowObject = object2;
    } else {
        narrowObject = object1;
        wideObject = object2;        
    }

    if (object1.offsetHeight > object2.offsetHeight){
        longObject = object1;
        shortObject = object2;
    } else {
        shortObject = object1;
        longObject = object2;
    }

    // is the left edge of the narrower object NOT between the left and right edges of the wider one?
    // AND
    // is the right edge of the narrower object NOT between the left and right edges of the wider one?
    // If so, we haven't collided
    let leftEdge = narrowObject.offsetLeft;
    let rightEdge = narrowObject.offsetLeft+narrowObject.offsetWidth;

    if (!(wideObject.offsetLeft < leftEdge && leftEdge < (wideObject.offsetLeft + wideObject.offsetWidth))){
        if (!(wideObject.offsetLeft < rightEdge && rightEdge < (wideObject.offsetLeft + wideObject.offsetWidth))){
            return false;
        }
    }
    // If we're still here, the rectangles are aligned horizontally

    // is the top edge of the shorter object NOT between the top and bottom edges of the longer one?
    // AND
    // is the bottom edge of the shorter object NOT between the top and bottom edges of the longer one?
    //If so, we haven't collided
    let topEdge = shortObject.offsetTop;
    let bottomEdge = shortObject.offsetTop+shortObject.offsetHeight;

    if (!(longObject.offsetTop < topEdge && topEdge < (longObject.offsetTop + longObject.offsetHeight))){
        if (!(longObject.offsetTop < bottomEdge && bottomEdge < (longObject.offsetTop + longObject.offsetHeight))){
            return false;
        }
    }
    // If we're still here, the rectangles are aligned horizontally and vertically and have thus collided
    return true;
}

const setObstacle = (obstacle) => {
    // Randomize the horizontal position of an obstacle across the full width of the frame
    let Xposition = Math.random() * (gameFrame.offsetWidth - obstacle.offsetWidth)
    obstacle.style.left=`${Xposition}px`;

    // Randomize the vertical position to +/-50px of its current position
    let Ynudge = obstacle.offsetTop+50-(Math.random() * 100);
    obstacle.style.top=`${Ynudge}px`;

    // If the obstacle has been "deactivated" by a collision, reactivate it
    obstacle.style.backgroundColor="red";
}
