const canvasEl = document.querySelector("canvas");
const canvasContext = canvasEl.getContext('2d');

canvasEl.width = 1500;
canvasEl.height = 720;

let RIScore = new Audio();
let AIScore = new Audio();
let hit = new Audio();
let wall = new Audio();

RIScore.src = 'sounds/RIScore.mp3';
AIScore.src = 'sounds/AIScore.mp3';
hit.src = 'sounds/hit.mp3';
wall.src = 'sounds/wall.mp3';

// The RI Player Paddle
const playerPaddleRI = {
    xP: 0,
    yP: canvasEl.height / 2 - 100 / 2,
    height: 100,
    width: 10,
    color: '#d2e603',
    score: 0
}


// The AI Player Paddle
const playerPaddleAI = {
    xP: canvasEl.width - 10,
    yP: canvasEl.height / 2 - 100 / 2,
    height: 100,
    width: 10,
    color: 'orange',
    score: 0
}

//Creating the Ball 
const ball = {
    xP: canvasEl.width / 2,
    yP: canvasEl.height / 2,
    radius: 10,
    speed: 7,
    xV: 5,
    yV: 5,
    color: 'white'
}

//creting net
const net = {
    xP: canvasEl.width / 2 - 1,
    yP: 0,
    width: 2,
    height: 10,
    color: 'white'

}


//Drawing the canvas
function drawRect(xP, yP, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(xP, yP, width, height)
}

//drawing a circle
function drawCircle(xP, yP, radius, color) {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(xP, yP, radius, 0, Math.PI * 2);
    canvasContext.fill();
}


// Drawimg the text 

function drawText(content, xP, yP, color) {
    canvasContext.fillStyle = color
    canvasContext.font = '35px san-serif'
    canvasContext.fillText(content, xP, yP)

}
//Drawing the net
function drawNet() {
    for (let i = 0; i < canvasEl.height; i += 15) {
        drawRect(net.xP, net.yP + i, net.width, net.height, net.color)


    }
}

//runGame Function AKA The Game Loop

function runGAme() {
    //clearing the canvas
    drawRect(0, 0, canvasEl.width, canvasEl.height, '#5683a0');

    //Draw net function
    drawNet();

    //Draw net function
    drawText(playerPaddleRI.score, (1 * canvasEl.width) / 4, (1 * canvasEl.height) / 10, 'white');
    drawText(playerPaddleAI.score, (3 * canvasEl.width) / 4, (1 * canvasEl.height) / 10, 'white');


    //drawing the paddles
    drawRect(
        playerPaddleRI.xP,
        playerPaddleRI.yP,
        playerPaddleRI.width,
        playerPaddleRI.height,
        playerPaddleRI.color
    )
    drawRect(
        playerPaddleAI.xP,
        playerPaddleAI.yP,
        playerPaddleAI.width,
        playerPaddleAI.height,
        playerPaddleAI.color
    )

    //Drawing the ball
    drawCircle(ball.xP, ball.yP, ball.radius, ball.color)

}

// The player Paddle RI Event listener
canvasEl.addEventListener('mousemove', movePaddle);
function movePaddle(e) {
    let canvasRect = canvasEl.getBoundingClientRect();
    console.log(canvasRect)
    playerPaddleRI.yP=e.clientY - canvasRect.top - playerPaddleRI.height / 2;    
}


//the Collison Detection of Paddles Function
function paddleColliDete(BALL,PADDLE) {
    BALL.top = BALL.yP - BALL.radius;
    BALL.bottom = BALL.yP + BALL.radius; 
    BALL.left = BALL.xP - BALL.radius;
    BALL.right = BALL.xP + BALL.radius; 
    
    PADDLE.top = PADDLE.yP;
    PADDLE.bottom = PADDLE.yP + PADDLE.height;
    PADDLE.left = PADDLE.xP;
    PADDLE.right = PADDLE.xP +PADDLE.width;

    return (BALL.right > PADDLE.left &&
            BALL.bottom > PADDLE.top &&
            BALL.left < PADDLE.right &&
            BALL.top < PADDLE.bottom);
}

//resetBall function
function resetBall() {
    ball.xP = canvasEl.width / 2;
    ball.yP = canvasEl.height / 2;
    ball.speed = 7;

    
}

// The everything Manager Function
function everyThingManager() {
    ball.xP += ball.xV   
    ball.yP += ball.yV 


    //creating the AI
    let intelligenceLevel = 0.1;
    playerPaddleAI.yP += (ball.yP - (playerPaddleAI.yP + playerPaddleAI.height / 2)) * intelligenceLevel;
    
    //bouncing off the top and bottom wals
    if (ball.yP+ ball.radius > canvasEl.height || ball.yP - ball.radius<0) {
        ball.yV = -ball.yV;
        wall.play()        
    }  
    
    let player = ball.xP+ ball.radius < canvasEl.width / 2 ? playerPaddleRI : playerPaddleAI;

    if (paddleColliDete(ball, player)) {
        hit.play();

        let collionPoint = ball.yP - (player.yP + player.height / 2)

        //normalization -> converting -50 & 50 -> -1 &1
        collionPoint = collionPoint / (player.height / 2)

        //canculating the angle at which the bounces back (radians)

        let bounceAngle = collionPoint * (Math.PI) / 4;


        //calculating the direction of the ball it bounces back
        let directin = ball.xP+ ball.radius < canvasEl.width / 2 ? 1 : -1;


        //updating the velocity when the ball hits any paddle
        ball.xV =directin * ball.speed * Math.cos(bounceAngle)
        ball.yV =directin * ball.speed * Math.sin(bounceAngle);

        // after each bounce back, the speed of the ball should be increased
        ball.speed += 0.1;
        
    }

    //updating the course
    if (ball.xP + ball.radius< 0) {
        //RI scores
        playerPaddleRI.score++;
        AIScore.play();
        resetBall();        
    }else if(ball.xP - ball.radius> canvasEl.width){
        // the RI scored
        playerPaddleRI.score++;
        RIScore.play()
        resetBall()

    }
}

//Game initialization function
function gameInt() {
    runGAme()
    everyThingManager()

}


// Looping the game to keep it running
const FPS = 60;
setInterval(gameInt, 1000 / FPS);

