
window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    canW=can.width
    canH=can.height
    ctx=can.getContext("2d")
    scoreP=document.getElementById("scoreP")
    lineP=document.getElementById("lineP")
    levelP=document.getElementById("levelP")
    oldTime=0
    dropSpeed=1
    timerDrop=dropSpeed
    listTetros=initializeTetros()
    initializeGrid()
    listTetrosRandomDraw=[]
    spawnTetro()
    keyboardMap={}
    window.onkeyup = function(e) {keyboardMap[e.key] = false;} 
    window.onkeydown = function(e) { 
        keyboardMap[e.key] = true;
        move(e)
    }
    score=0
    level=1
    nbLines=0
    gameState=""
    menuSin=5
    pauseDownDrop=false
    musicMenu=new Audio()
    musicPlay=new Audio()
    musicGameover=new Audio()
    musicLevelUp=new Audio()
    musicLine=new Audio()
    musicFirework=new Audio()
    musicMenu.src="sounds/tetris-gameboy-01.mp3"
    musicPlay.src="sounds/tetris-gameboy-02.mp3"
    musicGameover.src="sounds/tetris-gameboy-03.mp3"
    musicLevelUp.src="sounds/levelup.wav"
    musicLine.src="sounds/line.wav"
    musicFirework.src="sounds/explode.mp3"
    fireworks=[]
    dispearSpeed=2
    pauseFirework=false
    timerFirework=dispearSpeed
    startMenu()
    requestAnimationFrame(gameLoop)
}

function startMenu(){
    gameState="menu"
    musicGameover.pause()
    musicPlay.pause()
    musicMenu.loop=true
    musicMenu.play()
    firework=createFirework(canW/2, canH/2)
}

function startPlay(){
    gameState="play"
    initializeGrid()
    //initializeListTetrosRandomDraw()
    spawnTetro()
    musicMenu.pause()
    musicPlay.loop=true
    musicPlay.play()
}

function startGameover(){
    gameState="gameover"
    //musicPlay.stop()
    musicGameover.loop=true
    musicGameover.play()
}

function inputMenu(key){
    if (key=="Enter"){
        startPlay()
    }
}
function initializeListTetrosRandomDraw(){
    for(let i=1; i<listTetros.length; i++){
        listTetrosRandomDraw.push(i)
        listTetrosRandomDraw.push(i)
    }
}

function scoring(pLines){
    let s
    if (pLines==1) {
        s=100*level
    }else if (pLines==2){
        s=300*level
    }else if (pLines==3){
        s=400*level
    }else if (pLines==4){
        s=800*level
    }
    return s
}

function manageLevel(){
    let newLevel=Math.floor(nbLines/10)+1
    if(level<10){
        if (newLevel>level){
            level=newLevel
            dropSpeed=dropSpeed-0.08
            musicLevelUp.play()
        }
    }
}

function initializeGrid(){
    grid={}
    grid.nbRow=20
    grid.nbCol=10
    grid.cellSize=32
    grid.cells=new Array(grid.nbRow)
    for (let r=0; r<grid.nbRow; r++){
        grid.cells[r]=new Array(grid.nbCol)
        for (let c=0; c<grid.nbCol; c++){
            grid.cells[r][c]=0
        }
    }
}

function spawnTetro(){
    if(listTetrosRandomDraw.length==0){
        initializeListTetrosRandomDraw()
    }
    let num=Math.floor(Math.random()*listTetrosRandomDraw.length)
    currentTetro={}
    currentTetro.id=listTetrosRandomDraw[num]
    listTetrosRandomDraw.splice(num, 1)
    currentTetro.rotation=0
    currentTetro.position={}
    currentTetro.position.c=Math.floor((grid.nbCol-listTetros[currentTetro.id].shape[currentTetro.rotation][0].length)/2)
    currentTetro.position.r=0
    pauseDownDrop=true
    if (collide()) {
        startGameover()
    }
}

function inputPlay(key){
    let oldR=currentTetro.position.r
    let oldC=currentTetro.position.c
    let oldRotation=currentTetro.rotation
    if (key=="ArrowUp"){
        currentTetro.rotation+=1
        if (currentTetro.rotation>=listTetros[currentTetro.id].shape.length){
            currentTetro.rotation=0
        }
    }
    if(key=="ArrowLeft"){
        currentTetro.position.c-=1
    }
    if(key=="ArrowRight"){
        currentTetro.position.c+=1
    }
    if(collide()){
        currentTetro.position.r=oldR
        currentTetro.position.c=oldC
        currentTetro.rotation=oldRotation
    }
    if(pauseDownDrop==false){
        if (key=="ArrowDown"){
            currentTetro.position.r+=1
            timerDrop=dropSpeed
        }
        if(collide()){
            currentTetro.position.r-=1
            transfer()
            spawnTetro()
        }
    }
}

function inputGameover(key){
    if (key=="Enter") {
        startMenu()
    }
}

function move(e){
    let key=e.key
    if (gameState=="menu"){
        inputMenu(key)
    }else if (gameState=="play"){
        inputPlay(key)
    } else if (gameState=="gameover"){
        inputGameover(key)
    } 
}

function collide(){
    let shape=listTetros[currentTetro.id].shape[currentTetro.rotation]
    for (let r=0; r<shape.length; r++){
        for (let c=0; c<shape[0].length; c++){
            let rGrid=r+currentTetro.position.r
            let cGrid=c+currentTetro.position.c
            if(shape[r][c]==1){
                if(cGrid<0 || cGrid>grid.nbCol-1) {
                    return true
                }
                if(rGrid>grid.nbRow-1) {
                    return true
                }
                if(grid.cells[rGrid][cGrid]!=0){
                    return true
                }
            }
        }
    }
    return false
}
function updateMenu(dt){
    menuSin=menuSin+60*dt
    updateParticle(firework, dt)
}
function updatePlay(dt){
    if(!Object.keys(keyboardMap).includes("ArrowDown") || !keyboardMap["ArrowDown"]){
        pauseDownDrop=false
    }
    timerDrop-=dt
    if (timerDrop<=0){
        currentTetro.position.r+=1
        timerDrop=dropSpeed
        if(collide()){
            currentTetro.position.r-=1
            transfer()
            spawnTetro()
        }
    }
    // remove complete row
    let listRemoveL=[]
    for (let r=0; r<grid.nbRow; r++){
        let numCompleteRow=true
        for (let c=0; c<grid.nbCol; c++){
            if(grid.cells[r][c]==0){
                numCompleteRow=false
                break
            }
        }
        if (numCompleteRow){
            listRemoveL.push(r)
        }
    }
    let nbRemoveL=listRemoveL.length
    //create fireworks
    if (nbRemoveL>0){
        if (pauseFirework==false){
            for (let r=0; r<nbRemoveL; r++){
                for (let c=0; c<grid.nbCol; c++){
                    let x=(c+1/2)*grid.cellSize
                    let y=(listRemoveL[r]+1/3)*grid.cellSize
                    fireworks.push(createFirework(x, y))
                }
            }
            musicFirework.play()
            pauseFirework=true 
        }else {
            for (let i=0; i<fireworks.length; i++){
                updateParticle(fireworks[i], dt)
            }
            timerFirework-=dt
        }
        if (timerFirework<=0){
            for (let i=0; i<nbRemoveL; i++){
                removeRow(listRemoveL[i])
            } 
            musicLine.play()    
            score=score+scoring(nbRemoveL)
            nbLines=nbLines+nbRemoveL
            manageLevel()
            timerFirework=dispearSpeed
            pauseFirework=false
        } 
    }
}
function removeRow(pR){
    for(let r=pR; r>=1; r--){
        for (let c=0; c<grid.nbCol; c++){
            grid.cells[r][c]=grid.cells[r-1][c]
        }
    }
}

function updateGameover(dt){}

function update(dt){
    if (gameState=="menu"){
        updateMenu(dt)
    }else if (gameState=="play"){
        updatePlay(dt)
    }else if (gameState=="gameover"){
        updateGameover(dt)
    } 
}

function transfer(){
    let shape=listTetros[currentTetro.id].shape[currentTetro.rotation]
    for (let r=0; r<shape.length; r++){
        for (let c=0; c<shape[0].length; c++){
            let rGrid=r+currentTetro.position.r
            let cGrid=c+currentTetro.position.c
            if(shape[r][c]!=0){
                grid.cells[rGrid][cGrid]=currentTetro.id
            }
        }
    }
}



function drawGrid(){
    ctx.fillStyle="black"
    ctx.fillRect(0, 0, canW, canH)
    for (let r=0; r<grid.nbRow; r++){
        for (let c=0; c<grid.nbCol; c++){
            if (grid.cells[r][c]==0){
                ctx.fillStyle="rgb(60, 60, 60)"
            }else{
                let idShape=grid.cells[r][c]
                let color=listTetros[idShape].color
                ctx.fillStyle="rgba("+ color[0]+ ","+color[1]+ ","+color[2]+ ",1)"
            }
            ctx.fillRect(c*grid.cellSize, r*grid.cellSize, grid.cellSize-1, grid.cellSize-1)
        }
    }
}

function drawTetro(pShape, pColor, pRGrid, pCGrid){
    for (let r=0; r<pShape.length; r++){
        for (let c=0; c<pShape[0].length; c++){
            if(pShape[r][c]==1){
                let x=(c+pCGrid)*grid.cellSize
                let y=(r+pRGrid)*grid.cellSize
                ctx.fillStyle="rgb("+ pColor[0]+ ","+pColor[1]+ ","+pColor[2]+ ")"
                ctx.fillRect(x, y, grid.cellSize-1, grid.cellSize-1)
            }
        }
    }
}

function drawMenu(){
    ctx.fillStyle="black"
    ctx.fillRect(0, 0, canW, canH)
    let mainText="WELCOME TO TETRIS"
    let x=canW/3
    let idColor=1
    for(i=0; i<mainText.length; i++) {
        let char=mainText[i]
        let color=listTetros[idColor].color
        let y=canH/3
        y=y+Math.sin((x+menuSin)/50)*30
        ctx.fillStyle="rgb("+color[0]+","+color[1]+"," +color[2]+ ")"
        ctx.fillText(char, x, y)
        x=x+30
        idColor+=1
        if (idColor>=listTetros.length){
            idColor=1
        }
    }
    drawFireWorks(firework)
}

function drawGameover(){
    ctx.fillStyle="black"
    ctx.fillRect(0, 0, canW, canH)
    ctx.fillStyle="White"
    ctx.fillText("GAME OVER! Your score: "+ score, canW/3, canH/3)
    ctx.fillText("ENTER TO RESTART", canW/3, canH/3+20)  
}

function drawPlay(){
    drawGrid()
    for (let i=0; i<fireworks.length; i++){
        drawFireWorks(fireworks[i])
    }
    let shape=listTetros[currentTetro.id].shape[currentTetro.rotation]
    drawTetro(shape,  listTetros[currentTetro.id].color, currentTetro.position.r, currentTetro.position.c)
    scoreP.innerHTML=score
    lineP.innerHTML=nbLines
    levelP.innerHTML=level
}

function draw(){
    if (gameState=="menu"){
        drawMenu()
    }else if (gameState=="play"){
        drawPlay()
    }else if (gameState=="gameover"){
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