
window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    canW=can.width
    canH=can.height
    ctx=can.getContext("2d")
    ctx.scale(2,2)
    map=[]
    imgsTile={}
    listSprites=[]
    tileSize=16
    player={}
    coins=0
    loadImgsTile()
    initGame(0)
    keyboardMap={}
    window.onkeyup = function(e) {keyboardMap[e.key] = false;} 
    window.onkeydown = function(e) { keyboardMap[e.key] = true;}
    oldTime=0
    requestAnimationFrame(gameLoop)
}
function loadImgsTile(){
    imgsTile["1"]=new Image()
    imgsTile["2"]=new Image()
    imgsTile["3"]=new Image()
    imgsTile["4"]=new Image()
    imgsTile["5"]=new Image()
    imgsTile["#"]=new Image()
    imgsTile["["]=new Image()
    imgsTile["]"]=new Image()
    imgsTile["="]=new Image()
    imgsTile["g"]=new Image()
    imgsTile["H"]=new Image()
    imgsTile["<"]=new Image()
    imgsTile[">"]=new Image()
    imgsTile["1"].src="images/tile1.png"
    imgsTile["2"].src="images/tile2.png"
    imgsTile["3"].src="images/tile3.png"
    imgsTile["4"].src="images/tile4.png"
    imgsTile["5"].src="images/tile5.png"
    imgsTile["#"].src="images/tile0.png"
    imgsTile["["].src="images/tile[.png"
    imgsTile["]"].src="images/tile].png"
    imgsTile["="].src="images/tile=.png"
    imgsTile["g"].src="images/tileg.png"
    imgsTile["H"].src="images/tileH.png"
    imgsTile["<"].src="images/tile-arrow-left.png"
    imgsTile[">"].src="images/tile-arrow-right.png"
}
function initGame(pLevel){
    loadLevel(pLevel)
}

function loadLevel(pLevel){
    listSprites=[]
    player={}
    coins=0
    map=levels[pLevel]
    for(let r=0; r<map.length; r++){
        for (let c=0; c<map[r].length; c++){
            let char=map[r][c]
            let x=c*tileSize
            let y=r*tileSize
            if (char=="P"){
                player=createPlayer(x, y)
            }else if (char=="c"){
                createCoin(x, y)
                coins+=1
            }else if (char=="D"){
                createDoor(x, y)
            }else if (char=="@"){
                createEnemy(x, y)
            }
        }
    }
}

function createSprite(pType, pX, pY){
    let sprite={}
    sprite.x=pX
    sprite.y=pY
    sprite.vx=0
    sprite.vy=0
    sprite.type=pType
    sprite.animationSpeed=1/8
    sprite.animationTimer=sprite.animationSpeed
    sprite.animations={}
    sprite.images={}
    sprite.currentAnimation=""
    sprite.frame=0
    sprite.addImages=function(pDir, pListImages){
        for(let i=0; i<pListImages.length; i++){
            let name=pListImages[i]
            let filename=pDir+"/"+name+".png"
            sprite.images[name]=new Image()
            sprite.images[name].src=filename
        }
    }
    sprite.addAnimation=function(pDir, pAnimationName, pListImages){
        sprite.addImages(pDir, pListImages)
        sprite.animations[pAnimationName]=pListImages
    }
    sprite.playAnimation=function(pAnimationName){
        if (sprite.currentAnimation!=pAnimationName){
            sprite.currentAnimation=pAnimationName
            sprite.frame=0
        } 
    }
    listSprites.push(sprite)
    return sprite
}

function createPlayer(pX, pY){
    let player=createSprite("player", pX, pY)
    player.gravity=0
    player.standing=true
    player.flip=false
    player.addAnimation("images/player", "idle", ["idle1", "idle2", "idle3", "idle4"])
    player.addAnimation("images/player", "run", ["run1","run2", "run3", "run4", "run5", "run6","run7", "run8", "run9", "run10"])
    player.addAnimation("images/player", "climb", ["climb1","climb2"])
    player.addAnimation("images/player", "climb_idle", ["climb1"])
    player.playAnimation("idle")
    return player
}

function createEnemy(pX,pY){
    let enemy=createSprite("enemy", pX, pY)
    enemy.flip=false
    enemy.addAnimation("images/enemy", "walk", ["walk0", "walk1", "walk2", "walk3","walk4","walk5"])
    enemy.playAnimation("walk")
    enemy.direction="right"
    enemy.vx=25
    return enemy
}


function createCoin(pX,pY){
    let coin=createSprite("coin", pX, pY)
    coin.addAnimation("images/coin", "idle", ["coin1", "coin2", "coin3", "coin4"])
    coin.playAnimation("idle")
}

function createDoor(pX,pY){
    let door=createSprite("door", pX, pY)
    door.addAnimation("images/door", "idle", ["door-close", "door-open"])
    door.playAnimation("idle")
}

function isInvisible(pID){
    if (pID=="<" || pID==">") return true
    return false
}

function isSolid(pID){
    if (pID=="1" || pID=="2" || pID=="3"|| pID=="4" || pID=="5" || pID=="[" || pID=="]" || pID=="=" || pID=="D") return true
    return false
}
function isJumpThrough(pID){
    if (pID=="g") return true
    return false
}

function collideRight(pSprite){
    let id1=getTileAt(pSprite.x+tileSize, pSprite.y+3)
    let id2=getTileAt(pSprite.x+tileSize, pSprite.y+tileSize-3)
    if ((id1=="D" || id2=="D") && coins==0) return false
    return isSolid(id1) || isSolid(id2)
}


function collideLeft(pSprite){
    let id1=getTileAt(pSprite.x-1, pSprite.y+3)
    let id2=getTileAt(pSprite.x-1, pSprite.y+tileSize-3)
    return isSolid(id1)|| isSolid(id2)
}

function collideBelow(pSprite){
    let id1=getTileAt(pSprite.x+3, pSprite.y+tileSize)
    let id2=getTileAt(pSprite.x+tileSize-3, pSprite.y+tileSize)
    if (isSolid(id1) || isSolid(id2)) return true
    if (isJumpThrough(id1) || isJumpThrough(id2)){
        let row=Math.floor((pSprite.y+tileSize/2)/tileSize)
        let y=row*tileSize
        let distance=pSprite.y-y
        if  (distance>=0 && distance<5) return true
    }
    return false
}

function collideAbove(pSprite){
    let id1=getTileAt(pSprite.x+3, pSprite.y-1)
    let id2=getTileAt(pSprite.x+tileSize-3, pSprite.y-1)
    return isSolid(id1) || isSolid(id2)
}

function collisionCheck(x1, y1, w1, h1, x2, y2, w2, h2){
    if (x1<x2+w2 && x2<x1+w1 && y1<y2+h2 && y2<y1+h1)  return true
    return false
}


function alignOnRow(pSprite){
    let row=Math.floor((pSprite.y+tileSize/2)/tileSize)
    pSprite.y=row*tileSize
}

function alignOnCol(pSprite){
    let col=Math.floor((pSprite.x+tileSize/2)/tileSize)
    pSprite.x=col*tileSize
}

function getTileAt(pX, pY){
    let row=Math.floor(pY/tileSize)
    let col=Math.floor(pX/tileSize)
    if (row>=0 && row<map.length && col>=0 && col<map[1].length){
        let id=map[row][col]
        return id
    } 
    return "0"
}

function updateSprite(pSprite,dt){
    //update the animation of sprites
    if (pSprite.type!="door"){
        if (pSprite.currentAnimation!=""){
            pSprite.animationTimer-=dt
            if (pSprite.animationTimer<=0){
                pSprite.frame=pSprite.frame+1
                pSprite.animationTimer=pSprite.animationSpeed
                if (pSprite.frame>=pSprite.animations[pSprite.currentAnimation].length){
                    pSprite.frame=0
                }
            }
        } 
    }else{
        if (coins==0){
            pSprite.frame=1
        } 
    }
    if (pSprite.type=="player"){
        updatePlayer(pSprite, dt)
    } else if (pSprite.type=="enemy"){
        updateEnemy(pSprite, dt)
    }
}


function update(dt){
    for(let i=listSprites.length-1; i>=0;i--) {
        let sprite=listSprites[i]
        updateSprite(sprite,dt)
        if (sprite.type=="coin"){
            if (collisionCheck(sprite.x, sprite.y, tileSize, tileSize, player.x, player.y, tileSize, tileSize)){
              listSprites.splice(i,1)
              coins-=1
            } 
        }
    }
}

function updatePlayer(pPlayer, dt){
    let acceleration=350
    let friction=120
    let maxSpeed=100
    let jumpSpeed=-190
    let newAnimation="idle"
    // detect collision
    let collide=false
    if (pPlayer.vx>0){
        collide=collideRight(pPlayer)
    } else if (pPlayer.vx<0){
        collide=collideLeft(pPlayer)
    }
    if (collide){
        pPlayer.vx=0
        alignOnCol(pPlayer)
    }
    collide=false
    if (pPlayer.standing || pPlayer.vy>0){
        collide=collideBelow(pPlayer)
        if (collide){
            pPlayer.vy=0
            pPlayer.standing=true
            pPlayer.gravity=0
            alignOnRow(pPlayer)
        } else {
            pPlayer.standing=false
        }
    }else if (pPlayer.vy<0){
        collide=collideAbove(pPlayer)
        if (collide){
            pPlayer.vy=0
            alignOnRow(pPlayer)
        } 
    } 

    //friction
    if (pPlayer.vx>0){
        pPlayer.vx=pPlayer.vx-friction*dt
        if (pPlayer.vx<0){
            pPlayer.vx=0
        } 
    }else if (pPlayer.vx<0){
        pPlayer.vx=pPlayer.vx+friction*dt
        if (pPlayer.vx>0){
            pPlayer.vx=0
        } 
    } 
    
    //keyboard
    if (keyboardMap["ArrowRight"]){
        pPlayer.vx=pPlayer.vx+acceleration*dt
        if (pPlayer.vx>maxSpeed){
            pPlayer.vx=maxSpeed
        }
        pPlayer.flip=false
        newAnimation="run"
    }

    if (keyboardMap["ArrowLeft"]){
        pPlayer.vx=pPlayer.vx-acceleration*dt
        if (pPlayer.vx<-maxSpeed){
            pPlayer.vx=-maxSpeed
        }
        pPlayer.flip=true
        newAnimation="run"
    }

    if (keyboardMap["ArrowUp"]){
        if (pPlayer.standing ){
            pPlayer.standing=false
            pPlayer.vy=jumpSpeed      
        }
        //newAnimation="jump"
    }else {
    }
    // fall
    if (pPlayer.standing==false){
        pPlayer.gravity=500
        pPlayer.vy=pPlayer.vy+pPlayer.gravity*dt
    }else{
        pPlayer.gravity=0
    }

    pPlayer.playAnimation(newAnimation)
    pPlayer.x=pPlayer.x+pPlayer.vx*dt
    pPlayer.y=pPlayer.y+pPlayer.vy*dt
    if (getTileAt(pPlayer.x, pPlayer.y)=="D"){
        initGame(1)
    }
}  
    
function updateEnemy(pEnemy, dt){
    let idOverlap
    if (pEnemy.direction=="right") {
        idOverlap=getTileAt(pEnemy.x+tileSize, pEnemy.y)
    }else if (pEnemy.direction=="left"){
        idOverlap=getTileAt(pEnemy.x-1, pEnemy.y)
    } 
    if (idOverlap=="<"){
        pEnemy.flip=true
        pEnemy.vx=-25
        pEnemy.direction="left"
    }else if (idOverlap==">"){
        pEnemy.flip=false
        pEnemy.vx=25
        pEnemy.direction="right"
    }
    pEnemy.x=pEnemy.x+pEnemy.vx*dt
    pEnemy.y=pEnemy.y+pEnemy.vy*dt
}



function draw(){
    ctx.fillStyle="black"
    ctx.fillRect(0, 0, canW, canH)
    drawMap()
    drawSprites()
}

function drawMap(){
    for(let r=0; r<map.length; r++){
        for(let c=0; c<map[r].length; c++){
            let char=map[r][c]
            if (char!="0" && isInvisible(char)==false){
                if (imgsTile[char]!=undefined){
                    ctx.drawImage(imgsTile[char], c*tileSize, r*tileSize)
                } 
            }
        }
    }
}


function drawSprites(){
    for(let i=listSprites.length-1; i>=0;i--) {
        let sprite=listSprites[i]
        drawSprite(sprite)
    }
    
}

function drawSprite(pSprite){
    let imgName=pSprite.animations[pSprite.currentAnimation][pSprite.frame]
    let img=pSprite.images[imgName]
    if (pSprite.flip){
        ctx.save()
        ctx.translate(pSprite.x+img.width,pSprite.y)
        ctx.scale(-1,1)
        ctx.drawImage(img, 0, 0)
        ctx.restore()
    }else {
        ctx.drawImage(img, pSprite.x, pSprite.y)
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