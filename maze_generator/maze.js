window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    canW=can.width
    canH=can.height
    ctx=can.getContext("2d"); 
    buttons=document.querySelectorAll("button");
    console.log(buttons);
    cellSize=8
    nbRow=Math.floor(canH/cellSize)
    nbCol=Math.floor(canW/cellSize)
    gapCells=3 //at least 3 cells between rooms, and between rooms and borders
    minCells=3 //for a room
    maxCells=8 //for a room
    generateSimpleMaze()
    buttons[0].onclick = function() {
        generateSimpleMaze(); 
    }
    buttons[1].onclick = function() {
        generateComplexeMaze(); 
    }
}


function generateSimpleMaze(){
    init()
    explore(1, 1)
    draw()
}

function generateComplexeMaze(){
    init()
    rooms=[]
    createRooms(8)
    explore(1, 1)
    draw()
}

function init(){
    grid=[]
    for(let r=0; r<nbRow; r++){
        grid[r]=[]
        for(let c=0; c<nbCol; c++){
            grid[r][c]=0
        }
    }
}

function explore(pR, pC){
    digWall(pR, pC)
    let dirs=getDirection(pR, pC)
    while (dirs.length>0) {
        let i=Math.floor(Math.random()*dirs.length)
        let dir=dirs[i]
        if(dir==0){
            digWall(pR-1, pC)
            explore(pR-2, pC)
        }else if(dir==1){
            digWall(pR, pC+1)
            explore(pR, pC+2)
        }else if(dir==2){
            digWall(pR+1, pC)
            explore(pR+2, pC)
        }else if(dir==3){
            digWall(pR, pC-1)
            explore(pR, pC-2)
        }
        dirs=getDirection(pR, pC)
    }
}

function getDirection(pR, pC){
    let dirs=[]
    if(pR>2){
        if(grid[pR-2][pC]==0){
            dirs.push(0)
        }
    }
    if(pC<nbCol-3){
        if(grid[pR][pC+2]==0){
            dirs.push(1)
        }
    }
    if(pR<nbRow-3){
        if(grid[pR+2][pC]==0){
            dirs.push(2)
        }
    }
    if(pC>2){
        if(grid[pR][pC-2]==0){
            dirs.push(3)
        }
    }
    return dirs
}

function digWall(pR, pC){
    grid[pR][pC]=1
}

function draw(){
    for(let r=0; r<nbRow; r++){
        for(let c=0; c<nbCol; c++){
            if(grid[r][c]==1){
                ctx.fillStyle="rgb(50, 50, 50)"
            }else {
                ctx.fillStyle="rgb(200, 200, 200)"
            }
            ctx.fillRect(c*cellSize, r*cellSize, cellSize, cellSize)
        }
    }
}


function distRect(x1, y1, w1, h1, x2, y2, w2, h2){
    let rect1={}
    rect1.left=x1
    rect1.right=x1+w1
    rect1.top=y1
    rect1.bottom=y1+h1
    let rect2={}
    rect2.left=x2
    rect2.right=x2+w2
    rect2.top=y2
    rect2.bottom=y2+h2
    let distX, distY
    if(rect1.left>rect2.left){
        distX=rect1.left-rect2.right
    }else{
        distX=rect2.left-rect1.right
    }
    if(rect1.top>rect2.top){
        distY=rect1.top-rect2.bottom
    }else{
        distY=rect2.top-rect1.bottom
    }
    return distX, distY
}


function createRoom(pX, pY, pW, pH){
    let room={}
    room.x=pX
    room.y=pY
    room.w=pW
    room.h=pH
    rooms.push(room)
    minR=Math.floor(pY/cellSize)
    maxR=Math.floor((pY+pH)/cellSize)
    minC=Math.floor(pX/cellSize)
    maxC=Math.floor((pX+pW)/cellSize)
    for (let r=minR; r<=maxR; r++){
        for(let c=minC; c<=maxC; c++){
            grid[r][c]=1
        }
    }
}

 
function createRooms(pNb){
    let r=Math.random()*(maxCells-minCells)+minCells
    let c=Math.random()*(maxCells-minCells)+minCells
    //first room
    let x=(Math.random()*(nbCol-c-gapCells-gapCells)+gapCells)*cellSize
    let y=(Math.random()*(nbRow-r-gapCells-gapCells)+gapCells)*cellSize
    createRoom(x, y, c*cellSize, r*cellSize)
    for(let i=1; i<pNb; i++){
        let r1, c1, x1, y1, w1, h1
        r1=Math.random()*(maxCells-minCells)+minCells
        c1=Math.random()*(maxCells-minCells)+minCells
        w1=c1*cellSize
        h1=r1*cellSize
        let count=0
        while (count<rooms.length){
            x1=(Math.random()*(nbCol-c1-gapCells-gapCells)+gapCells)*cellSize
            y1=(Math.random()*(nbRow-r1-gapCells-gapCells)+gapCells)*cellSize
            count=0
            for (let j=rooms.length-1; j>=0; j--){
            let distX, distY=distRect(x1, y1, w1, h1, rooms[j].x, rooms[j].y, rooms[j].w, rooms[j].h)
            if (distX<gapCells*cellSize && distY<gapCells*cellSize) {
                break
            }else {
                count+=1
            }
            }  
        }
        if (count==rooms.length){
            createRoom(x1, y1, w1, h1)
        }
    }
}

