let can, canW, canH, ctx
let nbRow=11
let nbCol=11
let cellSize=32
let wallStripWidth=1
let nbRays
let FOV=60*Math.PI/180
let rays=[]

class Map{
    constructor(){
        this.grid=[
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1],
            [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]
    }
    isWall(x, y){
        let r=Math.floor(y/cellSize)
        let c=Math.floor(x/cellSize)
        if(this.grid[r][c]==1){
            return true
        }
        return false
    }
    render(){
        for(let r=0; r<nbRow; r++){
            for(let c=0; c<nbCol; c++){
                if(this.grid[r][c]!=0){
                    ctx.fillStyle="rgb(0,0,0)"
                }else{
                    ctx.fillStyle="rgb(128,128,128)"
                }
                ctx.fillRect(c*cellSize, r*cellSize, cellSize-1, cellSize-1)
            }
        }
    }
}

class Player{
    constructor(x, y){
        this.x=x
        this.y=y
        this.r=5
        this.turnDirection=0 // -l for left +1 for right
        this.walkDirection=0 // -l for backward +1 for forward
        this.rotationAngle=Math.PI/2
        this.rotationSpeed=0.5
        this.walkSpeed=1
    }
    update(){
        let rotationSpeed=this.rotationSpeed*this.turnDirection
        this.rotationAngle=this.rotationAngle+rotationSpeed*Math.PI/180
        this.rotationAngle=normalizeAngle(this.rotationAngle)
        let walkSpeed=this.walkSpeed*this.walkDirection
        let newX=this.x+walkSpeed*Math.cos(this.rotationAngle)
        let newY=this.y+walkSpeed*Math.sin(this.rotationAngle)
        if(newX>=0 && newY<=canW && newY>=0 && newY<=canH && !grid.isWall(newX, newY)){
            this.x=newX
            this.y=newY
        }
    }
    render(){
        ctx.fillStyle="rgb(255,0,0)"
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI)
        ctx.fill()
        ctx.strokeStyle="rgb(255,0,0)"
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x+Math.cos(this.rotationAngle)*20, this.y+Math.sin(this.rotationAngle)*20)
        ctx.stroke()
    }
}

class Ray{
    constructor(rayAngle){
        this.rayAngle=rayAngle
        this.isFacingDown=this.rayAngle>0 && this.rayAngle<Math.PI
        this.isFacingUp=!this.isFacingDown
        this.isFacingRight=this.rayAngle<Math.PI/2 || this.rayAngle>3/2*Math.PI
        this.isFacingLeft=!this.isFacingRight
        this.xHitWall=null
        this.yHitWall=null
        this.distHitWall=null
    }
    cast(){
        //horizontally
        let xStep, yStep, xIntercept, yIntercept, xHitHorizWall, yHitHorizWall
        yIntercept=Math.floor(player.y/cellSize)*cellSize+(this.isFacingDown ? cellSize : 0)
        xIntercept=player.x+(yIntercept-player.y)/Math.tan(this.rayAngle)
        yStep=cellSize
        yStep*=(this.isFacingDown ? 1 : -1)

        xStep=cellSize/Math.tan(this.rayAngle)
        xStep*=((this.isFacingRight && xStep<0) ? -1: 1 )
        xStep*=((this.isFacingLeft && xStep>0) ? -1: 1 )
        /*while(xIntercept>=0 && xIntercept<=canW && yIntercept>=0 && yIntercept<=canH){
            if(grid.isWall(xIntercept, yIntercept-(this.isFacingUp ? 1 : 0))){
                xHitHorizWall=xIntercept
                yHitHorizWall=yIntercept
                break
            }else{
                xIntercept+=xStep
                yIntercept+=yStep
            }
        }*/
        while(true){
            if(xIntercept<=0 || xIntercept>=canW || yIntercept<=0 || yIntercept>=canH || grid.isWall(xIntercept, yIntercept-(this.isFacingUp ? 1 : 0))){
                xHitHorizWall=xIntercept
                yHitHorizWall=yIntercept
                break
            }else{
                xIntercept+=xStep
                yIntercept+=yStep
            }
        }
        //vertically
        let xHitVertiWall, yHitVertiWall
        xIntercept=Math.floor(player.x/cellSize)*cellSize+(this.isFacingRight ? cellSize : 0)
        yIntercept=player.y+(xIntercept-player.x)*Math.tan(this.rayAngle)
        xStep=cellSize
        xStep=xStep*(this.isFacingRight ? 1 : -1)
        yStep=cellSize*Math.tan(this.rayAngle)
        yStep*=((this.isFacingDown && yStep<0) ? -1: 1 )
        yStep*=((this.isFacingUp && yStep>0) ? -1: 1 )

        while(true){
            if(xIntercept<=0 || xIntercept>=canW || yIntercept<=0 || yIntercept>=canH || grid.isWall(xIntercept-(this.isFacingLeft ? 1 : 0), yIntercept)){
                xHitVertiWall=xIntercept
                yHitVertiWall=yIntercept
                break
            }else{
                xIntercept+=xStep
                yIntercept+=yStep
            }
        }
        /*
        while(xIntercept>=0 && xIntercept<=canW && yIntercept>=0 && yIntercept<=canH){
            if(grid.isWall(xIntercept-(this.isFacingLeft ? 1 : 0), yIntercept)){
                xHitVertiWall=xIntercept
                yHitVertiWall=yIntercept
                break
            }else{
                xIntercept=xIntercept+xStep
                yIntercept=yIntercept+yStep
            }
        }*/
        //let distHitHorizWall= xHitHorizWall!=undefined ? dist(player.x, player.y, xHitHorizWall, yHitHorizWall) : Number.MAX_VALUE
        //let distHitVertiWall= xHitVertiWall!=undefined ? dist(player.x, player.y, xHitVertiWall, yHitVertiWall) : Number.MAX_VALUE
        let distHitHorizWall=dist(player.x, player.y, xHitHorizWall, yHitHorizWall)
        let distHitVertiWall=dist(player.x, player.y, xHitVertiWall, yHitVertiWall)
        this.xHitWall=distHitHorizWall<distHitVertiWall ? xHitHorizWall: xHitVertiWall
        this.yHitWall=distHitHorizWall<distHitVertiWall ? yHitHorizWall: yHitVertiWall
        this.distHitWall=distHitHorizWall<distHitVertiWall ? distHitHorizWall: distHitVertiWall
    }
    render(){
        ctx.beginPath()
        ctx.moveTo(player.x, player.y)
        ctx.strokeStyle="rgb(0,255,255)"
        ctx.lineTo(this.xHitWall, this.yHitWall)
        ctx.stroke()
        ctx.strokeStyle="rgb(255,255,0)"
        ctx.beginPath()
        ctx.lineTo(player.x+Math.cos(this.rayAngle)*20, player.y+Math.sin(this.rayAngle)*20)
        ctx.stroke()
       /* ctx.fillStyle="blue"
        ctx.fillText("Close H: "+this.horizontal.toString()+" distH: "+ Math.floor(this.distHitHorizWall)+" distV: "+ Math.floor(this.distHitVertiWall), player.x-50, player.y-50)
        ctx.fillText("A: "+this.rayAngle, player.x, player.y)
        ctx.fillText("up:"+this.isFacingUp.toString()
        +" X: "+Math.floor(this.xHitWall)+  " Y: "+Math.floor(this.yHitWall), player.x, player.y+50)*/
    
    }
}

window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    ctx=can.getContext("2d")
    canW=can.width
    canH=can.height
    nbRays=canW/wallStripWidth
    grid=new Map()
    player=new Player(canW/2, canH/2)
    document.onkeydown=function(e){
        let key=e.code 
        if(key=="ArrowRight"){
            player.turnDirection=1
        }
        if(key=="ArrowLeft"){
            player.turnDirection=-1
        }
        if(key=="ArrowUp"){
            player.walkDirection=1
        }
        if(key=="ArrowDown"){
            player.walkDirection=-1
        }
    }
    document.onkeyup=function(e){
        let key=e.code 
        if(key=="ArrowRight"){
            player.turnDirection=0
        }
        if(key=="ArrowLeft"){
            player.turnDirection=0
        }
        if(key=="ArrowUp"){
            player.walkDirection=0
        }
        if(key=="ArrowDown"){
            player.walkDirection=0
        }
    }
    requestAnimationFrame(gameLoop)
}

function getAllRays(){
    rays=[]
    for(let i=0; i<nbRays; i++){
        let rayAngle=player.rotationAngle-FOV/2+FOV/nbRays*i
        rayAngle=normalizeAngle(rayAngle)
        let ray=new Ray(rayAngle)
        ray.cast()
        rays.push(ray)
    }
}
function normalizeAngle(angle){
    if(angle>2*Math.PI){
        angle=angle%(2*Math.PI)
    }else if (angle<0){
        angle=2*Math.PI+angle
    }
    return angle
}

function dist(x1, y1, x2, y2){
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))
}

function renderWallProjections(){
    let distPlayerProjectPlane=canW/2*Math.tan(FOV/2)
    for(let i=0; i<rays.length; i++){
        let ray=rays[i]
        let wallStripHeight=distPlayerProjectPlane/ray.distHitWall*cellSize/Math.cos(ray.rayAngle-player.rotationAngle)
        ctx.fillStyle="rgb(51,128,51)"
        ctx.fillRect(i*wallStripWidth, 0, wallStripWidth, (canH-wallStripHeight)/2)
        ctx.fillStyle="rgb(204,204,204)"
        ctx.fillRect(i*wallStripWidth, (canH-wallStripHeight)/2, wallStripWidth, wallStripHeight)
    }
}
function draw(){
    ctx.fillStyle="rgb(51,51,51)"
    ctx.fillRect(0, 0, canW, canH)
    renderWallProjections()
    ctx.save()
    ctx.scale(1/4, 1/4)
    grid.render()
    player.render()
    for(let i=0; i<rays.length; i++){
        let ray=rays[i]
        ray.render()
    }
    ctx.restore()
}

function gameLoop(){
    player.update()
    getAllRays()
    draw()
    requestAnimationFrame(gameLoop)
}