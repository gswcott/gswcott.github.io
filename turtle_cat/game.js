let transX, transY
let level=1
let maxLevel=3
let nbRow, nbCol, nbCoins, nbCats, nbPotions, nbLakes
let cellSize=16
let cellSizeTurtle=1
let cellSizeCat=1
let grid
let initPosTurtle={}
let listSprites=[]
let countCoins=0
let changeLevelTimer=0.5
let oldTime=0
let listCats=[]
let speedCat
let listPotions=[]
let turtleTouched=false
let maxLives=4
let nbLives=maxLives
let pauseTimer=2
let maxLevelPotion
let listLakes=[]
let posRCLakesT1=[]
let posRCLakesT2=[]
let posRCLakesT3=[]

NIMGS = 2

function loader(){
    NIMGS--
    if(NIMGS==0){
        requestAnimationFrame(gameLoop)
    }

}

// window.onload, ca se lance quand le html est entièrement affiché.
window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    canW=can.width
    canH=can.height
    ctx=can.getContext("2d")
    musicPlay=new Audio()
    nextLevelSound=new Audio()
    moneySound=new Audio()
    musicPlay.src="sounds/music.ogg"
    nextLevelSound.src="sounds/levelup.wav"
    moneySound.src="sounds/line.wav"

    listQuadsHearts=[]
    listQuadsHearts[0]=renderQuad(0, 0, 16, 16)
    listQuadsHearts[1]=renderQuad(0, 3, 16, 16)
    listQuadsPotions=[]
    listQuadsPotions[0]=renderQuad(0, 2, 16, 16)
    listQuadsPotions[1]=renderQuad(0, 3, 16, 16)
    listQuadsPotions[2]=renderQuad(0, 4, 16, 16)
    initGame()
    document.onkeydown=moveTurtle

    tsHearts=new Image()
    tsHearts.src="images/hearts.png"
    tsHearts.onload = loader // la fonction loader est lancé une fois que l'image (tsHearts) est chargée.
    tsPotions=new Image()
    tsPotions.src="images/potions.png"
    tsPotions.onload = loader
}

function renderQuad(pR, pC, pSizeW, pSizeH){
    let quad={}
    quad.x=pC*pSizeW
    quad.y=pR*pSizeH
    quad.w=pSizeW
    quad.h=pSizeH
    return quad
}

function createCat(pX, pY){
  let cat={}
  cat.matrix=[
    [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
    [0, 1, 3, 3, 1, 1, 0, 0, 0, 1, 1, 3, 3, 1, 0],
    [0, 1, 3, 3, 3, 1, 1, 1, 1, 1, 3, 3, 3, 1, 0],
    [0, 1, 3, 3, 3, 1, 2, 1, 2, 1, 3, 3, 3, 1, 0],
    [0, 1, 3, 3, 1, 1, 2, 1, 2, 1, 1, 3, 3, 1, 0],
    [0, 0, 1, 1, 2, 1, 2, 2, 2, 1, 2, 1, 1, 0, 0],
    [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
    [0, 0, 1, 2, 1, 1, 2, 2, 2, 1, 1, 2, 1, 0, 0],
    [0, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 0],
    [0, 0, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 0, 0],
    [1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1],
    [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
    [0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0],
    [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
  ]
  cat.x=pX
  cat.y=pY
  cat.dir=Math.floor(Math.random()*4)
  listCats.push(cat)
}

function createLake(pX, pY, pType){
    let lake={}
    lake.x=pX
    lake.y=pY
    lake.type=pType
    listLakes.push(lake)
}

function createPotion(pX, pY, pId){
    let potion={}
    potion.x=pX
    potion.y=pY
    potion.id=pId
    listPotions.push(potion)
}

function chargerLevel(pLevel){
    if (pLevel==1){
        nbCol=15
        nbRow=15
        nbCoins=4
        nbCats=2
        nbPotions=1
        maxLevelPotion=1
        speedCat=16
        nbLakes=3
    }else if (pLevel==2){
        nbCol=23
        nbRow=23
        nbCoins=8
        nbCats=4
        nbPotions=2
        maxLevelPotion=2
        speedCat=32
        nbLakes=2
    }else if (pLevel==3){
        nbCol=39
        nbRow=39
        nbCoins=16
        nbCats=8
        nbPotions=3
        maxLevelPotion=3
        speedCat=64
        nbLakes=3
    }
    gapX=(canW-nbCol*cellSize)/2
    gapY=(canH-nbRow*cellSize)/2
}

function initGame(){
    chargerLevel(level)
    map.createMap(nbRow, nbCol)
    grid=map.grid
    listCats=[]
    listPotions=[]
    listLakes=[]
    posRCLakesT1=[]
    posRCLakesT2=[]
    posRCLakesT3=[]
    randomObjets()
    countCoins=0
    musicPlay.loop=true
    musicPlay.play()
}

function initTurtle(pR, pC){
    turtle={}
    turtle.matrix=[]
    let matrix=[
        [0, 0, 0, 2, 2, 2, 0, 0, 0], 
        [0, 0, 2, 3, 2, 3, 2, 0, 0], 
        [0, 0, 2, 2, 2, 2, 2, 0, 0], 
        [2, 0, 0, 2, 2, 2, 0, 0, 2], 
        [0, 2, 2, 1, 1, 1, 2, 2, 0], 
        [0, 0, 1, 1, 1, 1, 1, 0, 0], 
        [0, 1, 1, 1, 1, 1, 1, 1, 0], 
        [0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 0, 0], 
        [0, 2, 2, 1, 1, 1, 2, 2, 0], 
        [2, 0, 0, 0, 2, 0, 0, 0, 2]
    ]
    turtle.matrix.push(matrix)
    matrix=turnRight(matrix)
    turtle.matrix.push(matrix)
    matrix=turnRight(matrix)
    turtle.matrix.push(matrix)
    matrix=turnRight(matrix)
    turtle.matrix.push(matrix)
    turtle.pos={}
    turtle.pos.x=cellSize*pC+cellSize/2
    turtle.pos.y=cellSize*pR+cellSize/2
    turtle.dir=0
}

function turnRight(pList){
    let resList=[]
    for(let c=0; c<pList[0].length; c++){
        let line=[]
        for(let r=pList.length-1; r>=0;  r--){
            let x=pList[r][c]
            line.push(x)
        } 
        resList.push(line)
    }
    return resList
}

function createCoin(x,y){
    let coin=createSprite("coin", x, y)
    coin.addImages("images/coin", ["coin1", "coin2", "coin3", "coin4"])
}

function createSprite(pType, x, y){
    let sprite={}
    sprite.x=x
    sprite.y=y
    sprite.type=pType
    sprite.animationSpeed=1/8
    sprite.animationTimer=sprite.animationSpeed
    sprite.images=[]
    sprite.frame=1
    sprite.addImages=function(pDir, pListImages){
        for(let i=0; i<pListImages.length; i++){
            let img=new Image()
            img.src=pDir+"/"+pListImages[i]+".png"
            sprite.images.push(img)
        } 
    }
    listSprites.push(sprite)
    return sprite
}

function findPosRCLakes(){
    for(let r=1; r<nbRow-1; r++){
        for(let c=1; c<nbCol-2; c++){
            if (grid[r][c]==1 && grid[r][c+1]==1 && grid[r+1][c]==1){
                let pos={}
                pos.r=r
                pos.c=c
                posRCLakesT1.push(pos)
                if (grid[r+1][c+1]==1){
                    posRCLakesT2.push(pos)
                    if (grid[r+1][c+2]==1){
                        posRCLakesT3.push(pos)
                    }
                }
            }
        }
    }
}


function randomObjets(){
    //lakes
    findPosRCLakes()
    for (let i=0; i<nbLakes; i++){
        let t=Math.floor(Math.random()*3)+1
        let posRCLake
        if (t==1){
            if (posRCLakesT1.length>=1){
                let j=Math.floor(Math.random()*posRCLakesT1.length)
                posRCLake=posRCLakesT1[j]
                createLake(posRCLake.c*cellSize, posRCLake.r*cellSize, t)
                grid[posRCLake.r][posRCLake.c]=2
                grid[posRCLake.r][posRCLake.c+1]=2
                grid[posRCLake.r+1][posRCLake.c]=2
            } 
        }else if (t==2){
            if (posRCLakesT2.length>=1){
                let j=Math.floor(Math.random()*posRCLakesT2.length)
                posRCLake=posRCLakesT2[j]
                createLake(posRCLake.c*cellSize,posRCLake.r*cellSize, t)
                grid[posRCLake.r][posRCLake.c]=2
                grid[posRCLake.r][posRCLake.c+1]=2
                grid[posRCLake.r+1][posRCLake.c]=2
                grid[posRCLake.r+1][posRCLake.c+1]=2
            }
        }else if (t==3){
            if (posRCLakesT3.length>=1) {
                let j=Math.floor(Math.random()*posRCLakesT3.length)
                posRCLake=posRCLakesT3[j]
                createLake(posRCLake.c*cellSize, posRCLake.r*cellSize, t)
                grid[posRCLake.r][posRCLake.c]=2
                grid[posRCLake.r][posRCLake.c+1]=2
                grid[posRCLake.r+1][posRCLake.c]=2
                grid[posRCLake.r+1][posRCLake.c+1]=2
                grid[posRCLake.r+1][posRCLake.c+2]=2
            } 
        }
    }
    let posRCPath=[]
    for (r=0; r<nbRow; r++){
      for (c=0; c<nbCol; c++){
          if (grid[r][c]==1){
            let pos={}
            pos.r=r
            pos.c=c
            posRCPath.push(pos)
          } 
      }
    }

    // turtle
    let i=Math.floor(Math.random()*posRCPath.length)
    initPosTurtle.r=posRCPath[i].r 
    initPosTurtle.c=posRCPath[i].c
    initTurtle(initPosTurtle.r, initPosTurtle.c, cellSize)
    posRCPath.splice(i, 1)
    // coins
    for (i=0; i<nbCoins; i++){
        let j=Math.floor(Math.random()*posRCPath.length)
        let posRC=posRCPath[j]
        let x=posRC.c*cellSize+cellSize/2
        let y=posRC.r*cellSize+cellSize/2
        createCoin(x, y)
        posRCPath.splice(j, 1)
    }
    //cats
    for (i=0; i<nbCats; i++){
        let j=Math.floor(Math.random()*posRCPath.length)
        let posRC=posRCPath[j]
        while (Math.abs(posRC.r-initPosTurtle.r)<=1 || Math.abs(posRC.c-initPosTurtle.c)<=1){
            j=Math.floor(Math.random()*posRCPath.length)
            posRC=posRCPath[j]
        } 
        let x=posRC.c*cellSize+cellSize/2
        let y=posRC.r*cellSize+cellSize/2
        createCat(x, y)
        posRCPath.splice(j,1)
    }
    //potions
    for(let i=0; i<nbPotions; i++){
        let j=Math.floor(Math.random()*posRCPath.length)
        let posRC=posRCPath[j]
        let x=posRC.c*cellSize
        let y=posRC.r*cellSize
        createPotion(x, y, Math.floor(Math.random()*maxLevelPotion))
        posRCPath.splice(j, 1)
    }
    
}




function moveTurtle(e){
    let key=e.code
    let r=Math.floor(turtle.pos.y/cellSize)
    let c=Math.floor(turtle.pos.x/cellSize)
    if(key=="ArrowUp"){
        if(turtle.dir==0){
            if (grid[r-1][c]==1 || grid[r-1][c]==2) {
                turtle.pos.y=turtle.pos.y-cellSize
            }
        }else{
            turtle.dir=0
        }

    }else if (key=="ArrowRight"){
        if (turtle.dir==1){
            if (grid[r][c+1]==1 || grid[r][c+1]==2){
                turtle.pos.x=turtle.pos.x+cellSize
            } 
        }else{
            turtle.dir=1  
        }
    }else if (key=="ArrowDown"){
        if(turtle.dir==2){
            if (grid[r+1][c]==1 || grid[r+1][c]==2){
                turtle.pos.y=turtle.pos.y+cellSize
            }
        }else{
            turtle.dir=2
        }
    }else if (key=="ArrowLeft"){
        if(turtle.dir==3){
            if (grid[r][c-1]==1 || grid[r][c-1]==2){
                turtle.pos.x=turtle.pos.x-cellSize
            }
        }else{
            turtle.dir=3
        }
    }
}

function collide(x1, y1, x2, y2){
    if (Math.abs(x1-x2)<cellSize && Math.abs(y1-y2)<cellSize){
        return true
    }
    return false
}

function collideCatTurtle(){
    for(let i=0; i<listCats.length; i++){
        let cat=listCats[i]
        if (turtleTouched==false && collide(cat.x, cat.y, turtle.pos.x, turtle.pos.y)){
            turtleTouched=true
            nbLives-=1
            if (nbLives<=0 ){
                nbLives=0
                gameover=true
            }
        }else if (turtleTouched){
            pauseTimer=pauseTimer-dt
            if (pauseTimer<=0){
                pauseTimer=2
                turtleTouched=false
            } 
        } 
    }
}

function collidPotionTurtle(){
    for(let i=listPotions.length-1; i>=0; i--){
        let potion=listPotions[i]
        if (collide(potion.x+cellSize/2, potion.y+cellSize/2, turtle.pos.x, turtle.pos.y)){
            nbLives+=potion.id+1
            listPotions.splice(i, 1)
            if (nbLives>maxLives){
                nbLives=maxLives
            } 
        }
    }
}

function isSolid(pR, pC){
    if (grid[pR][pC]==0 || grid[pR][pC]==2) {
        return true
    } 
    return false
}

function updateCats(){
    for(let i=0; i<listCats.length; i++){
        let cat=listCats[i]
        let r, c, oldX, oldY
        r=Math.floor((cat.y-cellSize/2)/cellSize)
        c=Math.floor((cat.x-cellSize/2)/cellSize)
        oldX=cat.x
        oldY=cat.y
        if (cat.dir==0){
            cat.y-=speedCat*dt
            r=Math.floor((cat.y-cellSize/2)/cellSize)
            if (isSolid(r, c)){
                cat.y=(r+1)*cellSize+cellSize/2
                cat.dir=Math.floor(Math.random()*4)
            }
        }else if (cat.dir==1){
            cat.x+=speedCat*dt
            c=Math.floor((cat.x+cellSize/2)/cellSize)
            if (isSolid(r, c)){
                cat.x=(c-1)*cellSize+cellSize/2
                cat.dir=Math.floor(Math.random()*4)
            }
        }else if (cat.dir==2){
            cat.y+=speedCat*dt
            r=Math.floor((cat.y+cellSize/2)/cellSize)
            if (isSolid(r, c)){
                cat.y=(r-1)*cellSize+cellSize/2
                cat.dir=Math.floor(Math.random()*4)
            }
        }else if (cat.dir==3){
            cat.x-=speedCat*dt
            c=Math.floor((cat.x-cellSize/2)/cellSize)
            if (isSolid(r, c)){
                cat.x=(c+1)*cellSize+cellSize/2
                cat.dir=Math.floor(Math.random()*4)
            }
        }
    }
}

function updateCoins(){
    for(let i=listSprites.length-1; i>=0; i--){
        let sprite=listSprites[i]
        sprite.animationTimer=sprite.animationTimer-dt 
        if (sprite.animationTimer<=0){
            sprite.frame=sprite.frame+1 
            if (sprite.frame>=sprite.images.length){
                sprite.frame=0
            } 
            sprite.animationTimer=sprite.animationSpeed
        }
        if (Math.abs(turtle.pos.x-sprite.x)<cellSize && Math.abs(turtle.pos.y-sprite.y)<cellSize){
            listSprites.splice(i, 1)
            countCoins+=1
            moneySound.play()
        } 
    }
}

function update(dt){
    if (countCoins!=nbCoins){
        updateCoins()
        updateCats()
        collideCatTurtle()
        collidPotionTurtle()
    }else{
        changeLevelTimer-=dt
        if (changeLevelTimer<=0){
            level+=1
            if (level<=maxLevel){
                nextLevelSound.play()
                initGame()
                changeLevelTimer=0.5
            }
        }
    }
}

function drawSprites(){
    for (let i=listSprites.length-1; i>=0; i--){
        let sprite=listSprites[i]
        let img=sprite.images[sprite.frame]
        let halfW=img.width/2
        let halfH=img.height/2
        ctx.drawImage(img, sprite.x-halfW, sprite.y-halfH)
    } 
}

function drawTurtle(){
    let matrix=turtle.matrix[turtle.dir]
    let x=turtle.pos.x-cellSizeTurtle*matrix[1].length/2
    let y=turtle.pos.y-cellSizeTurtle*matrix[1].length/2
    if (turtleTouched==false){
        for(let r=0; r<matrix.length; r++){
            for(let c=0; c<matrix[r].length; c++){
                if (matrix[r][c]!=0){
                    if (matrix[r][c]==1){
                        ctx.fillStyle="rgb(255,255, 0)"
                    }else if (matrix[r][c]==2){
                        ctx.fillStyle="rgb(0, 255, 127)"
                    }else if (matrix[r][c]==3) {
                        ctx.fillStyle="rgb(0, 0, 0)"
                    } 
                    ctx.fillRect(x+c*cellSizeTurtle-0.5, y+r*cellSizeTurtle-0.5, cellSizeTurtle, cellSizeTurtle)
                } 
            }
        }
    }else{
        ctx.fillStyle="rgb(255,255,255)"
        for(let r=0; r<matrix.length; r++){
            for(let c=0; c<matrix[r].length; c++){
                if (matrix[r][c]!=0){
                    ctx.fillRect(x+c*cellSizeTurtle-0.5, y+r*cellSizeTurtle-0.5, cellSizeTurtle, cellSizeTurtle)
                } 
            }
        }
    }
} 

function drawCats(){
    for(let i=0; i<listCats.length; i++){
        let cat=listCats[i]
        let matrix=cat.matrix
        let x=cat.x-cellSizeCat*matrix[0].length/2
        let y=cat.y-cellSizeCat*matrix.length/2
        for (let r=0; r<matrix.length; r++){
            for (let c=0; c<matrix[0].length; c++){
                if (matrix[r][c]!=0){
                    if (matrix[r][c]==1){
                        ctx.fillStyle="rgb(0,0,0)"
                    } else if (matrix[r][c]==2){
                        ctx.fillStyle="rgb(255,255,255)"
                    } else if (matrix[r][c]==3){
                        ctx.fillStyle="rgb(255,0,0)"
                    } 
                    ctx.fillRect(x+c*cellSizeCat, y+r*cellSizeCat, cellSizeCat, cellSizeCat)
                } 
            }
        }
    }
}

function drawLives(){
    for(let i=0; i<maxLives; i++){
        let quad
        if(i<nbLives){
          quad=listQuadsHearts[0]
        }else{
          quad=listQuadsHearts[1]
        }
        ctx.drawImage(tsHearts, quad.x, quad.y, quad.w, quad.h, (nbCol-maxLives)*cellSize/2+(i-1)*cellSize, -48, cellSize, cellSize)
    }
    ctx.fillStyle="white"
    ctx.fillText("Number of lives: "+nbLives, 0, -12)
}

function drawPotions(){
    for(let i=0; i<listPotions.length; i++){
        let potion=listPotions[i]
        let quad=listQuadsPotions[potion.id]
        ctx.drawImage(tsPotions, quad.x, quad.y, quad.w, quad.h, potion.x, potion.y, cellSize, cellSize)
    }
}


function drawLakes(){
    for(let i=0; i<listLakes.length; i++){
        let lake=listLakes[i]
        if (lake.type>=1){
            ctx.fillStyle="rgb(0, 128, 255)"
            ctx.fillRect(lake.x, lake.y, cellSize*2, cellSize)
            ctx.fillRect(lake.x, lake.y+cellSize, cellSize, cellSize)
            ctx.fillStyle="rgb(0, 0, 0)"
            ctx.fillText("~", lake.x+cellSize/3, lake.y+cellSize*2/3)
            ctx.fillText("~", lake.x+cellSize+cellSize/3, lake.y+cellSize*2/3)
            ctx.fillText("~", lake.x+cellSize/3, lake.y+cellSize+cellSize*2/3)
            if (lake.type>=2){
                ctx.fillStyle="rgb(0, 128, 255)"
                ctx.fillRect(lake.x+cellSize, lake.y+cellSize, cellSize, cellSize)
                ctx.fillStyle="rgb(0, 0, 0)"
                ctx.fillText("~", lake.x+cellSize+cellSize/3, lake.y+cellSize+cellSize*2/3)
                if (lake.type==3){
                    ctx.fillStyle="rgb(0, 128, 255)"
                    ctx.fillRect(lake.x+cellSize*2, lake.y+cellSize, cellSize, cellSize)
                    ctx.fillStyle="rgb(0, 0, 0)"
                    ctx.fillText("~", lake.x+cellSize*2+cellSize/3, lake.y+cellSize+cellSize*2/3)
                }
            } 
        }
     }
}

function draw(){
    ctx.fillStyle="black"
    ctx.fillRect(0, 0, canW, canH)
    ctx.save()
    ctx.translate(gapX, gapY)
    for(let r=0; r<nbRow; r++){
        for(let c=0; c<nbCol; c++){
            if(grid[r][c]==1){
                ctx.fillStyle="rgb(50, 50, 50)"
            }else {
                ctx.fillStyle="rgb(200, 200, 200)"
            }
            ctx.fillRect(c*cellSize, r*cellSize, cellSize-1, cellSize-1)
        }
    }
    drawLakes()
    drawSprites()
    drawCats()
    drawPotions()
    drawTurtle()
    drawLives()
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