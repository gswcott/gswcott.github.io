window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    canW=can.width
    canH=can.height
    ctx=can.getContext("2d")
    colorsEle=document.getElementById("colors")
    initColors()
    paving=[]
    nbCells=5
    createPaving()
    cellSize=canW/nbCells
    draw()
    colorsEle.addEventListener("change", function(){
        initColors()
        draw()
    })
    randomBtn=document.getElementById("random")
    randomBtn.onclick=randomPaving
    can.addEventListener("mousedown", turnRight)
}

function initColors(){
    let colors=colorsEle.value.split("/")
    color1=colors[0]
    color2=colors[1]
}

function randomPaving(){
    createPaving()
    draw()
}

function createPaving(){
    paving=[]
    for(let r=0; r<nbCells; r++){
        paving[r]=[]
        for(let c=0; c<nbCells; c++){
            paving[r][c]=Math.floor(Math.random()*4)
        }
    }
}

function turnRight(e){
    let rect=can.getBoundingClientRect();
    let x=e.clientX-rect.left
    let y=e.clientY-rect.top
    if (x>=0 && x<=canW && y>=0 && y<=canH){
        r=Math.floor(y/cellSize)
        c=Math.floor(x/cellSize)
        paving[r][c]=paving[r][c]+1
        if (paving[r][c]>=4){
            paving[r][c]=0
        }
    }
    draw()
}

function drawPaving0(pX1, pY1, pX2, pY2, pX3, pY3, pX4, pY4){
    ctx.fillStyle=color1
    ctx.beginPath()
    ctx.moveTo(pX1,pY1)
    ctx.lineTo(pX2,pY2)
    ctx.lineTo(pX4,pY4)
    ctx.lineTo(pX1,pY1)
    ctx.fill()

    ctx.fillStyle=color2
    ctx.beginPath()
    ctx.moveTo(pX2,pY2)
    ctx.lineTo(pX3,pY3)
    ctx.lineTo(pX4,pY4)
    ctx.lineTo(pX2,pY2)
    ctx.fill()
}

function drawPaving1(pX1, pY1, pX2, pY2, pX3, pY3, pX4, pY4){
    ctx.fillStyle=color1
    ctx.beginPath()
    ctx.moveTo(pX1,pY1)
    ctx.lineTo(pX2,pY2)
    ctx.lineTo(pX3,pY3)
    ctx.lineTo(pX1,pY1)
    ctx.fill()

    ctx.fillStyle=color2
    ctx.beginPath()
    ctx.moveTo(pX1,pY1)
    ctx.lineTo(pX3,pY3)
    ctx.lineTo(pX4,pY4)
    ctx.lineTo(pX1,pY1)
    ctx.fill()
}

function drawPaving2(pX1, pY1, pX2, pY2, pX3, pY3, pX4, pY4){
    ctx.fillStyle=color1
    ctx.beginPath()
    ctx.moveTo(pX2,pY2)
    ctx.lineTo(pX3,pY3)
    ctx.lineTo(pX4,pY4)
    ctx.lineTo(pX2,pY2)
    ctx.fill()

    ctx.fillStyle=color2
    ctx.beginPath()
    ctx.moveTo(pX1,pY1)
    ctx.lineTo(pX2,pY2)
    ctx.lineTo(pX4,pY4)
    ctx.lineTo(pX1,pY1)
    ctx.fill()

}
function drawPaving3(pX1, pY1, pX2, pY2, pX3, pY3, pX4, pY4){
    ctx.fillStyle=color1
    ctx.beginPath()
    ctx.moveTo(pX1,pY1)
    ctx.lineTo(pX3,pY3)
    ctx.lineTo(pX4,pY4)
    ctx.lineTo(pX1,pY1)
    ctx.fill()

    ctx.fillStyle=color2
    ctx.beginPath()
    ctx.moveTo(pX1,pY1)
    ctx.lineTo(pX2,pY2)
    ctx.lineTo(pX3,pY3)
    ctx.lineTo(pX1,pY1)
    ctx.fill()

}

function draw(){
    for(let r=0; r<nbCells; r++){
        for(let c=0; c<nbCells; c++){
            let x1=c*cellSize
            let y1=r*cellSize
            let x2=(c+1)*cellSize
            let y2=r*cellSize
            let x3=(c+1)*cellSize
            let y3=(r+1)*cellSize
            let x4=c*cellSize
            let y4=(r+1)*cellSize
            if (paving[r][c]==0){
                drawPaving0(x1, y1, x2, y2, x3, y3, x4, y4)
            }else if (paving[r][c]==1){
                drawPaving1(x1, y1, x2, y2, x3, y3, x4, y4)
            }else if (paving[r][c]==2){
                drawPaving2(x1, y1, x2, y2, x3, y3, x4, y4)
            }else if (paving[r][c]==3){
                drawPaving3(x1, y1, x2, y2, x3, y3, x4, y4)
            }
        }
    }
}