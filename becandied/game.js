let can, canW, canH, ctx, transX1, transY1, transX2, transY2
let rect1W, rect1H, rect2W, rect2H
let nbRow, nbCol
let cellSize=64
let grid=[]
let gridCheck=[]
let gridScore=[]
let listSprites=[]
let listFallSprites=[]
let listNonFallSprites=[]
let posR1, posC1, posR2, posC2
let sprite1, sprite2
let currentState="WAITING_CANDY_1"
let pauseFirework=false
let pauseScoring=false
let durationFirework=0.5
let timerFirework=durationFirework
let nbCandies=6
let tsCandies=[]
let listQuads=[]
let fireworks=[]
let score=0
let basicValue=10
let level=1
let maxLevel=3
let multiLevelFactor
let multiNbAlignFactor
let listCircles=[]
let gapH=60
let gapIntra=50
let gapInter=80
let speedCircle=600
let scoreCircle={}
let timeM={}
let runningTime=0
let bgMusic, explodeSound, levelupSound
let oldTime=0

// window.onload, ca se lance quand le html est entièrement affiché.
window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    ctx=can.getContext("2d")
    canW=can.width
    canH=can.height
    rect1W=200
    rect1H=512
    rect2W=512
    rect2H=512
    nbRow=Math.floor(rect2H/cellSize)
    nbCol=Math.floor(rect2W/cellSize)
    transX1=(canW-rect1W-rect2W)/2
    transY1=(canH-rect1H)/2
    transX2=canW-rect2W
    transY2=(canH-rect2H)/2
    scoreCircle.x=rect1W/2
    scoreCircle.y=gapH+2*gapIntra+gapInter+30
    scoreCircle.r=50
    timeM.h=0
    timeM.m=0
    timeM.s=0
    bgMusic=new Audio()
    bgMusic.src="sounds/music_jewels.ogg"
    bgMusic.loop=true
    bgMusic.play()
    explodeSound=new Audio()
    explodeSound.src="sounds/explode.mp3"
    scoreSound=new Audio()
    scoreSound.src="sounds/line.wav"
    loadImages()
    listQuads=getQuads(64, 60)
    initPosClicks()
    initGame(level)
    document.onmousedown=selectCandy
    requestAnimationFrame(gameLoop)
}
function initPosClicks(){
    posR1=-1
    posC1=-1
    posR2=-1
    posC2=-1
}

function loadImages(){
    for (let i=0; i<nbCandies; i++){
        tsCandies[i]=new Image()
        let j=i+1
        tsCandies[i].src="images/candy"+j+".png"
    }
}
function getQuads(pSize, pNbTiles){
    let listQuads=[]
    for (let i=0; i<pNbTiles; i++){
        listQuads[i]=renderQuad(0, i, pSize, pSize)
    }
    return listQuads
}
function renderQuad(pR, pC, pSizeW, pSizeH){
    let quad={}
    quad.x=pC*pSizeW
    quad.y=pR*pSizeH
    quad.w=pSizeW
    quad.h=pSizeH
    return quad
}


function initGame(pLevel){
    multiLevelFactor=pLevel
    grid=randomGrid()
    listSprites=[]
    for(let r=0; r<nbRow; r++){
        for(let c=0; c<nbCol; c++){
            createSprite(grid[r][c], r, c)
        }
    }
}

function randomGrid(){
    let grid=[]
    for (let r=0; r<nbRow; r++){
        grid[r]=[]
        for (let c=0; c<nbCol; c++){
            let id=Math.floor(Math.random()*nbCandies)
            grid[r][c]=id
            let countR=1
            let countC=1
            if(r>=2){
                for(let i=r-1; i>=0; i--){
                    if (grid[i][c]==grid[r][c]){
                        countR++
                    }else {
                        break
                    }
                } 
                if (countR==3){
                    let newId=Math.floor(Math.random()*nbCandies)
                    while (newId==id){
                        newId=Math.floor(Math.random()*nbCandies)
                    } 
                    grid[r][c]=newId
                }
            }
            if(c>=2){
                for(let j=c-1; j>=0; j--){
                    if (grid[r][j]==grid[r][c]){
                        countC++
                    }else {
                        break
                    }
                } 
                if (countC==3){
                    let newId=Math.floor(Math.random()*nbCandies)
                    while (newId==grid[r][c] || newId==id){
                        newId=Math.floor(Math.random()*nbCandies)
                    } 
                    grid[r][c]=newId
                }
            }
        }
    }  
    return grid
}
 
function createSprite(pId, pR, pC){
    let sprite={}
    sprite.id=pId
    sprite.x=pC*cellSize
    sprite.y=pR*cellSize
    sprite.vy=128
    sprite.vx=128
    sprite.gravity=240
    sprite.frame=0
    sprite.target=false
    listSprites.push(sprite)
}


function initGrid(pGrid){
    for(let r=0; r<nbRow; r++){
        pGrid[r]=[]
        for (let c=0; c<nbCol; c++){
            pGrid[r][c]=0
        }
    }
}



function update(dt){
    runningTime+=dt
    getTimeMeter(runningTime, timeM)
    if(currentState=="WAITING_CANDY_1"){
        initPosClicks()
        if (sprite1!=undefined && sprite2!=undefined){
            sprite1.target=false
            sprite1.frame=0
            sprite2.target=0
            sprite2.frame=0
        }
    }else if(currentState=="SWAP_CANDY"){
        swapAnimation(dt, "CHECK_ROWS_COLS")
    }else if(currentState=="CHECK_ROWS_COLS"){
        updateGrid()
        if (check()){
            initPosClicks()
            currentState="EXPLODE"
            sprite1.target=false
            sprite1.frame=0
            sprite2.target=false
            sprite2.frame=0
        }else{
            if (posR1!=-1 && posC1!=-1 && posR2!=-1 && posC2!=-1){
                sprite1=getSprite(posR1, posC1)
                sprite2=getSprite(posR2, posC2)
                currentState="UNSWAP_CANDY"
            }else{
                currentState="WAITING_CANDY_1"
            }
        }
    }else if(currentState=="UNSWAP_CANDY"){
        swapAnimation(dt, "WAITING_CANDY_1")
    }else if(currentState=="EXPLODE"){
        explodeAnimation(dt)
    }else if(currentState=="GENERATE"){
        generateCandies()
        getFallSprites()
        getNonFallSprites()
        currentState="FALL"
    } else if (currentState=="FALL"){
        fallAnimation(dt)
        if(listFallSprites.length==0){
            currentState="CHECK_ROWS_COLS"
        }
    }
    updateSprites(dt)
}

function getTimeMeter(pTime, pTimeM){
    pTimeM.h=Math.floor(pTime/3600)
    pTimeM.m=Math.floor((pTime-3600*pTimeM.h)/60)
    pTimeM.s=Math.floor((pTime-3600*pTimeM.h-pTimeM.m*60))  
}


function valid(pR, pC){
    if (pR>=0 && pR<nbRow && pC>=0 && pC<nbCol){
        return true
    }
    return false
}

function selectCandy(e){
    let rect=can.getBoundingClientRect()
    let x=e.clientX-rect.left-transX2
    let y=e.clientY-rect.top-transY2
    let r=Math.floor(y/cellSize)
    let c=Math.floor(x/cellSize)
    if (currentState=="WAITING_CANDY_1"){
        clickCandy1(r, c)
    } else if (currentState=="WAITING_CANDY_2"){
        clickCandy2(r, c)
    }
}

function getSprite(pR, pC){
    for(let i=0; i<listSprites.length; i++){
        let sprite=listSprites[i]
        let r=Math.floor(sprite.y/cellSize)
        let c=Math.floor(sprite.x/cellSize)
        if (r==pR && c==pC){
            return sprite
        }
    }
}

function clickCandy1(pR, pC){
    if (valid(pR, pC)){
        posR1=pR
        posC1=pC
        sprite1=getSprite(pR, pC)
        sprite1.target=true
        currentState="WAITING_CANDY_2"
    } 
}


function clickCandy2(pR, pC){
    if (valid(pR, pC)){
        posR2=pR
        posC2=pC
        sprite2=getSprite(pR, pC)
        if (posR1==posR2 && posC1==posC2){
            currentState="WAITING_CANDY_1" 
            sprite1.target=false
            sprite1.frame=0
            initPosClicks()
        }else if(neighbor(posR1, posC1, posR2, posC2)){
            sprite2.target=true
            currentState="SWAP_CANDY"
        }else{
            sprite2.target=true
            sprite1.target=false
            sprite1.frame=0
            sprite1=sprite2
            posR1=posR2
            posC1=posC2
            posR2=-1
            posC2=-1
        }
    }
}

function neighbor(pR1, pC1, pR2, pC2){
    if ((Math.abs(pR1-pR2)==1 && pC1==pC2) || (Math.abs(pC1-pC2)==1 && pR1==pR2)){
        return true
    } 
    return false
}


function updateSprites(dt){
    for(let i=0; i<listSprites.length; i++){
        let sprite=listSprites[i]
        if (sprite.target){
            sprite.frame++
            if (sprite.frame>=60){
              sprite.frame=0
            }
        }
    }  
}

function updateGrid(){
    for (let i=0; i<listSprites.length; i++){
        let sprite=listSprites[i]
        let r=Math.floor(sprite.y/cellSize)
        let c=Math.floor(sprite.x/cellSize)
        if (valid(r, c)){
            grid[r][c]=sprite.id
        }
    } 
}

function swapAnimation(dt, pState){
    let distX1=posC1*cellSize
    let distY1=posR1*cellSize
    let distX2=posC2*cellSize
    let distY2=posR2*cellSize
    if (posR1>posR2){
        sprite1.y=sprite1.y-sprite1.vy*dt
        sprite2.y=sprite2.y+sprite2.vy*dt
        if (sprite1.y<distY2){
            sprite1.y=distY2
            sprite2.y=distY1
            currentState=pState
        }
    }else if (posR1<posR2){
        sprite1.y=sprite1.y+sprite1.vy*dt
        sprite2.y=sprite2.y-sprite2.vy*dt
        if (sprite1.y>distY2){
            sprite1.y=distY2
            sprite2.y=distY1
            currentState=pState
        }
    }else if (posC1>posC2){
        sprite1.x=sprite1.x-sprite1.vx*dt
        sprite2.x=sprite2.x+sprite2.vx*dt
        if (sprite1.x<distX2){
            sprite1.x=distX2
            sprite2.x=distX1
            currentState=pState
        } 
    }else if (posC1<posC2){
        sprite1.x=sprite1.x+sprite1.vx*dt
        sprite2.x=sprite2.x-sprite2.vx*dt
        if (sprite1.x>distX2){
            sprite1.x=distX2
            sprite2.x=distX1
            currentState=pState
        }
    } 
}




function check(){
    initGrid(gridCheck)
    initGrid(gridScore)
    for (let r=0; r<nbRow; r++){
        for (let c=0; c<nbCol; c++){
            if(gridCheck[r][c]==0){
                let countR=1
                let countC=1
                let iBreak=nbRow
                let jBreak=nbCol
                for (let i=r+1; i<nbRow; i++){
                    if (grid[i][c]==grid[r][c]){
                        countR++
                    }else{
                        iBreak=i
                        break
                    }
                }
                if (countR>=3){
                    for(let ii=r; ii<iBreak; ii++){
                        gridCheck[ii][c]=1
                    }
                    let ind=Math.floor((iBreak-1-r)/2)+r
                    gridScore[ind][c]=getScore(countR)
                    let x=c*cellSize+cellSize/2
                    let y=ind*cellSize+cellSize/2
                    createCircle(transX2+x, transY2+y, cellSize, gridScore[ind][c])
                }
                for (let j=c+1; j<nbCol; j++){
                    if (grid[r][j]==grid[r][c]){
                        countC++
                    }else{
                        jBreak=j
                        break
                    }
                }
                if (countC>=3){
                    for(let jj=c; jj<jBreak; jj++){
                        gridCheck[r][jj]=1
                    }
                    let ind=Math.floor((jBreak-1-c)/2)+c
                    gridScore[r][ind]=getScore(countC)
                    let x=ind*cellSize+cellSize/2
                    let y=r*cellSize+cellSize/2
                    createCircle(transX2+x, transY2+y, cellSize, gridScore[r][ind])
                }
            }
        }
    } 
    for (let r=0; r<nbRow; r++){
        for (let c=0; c<nbCol; c++){
            if (gridCheck[r][c]==1){
                return true
            } 
        }
    }
    return false
}

function getScore(pNb){
    return basicValue*(pNb-2)*multiLevelFactor
}

function createCircle(pX, pY, pRadius, pScore){
    let circle={}
    circle.x=pX
    circle.y=pY
    circle.r=pRadius
    circle.score=pScore
    let angle=getAngle(pX, pY, transX1+scoreCircle.x, transY1+scoreCircle.y)
    circle.vx=speedCircle*Math.cos(angle)
    circle.vy=speedCircle*Math.sin(angle)
    circle.time=0
    circle.mTime=distToScoreCircle(pX, pY)/speedCircle
    listCircles.push(circle)
}

function getAngle(x1, y1, x2, y2) {
    return Math.atan2(y2-y1, x2-x1)
}

function distToScoreCircle(pX, pY){
    let distX, distY, dist
    distX=transX1+scoreCircle.x-pX
    distY=transY1+scoreCircle.y-pY
    dist=Math.sqrt(distX*distX+distY*distY)
    return dist
}


function removeSprite(pR, pC){
    for(let i=listSprites.length-1; i>=0; i--){
        let sprite=listSprites[i]
        let r=Math.floor(sprite.y/cellSize)
        let c=Math.floor(sprite.x/cellSize)
        if (r==pR && c==pC){
            listSprites.splice(i,1)
            break
        }
    }
}


function explodeAnimation(dt){
    if(pauseScoring==false){
        if (pauseFirework==false){
            for (let r=0; r<nbRow; r++){
                for (let c=0; c<nbCol; c++){
                    if (gridCheck[r][c]==1){
                        removeSprite(r, c)
                        let x=c*cellSize+cellSize/2
                        let y=r*cellSize+cellSize/2
                        fireworks.push(createFirework(x, y))
                    }
                }
            }
            explodeSound.play()
            pauseFirework=true
        }else{
            for (let i=0; i<fireworks.length; i++){
                updateParticle(fireworks[i], dt)
            }
            timerFirework=timerFirework-dt
            if (timerFirework<=0){
                pauseFirework=false
                timerFirework=durationFirework
                pauseScoring=true
            }
        }
    }else{
        updateCircles(dt)
    }

}



function updateCircles(dt){
    for(let i=0; i<listCircles.length; i++){
        let circle=listCircles[i]
        circle.x+=circle.vx*dt
        circle.y+=circle.vy*dt
        if (circle.r>10){
            circle.r-=1
        }
        circle.time+=dt
        if (distToScoreCircle(circle.x, circle.y)<=circle.r+scoreCircle.r){
            listCircles.splice(i, 1)
            score+=circle.score
            scoreSound.play()
        } 
    } 
    if (listCircles.length==0){
        pauseScoring=false
        currentState="GENERATE"
    }
}



function generateCandies(){
    let gridExtra=randomGrid()
    for (let r=gridExtra.length-1; r>=0; r--){
        let count=0
        for (let c=0; c<nbCol; c++){
            if (gridCheck[r][c]==0){
                gridExtra[r][c]=-1
                count++
            } 
        }
        if (count==nbCol){
            gridExtra.splice(r, 1)
        } 
    }
    for(let r=gridExtra.length-1; r>=0; r--){
        for(let c=0; c<nbCol; c++){
            if(gridExtra[r][c]!=-1){
                createSprite(gridExtra[r][c], (r-gridExtra.length)*1.2, c)
            }
        }
    } 
}


function getFallSprites(){
    listFallSprites=[]
    for(let r=0; r<nbRow; r++){
        for (let c=0; c<nbCol; c++){
            if (gridCheck[r][c]==1){
                for (let k=r-1; k>=-nbRow; k--){
                    if (getSprite(k,c)!=undefined){
                        sprite=getSprite(k,c)
                        if (!listFallSprites.includes(sprite)){
                            listFallSprites.push(sprite)
                        }
                    }
                }
            }
        }
    }
}


function getNonFallSprites(){
    listNonFallSprites=listSprites.filter(value => !listFallSprites.includes(value))
}


function fallAnimation(dt){
    for(let i=listFallSprites.length-1; i>=0; i--){
        let sprite=listFallSprites[i]
        sprite.y=sprite.y+sprite.gravity*dt
        for(let j=0; j<listNonFallSprites.length; j++){
            let spriteD=listNonFallSprites[j]
            if (collide(sprite, spriteD)){
                sprite.y=Math.floor(sprite.y/cellSize)*cellSize
                listFallSprites.splice(i, 1)
                listNonFallSprites.push(sprite)
                break
            }else if (sprite.y+cellSize>=nbRow*cellSize){
                sprite.y=(nbRow-1)*cellSize
                listFallSprites.splice(i, 1)
                listNonFallSprites.push(sprite)
                break
            }
        } 
    
    }
}

function collide(pS1, pS2){
    if (pS1.x==pS2.x && pS2.y-pS1.y<=cellSize){
        return true
    } 
    return false
}

function drawBG1(){
    ctx.fillStyle="rgb(0, 128, 75, 0.7)"
    ctx.fillRect(0, 0, rect1W, rect1H)
}

function drawScorePanel(){
    ctx.fillStyle="rgb(255, 255, 255)"
    ctx.font="40px Arial"
    let w=ctx.measureText("Level").width
    ctx.fillText("Level", (rect1W-w)/2,  gapH)
    ctx.fillText("Score", (rect1W-w)/2,  gapH+gapIntra+gapInter)
    ctx.fillText("Time", (rect1W-w)/2,  gapH+3*gapIntra+gapInter+100) 
    ctx.font="30px Arial" 
    let w1=ctx.measureText(level).width
    let w2=ctx.measureText(score).width
    let h1=30
    ctx.fillText(level,  (rect1W-w1)/2, gapH+gapIntra)
    ctx.fillText(score,  (rect1W-w2)/2, scoreCircle.y+h1/2)

    ctx.fillStyle="rgb(255, 255, 0, 0.5)"
    ctx.beginPath()
    ctx.arc(scoreCircle.x, scoreCircle.y, scoreCircle.r, 0, 2*Math.PI)
    ctx.fill()

    ctx.fillStyle="rgb(255, 255, 255)"
    let hour=stringFormat(timeM.h, 2)
    let min=stringFormat(timeM.m, 2)
    let sec=stringFormat(timeM.s, 2)
    let text=hour+":"+min+":"+sec
    let w3=ctx.measureText(text).width
    ctx.fillText(text,  (rect1W-w3)/2, gapH+4*gapIntra+gapInter+100)
}



function stringFormat(pNumber, pLength){
    let text=""+pNumber
    while(text.length<pLength){
        text="0"+text
    }
    return text
}

function drawSprites(){
    for(let i=0; i<listSprites.length; i++){
        let sprite=listSprites[i]
        let ts=tsCandies[sprite.id]
        let quad=listQuads[sprite.frame]
        ctx.drawImage(ts, quad.x, quad.y, quad.w, quad.h, sprite.x, sprite.y, cellSize, cellSize)
    }
}

function drawCircles(){
    ctx.font="30px Arial"
    for (let i=0; i<listCircles.length; i++){
      let circle=listCircles[i] 
      let opacity=(1-circle.time/circle.mTime)
      ctx.fillStyle="rgb(0, 0, 0.3," + 0.5*opacity+ ")"
      ctx.beginPath()
      ctx.arc(circle.x, circle.y, circle.r, 0, 2*Math.PI)
      ctx.fill()
      let w, h
      w=ctx.measureText(circle.score).width
      h=30
      x=circle.x-w/2
      y=circle.y+h/2
      ctx.fillStyle="rgb(255, 255, 0," + opacity + ")"
      ctx.fillText(circle.score, x, y)
    }
  
}

function draw(){    
    ctx.fillStyle="black"
    ctx.fillRect(0, 0, canW, canH)
    ctx.save()
    ctx.translate(transX1, transY1)
    drawBG1()
    drawScorePanel()
    ctx.restore()
    ctx.save()
    ctx.translate(transX2, transY2)
    drawSprites()
    for (let i=0; i<fireworks.length; i++){
        drawFireWorks(fireworks[i])
    }   
    ctx.restore()
    if (pauseScoring){
        drawCircles()
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