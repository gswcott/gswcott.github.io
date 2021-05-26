// Constants
let NASSETS = 6 + 6  // 6 images + 6 sounds
let NB_ROWS=15
let NB_COLS=29
let THRESHOLD_ROWS=12
let RADIUS=16
let RADIUS_HERO=20
let TRANS_X = 120
let TRANS_Y = 100
let CEIL_H = 10
let GROUND_H = 10
let THRESHOLD_H=8
let CELL_SIZE_W=RADIUS
let CELL_SIZE_H=Math.sqrt(3)*RADIUS
let GRID_W = NB_COLS*CELL_SIZE_W
let GRID_H = NB_ROWS*CELL_SIZE_H
let LAUNCH_STAGE_H =  2 * (RADIUS+RADIUS_HERO)
let CAN_W=2*TRANS_X + GRID_W
let CAN_H=2*TRANS_Y + CEIL_H + GRID_H + LAUNCH_STAGE_H + GROUND_H
let TILE_SIZE = 64
let NB_TILES = 60
let DURATION_DISAPPEAR=0.1
let WATING_TIME_ADD_BALLS=5
let COLORS={rgb: [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 255]], opaque: [0.5, 1]}
let NB_COLORS = COLORS.rgb.length
let NB_CANDIES = 6
let VELOCITY=1000
let GRAVITY=600
let MAX_LIFE = 100

let posR, posC // la position de la balle de lancement dans la grille une fois qu'elle est entrée en collision avec d'autres balles au plafond
let currentState="START_MENU"
let oldTime=0



// window.onload, ca se lance quand le html est entièrement affiché.
window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    ctx=can.getContext("2d")
    can.width = CAN_W
    can.height = CAN_H
    playButton = createButton((CAN_W-100)/2, (CAN_H-60)/2, 120, 50, [256, 153, 0], 40, "", [255, 255, 255], "25px Arial", play)
    can.addEventListener("mousedown", playButton.onclick)
    getQuads(TILE_SIZE, NB_TILES)
    keyboardMap={}
    window.onkeyup = function(e) {keyboardMap[e.key] = false;} 
    window.onkeydown = function(e) { 
        keyboardMap[e.key] = true; 
        action(e)
    }
    document.onkeydown=action
    loadImages()
    loadSounds()
}
function getQuads(pSize, pNbTiles){
    listQuads=[]
    for (let i=0; i<pNbTiles; i++){
        listQuads[i]=renderQuad(0, i, pSize, pSize)
    }
}
function play(e){
    let rect=can.getBoundingClientRect()
    let x=e.clientX-rect.left
    let y=e.clientY-rect.top
    if(x>=playButton.x && x<playButton.x+playButton.w && y>=playButton.y && y<=playButton.y+playButton.h){
        bgMusic.play()
        if(currentState=="START_MENU"){
            currentState="LAUNCH"
        }else if (currentState=="GAME_OVER"){
            currentState="LAUNCH"
            initGame()
        }
    }
}

function action(e){
    if(e.key=="ArrowUp"){
        if (currentState=="LAUNCH" && launchBall!=null){
            launchBall.vx=VELOCITY*Math.cos(launchBall.angle)
            launchBall.vy=VELOCITY*Math.sin(launchBall.angle)
            currentState="UPDATELAUNCHBALL"
            launchBall.launched = true
        }
    }else if(e.key=="ArrowRight"){
        hero.dir = 1
    }else if(e.key=="ArrowLeft"){
        hero.dir = -1
    }
}

function loadImages(){
    tsCandies=[]
    for (let i=0; i<NB_CANDIES; i++){
        tsCandies[i]=new Image()
        let j=i+1
        tsCandies[i].src="images/candy"+j+".png"
        tsCandies[i].onload = loader()
    }
}

//Problème de chargement des audios: https://stackoverflow.com/questions/49792768/js-html5-audio-why-is-canplaythrough-not-fired-on-ios-safari
function loadSounds(){
    bgMusic=new Audio()
    hit1Sound=new Audio()
    hit2Sound=new Audio()
    pickupSound=new Audio()
    powerupSound=new Audio()
    deadSound = new Audio()
    bgMusic.src="sounds/music.ogg"
    hit1Sound.src="sounds/Hit1.wav"
    hit2Sound.src="sounds/Hit2.wav"
    pickupSound.src="sounds/Pickup.wav"
    powerupSound.src="sounds/Powerup.wav"
    deadSound.src="sounds/dead.wav"
    bgMusic.addEventListener('canplaythrough', loader, false);
    bgMusic.loop=true
    hit1Sound.addEventListener('canplaythrough', loader, false);
    hit2Sound.addEventListener('canplaythrough', loader, false);
    pickupSound.addEventListener('canplaythrough', loader, false);
    powerupSound.addEventListener('canplaythrough', loader, false);
    deadSound.addEventListener('canplaythrough', loader, false);
}

function loader(){
    NASSETS--
    if(NASSETS==0){
        main()
    }
}

function main(){
    initGame()
    bgMusic.play()
    requestAnimationFrame(gameLoop)
}


function initGame(){
    timeM={h:0, m:0, s:0}
    runningTime=0
    gridCheck=[]
    gridCheck2=[]
    timerDisappear=DURATION_DISAPPEAR
    timerAddBalls=WATING_TIME_ADD_BALLS
    initGrid(3)
    createHero(NB_COLS/2*CELL_SIZE_W+RADIUS_HERO, GRID_H+2*RADIUS+RADIUS_HERO, RADIUS_HERO, 1)
    launchBall=null
}

function initGrid(nbRows){
    grid=[]
    listBalls=[]
    for(let r=0; r<NB_ROWS; r++){
        grid[r]=[]
        for(let c=0; c<NB_COLS; c++){
            grid[r][c]=-2
        }
    }
    for(let r=0; r<NB_ROWS; r++){
        for(let c=0; c<NB_COLS; c++){
            let id = -2
            if (r%2==0){
                if(c%2==0){
                    if (r<nbRows && c<=NB_COLS-2){
                        id=randomInt(NB_COLORS)
                    }else{
                        id=-1
                    }
                }
            }else{
                if(c%2==1){
                    if (r<nbRows && c<=NB_COLS-2){
                        id=randomInt(NB_COLORS)
                    }else{
                        id=-1
                    }
                }
            }
            if(id==NB_COLORS-1 && detectNearCandy(r, c)){
                id = randomInt(NB_COLORS-1)
            }
            grid[r][c]=id
            let x=c*CELL_SIZE_W+RADIUS
            let y=r*CELL_SIZE_H+RADIUS
            if (id>=0){
                if (id==3){
                    createBall(id, 0, x, y, randomInt(NB_CANDIES))
                }else{
                    createBall(id, 1, x, y, -1)
                }
            }
        }
    }
}

function createBall(id, opaque, x, y, candy){
    let ball={}
    ball.id = id
    ball.opaque = opaque
    ball.x=x
    ball.y=y
    ball.vx=0
    ball.vy=0
    ball.type = 0
    ball.candy = candy
    ball.fall=false
    listBalls.push(ball)
    return ball
}

function createHero(x, y, r, dir){
    hero={}
    hero.x = x
    hero.y = y
    hero.r = r
    hero.vx = 0
    hero.dir = dir
    hero.angle=90/180*Math.PI
    getOpenAngles(hero)
    hero.open = true
    hero.timeAnimation=0.3
    hero.timerA=hero.timeAnimation
    //hero.candies = 0
    hero.dead = false
    hero.life = MAX_LIFE
    hero.energy = 1
}

function getOpenAngles(hero){
    if (hero.dir==1){
        hero.a1=hero.angle/2
        hero.a2=2*Math.PI-hero.a1
    }else if (hero.dir==-1){
        hero.a1=Math.PI+hero.angle/2
        hero.a2=Math.PI-hero.angle/2+2*Math.PI
    }
}


function initGridCheck(pGrid){
    for(let r=0; r<NB_ROWS; r++){
        pGrid[r]=[]
        for (let c=0; c<NB_COLS; c++){
            pGrid[r][c]=0
        }
    }
}

function randomLaunchBall(){
    let id=randomInt(NB_COLORS-1)
    launchBall=createBall(id, 1, hero.x, hero.y-hero.r-RADIUS, -1)
    launchBall.type = 1
    launchBall.launched = false
    launchBall.angle = -Math.PI/2
    launchBall.dir = 1
}


function isValid(pR, pC){
    if (pR>=0 && pR<NB_ROWS && pC>=0 && pC<NB_COLS){
        return true
    }
    return false
}

function detectNearCandy(pR, pC){
    let sixPos=[[pR-1, pC-1], [pR-1, pC+1], [pR, pC-2], [pR, pC+2], [pR+1, pC-1], [pR+1, pC+1]]
    for(let i=0; i<sixPos.length; i++) {
        let pos=sixPos[i]
        if(isValid(pos[0], pos[1]) && grid[pos[0]][pos[1]]==NB_COLORS-1){
            return true
        }
    }
    return false
}


function checkNewPart(){
    for(let i=0; i<listBalls.length; i++){
        let ball=listBalls[i]
        if (!ball.fall && ball != launchBall && ball.y>=THRESHOLD_ROWS*CELL_SIZE_H){
            return true
        }
    } 
    return false
}


function getTimeMeter(pTime, pTimeM){
    pTimeM.h=Math.floor(pTime/3600)
    pTimeM.m=Math.floor((pTime-3600*pTimeM.h)/60)
    pTimeM.s=Math.floor((pTime-3600*pTimeM.h-pTimeM.m*60))  
}

/*************************************************************************/
//////////////////////// update ////////////////////////
function update(dt){
    if(currentState !="GAME_OVER" && currentState !="START_MENU"){
        runningTime+=dt
        getTimeMeter(runningTime, timeM)
        updateHero(dt)
        if (currentState=="LAUNCH"){
            if(checkNewPart()){
                listBalls=[]
                initGrid(3)
                if(launchBall!=null){
                    listBalls.push(launchBall)
                }
            }else{
                timerAddBalls -=dt
                if(timerAddBalls<=0){
                    timerAddBalls=WATING_TIME_ADD_BALLS
                    addBalls()
                }
            }
            if (launchBall==null){
                initGridCheck(gridCheck)
                initGridCheck(gridCheck2)
                randomLaunchBall()

            }else{
                updateLaunchDirection(dt)
            }
        } else if (currentState=="UPDATELAUNCHBALL"){
            updateLaunchBall(dt)
        } else if (currentState=="COLLIDE"){
            floodFill(posR,posC)
            if (plus3Bubbles()){
                hit2Sound.play()
                currentState="DISAPPEAR"
            }else{
                hit1Sound.play()
                currentState="LAUNCH" 
            }
        }else if (currentState=="DISAPPEAR"){
            timerDisappear-=dt 
            if (timerDisappear<=0){
                timerDisappear=DURATION_DISAPPEAR
                disappear()
                findFallingBalls()
                if (anyFallingBall()){
                    currentState="FALL"
                }else{ 
                    currentState="LAUNCH"
                }
            }
        }else if (currentState=="FALL"){
            fall(dt)
            if(!anyFallingBall()){
                currentState="LAUNCH"
            }
        }
    }else{
        bgMusic.pause()
    }
}

function updateHero(dt){
    if (currentState!="GAME_OVER" && currentState!="START_MENU"){
        // animation
        hero.life -= dt 
        hero.energy = hero.life/MAX_LIFE
        if(hero.life<=0){
            hero.life = 0
            hero.energy = 0
            hero.dead = true
            deadSound.play()
            currentState = "GAME_OVER"
        }
        hero.timerA-=dt 
        if (hero.timerA<=0){
            hero.timerA=hero.timeAnimation
            if (hero.open){
                hero.a1=0
                hero.a2=360/180*Math.PI
                hero.open=false
            }else{
                getOpenAngles(hero)
                hero.open=true
            }
        }
        //movement
        if(keyboardMap["ArrowLeft"]){
            hero.vx = -300
        }else if(keyboardMap["ArrowRight"]){
            hero.vx = 300
        }else{
            hero.vx = 0
        }

        hero.x += hero.vx*dt
        if(hero.x>GRID_W-hero.r){
            hero.x = GRID_W-hero.r
        }else if(hero.x<hero.r){
            hero.x = hero.r
        }
        if(launchBall!=null && !launchBall.launched){
            launchBall.x = hero.x
        }
        // eat candies
        for(let i=listBalls.length-1; i>=0; i--){
            let ball=listBalls[i]
            if(ball.fall && collide(hero, ball)){
                listBalls.splice(i, 1)
                if(ball.candy>=0){
                    powerupSound.play()
                    hero.life +=10
                }/*else if(ball.candy==-1){
                    pickupSound.play()
                    hero.life +=2
                }*/
                if(hero.life>MAX_LIFE){
                    hero.life = MAX_LIFE
                    hero.energy = 1
                }
            }
        }
    }
}



function updateLaunchDirection(dt){
    launchBall.angle += launchBall.dir*Math.PI*2/3*dt
    if(launchBall.angle>-10/180*Math.PI){
        launchBall.angle = -10/180*Math.PI
        launchBall.dir = -1

    }else if(launchBall.angle<-170/180*Math.PI){
        launchBall.angle=-170/180*Math.PI
        launchBall.dir = 1
    }
}


function updateLaunchBall(dt){
    launchBall.x+=launchBall.vx*dt
    launchBall.y+=launchBall.vy*dt
    if(launchBall.x<RADIUS){
        launchBall.x=RADIUS
        launchBall.vx=-launchBall.vx
    }else if(launchBall.x>GRID_W-RADIUS){
        launchBall.x=GRID_W-RADIUS
        launchBall.vx=-launchBall.vx
    }
    if(launchBall.y<RADIUS){
        launchBall.y=RADIUS
        launchBall.vy=0
        launchBall.vx=0
        let c=Math.floor((launchBall.x+0.5-RADIUS)/CELL_SIZE_W)
        let tmpX=c*CELL_SIZE_W+RADIUS
        if (grid[0][c]==-2){
            if(c+1<NB_COLS-1){
                launchBall.x=tmpX+CELL_SIZE_W
                grid[0][c+1]=launchBall.id

            }else{
                launchBall.x=tmpX-CELL_SIZE_W
                grid[0][c-1]=launchBall.id
            }
        } else {
            launchBall.x=tmpX
            grid[0][c]=launchBall.id
        }
        currentState="LAUNCH"
        launchBall=null
        return
    }
    for(let i=0; i<listBalls.length; i++) {
        let ball=listBalls[i]
        if (launchBall!=ball && collide(launchBall, ball)){
            currentState="COLLIDE"
            let c=Math.floor((ball.x+0.5-RADIUS)/CELL_SIZE_W)
            let r=Math.floor((ball.y+0.5-RADIUS)/CELL_SIZE_H)
            let pos=nearestNeighbor(r,c)
            posR=pos[0]
            posC=pos[1]
            launchBall.x=posC*CELL_SIZE_W+RADIUS
            launchBall.y=posR*CELL_SIZE_H+RADIUS
            launchBall.vx=0
            launchBall.vy=0
            grid[posR][posC]=launchBall.id
            launchBall=null
            return
        }
    }
}
function collide(pB1, pB2){
    let dist=(pB1.x-pB2.x)*(pB1.x-pB2.x)+(pB1.y-pB2.y)*(pB1.y-pB2.y)
    if (dist<4*RADIUS*RADIUS){
        return true
    }
    return false
}




function nearestNeighbor(pR, pC){
    let sixPos=[[pR-1, pC-1], [pR-1, pC+1], [pR, pC-2], [pR, pC+2], [pR+1, pC-1], [pR+1, pC+1]]
    let list=[]
    for(let i=0; i<sixPos.length; i++) {
      let pos=sixPos[i]
      list.push(distToLaunchBall(pos[0], pos[1]))
    } 
    let order=[]
    let min, iBreak
    for(let i=0; i<list.length; i++){
      let d=list[i]
      if (d!=-1){
          min=d
          order.push(i)
          iBreak=i
          break
      }
    } 
    for (let i=iBreak+1; i<list.length; i++){
      let d=list[i]
      if (d!=-1){
          if (d<min){
              min=d
              order.splice(0, 0, i)
          }
      }
    } 
    return sixPos[order[0]]
}

function distToLaunchBall(pR, pC){
    if (isValid(pR, pC)){
        distX=launchBall.x-pC*CELL_SIZE_W-RADIUS
        distY=launchBall.y-pR*CELL_SIZE_H-RADIUS
        dist=Math.sqrt(distX*distX+distY*distY)
        return dist
    } else {
        return -1
    }
}

// floodFill (trouver les balles qui ont la même couleurs que celle de lancement)
function floodFill(pR, pC){
    if (!isValid(pR, pC)) return
    if (grid[pR][pC]!=grid[posR][posC]) return 
    if (gridCheck[pR][pC]==1) return
    gridCheck[pR][pC]=1
    topLeft(pR, pC)
    topRight(pR, pC)
    bottomLeft(pR, pC)
    bottomRight(pR, pC)
    left(pR, pC)
    right(pR, pC)
}

function topLeft(pR,pC){
    floodFill(pR-1, pC-1)
}

function topRight(pR,pC){
    floodFill(pR-1, pC+1)
}

function bottomLeft(pR,pC){
    floodFill(pR+1, pC-1)
}

function bottomRight(pR,pC){
    floodFill(pR+1, pC+1)
}

function left(pR,pC){
    floodFill(pR, pC-2)
}

function right(pR,pC){
    floodFill(pR, pC+2)
}

function plus3Bubbles(){
    let count=0
    for(let r=0; r<NB_ROWS; r++){
        for(let c=0; c<NB_COLS; c++){
            if (gridCheck[r][c]==1){
                count++
            }
        }
    }
    if (count>=3){
      return true
    }
    return false
}


function disappear(){
    for(let i=listBalls.length-1; i>=0; i--){
        let ball=listBalls[i]
        let c=Math.floor((ball.x+0.5-RADIUS)/CELL_SIZE_W)
        let r=Math.floor((ball.y+0.5-RADIUS)/CELL_SIZE_H)
        if (isValid(r, c) && gridCheck[r][c]==1){
            listBalls.splice(i, 1)
            grid[r][c]=-1
        }
    } 
}


// floodFill (trouver les balles qui sont collées)
function floodFill2(pR, pC){
    if (!isValid(pR, pC)) return
    if (grid[pR][pC]<0) return 
    if (gridCheck2[pR][pC]==1) return
    gridCheck2[pR][pC]=1
    floodFill2(pR-1, pC-1)
    floodFill2(pR-1, pC+1)
    floodFill2(pR, pC-2)
    floodFill2(pR, pC+2)
    floodFill2(pR+1, pC-1)
    floodFill2(pR+1, pC+1)
}

function findFallingBalls(){
    for(let j=0; j<NB_COLS; j++){
        floodFill2(0, j)
    } 
    for(let i=0; i<listBalls.length; i++){
        let ball=listBalls[i]
        let c=Math.floor((ball.x+0.5-RADIUS)/CELL_SIZE_W)
        let r=Math.floor((ball.y+0.5-RADIUS)/CELL_SIZE_H)
        if (isValid(r,c) && gridCheck2[r][c]==0){
            ball.fall=true
            grid[r][c]=-1
        }
    }
}


function addBalls(){
    for (let i=0; i<listBalls.length; i++){
        let ball=listBalls[i]
        if (ball!=launchBall && !ball.broken){
            ball.y=ball.y+CELL_SIZE_H
        }
    } 
    let list=[]
    for(let c=0; c<NB_COLS-2; c++){
        if (grid[0][c]==-2){
            let id=randomInt(NB_COLORS)
            if(id==NB_COLORS-1 && detectNearCandy(-1, c)){
                id = randomInt(NB_COLORS-1)
            }
            list.push(id)
            let x=c*CELL_SIZE_W+RADIUS
            let y=RADIUS
            if(id == 3){
                createBall(id, 0, x, y, randomInt(NB_CANDIES))
            }else{
                createBall(id, 1, x, y, -1)
            }
        }else{
            list.push(-2)
        }
    } 
    list.push(-1)
    grid.splice(0, 0, list)
    grid.pop()
}

function anyFallingBall(){
    for(let i=listBalls.length-1; i>=0; i--){
        let ball=listBalls[i]
        if (ball.fall) return true 
    } 
    return false
}

function fall(dt){
    for(let i=listBalls.length-1; i>=0; i--){
        let ball=listBalls[i]
        if (ball.fall){
            ball.vy+=GRAVITY*dt
            ball.y+=ball.vy*dt
            if (ball.y>GRID_H+LAUNCH_STAGE_H-RADIUS){
                ball.y=GRID_H+LAUNCH_STAGE_H-RADIUS
                ball.vy = 0
                ball.fall=false
                listBalls.splice(i, 1)
            }
        } 
    }
}


/*************************************************************************/
//////////////////////// draw ////////////////////////
function draw(){ 
    ctx.fillStyle="black"
    ctx.fillRect(0, 0, CAN_W, CAN_H)
    drawLifespan()
    drawEnergyBar()
    drawPlay()
    if(currentState=="START_MENU" || currentState=="GAME_OVER"){
        drawMenu()
    }
}

function drawMenu(){
    ctx.fillStyle="rgb(0, 0, 0, 0.8)"; 
    ctx.fillRect(0, 0, CAN_W, CAN_H)
    if(currentState=="START_MENU"){
        playButton.text = "PLAY"
    }else if (currentState=="GAME_OVER"){
        playButton.text = "REPLAY"
        drawText("GAME OVER", [255, 255, 255], "40px Arial", 0, 0, CAN_W, CAN_H-200)
    }
    drawButton(playButton)
}

function stringFormat(pNumber, pLength){
    let text=""+pNumber
    while(text.length<pLength){
        text="0"+text
    }
    return text
}


function drawIndication(){
    let text="ArrowLeft: go left     ArrowRight: go right    ArrowUp: launch"
    let subtext="Looking for food to survive !"
    drawText(text, [150, 150, 150], "20px Arial", 0, 0, CAN_W, TRANS_Y/2)
    drawText(subtext, [100, 100, 100], "18px Arial", 0, TRANS_Y/2, CAN_W, TRANS_Y/4)

 
}

function drawLifespan(){
    ctx.fillStyle="rgb(255, 255, 255)"
    let hour=stringFormat(timeM.h, 2)
    let min=stringFormat(timeM.m, 2)
    let sec=stringFormat(timeM.s, 2)
    let text="Lifespan  " + hour+":"+min+":"+sec
    drawText(text, [255, 205, 255], "30px Arial", 0, CAN_H-TRANS_Y, CAN_W, TRANS_Y)
}

function drawEnergyBar(){
    drawText("Power", [255, 205, 255], "30px Arial", TRANS_X+GRID_W, TRANS_Y+CEIL_H, TRANS_X, 1/5*GRID_H)
    let x1=TRANS_X+GRID_W+1/3*TRANS_X
    let x2=TRANS_X+GRID_W+2/3*TRANS_X
    let y1=TRANS_Y+CEIL_H+1/5*GRID_H
    let y2=CAN_H - TRANS_Y
    ctx.fillStyle="rgb(128,128,128)"
    ctx.fillRect( x1, y1, x2-x1, y2 - y1)
    ctx.lineWidth=3
    ctx.strokeStyle="rgb(255, 205, 0)"
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x1, y2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y1)
    ctx.stroke()
    ctx.strokeStyle="rgb(255, 102, 0)"
    ctx.beginPath()
    ctx.moveTo(x2, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x1, y2)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    y1=y2-(y2-y1)*hero.energy
    if (hero.energy>=0){
        ctx.fillStyle="rgb(256, 153, 0)"
        ctx.fillRect(x1, y1, x2-x1, y2-y1)
    }
}


function drawPlay(){
    drawIndication()
    drawRect()
    drawCeil()
    drawThreshold()
    drawGround()
    ctx.save()
    ctx.translate(TRANS_X, TRANS_Y+CEIL_H)
    drawHero()
    drawSprites()
    ctx.restore()
}



function drawRect(){
    ctx.lineWidth=5
    ctx.strokeStyle="rgb(51,51,51)"
    ctx.strokeRect(TRANS_X, TRANS_Y, GRID_W, CEIL_H+GRID_H+LAUNCH_STAGE_H+GROUND_H)
}


function drawCeil(){
    ctx.fillStyle="rgb(205, 128, 0)"
    ctx.fillRect(TRANS_X, TRANS_Y, GRID_W, CEIL_H)
}

function drawThreshold(){
    ctx.fillStyle="rgb(200, 40, 150)"
    ctx.fillRect(TRANS_X, TRANS_Y+CEIL_H+(THRESHOLD_ROWS-1)*CELL_SIZE_H+2*RADIUS, GRID_W, THRESHOLD_H)
}

function drawGround(){
    ctx.fillStyle="rgb(205, 128, 0)"
    ctx.fillRect(TRANS_X, TRANS_Y+CEIL_H+GRID_H+LAUNCH_STAGE_H, GRID_W, GROUND_H)
}

function drawHero(){
    if(!hero.dead){
        ctx.fillStyle="rgb(255,255,0)"
    }else{
        ctx.fillStyle="rgb(255,255,255)"
    }
    ctx.beginPath()
    ctx.arc(hero.x, hero.y, hero.r, hero.a1, hero.a2)
    ctx.lineTo(hero.x, hero.y)
    ctx.fill()
}


function drawSprites(){
    for(let i=0; i<listBalls.length; i++){
        let ball=listBalls[i]
        let c=Math.floor((ball.x+0.5-RADIUS)/CELL_SIZE_W)
        let r=Math.floor((ball.y+0.5-RADIUS)/CELL_SIZE_H)
        if(ball.candy>=0){
            let quad = listQuads[0]
            ctx.drawImage(tsCandies[ball.candy], quad.x, quad.y, quad.w, quad.h, ball.x-RADIUS, ball.y-RADIUS, 2*RADIUS, 2*RADIUS)
        }
        if(!ball.broken){
            ctx.fillStyle=getRGB(COLORS.rgb[ball.id], COLORS.opaque[ball.opaque])
            ctx.beginPath()
            ctx.arc(ball.x, ball.y, RADIUS, 0, 2*Math.PI)
            ctx.fill()
        }
        if(currentState=="DISAPPEAR"){
            if (isValid(r, c) && gridCheck[r][c]==1){
                ctx.strokeStyle="yellow"
                ctx.beginPath()
                ctx.arc(ball.x, ball.y, RADIUS, 0, 2*Math.PI)
                ctx.stroke()
            }
        }
        if(ball.type==1 && !ball.launched){
            ctx.strokeStyle="rgb(255, 255, 0)"
            ctx.beginPath()
            ctx.moveTo(ball.x, ball.y)
            ctx.lineTo(ball.x+Math.cos(ball.angle)*50, ball.y+Math.sin(ball.angle)*50)
            ctx.stroke()
        }
    }
}


/*************************************************************************/
//////////////////////// Game loop ////////////////////////
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

/*************************************************************************/