export class Quad{
    constructor(x, y, w, h){
        this.x = x; 
        this.y = y; 
        this.w = w - 0.1; //Pour éviter le "edge bleeding"
        this.h = h - 0.1; 
    }
}
const getLetterQuads = (tsW, tsH, w, h) => {
    let quads = {}; 
    for(let i=0; i<=9; i++){
        let quad = new Quad(i * tsW, tsH, w, h); 
        quads[i.toString()] = quad;
    }
    quads[" "] = new Quad(0, 0, w, h); 
    quads[":"] = new Quad(10 * tsW, tsH, w, h); 
    const alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", 
                        "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
                        "W", "X", "Y","Z"]; 
    for(let i=0; i<26; i++){
        let quad;
        if(i<15){
            quad = new Quad((i+1) * tsW, 2 * tsH, w, h); 
        }else if(i<26){
            quad = new Quad((i-15) * tsW, 3 * tsH, w, h); 
        }
        quads[alphabets[i]] = quad; 
    }
    return quads;
}

const letterQuads = getLetterQuads(12, 13, 12, 13); 
const letterQuads_blue = getLetterQuads(14, 18, 14, 16); 

export const randomInt = (nb) => {
    return Math.floor(Math.random()*(nb))
}

export const convertRGB = (colorArray) => {
    const res = "rgb(+" + colorArray[0]+", " + colorArray[1] + ", " + colorArray[2]+")";
    return res;
}
export const convertRGBA = (colorArray) =>{
    return `rgba(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]}, ${colorArray[3]})`; 
  }
  
export const getRandomColor = () => {
    const lst = [Math.random()*255, Math.random()*255, Math.random()*255, 1]; 
    return lst; 
}

export const lerp = (a,b,t) =>{
    return (1 - t) * a + t * b;
}

export const whiten = (color,t) =>{
    return [lerp(color[0], 255, t), lerp(color[1], 255, t), lerp(color[2], 255, t), color[3]];
}

export const coordToPos = (x, y, csW, csH) => {
    const r = Math.floor(y / csH);
    const c = Math.floor(x / csW);
    return {r: r, c: c};
}

export const isRCValid = (r, c, nbRows, nbCols) => {
    if (r >= 0 && r < nbRows && c >= 0 && c < nbCols){
        return true;
    }
    return false;
}

export const isRCValidFourDirs = (r, c, r0, c0) => {
    if((r === r0 - 1 && c === c0) || (r === r0 + 1 && c === c0) || (r === r0 && c === c0) || (r === r0  && c === c0 - 1) || (r === r0 && c === c0 + 1)){
        return true;
    }
    return false; 
}

export const isInButton = (x, y, button) => {
    if(x >= button.x && x <= button.x + button.w && y >= button.y  && y <= button.y + button.h){
        return true; 
    }
    return false; 
}


export const drawText = (ctx, text, align, color, font, x, y, w, h) => {
    ctx.font = font;
    ctx.fillStyle = convertRGB(color);
    const textW = ctx.measureText(text).width;
    const textH = ctx.measureText("M").width;
    let x0 = x; 
    let y0 = y + (h + textH) / 2;
    if(align === "CENTER"){
        x0 = x + (w - textW) / 2;
    }
    ctx.fillText(text, x0, y0);
}


export const drawScore = (ctx, imgFont, totalScore, startX, startY, endX, endY, scale) =>{
    const gapAfterScore = 10; 
    const scoreText = "SCORE"; 
    const quad = letterQuads_blue["A"]; 
    let maxWidth = ((scoreText.length + 12) * quad.w) * scale + gapAfterScore ; 
    if(maxWidth > (endX - startX)){
        scale = (endX - startX - gapAfterScore) /((scoreText.length + 12) * quad.w); 
    }
    let x = startX; 
    let y = startY;  
    totalScore = totalScore.toString(); 
    for(let i = 0; i < scoreText.length; i++){
        const quad = letterQuads_blue[scoreText[i]]; 
        if(i !== 0){
            x += quad.w * scale; 
        }
        y = Math.floor((startY + endY) / 2 - quad.h * scale / 2);
        ctx.drawImage(imgFont, quad.x, quad.y, quad.w, quad.h, x, y, quad.w * scale, quad.h * scale); 
    }
    x += gapAfterScore; 
    for(let i = 0; i < totalScore.length; i++){
        const quad = letterQuads_blue[totalScore[i]];
        x += quad.w * scale; 
        y = Math.floor((startY + endY) / 2 - quad.h * scale / 2);
        ctx.drawImage(imgFont, quad.x, quad.y, quad.w, quad.h, x, y, quad.w * scale, quad.h * scale); 
    }
    return scale; 
}

export const drawTitle = (ctx, text, imgFont, startX, startY, endX, endY, scale) =>{
    const nbLetters = text.length; 
    const quad = letterQuads["A"]; 
    const gap = quad.w / 5; 
    let maxWidth = (nbLetters * (gap + quad.w) - gap) * scale; 
    if(maxWidth > (endX - startX)* 0.8){
        scale = (endX - startX) * 0.8 / (nbLetters * (gap + quad.w) - gap); 
        maxWidth = (nbLetters * (gap + quad.w) - gap) * scale; 
    }
    const x = (startX + endX) / 2; 
    const y = (startY + endY) / 2; 
    for(let i = 0; i < nbLetters; i++){
        const quad = letterQuads[text[i]]; 
        const dx = x - maxWidth / 2 + i * (gap + quad.w) * scale;
        const dy = y - quad.h * scale / 2; 
        ctx.drawImage(imgFont, quad.x, quad.y, quad.w, quad.h, dx, dy, Math.floor(quad.w*scale) + 1, Math.floor(quad.h*scale) + 1); 
    }
    return scale; 
}


// export class Sprite{
//     constructor(x, y, id, status, vy, targetY, bombTime){
//         this.x = x;
//         this.y = y; 
//         this.id = id;
//         this.status = status; 
//         this.vx = 0;
//         this.vy = vy;
//         this.targetX = this.x;
//         this.targetY = targetY;
//         this.animationSpeed = 1; 
//         this.animationTimer = this.animationSpeed - Math.random();
//         this.frameIndex = 0; 
//         this.quads = []; 
//         this.bomb = false; 
//         this.bombMaxTime = bombTime; 
//         this.bombTimer = bombTime;
//         this.checked = false; 
//     }
// }


export class Button {
    constructor(img, text, x, y, w, h, scale, bgColor){
        this.img = img;
        this.text = text;
        this.x = x;
        this.y = y;
        this.w = w; 
        this.h = h;
        this.scale = scale; 
        this.bgColor = bgColor; 
    }
    draw(ctx){
        ctx.fillStyle = convertRGBA(this.bgColor);
        ctx.fillRect(this.x, this.y, this.w, this.h);
        drawTitle(ctx, this.text, this.img, this.x, this.y+20*Math.sin(Date.now()/200), this.x + this.w, this.y + this.h, this.scale);
    }
}

export class ImgButton{
    constructor(img, x, y, scale){
        this.img = img;
        this.x = x;
        this.y = y;
        this.w = img.width * scale; 
        this.h = img.height * scale; 
        this.scale = scale; 
    }
    draw(ctx){
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h); 
    }
}

export class Explosion {
    constructor(maxLife, x0, y0, dirX, dirY, path, nbParticles){
        this.maxLife = maxLife;
        this.life = maxLife; 
        this.x0 = x0; 
        this.y0 = y0; 
        this.dirX = dirX; 
        this.dirY = dirY;
        this.path = path; 
        this.nbParticles = nbParticles;
    }
}


export class Camera {
    constructor(){
        this.x = 0; 
        this.y = 0;
    }
    update(){
        this.x *= -0.7; 
        this.y *= -0.7; 
        if(Math.abs(this.x)<0.01){
            this.x = 0; 
        }
        if(Math.abs(this.y)<0.01){
            this.y = 0; 
        }
    }
    shake(){
        this.x = 7; 
        this.y = 4;
    }
}

export class Bezier{
    constructor(x0, y0, x1, y1, x2, y2){
        this.xstart = x0; 
        this.ystart = y0; 
        this.xmid = x1; 
        this.ymid = y1; 
        this.xend = x2; 
        this.yend = y2; 
    }
    getX(t){
        return lerp(lerp(this.xstart, this.xmid, t), lerp(this.xmid, this.xend, t), t); 
    }
    getY(t){
        return lerp(lerp(this.ystart, this.ymid, t), lerp(this.ymid, this.yend, t), t); 
    }
}

// export class Scoring {
//     constructor(score, maxLife, path){
//         this.score = score;
//         this.maxLife = maxLife;
//         this.life = maxLife; 
//         this.path = path; 
//     }
// }


export class Scoring {
    constructor(x, y, score){
        this.x = x; 
        this.y = y; 
        this.score = score;
    }
}

export const renderQuad = (r, c, w, h, gap) => {
    const quad = {};
    quad.x = c * 21 + gap;
    quad.y = r * h;
    quad.w = w;
    quad.h = h;
    return quad;
}

export class Ball {
    constructor(id, x, y, r, active){
        this.id = id; 
        this.x = x; 
        this.y = y;
        this.r = r;
        this.vx = 0; 
        this.vy = 0;
        this.score = 0; 
        this.status = "idle"; 
        this.active = active;
        this.notFallingChecked = false; 
        this.checked = false; 
        this.frameIndex = 0;
        this.animationSpeed = 0.3; 
        this.animationTimer = this.animationSpeed * (1 - Math.random());
        this.quads = []; 
        let gap = 3; 
        this.quads.push(renderQuad(0, 0, 16, 16, gap)); 
        this.quads.push(renderQuad(0, 2, 16, 16, gap)); 
        this.bubbleQuad = new Quad(70, 70, 372, 372); 
        this.bubbleFrameIndex = 0; 
        this.bubbleAnimationSpeed = 0.08; 
        this.bubbleAnimationTimer = this.bubbleAnimationSpeed; 
    }
    draw(ctx, imgA, imgB, color){
        const quad = this.quads[this.frameIndex];
        if(this.bubbleFrameIndex === 0){
            ctx.beginPath(); 
            ctx.fillStyle = convertRGBA(color); 
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI); 
            ctx.fill(); 
        }
        if(imgA){
            ctx.drawImage(imgA, quad.x, quad.y, quad.w, quad.h, this.x - this.r / 2 , this.y - this.r / 2, this.r, this.r);
        }
        if(this.bubbleFrameIndex === 0){
            ctx.drawImage(imgB, this.x - this.r, this.y - this.r, 2 * this.r, 2 * this.r);
        }else{
            ctx.drawImage(imgB, this.bubbleQuad.x, this.bubbleQuad.y, this.bubbleQuad.w, this.bubbleQuad.h, this.x - this.r, this.y - this.r, 2 * this.r, 2 * this.r);
        }
        if(!this.active){
            ctx.beginPath(); 
            ctx.fillStyle = convertRGBA([200, 200, 200, 0.7]); 
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI); 
            ctx.fill(); 
        }
    }
}
export class RowBalls {
    constructor(y, indent){
        this.y = y; 
        this.indent = indent; 
        this.balls = [];
    }
    addBall(ball){
        this.balls.push(ball); 
    }
    removeBall(ball){
        this.balls.splice(this.balls.indexOf(ball), 1);
    }
}

export class VirtualScreen{
    constructor(ctx, vW, vH, dW, dH){
        this.ctx = ctx; 
        this.vW = vW; 
        this.vH = vH; 
        this.dW = dW; 
        this.dH = dH; 
        this.xoffset = 0; 
        this.yoffset = 0; 
        this.xScale = 1; 
        this.yScale = 1; 
        this.mouseClick = false; 
        this.mouseX = 0; 
        this.mouseY = 0;
    }
    setStrategy(){
        if(this.dH / this.dW  > this.vH / this.vW){
            this.xScale = this.dW / this.vW; 
            this.yScale = this.xScale; 
            this.yoffset = (this.dH - this.yScale * this.vH)/2; 
        }else {
            this.yScale = this.dH / this.vH; 
            this.xScale = this.yScale; 
            this.xoffset = (this.dW - this.xScale * this.vW)/2; 
        }
    }
    transform(){
        this.ctx.translate(this.xoffset, this.yoffset); 
        this.ctx.scale(this.xScale, this.yScale); 
    }
}

export const distPoints = (x1, y1, x2, y2) =>{
    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}

export const collide = (b1, b2) => {
    let dist = distPoints(b1.x, b1.y, b2.x, b2.y); 
    if (dist <= (b1.r + b2.r) * (b1.r + b2.r)){
        return true; 
    }
    return false;
}

export const debugConsole = (text) => {
    //console.log(text); 
}