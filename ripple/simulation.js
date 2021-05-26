
cellSize = 12
nbRows = 50
nbCols = 50
canW=cellSize*nbCols
canH=cellSize*nbRows
buffer1=[]
buffer2=[]
bufferImage=[]
window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    can.width=canW
    can.height=canH
    ctx=can.getContext("2d")
    initBuffers()
    can.addEventListener("mousedown", spread)
    gameLoop()
}

function initBuffers(){
    for(let r=0; r<nbRows; r++){
        buffer1[r] = []
        buffer2[r] = []
        bufferImage[r] = []
        for(let c=0; c<nbCols; c++){
            buffer1[r][c]=0; 
            buffer2[r][c]=0; 
            bufferImage[r][c]=-buffer2[r][c]*204+204; 
        }
    }  
}
function spread(e){
    let rect=can.getBoundingClientRect();
    let x=e.clientX-rect.left
    let y=e.clientY-rect.top
    let posR=Math.floor(y/cellSize)
    let posC=Math.floor(x/cellSize)
    if(posR>=0 && posR<nbRows && posC>=0 && posC<nbCols){
        buffer1[posR][posC]=1
    }
}

function getValueTable(table, r, c){
    if (r<0 || r>table.length-1 || c<0 || c>table[0].length-1){
        return 0
    }else{
        return table[r][c]
    }
}

function update(){
    for(let r=0; r<nbRows; r++){
        for(let c=0; c<nbCols; c++){
            let h1 = getValueTable(buffer1, r-1, c)
            let h2 = getValueTable(buffer1, r, c-1) 
            let h3 = getValueTable(buffer1, r, c+1) 
            let h4 = getValueTable(buffer1, r+1, c) 
            buffer2[r][c]=(h1+h2+h3+h4)/2-buffer2[r][c]
            buffer2[r][c]*=0.95
            bufferImage[r][c]=Math.floor(-buffer2[r][c]*204+204) 
        }
    }  
    let tmp = buffer1
    buffer1 = buffer2
    buffer2 = tmp
} 

function draw(){
    ctx.fillStyle="rgb(255, 255, 255)"
    ctx.fillRect(0, 0, canW, canH)
    for(let r=0; r<nbRows; r++){
        for(let c=0; c<nbCols; c++){
            let ratio = 1-bufferImage[r][c]/5000; 
            ctx.fillStyle="rgb( 0," + bufferImage[r][c] + ",255)"
            ctx.fillRect(c*cellSize, r*cellSize, cellSize*ratio, cellSize*ratio)
        }
    }
}
function gameLoop(){
    //cool()
    update()
    draw()
    requestAnimationFrame(gameLoop)
}