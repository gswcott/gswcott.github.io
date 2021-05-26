let can, canW, canH, ctx
let transX=0
let transY=0
let cellSize=32
let nbRow=16
let nbCol=20
let ts
let quadWall
let level=1
let maxLives=5
let nbLives=maxLives
let nbClearWalls=0
let maxValidCases=(nbRow-2)*(nbCol-2)
let nbValidCases
let pctClear
let pctThreshold=0.75
let grid=[]
let gridCheck=[]
let listBalls=[]
let vBall=300
let posR0, posC0, posR, posC
let mouseX, mouseY, oldMouseX, oldMouseY
let inc=0
let dirWall="V"
let animation=false
let animationPart1=false
let animationPart2=false
let durationWait=0.1
let timerWait=durationWait
let collide=false
let pauseTransition=false
let gameover=false
let oldTime=0
let bgMusic, levelupSound, explodeSound

// window.onload, ca se lance qu&& le html est entièrement affiché.
window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    ctx=can.getContext("2d")
    canW=can.width
    canH=can.height
    transY=canH-cellSize*nbRow
    ts=new Image()
    ts.src="images/ts.png"
    quadWall=getQuad(0,2*cellSize, cellSize, cellSize)
    bgMusic=new Audio()
    bgMusic.src="sounds/music_jewels.ogg"
    bgMusic.loop=true
    bgMusic.play()
    levelupSound=new Audio()
    levelupSound.src="sounds/levelup.wav"
    explodeSound=new Audio()
    explodeSound.src="sounds/explode.mp3"
    initGame(level)
    document.onkeydown=nextLevelRestart
    document.onmousemove=mark
    document.onmousedown=construct
    requestAnimationFrame(gameLoop)
}

function getQuad(pX, pY, pW, pH){
    let quad={}
    quad.x=pX
    quad.y=pY
    quad.w=pW
    quad.h=pH
    return quad
}

function initGame(pLevel){
    nbValidCases=maxValidCases
    pctClear=1-nbValidCases/maxValidCases
    grid=[]
    initGrid(grid)
    gridCheck=[]
    initGridCheck(gridCheck)
    listBalls=[]
    for(let i=0; i<pLevel; i++){
        createBall(Math.floor(nbCol/2)*cellSize+cellSize/2, Math.floor(nbRow/2)*cellSize+cellSize/2, cellSize/2, vBall)
    }
}


function initGrid(pGrid){
    for(let r=0; r<nbRow; r++){
        pGrid[r]=[]
        for(let c=0; c<nbCol; c++){
            if(r==0 || r==nbRow-1 || c==0 || c==nbCol-1){
                pGrid[r][c]=1
            }else{
                pGrid[r][c]=0
            }
        }
    }
}

function initGridCheck(pGrid){
    for(let r=0; r<nbRow; r++){
        pGrid[r]=[]
        for(let c=0; c<nbCol; c++){
            pGrid[r][c]=0
        }
    }
}

function createBall(pX, pY, pR, pV){
    let ball={}
    let angle=Math.random()*360/180*Math.PI
    ball.x=pX
    ball.y=pY
    ball.r=pR
    ball.vx=Math.cos(angle)*pV
    ball.vy=Math.sin(angle)*pV
    listBalls.push(ball)
}

function nextLevelRestart(e){
    let key=e.code
    if (key=="Enter"){
        if (pauseTransition){
            level++
            initGame(level)
            pauseTransition=false
            levelupSound.play()
        }
        if (gameover){
            gameover=false
            level=1
            nbLives=maxLives
            initGame(level)
        }
    }
}


function update(dt){ 
    if (dt>0.1){
        dt=0.1
    } 
    if (gameover==false){
        if (pauseTransition==false){
            updateWalls(dt)
            updateBalls(dt)
            if (animation==false){
                for(let i=0; i<listBalls.length; i++){
                    let ball=listBalls[i]
                    let r=Math.floor(ball.y/cellSize)
                    let c=Math.floor(ball.x/cellSize)
                    floodFill(r, c)
                } 
                if (victoryCheck()){
                    pauseTransition=true
                }
            }
        }
    }
}

function mark(e){
    if (gameover==false && pauseTransition==false && animation==false){
        let rect=can.getBoundingClientRect()
        mouseX=e.clientX-rect.left-transX
        mouseY=e.clientY-rect.top-transY
        posR0=Math.floor(mouseY/cellSize)
        posC0=Math.floor(mouseX/cellSize)
    }
}

function construct(e){
    if (gameover==false && pauseTransition==false && animation==false){
        if (e.button==2){
            if (dirWall=="V"){
                dirWall="H"
            }else{
                dirWall="V"
            }
        }else if(e.button==0){
            collide=false
            oldMouseX=mouseX
            oldMouseY=mouseY
            let rect=can.getBoundingClientRect()
            let x=e.clientX-rect.left-transX
            let y=e.clientY-rect.top-transY
            posR=Math.floor(y/cellSize)
            posC=Math.floor(x/cellSize)
            if (isValid(posR, posC)){
                grid[posR][posC]=3
                animationPart2=true
            }
            if (dirWall=="V"){
                if (isValid(posR-1, posC)){
                    grid[posR-1][posC]=2
                    animationPart1=true
                } 
            }else if (dirWall=="H"){
                if (isValid(posR, posC-1)){
                    grid[posR][posC-1]=2
                    animationPart1=true
                }
            }
            if (animationPart1 || animationPart2){
                animation=true
                timerWait=durationWait
                inc=0
            }
        }
    }
}

function isValid(pR, pC){
    if (pR>=0 && pR<=nbRow-1 && pC>=0 && pC<=nbCol-1 && grid[pR][pC]==0){
        return true
    }
    return false
}


function updateWalls(dt){
    if (animation){
        timerWait-=dt
        if (timerWait<=0){
            timerWait=durationWait
            inc++
            if (dirWall=="V"){
                if (animationPart2 && isValid(posR+inc, posC)){
                    grid[posR+inc][posC]=3
                }else{
                    animationPart2=false
                }
                if (animationPart1 && isValid(posR-1-inc, posC)){
                    grid[posR-1-inc][posC]=2
                }else{
                    animationPart1=false
                }
            }else if (dirWall=="H"){
                if (animationPart2 && isValid(posR, posC+inc)){
                    grid[posR][posC+inc]=3
                }else{
                    animationPart2=false
                }
                if (animationPart1 && isValid(posR, posC-1-inc)){
                    grid[posR][posC-1-inc]=2
                }else{
                    animationPart1=false
                }
            }
            if (animationPart1==false){
                modifyGrid(grid, 2, 1)
            } 
            if (animationPart2==false){
                modifyGrid(grid, 3, 1)
            } 
            if (animationPart1==false  && animationPart2==false){
                animation=false
            }
        }
    }else{
        initGridCheck(gridCheck)
    }
}

function modifyGrid(pGrid, pID1, pID2){
    for(let r=0; r<nbRow; r++){
        for(let c=0; c<nbCol; c++){
            if(pGrid[r][c]==pID1){
                pGrid[r][c]=pID2
            }
        }
    } 
}



function updateBalls(dt){
    for(let i=0; i<listBalls.length; i++){
        let ball=listBalls[i]
        ball.x+=ball.vx*dt
        ball.y+=ball.vy*dt
        let id
        if (ball.vx>0){
            id=collideRight(ball)
            if (id==1){
                ball.x=(Math.floor((ball.x+ball.r)/cellSize)-1)*cellSize+cellSize/2
                ball.vx=-ball.vx 
              }else if (id==2){
                collide=true
                modifyGrid(grid, 2, 0)
                animationPart1=false
              }else if(id==3){
                collide=true
                modifyGrid(grid, 3, 0)
                animationPart2=false
            }
        }else if (ball.vx<0){
            id=collideLeft(ball)
            if(id==1){
                ball.x=(Math.floor((ball.x-ball.r)/cellSize)+1)*cellSize+cellSize/2
                ball.vx=-ball.vx 
            }else if (id==2){
                collide=true
                modifyGrid(grid, 2, 0)
                animationPart1=false
            }else if (id==3){
                collide=true
                modifyGrid(grid, 3, 0)
                animationPart2=false
            }
        }
        if (ball.vy>0){
            id=collideDown(ball)
            if (id==1){
                ball.y=(Math.floor((ball.y+ball.r)/cellSize)-1)*cellSize+cellSize/2
                ball.vy=-ball.vy
            }else if(id==2){
                collide=true
                modifyGrid(grid, 2, 0)
                animationPart1=false
            }else if(collideDown(ball)==3){
                collide=true
                modifyGrid(grid, 3, 0)
                animationPart2=false
            }
        } else if (ball.vy<0){
            id=collideUp(ball)
            if (id==1){
                ball.y=(Math.floor((ball.y-ball.r)/cellSize)+1)*cellSize+cellSize/2
                ball.vy=-ball.vy 
            }else if (id==2){
                collide=true
                modifyGrid(grid, 2, 0)
                animationPart1=false
            } else if (collideUp(ball)==3){
                collide=true
                modifyGrid(grid, 3, 0)
                animationPart2=false
            }
        }
    } 
    if (collide){
        explodeSound.play()
        collide=false
        nbLives--
        if (nbLives<=0){
            gameover=true
        }
    } 
}

function getTileAt(pX, pY){
    let r=Math.floor(pY/cellSize)
    let c=Math.floor(pX/cellSize)
    return grid[r][c]
}

function collideRight(pBall){
    let id=getTileAt(pBall.x+pBall.r, pBall.y)
    return id
}

function collideLeft(pBall){
    let id=getTileAt(pBall.x-pBall.r, pBall.y)
    return id
}

function collideUp(pBall){
    let id=getTileAt(pBall.x, pBall.y-pBall.r)
    return id
}

function collideDown(pBall){
    let id=getTileAt(pBall.x, pBall.y+pBall.r)
    return id
}

function floodFill(pR, pC){
    if (isValid(pR, pC)==false){
        return 
    } 
    if (gridCheck[pR][pC]==1){
        return 
    } 
    gridCheck[pR][pC]=1
    floodFill(pR-1, pC)
    floodFill(pR, pC+1)
    floodFill(pR+1, pC)
    floodFill(pR, pC-1)
}


function victoryCheck(){
    nbValidCases=0
    for(let r=0; r<nbRow; r++){
        for(let c=0; c<nbCol; c++){
          if (gridCheck[r][c]==1){
              nbValidCases++
          }else if (gridCheck[r][c]==0 && grid[r][c]==0){
              grid[r][c]=-1  
          }
        }
    } 
    pctClear=1-nbValidCases/maxValidCases
    if (pctClear>=pctThreshold){
        return true
    }
    return false
}

function drawWalls(){
    for(let r=0; r<nbRow; r++){
        for(let c=0; c<nbCol; c++){
            let x=c*cellSize
            let y=r*cellSize
            if (grid[r][c]==1){
                ctx.drawImage(ts, quadWall.x, quadWall.y, quadWall.w, quadWall.h, x, y, cellSize, cellSize)
            }else if(grid[r][c]==-1){
                ctx.fillStyle="rgb(0,0,0)"
                ctx.fillRect(x, y, cellSize, cellSize)
            }else{
                if (grid[r][c]==2){
                    ctx.fillStyle="rgb(255,0,0)"
                }else if (grid[r][c]==3){
                    ctx.fillStyle="rgb(0,0,255)"
                }else if(grid[r][c]==0){
                    ctx.fillStyle="rgb(204, 204,204)"
                }
                ctx.fillRect(x, y, cellSize-1, cellSize-1)
            }
        }
    }
}

function drawBalls(){
    ctx.fillStyle="rgb(204,0,204)"
    for(let i=0; i<listBalls.length; i++){
        let ball=listBalls[i]
        ctx.beginPath()
        ctx.arc(ball.x, ball.y, ball.r, 0, 2*Math.PI)
        ctx.fill()
    }
} 


function drawMark(){
    ctx.fillStyle="rgb(0, 0, 255)"
    if (isValid(posR0, posC0)){
        ctx.fillRect(posC0*cellSize, posR0*cellSize, cellSize, cellSize)
    }
    ctx.fillStyle="rgb(255, 0, 0)"
    if (dirWall=="V" && isValid(posR0-1, posC0)){
        ctx.fillRect(posC0*cellSize, (posR0-1)*cellSize, cellSize, cellSize)
    } else if (dirWall=="H" && isValid(posR0, posC0-1)){
        ctx.fillRect((posC0-1)*cellSize, posR0*cellSize, cellSize, cellSize)
    }   
}
function drawResults(){
    ctx.fillStyle="rgb(255,255,255)"
    ctx.font="20px Arial"
    let h=20
    ctx.fillText("Lives: "+nbLives+"          Level: "+level+"          Cleared area (%): "+Math.floor(pctClear*100), 0, (transY+h)/2)
}

function drawText(pText, pLevel){
    ctx.fillStyle="rgb(0, 0, 0, 0.8)"
    ctx.fillRect(0, 0, canW, canH)
    ctx.fillStyle="rgb(0, 255, 0)"
    ctx.font="30px Arial"
    let h=30
    let mainW=ctx.measureText(pText).width
    let subText="Enter level "+pLevel
    let subW=ctx.measureText(subText).width
    ctx.fillText(pText, (canW-mainW)/2, (canH-h)/2)
    ctx.fillText(subText, (canW-subW)/2, (canH-2*h)/2+60)
}

function drawEnding(pText){
    ctx.fillStyle="rgb(0, 0, 0, 0.8)"
    ctx.fillRect(0, 0, canW, canH)
    ctx.font="30px Arial"
    let h=30
    let mainW=ctx.measureText(pText).width
    let subText="ENTER TO RESTART"
    let subW=ctx.measureText(subText).width
    ctx.fillStyle="rgb(0,255,0)"
    ctx.fillText(pText, (canW-mainW)/2, (canH-h)/2)
    ctx.fillText(subText, (canW-subW)/2, (canH-2*h)/2+60)
}

function draw(){
    ctx.fillStyle="rgb(0,0,0)"
    ctx.fillRect(0, 0, canW, canH)

    drawResults()
    ctx.save()
    ctx.translate(transX, transY)
    drawWalls()
    drawBalls()
    if (oldMouseX!=mouseX || oldMouseY!=mouseY){
        drawMark()
    } 
    ctx.restore()
    
    if (pauseTransition){
        drawText("Congratulations", level+1)
    }
    if (gameover){
        drawEnding("GAME OVER")
    }
}


function gameLoop(time){
    if(oldTime!=0){
        dt=(time-oldTime)/1000
    }else {
        dt=0
    }
    update(dt)
    draw()
    oldTime=time
    requestAnimationFrame(gameLoop)
}