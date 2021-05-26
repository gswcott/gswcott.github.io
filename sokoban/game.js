let canW, canH, transX, transY
let currentGrid=[]
let limitGrid=[]
let maxCol
let level
let initLevel=1
let cellSize=32
let ts, tsPlayer, imgBG
let listQuadsPlayer={}
let quadBrick, quadBox, quadPoint
let listBoxes=[]
let player=[]
let nbPoints
let stack
let timerAnimation=1/6
let gameState="menu"
let victory=false
let music,levelupSound
let oldTime=0
let menuSin=5
// window.onload, ca se lance quand le html est entièrement affiché.
window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    ctx=can.getContext("2d")
    canW=can.width
    canH=can.height
    music=new Audio()
    levelupSound=new Audio()
    music.src="sounds/music.ogg"
    levelupSound.src="sounds/levelup.wav"
    imgBG=new Image()
    imgBG.src="images/background.png"
    ts=new Image()
    ts.src="images/ts.png"
    tsPlayer=new Image()
    tsPlayer.src="images/player.png"
    let size=32
    quadBrick=renderQuad(1, 7, size, size)
    quadBox=renderQuad(4, 1, size, size)
    quadPoint=renderQuad(3, 1, size, size)
    getQuadsPlayer()
    document.onkeydown=move
    music.loop=true
    music.play()
    requestAnimationFrame(gameLoop)
}

function getQuadsPlayer(){
    let dirs=["down", "left", "right", "up"]
    for(let r=0; r<4; r++){
        listQuadsPlayer[dirs[r]]=[]
        for (let c=0; c<3; c++){
            listQuadsPlayer[dirs[r]][c]=renderQuad(r, c, cellSize, cellSize)
        }
    }
}
function renderQuad(pR, pC, pSizeW, pSizeH){
    let quad={}
    quad.x=pC*pSizeW
    quad.y=pR*pSizeH
    quad.w=pSizeW
    quad.h=pSizeH
    return quad
}


function loadLevel(pLevel){
    currentGrid=levelGrid[pLevel]
    nbPoints=0
    listBoxes=[]
    maxCol=0
    for (let r=0; r<currentGrid.length; r++){
        if(currentGrid[r].length>maxCol){
            maxCol=currentGrid[r].length
        }
        for(let c=0; c<currentGrid[r].length; c++){
            if (currentGrid[r][c]=="@"){
                createPlayer(r,c)
            }else if (currentGrid[r][c]=="$"){
                createBox(r,c)
            }else if (currentGrid[r][c]=="."){
                nbPoints++
            }
        }
    }
    limitesWall()
    stack=[]
    transX=(canW-maxCol*cellSize)/2
    transY=(canH-currentGrid.length*cellSize)/2
}

function createPlayer(pR, pC){
    player={}
    player.r=pR
    player.c=pC
    player.dir="up"
    player.frame=0
    player.timer=timerAnimation
    return player
}

function createBox(pR, pC) {
    let box={}
    box.r=pR
    box.c=pC
    listBoxes.push(box) 
}




function limitesWall(){
    limitGrid=[]
    for(let r=0; r<currentGrid.length; r++){
        limitGrid[r]=[]
        for(let c=0; c<currentGrid[r].length; c++){
            limitGrid[r][c]=1
        }
    }
    for(let r=0; r<currentGrid.length; r++){
        let c=0
        let char=currentGrid[r][c]
        while (char!="#"){
            limitGrid[r][c]=0
            c++
            if (c<currentGrid[r].length){
                char=currentGrid[r][c]
            } 
        }
        if (c<currentGrid[r].length-1){
            c=currentGrid[r].length-1
            char=currentGrid[r][c]
            while (char!="#"){
                limitGrid[r][c]=0
                c--
                if (c>=0){
                    char=currentGrid[r][c]
                } 
            }
        }
    }
    for(let c=0; c<maxCol;c++){
        r=0
        while (r<currentGrid.length && c>=currentGrid[r].length){
            r++     
        }
        let char=currentGrid[r][c]
        while (c<currentGrid[r].length && char!="#"){
            limitGrid[r][c]=0
            r++
            if (r<currentGrid.length){
                char=currentGrid[r][c]
            }
        }
        if (r<currentGrid.length-1){
            r=currentGrid.length-1
            while (r>0 && c>currentGrid[r].length-1){
                r--
            } 
            let char=currentGrid[r][c]
            while (c<=currentGrid[r].length-1 && char!="#"){
                limitGrid[r][c]=0
                r--
                if (r>=0){
                    char=currentGrid[r][c]
                } 
            } 
        } 
    }  
}

function move(e){
    let key=e.key
    if (gameState=="menu"){
        inputMenu(key)
    }else if (gameState=="play"){
        inputPlay(key)
    }else if (gameState=="gameover"){
        inputGameover(key)
    }
}
function inputMenu(key){
    if(key=="Enter"){
        gameState="play"
        level=initLevel
        loadLevel(level-1)
    }
}
function inputGameover(key){
    if(key=="Enter"){
        gameState="menu"
    }else if(key=="c"){
        gameState="play"
    }
}
function isSolid(pR, pC) {
    if (currentGrid[pR][pC]=="#" || isMoveable(pR, pC)) {
        return true
    }
    return false
}

function isMoveable(pR, pC){
    for (let i=0; i<listBoxes.length; i++) {
        let box=listBoxes[i]
        if (box.r==pR && box.c==pC){
            return true
        }
    }
    return false
}

function findBox(pR, pC){
    for (let i=0; i<listBoxes.length; i++) {
        let box=listBoxes[i]
        if (box.r==pR && box.c==pC){
            return box
        }
    }
}


function moveup(){
    player.r--
}

function movedown(){
    player.r++
}

function moveright(){
    player.c++
}

function moveleft(){
    player.c--
}

function pushup(){
    let box=findBox(player.r-1, player.c)
    box.r--
    player.r--
}

function gobackup(){
    let box=findBox(player.r+1, player.c)
    box.r--
    player.r--

}

function pushright(){
    let box=findBox(player.r, player.c+1)
    box.c++
    player.c++
}

function gobackright(){
    let box=findBox(player.r, player.c-1)
    box.c++
    player.c++
}

function pushdown(){
    let box=findBox(player.r+1, player.c)
    box.r++
    player.r++
}

function gobackdown(){
    let box=findBox(player.r-1, player.c)
    box.r++
    player.r++
}

function pushleft(){
    let box=findBox(player.r, player.c-1)
    box.c--
    player.c--
}


function gobackleft(){
    let box=findBox(player.r, player.c+1)
    box.c--
    player.c--
}
 
function inputPlay(key){
    if(key=="ArrowUp" ||key=="ArrowRight" ||key=="ArrowDown" ||key=="ArrowLeft"){
        player.frame=0
        if(key=="ArrowUp"){
            player.dir="up"
            if(!isSolid(player.r-1, player.c)){
                moveup()
                stack.push("moveup")
            }else if (isMoveable(player.r-1, player.c) && player.r-2>=0 && !isSolid(player.r-2, player.c)){
                pushup()
                stack.push("pushup")
            }
        }else if(key=="ArrowRight"){
            player.dir="right"
            if(!isSolid(player.r, player.c+1)){
                moveright()
                stack.push("moveright")
            }else if (isMoveable(player.r, player.c+1) && player.c+2<currentGrid[player.r].length && !isSolid(player.r, player.c+2)){
                pushright()
                stack.push("pushright")
            }
        }else if(key=="ArrowDown"){
            player.dir="down"
            if(!isSolid(player.r+1, player.c)){
                movedown()
                stack.push("movedown")
            }else if (isMoveable(player.r+1, player.c) && player.r+2<currentGrid.length && !isSolid(player.r+2, player.c)){
                pushdown()
                stack.push("pushdown")
            }
        }else if(key=="ArrowLeft"){
            player.dir="left"
            if(!isSolid(player.r, player.c-1)){
                moveleft()
                stack.push("moveleft")
            }else if (isMoveable(player.r, player.c-1) && player.c-2>=0 && !isSolid(player.r, player.c-2)){
                pushleft()
                stack.push("pushleft")
            }
        }
    }else if (key=="z"){
        undo()
    }else if (key=="n"){
        level++
        if (level>levelGrid.length){
          level=1
        }
        loadLevel(level-1)
    }else if (key=="p"){
        level--
        if (level<=0){
          level=levelGrid.length
        }
        loadLevel(level-1)
    }else if (key=="r"){
        loadLevel(level-1)
    } else if (key=="q"){
        gameState="gameover"
    }
}

function undo(){
    player.frame=0
    let action=stack.pop()
    if(action=="moveup"){
        movedown()
        player.dir="up"
    }else if(action=="movedown"){
        moveup()
        player.dir="down"
    }else if(action=="moveright"){
        moveleft()
        player.dir="right"
    }else if(action=="moveleft"){
        moveright()
        player.dir="left"
    }else if(action=="pushup"){
        gobackdown()
        player.dir="up"
    }else if(action=="pushdown"){
        gobackup()
        player.dir="down"
    }else if(action=="pushright"){
        gobackleft()
        player.dir="right"
    }else if(action=="pushleft"){
        gobackright()
        player.dir="left"
    }
}

function victoryLevel(){
    let count=0
    for(let i=0; i<listBoxes.length; i++){
        let box=listBoxes[i]
        if (currentGrid[box.r][box.c]=="."){
            count++
        }
    }  
    if (count==nbPoints){
      return true
    } 
    return false
}

function updateMenu(dt){
    menuSin=menuSin+120*dt
}

function update(dt){
    if(gameState=="menu"){
        updateMenu(dt)
    }else if (gameState=="play"){
        player.timer-=dt
        if(player.timer<=0){
            player.frame++
            if (player.frame>=3){
                player.frame=0
            }
            player.timer=timerAnimation
        }
        if (victoryLevel()){
            level++
            if(level<=levelGrid.length){
                levelupSound.play()
                loadLevel(level-1)
            }else{
                level=levelGrid.length
                victory=true
                gameState="gameover"
            }
        }
    }
}
function drawBricks(){
    for (let r=0; r<currentGrid.length; r++){
        for(let c=0; c<currentGrid[r].length; c++){
            let char=currentGrid[r][c]
            let x=c*cellSize
            let y=r*cellSize
            let quad
            if (char=="#") {
                quad=quadBrick
                ctx.drawImage(ts, quad.x, quad.y, quad.w, quad.h, x, y, cellSize, cellSize)
            }else if (char=="."){
                quad=quadPoint
                ctx.drawImage(ts, quad.x, quad.y, quad.w, quad.h, x, y, cellSize, cellSize)
            }
           
        }
    }
}

function drawBoxes(){
    for (let i=0; i<listBoxes.length; i++){
        let box=listBoxes[i]
        let x=box.c*cellSize
        let y=box.r*cellSize
        ctx.drawImage(ts, quadBox.x, quadBox.y, quadBox.w, quadBox.h, x, y, cellSize, cellSize)
    }
}

function drawPlayer(){
    let x=player.c*cellSize
    let y=player.r*cellSize
    quad=listQuadsPlayer[player.dir][player.frame]
    ctx.drawImage(tsPlayer, quad.x, quad.y, quad.w, quad.h, x, y, cellSize, cellSize)
}

function drawMenu(){
    ctx.fillStyle="black"
    ctx.fillRect(0, 0, canW, canH)
    ctx.font="40px Arial"
    let mainText="SOKOBAN"
    let mainTextW=ctx.measureText(mainText).width
    let x=(canW-mainTextW)/2
    let y
    for(i=0; i<mainText.length; i++) {
        let char=mainText[i]
        y=canH/3
        y=y+Math.sin((x+menuSin)/50)*30
        ctx.fillStyle="rgb("+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+"," +Math.floor(Math.random()*256)+ ")"
        ctx.fillText(char, x, y)
        x=x+ctx.measureText(char).width
    }
    ctx.fillStyle="white"
    ctx.font="30px Arial"
    let subText="There are 90 levels. Enter to start"
    let subTextW=ctx.measureText(subText).width
    let subTextH=30
    x=(canW-subTextW)/2
    y=canH/2+40+subTextH/2
    ctx.fillText(subText, x, y)
}

function drawBG1(){
    let size=128
    for (let x=0; x<canW; x+=size){
        for(let y=0; y<canH; y+=size){
          ctx.drawImage(imgBG, x, y)
        }
    }
}

function drawBG2(){
    ctx.fillStyle="rgb(25, 0, 20)"
    for(let r=0; r<limitGrid.length; r++) {
        for(let c=0; c<limitGrid[r].length; c++){
            if(limitGrid[r][c]==1){
                let x=c*cellSize
                let y=r*cellSize
                ctx.fillRect(x, y, cellSize, cellSize)
            }
        }
    }
}


function drawPlay(){
    ctx.fillStyle="black"
    ctx.fillRect(0, 0, canW, canH)
    drawBG1()
    ctx.save()
    ctx.translate(transX, transY)
    drawBG2()
    drawBricks()
    drawPlayer()
    drawBoxes()
    ctx.restore()
    ctx.fillStyle="white"
    ctx.font="20px Arial"
    let text="Level: "+level+"    Z: undo    N: next level    P: previous level    R: restart the level    Q: quit"
    let textW=ctx.measureText(text).width
    ctx.fillText(text, (canW-textW)/2, 20)
}


function drawGameover(){
    ctx.fillStyle="black"
    ctx.fillRect(0, 0, canW, canH)
    ctx.fillStyle="rgb(128, 255, 255)"
    ctx.font="40px Arial"
    let mainText="Congratulations"
    let mainTextW=ctx.measureText(mainText).width
    let mainTextH=40
    let x=(canW-mainTextW)/2
    let y=(canH-mainTextH)/3
    ctx.fillText(mainText, x, y)

    ctx.fillStyle="white"
    ctx.font="30px Arial"
    let subText1="Current level: "+level
    let subText1W=ctx.measureText(subText1).width
    let subText1H=30
    x=(canW-subText1W)/2
    y=y+subText1H+30
    ctx.fillText(subText1, x, y)

    let subText2="Press C to go back the current level"
    let subText2W=ctx.measureText(subText2).width
    let subText2H=30
    x=(canW-subText2W)/2
    y=y+subText2H+30
    ctx.fillText(subText2, x, y)
    
    let subText3="Enter to restart"
    let subText3W=ctx.measureText(subText3).width
    let subText3H=30
    x=(canW-subText3W)/2
    y=y+subText3H+30
    ctx.fillText(subText3, x, y)
}

function draw(){
    if(gameState=="menu"){
        drawMenu()
    }else if(gameState=="play"){
        drawPlay()
    }else if(gameState=="gameover"){
        drawGameover()
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