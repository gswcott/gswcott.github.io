window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    canW=can.width
    canH=can.height
    ctx=can.getContext("2d")
    nb=10000
    points=[]
    initPoint(0,  0)
    iteration(nb)
    draw()
}

function initPoint(pX, pY){
    let point={}
    point.x=pX
    point.y=pY
    points.push(point)
}

function nextPoint(pX, pY){
    let point={}
    let num=Math.random()
    if (num<=0.01){
        point.x=0
        point.y=0.16*pY
    }else if (num<=0.86){
        point.x=0.85*pX+0.04*pY
        point.y=-0.04*pX+0.85*pY+1.6
    }else if (num<=0.93){
        point.x=0.2*pX-0.26*pY
        point.y=0.23*pX+0.224*pY+1.6
    } else if (num<=1){
        point.x=-0.15*pX+0.28*pY
        point.y=0.26*pX+0.24*pY+0.44
    }
    points.push(point)
}

function iteration(pNb){
    for(let i=0; i<pNb; i++){
        let point=points[i]
        let x=point.x
        let y=point.y
        nextPoint(x, y)
    }
}

function draw(){
    ctx.fillStyle="rgb(0, 0, 0)"
    ctx.fillRect(0, 0, canW, canH)
    ctx.translate(canW/2, canH*2/3)
    ctx.scale(20, 20)
    ctx.fillStyle="rgb(0, 255, 0)"
    for(let i=0; i<points.length; i++){
        let point=points[i]
        let x=point.x
        let y=-point.y
        ctx.fillRect(x, y, 0.05, 0.05)
    }
}