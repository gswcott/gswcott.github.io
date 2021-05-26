let tc=10
let nbsaut=0
let couleur = "green"
window.onload=initialisation

function initialisation() {
  can=document.querySelector("canvas")
  ctx=can.getContext("2d")
  N=can.width/tc
  ctx.fillStyle=couleur
  ctx.fillRect(0,0,can.width,can.height)
  grille()
  matriceDamierCouleur()
  toto=new Balle(can.width/2,can.height/2)
  toto.dessiner()
  p=Math.floor(4*Math.random())
  affichage()
}
function grille() {
  for (var i=1; i<N;i++){
    ctx.beginPath()
    ctx.moveTo(0,i*tc)
    ctx.lineTo(can.width,i*tc)
    ctx.strokeStyle="black"
    ctx.stroke()
  }
  for (var j=1; j<N;j++){
    ctx.beginPath()
    ctx.moveTo(j*tc,0)
    ctx.lineTo(j*tc,can.height)
    ctx.strokeStyle="black"
    ctx.stroke()
  }
}
function matriceDamierCouleur() {
  mPosition=new Array(N)
  for (var i=0; i<N; i++) {
    mPosition[i]=new Array(N)
    for (var j=0; j<N; j++){
      mPosition[i][j]=0
    }
  }
}
function caseCouleur(color,pl,pc) {
  ctx.fillStyle=color
  ctx.fillRect(pc*tc,pl*tc,tc, tc)
}
function Balle(x,y){
  this.x=x
  this.y=y
}
Balle.prototype.dessiner=function () {
  ctx.beginPath()
  ctx.lineWidth="2"
  ctx.arc(this.x,this.y,2,0,2*Math.PI)
  ctx.fillStyle="black"
  ctx.fill()
}
Balle.prototype.caseChangerCouleur=function() {
  var c=Math.floor(this.x/tc)
  var l=Math.floor(this.y/tc)
  if (mPosition[l][c]==0) {
    mPosition[l][c]=1
    caseCouleur("blue",l,c)
  }
  else {
    mPosition[l][c]=0
    caseCouleur("green",l,c)
  }
}
Balle.prototype.miseAJour=function() {
  if (p==0) {
    this.x=this.x-tc
  }
  else if (p==1) {
    this.y=this.y-tc
  }
  else if(p==2){
    this.x=this.x+tc
  }
  else {
    this.y=this.y+tc
  }
  var c=Math.floor(this.x/tc)
  var l=Math.floor(this.y/tc)
  if (mPosition[l][c]==0) {
    p=(p-1+4)%4
  }
  else {
    p=(p+1)%4
  }
}
function affichage() {
  nbsaut=nbsaut+1
  document.querySelector("p1").innerHTML="Nombre de sauts de la fourmi: " +nbsaut;
  toto.caseChangerCouleur()
  toto.miseAJour()
  if (toto.x>0&&toto.x<can.width&&toto.y>0&&toto.y<can.height){
     toto.dessiner()
     requestAnimationFrame(affichage)
  }
}