
n=14 // number of experiments (go left or go right)
size=10 // size of a grid cell
startNbRows=4
endNbRows=50
nbRows=startNbRows+2*n+endNbRows
nbCols=n*4+1
canW=nbCols*size
canH=nbRows*size
listBalls=[]
totalBalls=600
countBall=0
grid=[]
centerC=Math.floor(nbCols/2)
durationIntervalAdd=0.3
durationIntervalMove=durationIntervalAdd/2
timerIntervalAdd=durationIntervalAdd
timerIntervalMove=durationIntervalMove

oldTime=0

window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    can.width=canW
    can.height=canH
    ctx=can.getContext("2d")
    initGrid()
    addBall()
    requestAnimationFrame(gameLoop)
}

function initGrid(){
    for(let i=0; i<nbRows; i++){
        grid[i]=[]
        for(let j=0; j<nbCols; j++){
            if (i<startNbRows-1){
                if (j==centerC-1){
                    grid[i][j]=3
                }else if(j==centerC+1){
                    grid[i][j]=4
                }else{
                    grid[i][j]=0
                }
            }else if (i<startNbRows){
                grid[i][j]=0
            }else if (i<startNbRows+2*n){
                if ((i-startNbRows)%4==0){
                    if(j%4==0){
                        grid[i][j]=1
                    }else{
                        grid[i][j]=0
                    }
                }else if ((i-startNbRows)%4==1 || (i-startNbRows)%4==3){
                    grid[i][j]=0
                }else if ((i-startNbRows)%4==2){
                    if (j%4==2){
                        grid[i][j]=1
                    }else{
                        grid[i][j]=0
                    }
                }
            }else{
                if(j%4==2){
                    grid[i][j]=2
                }else{
                    grid[i][j]=0
                }
            }
        }    
    }
}
function getRandomInt(nb){
    return Math.floor(Math.random()*nb)
}

function addBall(){
    let ball={}
    ball.x=centerC*size+size/2
    ball.y=size/2
    ball.r=size/2
    ball.vx=0
    ball.vy=size
    ball.color=[getRandomInt(256), getRandomInt(256), getRandomInt(256)]
    listBalls.push(ball)
}

function update(dt){
    timerIntervalAdd-=dt 
    timerIntervalMove-=dt
    //console.log(timerIntervalAdd, timerIntervalMove)
    if (timerIntervalMove<=0){
        updateBalls()
        timerIntervalMove=durationIntervalMove
    } 
    if (countBall < totalBalls){
        if (timerIntervalAdd<=0){
            addBall()
            countBall++
            timerIntervalAdd=durationIntervalAdd
        }
    } 
}

function updateBalls(){
    for(let i=0; i<listBalls.length; i++){
        let ball=listBalls[i]
        ball.x=ball.x+ball.vx
        ball.y=ball.y+ball.vy
        let r=Math.floor((ball.y-size/2)/size)
        let c=Math.floor((ball.x-size/2)/size)
        let belowBall=below(r,c)
        if(r<startNbRows+2*n-1){
            if(belowBall==1){
                let num=Math.random()
                if (num<0.5){
                    ball.vx=-size
                }else{
                    ball.vx=size
                }
            }
        }else{
            ball.vx=0
            if(belowBall==-1){
                if(r<nbRows-1 && c<nbCols-1 && grid[r+1][c+1]==0){
                    ball.x=ball.x+size
                    ball.y=ball.y+size
                }else if(r<nbRows-1 && c>0 && grid[r+1][c-1]==0){
                    ball.x=ball.x-size
                    ball.y=ball.y+size
                }else{
                    grid[r][c]=-1
                }
                ball.vy=0
            }
        }
    }
}

function below(pR, pC){
    if(pR>=nbRows-1){
        return -1
    }
    return grid[pR+1][pC]
}

function drawGrid(){
    ctx.fillStyle="rgb(51, 0, 51)"
    for(let i=0; i<nbRows; i++){
        for(let j=0; j<nbCols; j++){
            let value=grid[i][j]
            let x=j*size
            let y=i*size
            if(value==1){
                ctx.beginPath()
                ctx.arc(x+size/2, y+size/2, size/2, 0, 2*Math.PI)
                ctx.fill()
            }else if(value==2){
                ctx.fillRect(x, y, size, size)
            }else if(value==3){
                ctx.fillRect(x, y, size/2, size)
            }else if(value==4){
                ctx.fillRect(x+size/2, y, size/2, size)
            }
        }
    }
}

function drawBalls(){
    for(let i=0; i<listBalls.length; i++){
        let ball=listBalls[i]
        ctx.fillStyle="rgb("+ ball.color[0]+ ", "+ ball.color[1]+ ", "+ ball.color[2]+ ")"
        ctx.beginPath()
        ctx.arc(ball.x, ball.y, ball.r, 0, 2*Math.PI)
        ctx.fill()
    }
}

function draw(){
    ctx.fillStyle="rgb(0, 0, 0)"
    ctx.fillRect(0, 0, canW, canH)
    //ctx.save()
    //ctx.scale(1/2, 1/2)
    drawGrid()
    drawBalls()
    //ctx.restore()
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