window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    ctx=can.getContext("2d")
    gravity=Number(document.getElementById("gravity").value) // l'accélération de la pesanteur
    minLifeTime=Number(document.getElementById("minLife").value)
    maxLifeTime=Number(document.getElementById("maxLife").value)
    avgExpSpeed=Number(document.getElementById("expSpeed").value)
    nbColors=Number(document.getElementById("nbColors").value) 
    nbParticles=200
    listFireworks=[]
    listRockets=[]
    oldTime=0
    sound=new Audio()
    sound.src="sound.mp3"
    bgImage = new Image(); 
    bgImage.src="bg_city.png"; 
    can.addEventListener("mousedown", (e)=>{
        newSpot(e)
    })
    bgImage.onload = function(){
        requestAnimationFrame(loop)
    }
}

function newSpot(e){
    const rect=can.getBoundingClientRect()
    const x=e.clientX-rect.left
    const y=e.clientY-rect.top
    listRockets.push(createRocket(x, y, can.height))
    sound.play()
}

function createRocket(x, y, oldHeight){
    const rocket = {
        x: x, 
        y: y, 
        oldHeight: oldHeight
    }
    return rocket
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createFirework(x, y){
    let colors=[]
    for(let k=0; k<nbColors; k++){
        colors[k]=getRandomColor() 
    }
    let listParticles=[]; 
    for(let i=0; i<nbParticles; i++){
        const color = colors[Math.floor(Math.random()*nbColors)]
        listParticles.push(createParticle(x, y, color))
    }
    return listParticles
}

function createParticle(x, y, color){
    const angle=Math.random()*2*Math.PI
    const r=Math.random()*avgExpSpeed
    const particle={
        x: x, 
        y: y,
        vx: r*Math.cos(angle),
        vy: r*Math.sin(angle), 
        life: Math.random()*(maxLifeTime-minLifeTime)+minLifeTime, 
        color: color
    }
    return particle
}

function updateRockets(dt){
    for(let j=listRockets.length-1; j>=0; j--){
        listRockets[j].oldHeight-=160*dt; 
        if(listRockets[j].oldHeight<=listRockets[j].y){
            listFireworks.push(createFirework(listRockets[j].x, listRockets[j].y))
            listRockets.splice(j, 1); 
        }
    } 
}
function updateFireworks(dt){
    for(let j=listFireworks.length-1; j>=0; j--){
        if(listFireworks[j].length>=1){
            for(let i=listFireworks[j].length-1; i>=0; i--){
                let p=listFireworks[j][i]
                p.vy=p.vy+gravity*dt // update the vertical speed
                p.x=p.x+p.vx*dt
                p.y=p.y+p.vy*dt
                p.life=p.life-dt
                if(p.life<=0){
                    listFireworks[j].splice(i, 1)
                }
            }
        }else{
            listFireworks.splice(j, 1)
        }
    }
}

function drawRockets(){
    for(let i=0; i<listRockets.length; i++){
        const rocket=listRockets[i]
        ctx.fillStyle="orange"
        ctx.fillRect(rocket.x-2, rocket.oldHeight-2 , 4, 4)
    } 
}
function drawFireworks(){
    for(let j=0; j<listFireworks.length; j++){
        for(let i=0; i<listFireworks[j].length; i++){
            const p=listFireworks[j][i]
            ctx.fillStyle=p.color
            ctx.fillRect(p.x-1, p.y-1, 2, 2)
        }
    }
}

function drawNightSky(){
    ctx.fillStyle="rgb(11,11,48)"
    ctx.fillRect(0, 0, can.width, can.height)
}

function drawSkyline(){
    ctx.drawImage(bgImage, 0, 200, can.width, bgImage.height/bgImage.width*can.width);
}

function draw(){
    drawNightSky()
    drawRockets()
    drawFireworks()
    drawSkyline()
}
function loop(time){  
    if(oldTime!=0){
        dt=(time-oldTime)/1000
    }else {
        dt=0
    }
    updateRockets(dt)
    updateFireworks(dt)
    draw()
    oldTime=time
    requestAnimationFrame(loop)
}
