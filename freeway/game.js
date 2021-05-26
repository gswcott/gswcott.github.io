let can, canW, canH, ctx
let trackLife=24
let trackChicken=32
let trackCar=64
let gapCenter=40
let tracksY=[]
let tsChicken, tsHearts
let tsCars=[]
let listQuadsHearts=[]
let maxLives=5
let gameover, victory
let nbLives
let listSprites=[]
let chicken={}
let bgMusic, collideSound
let oldTime=0

NIMGS = 10

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
    ctx=can.getContext("2d")
    canW=can.width
    canH=can.height
    bgMusic=new Audio()
    collideSound=new Audio()
    bgMusic.src="sounds/copycat.mp3"
    collideSound.src="sounds/line.wav"
    tsChicken=new Image()
    tsChicken.src="images/chicken.png"
    tsChicken.onload = loader 
    tsHearts=new Image()
    tsHearts.src="images/hearts.png"
    tsHearts.onload = loader 
    listQuadsHearts[0]=renderQuad(0, 0, 16, 16)
    listQuadsHearts[1]=renderQuad(0, 3, 16, 16)
    getTsCars()
    getTracksY()
    initGame()
    keyboardMap={}
    window.onkeyup = function(e) {keyboardMap[e.key] = false;} 
    window.onkeydown = function(e) { keyboardMap[e.key] = true;}
    bgMusic.loop=true
    bgMusic.play()
}

function renderQuad(pR, pC, pSizeW, pSizeH){
    let quad={}
    quad.x=pC*pSizeW
    quad.y=pR*pSizeH
    quad.w=pSizeW
    quad.h=pSizeH
    return quad
}

function getTsCars(){
    tsCars=[]
    for(let i=0; i<8; i++){
        tsCars[i]=new Image()
    }
    tsCars[0].src="images/cars/black64a.png"
    tsCars[1].src="images/cars/blue64a.png"
    tsCars[2].src="images/cars/green64a.png"
    tsCars[3].src="images/cars/orange64a.png"
    tsCars[4].src="images/cars/purple64a.png"
    tsCars[5].src="images/cars/red64a.png"
    tsCars[6].src="images/cars/white64a.png"
    tsCars[7].src="images/cars/yellow64a.png"
    for(let i=0; i<8; i++){
        tsCars[i].onload = loader 
    }
}

function getTracksY(){
    for(let i=0; i<8; i++){
        if (i<4){
            tracksY.push(trackLife+trackChicken+i*trackCar)
        }else{
            tracksY.push(trackLife+trackChicken+i*trackCar+gapCenter)
        }
    }
}

function initGame(){
    gameover=false
    victory=false
    nbLives=maxLives
    listSprites=[]
    initChicken()
    initCars()
}
function initChicken(){
    let dirs=["up", "right", "down", "left"]
    let listQuads=[]
    let sizeC=32
    for(let r=0; r<4; r++){
        listQuads[dirs[r]]=[]
        for (let c=0; c<3; c++){
            listQuads[dirs[r]][c]=renderQuad(r, c, sizeC, sizeC)
        }
    }
    createChicken(canW/2-sizeC/2, tracksY[tracksY.length-1]+trackCar, sizeC, tsChicken, listQuads)
}

function createChicken(pX, pY, pSize, pTs, pListQuads){
    chicken={}
    chicken.x=pX
    chicken.y=pY
    chicken.size=pSize
    chicken.ts=pTs
    chicken.listQuads=pListQuads
    chicken.vx=100
    chicken.vy=100
    chicken.dir="up"
    chicken.frame=0
    chicken.animationTimer=1/6
    chicken.timer=chicken.animationTimer
    chicken.touched=false
}

function initCars(){
    let sizeCar=64
    let gaps=[100, 120, 150, 200, 200, 150, 120, 100]
    let vxs=[-120, -150, -170, -200, 200, 180, 150, 120]
    for (let i=0; i<tsCars.length; i++){
      let ts=tsCars[i]
      let numTile=1
      let diffX=Math.random()*600-300
      if (i>=4) {
          numTile=5
      }
      let quad=renderQuad(0, numTile, sizeCar, sizeCar)
      createSprite(diffX+canW/2-gaps[i]-sizeCar, tracksY[i], vxs[i], sizeCar, ts, quad)
      createSprite(diffX+canW/2, tracksY[i], vxs[i], sizeCar, ts, quad)
      createSprite(diffX+canW/2+gaps[i]+sizeCar, tracksY[i], vxs[i], sizeCar, ts, quad)
    }  
}

function createSprite(pX, pY, pVx, pSize, pTs, pQuad){
    sprite={}
    sprite.x=pX
    sprite.y=pY
    sprite.vx=pVx
    sprite.size=pSize
    sprite.ts=pTs
    sprite.quad=pQuad
    listSprites.push(sprite)
}

function updateCars(dt){
    for(let i=0; i<listSprites.length; i++){
        let sprite=listSprites[i]
        sprite.x+=sprite.vx*0.016
        if (sprite.x>=canW){
            sprite.x=-sprite.size
        }else if (sprite.x<=-sprite.size){
            sprite.x=canW
        }
    }
}
function updateChicken(dt){
    chicken.timer-=dt
    if (chicken.timer<=0){
      chicken.frame++
      if (chicken.frame>=3){
          chicken.frame=0
      } 
      chicken.timer=chicken.animationTimer
    } 
    if (keyboardMap["ArrowUp"]){
        chicken.dir="up"
        chicken.y-=chicken.vy*dt
      }else if (keyboardMap["ArrowRight"]){
        chicken.dir="right"
        chicken.x+=chicken.vx*dt
      }else if (keyboardMap["ArrowDown"]){
        chicken.dir="down"
        chicken.y+=chicken.vy*dt
      }else if (keyboardMap["ArrowLeft"]){
        chicken.dir="left"
        chicken.x-=chicken.vx*dt
    }  
    if (chicken.y>canH-chicken.size){
        chicken.y=canH-chicken.size
      }else if (chicken.y<=trackLife){
        chicken.y=trackLife
        victory=true
      }else if(chicken.x<0){
          chicken.x=0
      }else if (chicken.x>canW-chicken.size){
        chicken.x=canW-chicken.size
    }
}

 
function update(dt){
    if (keyboardMap["Enter"]){
        initGame()
    }
    if (gameover==false && victory==false){
        updateCars(dt)
        updateChicken(dt)
        for(let i=0; i<listSprites.length; i++){
            let sprite=listSprites[i]
            if (chicken.y>sprite.y-chicken.size+16 && chicken.y < sprite.y+sprite.size-16 && chicken.x>sprite.x-chicken.size+16 && chicken.x<sprite.x+sprite.size-16){
                chicken.touched=true
                break
            }
        } 
        if (chicken.touched){
            nbLives--
            if (nbLives<=0){
                nbLives=0
                gameover=true
            }else{
                initChicken()
            }
            collideSound.play()
        } 
    } 
}


function drawBG(){
    ctx.fillStyle="rgb(50, 50, 50)"
    ctx.fillRect(0, 0, canW, canH)
    for(let i=0; i<8; i++){
        if(i!=4){
            ctx.setLineDash([])
            ctx.lineWidth=2
            if (i==0){
                ctx.strokeStyle="rgb(0, 255, 128)"
            }else{
                ctx.strokeStyle="rgb(255, 255, 255)"
            }
            ctx.beginPath()
            ctx.moveTo(0,tracksY[i])
            ctx.lineTo(canW, tracksY[i])
            ctx.stroke()
        }else{
            ctx.setLineDash([6,6])
            ctx.lineWidth=4
            ctx.beginPath()
            ctx.moveTo(0,tracksY[i]-gapCenter)
            ctx.lineTo(canW, tracksY[i]-gapCenter)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(0,tracksY[i])
            ctx.lineTo(canW, tracksY[i])
            ctx.stroke()
        }
    }
    ctx.setLineDash([])
    ctx.lineWidth=2
    ctx.strokeStyle="rgb(0, 255, 128)"
    ctx.beginPath()
    ctx.moveTo(0,tracksY[7]+trackCar)
    ctx.lineTo(canW, tracksY[7]+trackCar)
    ctx.stroke()
}
  
function drawLives(){
    let size=32
    for(let i=1; i<=maxLives; i++){
        let quad
        if (i<=nbLives){
            quad=listQuadsHearts[0]
        }else{
            quad=listQuadsHearts[1]
        }
        ctx.drawImage(tsHearts, quad.x, quad.y, quad.w, quad.h, (canW-maxLives*size)/2+(i-1)*size, 0, size, size)
    }
}

function drawSprites(){
    for(let i=0; i<listSprites.length; i++){
        let sprite=listSprites[i]
        let quad=sprite.quad
        ctx.drawImage(sprite.ts, quad.x, quad.y, quad.w, quad.h, sprite.x, sprite.y, sprite.size, sprite.size)
    } 
}

function drawChicken(){
    let quad=chicken.listQuads[chicken.dir][chicken.frame]
    ctx.drawImage(chicken.ts, quad.x, quad.y, quad.w, quad.h, chicken.x, chicken.y, chicken.size, chicken.size)
}


function drawText(pText){
    ctx.fillStyle="white"
    ctx.font="40px Arial"
    let w=ctx.measureText(pText).width
    ctx.fillText(pText, (canW-w)/2, tracksY[4]-2)
}
 
function draw(){
    drawBG()
    drawLives()
    drawSprites()
    ctx.font="20px Arial"
    ctx.fillStyle="white"
    ctx.fillText("Enter to restart", 20, 20)
    if (gameover==false){
        drawChicken()
        if (victory){
            drawText("WIN")
        }
    }else{
        drawText("GAME OVER")
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