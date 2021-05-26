const p=0.7;
const nbLines=30;
const nbCols=30;
const colors={1:'green', 2: 'red',3:'black'};
let matrixCode = [];
let paused=true;
window.onload = function() {
    can=document.querySelector("canvas");
    tileW=Math.floor(can.width/nbCols);
    tileH=Math.floor(can.height/nbLines);
    ctx=can.getContext("2d");
    loadImage(); 
}

function loadImage(){
    ts = new Image(); 
    ts.src = "ts.png"; 
    tsQuad = renderQuad(5, 6, 16, 16); 
    ts.onload = function(){
        initializeForest();
        document.getElementById('b1').onclick=function(){paused=true;initializeForest();};
        document.getElementById('b2').onclick=function(){ suivant();};
        document.getElementById('b3').onclick=function(){paused=false;loop();};
    }
}
function renderQuad(r, c, w, h){
    const quad = {};
    quad.x = c*w;
    quad.y = r*h;
    quad.w = 2*w;
    quad.h = 2*h;
    return quad;
}

function initializeMatrix(){
    for(var i=0; i<nbLines; i++) {
        matrixCode[i] =[];
        for(var j=0; j<nbCols; j++) {
            if (Math.random()<=0.01) {
                set(i,j,2);
            }else {
                set(i,j,1);
            }
        }
    }
}
function set(i,j,code) {
    if(i>=0 && i<nbLines && j>=0 && j<nbCols){
        matrixCode[i][j]=code;
    }
}
function ij2xy(i,j){
    return {x:j*tileW,y:i*tileH};
}
function xy2ij(x,y){
    return {i:y/tileH,j:x/tileW};
}
function get(i,j) {
    return (i>=0 && i<nbLines && j>=0 && j<nbCols) ? matrixCode[i][j] : 1;
}
function drawTile(i,j,code){
    ctx.lineWidth="2";
    ctx.strokeStyle="rgb(100, 100, 100)"; 
    const coords=ij2xy(i,j);
    ctx.fillStyle=colors[code];
    if(code==1){
        ctx.drawImage(ts, tsQuad.x, tsQuad.y, tsQuad.w, tsQuad.h, coords.x+2, coords.y+2, tileW-4, tileH-4);
    }else{
        ctx.fillRect(coords.x, coords.y, tileW, tileH);
    }
}

function drawLineH(i){
    ctx.beginPath();
    ctx.moveTo(ij2xy(i,0).x,ij2xy(i,0).y);
    ctx.lineTo(ij2xy(i,nbCols).x,ij2xy(i,nbCols).y);
    ctx.stroke();
}
function drawLineV(j){
    ctx.beginPath();
    ctx.moveTo(ij2xy(0,j).x,ij2xy(0,j).y);
    ctx.lineTo(ij2xy(nbLines,j).x,ij2xy(nbLines,j).y);
    ctx.stroke();
}
function draw() {
    ctx.clearRect(0, 0, can.width, can.height);
    for(var i=0; i<nbLines; i++) {
        for(var j=0; j<nbCols; j++) {
            drawTile(i,j,get(i,j));
        }
    }
    for(var i=0; i<=nbLines; i++) {
        drawLineH(i);
    }
    for(var j=0; j<=nbCols; j++) {
        drawLineV(j);
    }
}
function simulation(vI,vJ,i,j) {
    if (get(i,j)!=-1 && get(vI,vJ)==2 && Math.random()<p) {
        set(i,j,-1);
    }
}
function update() {
    for(var i=0; i<nbLines; i++) {
        for(var j=0; j<nbCols; j++) {
            if (get(i,j)==1) {
                simulation(i-1,j,i,j);
                simulation(i,j+1,i,j);
                simulation(i+1,j,i,j);
                simulation(i,j-1,i,j);
            }
        }
    }
    for(var i=0; i<nbLines; i++) {
        for(var j=0; j<nbCols; j++) {
            if (get(i,j)==2) {
                set(i,j,3);
            }
            if (get(i,j)==-1){
                set(i,j,2);
            }
        }
    }
}
function initializeForest(){
    initializeMatrix();
    draw();
}
function suivant() {
    update();
    draw();
}
function loop() {
    if(!paused){
        update();
        draw();
        setTimeout(loop,500);
    }
}
