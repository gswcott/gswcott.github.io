function getRandomColor() {
    let letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }
  
function createParticle(x, y){
    let particle={}
    particle.x=x
    particle.y=y
    let angle=Math.random()*360
    let v=Math.random()*100
    particle.vx=v*Math.cos(angle)
    particle.vy=v*Math.sin(angle)
    particle.life=Math.random()*0.2+0.3
    particle.color=getRandomColor()
    return particle
}

function createFirework(x,y){
    let particles=[]
    for (let nbP=0; nbP<400; nbP++){
        particles.push(createParticle(x,y))
    }
    return particles
}

function updateParticle(lstParticles, dt){
    for (let i=lstParticles.length-1; i>=0; i--){
        let p=lstParticles[i]
        p.vy=p.vy+100*dt
        p.x=p.x+p.vx*dt
        p.y=p.y+p.vy*dt
        p.life=p.life-dt
        if (p.life<=0) {
            lstParticles.splice(i,1)
        }
    }
}

function drawFireWorks(lstParticles){
  for (let i=0; i<lstParticles.length; i++){
    let p=lstParticles[i]
    ctx.fillStyle=p.color
    ctx.fillRect(p.x, p.y, 2, 2)
  } 
}