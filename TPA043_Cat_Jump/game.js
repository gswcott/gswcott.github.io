camera = {}
camera.x = 0
camera.y = 0
cellSize = 32
canW = cellSize * map[0].length
canH = 600
cat = {}
ts = new Image()
tileSize = 16
listQuads={}
oldTime = 0

jumpSpeedY = 300
jumpSpeedX = 150
friction = 150
gravity = 300
// window.onload, ca se lance quand le html est entièrement affiché.
window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    ctx=can.getContext("2d")
    can.width = canW
    can.height = canH
    ts.src = "images/monochrome_tilemap_transparent_packed.png"
    createCat(canW/2-cellSize/2, (map.length-2)*cellSize, "images/cat_transparent32.png")
    createQuads()
    document.onkeydown=jump
    requestAnimationFrame(gameLoop)
}

function createCat(pX, pY, file){
    cat.x = pX
    cat.y = pY
    cat.vx = 0
    cat.vy = 0
    cat.standing = true
    cat.img = new Image()
    cat.img.src = file
}


function getQuad(pR, pC, pW, pH){
    let quad = {}
    quad.x = pC * tileSize
    quad.y = pR * tileSize
    quad.w = pW
    quad.h = pH
    return quad
}

function createQuads(){
    listQuads.decor = {}
    listQuads.decor["#"] = getQuad(3, 3, tileSize, tileSize/2)
    listQuads.decor["&"] = getQuad(4, 3, tileSize, tileSize*2/3)
    listQuads.decor["$"] = getQuad(5, 3, tileSize, tileSize*2/3)
    listQuads.decor["w"] = getQuad(2, 11, tileSize, tileSize)
}


function jump(e){
    if(cat.standing){
        let key = e.code
        if(key == "ArrowUp" || key == "ArrowLeft" || key == "ArrowRight"){
            cat.standing = false 
            cat.vy = - jumpSpeedY
            if(key == "ArrowLeft"){
                cat.vx -= jumpSpeedX
            }else if(key == "ArrowRight"){
                cat.vx += jumpSpeedX
            }
        }
    }
}

function update(dt){
    //friction
    if (cat.vx > 0){
        cat.vx -= friction * dt
        if (cat.vx < 0){
            cat.vx = 0
        } 
    }else if (cat.vx < 0){
        cat.vx += friction*dt
        if (cat.vx > 0){
            cat.vx = 0
        }
    }
      
    //gravity 
    if (cat.standing==false){
        cat.vy += gravity * dt
    }

    cat.x += cat.vx * dt
    cat.y += cat.vy * dt
    let posC = Math.floor(cat.x/cellSize)
    let posR = Math.floor(cat.y/cellSize)
        
    //Collision against the left wall end the right wall
    if (cat.vx > 0){
        if (collideRight(cat)){
            cat.x = posC * cellSize
            cat.vx = 0
        } 
    }else if (cat.vx < 0){
        if (collideLeft(cat)){
            cat.x = (posC + 1) * cellSize
            cat.vx = 0
        } 
    }
    //fall down
    if (cat.vy>0){
        if (collideDown(cat)){
            cat.y = posR * cellSize
            cat.vy = 0
            cat.standing = true
        }
    } 
    camera.y = cat.y-canH*2/3
    if (camera.y < 0){
        camera.y = 0
    }
}

function isSolid(pID){
    if (pID == "w"){
        return true
    }
    return false
}

function isUpThrough(pID){
    if (pID == "#" || pID == "$" || pID == "&"){
        return true
    }
    return false
}


function getTileAt(pX, pY){
    let r=Math.floor(pY/cellSize)
    let c=Math.floor(pX/cellSize)
    return map[r][c]
}

function collideDown(pSprite){
    let id1 = getTileAt(pSprite.x + 3, pSprite.y + cellSize)
    let id2 = getTileAt(pSprite.x + cellSize - 3, pSprite.y + cellSize)
    return isSolid(id1) || isUpThrough(id1) || isSolid(id2) || isUpThrough(id2)
}



function collideRight(pSprite){
    let id1 = getTileAt(pSprite.x + cellSize, pSprite.y + 3)
    let id2 = getTileAt(pSprite.x + cellSize, pSprite.y + cellSize - 3)
    return isSolid(id1) || isSolid(id2)
}


function collideLeft(pSprite){
    let id1 = getTileAt(pSprite.x, pSprite.y + 3)
    let id2 = getTileAt(pSprite.x, pSprite.y + cellSize - 3)
    return isSolid(id1) || isSolid(id2)
}


function drawMap(){
    for(let r=0; r<map.length; r++){
        for(let c=0; c<map[r].length; c++){
            let id = map[r][c]
            if(id == "w" || id == "#" || id == "$" || id == "&"){
                let quad = listQuads.decor[id]
                let h 
                if(id == "w"){
                    h=cellSize
                }else {
                    h=cellSize/2
                }
                ctx.drawImage(ts, quad.x, quad.y, quad.w, quad.h, c*cellSize, r*cellSize, cellSize, h)
            }   
        }
    }
}

function drawCat(){
    ctx.drawImage(cat.img, cat.x, cat.y)
}




function draw(){
    ctx.fillColor="gray"
    ctx.fillRect(0, 0, canW, canH)
    ctx.save()
    ctx.translate(-camera.x, -camera.y)
    drawMap()
    drawCat()
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