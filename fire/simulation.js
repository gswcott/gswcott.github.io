canW=100
canH=100
scale = 2
buffer=[]
coolingMap=[]
scrollUp = 0
nbBottomRows = 10

window.onload=initialisation
function initialisation(){
    can=document.getElementById("can")
    can.width=canW*scale
    can.height=canH*scale
    ctx=can.getContext("2d")
    initBuffers(nbBottomRows)
    cool()
    gameLoop()
}

function initBuffers(nb){
    for(let y=0; y<canH; y++){
        buffer[y] = []
        for(let x=0; x<canW; x++){
            if(y>=canH-nb ){
                buffer[y][x]=[255, 165, 0]
            }else{
                buffer[y][x]=[0, 0, 0]
            }
        }
    }  
}

function getValueTable(table, r, c){
    if (r<0 || r>table.length-1 || c<0 || c>table[0].length-1){
        return [0, 0, 0]
    }else{
        return table[r][c]
    }
}

/* ca donne un effet différent
function getValueTable(table, r, c){
    if (r<0 && c>=0 && c<=table[0].length-1){
        return table[0][c]
    }else if(r>table.length-1 && c>=0 && c<=table[0].length-1){
        return table[table.length-1][c]
    }else if (r>=0 && r<=table.length-1 && c<0){
        return table[r][0]
    }else if (r>=0 && r<=table.length-1 && c>table[0].length-1){
        return table[r][table[0].length-1]
    }else if(r>=0 && r<=table.length-1 && c>=0 && c<=table[0].length-1){
        return table[r][c]
    }else{
        return [0, 0, 0]
    }
}
*/



function cool(){
    //scrollUp++
    for(let y=0; y<canH; y++){
        coolingMap[y]=[]
        for(let x=0; x<canW; x++){
            let c = Math.floor(20*fractal2d(x/25,(y)/25,12))
            coolingMap[y][x]=[c, c, c]
        }
    }
}

function update(){
    scrollUp++
    for(let y=0; y<canH-1; y++){
        for(let x=0; x<canW; x++){
            let color1 = getValueTable(buffer, y-1, x)
            let color2 = getValueTable(buffer, y, x-1) 
            let color3 = getValueTable(buffer, y, x+1) 
            let color4 = getValueTable(buffer, y+1, x) 
            let newColor=calculate4Add(color1, color2, color3, color4)
            newColor = calculateSub(newColor, getValueTable(coolingMap, (y+scrollUp)%canH, x))
            if (y-1>=0){
                buffer[y-1][x] = newColor; 
            }
        }
    }  
} 

function calculate4Add(c1, c2, c3, c4){
    let newColor=[]
    for(let i=0; i<3; i++){
        newColor[i]=Math.floor((c1[i]+c2[i]+c3[i]+c4[i])/4)
    }
    return newColor
}

function calculateSub(c1, c2){
    let newColor=[]
    for(let i=0; i<3; i++){
        newColor[i] = c1[i] - c2[i]
        if(newColor[i] < 0){
            newColor[i] = 0
        }
    }
    return newColor
}


/**
 * VALUE NOISE, FROM https://codepen.io/_bm/pen/EXEPpO
 * 
 */
var seed = 30;


//Returns fractional component
function fract(i) {
    return i - Math.floor(i);
  }
  
  //Linear interpolation
  function lerp(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
  }
  
  //Hash functions
  function hash2d(x, y) {
    x = 50 * fract(x * 0.3183099 + 0.71);
    y = 50 * fract(y * 0.3183099 + 0.113);
    return fract(1.375986 * seed + x * y * (x + y));
  }

  
  //Noise functions
  function noise2d(x, y) {
    let ix = Math.floor(x);
    let iy = Math.floor(y);
    let fx = fract(x);
    let fy = fract(y);
    let ux = fx * fx * (3 - 2 * fx);
    return lerp(
      lerp(hash2d(ix, iy), hash2d(ix + 1, iy), ux),
      lerp(hash2d(ix, iy + 1), hash2d(ix + 1, iy + 1), ux),
      fy * fy * (3 - 2 * fy)
    );
  }


  function fractal2d(x, y, octaves) {
    var val = 0;
    for (let i = 0; i < octaves; i++) {
      val += noise2d(x, y) / Math.pow(2, 0.5 + i - 0.5 * i);
      x -= i * 19;
      y += i * 7;
      x *= 1.5;
      y *= 1.5;
    }
    return val/5;
  }

  /**
   * 
   * END OF VALUE NOISE 
   */


function drawBuffer(){
    for(let y=0; y<canH; y++){
        for(let x=0; x<canW; x++){
            let color = buffer[y][x]
            ctx.fillStyle="rgb("+ color[0] + ", " + color[1] + ", "+ color[2] + ")"
            ctx.fillRect(x, y, 1, 1)
        }
    }
}

function draw(){
    ctx.fillStyle="rgb(0, 0, 0)"
    ctx.fillRect(0, 0, canW, canH)
    drawBuffer()
}

function gameLoop(){
    //cool()
    update()
    ctx.save()
    ctx.scale(scale,scale)
    draw()
   /* for(let x=0;x<can.width;x++){
        for(let y=0;y<can.height;y++){
            let c = Math.floor(255*fractal2d(x/25,y/25,12))
            ctx.fillStyle=`rgb(${c},${c},${c})`
            ctx.fillRect(x,y,1,1)
        }
    }*/
    ctx.restore()
    requestAnimationFrame(gameLoop)
}