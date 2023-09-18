const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define platform properties
const platformWidth = 350;
const platformHeight = 100;
const platformX = 20;
const platformY = 400 + 150;


// Dimensions for the regular car image
const regularCarWidth = 150;
const regularCarHeight = 50;

// Dimensions for the inclined car image
const inclinedCarWidth = 150; // Adjust the width as needed
const inclinedCarHeight = 130;
 // Adjust the height as needed

let playerWidth = regularCarWidth;
let playerHeight = regularCarHeight;

let playerX = platformX + platformWidth / 2 - playerWidth / 2;
let playerY = platformY - playerHeight;
let playerSpeedX = 0;
let playerSpeedY = 0;
let isJumping = false;

// Define slanted wall properties
const wallHeight = 200;
const wallStartX = platformX + platformWidth;
const wallEndX = canvas.width;
const wallStartY = platformY + platformHeight + 10;
const wallEndY = canvas.height;

function drawPlatform() {
    ctx.fillStyle = "#b3cdd1";
    ctx.fillRect(platformX, platformY, platformWidth, platformHeight);
}

function drawWall() {
    ctx.fillStyle = "#0F0E11";
    ctx.beginPath();
    // ctx.moveTo(wallStartX, wallStartY);
    ctx.lineTo(wallEndX, wallEndY);
    ctx.lineTo(wallEndX, wallEndY - wallHeight);
    ctx.lineTo(10, wallStartY + 140);
    ctx.closePath();
    ctx.fill();
}
const carImageRegular = new Image();
carImageRegular.src = 'details-car.png';

const carImageInclined = new Image();
carImageInclined.src = 'details-car-45.png';

let currentCarImage = carImageRegular; // Initialize with the regular car image


carImageRegular.onload = () => {
    update();
};

let carAngle = 0;   

function drawPlayer() {
    // ctx.fillStyle = "red";
    // ctx.fillRect(playerX, playerY, playerWidth, playerHeight);

    ctx.save();
    ctx.translate(playerX + playerWidth / 2, playerY + playerHeight / 2);
    ctx.rotate(carAngle);

    ctx.drawImage(currentCarImage, -playerWidth / 2, -playerHeight / 2, playerWidth, playerHeight);
    ctx.restore();

}

const gravity = 0.6; 
const friction = 0.4;

let currentFriction = friction;

function update() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platform, wall, and player
    drawPlatform();
    drawWall();
    drawPlayer();

    // Handle player movement
    if (playerX + playerSpeedX >= platformX && playerX + playerSpeedX <= wallStartX) {

        playerX += playerSpeedX;

    } else if (playerX + playerSpeedX >= wallStartX && playerX + playerSpeedX <= wallEndX) {
        
        playerSpeedX *= friction;
        playerX += playerSpeedX;
        playerY -= (playerSpeedX / (wallEndX - wallStartX)) * 420;


        if (!isJumping && currentCarImage !== carImageInclined) {

            isJumping = true;
            currentCarImage = carImageInclined; 
            playerWidth = inclinedCarWidth;
            playerHeight = inclinedCarHeight; 
        }
    } else {
        currentCarImage = carImageRegular;
        playerWidth = regularCarWidth;
        playerHeight = regularCarHeight;
    }

    // Handle jumping
    if (isJumping) {
        playerY -= playerSpeedY;
        playerSpeedY -= 0.2; // Gravity
        if (playerY >= platformY - playerHeight) {
            playerY = platformY - playerHeight;
            isJumping = false;
            playerSpeedY = 0;
        }
    }

    requestAnimationFrame(update);
}

// Handle keyboard input
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
        playerSpeedX = 4;
    } else if (event.key === "ArrowLeft") {
        playerSpeedX = -4;
    } else if (event.key === "ArrowUp" && !isJumping) {
        isJumping = true;
        playerSpeedY = 5;
    } else if (event.key === "R" || event.key === "r") { // Add this condition for 'R' key press
        resetCarPosition();
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        playerSpeedX = 0;
    }
});

function resetCarPosition() {
    playerX = platformX + platformWidth / 2 - playerWidth / 2;
    playerY = platformY - playerHeight;
    playerSpeedX = 0;
    playerAngle = 0;
    currentCarImage = carImageRegular; 
    playerWidth = regularCarWidth; 
    playerHeight = regularCarHeight;
}

update();