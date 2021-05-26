SIZE = 512;
STEP = 128;
NB_OCTAVES = 8;
PERSISTANCE = 0.5;
canW = SIZE;
canH = SIZE;
maxRows = 0;
maxCols = 0;
noiseValues = [];
colorBuffer = [];

//t = 0
window.onload=initialisation
function initialisation(){
    can = document.getElementById("can");
    can.width = SIZE;
    can.height = SIZE;
    ctx = can.getContext("2d");
    maxRows = Math.ceil(SIZE*Math.pow(2, NB_OCTAVES-1)/STEP); 
    maxCols = Math.ceil(SIZE*Math.pow(2, NB_OCTAVES-1)/STEP); 
    initNoisevalues();
    getColorBuffer();
    drawWood();
}

/*
function gameLoop(){
    //t +=1;
    getColorBuffer();
    drawWood();
    requestAnimationFrame(gameLoop); 
}
*/
function initNoisevalues(){
    for(let i = 0; i < maxRows ; i++){
        noiseValues[i] = []; 
        for(let j = 0; j < maxCols; j++){
            noiseValues[i][j]=Math.random(); 
        }
    }
}

function getColorBuffer(){
    for(let y = 0; y < SIZE; y++){
        colorBuffer[y] = [];
        for(let x = 0; x< SIZE; x++){
            //colorBuffer[y][x] = getColorWood(x+getColorWood(y,10*t)[0]*0.1,y); 
            colorBuffer[y][x] = getColorWood(x, y); 
        }
    }
}
function drawWood(){
    for(let y = 0; y < SIZE; y++){
        for(let x = 0; x< SIZE; x++){
            let color = colorBuffer[y][x]; 
            ctx.fillStyle="rgb("+ color[0] + ", " + color[1] + ", " + color[2] + ")"
            ctx.fillRect(x, y, 1, 1); 
        }
    }
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

function getColorWood(x, y){
    let c1 = [0.6, 0.6, 0.0]; // brun clair; 
    let c2 = [0.3, 0.3, 0.0]; // brun foncé; 
    let threshold = 0.1; 
    let noiseValue = coherent_noise2d(x, y) % threshold; 
    if(noiseValue > threshold / 2) {
        noiseValue = threshold - noiseValue; 
    }
    let t = noiseValue/(threshold/2); 
    let colorR = Math.floor(255*interpolation_cos1d(c1[0], c2[0], t)); 
    let colorG = Math.floor(255*interpolation_cos1d(c1[1], c2[1], t)); 
    let colorB = Math.floor(255*interpolation_cos1d(c1[2], c2[2], t)); 
    return [colorR, colorG, colorB]; 
}

