window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    canW=can.width
    canH=can.height
    ctx=can.getContext("2d")
    restartBtn=document.getElementById("restart")
    restartBtn.onclick=restart
    currentState="game"
    imgSmile=new Image()
    imgSmile.src="images/smile.jpg"
    soundFirework=new Audio()
    bgMusic=new Audio()
    soundFirework.src="sounds/explode.mp3"
    bgMusic.src="sounds/music.ogg"
    nbCaseR=4
    nbCaseC=4
    caseSizeW=canW/nbCaseC
    caseSizeH=canH/nbCaseR
    listQuads=renderQuads()
    gravity=10
    particles=[]
    matrixCase=new Array(nbCaseR)
    randomMaxtrix()
    can.addEventListener("mousedown",moveM)
    document.onkeydown=move
    restartBtn.onclick=restart
    bgMusic.play()
    oldTime=0
    timerV=null
    requestAnimationFrame(gameLoop)
}

function move(e){
    key=e.code
    if (key=="ArrowLeft"){
        leftMove()
    }else if (key=="ArrowUp"){
        upMove()
    }else if (key=="ArrowRight"){
        rightMove()
    }else if (key=="ArrowDown"){
        downMove()
    } 
}

function moveM(e){
    let rect=can.getBoundingClientRect();
    let x=e.clientX-rect.left
    let y=e.clientY-rect.top
    posRM=Math.floor(y/caseSizeH)
    posCM=Math.floor(x/caseSizeW)
    if (x>=0 && x<=canW && y>=0 && y<=canH){
        if (posR-posRM==1 && posC==posCM){
            downMove()
        }else if (posR-posRM==-1 && posC==posCM){
            upMove()
        }else if (posR==posRM && posC-posCM==1){
            rightMove()
        }else if (posR==posRM && posC-posCM==-1){
            leftMove()
        }
    }
}

function randomMaxtrix(){
    posR=nbCaseR-1
    posC=nbCaseC-1
    for (let i=0; i<nbCaseR; i++){
        matrixCase[i]=new Array(nbCaseC)
        for (let j=0; j<nbCaseR; j++){
            matrixCase[i][j]=nbCaseC*i+j
        }
    }
    for(let i=0; i<100; i++){
        let num=Math.floor(Math.random()*4)
        if (num==0){
            leftMove()
        }else if (num==1){
            upMove()
        }else if (num==2){
            rightMove()
        }else if (num==3){
            downMove()
        }
    }
}

function leftMove(){
    if (posC+1<nbCaseC){
        matrixCase[posR][posC]=matrixCase[posR][posC+1]
        posC=posC+1        
        matrixCase[posR][posC]=15
    } 
}
function upMove(){
    if (posR+1<nbCaseR){
        matrixCase[posR][posC]=matrixCase[posR+1][posC]
        posR=posR+1        
        matrixCase[posR][posC]=15
    }     
}

function rightMove(){
    if (posC-1>=0){
        matrixCase[posR][posC]=matrixCase[posR][posC-1]
        posC=posC-1        
        matrixCase[posR][posC]=15
    }
}

function downMove(){
    if (posR-1>=0){
        matrixCase[posR][posC]=matrixCase[posR-1][posC]
        posR=posR-1        
        matrixCase[posR][posC]=15
    }
}

function renderQuads(){
    let quads=[]
    for (let i=0; i<nbCaseR; i++){
        for (let j=0; j<nbCaseC; j++){
            let quad={}
            quad.x=j*caseSizeW
            quad.y=i*caseSizeH
            quad.w=caseSizeW
            quad.h=caseSizeH
            quads.push(quad)
        }
    }
    return quads
}

function restart(){
    randomMaxtrix()
    currentState="game"
    timerV=null
}


function victory(){
    let num=0
    let count=0
    while (num<nbCaseR*nbCaseC-1){
      let i, j
      i=Math.floor(num/nbCaseC)
      j=num%nbCaseC
      if (matrixCase[i][j]==num){
        count=count+1
      }
      num=num+1
    } 
    if (count==15){
      return true
    }else {
      return false
    }
}

function update(dt){
    if (currentState=="game"){
        if (victory()){
            if (timerV==null){
                timerV=0
            }else {
                timerV=timerV+1
            }
            if (timerV>=120){
                currentState="gameover"
            }
        } 
    }else if (currentState=="gameover"){
        if (particles.length==0) {
            createFireworks()
        }else{
            updateParticle(dt)
        }
    } 
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
    ctx.strokeStyle="White"
    ctx.strokeText("Bravo !", canW*2/5, canH*2/3)
    ctx.strokeText("Press restart to begain a new game.", canW/10, canH*2/3+20)
    ctx.font = 'bold 14px serif'
}

function drawGameover(){
    ctx.fillStyle="black"
    ctx.fillRect(0, 0, canW, canH)
    drawFireWorks()
    drawVictoryText()
}

function drawGrid(){
    ctx.fillStyle="white"
    ctx.fillRect(0,0, canW, canH)
    for (let i=0; i<nbCaseR; i++){
        for (let j=0; j<nbCaseR; j++){
            if (matrixCase[i][j]!=15){
                let coord=listQuads[matrixCase[i][j]]
                ctx.drawImage(imgSmile, coord.x, coord.y, coord.w, coord.h, j*caseSizeW, i*caseSizeH, caseSizeW,caseSizeH)
            }
        }
    }
    ctx.strokeStyle="black"
    ctx.lineWidth=1
    for(let i=1; i<nbCaseR; i++){
        ctx.beginPath()
        ctx.moveTo(0, i*caseSizeH)
        ctx.lineTo(can.width, i*caseSizeH)
        ctx.stroke()
    }
    for(let j=1; j<nbCaseC; j++){
        ctx.beginPath()
        ctx.moveTo(j*caseSizeW, 0)
        ctx.lineTo(j*caseSizeW, can.height)
        ctx.stroke()
    }
}

function draw(){
    if (currentState=="game"){
        drawGrid()
    }else if (currentState=="gameover"){
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