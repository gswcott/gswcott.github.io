window.onload=initialisation
function initialisation(){
  drawing = false
  erasing = false
  drawBtn=document.getElementById('drawBtn')
  eraseBtn=document.getElementById('eraseBtn')
  trashBtn=document.getElementById('trashBtn')
  can1=document.querySelector("canvas")
  ctx1=can1.getContext("2d");
  ctx1.fillStyle="black";
  ctx1.fillRect(0,0,can1.width,can1.height)
  ctx1.lineWidth=2
  ctx1.strokeStyle="green"
  nbLines=28
  nbCols=28
  tileW=can1.width/nbCols
  tileH=can1.height/nbLines
  color1="white"
  color2="black"
  mP0()
  document.addEventListener("mousedown",mouseDown)
  document.addEventListener("mouseup",mouseUp)
  document.addEventListener("mousemove",mouseMove)
  document.getElementById('trashBtn').onclick=initialize
}
function mP0(){
  matricePosition=new Array()
  for (let i=0; i<nbLines;i++) {
      matricePosition[i]=new Array()
      for (let j=0; j<nbCols;j++) {
        matricePosition[i][j]=0
      }
    }
}
function mouseDown(e){
  if(drawBtn.checked){
    drawing = true
    erasing = false
  }
  if(eraseBtn.checked){
    erasing = true
    drawing = false
  }
}
function mouseUp(e){
  drawing = false
  erasing = false
  recognize()
}
function mouseMove(e) {
  //console.log(e.clientX+" "+e.clientY)
  rect=can1.getBoundingClientRect()
  var souris_x=e.clientX-rect.left
  var souris_y=e.clientY-rect.top
  var j=Math.floor(souris_x/tileW)
  var i=Math.floor(souris_y/tileH)
  if (i>=0 && i<nbLines && j>=0 && j<nbCols) {
    if (drawing) {
      matricePosition[i][j]=255
      ctx1.fillStyle=color1
      ctx1.fillRect(j*tileW, i*tileH,tileW,tileH)
    }
    if (erasing) {
      matricePosition[i][j]=0
      ctx1.fillStyle=color2
      ctx1.fillRect(j*tileW, i*tileH,tileW,tileH)
    }
  }
}
function recognize(){
  let X=[] //pixel values
  for(let i=0; i < matricePosition.length; i++){
    X=X.concat(matricePosition[i])
  }
  //console.log(X)
  tmp=X.map(x=>x==255)
  if(tmp.reduce((x,y)=> x||y)) {
    let lsMax=predictLabel(X)
    let text= "<div style='font-weight: bold'> Predicted value:  </div> <div class='myDiv div1'>" + lsMax[0]+ "</div>" + 
    "<div class='myDiv div2'>" + lsMax[1]+ "</div>" 
    + "<div class='myDiv div3'>" + lsMax[2]+ "</div>"
    document.querySelector(".valuesDiv").innerHTML=text
  }
}
function initialize(){
  document.querySelector(".valuesDiv").innerHTML=""
  mP0()
  drawing = false 
  erase = false
  ctx1.fillStyle=color2
  ctx1.fillRect(0,0, can1.width, can1.height)
  drawBtn.checked = true
}
