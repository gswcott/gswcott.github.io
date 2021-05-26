window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    canW=can.width
    canH=can.height
    ctx=can.getContext("2d")
    ctx.font="16px Arial"
    orders=document.getElementById("orders")
    okBtn=document.getElementById("ok")
    okBtn.onclick=getOrders
    stack=[]
    variables=[]
    prgm=[]
    getOrders()
    indexInstr=0
    turtle={}
    initTurtle()
    oldTime=0
    timer=1
    cellSize=90
    leftM=10
    topM=10
    requestAnimationFrame(gameLoop)
}

function getOrders(){
    let textOrders=orders.value
    prgm=textOrders.split(/\s/)
    for(let i=prgm.length-1; i>=0; i--){
        if(prgm[i]=="") {
            prgm.splice(i, 1)
        }
    }
    stack=[]
    variables=[]
    indexInstr=0
}


function initTurtle(){
    turtle={}
    turtle.matrix=[
        [0, 0, 0, 2, 2, 2, 0, 0, 0], 
        [0, 0, 2, 3, 2, 3, 2, 0, 0], 
        [0, 0, 2, 2, 2, 2, 2, 0, 0], 
        [2, 0, 0, 2, 2, 2, 0, 0, 2], 
        [0, 2, 2, 1, 1, 1, 2, 2, 0], 
        [0, 0, 1, 1, 1, 1, 1, 0, 0], 
        [0, 1, 1, 1, 1, 1, 1, 1, 0], 
        [0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 0, 0], 
        [0, 2, 2, 1, 1, 1, 2, 2, 0], 
        [2, 0, 0, 0, 2, 0, 0, 0, 2]
    ]
    turtle.pos={}
    turtle.pos.x=canW/2
    turtle.pos.y=canH/2
    turtle.angle=270
    turtle.pen=true
    turtle.lines=[]
    turtle.forward=function(distance){
        let coord={}
        let radian=turtle.angle/180*Math.PI
        let headingX=Math.cos(radian)
        let headingY=Math.sin(radian)
        coord.x1=turtle.pos.x
        coord.y1=turtle.pos.y
        turtle.pos.x+=headingX*distance
        turtle.pos.y+=headingY*distance
        coord.x2=turtle.pos.x
        coord.y2=turtle.pos.y
        if (turtle.pen){
            turtle.lines.push(coord)
        } 
    }
    turtle.back=function(distance){
        turtle.forward(-Number(distance))
    }
    turtle.right=function(a){
        turtle.angle+=Number(a)
    }
    turtle.left=function(a){
        turtle.right(-Number(a))
    }
    turtle.penUp=function(){
        turtle.pen=false
    }

    turtle.penDown=function(){
        turtle.pen=true
    }
}


function turnRight(pList){
    let resList=[]
    for(let c=0; c<pList[0].length; c++){
        let line=[]
        for(let r=pList.length-1; r>=0;  r--){
            let x=pList[r][c]
            line.push(x)
        } 
        resList.push(line)
    }
    return resList
}

function turnLeft(pList){
    let resList=[]
    for(let c=pList[0].length-1; c>=0; c--){
        let line=[]
        for(let r=0; r<pList.length;  r++){
            let x=pList[r][c]
            line.push(x)
        } 
        resList.push(line)
    }
    return resList
}


function store(pStack){
    if (pStack.length>=2){
        b=pStack.pop()
        a=pStack.pop()
        if (variables[b]==undefined){
            variables[b]=a
        }
    }
}

function interpret(){
    let instr=prgm[indexInstr]
    if (instr=="PENDOWN"){
        turtle.penDown()
    }else if (instr=="PENUP"){
        turtle.penUp()
    }else if (instr=="RIGHT"){
        console.log("coucou")
        turtle.matrix=turnRight(turtle.matrix)
        turtle.right(stack.pop())
    }else if (instr=="LEFT"){
        turtle.matrix=turnLeft(turtle.matrix)
        turtle.left(stack.pop())
    }else if(instr=="FORWARD") {
        turtle.forward(stack.pop())
    }else if (instr=="BACK"){
        turtle.back(stack.pop())
    }else if(instr=="STORE"){
        store(stack)
    }else if(variables[instr]!=undefined){
        stack.push(variables[instr])
    }else{
        stack.push(instr)
    }
}

function update(dt){
    timer-=dt 
    if(timer<=0 && indexInstr<prgm.length){
        interpret()
        indexInstr+=1
        timer=1
    }
}

function drawTurtle(){
    let matrix=turtle.matrix
    let cellSize=3
    let x=turtle.pos.x-cellSize*matrix[1].length/2
    let y=turtle.pos.y-cellSize*matrix[1].length/2
    for(let r=0; r<matrix.length; r++){
        for(let c=0; c<matrix[r].length; c++){
            if (matrix[r][c]!=0){
                if (matrix[r][c]==1){
                    ctx.fillStyle="rgb(255,255, 0)"
                }else if (matrix[r][c]==2){
                    ctx.fillStyle="rgb(0, 255, 127)"
                }else if (matrix[r][c]==3) {
                    ctx.fillStyle="rgb(0, 0, 0)"
                } 
                ctx.fillRect(x+c*cellSize, y+r*cellSize, cellSize, cellSize)
            } 
        }
    }
} 

function draw(){
    if (indexInstr<=prgm.length){
        ctx.fillStyle="black"
        ctx.fillRect(0, 0, canW, canH)
        let preText="Instruction: "
        let preTextW=ctx.measureText(preText).width
        let text
        if (indexInstr==prgm.length){
            text="FINISHED"
        }else{
            text=prgm[indexInstr]
        }
        let textW=ctx.measureText(text).width

        ctx.fillStyle="white"
        ctx.fillText(preText, leftM, topM+cellSize/2+8)

        ctx.fillStyle="rgb(0,0,255)"
        ctx.fillRect(leftM+preTextW+leftM, topM, cellSize, cellSize)

        ctx.fillStyle="white"
        ctx.fillText(text, leftM+preTextW+leftM+(cellSize-textW)/2, topM+cellSize/2+8)

        ctx.fillText("Stack:", leftM, 120)
        for(let i=0; i<stack.length; i++){
            ctx.fillStyle="rgb(0,127,255)"
            ctx.fillRect(leftM+i*cellSize, 150, cellSize-1, cellSize-1)
            ctx.fillStyle="white"
            let item=stack[i]
            let itemW=ctx.measureText(item).width
            ctx.fillText(stack[i], leftM+i*cellSize+(cellSize-itemW)/2, 150+cellSize/2+8)
        }
        drawTurtle()
        if(turtle.lines.length>0){
            ctx.strokeStyle="white"
            for(let i=0; i<turtle.lines.length; i++){
                let coord=turtle.lines[i]
                ctx.beginPath()
                ctx.moveTo(coord.x1, coord.y1)
                ctx.lineTo(coord.x2, coord.y2)
                ctx.stroke()
            }
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