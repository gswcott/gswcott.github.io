nbRows=30
nbCols=2*nbRows-1
centerC=nbRows-1
cellSize=16
canW=nbCols*cellSize
canH=nbRows*cellSize
grid=[]
durationInterval=0.1
timerInterval=durationInterval
oldTime=0
countStep=1

window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    can.width=canW
    can.height=canH
    ctx=can.getContext("2d")
    initGrid()
    requestAnimationFrame(gameLoop)
}

function initGrid(){
    for(let i=0; i<nbRows; i++){
        grid[i]=[]
        for(let j=0; j<nbCols; j++){
            if(i==0 && j==centerC){
                grid[i][j]=1
            }else{
                grid[i][j]=0
            }
        }
    }  
}

function update(dt){
    timerInterval-=dt 
    if(countStep < nbRows){
        if (timerInterval<=0){
            updateGrid(countStep);
            countStep++; 
            timerInterval=durationInterval
        }
    }
} 

function updateGrid(row){
    for(let j=0; j<nbCols; j++){
        let x1=getValueGrid(row-1, j-1)
        let x2=getValueGrid(row-1, j)
        let x3=getValueGrid(row-1, j+1)
        grid[row][j]=getNextState(x1, x2, x3)
    }
    /* Je pensais que ca allait planter à cause des indices invalides, ca n'a pas planté, mais donner un autre résultat. Ca m'a étonné que ca n'avait pas planté.
    for(let j=0; j<nbCols; j++){
        grid[row][j]=getNextState(grid[row-1][j-1], grid[row-1][j], grid[row-1][j+1])
    }*/
}

function getValueGrid(r, c){
    if (c<0 || c>nbCols-1){
        return 0
    }else{
        return grid[r][c]
    }
}

function getNextState(x1, x2, x3){
    if(x1==1 && x2==1 && x3==1){
        return 0
    }else if(x1==1 && x2==1 && x3==0){
        return 0
    }else if(x1==1 && x2==0 && x3==1){
        return 0
    }else if(x1==1 && x2==0 && x3==0){
        return 1
    }else if(x1==0 && x2==1 && x3==1){
        return 1
    }else if(x1==0 && x2==1 && x3==0){
        return 1
    }else if(x1==0 && x2==0 && x3==1){
        return 1
    }else if(x1==0 && x2==0 && x3==0){
        return 0
    }
}

function drawGrid(){
    for(let i=0; i<nbRows; i++){
        for(let j=0; j<nbCols; j++){
            let value=grid[i][j]
            let x=j*cellSize
            let y=i*cellSize
            if(value==1){
                ctx.fillStyle="rgb(102, 102, 102)"
            }else {
                ctx.fillStyle="rgb(204, 204, 204)"
            }
            ctx.fillRect(x, y, cellSize-1, cellSize-1)
        }
    }
}

function draw(){
    ctx.fillStyle="rgb(0, 0, 0)"
    ctx.fillRect(0, 0, canW, canH)
    drawGrid()
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