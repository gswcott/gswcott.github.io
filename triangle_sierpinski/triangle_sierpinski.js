window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    canW=can.width
    canH=can.height
    ctx=can.getContext("2d")
    nextBtn=document.getElementById("next")
    resetBtn=document.getElementById("reset")
    nextBtn.onclick=iteration
    resetBtn.onclick=start
    triangles=[]
    newTriangles=[]
    start()
}

function start(){
    triangles=[]
    let tri={}
    // la longeur des trois côtés: 8/10*canW (attention here canW=canH)
    tri.x1=canW/2
    tri.y1=canH/2-Math.sqrt(3)*4/20*canH
    tri.x2=canW/2+4/10*canW
    tri.y2=canH/2+Math.sqrt(3)*4/20*canH
    tri.x3=canW/2-4/10*canW
    tri.y3=canH/2+Math.sqrt(3)*4/20*canH
    triangles.push(tri)
    draw()
}

function iteration(){
    newTriangles=[]
    for(let i=0; i<triangles.length; i++){
        let tri=triangles[i]
        upSmallTri(tri)
        leftSmallTri(tri)
        rightSmallTri(tri)
    }
    triangles=newTriangles
    draw()
}

function upSmallTri(pTri){
    let tri={}
    tri.x1=pTri.x1
    tri.y1=pTri.y1
    tri.x2=(pTri.x1+pTri.x2)/2
    tri.y2=(pTri.y1+pTri.y2)/2
    tri.x3=(pTri.x1+pTri.x3)/2
    tri.y3=(pTri.y1+pTri.y3)/2
    newTriangles.push(tri)
}

function leftSmallTri(pTri){
    let tri={}
    tri.x1=(pTri.x1+pTri.x3)/2
    tri.y1=(pTri.y1+pTri.y3)/2
    tri.x2=pTri.x1
    tri.y2=pTri.y3
    tri.x3=pTri.x3
    tri.y3=pTri.y3
    newTriangles.push(tri)
}

function rightSmallTri(pTri){
    let tri={}
    tri.x1=(pTri.x1+pTri.x2)/2
    tri.y1=(pTri.y1+pTri.y2)/2
    tri.x2=pTri.x2
    tri.y2=pTri.y2
    tri.x3=pTri.x1
    tri.y3=pTri.y2
    newTriangles.push(tri)
}

function draw(){
    ctx.fillStyle="white"
    ctx.fillRect(0, 0, canW, canH)
    ctx.fillStyle="green"
    for(let i=0; i<triangles.length; i++){
        let tri=triangles[i]
        ctx.beginPath()
        ctx.moveTo(tri.x1, tri.y1)
        ctx.lineTo(tri.x2, tri.y2)
        ctx.lineTo(tri.x3, tri.y3)
        ctx.lineTo(tri.x1, tri.y1)
        ctx.fill()
    }
}
