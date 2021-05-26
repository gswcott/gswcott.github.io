let can, canW, canH, ctx
let nbRow=31 
let nbCol=28
let cellSize=16
let transX=0
let transY=0
let pacman={}
let listGhosts=[]
let listRects=[]
let gameover=false
let victory=false
let timeGame=0
let imgGhost, bgMusic
//let explodeSound
let oldTime=0
let dirs=["up", "right", "down", "left"]
let grid
let score, totalPoints
let sValue=10
let mValue=100
let imgs={}
let chompSound, deathSound, eatGhostSound

window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    ctx=can.getContext("2d")
    canW=can.width
    canH=can.height
    transY=(canH-cellSize*nbRow)/2
    loadImages()
    chompSound=new Audio()
    chompSound.src="sounds/pacman_chomp.wav"
    deathSound=new Audio()
    deathSound.src="sounds/pacman_death.wav"
    eatGhostSound=new Audio()
    eatGhostSound.src="sounds/pacman_eatghost.wav"
    initGame()
    getAllRects()
    document.onkeydown=changeDir
    requestAnimationFrame(gameLoop)
}
function loadImages(){
    imgs[1]=new Image()
    imgs[1].src="images/spriteRed.png"
    imgs[2]=new Image()
    imgs[2].src="images/spritePink.png"
    imgs[3]=new Image()
    imgs[3].src="images/spriteBlue.png"
    imgs[4]=new Image()
    imgs[4].src="images/spriteOrange.png"
    imgs["a"]=new Image()
    imgs["a"].src="images/spriteAfraid.png"

}
function initGame(){
    grid=[
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        [4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4],
        [4, 2, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 2, 4, 4, 2, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 2, 4], 
        [4, 3, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 2, 4, 4, 2, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 3, 4], 
        [4, 2, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 2, 4, 4, 2, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 2, 4], 
        [4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4],
        [4, 2, 4, 4, 4, 4, 2, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 2, 4, 4, 4, 4, 2, 4],
        [4, 2, 4, 4, 4, 4, 2, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 2, 4, 4, 4, 4, 2, 4],
        [4, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 4],
        [4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 1, 4, 4, 1, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4],
        [0, 0, 0, 0, 0, 4, 2, 4, 4, 4, 4, 4, 1, 4, 4, 1, 4, 4, 4, 4, 4, 2, 4, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 4, 2, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 2, 4, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 4, 2, 4, 4, 1, 4, 4, 4, 5, 5, 4, 4, 4, 1, 4, 4, 2, 4, 0, 0, 0, 0, 0],
        [4, 4, 4, 4, 4, 4, 2, 4, 4, 1, 4, 0, 0, 0, 0, 0, 0, 4, 1, 4, 4, 2, 4, 4, 4, 4, 4, 4],
        [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 4, 0, 0, 0, 0, 0, 0, 4, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
        [4, 4, 4, 4, 4, 4, 2, 4, 4, 1, 4, 0, 0, 0, 0, 0, 0, 4, 1, 4, 4, 2, 4, 4, 4, 4, 4, 4],
        [0, 0, 0, 0, 0, 4, 2, 4, 4, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 4, 4, 2, 4, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 4, 2, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 2, 4, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 4, 2, 4, 4, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 4, 4, 2, 4, 0, 0, 0, 0, 0],
        [4, 4, 4, 4, 4, 4, 2, 4, 4, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 4, 4, 2, 4, 4, 4, 4, 4, 4],
        [4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4],
        [4, 2, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 2, 4, 4, 2, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 2, 4], 
        [4, 2, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 2, 4, 4, 2, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 2, 4], 
        [4, 3, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 3, 4],
        [4, 4, 4, 2, 4, 4, 2, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 2, 4, 4, 2, 4, 4, 4],
        [4, 4, 4, 2, 4, 4, 2, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 2, 4, 4, 2, 4, 4, 4],
        [4, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 4],
        [4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4],
        [4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4],
        [4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4],
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
        ]
    totalPoints=0
    for(let r=0; r<nbRow; r++){
        for(let c=0; c<nbCol; c++){
            if (grid[r][c]==2){
                totalPoints+=10
            }else if(grid[r][c]==3){
                totalPoints+=100
            }
        }
    } 
    createPacman()
    listGhosts=[]
    let ghost1=createGhost(1, 27/2*cellSize, 21/2*cellSize, [255, 0, 0], 0.3)
    ghost1.active=true
    ghost1.out=true
    createGhost(2, 27/2*cellSize, 29/2*cellSize, [255, 179, 230], 0.25)
    createGhost(3, 23/2*cellSize, 29/2*cellSize, [140, 204, 204], 0.22)
    createGhost(4, 31/2*cellSize, 29/2*cellSize, [255, 102, 52], 0.15)
    gameover=false
    victory=false
    timeGame=0
    score=0
}


function createPacman(){
    pacman={}
    pacman.x=27/2*cellSize
    pacman.y=47/2*cellSize
    pacman.r=12
    pacman.dir="right"
    pacman.angle=90/180*Math.PI
    pacman.lives=3
    pacman.touched=false
    pacman.potion=false
    pacman.timePotion=8
    pacman.timerP=pacman.timePotion
    pacman.timeForward=0.15
    pacman.timerF=pacman.timeForward
    pacman.animation=true
    pacman.timeAnimation=pacman.timeForward*2
    pacman.timerA=pacman.timeAnimation
    pacman.open=true
    pacman.timeIntouchable=3
    pacman.timerI=pacman.timeIntouchable
}

function createGhost(pID, pX, pY, pC, pT){
    let ghost={}
    ghost.id=pID
    ghost.x=pX
    ghost.y=pY
    ghost.c=pC
    ghost.timeForward=pT
    ghost.timerF=ghost.timeForward
    ghost.dir="up"
    ghost.active=false
    ghost.out=false
    listGhosts.push(ghost)
    return ghost
}


function getAllRects(){
  getRect(5/2*cellSize, 5/2*cellSize, 3*cellSize, 2*cellSize)
  getRect(5/2*cellSize, 13/2*cellSize, 3*cellSize, 1*cellSize)
  getRect(15/2*cellSize, 5/2*cellSize, 4*cellSize, 2*cellSize)
  getRect(33/2*cellSize, 5/2*cellSize, 4*cellSize, 2*cellSize)
  getRect(45/2*cellSize, 5/2*cellSize, 3*cellSize, 2*cellSize)
  getRect(45/2*cellSize, 13/2*cellSize, 3*cellSize, 1*cellSize)
  getRect(21/2*cellSize, 25/2*cellSize, 7*cellSize, 4*cellSize)
  getRect(15/2*cellSize, 31/2*cellSize, 1*cellSize, 4*cellSize)
  getRect(39/2*cellSize, 31/2*cellSize, 1*cellSize, 4*cellSize)
  
  getRect(15/2*cellSize, 13/2*cellSize, 1*cellSize, 7*cellSize)
  getRect(17/2*cellSize, 19/2*cellSize, 3*cellSize, 1*cellSize)
  
  getRect(21/2*cellSize, 13/2*cellSize, 7*cellSize, 1*cellSize)
  getRect(27/2*cellSize, 15/2*cellSize, 1*cellSize, 3*cellSize)

  getRect(39/2*cellSize, 13/2*cellSize, 1*cellSize, 7*cellSize)
  getRect(33/2*cellSize, 19/2*cellSize, 3*cellSize, 1*cellSize)
  
  getRect(21/2*cellSize, 37/2*cellSize, 7*cellSize, 1*cellSize)
  getRect(27/2*cellSize, 39/2*cellSize, 1*cellSize, 3*cellSize)
  
  getRect(21/2*cellSize, 49/2*cellSize, 7*cellSize, 1*cellSize)
  getRect(27/2*cellSize, 51/2*cellSize, 1*cellSize, 3*cellSize)
  getRect(15/2*cellSize, 43/2*cellSize, 4*cellSize, 1*cellSize)
  getRect(33/2*cellSize, 43/2*cellSize, 4*cellSize, 1*cellSize)
  
  getRect(5/2*cellSize, 43/2*cellSize, 3*cellSize, 1*cellSize)
  getRect(9/2*cellSize, 45/2*cellSize, 1*cellSize, 3*cellSize)
  
  getRect(45/2*cellSize, 43/2*cellSize, 3*cellSize, 1*cellSize)
  getRect(45/2*cellSize, 45/2*cellSize, 1*cellSize, 3*cellSize)

  getRect(5/2*cellSize, 55/2*cellSize, 9*cellSize, 1*cellSize)
  getRect(15/2*cellSize, 49/2*cellSize, 1*cellSize, 3*cellSize)

  getRect(33/2*cellSize, 55/2*cellSize, 9*cellSize, 1*cellSize)
  getRect(39/2*cellSize, 49/2*cellSize, 1*cellSize, 3*cellSize)
  
  getRect(0*cellSize, 0*cellSize, nbCol*cellSize, 1/2*cellSize)
  
  getRect(0*cellSize, 1/2*cellSize, cellSize/2, 9*cellSize)
  getRect(0*cellSize, 19/2*cellSize, 11/2*cellSize, 1/2*cellSize)
  getRect(5*cellSize, 20/2*cellSize, 1/2*cellSize, 3*cellSize)
  getRect(0*cellSize, 26/2*cellSize, 11/2*cellSize, 1/2*cellSize)
  
  getRect(27/2*cellSize, 1/2*cellSize, 1*cellSize, 4*cellSize)
  
  getRect((nbCol-1/2)*cellSize, 1/2*cellSize, cellSize/2, 9*cellSize)
  getRect(45/2*cellSize, 19/2*cellSize, 11/2*cellSize, 1/2*cellSize)
  getRect(45/2*cellSize, 20/2*cellSize, 1/2*cellSize, 3*cellSize)
  getRect(45/2*cellSize, 26/2*cellSize, 11/2*cellSize, 1/2*cellSize)
  
  
  getRect(0*cellSize, 31/2*cellSize, 11/2*cellSize, 1/2*cellSize)
  getRect(5*cellSize, 32/2*cellSize, 1/2*cellSize, 3*cellSize)
  getRect(0*cellSize, 38/2*cellSize, 11/2*cellSize, 1/2*cellSize)
  getRect(0*cellSize, 39/2*cellSize, 1/2*cellSize, 11*cellSize)
  getRect(1/2*cellSize, 49/2*cellSize, 2*cellSize, 1*cellSize)
  
  getRect(45/2*cellSize, 31/2*cellSize, 11/2*cellSize, 1/2*cellSize)
  getRect(45/2*cellSize, 32/2*cellSize, 1/2*cellSize, 3*cellSize)
  getRect(45/2*cellSize, 38/2*cellSize, 11/2*cellSize, 1/2*cellSize)
  getRect((nbCol-1/2)*cellSize, 39/2*cellSize, 1/2*cellSize, 11*cellSize)
  getRect(51/2*cellSize, 49/2*cellSize, 2*cellSize, 1*cellSize)
    
  getRect(0*cellSize, (nbRow-1/2)*cellSize, nbCol*cellSize, 1/2*cellSize)
    
}

function getRect(pX, pY, pW, pH){
    let rect={}
    rect.x=pX
    rect.y=pY
    rect.w=pW
    rect.h=pH
    listRects.push(rect)
}

function changeDir(e){
    let key=e.code
    if(gameover==false){
        if (key=="ArrowRight"){
            pacman.dir="right"
        }else if(key=="ArrowLeft"){
            pacman.dir="left"
        }else if(key=="ArrowUp"){
            pacman.dir="up"
        }else if(key=="ArrowDown"){
            pacman.dir="down"
        }
    }else{
        if (key=="Enter"){
            initGame()
        }
    }
    if(victory){
        if (key=="Enter"){
            initGame()
        } 
    }
}


function update(dt){
    if (victory==false){
        timeGame=timeGame+dt
        for(let i=0; i<listGhosts.length; i++){
            let ghost=listGhosts[i]
            if (ghost.id==2 && ghost.active==false && timeGame>5){
                ghost.active=true
            }else if (ghost.id==3 && ghost.active==false && timeGame>10){
                ghost.active=true
            }else if(ghost.id==4 && ghost.active==false & timeGame>15){
                ghost.active=true
            }
        } 
        updatePacman(dt)
        updateGhosts(dt)
        if(score==totalPoints){
            victory=true
            pacman.open=true
        }
    }

}

function updatePacman(dt){
    if (gameover==false){
        if (pacman.animation){
            pacman.timerA=pacman.timerA-dt 
            if (pacman.timerA<=0){
                pacman.timerA=pacman.timeAnimation
                if (pacman.open){
                    pacman.a1=0
                    pacman.a2=360/180*Math.PI
                    pacman.open=false
                }else{
                    getAngles()
                    pacman.open=true
                }
            }
        }else{
            pacman.open=true
            getAngles()
        }
        pacman.timerF=pacman.timerF-dt 
        if (pacman.timerF<=0){
            pacman.timerF=pacman.timeForward
            let id
            if (pacman.dir=="right"){
                id=getTileAt(pacman.x+cellSize, pacman.y)
                if (isSolid(id)==false){
                    pacman.x=pacman.x+cellSize
                    pacman.animation=true
                }else{
                    pacman.animation=false
                }
            } else if (pacman.dir=="left"){
                id=getTileAt(pacman.x-cellSize, pacman.y)
                if (isSolid(id)==false){
                    pacman.x=pacman.x-cellSize
                    pacman.animation=true
                }else{
                    pacman.animation=false
                }
            }else if (pacman.dir=="up"){
                id=getTileAt(pacman.x, pacman.y-cellSize)
                if (isSolid(id)==false){
                    pacman.y=pacman.y-cellSize
                    pacman.animation=true
                }else{
                    pacman.animation=false
                }
            }else if (pacman.dir=="down"){
                id=getTileAt(pacman.x, pacman.y+cellSize)
                if (isSolid(id)==false){
                    pacman.y=pacman.y+cellSize
                    pacman.animation=true
                }else{
                    pacman.animation=false
                }
            }
            if (id==2 || id==3){
                modifyGrid(pacman.x-cellSize/2, pacman.y-cellSize/2)
                if (id==2){
                    score+=sValue
                    chompSound.play()
                }
                if (id==3){
                    pacman.potion=true
                    score+=mValue
                    chompSound.play()
                }
            }
            if (pacman.x<-cellSize){
                pacman.x=(nbCol-1)*cellSize+cellSize/2
                pacman.dir="left"
            }
            if (pacman.x>nbCol*cellSize){
                pacman.x=-cellSize*3/2
                pacman.dir="right"
            }
        }
        //collide
        if (pacman.touched){
            pacman.timerI-=dt 
            if (pacman.timerI<=0){
              pacman.timerI=pacman.timeIntouchable
              pacman.touched=false
              pacman.timerF=pacman.timeForward
            } 
        }else{
            for(let i=listGhosts.length-1; i>=0; i--){
                let ghost=listGhosts[i]
                if (collide(pacman, ghost)){
                    if(pacman.potion){
                        listGhosts.splice(i, 1)
                        eatGhostSound.play()
                    }else{
                        pacman.touched=true
                        deathSound.play()
                        pacman.lives--
                        if (pacman.lives<=0){
                          gameover=true
                        }
                        break
                    }
                }
            }  
        }
        //potion
        if (pacman.potion==true){
            pacman.timerP=pacman.timerP-dt 
            if (pacman.timerP<=0){
                pacman.potion=false
                pacman.timerP=pacman.timePotion
            }
        } 
    }
}

function getAngles(){
    if (pacman.dir=="right"){
        pacman.a1=pacman.angle/2
        pacman.a2=2*Math.PI-pacman.a1
    }else if (pacman.dir=="left"){
        pacman.a1=Math.PI+pacman.angle/2
        pacman.a2=Math.PI-pacman.angle/2+2*Math.PI
    }else if (pacman.dir=="up"){
        pacman.a1=Math.PI*3/2+pacman.angle/2  
        pacman.a2=Math.PI*3/2-pacman.angle/2+2*Math.PI
    }else if (pacman.dir=="down"){
        pacman.a1=Math.PI/2+pacman.angle/2
        pacman.a2=Math.PI/2-pacman.angle/2+2*Math.PI
    }
}


function getTileAt(pX, pY){
    let r=Math.floor(pY/cellSize)
    let c=Math.floor(pX/cellSize)
    return grid[r][c]
}

function isSolid(pID){
    if (pID==4 || pID==5){
        return true
    }
    return false
}

function isThrough(pID){
    if (pID==4){
        return false
    }
    return true
}

function modifyGrid(pX, pY){
    let r, c
    r=Math.floor(pY/cellSize)
    c=Math.floor(pX/cellSize)
    grid[r][c]=1
}

function collide(pP, pG){
    if ((Math.abs(pP.x-pG.x-cellSize)<=3/2*cellSize && pP.y==pG.y+cellSize) 
        || (Math.abs(pP.y-pG.y-cellSize)<=3/2*cellSize && pP.x==pG.x+cellSize)){
        return true
    }
    return false
}


function updateGhosts(dt){
    for(let i=0; i<listGhosts.length; i++){
        let ghost=listGhosts[i]
        if (ghost.id==1){
            updateGhost1(ghost, dt)
        }else if (ghost.id==2){
            updateGhost2(ghost, dt)
        }else if (ghost.id==3){
            updateGhost3(ghost, dt)
        }else if (ghost.id==4){
            updateGhost4(ghost, dt)
        }
    }
}

function updateGhost1(pGhost, dt){
    pGhost.timerF=pGhost.timerF-dt
    if (pGhost.timerF<=0){
        pGhost.timerF=pGhost.timeForward
      moveGhost(pGhost)
    }
}
function updateGhost2(pGhost, dt){
    pGhost.timerF=pGhost.timerF-dt
    if (pGhost.timerF<=0){
        pGhost.timerF=pGhost.timeForward
        if (pGhost.out){
            moveGhost(pGhost)
        }else{
            if (pGhost.active){
                pGhost.dir="up"
                id=getTileAt(pGhost.x, pGhost.y)
                if (isThrough(id)){
                    pGhost.y=pGhost.y-cellSize
                    if (pGhost.y<=21/2*cellSize){
                        pGhost.out=true
                    }
                } 
            }else{
                upDownGhost(pGhost)
            }
        }
    }
}

function updateGhost3(pGhost,dt){
    pGhost.timerF=pGhost.timerF-dt
    if (pGhost.timerF<=0){
        pGhost.timerF=pGhost.timeForward
        if (pGhost.out){
            moveGhost(pGhost)
        }else{
            if (pGhost.active){
                if (pGhost.x<27/2*cellSize){
                    pGhost.dir="right"
                    pGhost.x=pGhost.x+cellSize 
                } else{
                    pGhost.dir="up" 
                    if (isThrough(id)){
                        pGhost.y=pGhost.y-cellSize
                        if (pGhost.y<=21/2*cellSize){
                            pGhost.out=true
                        } 
                    }
                }
            }else{
                upDownGhost(pGhost)
            }
        }
    }
}

function updateGhost4(pGhost, dt){
    pGhost.timerF=pGhost.timerF-dt
    if (pGhost.timerF<=0){
        pGhost.timerF=pGhost.timeForward
        if (pGhost.out){
            moveGhost(pGhost)
        }else{
            if (pGhost.active){
                if (pGhost.x>27/2*cellSize){
                    pGhost.dir="left"
                    pGhost.x=pGhost.x-cellSize 
                }else{
                    pGhost.dir="up" 
                    if (isThrough(id)){
                        pGhost.y=pGhost.y-cellSize
                        if (pGhost.y<=21/2*cellSize){
                            pGhost.out=true
                        } 
                    }
                }
            }else{
                upDownGhost(pGhost)
            }
        }
    }
}
/*
function closeToPacman(pGhost){
    let distX=pacman.x-pGhost.x-cellSize
    let distY=pacman.y-pGhost.y-cellSize
    if (distX*distX+distY*distY<=25*cellSize*cellSize){
        return true
    }
    return false
}*/

function getDist(x1,y1,x2,y2){
    return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))
} 


function moveGhost(pGhost){
    if (pGhost.x<0){
        pGhost.dir="left"
    }else if (pGhost.x>(nbCol-2)*cellSize){
        pGhost.dir="right"
    //}else if(pacman.potion && closeToPacman(pGhost)){
    }else if(pacman.potion){
        getRandomDir2(pGhost)
    }else{
        getRandomDir1(pGhost)
    }
    
    if (pGhost.dir=="up"){
        pGhost.y=pGhost.y-cellSize
    }else if (pGhost.dir=="right"){
        pGhost.x=pGhost.x+cellSize
    }else if (pGhost.dir=="down"){
        pGhost.y=pGhost.y+cellSize
    }else if (pGhost.dir=="left" ){
        pGhost.x=pGhost.x-cellSize
    }

    if (pGhost.x<-3/2*cellSize){
        pGhost.x=nbCol*cellSize+pGhost.x
        pGhost.dir="left"
    }
    if (pGhost.x>(nbCol-1/2)*cellSize){
        pGhost.x=pGhost.x-nbCol*cellSize
        pGhost.dir="right"
    }
}



function getDispoDirs(pGhost, pEtat){
    let ids=[]
    let dists=[]
    ids[0]=getTileAt(pGhost.x+cellSize, pGhost.y)
    ids[1]=getTileAt(pGhost.x+2*cellSize, pGhost.y+cellSize)
    ids[2]=getTileAt(pGhost.x+cellSize, pGhost.y+2*cellSize)
    ids[3]=getTileAt(pGhost.x, pGhost.y+cellSize)
    dists[0]=getDist(pacman.x, pacman.y, pGhost.x+cellSize, pGhost.y)
    dists[1]=getDist(pacman.x, pacman.y, pGhost.x+2*cellSize, pGhost.y+cellSize)
    dists[2]=getDist(pacman.x, pacman.y, pGhost.x+cellSize, pGhost.y+2*cellSize)
    dists[3]=getDist(pacman.x, pacman.y, pGhost.x, pGhost.y+cellSize)
    let k
    let dirsP=[]
    let distsP=[]
    for(let i=0; i<4; i++){
        if (dirs[i]==pGhost.dir){
            k=(i+2)%4
        }
        if (isSolid(ids[i])==false){
            dirsP.push(dirs[i])
            distsP.push(dists[i])
        }
    }
    if(pEtat=="Attack"){
        let index=dirsP.indexOf(dirs[k])
        if (index!=-1){
            dirsP.splice(index, 1)
            distsP.splice(index, 1)
        } 
    }
    let orderedDist=[]
    let orderedID=[]
    orderedDist.push(dists[0])
    orderedID.push(0)
    for(let i=1; i<dirsP.length; i++){
        let j=0
        while (j<=orderedDist.length-1 && distsP[i]>=orderedDist[j]){
            j++
        }
        orderedDist.splice(j, 0, distsP[i])
        orderedID.splice(j, 0,  i)
    } 
    //console.log("coucou")
    /*for(let i=0; i<orderedDist.length; i++){
        console.log(orderedDist[i])
    }*/
    return [dirsP, orderedID]
}

function getRandomDir1(pGhost){
    let res=getDispoDirs(pGhost, "Attack")
    let dirsP=res[0]
    let orderedID=res[1]
    let num=Math.random()
    if (dirsP.length==4){
        if (num<=0.5){
            pGhost.dir=dirsP[orderedID[0]]
        }else if (num<=0.75){
            pGhost.dir=dirsP[orderedID[1]]
        } else if (num<=0.9){
            pGhost.dir=dirsP[orderedID[2]]
        }else if (num<=1){
            pGhost.dir=dirsP[orderedID[3]]
        }
    }else if(dirsP.length==3){
        if (num<=0.7){
            pGhost.dir=dirsP[orderedID[0]]
        } else if (num<=0.9){
            pGhost.dir=dirsP[orderedID[1]]
        } else if (num<=1){
            pGhost.dir=dirsP[orderedID[2]]
        }
    }else if (dirsP.length==2){
        if (num<=0.8){
            pGhost.dir=dirsP[orderedID[0]]
        } else if (num<=1){
            pGhost.dir=dirsP[orderedID[1]]
        }
    }else if(dirsP.length==1){
        pGhost.dir=dirsP[orderedID[0]]
    }
}

function getRandomDir2(pGhost){
    let res=getDispoDirs(pGhost, "")
    let dirsP=res[0]
    let orderedID=res[1]
    let num=Math.random()
    if (dirsP.length==4){
        if (num<=0.5){
            pGhost.dir=dirsP[orderedID[3]]
        }else if (num<=0.75){
            pGhost.dir=dirsP[orderedID[2]]
        } else if (num<=0.9){
            pGhost.dir=dirsP[orderedID[1]]
        }else if (num<=1){
            pGhost.dir=dirsP[orderedID[0]]
        }
    }else if(dirsP.length==3){
        if (num<=0.7){
            pGhost.dir=dirsP[orderedID[2]]
        } else if (num<=0.9){
            pGhost.dir=dirsP[orderedID[1]]
        } else if (num<=1){
            pGhost.dir=dirsP[orderedID[0]]
        }
    }else if (dirsP.length==2){
        pGhost.dir=dirsP[orderedID[1]]
    }else if(dirsP.length==1){
        pGhost.dir=dirsP[orderedID[0]]
    }
}


function upDownGhost(pGhost){
    if (pGhost.dir=="up"){
        pGhost.y=pGhost.y-cellSize
        if (pGhost.y<=25/2*cellSize){
            pGhost.dir="down"
        }
      }else if (pGhost.dir=="down"){
        pGhost.y=pGhost.y+cellSize
        if (pGhost.y>=29/2*cellSize){
            pGhost.dir="up"
        }
    }
}


function draw(){
    ctx.fillStyle="rgb(0,0,0)"
    ctx.fillRect(0,0,canW,canH)
    drawResults()
    ctx.save()
    ctx.translate(transX, transY)
    ctx.fillStyle="rgb(255,255,255)"
    ctx.fillRect(0,0,nbCol*cellSize,nbRow*cellSize)
    drawGrid()
    drawBarriers()
    drawGhosts()
    drawPacman()
    ctx.fillStyle="rgb(128, 52, 128)"
    ctx.fillRect(27/2*cellSize, 25/2*cellSize, 2*cellSize, cellSize/2)
    ctx.restore()
    drawLives()
    drawTimeCounterAttack()
    if (gameover){
        drawEnding("GAME OVER")
    }
    if (victory){
        drawEnding("WIN")
    }
}

function drawGrid(){
    for (let r=0; r<nbRow; r++){
        for(let c=0; c<nbCol; c++){
            let id=grid[r][c]
            let x=c*cellSize
            let y=r*cellSize
            if (id==0 || id==4 || id==5){
                ctx.fillStyle="rgb(0,0,0)"
                ctx.fillRect(x, y, cellSize, cellSize)
            }else if (id==1 || id==2 || id==3){
                ctx.fillStyle="rgb(128,128,128)"
                ctx.fillRect(x, y, cellSize-1, cellSize-1)
                ctx.fillStyle="rgb(179,204,0)"
                if (id==2){
                    ctx.beginPath()
                    ctx.arc(x+cellSize/2,  y+cellSize/2, cellSize/4, 0, 2*Math.PI)
                    ctx.fill()
                }else if(id==3){
                    ctx.beginPath()
                    ctx.arc(x+cellSize/2,  y+cellSize/2, cellSize/2, 0, 2*Math.PI)
                    ctx.fill()
                }
            }
        }
    }
}

function drawBarriers(){
    for(let i=0; i<listRects.length; i++){
        let rect=listRects[i]
        ctx.lineWidth=1
        ctx.strokeStyle="rgb(0, 0, 204)"
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h)
    }
}


function drawPacman(){
    if (pacman.touched){
        ctx.fillStyle="rgb(255,255,255)"
    }else{
        ctx.fillStyle="rgb(255,255,0)"
    }
    ctx.beginPath()
    ctx.arc(pacman.x, pacman.y, pacman.r, pacman.a1, pacman.a2)
    ctx.lineTo(pacman.x, pacman.y)
    ctx.fill()
    /*ctx.fillStyle="rgb(0, 255, 0)"
    ctx.fillText("P: "+pacman.potion+"  T:  "+pacman.touched, pacman.x, pacman.y)*/
}


function drawGhosts(){
    for(let i=0; i<listGhosts.length; i++){
        let g=listGhosts[i]
        let img=imgs[g.id]
        let w=img.width
        let h=img.height
        if (pacman.potion && g.out){
            img=imgs["a"]
        }
        ctx.drawImage(img, g.x, g.y, w/4, h/4)
    }
}


function drawLives(){
    ctx.fillStyle="rgb(255,255,0)"
    let a1=pacman.angle/2
    let a2=2*Math.PI-a1
    let y=canH-transY/2
    for(let i=1; i<=pacman.lives; i++){
        let x=(i-1)*2*cellSize+cellSize
        ctx.beginPath()
        ctx.arc(x, y, pacman.r, a1, a2)
        ctx.lineTo(x, y)
        ctx.fill()
    }
}
function drawTimeCounterAttack(){
    ctx.font="20px Arial"
    let h=20
    if (pacman.potion==false){
        ctx.fillStyle="rgb(102,102,102)"
        ctx.fillText("Counter-attack time: "+ 0+ "s", canW*2/5, canH-transY/2+h/2)
    }else{
        ctx.fillStyle="rgb(255,255,255)"
        ctx.fillText("Counter-attack time: "+ String(pacman.timerP).substr(0, 4) + "s", canW*2/5, canH-transY/2+h/2)
    }

}

function drawResults(){
    ctx.font="20px Arial"
    ctx.fillStyle="rgb(255,255,255)"
    let h=20
    ctx.fillText("Score: "+score, 0, (transY+h)/2)
    ctx.fillText("Goal score: "+totalPoints, canW/2, (transY+h)/2)
}

function drawEnding(pText){
    ctx.fillStyle="rgb(0,0,0,0.8)"
    ctx.fillRect(0,0,canW,canH)
    ctx.save()
    ctx.translate(transX, transY)
    ctx.font="30px Arial"
    let mainW=ctx.measureText(pText).width
    let subText="ENTER TO RESTART"
    ctx.fillStyle="rgb(0,255,0)"
    ctx.fillText(pText, (nbCol*cellSize-mainW)/2, 25/2*cellSize)
    ctx.font="20px Arial"
    let subW=ctx.measureText(subText).width
    ctx.fillText(subText, (nbCol*cellSize-subW)/2, 25/2*cellSize+40)
    ctx.restore()
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