window.onload=initialisation
tc=10 // taille de la cellule
function initialisation() {
  dtailles={"1":[10,10],
            "2":[20,20],
            "3":[30,30],
            "4":[40,40],
            "5":[50,50]}
  dcouleurs={"1":["red","yellow"],"2": ["white","black"]}
  can=document.getElementById('zone_cadre')
  ctx=can.getContext("2d")
  ctx.fillStyle="green"
  ctx.fillRect(0,0,can.width, can.height)
  can1=document.getElementById('zone_animation')
  ctx1=can1.getContext("2d")
  taille=document.getElementById("menu1")
  couleur=document.getElementById("menu2")
  nbc1=dtailles[taille.value][0]
  nbc2=dtailles[taille.value][1]
  color1=dcouleurs[couleur.value][0]
  color2=dcouleurs[couleur.value][1]
  f()
  taille.onchange=f
  couleur.onchange=f
  document.addEventListener("mousedown",g)
  document.getElementById('b1effacer').onclick=f
  document.getElementById('b1').onclick=vieAleatoire
  document.getElementById('b2').onclick=lancer
  document.getElementById('b3').onclick=pause
  document.getElementById('b4').onclick=suivant
}
function f(){
  ctx1.clearRect(can1.width/2-nbc1*tc/2-1,can1.height/2-nbc2*tc/2-1,nbc1*tc+2,nbc2*tc+2)
  //ctx1.clearRect(0,0,can1.width,can1.height/2)
  nbc1=dtailles[taille.value][0]
  nbc2=dtailles[taille.value][1]
  color1=dcouleurs[couleur.value][0]
  color2=dcouleurs[couleur.value][1]
  affichageGrilleSansVie()
}
function affichageGrilleSansVie(){
  isPaused=true
  N=0
  document.getElementById("Nb_ticks").innerHTML="Disposition du tick numéro: "+N
  mP0()
  ctx1.fillStyle=color1
  ctx1.fillRect(can1.width/2-nbc2*tc/2,can1.height/2-nbc1*tc/2,nbc2*tc,nbc1*tc)
  grille()
}
function mP0(){
  matricePosition=new Array()
  for (var i=0; i<nbc1;i++) {
      matricePosition[i]=new Array()
      for (var j=0; j<nbc2;j++) {
        matricePosition[i][j]=0
      }
    }
}
function mPaleatoire() {
  for (var i=0; i<nbc1;i++) {
    for (var j=0; j<nbc2;j++) {
      matricePosition[i][j]=Math.floor(Math.random()*2)
      if (matricePosition[i][j]==0) {
        ctx1.fillStyle=color1
      }
      else {
        ctx1.fillStyle=color2
      }
      ctx1.fillRect(can1.width/2-nbc2*tc/2+j*tc,can1.height/2-nbc1*tc/2+i*tc,tc,tc)
    }
  }
}
function vieAleatoire() {
  mPaleatoire()
  grille()
}
function grille(){
  for (var i=0; i<=nbc1;i++) {
    ctx1.beginPath()
    ctx1.moveTo(can1.width/2-nbc2*tc/2,can1.height/2-nbc1*tc/2+i*tc)
    ctx1.lineTo(can1.width/2-nbc2*tc/2+nbc2*tc,can1.height/2-nbc1*tc/2+i*tc)
    ctx1.strokeStyle='black'
    ctx1.stroke()
  }
  for (var j=0; j<=nbc2;j++) {
  ctx1.beginPath()
  ctx1.moveTo(can1.width/2-nbc2*tc/2+j*tc,can1.height/2-nbc1*tc/2)
  ctx1.lineTo(can1.width/2-nbc2*tc/2+j*tc,can1.height/2-nbc1*tc/2+nbc1*tc)
  ctx1.strokeStyle='black'
  ctx1.stroke()
}
}
function g(e) {
  //console.log(e.clientX+" "+e.clientY)
  rect=can1.getBoundingClientRect()
  var souris_x=e.clientX-rect.left-can1.width/2+nbc2*tc/2
  var souris_y=e.clientY-rect.top-can1.height/2+nbc1*tc/2
  var j=Math.floor(souris_x/tc)
  var i=Math.floor(souris_y/tc)
  //console.log(carreauX+" "+carreauY)
  if (i>=0 && i<nbc1 && j>=0 && j<nbc2) {
    matricePosition[i][j]=1-matricePosition[i][j]
    if (matricePosition[i][j]==0) {
      ctx1.fillStyle=color1
    }
    else {
      ctx1.fillStyle=color2
    }
    ctx1.fillRect(can1.width/2-nbc2*tc/2+j*tc,can1.height/2-nbc1*tc/2+i*tc,tc,tc)
  }
}
function voisins() {
  nbVoisins=new Array()
  for (var i=0; i<nbc1;i++) {
    nbVoisins[i]=new Array()
    for (var j=0; j<nbc2;j++) {
      var count=0
      count=matricePosition[(nbc1+i-1)%nbc1][(nbc2-1+j)%nbc2]+matricePosition[(nbc1-1+i)%nbc1][j]+matricePosition[(nbc1-1+i)%nbc1][(j+1)%(nbc2)]
      count=count+matricePosition[i][(nbc2-1+j)%nbc2]+matricePosition[i][(j+1)%nbc2]
      count=count+matricePosition[(i+1)%nbc1][(nbc2-1+j)%nbc2]+matricePosition[(i+1)%nbc1][j]+matricePosition[(i+1)%nbc1][(j+1)%nbc2]
      nbVoisins[i][j]=count
    }
  }
}
function suivant() {
  N=N+1
  document.getElementById("Nb_ticks").innerHTML="Disposition du tick numéro: "+N
  voisins()
  var matricePosition2=matricePosition
  for (var i=0; i<nbc1;i++) {
      for (var j=0; j<nbc2;j++) {
        if (matricePosition[i][j]==1 && (nbVoisins[i][j]<2 || nbVoisins[i][j]>=4)){
          matricePosition2[i][j]=0
          }
        if (matricePosition[i][j]==0 && (nbVoisins[i][j]==3)){
          matricePosition2[i][j]=1
          }
        }
      }
  matricePosition=matricePosition2
  ctx1.clearRect(can1.width/2-nbc1*tc/2,can1.height/2-nbc2*tc/2,nbc1*tc,nbc2*tc)
  for (var i=0; i<nbc1;i++) {
    for (var j=0; j<nbc2;j++) {
      if (matricePosition[i][j]==0) {
        ctx1.fillStyle=color1
      }
      else {
        ctx1.fillStyle=color2
      }
      ctx1.fillRect(can1.width/2-nbc2*tc/2+j*tc,can1.height/2-nbc1*tc/2+i*tc,tc,tc)
    }
  }
  grille()
}
function lancer() {
  isPaused=false
  affichage()
}
function affichage(){
  if(!isPaused) {
    suivant()
    requestAnimationFrame(affichage)
  }
}
function pause() {
  isPaused=true
}
