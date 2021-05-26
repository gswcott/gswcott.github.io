window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    canW=can.width
    canH=can.height
    ctx=can.getContext("2d")
    oldTime=0
    cellSize=2
    nbCases=7
    radius=16
    hero={}
    shoot={}
    listBalls=[]
    ballVy=-7
    ballVx=1
    heroVx=2
    shootVy=-4
    gameover=false
    keyboardMap={}
    window.onkeyup = function(e) {keyboardMap[e.key] = false;} 
    window.onkeydown = function(e) { keyboardMap[e.key] = true;}
    initGame()
    requestAnimationFrame(gameLoop)
}

function initGame(){
    initHero()
    addBall(radius, canH-radius, radius, ballVx, ballVy)
    shoot.matrix=[
        [0, 0, 0, 1, 0, 0, 0], 
        [0, 0, 1, 1, 1, 0, 0], 
        [0, 1, 0, 1, 0, 1, 0], 
        [0, 0, 0, 1, 0, 0, 0], 
        [0, 0, 0, 1, 0, 0, 0], 
        [0, 0, 0, 1, 0, 0, 0], 
        [0, 0, 0, 1, 0, 0, 0]
    ]
    shoot.on=false
    shoot.vy=shootVy
    shoot.size=nbCases*cellSize
}

function initHero(){
  hero.matrix=[
    [0, 0, 1, 1, 1, 0, 0], 
    [0, 0, 1, 1, 1, 0, 0], 
    [0, 0, 0, 1, 0, 0, 0], 
    [0, 1, 1, 1, 1, 1, 0], 
    [1, 0, 1, 1, 1, 0, 1], 
    [0, 0, 1, 0, 1, 0, 0], 
    [0, 0, 1, 0, 1, 0, 0]
  ]
  hero.x=(canW-cellSize*nbCases)/2
  hero.y=canH-cellSize*nbCases
  hero.vx=heroVx
  hero.size=nbCases*cellSize
  hero.plop=false
}

function addBall(pX, pY, pRadius, pVx, pVy){
  ball={}
  ball.x=pX
  ball.y=pY
  ball.radius=pRadius
  ball.vx=pVx
  ball.oldVy=pVy
  ball.vy=pVy
  ball.plop=false
  listBalls.push(ball)
}

function update(dt){
    if (gameover==false){
        updateHero(dt)
        updateShoot(dt)
        updateBalls(dt)
    } 
}


function updateHero(dt){
    if (hero.x>=hero.vx){
        if (keyboardMap["ArrowLeft"]){
            hero.x=hero.x-hero.vx
        } 
    } 
    if (hero.x<=canW-hero.size-hero.vx){
        if (keyboardMap["ArrowRight"]) {
            hero.x=hero.x+hero.vx
        }
    } 
}


function updateShoot(dt){
    if (shoot.on==false && keyboardMap["ArrowUp"]){
        shoot.on=true
        shoot.x=hero.x
        shoot.y=hero.y-hero.size/2-shoot.size/2
    } else if (shoot.on==true){
        shoot.y=shoot.y+shoot.vy
        if (shoot.y<-shoot.size) {
            shoot.on=false
        }
    }
}

function updateBalls(dt){
    for (let i=0; i<listBalls.length; i++){
        let ball=listBalls[i]
        ball.x=ball.x+ball.vx
        //test the collision of the ball against the right border 
        if (ball.x>canW-ball.radius){
            ball.x=canW-ball.radius
            ball.vx=-ball.vx 
        }
        //test the collision of the ball against the left border
        if (ball.x<ball.radius){
            ball.x=ball.radius
            ball.vx=-ball.vx 
        } 
    
        ball.y=ball.y+ball.vy 
        ball.vy=ball.vy+0.1
        //test the collision of the ball against the top
        if (ball.y<ball.radius){
            ball.y=ball.radius
            ball.vy=-ball.oldVy
        }
        //test the collision of the ball against the bottom
        if (ball.y>canH-ball.radius){
            ball.y=canH-ball.radius
            ball.vy=ball.oldVy
        }
    
        // collision against a shoot
        if (shoot.on==true){
            if (shoot.x>ball.x-ball.radius && shoot.x<ball.x+ball.radius && shoot.y<ball.y+ball.radius && shoot.y>ball.y-ball.radius-shoot.size){
                ball.plop=true
                if (ball.radius>4){
                    addBall(ball.x-ball.radius-shoot.size/2, ball.y, ball.radius/2, -ball.vx, ball.oldVy*9/10)
                    addBall(ball.x+ball.radius+shoot.size/2, ball.y, ball.radius/2, ball.vx, ball.oldVy*9/10)
                }
            }
        } 
        // collision aginst the hero
        if (ball.x+ball.radius>hero.x && ball.x-ball.radius<hero.x+hero.size && ball.y+ball.radius> hero.y) {
            gameover=true
        }
        // remove ploping balls
        for (let i=listBalls.length-1; i>=0; i--){
            let ball=listBalls[i]
            if (ball.plop==true){
                listBalls.splice(i,1)
            } 
        }
    }
}
  

function draw(){
    ctx.fillStyle="black"
    ctx.fillRect(0, 0, canW, canH)
    if (gameover==false){
        drawSprite(hero)
        if (shoot.on==true){
            drawSprite(shoot)
        } 
        if (listBalls.length==0){
            ctx.fillStyle="white"
            ctx.fillText("Winner!", canW/2, canH/2)
        }else{
            drawBalls()
        }
    } else {
        ctx.fillStyle="white"
        ctx.fillText("Game over!", canW/2, canH/2)
    }
}

function drawSprite(pSprite){
    let matrix=pSprite.matrix
    let x=pSprite.x
    let y=pSprite.y
    for(let r=0; r<matrix.length; r++) {
        for(let c=0; c<matrix[0].length; c++) {
            if (matrix[r][c]==1){
                ctx.fillStyle="white"
                ctx.fillRect(x+c*cellSize, y+r*cellSize, cellSize, cellSize)
            }
        }
    }
}

function drawBalls(){
    for(let i=0; i<listBalls.length; i++){
        let ball=listBalls[i]
        ctx.fillStyle="red"
        ctx.beginPath()
        ctx.arc(ball.x, ball.y, ball.radius, 0, 2*Math.PI)
        ctx.fill()
    } 
}

function gameLoop(time){
    if(oldTime!=0){
        dt=(time-oldTime)/1000
        update(dt)
    }else {
        dt=0
    }
    draw()
    oldTime=time
    requestAnimationFrame(gameLoop)
}