window.onload=initialisation
function initialisation(){
    can=document.querySelector("canvas")
    ctx=can.getContext("2d")
    players=document.querySelector(".players")
    nbCaseR=5
    nbCaseC=5
    caseSizeW=Math.floor(can.width/(nbCaseC)); 
    caseSizeH=Math.floor(can.height/(nbCaseR)); 
    currentState="menu"
    can.addEventListener("mousemove", mousePosition)
    can.addEventListener("mousedown", update)
    document.onkeydown = (e) => {
        if(e.code == "Space" && currentState != "game"){
            start();
        }
    }
    gameLoop()
}

function start(){
    currentState="game"
    matrixCase=new Array(nbCaseR)
    for(var i=0; i<nbCaseR; i++){
        matrixCase[i]=new Array(nbCaseC)
        for(var j=0; j<nbCaseC; j++){
            matrixCase[i][j]=0
        }
    }
    player=1
    pi=nbCaseR
    pj=nbCaseC
    players.innerHTML='<div id="player1" class="player selectedRed"> <div class="hor"> </div> </div>' +
    '<div id="player2" class="player"><div class="ver"> </div> </div>'
    player1Div=document.getElementById("player1")
    player2Div=document.getElementById("player2")
}

function mousePosition(e){
    let rect=can.getBoundingClientRect();
    let x=e.clientX-rect.left
    let y=e.clientY-rect.top
    pi=Math.floor(y/caseSizeH)
    pj=Math.floor(x/caseSizeW)
}

function update(){
    if(currentState=="game"){
        if(validPosition()) {
            if(player==1){
                matrixCase[pi][pj]=player
                matrixCase[pi][pj+1]=player
            }else{
                matrixCase[pi][pj]=player
                matrixCase[pi+1][pj]=player
            }
            player=3-player
            player1Div.classList.toggle("selectedRed")
            player2Div.classList.toggle("selectedBlue")
            verifyGameover()
        }
    }
}

function validPosition(){
    if (player==1){
        return (pj<nbCaseC-1 && pi<nbCaseR && matrixCase[pi][pj]==0 && matrixCase[pi][pj+1]==0)
    }
    if (player==2){
        return (pi<nbCaseR-1 && pj<nbCaseC && matrixCase[pi][pj]==0 && matrixCase[pi+1][pj]==0)
    }
}

function verifyGameover(){
    let count=0
    if (player==1){
        let i=0
        while(i<nbCaseR){
            let j=0
            while(j<nbCaseC-1){
                if(matrixCase[i][j]==0 && matrixCase[i][j+1]==0){
                    count=count+1
                    break;
                }
                j++
            }
            i++
        }
        if(count==0){
            winner="blue"
            currentState="gameover"
        }
    }else{
        let i=0
        while(i<nbCaseR-1){
            let j=0
            while(j<nbCaseC){
                if (matrixCase[i][j]==0 && matrixCase[i+1][j]==0){
                    count=count+1
                    break;
                }
                j++
            }
            i++
        }
        if(count==0){
           winner="red"
           currentState="gameover"
        }
    }
}



function drawBG(){
    ctx.fillStyle="gray"
    ctx.fillRect(0, 0, can.width, can.height)
}
function drawGrid(){
    for(var i=0; i<nbCaseR; i++){
        for(var j=0; j<nbCaseC; j++){
            if (matrixCase[i][j]==0){
                ctx.fillStyle="lightgray"      
            }
            if (matrixCase[i][j]==1){
                ctx.fillStyle="red"
            }
            if (matrixCase[i][j]==2){
                ctx.fillStyle="blue"
            }
            ctx.fillRect(j*caseSizeW, i*caseSizeH, caseSizeW, caseSizeH)
        }
    }
    ctx.strokeStyle="black"
    ctx.lineWidth=2
    for(var i=1; i<nbCaseR; i++){
        ctx.beginPath()
        ctx.moveTo(0, i*caseSizeH)
        ctx.lineTo(can.width, i*caseSizeH)
        ctx.stroke()
    }
    for(var j=1; j<nbCaseC; j++){
        ctx.beginPath()
        ctx.moveTo(j*caseSizeW, 0)
        ctx.lineTo(j*caseSizeW, can.height)
        ctx.stroke()
    }
}

function drawCurrentCase(){
    ctx.fillStyle="gray"
    if (player==1){
        ctx.fillRect(pj*caseSizeW, pi*caseSizeH, 2*caseSizeW, caseSizeH)
    }
    if (player==2){
        ctx.fillRect(pj*caseSizeW, pi*caseSizeH, caseSizeW, 2*caseSizeH)
    }
}

function drawGame(){
    drawBG()
    drawGrid()
    if(validPosition()){
        drawCurrentCase()
    }
}

function drawMenu(){
    ctx.fillStyle="Green"      
    ctx.fillRect(0, 0, can.width, can.height)
    ctx.font = 'bold 28px serif'
    ctx.strokeStyle="White"
    ctx.strokeText("Welcome to Domineering !", 0, can.height/2-30)
    ctx.font = 'bold 24px serif'
    ctx.strokeText("Press space to start a new game.", 0, can.height/2+30)
}
function drawGameover(){
    ctx.fillStyle="Black"      
    ctx.fillRect(0, 0, can.width, can.height)
    ctx.font = 'bold 28px serif'
    ctx.strokeStyle="White"
    ctx.strokeText("Game over !!!", 0, can.height*2/5)
    ctx.fillStyle="Orange"
    ctx.font = 'bold 24px serif'
    ctx.fillText("The " + winner + " player won !!",  0, can.height/2)
    ctx.strokeStyle="White"
    ctx.strokeText("Press space to start a new game.", 0, can.height*3/5)
}

function gameLoop(){
    if (currentState=="menu"){
        drawMenu()
    }else if(currentState=="game"){
        drawGame()
    }else if (currentState=="gameover"){
        drawGameover()
    }
    requestAnimationFrame(gameLoop)
}