window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    ctx=can.getContext("2d")
    canV=document.getElementById("canV")
    ctxV=canV.getContext("2d")
    forwardBtn=document.getElementById("forwardBtn")
    leftBtn=document.getElementById("leftBtn")
    rightBtn=document.getElementById("rightBtn")
    nbCase=6
    caseSize=can.width/nbCase
    wallSize=caseSize/8
    up=1<<0
    right=1<<1
    down=1<<2
    left=1<<3
    matrixCase=new Array(nbCase)
    //margin=30
    for(var i=0; i<nbCase; i++){
        matrixCase[i]=new Array(nbCase)
        for(var j=0; j<nbCase; j++){
            matrixCase[i][j]=0
        }
    }
    wallBorder()
    posPlayerR=nbCase-1
    posPlayerC=nbCase-1
    dirPlayer=up
    drawAll()
    leftBtn.onclick=function(){
        turnLeft()
        drawAll()
    }
    rightBtn.onclick=function(){
        turnRight()
        drawAll()
    }
    forwardBtn.onclick=function(){
        forward()
        drawAll()
    }
    document.onkeydown=function(e){
        var keycode=e.code
        if(keycode=="ArrowLeft"){
            turnLeft()
            drawAll()
        }
        if(keycode=="ArrowRight"){
            turnRight()
            drawAll()
        }
        if(keycode=="ArrowUp"){
            forward()
            drawAll()
        }
    }
    can.addEventListener("mousedown", action)
}
function wallBorder(){
    for(var j=1; j<nbCase-1; j++){
        matrixCase[0][j]=up
    }
    for(var j=1; j<nbCase-1; j++){
        matrixCase[nbCase-1][j]=down
    }
    for(var i=1; i<nbCase-1; i++){
        matrixCase[i][0]=left
    }
    for(var i=1; i<nbCase-1; i++){
        matrixCase[i][nbCase-1]=right
    }
    matrixCase[0][0]=up+left
    matrixCase[0][nbCase-1]=up+right
    matrixCase[nbCase-1][0]=down+left
    matrixCase[nbCase-1][nbCase-1]=down+right
}

function turnLeft(){
    dirPlayer=(dirPlayer>>1)
    if(dirPlayer==0){
        dirPlayer=left
    }
}
function turnRight(){
    dirPlayer=(dirPlayer<<1)
    if(dirPlayer==16){
        dirPlayer=up
    }
}
function forward(){
    if (getWall(posPlayerR, posPlayerC, dirPlayer)==0){
        if(dirPlayer==up && posPlayerR>0){
            posPlayerR-=1
        }
        if(dirPlayer==right && posPlayerC<nbCase-1){
            posPlayerC+=1
        }
        if(dirPlayer==down && posPlayerR<nbCase-1){
            posPlayerR+=1
        }
        if(dirPlayer==left && posPlayerC>0){
            posPlayerC-=1
        }
    }
}

function drawAll(){
    drawGrid()
    drawMaze()
    drawPlayer(posPlayerR, posPlayerC)
    dirL=(dirPlayer>>1)
    if(dirL==0){
        dirL=left
    }
    dirR=(dirPlayer<<1)
    if(dirR==16){
         dirR=up
    }
    dirF=dirPlayer
    posRoomR=posPlayerR
    posRoomC=posPlayerC
    sideLeftWall=getWall(posRoomR, posRoomC, dirL)
    sideRightWall=getWall(posRoomR, posRoomC, dirR)
    sideFrontWall=getWall(posRoomR, posRoomC, dirF)
    view3D(0, 0, canV.width, canV.height, sideLeftWall, sideRightWall, sideFrontWall)
}

function drawGrid(){
    ctx.fillStyle="lightgray"      
    ctx.fillRect(0, 0, can.width, can.height)
    ctx.strokeStyle="black"
    ctx.lineWidth=1
    for(var i=1; i<nbCase; i++){
        ctx.beginPath()
        ctx.moveTo(0, i*caseSize)
        ctx.lineTo(can.width, i*caseSize)
        ctx.stroke()
    }
    for(var j=1; j<nbCase; j++){
        ctx.beginPath()
        ctx.moveTo(j*caseSize, 0)
        ctx.lineTo(j*caseSize, can.height)
        ctx.stroke()
    }
}

function getWall(r, c, dir){
    if(matrixCase[r][c]&dir){
        return dir
    }else {
        return 0
    }
}

function toggleWall(r, c, dir){
    if(getWall(r, c, dir)==0){
        matrixCase[r][c]+=dir
        if (dir==up && r>0){
            matrixCase[r-1][c]+=down
        }
        if (dir==right && c<nbCase-1){
            matrixCase[r][c+1]+=left
        } 
        if (dir==down && r<nbCase-1){
            matrixCase[r+1][c]+=up
        }
        if (dir==left && c>0){
            matrixCase[r][c-1]+=right
        } 
    }else{
        matrixCase[r][c]-=dir
        if (dir==up && r>0){
            matrixCase[r-1][c]-=down
        }
        if (dir==right && c<nbCase-1){
            matrixCase[r][c+1]-=left
        } 
        if (dir==down && r<nbCase-1){
            matrixCase[r+1][c]-=up
        }
        if (dir==left && c>0){
            matrixCase[r][c-1]-=right
        } 
    }
}

function drawWall(r, c, dir){
    ctx.fillStyle="green"
    if (dir==up){
        ctx.fillRect(c*caseSize, r*caseSize-wallSize/2, caseSize, wallSize)
    }
    if (dir==right){
        ctx.fillRect((c+1)*caseSize-wallSize/2, r*caseSize, wallSize, caseSize)
    }
    if (dir==down){
        ctx.fillRect(c*caseSize, (r+1)*caseSize-wallSize/2, caseSize, wallSize)
    }
    if (dir==left){
        ctx.fillRect(c*caseSize-wallSize/2, r*caseSize, wallSize, caseSize)
    }
}
function drawMaze(){
    for(var i=0; i<nbCase; i++){
        for(var j=0; j<nbCase; j++){
            for (var k=0; k<4; k++){
                if(getWall(i, j, 1<<k)){
                    drawWall(i, j, 1<<k)
                }
            }
        }
    }
}


function drawPlayer(r, c){
    ctx.beginPath()
    if (dirPlayer==up){
        ctx.moveTo(c*caseSize+caseSize/2, r*caseSize+caseSize/4)
        ctx.lineTo(c*caseSize+caseSize/8, r*caseSize+caseSize*3/4)
        ctx.lineTo(c*caseSize+caseSize*7/8, r*caseSize+caseSize*3/4)
        ctx.lineTo(c*caseSize+caseSize/2, r*caseSize+caseSize/4)
    }
    if (dirPlayer==right){
        ctx.moveTo(c*caseSize+caseSize*3/4, r*caseSize+caseSize/2)
        ctx.lineTo(c*caseSize+caseSize/4, r*caseSize+caseSize/8)
        ctx.lineTo(c*caseSize+caseSize/4, r*caseSize+caseSize*7/8)
        ctx.lineTo(c*caseSize+caseSize*3/4, r*caseSize+caseSize/2)
    }
    if (dirPlayer==down){
        ctx.moveTo(c*caseSize+caseSize/2, r*caseSize+caseSize*3/4)
        ctx.lineTo(c*caseSize+caseSize/8, r*caseSize+caseSize/4)
        ctx.lineTo(c*caseSize+caseSize*7/8, r*caseSize+caseSize/4)
        ctx.lineTo(c*caseSize+caseSize/2, r*caseSize+caseSize*3/4)
    }
    if (dirPlayer==left){
        ctx.moveTo(c*caseSize+caseSize/4, r*caseSize+caseSize/2)
        ctx.lineTo(c*caseSize+caseSize*3/4, r*caseSize+caseSize/8)
        ctx.lineTo(c*caseSize+caseSize*3/4, r*caseSize+caseSize*7/8)
        ctx.lineTo(c*caseSize+caseSize/4, r*caseSize+caseSize/2)
    }
    ctx.fillStyle="red"
    ctx.fill()
   
}
function action(e){
    var rect=can.getBoundingClientRect();
    var x=e.clientX-rect.left
    var y=e.clientY-rect.top
    var pi=Math.floor(y/caseSize)
    var pj=Math.floor(x/caseSize)
    if(pi>=0 && pi<nbCase && pj>=0 && pj<nbCase){
        var dist=new Array(4)
        dist[0]=Math.abs(y-pi*caseSize)
        dist[1]=Math.abs(x-(pj+1)*caseSize)
        dist[2]=Math.abs(y-(pi+1)*caseSize)
        dist[3]=Math.abs(x-pj*caseSize)
        var wallIndex=1<<dist.indexOf(Math.min.apply(Math, dist))
        toggleWall(pi,pj, wallIndex)
        drawAll()
    }
}

function view3D(wS, hS, w, h, sideL, sideR, sideF){
    ctxV.fillStyle="black" 
    ctxV.strokeStyle="black" 
    ctxV.fillRect(wS, hS, w, h) 
    ctxV.strokeRect(wS, hS, w, h)

    ctxV.fillRect(wS+1/4*w, hS+1/4*h, 1/2*w, 1/2*h)
    ctxV.strokeRect(wS+1/4*w, hS+1/4*h, 1/2*w, 1/2*h)

    ctxV.beginPath()
    ctxV.strokeStyle="black"
    ctxV.moveTo(wS, hS)
    ctxV.lineTo(wS+1/4*w, hS+1/4*h)
    ctxV.stroke()

    ctxV.beginPath()
    ctxV.moveTo(wS, hS+h)
    ctxV.lineTo(wS+1/4*w, hS+3/4*h)
    ctxV.stroke()

    ctxV.beginPath()
    ctxV.moveTo(wS+w, hS+h)
    ctxV.lineTo(wS+3/4*w, hS+3/4*h)
    ctxV.stroke()

    ctxV.beginPath()
    ctxV.moveTo(wS+w, hS)
    ctxV.lineTo(wS+3/4*w, hS+1/4*h)
    ctxV.stroke()
    //floor
    ctxV.beginPath()
    ctxV.fillStyle="rgb(165,42,42)"
    ctxV.strokeStyle="black" 
    ctxV.moveTo(wS+1/4*w, hS+3/4*h)
    ctxV.lineTo(wS+3/4*w, hS+3/4*h)
    ctxV.lineTo(wS+w, hS+h)
    ctxV.lineTo(wS, hS+h)
    ctxV.lineTo(wS+1/4*w, hS+3/4*h)
    ctxV.fill()
    ctxV.stroke()

    //ceil
    ctxV.beginPath()
    ctxV.fillStyle="lightblue"
    ctxV.strokeStyle="black" 
    ctxV.moveTo(wS+1/4*w, hS+1/4*h)
    ctxV.lineTo(wS+3/4*w, hS+1/4*h)
    ctxV.lineTo(wS+w, hS)
    ctxV.lineTo(wS, hS)
    ctxV.lineTo(wS+1/4*w, hS+1/4*h)
    ctxV.fill()
    ctxV.stroke()

    if(sideL){
        ctxV.beginPath()
        ctxV.fillStyle="green" 
        ctxV.strokeStyle="black" 
        ctxV.moveTo(wS, hS)
        ctxV.lineTo(wS+1/4*w, hS+1/4*h)
        ctxV.lineTo(wS+1/4*w, hS+3/4*h)
        ctxV.lineTo(wS, hS+h)
        ctxV.moveTo(wS, hS)
        ctxV.fill()
        ctxV.stroke()
    }
    if(sideR){
        ctxV.beginPath()
        ctxV.fillStyle="green" 
        ctxV.strokeStyle="black" 
        ctxV.moveTo(wS+w, hS)
        ctxV.lineTo(wS+3/4*w, hS+1/4*h)
        ctxV.lineTo(wS+3/4*w, hS+3/4*h)
        ctxV.lineTo(wS+w, hS+h)
        ctxV.moveTo(wS+w, hS)
        ctxV.fill()
        ctxV.stroke()
    }
    if(sideF){
        ctxV.fillStyle="green" 
        ctxV.fillRect(wS+1/4*w, hS+1/4*h, 1/2*w, 1/2*h)
        ctxV.strokeStyle="black" 
        ctxV.strokeRect(wS+1/4*w, hS+1/4*h, 1/2*w, 1/2*h)
    }else{
        if (dirPlayer==up){
            posRoomR--
        }
        if (dirPlayer==down){
            posRoomR++
        }
        if (dirPlayer==left){
            posRoomC--
        }
        if (dirPlayer==right){
            posRoomC++
        }
        sideLeftWall=getWall(posRoomR, posRoomC, dirL)
        sideRightWall=getWall(posRoomR, posRoomC, dirR)
        sideFrontWall=getWall(posRoomR, posRoomC, dirF)
        view3D(wS+1/4*w, hS+1/4*h, 1/2*w, 1/2*h, sideLeftWall, sideRightWall, sideFrontWall)
    }
}

