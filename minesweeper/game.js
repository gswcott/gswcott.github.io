window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    canW=can.width
    canH=can.height
    ctx=can.getContext("2d")

    nbRow=9
    nbCol=9
    size=32
    nbBombs=10
    restart()
    imgSpriteSheet=new Image()
    imgSpriteSheet.src="images/gaming_SpriteSheet.png"
    listQuads=[]
    for (let i=0; i<2; i++){
        for (let j=0; j<4; j++){
            listQuads.push(renderQuad(i, j, 31))
        }
    }
    coverQuad=renderQuad(2,1,32)
    bombQuad=renderQuad(3,2,32)
    bombCQuad=renderQuad(3,0,32)
    flagQuad=renderQuad(2,3,32)

    bgMusic=new Audio()
    bgMusic.src="sounds/music.ogg"
    bgMusic.play()
    particles=[]
    gravity=10
    soundFirework=new Audio()
    soundFirework.src="sounds/explode.mp3"
    can.addEventListener("mousedown", demine)
    restartBtn=document.getElementById("restart")
    restartBtn.onclick=restart
    requestAnimationFrame(gameLoop)
}

function restart(){
    currentState="game"
    timerV=null
    oldTime=0
    victory=false
    gameover=false
    gridBombs=[]
    gridCount=[]
    gridCover=[]
    for(let r=0; r<nbRow; r++){
        gridBombs[r]=[]
        gridCount[r]=[]
        gridCover[r]=[]
        for(let c=0; c<nbCol; c++){
            gridBombs[r][c]=0
            gridCount[r][c]=0
            gridCover[r][c]=1
        }
    }
    randomBombs()
    calculateBombs()
}


function randomBombs(){
    nb=10
    while(nb>0){
        let r=Math.floor(Math.random()*nbRow)
        let c=Math.floor(Math.random()*nbCol)
        gridBombs[r][c]=1
        nb--
    }
}

function calculateBombs(){
    for (let r=0; r<nbRow; r++){
        for (let c=0; c<nbCol; c++){
            let nb=0
            nb=nb+getBomb(r-1, c-1)
            nb=nb+getBomb(r-1, c)
            nb=nb+getBomb(r-1, c+1)
            nb=nb+getBomb(r, c-1)
            nb=nb+getBomb(r, c+1)
            nb=nb+getBomb(r+1, c-1)
            nb=nb+getBomb(r+1, c)
            nb=nb+getBomb(r+1, c+1)
            gridCount[r][c]=nb
        }
    }
}

function getBomb(pR, pC){
    if (pR<0 || pR>nbRow-1 || pC<0 || pC>nbCol-1) return 0
    return gridBombs[pR][pC]
}

function renderQuad(pR, pC, pSizeQ){
    let quad={}
    quad.x=pC*pSizeQ
    quad.y=pR*pSizeQ
    quad.w=pSizeQ
    quad.h=pSizeQ
    return quad
}

function flood(pR, pC){
    if (pR<0 || pR>nbRow-1 || pC<0 || pC>nbCol-1) return
    if (gridCount[pR][pC]!=0){
        gridCover[pR][pC]=0
        return 
    }
    if (gridCover[pR][pC]==0) return
    gridCover[pR][pC]=0
    flood(pR-1, pC)
    flood(pR, pC+1)
    flood(pR+1, pC)
    flood(pR, pC-1)
}

function demine(e){
    let rect=can.getBoundingClientRect();
    let x=e.clientX-rect.left
    let y=e.clientY-rect.top
    let r=Math.floor(y/size)
    let c=Math.floor(x/size)
    if (r<0 || r>nbRow-1 || c<0 || c>nbCol-1){
        return 
    }
    if (gridCover[r][c]!=2) {
        if(gridCover[r][c]==1){
            if (e.button==0){
                if (gridBombs[r][c]==1){
                    gridBombs[r][c]=2
                    gridCover[r][c]=0
                    gameover=true
                }else {
                    flood(r, c)
                }
            }else if (e.button==2){
                gridCover[r][c]=2
            } 
        }
    }else{
      if (e.button==2){
        gridCover[r][c]=1
      } 
    }
}

function update(dt){
    if (currentState=="game"){
        let nbCovers=0
        let nbRightFlags=0
        for (let r=0; r<nbRow; r++){
            for (let c=0; c<nbCol; c++){
                if (gridCover[r][c]!=0){
                    nbCovers++
                    if (gridCover[r][c]==2 && gridBombs[r][c]==1){
                      nbRightFlags++
                    } 
                }
            }
        } 
        if (nbCovers==nbBombs || nbRightFlags==nbBombs){
            victory=true
        } 
        if (victory || gameover){
            if (timerV==null){
                timerV=0
            }else {
                timerV=timerV+1
            }
            if (timerV>=60){
                currentState="gameover"
            }
        } 
    }else if (currentState=="gameover"){
        if(victory){
            if (particles.length==0) {
                createFireworks()
            }else{
                updateParticle(dt)
            }

        }
    } 
}

function drawGame(){
    for (let r=0; r<nbRow; r++){
        for (let c=0; c<nbCol; c++){
            let coord
            if (gridBombs[r][c]==0){
                coord=listQuads[gridCount[r][c]]
            }else if (gridBombs[r][c]==1){
                coord=bombQuad
            }else if (gridBombs[r][c]==2){
                coord=bombCQuad
            } 
            ctx.drawImage(imgSpriteSheet, coord.x, coord.y, coord.w, coord.h, c*size, r*size, size, size)
            if (gridCover[r][c]!=0 && gameover==false && victory == false){
                coord=coverQuad
                if (gridCover[r][c]==2){
                    coord=flagQuad
                } 
            ctx.drawImage(imgSpriteSheet, coord.x, coord.y, coord.w, coord.h, c*size, r*size, size, size)
            } 
        }
    }
}

function draw(){
    if (currentState=="game"){
        drawGame()
    }else if (currentState=="gameover"){
        if(victory){
            drawVictory()
        }else{
            drawGameover()
        }

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


function getRandomColor() {
    let letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }
  
function createParticle(x, y){
    let particle={}
    particle.x=x
    particle.y=y
    let angle=Math.random()*360
    let v=Math.random()*30
    particle.vx=v*Math.cos(angle)
    particle.vy=v*Math.sin(angle)
    particle.life=Math.random(1, 3)
    particle.color=getRandomColor()
    particles.push(particle)
}

function createFireworks(){
    for (let nbP=0; nbP<100; nbP++){
        createParticle(canW/2, canH/4)
    }
    soundFirework.play()
}

function updateParticle(dt){
    for (let i=particles.length-1; i>=0; i--){
        let p=particles[i]
        p.vy=p.vy+gravity*dt
        p.x=p.x+p.vx*dt
        p.y=p.y+p.vy*dt
        p.life=p.life-dt
        if (p.life<=0) {
            particles.splice(i,1)
        }
    }
}

function drawFireWorks(){
  for (let i=0; i<particles.length; i++){
    let p=particles[i]
    ctx.fillStyle=p.color
    ctx.fillRect(p.x, p.y, 1, 1)
  } 
}

function drawVictoryText(){
    ctx.fillStyle="White"
    ctx.fillText("Bravo !", canW*2/5, canH*2/3)
    ctx.fillText("Press restart to begain a new game.", canW/10, canH*2/3+20)
    ctx.font = 'bold 16px serif'
}

function drawVictory(){
    ctx.fillStyle="black"
    ctx.fillRect(0, 0, canW, canH)
    drawFireWorks()
    drawVictoryText()
}

function drawGameover(){
    ctx.fillStyle="black"
    ctx.fillRect(0, 0, canW, canH)
    ctx.fillStyle="white"
    ctx.fillText("Game over !", canW*2/5, canH*2/3)
    ctx.fillText("Press restart to begain a new game.", canW/10, canH*2/3+20)
    ctx.font = 'bold 16px serif'
}