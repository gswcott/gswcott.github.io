SIZE = 512;
STEP = 128;
NB_OCTAVES = 8;
PERSISTANCE = 0.5;
CELL_SIZE = 20; 
nbRows = Math.floor(SIZE/CELL_SIZE);
nbCols = Math.floor(SIZE/CELL_SIZE);
maxRows = 0;
maxCols = 0;
t=0
noiseValues = [];
window.onload=initialisation
function initialisation(){
    can = document.getElementById("can");
    can.width = SIZE;
    can.height = SIZE;
    ctx = can.getContext("2d");
    maxRows = Math.ceil(SIZE*Math.pow(2, NB_OCTAVES-1)/STEP); 
    maxCols = Math.ceil(SIZE*Math.pow(2, NB_OCTAVES-1)/STEP); 
    initNoisevalues();
    gameLoop();
}


function initNoisevalues(){
    for(let i = 0; i < maxRows ; i++){
        noiseValues[i] = []; 
        for(let j = 0; j < maxCols; j++){
            noiseValues[i][j]=Math.random(); 
        }
    }
}


function draw(){
    ctx.fillStyle="white"
    ctx.fillRect(0, 0, SIZE, SIZE); 
    ctx.strokeStyle="black"
    t=t+0.1
    for(let r = 1; r < nbRows; r++){
        for(let c = 1; c< nbCols; c++){
            let angle = coherent_noise2d(r*CELL_SIZE+t,c*CELL_SIZE+t)*2*Math.PI
            ctx.beginPath()
            ctx.moveTo(r*CELL_SIZE, c*CELL_SIZE)
            ctx.lineTo(r*CELL_SIZE+Math.cos(angle)*CELL_SIZE, c*CELL_SIZE + Math.sin(angle)*CELL_SIZE); 
            ctx.stroke(); 
        }
    }
}

function gameLoop(){
    draw()
    requestAnimationFrame(gameLoop)
}



//interpolation
function interpolation_cos1d(a, b, x){
    let t = (1- Math.cos(x * Math.PI))/2; 
    return a * (1 - t) + b * t; 
} 

function  interpolation_cos2d(a, b, c, d, x, y) {
    let x1 = interpolation_cos1d(a, b, x); 
    let x2 = interpolation_cos1d(c, d, x); 
    return interpolation_cos1d(x1, x2, y);
}

function noise2d(x, y){
    let i = Math.floor(y / STEP); 
    let j = Math.floor(x / STEP); 
    let fracI = y / STEP - i; 
    let fracJ = x / STEP - j; 
    if(i<maxRows-1 && j< maxCols-1){
        return interpolation_cos2d(noiseValues[i][j], noiseValues[i][j+1], noiseValues[i+1][j], noiseValues[i+1][j+1], fracJ, fracI); 
    }
    return 0; 
}

function coherent_noise2d(x, y){
    let sum = 0; 
    let p = 1; 
    let f = 1; 
    for(let i = 0; i < NB_OCTAVES; i++){
        sum += p * noise2d(x * f, y * f); 
        p *= PERSISTANCE; 
        f *= 2; 
    }
    return sum*(1-PERSISTANCE)/(1-p); 
}